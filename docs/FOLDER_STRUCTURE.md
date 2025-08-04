# Restaurant Management App - Folder Structure

## Overview

This document outlines the feature-based folder structure for the JhiGuCocina restaurant management application. The structure is designed to hide role information from URLs while maintaining clear separation of concerns and proper access control.

## Root Structure

```
jhigucocina/
├── app/                          # Next.js App Router
├── components/                   # Reusable UI components (ui only)
├── features/                     # Feature-specific components
├── lib/                         # Utility functions and configurations
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── supabase/                    # Database migrations and configurations
├── public/                      # Static assets
├── docs/                        # Documentation
├── middleware.ts                # Route protection and role-based access
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## App Directory Structure

### Authentication Routes

```
app/
├── (auth)/                      # Route group for authentication
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   └── layout.tsx              # Auth layout (no sidebar/navigation)
```

### Main Application Routes

```
app/
├── (dashboard)/                 # Route group for authenticated users
│   ├── dashboard/
│   │   └── page.tsx            # Role-based dashboard (dynamic content)
│   ├── restaurants/
│   │   └── page.tsx            # Restaurant list (Super Admin only)
│   ├── tables/
│   │   └── page.tsx            # Table management (Manager only)
│   ├── menu/
│   │   ├── categories/
│   │   │   └── page.tsx        # Menu categories (Manager only)
│   │   └── items/
│   │       └── page.tsx        # Menu items (Manager only)
│   ├── orders/
│   │   ├── page.tsx            # Orders list (all roles, filtered)
│   │   └── history/
│   │       └── page.tsx        # Order history
│   ├── staff/
│   │   └── page.tsx            # Staff management (Manager only)
│   ├── users/
│   │   └── page.tsx            # User management (Super Admin only)
│   ├── qr-scanner/
│   │   └── page.tsx            # QR scanner (Manager & Staff only)
│   └── layout.tsx              # Dashboard layout (with sidebar/navigation)
├── layout.tsx                   # Root layout
└── page.tsx                     # Landing page
```

## Components Directory Structure

### UI Components

```
components/
└── ui/                          # Base UI components (shadcn/ui style)
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    ├── table.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── form.tsx
    ├── badge.tsx
    ├── avatar.tsx
    ├── toast.tsx
    └── index.ts                 # Export all UI components
