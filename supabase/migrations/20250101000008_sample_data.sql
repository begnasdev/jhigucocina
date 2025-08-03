-- Migration 8: Sample Data
-- This migration inserts sample data for testing and demonstration
-- Insert sample restaurant
INSERT INTO
    restaurants (
        name,
        address,
        phone,
        email,
        description,
        operating_hours,
        tax_rate,
        service_charge,
        currency
    )
VALUES
    (
        'JhiGu Cocina Mexicana',
        '123 Calle Principal, Ciudad de México, CDMX 06000',
        '+52 55 1234 5678',
        'info@jhigucocina.com',
        'Authentic Mexican cuisine with a modern twist. Fresh ingredients, traditional recipes, and warm hospitality.',
        'Monday-Sunday: 11:00 AM - 10:00 PM',
        0.1600, -- 16% tax rate
        0.1000, -- 10% service charge
        'MXN'
    );

INSERT INTO
    auth.users (
        id,
        email,
        password,
        role,
        last_sign_in_at
    )
VALUES
    (
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        'chef@jhigucocina.com',
        'password123',
        'authenticated',
        NOW()
    ),
    (
        'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
        'waiter@jhigucocina.com',
        'password123',
        'authenticated',
        NOW()
    ),
    (
        'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
        'manager@jhigucocina.com',
        'password123',
        'authenticated',
        NOW()
    ),
    (
        'd4e5f6a7-b8c9-0123-4567-890abcdef012',
        'customer1@example.com',
        'password123',
        'authenticated',
        NOW()
    ),
    (
        'e5f6a7b8-c9d0-1234-5678-90abcdef0123',
        'customer2@example.com',
        'password123',
        'authenticated',
        NOW()
    );

-- Insert corresponding user profiles
INSERT INTO
    public.users (user_id, name, phone, is_active)
VALUES
    (
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        'Chef Maria Rodriguez',
        '+52 55 9876 5432',
        true
    ),
    (
        'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
        'Carlos Mendoza',
        '+52 55 8765 4321',
        true
    ),
    (
        'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
        'Ana Lopez',
        '+52 55 7654 3210',
        true
    ),
    (
        'd4e5f6a7-b8c9-0123-4567-890abcdef012',
        'Juan Pérez',
        '+52 55 6543 2109',
        true
    ),
    (
        'e5f6a7b8-c9d0-1234-5678-90abcdef0123',
        'María García',
        '+52 55 5432 1098',
        true
    );

-- Insert user roles
INSERT INTO
    user_roles (user_id, restaurant_id, role, assigned_by)
VALUES
    (
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'kitchen',
        'c3d4e5f6-a7b8-9012-3456-7890abcdef01'
    ),
    (
        'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'waiter',
        'c3d4e5f6-a7b8-9012-3456-7890abcdef01'
    ),
    (
        'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'manager',
        'a1b2c3d4-e5f6-7890-1234-567890abcdef'
    );

-- Ana
-- Insert sample tables
INSERT INTO
    tables (
        restaurant_id,
        table_number,
        qr_code_data,
        capacity,
        status
    )
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'T1', 'jhigucocina-table-1', 4, 'available'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'T2', 'jhigucocina-table-2', 6, 'available'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'T3', 'jhigucocina-table-3', 2, 'available'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'T4', 'jhigucocina-table-4', 8, 'available'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'T5', 'jhigucocina-table-5', 4, 'available');

-- Insert menu categories
INSERT INTO
    menu_categories (restaurant_id, name, description, sort_order)
VALUES
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Entradas',
        'Deliciosas entradas y aperitivos',
        1
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Tacos',
        'Tacos tradicionales con tortillas hechas a mano',
        2
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Platos Principales',
        'Platos principales de la cocina mexicana',
        3
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Guarniciones',
        'Acompañamientos y guarniciones',
        4
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Postres',
        'Postres tradicionales mexicanos',
        5
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Bebidas',
        'Bebidas refrescantes y tradicionales',
        6
    );

-- Insert menu items
INSERT INTO
    menu_items (
        category_id,
        name,
        description,
        price,
        is_available,
        is_featured,
        preparation_time,
        ingredients,
        allergens
    )
