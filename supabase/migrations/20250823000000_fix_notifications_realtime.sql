-- Fix notifications table for real-time functionality

-- 1. Set replica identity for notifications table (required for real-time)
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- 2. Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 3. Ensure notifications table has proper indexes for real-time performance
CREATE INDEX IF NOT EXISTS idx_notifications_restaurant_id ON notifications(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 4. Grant necessary permissions for realtime
GRANT SELECT ON notifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON notifications TO authenticated;

-- 5. Create a function to cleanup old notifications (optional optimization)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND is_read = true;
END;
$$ LANGUAGE plpgsql;

-- 6. Comment for future reference
COMMENT ON TABLE notifications IS 'User notifications for order updates - optimized for real-time subscriptions';