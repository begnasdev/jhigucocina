-- Migration 5: Supporting Tables
-- This migration creates supporting tables for notifications, QR scans, order history, and payments

-- Create notifications table
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    priority notification_priority DEFAULT 'normal',
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create qr_scans table
CREATE TABLE qr_scans (
    scan_id BIGSERIAL PRIMARY KEY,
    table_id BIGINT REFERENCES tables(table_id) ON DELETE CASCADE,
    customer_id BIGINT REFERENCES users(user_id),
    session_id VARCHAR(255) UNIQUE,
    session_status VARCHAR(50) DEFAULT 'active' CHECK (session_status IN ('active', 'expired', 'completed')),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    referrer_url TEXT,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    led_to_order BOOLEAN DEFAULT false,
    is_active_session BOOLEAN DEFAULT true,
    order_id BIGINT REFERENCES orders(order_id)
);

-- Create order_status_history table
CREATE TABLE order_status_history (
    history_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(user_id),
    old_status order_status,
    new_status order_status NOT NULL,
    is_valid_progression BOOLEAN DEFAULT true,
    notes TEXT,
    validation_errors TEXT,
    estimated_time INTEGER, -- minutes
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_payments table
CREATE TABLE order_payments (
    payment_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    amount_paid DECIMAL(10,2) NOT NULL,
    change_given DECIMAL(10,2) DEFAULT 0.00,
    payment_reference TEXT,
    processed_by BIGINT REFERENCES users(user_id),
    payment_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for supporting tables
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX idx_qr_scans_table_id ON qr_scans(table_id);
CREATE INDEX idx_qr_scans_customer_id ON qr_scans(customer_id);
CREATE INDEX idx_qr_scans_session_id ON qr_scans(session_id);
CREATE INDEX idx_qr_scans_scanned_at ON qr_scans(scanned_at);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_updated_at ON order_status_history(updated_at);
CREATE INDEX idx_order_payments_order_id ON order_payments(order_id);
CREATE INDEX idx_order_payments_payment_status ON order_payments(payment_status);

-- Apply updated_at triggers
CREATE TRIGGER update_order_payments_updated_at BEFORE UPDATE ON order_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create notification trigger function
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification when order status changes
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO notifications (user_id, order_id, title, message, type, priority)
        VALUES (
            NEW.customer_id,
            NEW.order_id,
            CASE NEW.status
                WHEN 'accepted' THEN 'Order Accepted'
                WHEN 'preparing' THEN 'Order in Preparation'
                WHEN 'ready' THEN 'Order Ready'
                WHEN 'served' THEN 'Order Served'
                WHEN 'cancelled' THEN 'Order Cancelled'
                ELSE 'Order Status Updated'
            END,
            CASE NEW.status
                WHEN 'accepted' THEN 'Your order has been accepted and is being prepared.'
                WHEN 'preparing' THEN 'Your order is now being prepared in the kitchen.'
                WHEN 'ready' THEN 'Your order is ready! Please collect it.'
                WHEN 'served' THEN 'Your order has been served. Enjoy your meal!'
                WHEN 'cancelled' THEN 'Your order has been cancelled. Please contact staff if you have questions.'
                ELSE 'Your order status has been updated to: ' || NEW.status
            END,
            CASE NEW.status
                WHEN 'accepted' THEN 'order_accepted'
                WHEN 'preparing' THEN 'order_preparing'
                WHEN 'ready' THEN 'order_ready'
                WHEN 'served' THEN 'order_served'
                WHEN 'cancelled' THEN 'order_cancelled'
                ELSE 'system_alert'
            END,
            CASE NEW.status
                WHEN 'ready' THEN 'high'
                WHEN 'cancelled' THEN 'high'
                ELSE 'normal'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply notification trigger to orders table
CREATE TRIGGER trigger_order_notifications AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION create_order_notification(); 