-- Migration 6: Row Level Security (RLS) Policies (DISABLED)
-- This migration previously enabled RLS and created security policies for all tables
-- All RLS policies have been removed to allow unrestricted CRUD operations for anyone

-- RLS has been disabled on all tables to allow unrestricted access
-- Note: This removes all security restrictions and allows any user to perform CRUD operations on all tables