```

## Features Directory Structure

### Authentication Components

```
features/
├── auth/                        # Authentication components
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── auth-layout.tsx
│   └── protected-route.tsx
```

### Dashboard Components

```
features/
├── dashboard/                   # Dashboard components
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── header.tsx               # Top header with user info
│   ├── navigation.tsx           # Navigation menu
│   ├── breadcrumb.tsx           # Breadcrumb navigation
│   └── layout.tsx               # Dashboard layout wrapper
```

### Feature-Specific Components

#### Restaurant Management

```
features/
├── restaurants/                 # Restaurant management
│   ├── restaurant-list.tsx
│   ├── restaurant-card.tsx
│   ├── restaurant-form.tsx
│   ├── restaurant-details.tsx
│   └── restaurant-stats.tsx
```

#### Table Management

```
features/
├── tables/                      # Table management
│   ├── table-grid.tsx
│   ├── table-card.tsx
│   ├── table-form.tsx
│   ├── table-status.tsx
│   └── table-qr.tsx
```

#### Menu Management

```
features/
├── menu/                        # Menu management
│   ├── category-list.tsx
│   ├── category-form.tsx
│   ├── item-list.tsx
│   ├── item-card.tsx
│   ├── item-form.tsx
│   ├── menu-display.tsx
│   └── menu-filter.tsx
```

#### Order Management

```
features/
├── orders/                      # Order management
│   ├── order-list.tsx
│   ├── order-card.tsx
│   ├── order-details.tsx
│   ├── order-status.tsx
│   ├── order-timeline.tsx
│   ├── order-actions.tsx
│   └── order-filters.tsx
```

#### Staff Management

```
features/
├── staff/                       # Staff management
│   ├── staff-list.tsx
│   ├── staff-card.tsx
│   ├── staff-form.tsx
│   ├── staff-roles.tsx
│   └── staff-permissions.tsx
```

#### User Management

```
features/
├── users/                       # User management
│   ├── user-list.tsx
│   ├── user-card.tsx
│   ├── user-form.tsx
│   ├── user-roles.tsx
│   └── user-permissions.tsx
```

#### QR Scanner

```
features/
├── qr-scanner/                  # QR scanner
│   ├── scanner.tsx
│   ├── qr-generator.tsx
│   ├── qr-display.tsx
│   └── scanner-overlay.tsx
```

## Lib Directory Structure

```
lib/
├── auth.ts                      # Authentication utilities
├── supabase.ts                  # Supabase client configuration
├── utils.ts                     # General utility functions
├── role-guard.ts                # Role-based access control
├── api.ts                       # API utility functions
├── constants.ts                 # Application constants
├── validations.ts               # Form validation schemas
└── helpers.ts                   # Helper functions
```

## Hooks Directory Structure

```
hooks/
├── use-auth.ts                  # Authentication hook
├── use-role.ts                  # Role management hook
├── use-restaurant.ts            # Restaurant data hook
├── use-orders.ts                # Orders management hook
├── use-menu.ts                  # Menu data hook
├── use-tables.ts                # Tables management hook
├── use-staff.ts                 # Staff management hook
├── use-users.ts                 # User management hook
├── use-qr-scanner.ts            # QR scanner hook
└── use-notifications.ts         # Notifications hook
```

## Types Directory Structure

```
types/
├── auth.ts                      # Authentication types
├── restaurant.ts                # Restaurant-related types
├── order.ts                     # Order-related types
├── menu.ts                      # Menu-related types
├── table.ts                     # Table-related types
├── user.ts                      # User-related types
├── staff.ts                     # Staff-related types
├── api.ts                       # API response types
└── common.ts                    # Common types
```

## URL Structure Examples

### Super Admin URLs

```
/dashboard                      # Super admin dashboard
/restaurants                    # All restaurants list
/users                         # User management
/orders                        # All orders (filtered)
```

### Manager URLs

```
/dashboard                      # Manager dashboard
/tables                         # Restaurant tables
/menu/categories               # Menu categories
/menu/items                    # Menu items
/orders                        # Restaurant orders
/staff                         # Staff management
/qr-scanner                    # QR scanner
```

### Staff URLs

```
/dashboard                      # Staff dashboard
/orders                        # Active orders
/orders/history                # Order history
/qr-scanner                    # QR scanner
```

### Customer URLs

```
/dashboard                      # Customer dashboard
/menu                          # Menu browsing
/orders                        # My orders
/orders/history                # Order history
```

## Key Benefits

1. **Clean URLs**: No role information exposed in URLs
2. **Security**: Role-based access control at the page level
3. **Scalability**: Easy to add new features
4. **Maintainability**: Clear separation of concerns
5. **User Experience**: Intuitive navigation structure
6. **SEO Friendly**: Clean, descriptive URLs

## Access Control Strategy

- **Page Level**: Each page checks user role and redirects if unauthorized
- **Component Level**: Components render based on user permissions
- **API Level**: Server-side validation for all data operations
- **Database Level**: Row Level Security (RLS) policies in Supabase

## File Naming Conventions

- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **Components**: `kebab-case.tsx`
- **Hooks**: `use-*.ts`
- **Types**: `*.ts`
- **Utilities**: `*.ts`

## Route Groups

- `(auth)`: Authentication pages with minimal layout
- `(dashboard)`: Protected pages with full dashboard layout

This structure ensures a clean, secure, and maintainable codebase while providing an excellent user experience across all roles.
