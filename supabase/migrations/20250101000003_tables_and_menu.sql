-- Migration 3: Tables and Menu Structure
-- This migration creates tables for physical tables and menu organization

-- Create tables table
CREATE TABLE
    tables (
        table_id BIGSERIAL PRIMARY KEY,
        restaurant_id BIGINT REFERENCES restaurants (restaurant_id) ON DELETE CASCADE,
        table_number VARCHAR(50) NOT NULL,
        qr_code_data TEXT UNIQUE,
        qr_code_url TEXT,
        capacity INTEGER DEFAULT 4,
        status VARCHAR(50) DEFAULT 'available' CHECK (
            status IN (
                'available',
                'occupied',
                'reserved',
                'maintenance'
            )
        ),
        location_coordinates JSONB,
        is_active BOOLEAN DEFAULT true,
        last_scanned TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW (),
        UNIQUE (restaurant_id, table_number)
    );

-- Create menu_categories table
CREATE TABLE
    menu_categories (
        category_id BIGSERIAL PRIMARY KEY,
        restaurant_id BIGINT REFERENCES restaurants (restaurant_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        available_from TIMESTAMPTZ,
        available_until TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

-- Create menu_items table
CREATE TABLE
    menu_items (
        item_id BIGSERIAL PRIMARY KEY,
        category_id BIGINT REFERENCES menu_categories (category_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        preparation_time INTEGER DEFAULT 15, -- minutes
        ingredients TEXT,
        allergens TEXT,
        customization_options JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

-- Create indexes for tables and menu
CREATE INDEX idx_tables_restaurant_id ON tables (restaurant_id);

CREATE INDEX idx_tables_qr_code_data ON tables (qr_code_data);

CREATE INDEX idx_tables_status ON tables (status);

CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories (restaurant_id);

CREATE INDEX idx_menu_categories_is_active ON menu_categories (is_active);

CREATE INDEX idx_menu_categories_sort_order ON menu_categories (sort_order);

CREATE INDEX idx_menu_items_category_id ON menu_items (category_id);

CREATE INDEX idx_menu_items_is_available ON menu_items (is_available);

CREATE INDEX idx_menu_items_is_featured ON menu_items (is_featured);

CREATE INDEX idx_menu_items_category_available ON menu_items (category_id, is_available);

-- Apply updated_at triggers
CREATE TRIGGER update_tables_updated_at BEFORE
UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_menu_categories_updated_at BEFORE
UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_menu_items_updated_at BEFORE
UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column (); 