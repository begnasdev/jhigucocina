# API Creation Guide

This guide provides a step-by-step process for creating a full CRUD API for a new feature, ensuring consistency with the project's existing structure and best practices.

We will use `item` as the placeholder feature name.

## 1. Folder & File Structure

For a new feature named `item`, you will create the following files:

```
src/
├── app/
│   └── api/
│       └── items/
│           ├── [id]/
│           │   └── route.ts    # Handles GET by ID, PUT, DELETE
│           └── route.ts        # Handles GET all, POST
├── lib/
│   └── supabase/
│       └── api/
│           └── items.ts        # Core Supabase database functions
├── schemas/
│   └── item-schema.ts          # Zod validation schemas
└── types/
    └── item.ts                 # TypeScript type definitions for the item
```

---

## 2. Implementation Steps

### Step 1: Update Database Types

Before writing any code, ensure your database schema is up-to-date and you have generated the corresponding TypeScript types.

> **Important:** After running any new database migrations, always update your Supabase types to reflect the changes. This ensures type safety throughout the application.
>
> ```bash
> pnpm supabase gen types typescript --project-id <your-project-id> --schema public > src/types/database.ts
> ```

### Step 2: Create Type Definitions

Create a dedicated file for your feature's types. These will be derived from the master `database.ts` type file.

**File:** `src/types/item.ts`

```typescript
// src/types/item.ts
import { Database } from "./database";

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type InsertItem = Database["public"]["Tables"]["items"]["Insert"];
export type UpdateItem = Database["public"]["Tables"]["items"]["Update"];
```

### Step 3: Create Zod Validation Schemas

Define the validation schemas for creating and updating your item. Use `.partial()` to keep your code DRY.

**File:** `src/schemas/item-schema.ts`

```typescript
// src/schemas/item-schema.ts
import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  // Add other fields for your item here
});

// The update schema is a partial version of the create schema,
// making all fields optional for PUT/PATCH requests.
export const updateItemSchema = createItemSchema.partial();
```

### Step 4: Create Supabase API Functions

This file contains the core logic for interacting with your Supabase table. It should import its types from `src/types/item.ts`.

**File:** `src/lib/supabase/api/items.ts`

```typescript
// src/lib/supabase/api/items.ts
import { createServerClient } from "@/lib/supabase/server";
import { Item, InsertItem, UpdateItem } from "@/types/item";

// Get all items
export async function getAllItems(): Promise<Item[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("items").select("*");
  if (error) throw new Error(`Error fetching items: ${error.message}`);
  return data || [];
}

// Get a single item by its ID
export async function getItemById(id: string): Promise<Item | null> {
  const supabase = await createServerClient();
  // IMPORTANT: Replace "id" with your actual primary key column name
  const { data, error } = await supabase.from("items").select("*").eq("id", id).single();
  if (error) throw new Error(`Error fetching item ${id}: ${error.message}`);
  return data;
}

// Create a new item
export async function createItem(itemData: InsertItem): Promise<Item> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("items").insert(itemData).select().single();
  if (error) throw new Error(`Error creating item: ${error.message}`);
  return data;
}

// Update an existing item
export async function updateItem(id: string, updateData: UpdateItem): Promise<Item> {
  const supabase = await createServerClient();
  // IMPORTANT: Replace "id" with your actual primary key column name
  const { data, error } = await supabase.from("items").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(`Error updating item ${id}: ${error.message}`);
  return data;
}

// Delete an item
export async function deleteItem(id: string): Promise<void> {
  const supabase = await createServerClient();
  // IMPORTANT: Replace "id" with your actual primary key column name
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(`Error deleting item ${id}: ${error.message}`);
}
```

### Step 5: Create the API Route Handlers

These files expose your Supabase functions as RESTful API endpoints. They handle request validation and return a standardized JSON response.

**File:** `src/app/api/items/route.ts`

```typescript
// src/app/api/items/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createItem, getAllItems } from "@/lib/supabase/api/items";
import { createItemSchema } from "@/schemas/item-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const items = await getAllItems();
    return NextResponse.json({
      data: items,
      message: "Items retrieved successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = createItemSchema.parse(json);
    const newItem = await createItem(data);

    return NextResponse.json({
      data: newItem,
      message: "Item created successfully",
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.errors,
      });
    }
    return NextResponse.json({
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}
```

**File:** `src/app/api/items/[id]/route.ts`

```typescript
// src/app/api/items/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { deleteItem, getItemById, updateItem } from "@/lib/supabase/api/items";
import { updateItemSchema } from "@/schemas/item-schema";
import { z, ZodError } from "zod";

const paramsSchema = z.object({
  id: z.uuid({ message: "Invalid ID format" }), // Use z.uuid() for UUIDs
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(params);
    const item = await getItemById(id);

    if (!item) {
      return NextResponse.json({
        data: null,
        message: "Item not found",
        status: 404,
      });
    }

    return NextResponse.json({
      data: item,
      message: "Item retrieved successfully",
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.errors,
      });
    }
    return NextResponse.json({
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(params);
    const json = await req.json();
    const data = updateItemSchema.parse(json);
    const updatedItem = await updateItem(id, data);

    return NextResponse.json({
      data: updatedItem,
      message: "Item updated successfully",
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.errors,
      });
    }
    return NextResponse.json({
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(params);
    await deleteItem(id);

    return NextResponse.json({
      data: null,
      message: "Item deleted successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}
```