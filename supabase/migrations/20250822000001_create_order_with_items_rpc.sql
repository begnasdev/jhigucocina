-- MIGRATION: 20250822000001_create_order_with_items_rpc.sql

-- Define the function that will be called from our API (the RPC).
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  order_data jsonb,
  items_data jsonb
)
RETURNS jsonb -- It will return the newly created order with its items as a single JSON object.
AS $$
DECLARE
  new_order_id uuid;
  new_order jsonb;
BEGIN
  -- 1. Insert the main order record from the provided JSON data.
  --    The 'order_number' is generated here, not on the client.
  INSERT INTO public.orders (
    restaurant_id,
    table_id,
    customer_id,
    special_instructions,
    status,
    order_number
  )
  VALUES (
    (order_data->>'restaurant_id')::uuid,
    (order_data->>'table_id')::uuid,
    (order_data->>'customer_id')::uuid,
    order_data->>'special_instructions',
    (order_data->>'status')::public.order_status,
    -- Generate a more robust, time-based order number
    'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) for 6))
  )
  RETURNING order_id INTO new_order_id; -- Get the ID of the order we just created.

  -- 2. Insert all the associated order items from the items_data JSON array.
  --    'jsonb_to_recordset' conveniently turns a JSON array into a set of rows.
  INSERT INTO public.order_items (
    order_id,
    item_id,
    quantity,
    unit_price,
    total_price,
    customizations
  )
  SELECT
    new_order_id, -- Use the ID from the order we just created.
    item.item_id,
    item.quantity,
    item.unit_price,
    item.total_price,
    item.customizations
  FROM jsonb_to_recordset(items_data) AS item(
    item_id uuid,
    quantity integer,
    unit_price numeric,
    total_price numeric,
    customizations jsonb
  );

  -- 3. Fetch and return the complete order with its items.
  --    This uses a subquery to aggregate the items into a JSON array,
  --    ensuring the return shape matches our 'OrderWithItems' type.
  SELECT jsonb_build_object(
    'order_id', o.order_id,
    'created_at', o.created_at,
    'restaurant_id', o.restaurant_id,
    'table_id', o.table_id,
    'customer_id', o.customer_id,
    'status', o.status,
    -- Include all other fields from the 'orders' table
    'order_number', o.order_number,
    'special_instructions', o.special_instructions,
    'subtotal', o.subtotal,
    'tax_amount', o.tax_amount,
    'service_charge', o.service_charge,
    'total_amount', o.total_amount,
    'order_items', (
      SELECT jsonb_agg(i)
      FROM public.order_items i
      WHERE i.order_id = new_order_id
    )
  )
  INTO new_order
  FROM public.orders o
  WHERE o.order_id = new_order_id;

  RETURN new_order;
END;
$$ LANGUAGE plpgsql;
