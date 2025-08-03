-- Migration 6: Row Level Security (RLS) Policies
-- This migration enables RLS and creates security policies for all tables

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for restaurants
CREATE POLICY "Users can view restaurants they work at" ON restaurants FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles
            WHERE
                user_roles.restaurant_id = restaurants.restaurant_id
                AND user_roles.user_id = auth.uid ()
        )
    );;

-- Create RLS policies for users
CREATE POLICY "Users can view own profile" ON users FOR
SELECT
    USING (user_id = auth.uid ());

CREATE POLICY "Users can view colleagues in same restaurant" ON users FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles ur1
                JOIN user_roles ur2 ON ur1.restaurant_id = ur2.restaurant_id
            WHERE
                ur1.user_id = auth.uid ()
                AND ur2.user_id = users.user_id
                AND ur1.is_active = true
                AND ur2.is_active = true
        )
    );

-- Create RLS policies for user_roles
CREATE POLICY "Users can view roles in their restaurants" ON user_roles FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles ur
            WHERE
                ur.restaurant_id = user_roles.restaurant_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
    );

-- Create RLS policies for tables
CREATE POLICY "Users can view tables in their restaurants" ON tables FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles
            WHERE
                user_roles.restaurant_id = tables.restaurant_id
                AND user_roles.user_id = auth.uid ()
                AND user_roles.is_active = true
        )
    );

-- Create RLS policies for menu_categories
CREATE POLICY "Users can view menu categories in their restaurants" ON menu_categories FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles
            WHERE
                user_roles.restaurant_id = menu_categories.restaurant_id
                AND user_roles.user_id = auth.uid ()
                AND user_roles.is_active = true
        )
    );

-- Create RLS policies for menu_items
CREATE POLICY "Users can view menu items in their restaurants" ON menu_items FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles ur
                JOIN menu_categories mc ON ur.restaurant_id = mc.restaurant_id
            WHERE
                mc.category_id = menu_items.category_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
    );

-- Create RLS policies for orders
CREATE POLICY "Users can view orders in their restaurants" ON orders FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                user_roles
            WHERE
                user_roles.restaurant_id = orders.restaurant_id
                AND user_roles.user_id = auth.uid ()
                AND user_roles.is_active = true
        )
        OR customer_id = auth.uid ()
    );

-- Create RLS policies for order_items
CREATE POLICY "Users can view order items for accessible orders" ON order_items FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                orders o
                JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
            WHERE
                o.order_id = order_items.order_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
        OR EXISTS (
            SELECT
                1
            FROM
                orders o
            WHERE
                o.order_id = order_items.order_id
                AND o.customer_id = auth.uid ()
        )
    );

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR
SELECT
    USING (user_id = auth.uid ());

-- Create RLS policies for qr_scans
CREATE POLICY "Users can view QR scans in their restaurants" ON qr_scans FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                tables t
                JOIN user_roles ur ON t.restaurant_id = ur.restaurant_id
            WHERE
                t.table_id = qr_scans.table_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
    );

-- Create RLS policies for order_status_history
CREATE POLICY "Users can view order status history for accessible orders" ON order_status_history FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                orders o
                JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
            WHERE
                o.order_id = order_status_history.order_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
        OR EXISTS (
            SELECT
                1
            FROM
                orders o
            WHERE
                o.order_id = order_status_history.order_id
                AND o.customer_id = auth.uid ()
        )
    );

-- Create RLS policies for order_payments
CREATE POLICY "Users can view payments for accessible orders" ON order_payments FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                orders o
                JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
            WHERE
                o.order_id = order_payments.order_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
        OR EXISTS (
            SELECT
                1
            FROM
                orders o
            WHERE
                o.order_id = order_payments.order_id
                AND o.customer_id = auth.uid ()
        )
    );

-- Insert policies for staff members
CREATE POLICY "Staff can insert orders" ON orders FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT
                1
            FROM
                user_roles
            WHERE
                user_roles.restaurant_id = orders.restaurant_id
                AND user_roles.user_id = auth.uid ()
                AND user_roles.is_active = true
        )
    );

CREATE POLICY "Staff can insert order items" ON order_items FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT
                1
            FROM
                orders o
                JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
            WHERE
                o.order_id = order_items.order_id
                AND ur.user_id = auth.uid ()
                AND ur.is_active = true
        )
    );

-- Update policies for staff members
CREATE POLICY "Staff can update orders in their restaurants" ON orders FOR
UPDATE USING (
    EXISTS (
        SELECT
            1
        FROM
            user_roles
        WHERE
            user_roles.restaurant_id = orders.restaurant_id
            AND user_roles.user_id = auth.uid ()
            AND user_roles.is_active = true
    )
);

CREATE POLICY "Staff can update order items in their restaurants" ON order_items FOR
UPDATE USING (
    EXISTS (
        SELECT
            1
        FROM
            orders o
            JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
        WHERE
            o.order_id = order_items.order_id
            AND ur.user_id = auth.uid ()
            AND ur.is_active = true
    )
); 