-- Migration 3: Tables and Menu Structure
-- This migration creates tables for physical tables and menu organization
-- Create tables table
CREATE TABLE
    tables (
        table_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        restaurant_id UUID REFERENCES restaurants (restaurant_id) ON DELETE CASCADE,
        table_number VARCHAR(50) NOT NULL,
        qr_code_data TEXT UNIQUE,
        qr_code_url TEXT,
        capacity INTEGER DEFAULT 4,
        status table_status DEFAULT 'available',
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
        category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        restaurant_id UUID REFERENCES restaurants (restaurant_id) ON DELETE CASCADE,
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
        item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
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

-- Create menu_item_categories join table for many-to-many relationship
CREATE TABLE "menu_item_categories" (
    "menu_item_id" uuid NOT NULL,
    "category_id" uuid NOT NULL,
    PRIMARY KEY ("menu_item_id", "category_id")
);

-- Add foreign key constraints to the join table
ALTER TABLE "menu_item_categories" 
ADD CONSTRAINT "fk_menu_item" 
FOREIGN KEY ("menu_item_id") 
REFERENCES "menu_items" ("item_id") 
ON DELETE CASCADE;

ALTER TABLE "menu_item_categories" 
ADD CONSTRAINT "fk_category" 
FOREIGN KEY ("category_id") 
REFERENCES "menu_categories" ("category_id") 
ON DELETE CASCADE;

-- Create indexes for tables and menu
CREATE INDEX idx_tables_restaurant_id ON tables (restaurant_id);

CREATE INDEX idx_tables_qr_code_data ON tables (qr_code_data);

CREATE INDEX idx_tables_status ON tables (status);

CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories (restaurant_id);

CREATE INDEX idx_menu_categories_is_active ON menu_categories (is_active);

CREATE INDEX idx_menu_categories_sort_order ON menu_categories (sort_order);

CREATE INDEX idx_menu_items_is_available ON menu_items (is_available);

CREATE INDEX idx_menu_items_is_featured ON menu_items (is_featured);

-- Apply updated_at triggers
CREATE TRIGGER update_tables_updated_at BEFORE
UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_menu_categories_updated_at BEFORE
UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_menu_items_updated_at BEFORE
UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

-- Add diet type tables
CREATE TABLE "diet_type" (
    "diet_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" character varying(255) NOT NULL
);

CREATE TABLE "menu_item_diet_types" (
    "menu_item_id" uuid NOT NULL,
    "diet_type_id" uuid NOT NULL,
    PRIMARY KEY ("menu_item_id", "diet_type_id")
);

ALTER TABLE "menu_item_diet_types" ADD FOREIGN KEY ("menu_item_id") REFERENCES "menu_items" ("item_id") ON DELETE CASCADE;
ALTER TABLE "menu_item_diet_types" ADD FOREIGN KEY ("diet_type_id") REFERENCES "diet_type" ("diet_type_id") ON DELETE CASCADE;
