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
    );

;

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
            SELECT 1
            FROM user_roles ur
            JOIN menu_categories mc ON ur.restaurant_id = mc.restaurant_id
            JOIN menu_item_categories mic ON mc.category_id = mic.category_id
            WHERE mic.menu_item_id = menu_items.item_id
              AND ur.user_id = auth.uid()
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

-- Add RLS policies for diet tables
-- Enable Row Level Security for diet_type and menu_item_diet_types
ALTER TABLE diet_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_diet_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_item_categories table
ALTER TABLE menu_item_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to view menu item categories"
ON menu_item_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow managers and super_admins to manage menu item categories"
ON menu_item_categories
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

-- RLS Policies for diet_type table
CREATE POLICY "Allow all authenticated users to view diet types"
ON diet_type
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow managers and super_admins to insert diet types"
ON diet_type
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

CREATE POLICY "Allow managers and super_admins to update diet types"
ON diet_type
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

CREATE POLICY "Allow managers and super_admins to delete diet types"
ON diet_type
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

-- RLS Policies for menu_item_diet_types table
CREATE POLICY "Allow all authenticated users to view menu item diet types"
ON menu_item_diet_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow managers and super_admins to insert menu item diet types"
ON menu_item_diet_types
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

CREATE POLICY "Allow managers and super_admins to update menu item diet types"
ON menu_item_diet_types
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

CREATE POLICY "Allow managers and super_admins to delete menu item diet types"
ON menu_item_diet_types
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

-- RLS Policies for promotions tables
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applied_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_categories ENABLE ROW LEVEL SECURITY;

-- Policies for promotions table
CREATE POLICY "Allow public view of all promotions"
ON promotions
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Allow managers and super_admins to manage promotions"
ON promotions
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.restaurant_id = promotions.restaurant_id
        AND user_roles.role IN ('manager', 'super_admin')
    )
);

-- Policies for applied_promotions table
CREATE POLICY "Allow staff and customers to view their applied promotions"
ON applied_promotions
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM orders o
        JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
        WHERE o.order_id = applied_promotions.order_id
        AND ur.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.order_id = applied_promotions.order_id
        AND o.customer_id = auth.uid()
    )
);

CREATE POLICY "Allow staff and customers to create applied promotions"
ON applied_promotions
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM orders o
        JOIN user_roles ur ON o.restaurant_id = ur.restaurant_id
        WHERE o.order_id = applied_promotions.order_id
        AND ur.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.order_id = applied_promotions.order_id
        AND o.customer_id = auth.uid()
    )
);

-- Policies for promotion_categories table
CREATE POLICY "Allow public view of all promotion categories"
ON promotion_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow managers and super_admins to manage promotion categories"
ON promotion_categories
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM promotions p
        JOIN user_roles ur ON p.restaurant_id = ur.restaurant_id
        WHERE p.promotion_id = promotion_categories.promotion_id
        AND ur.user_id = auth.uid()
        AND ur.role IN ('manager', 'super_admin')
    )
);
