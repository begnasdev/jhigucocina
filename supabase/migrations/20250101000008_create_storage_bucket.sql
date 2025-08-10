-- Migration 8: Create Storage Buckets
-- This migration creates storage buckets for various images.

INSERT INTO storage.buckets (id, name, public)
VALUES
    ('menu_items_images', 'menu_items_images', true),
    ('menu_categories_images', 'menu_categories_images', true),
    ('restaurants_images', 'restaurants_images', true)
ON CONFLICT (id) DO NOTHING;
