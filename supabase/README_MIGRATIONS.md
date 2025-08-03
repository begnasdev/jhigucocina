# JhiGu Cocina - Supabase Migrations

This directory contains the database migrations for the JhiGu Cocina restaurant ordering system.

## Migration Structure

The migrations are organized into 8 manageable files:

### 1. `20250101000001_extensions_and_enums.sql`

- Enables necessary PostgreSQL extensions
- Creates custom ENUM types for the system
- **Dependencies**: None

### 2. `20250101000002_core_tables.sql`

- Creates core tables: `restaurants`, `users`, `user_roles`
- Sets up indexes and triggers for core tables
- **Dependencies**: Migration 1

### 3. `20250101000003_tables_and_menu.sql`

- Creates tables for physical tables and menu structure
- Tables: `tables`, `menu_categories`, `menu_items`
- **Dependencies**: Migration 2

### 4. `20250101000004_orders_and_items.sql`

- Creates the core ordering system
- Tables: `orders`, `order_items`
- Includes order calculation triggers and order number generation
- **Dependencies**: Migration 3

### 5. `20250101000005_supporting_tables.sql`

- Creates supporting tables for the system
- Tables: `notifications`, `qr_scans`, `order_status_history`, `order_payments`
- Includes notification triggers
- **Dependencies**: Migration 4

### 6. `20250101000006_rls_policies.sql`

- Enables Row Level Security (RLS) on all tables
- Creates comprehensive security policies
- **Dependencies**: All previous migrations

### 7. `20250101000007_functions_and_views.sql`

- Creates utility functions and helpful views
- Sets up permissions and documentation
- **Dependencies**: All previous migrations

### 8. `20250101000008_sample_data.sql`

- Inserts sample data for testing and demonstration
- Includes restaurant, users, menu items, and sample orders
- **Dependencies**: All previous migrations

## Applying Migrations

### Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:

   ```bash
   supabase login
   ```

3. **Link your project**:

   ```bash
   supabase link --project-ref jlyjosleurozdrtxyqzq
   ```

4. **Apply migrations**:
   ```bash
   supabase db push
   ```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order (1-8)
4. Execute them one by one to ensure proper setup

## Database Schema Overview

### Core Tables

- **restaurants**: Restaurant information and configuration
- **users**: User accounts for customers and staff
- **user_roles**: Role assignments for users in restaurants

### Menu System

- **menu_categories**: Menu categories for organizing items
- **menu_items**: Individual menu items with pricing and details

### Ordering System

- **orders**: Customer orders with status tracking
- **order_items**: Individual items within orders
- **tables**: Physical tables with QR codes for ordering

### Supporting Features

- **notifications**: User notifications for order updates
- **qr_scans**: QR code scan tracking and session management
- **order_status_history**: Audit trail for order status changes
- **order_payments**: Payment processing and tracking

## Security Features

### Row Level Security (RLS)

- All tables have RLS enabled
- Comprehensive policies ensure data isolation between restaurants
- Users can only access data from restaurants they work at
- Customers can only see their own orders and notifications

### Authentication Integration

- Uses Supabase Auth with `auth.uid()` references
- Supports Google OAuth integration
- Role-based access control

## Key Features

### Automatic Calculations

- Order totals are automatically calculated when items are added/modified
- Tax and service charges are applied based on restaurant settings
- Order numbers are automatically generated

### Notifications

- Automatic notifications are sent when order status changes
- Different notification types and priorities
- Support for custom metadata

### QR Code System

- Each table has a unique QR code
- Tracks customer sessions and order creation
- Supports device information and analytics

## Sample Data

The final migration includes:

- 1 sample restaurant (JhiGu Cocina Mexicana)
- 5 sample users (staff and customers)
- 5 sample tables with QR codes
- 6 menu categories
- 18 menu items across all categories
- 2 sample orders with items

## Next Steps

After applying migrations:

1. **Set up Supabase Auth**:

   - Configure authentication providers
   - Set up email templates
   - Configure redirect URLs

2. **Configure your application**:

   - Update environment variables with your Supabase credentials
   - Set up client-side authentication
   - Implement RLS-aware queries

3. **Test the system**:
   - Verify all tables are created correctly
   - Test RLS policies
   - Verify triggers and functions work as expected

## Troubleshooting

### Common Issues

1. **Migration fails due to dependencies**:

   - Ensure migrations are applied in order (1-8)
   - Check that all previous migrations completed successfully

2. **RLS policies blocking access**:

   - Verify user authentication is working
   - Check that users have proper role assignments
   - Review RLS policy logic

3. **Triggers not working**:
   - Ensure the `update_updated_at_column()` function exists
   - Check that triggers are properly attached to tables

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Review PostgreSQL documentation for specific SQL features
- Check the Supabase community forum for common issues
