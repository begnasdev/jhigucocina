-- Create orders table
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(user_id),
    table_id UUID REFERENCES tables(table_id),
    restaurant_id UUID REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    service_charge DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    calculated_total DECIMAL(10,2) DEFAULT 0.00,
    special_instructions TEXT,
    order_time TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    served_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    kitchen_cutoff_time TIMESTAMPTZ,
    estimated_prep_time INTEGER, -- minutes
    actual_prep_time INTEGER, -- minutes
    max_prep_time INTEGER DEFAULT 60, -- minutes
    cancellation_deadline TIMESTAMPTZ,
    processed_by UUID REFERENCES users(user_id),
    is_total_validated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    item_id UUID REFERENCES menu_items(item_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    customizations JSONB,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for orders and order items
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);

CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_order_time ON orders(order_time);
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item_id ON order_items(item_id);

-- Apply updated_at triggers
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create order total calculation trigger
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Update order totals when order items change
    UPDATE orders 
    SET 
        subtotal = (
            SELECT COALESCE(SUM(total_price), 0)
            FROM order_items 
            WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
        ),
        updated_at = NOW()
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply total calculation triggers
CREATE TRIGGER trigger_calculate_order_total_after_insert AFTER INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION calculate_order_total();
CREATE TRIGGER trigger_calculate_order_total_after_update AFTER UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION calculate_order_total();
CREATE TRIGGER trigger_calculate_order_total_after_delete AFTER DELETE ON order_items FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- Create order number generation trigger
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || EXTRACT(YEAR FROM NOW()) || 
                           LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') ||
                           LPAD(EXTRACT(DAY FROM NOW())::TEXT, 2, '0') || '-' ||
                           LPAD(NEW.order_id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply order number generation trigger
CREATE TRIGGER trigger_generate_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number(); 