VALUES
    -- Entradas
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'Guacamole Fresco',
        'Aguacate fresco con tomate, cebolla, cilantro y limón',
        85.00,
        true,
        true,
        10,
        'Aguacate, tomate, cebolla, cilantro, limón, sal',
        'Ninguno'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'Queso Fundido',
        'Queso fundido con champiñones y chorizo',
        120.00,
        true,
        false,
        15,
        'Queso, champiñones, chorizo, tortillas',
        'Lácteos'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'Sopa de Tortilla',
        'Sopa tradicional con tortillas fritas, aguacate y queso',
        95.00,
        true,
        true,
        20,
        'Tortillas, tomate, aguacate, queso, crema',
        'Lácteos'
    ),
    -- Tacos
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'Tacos al Pastor',
        'Tacos de cerdo marinado con piña y cilantro',
        45.00,
        true,
        true,
        12,
        'Cerdo, piña, cilantro, cebolla, tortillas',
        'Ninguno'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'Tacos de Pescado',
        'Tacos de pescado fresco con repollo y salsa chipotle',
        55.00,
        true,
        false,
        15,
        'Pescado, repollo, salsa chipotle, tortillas',
        'Pescado'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'Tacos de Pollo',
        'Tacos de pollo asado con guacamole',
        42.00,
        true,
        true,
        10,
        'Pollo, guacamole, cebolla, tortillas',
        'Ninguno'
    ),
    -- Platos Principales
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'Enchiladas Verdes',
        'Enchiladas de pollo con salsa verde y crema',
        180.00,
        true,
        true,
        25,
        'Pollo, tortillas, salsa verde, crema, queso',
        'Lácteos'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'Mole Poblano',
        'Pollo en mole poblano con arroz y frijoles',
        220.00,
        true,
        false,
        30,
        'Pollo, mole, arroz, frijoles',
        'Nueces'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'Chiles Rellenos',
        'Chiles poblanos rellenos de queso con salsa de tomate',
        160.00,
        true,
        true,
        20,
        'Chiles poblanos, queso, salsa de tomate',
        'Lácteos'
    ),
    -- Guarniciones
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        'Arroz Mexicano',
        'Arroz con tomate, cebolla y especias',
        45.00,
        true,
        false,
        15,
        'Arroz, tomate, cebolla, especias',
        'Ninguno'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        'Frijoles Refritos',
        'Frijoles refritos con queso',
        35.00,
        true,
        false,
        10,
        'Frijoles, queso, manteca',
        'Lácteos'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        'Ensalada César',
        'Ensalada César con aderezo casero',
        75.00,
        true,
        false,
        8,
        'Lechuga, crutones, parmesano, aderezo',
        'Lácteos, Gluten'
    ),
    -- Postres
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
        'Flan Casero',
        'Flan casero con caramelo',
        65.00,
        true,
        true,
        5,
        'Huevos, leche, azúcar, vainilla',
        'Huevos, Lácteos'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
        'Churros',
        'Churros con chocolate caliente',
        55.00,
        true,
        false,
        12,
        'Harina, azúcar, chocolate, canela',
        'Gluten'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
        'Tres Leches',
        'Pastel tres leches con frutas',
        75.00,
        true,
        true,
        5,
        'Pastel, leche condensada, crema, frutas',
        'Lácteos'
    ),
    -- Bebidas
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
        'Agua de Jamaica',
        'Agua de flor de jamaica',
        35.00,
        true,
        true,
        2,
        'Flor de jamaica, azúcar, agua',
        'Ninguno'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
        'Horchata',
        'Agua de horchata con canela',
        40.00,
        true,
        false,
        2,
        'Arroz, canela, azúcar, agua',
        'Ninguno'
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
        'Limonada',
        'Limonada fresca con menta',
        30.00,
        true,
        true,
        3,
        'Limón, azúcar, menta, agua',
        'Ninguno'
    );

-- Insert sample orders (for demonstration)
INSERT INTO
    orders (
        customer_id,
        table_id,
        restaurant_id,
        status,
        subtotal,
        tax_amount,
        service_charge,
        total_amount,
        special_instructions
    )
VALUES
    (
        'd4e5f6a7-b8c9-0123-4567-890abcdef012',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'pending',
        0,
        0,
        0,
        0,
        'Sin cebolla en los tacos'
    ),
    (
        'e5f6a7b8-c9d0-1234-5678-90abcdef0123',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'accepted',
        0,
        0,
        0,
        0,
        'Extra picante'
    );

-- Insert sample order items
INSERT INTO
    order_items (
        order_id,
        item_id,
        quantity,
        unit_price,
        total_price,
        customizations
    )
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1a', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1c', 1, 85.00, 85.00, '{"sin_cebolla": true}'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1a', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1d', 2, 45.00, 90.00, '{"extra_picante": true}'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1a', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1e', 1, 35.00, 35.00, NULL),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1b', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1f', 1, 180.00, 180.00, '{"extra_crema": true}'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1b', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 1, 45.00, 45.00, NULL),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1b', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 1, 40.00, 40.00, NULL);

-- Update order totals (trigger should handle this, but let's ensure it's correct)
UPDATE orders
SET
    subtotal = 210.00,
    tax_amount = 33.60,
    service_charge = 21.00,
    total_amount = 264.60
WHERE
    order_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1a';

UPDATE orders
SET
    subtotal = 265.00,
    tax_amount = 42.40,
    service_charge = 26.50,
    total_amount = 333.90
WHERE
    order_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1b';
