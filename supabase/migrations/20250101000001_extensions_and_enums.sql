-- Migration 1: Extensions and Custom Types/Enums
-- This migration sets up the foundation for the JhiGuCocina system
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE notification_type AS ENUM (
    'order_placed',
    'order_accepted',
    'order_preparing',
    'order_ready',
    'order_served',
    'order_cancelled',
    'system_alert'
);

CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TYPE order_status AS ENUM (
    'pending',
    'accepted',
    'preparing',
    'ready',
    'served',
    'cancelled'
);

CREATE TYPE payment_method AS ENUM ('cash', 'card', 'digital_wallet', 'other');

CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TYPE roles_enum AS ENUM ('super_admin', 'manager', 'staff', 'customer');

CREATE TYPE table_status AS ENUM (
    'available',
    'occupied',
    'reserved',
    'maintenance',
    'out_of_service'
);

CREATE TYPE order_item_status AS ENUM ('pending', 'preparing', 'ready', 'served');

CREATE TYPE session_status AS ENUM ('active', 'expired', 'completed');
