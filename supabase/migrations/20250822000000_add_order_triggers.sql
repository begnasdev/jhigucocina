-- MIGRATION: 20250822000000_add_order_triggers.sql

-- =================================================================
-- 1. Trigger to log the initial status of a newly created order
-- =================================================================

-- First, create the function that the trigger will execute.
CREATE OR REPLACE FUNCTION public.log_initial_order_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new record into the order_status_history table.
  -- It captures the initial status (e.g., 'pending') from the new order.
  INSERT INTO public.order_status_history (order_id, new_status, old_status, notes)
  VALUES (NEW.order_id, NEW.status, NULL, 'Order created.');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Then, create the trigger itself.
-- This trigger fires AFTER a new row is inserted into the 'orders' table.
CREATE TRIGGER on_order_created_log_initial_status
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.log_initial_order_status();


-- =================================================================
-- 2. Trigger to validate status changes and log them to history
-- =================================================================

-- Create the function to handle the update logic.
CREATE OR REPLACE FUNCTION public.handle_order_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the status is actually being changed to avoid unnecessary processing.
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Call the existing validation function to check if the transition is allowed.
    IF NOT public.validate_order_status_progression(NEW.status, OLD.status) THEN
      -- If the transition is not valid, block the update and raise an error.
      RAISE EXCEPTION 'Invalid order status transition from % to %', OLD.status, NEW.status;
    END IF;

    -- If the transition is valid, log this change to the history table.
    INSERT INTO public.order_status_history (order_id, new_status, old_status, notes)
    VALUES (NEW.order_id, NEW.status, OLD.status, 'Status updated.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger.
-- This fires BEFORE an UPDATE is committed to the 'status' column on the 'orders' table.
CREATE TRIGGER on_order_update_validate_status
BEFORE UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_status_update();


-- =================================================================
-- 3. Trigger to automatically recalculate order totals
-- =================================================================

-- Create the function to handle the recalculation.
CREATE OR REPLACE FUNCTION public.update_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  order_totals RECORD;
BEGIN
  -- Find the order_id that was affected by the change.
  -- COALESCE is used to handle both INSERT/UPDATE (NEW) and DELETE (OLD).
  WITH affected_order AS (
    SELECT COALESCE(NEW.order_id, OLD.order_id) as id
  )
  -- Call the existing calculation function to get the new totals.
  SELECT * INTO order_totals FROM public.calculate_order_totals(
    (SELECT id FROM affected_order)
  );

  -- Update the parent 'orders' table with the newly calculated totals.
  UPDATE public.orders
  SET
    subtotal = order_totals.subtotal,
    tax_amount = order_totals.tax_amount,
    service_charge = order_totals.service_charge,
    total_amount = order_totals.total_amount
  WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);

  RETURN NULL; -- The return value is ignored for AFTER triggers.
END;
$$ LANGUAGE plpgsql;

-- Create the trigger.
-- This fires AFTER any INSERT, UPDATE, or DELETE on the 'order_items' table.
CREATE TRIGGER on_order_items_change_update_totals
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_order_totals();
