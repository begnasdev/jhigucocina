-- Migration 7: Utility Functions and Views
-- This migration creates helper functions and useful views

-- Create function to get current user's restaurant context
CREATE OR REPLACE FUNCTION get_user_restaurant_context()
RETURNS TABLE(restaurant_id UUID, role VARCHAR(50)) AS $
BEGIN
    RETURN QUERY
    SELECT ur.restaurant_id, ur.role
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    LIMIT 1;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate order status progression
CREATE OR REPLACE FUNCTION validate_order_status_progression(
    old_status order_status,
    new_status order_status
)
RETURNS BOOLEAN AS $$
BEGIN
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
$$ LANGUAGE plpgsql;

-- Create function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals(order_id_param UUID)
RETURNS TABLE(
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    service_charge DECIMAL(10,2),
    total_amount DECIMAL(10,2)
) AS $
DECLARE
    restaurant_tax_rate DECIMAL(5,4);
    restaurant_service_charge DECIMAL(5,4);
    order_subtotal DECIMAL(10,2);
BEGIN
    -- Get restaurant rates
    SELECT r.tax_rate, r.service_charge
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
        order_subtotal * restaurant_tax_rate,
        order_subtotal * restaurant_service_charge,
        order_subtotal * (1 + restaurant_tax_rate + restaurant_service_charge);
END;
$ LANGUAGE plpgsql;

-- Create helpful views
CREATE VIEW active_orders AS
SELECT 
    o.*,
    r.name as restaurant_name,
    t.table_number,
    u.name as customer_name,
    u.email as customer_email
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN tables t ON o.table_id = t.table_id
LEFT JOIN users u ON o.customer_id = u.user_id
WHERE o.status NOT IN ('served', 'cancelled')
AND r.is_active = true;

CREATE VIEW order_summary AS
SELECT 
    o.order_id,
    o.order_number,
    o.status,
    o.total_amount,
    o.order_time,
    r.name as restaurant_name,
    t.table_number,
    u.name as customer_name,
    COUNT(oi.order_item_id) as item_count
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN tables t ON o.table_id = t.table_id
LEFT JOIN users u ON o.customer_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_number, o.status, o.total_amount, o.order_time, r.name, t.table_number, u.name;

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
