-- Migration 7: Utility Functions and Views
-- This migration creates helper functions and useful views

-- Create function to get current user's restaurant context
CREATE OR REPLACE FUNCTION get_user_restaurant_context()
RETURNS TABLE(restaurant_id UUID, role VARCHAR(50)) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    SET search_path = '';
    RETURN QUERY
    SELECT ur.restaurant_id, ur.role
    FROM user_roles ur
    WHERE ur.user_id = (SELECT auth.uid())
    LIMIT 1;
EXCEPTION 
    WHEN NO_DATA_FOUND THEN
        RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR(50);
END;
$$;

-- Create function to validate order status progression
CREATE OR REPLACE FUNCTION validate_order_status_progression(
    old_status order_status,
    new_status order_status
)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    -- Validate input statuses are not null
    IF old_status IS NULL OR new_status IS NULL THEN
        RETURN false;
    END IF;

    -- Define valid status progressions
    RETURN CASE 
        WHEN old_status = 'pending' AND new_status IN ('accepted', 'cancelled') THEN true
        WHEN old_status = 'accepted' AND new_status IN ('preparing', 'cancelled') THEN true
        WHEN old_status = 'preparing' AND new_status IN ('ready', 'cancelled') THEN true
        WHEN old_status = 'ready' AND new_status IN ('served', 'cancelled') THEN true
        WHEN old_status = 'served' THEN false -- Cannot change served status
        WHEN old_status = 'cancelled' THEN false -- Cannot change cancelled status
        ELSE false
    END;
END;
$$;

-- Create function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals(order_id_param UUID)
RETURNS TABLE(
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    service_charge DECIMAL(10,2),
    total_amount DECIMAL(10,2)
) 
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    restaurant_tax_rate DECIMAL(5,4) := 0;
    restaurant_service_charge DECIMAL(5,4) := 0;
    order_subtotal DECIMAL(10,2) := 0;
BEGIN
    -- Validate input
    IF order_id_param IS NULL THEN
        RETURN QUERY 
        SELECT 0::DECIMAL(10,2), 0::DECIMAL(10,2), 0::DECIMAL(10,2), 0::DECIMAL(10,2);
        RETURN;
    END IF;

    -- Get restaurant rates
    SELECT COALESCE(r.tax_rate, 0), COALESCE(r.service_charge, 0)
    INTO restaurant_tax_rate, restaurant_service_charge
    FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.restaurant_id
    WHERE o.order_id = order_id_param;
    
    -- Calculate subtotal
    SELECT COALESCE(SUM(oi.total_price), 0)
    INTO order_subtotal
    FROM order_items oi
    WHERE oi.order_id = order_id_param;
    
    -- Return calculated totals
    RETURN QUERY
    SELECT 
        order_subtotal,
        ROUND(order_subtotal * restaurant_tax_rate, 2),
        ROUND(order_subtotal * restaurant_service_charge, 2),
        ROUND(order_subtotal * (1 + restaurant_tax_rate + restaurant_service_charge), 2);
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Add comments for documentation
COMMENT ON TABLE restaurants IS 'Restaurant information and configuration';
COMMENT ON TABLE users IS 'User accounts for customers and staff';
COMMENT ON TABLE user_roles IS 'Role assignments for users in restaurants';
COMMENT ON TABLE tables IS 'Physical tables with QR codes for ordering';
COMMENT ON TABLE menu_categories IS 'Menu categories for organizing items';
COMMENT ON TABLE menu_items IS 'Individual menu items with pricing and details';
COMMENT ON TABLE orders IS 'Customer orders with status tracking';
COMMENT ON TABLE order_items IS 'Individual items within orders';
COMMENT ON TABLE notifications IS 'User notifications for order updates';
COMMENT ON TABLE qr_scans IS 'QR code scan tracking and session management';
COMMENT ON TABLE order_status_history IS 'Audit trail for order status changes';
COMMENT ON TABLE order_payments IS 'Payment processing and tracking'; 
COMMENT ON TABLE promotions IS 'Stores details of all promotional offers, such as discounts, vouchers, and special deals. Each promotion is linked to a specific restaurant.';
COMMENT ON TABLE applied_promotions IS 'A record of every time a promotion is successfully used in an order. This acts as an audit trail for discounts.';
COMMENT ON TABLE promotion_categories IS 'Links promotions to specific menu categories, allowing for targeted deals like "50% off all desserts."';
COMMENT ON TABLE diet_type IS 'Stores various dietary classifications, such as "Vegan," "Gluten-Free," or "Vegetarian."';
COMMENT ON TABLE menu_item_diet_types IS 'Links menu items to dietary types, indicating which dietary classifications apply to each item.';
COMMENT ON TABLE menu_item_categories IS 'Links menu items to menu categories, allowing a single item to appear in multiple categories (e.g., "Appetizers" and "Featured'').';
COMMENT ON TABLE carts IS 'Shopping carts for users and guest sessions.';
COMMENT ON TABLE cart_items IS 'Individual items within a shopping cart.';
