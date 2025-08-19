
-- Create carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT UNIQUE, -- For guest carts
    restaurant_id UUID REFERENCES restaurants(restaurant_id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT chk_user_or_session_id CHECK (user_id IS NOT NULL OR session_id IS NOT NULL) -- Ensure at least one identifier is present
);

-- Create cart_items table
CREATE TABLE cart_items (
    -- Table for individual items within a shopping cart.
    -- Stores details like quantity and the price at the time the item was added to the cart.

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    menu_item_id UUID REFERENCES menu_items(item_id) ON DELETE CASCADE NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_time_of_addition NUMERIC(10, 2) NOT NULL, -- Store price at the time of addition
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (cart_id, menu_item_id) -- Ensure only one entry per menu_item in a cart
);

-- Indexes for faster lookups
CREATE INDEX idx_carts_user_id ON carts (user_id);
CREATE INDEX idx_carts_session_id ON carts (session_id);
CREATE INDEX idx_carts_restaurant_id ON carts (restaurant_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);
CREATE INDEX idx_cart_items_menu_item_id ON cart_items (menu_item_id);

-- RLS policies have been removed to allow unrestricted CRUD operations

-- Function to update `updated_at` column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for carts table
CREATE TRIGGER update_carts_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for cart_items table
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
