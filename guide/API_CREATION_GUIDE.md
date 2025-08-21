# API Creation Guide

> **Agent Rule:** Before implementation, first show the folder structure of what folders and files are going to be added. If you get confused, ask a clarifying question.

This guide provides a step-by-step process for creating a full CRUD API for a new feature, ensuring consistency with the project's existing structure and best practices.

Use `feature` as the placeholder name - replace with your actual feature (e.g., `restaurant`, `menu`, `order`).

## Quick Reference Checklist

- [ ] 1. Update `database.ts`
- [ ] 2. Create Type Definitions
- [ ] 3. Create Zod Validation Schemas
- [ ] 4. Create Supabase API Functions
- [ ] 5. Create API Route Handlers

---

## Implementation Steps

### Step 1: Update Database Types

Before writing any code, ensure your database schema is up-to-date and you have generated the corresponding TypeScript types.

> **Important:** After running any new database migrations, always update your Supabase types to reflect the changes. This ensures type safety throughout the application.
>
> ```bash
> supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
> ```

### Step 2: Create Type Definitions

Create a dedicated file for your feature's types. These will be derived from the master `database.ts` type file.

**File:** `src/types/feature.ts`

```typescript
// src/types/feature.ts
import { Database } from "./database";

export type Feature = Database["public"]["Tables"]["features"]["Row"];
export type InsertFeature = Database["public"]["Tables"]["features"]["Insert"];
export type UpdateFeature = Database["public"]["Tables"]["features"]["Update"];
```

### Step 3: Create Zod Validation Schemas

Define the validation schemas for creating and updating your feature. Use `.partial()` to keep your code DRY.

**File:** `src/schemas/feature-schema.ts`

```typescript
// src/schemas/feature-schema.ts
import { z } from "zod";

export const createFeatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  // Add other fields for your feature here
});

// The update schema is a partial version of the create schema,
// making all fields optional for PUT/PATCH requests.
export const updateFeatureSchema = createFeatureSchema.partial();
```

### Step 4: Create Supabase API Functions

This file contains the core logic for interacting with your Supabase table. It should import its types from `src/types/feature.ts`.

**File:** `src/lib/supabase/api/features.ts`

```typescript
// src/lib/supabase/api/features.ts
import { createServerClient } from "@/lib/supabase/server";
import { Feature, InsertFeature, UpdateFeature } from "@/types/feature";

// Get all features
export async function getAllFeatures(): Promise<Feature[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("features").select("*");
  if (error) throw new Error(`Error fetching features: ${error.message}`);
  return data || [];
}

// Get a single feature by its ID
export async function getFeatureById(id: string): Promise<Feature | null> {
  const supabase = await createServerClient();
  // IMPORTANT: Replace "id" with your actual primary key column name
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(`Error fetching feature ${id}: ${error.message}`);
  return data;
}

// Create a new feature
export async function createFeature(featureData: InsertFeature): Promise<Feature> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("features")
    .insert(featureData)
    .select()
    .single();
  if (error) throw new Error(`Error creating feature: ${error.message}`);
  return data;
}

// Update an existing feature
export async function updateFeature(
  id: string,
  updateData: UpdateFeature
): Promise<Feature> {
  const supabase = await createServerClient();
  // IMPORTANT: Replace "id" with your actual primary key column name
  const { data, error } = await supabase
    .from("features")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Error updating feature ${id}: ${error.message}`);
  return data;
}

// Delete a feature
export async function deleteFeature(id: string): Promise<void> {
  const supabase = await createServerClient();
  // IMPORTANT: Replace "id" with your actual primary key column name
  const { error } = await supabase.from("features").delete().eq("id", id);
  if (error) throw new Error(`Error deleting feature ${id}: ${error.message}`);
}
```

### Step 5: Create the API Route Handlers

These files expose your Supabase functions as RESTful API endpoints. They handle request validation and return a standardized JSON response.

**File:** `src/app/api/features/route.ts`

```typescript
// src/app/api/features/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createFeature, getAllFeatures } from "@/lib/supabase/api/features";
import { createFeatureSchema } from "@/schemas/feature-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const features = await getAllFeatures();
    return NextResponse.json({
      data: features,
      message: "Features retrieved successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = createFeatureSchema.parse(json);
    const newFeature = await createFeature(data);

    return NextResponse.json({
      data: newFeature,
      message: "Feature created successfully",
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
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}
```

**File:** `src/app/api/features/[id]/route.ts`

```typescript
// src/app/api/features/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { deleteFeature, getFeatureById, updateFeature } from "@/lib/supabase/api/features";
import { updateFeatureSchema } from "@/schemas/feature-schema";
import { z, ZodError } from "zod";

const paramsSchema = z.object({
  id: z.uuid({ message: "Invalid ID format" }), // Use z.uuid() for UUIDs
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const feature = await getFeatureById(id);

    if (!feature) {
      return NextResponse.json({
        data: null,
        message: "Feature not found",
        status: 404,
      });
    }

    return NextResponse.json({
      data: feature,
      message: "Feature retrieved successfully",
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
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const json = await req.json();
    const data = updateFeatureSchema.parse(json);
    const updatedFeature = await updateFeature(id, data);

    return NextResponse.json({
      data: updatedFeature,
      message: "Feature updated successfully",
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
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    await deleteFeature(id);

    return NextResponse.json({
      data: null,
      message: "Feature deleted successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}
```

---

## File Structure Overview

```
src/
├── app/
│   └── api/
│       └── features/
│           ├── [id]/
│           │   └── route.ts    # Handles GET by ID, PUT, DELETE
│           └── route.ts        # Handles GET all, POST
├── lib/
│   └── supabase/
│       └── api/
│           └── features.ts     # Core Supabase database functions
├── schemas/
│   └── feature-schema.ts       # Zod validation schemas
└── types/
    └── feature.ts              # TypeScript type definitions
```
