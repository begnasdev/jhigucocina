# JhiGuCocina Database ER Diagram

```mermaid
erDiagram
    RESTAURANTS {
        int restaurant_id PK
        string name
        string address
        string phone
        string email
        text description
        string operating_hours
        string timezone
        decimal tax_rate
        decimal service_charge
        string currency
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    USERS {
        uuid user_id PK
        string name
        string profile_picture
        string phone
        boolean is_active
        datetime last_login
        datetime created_at
        datetime updated_at
    }

    USER_ROLES {
        int user_role_id PK
        uuid user_id FK
        int restaurant_id FK
        string role
        boolean is_active
        datetime assigned_at
        datetime expires_at
        uuid assigned_by FK
    }

    TABLES {
        int table_id PK
        int restaurant_id FK
        string table_number
        string qr_code_data
        string qr_code_url
        int capacity
        string status
        jsonb location_coordinates
        datetime created_at
        datetime updated_at
    }

    MENU_CATEGORIES {
        int category_id PK
        int restaurant_id FK
        string name
        text description
        string image_url
        int sort_order
        boolean is_active
        datetime available_from
        datetime available_until
        datetime created_at
        datetime updated_at
    }

    MENU_ITEMS {
        int item_id PK
        int category_id FK
        string name
        text description
        decimal price
        string image_url
        boolean is_available
        boolean is_featured
        int preparation_time
        text ingredients
        text allergens
        text customization_options
        datetime created_at
        datetime updated_at
    }

    ORDERS {
        int order_id PK
        uuid customer_id FK
        int table_id FK
        int restaurant_id FK
        string order_number
        string status
        decimal subtotal
        decimal tax_amount
        decimal service_charge
        decimal total_amount
        text special_instructions
        datetime order_time
        datetime accepted_at
        datetime ready_at
        datetime served_at
        datetime cancelled_at
        int estimated_prep_time
        int actual_prep_time
        uuid processed_by FK
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEMS {
        int order_item_id PK
        int order_id FK
        int item_id FK
        int quantity
        decimal unit_price
        decimal total_price
        text customizations
        string status
        datetime created_at
        datetime updated_at
    }

    NOTIFICATIONS {
        int notification_id PK
        uuid user_id FK
        int order_id FK
        enum type "order_placed, order_accepted, order_preparing, order_ready, order_served, order_cancelled, system_alert"
        enum priority "low, normal, high, urgent"
        boolean is_read
        jsonb metadata
        datetime sent_at
        datetime read_at
        datetime expires_at
        datetime created_at
    }

    QR_SCANS {
        int scan_id PK
        int table_id FK
        uuid customer_id FK
        string session_id
        string ip_address
        string user_agent
        jsonb device_info
        string referrer_url
        datetime scanned_at
        boolean led_to_order
        int order_id FK
    }

    ORDER_STATUS_HISTORY {
        int history_id PK
        int order_id FK
        uuid updated_by FK
        enum old_status "pending, accepted, preparing, ready, served, cancelled"
        enum new_status "pending, accepted, preparing, ready, served, cancelled"
        text notes
        int estimated_time
        datetime updated_at
    }

    ORDER_PAYMENTS {
        int payment_id PK
        int order_id FK
        enum payment_method "cash, card, digital_wallet, other"
        enum payment_status "pending, completed, failed, refunded"
        decimal amount_paid
        decimal change_given
        text payment_reference
        uuid processed_by FK
        datetime payment_time
        datetime created_at
        datetime updated_at
    }

    RESTAURANTS ||--o{ USER_ROLES : "employs"
    RESTAURANTS ||--o{ TABLES : "has"
    RESTAURANTS ||--o{ MENU_CATEGORIES : "contains"
    RESTAURANTS ||--o{ ORDERS : "receives"
    USERS ||--o{ USER_ROLES : "assigned"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ ORDER_STATUS_HISTORY : "updates"
    USERS ||--o{ QR_SCANS : "scans"
    USER_ROLES }o--|| RESTAURANTS : "belongs_to"
    USER_ROLES }o--|| USERS : "assigned_to"
    USER_ROLES }o--o| USERS : "assigned_by"
    TABLES }o--|| RESTAURANTS : "located_in"
    TABLES ||--o{ ORDERS : "serves"
    TABLES ||--o{ QR_SCANS : "generates"
    MENU_CATEGORIES }o--|| RESTAURANTS : "belongs_to"
    MENU_CATEGORIES ||--o{ MENU_ITEMS : "categorizes"
    ORDERS }o--|| USERS : "placed_by"
    ORDERS }o--|| TABLES : "served_at"
    ORDERS }o--|| RESTAURANTS : "belongs_to"
    ORDERS }o--o| USERS : "processed_by"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ NOTIFICATIONS : "triggers"
    ORDERS ||--o{ ORDER_STATUS_HISTORY : "tracks"
    ORDERS ||--o{ ORDER_PAYMENTS : "paid_by"
    ORDERS ||--o{ QR_SCANS : "resulted_from"
    ORDER_ITEMS }o--|| ORDERS : "belongs_to"
    ORDER_ITEMS }o--|| MENU_ITEMS : "references"
    NOTIFICATIONS }o--|| USERS : "sent_to"
    NOTIFICATIONS }o--o| ORDERS : "related_to"
    QR_SCANS }o--|| TABLES : "scanned_from"
    QR_SCANS }o--o| USERS : "scanned_by"
    QR_SCANS }o--o| ORDERS : "led_to"
    ORDER_STATUS_HISTORY }o--|| ORDERS : "tracks"
    ORDER_STATUS_HISTORY }o--|| USERS : "updated_by"
    ORDER_PAYMENTS }o--|| ORDERS : "pays_for"
    ORDER_PAYMENTS }o--|| USERS : "processed_by"

```

## Key Features of the Schema:

### 🔐 **Multi-tenant Architecture**

- Each restaurant has its own isolated data
- Users can have roles across multiple restaurants

### 📱 **QR Code Ordering System**

- Tables have unique QR codes for customer ordering
- Tracks QR scans and session management

### 🍽️ **Menu Management**

- Hierarchical menu structure (categories → items)
- Support for availability windows and customization

### 📋 **Order Processing**

- Complete order lifecycle tracking
- Status history for audit trails
- Payment processing integration

### 🔔 **Notification System**

- Real-time notifications for order updates
- Configurable priority levels and types

### 📊 **Analytics Ready**

- QR scan tracking for conversion analysis
- Order timing and performance metrics
- User behavior tracking

### 🛡️ **Security & Compliance**

- Row Level Security (RLS) policies
- Audit trails for all critical operations
- Role-based access control
