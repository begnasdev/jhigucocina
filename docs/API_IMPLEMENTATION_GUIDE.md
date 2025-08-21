# API Implementation Guide

> **Agent Rule:** Before implementation, first show the folder structure of what folders and files are going to be added. If you get confused, ask a clarifying question.

This comprehensive guide walks through implementing a complete CRUD API feature from frontend to backend, following the app's established patterns and best practices.

Use `feature` as the placeholder name - replace with your actual feature (e.g., `restaurant`, `menu`, `order`).

## Quick Reference Checklist

- [ ] 1. Add endpoints to config
- [ ] 2. Add TypeScript types
- [ ] 3. Create service layer
- [ ] 4. Create query keys
- [ ] 5. Create query hooks
- [ ] 6. Create mutation hooks
- [ ] 7. Create validation schemas

---

## Step 1: Add Endpoints to Config

**File:** `src/config.ts`

Add your feature endpoints to the existing endpoints object:

```typescript
export const config = {
  // ... existing config
  endpoints: {
    // ... existing endpoints
    features: {
      root: "/features",
      byId: (id: string) => `/features/${id}`,
    },
  },
};
```

---

## Step 2: Add TypeScript Types

**File:** `src/types/feature.ts`

```typescript
import { Database } from "./database";

// Generic API response structure (consistent across app)
export type ApiResponse<T> = {
  data: T | null;
  message: string;
  status: number;
  errors?: any; // For validation errors
};

// Feature types based on database schema
export type Feature = Database["public"]["Tables"]["features"]["Row"];
export type InsertFeature = Database["public"]["Tables"]["features"]["Insert"];
export type UpdateFeature = Database["public"]["Tables"]["features"]["Update"];
```

---

## Step 3: Create Service Layer

**File:** `src/services/feature-service.ts`

```typescript
import { apiClient } from "@/utils/axios";
import { config } from "@/config";
import {
  ApiResponse,
  Feature,
  InsertFeature,
  UpdateFeature,
} from "@/types/feature";

const { endpoints } = config;

export const featureService = {
  /**
   * Get all features
   * @returns Promise resolving to all features
   */
  async getAllFeatures(): Promise<ApiResponse<Feature[]>> {
    const response = await apiClient.get(endpoints.features.root);
    return response.data;
  },

  /**
   * Get feature by ID
   * @param id - Feature ID
   * @returns Promise resolving to feature data
   */
  async getFeatureById(id: string): Promise<ApiResponse<Feature>> {
    const response = await apiClient.get(endpoints.features.byId(id));
    return response.data;
  },

  /**
   * Create new feature
   * @param featureData - Feature creation data
   * @returns Promise resolving to created feature
   */
  async createFeature(
    featureData: InsertFeature
  ): Promise<ApiResponse<Feature>> {
    const response = await apiClient.post(endpoints.features.root, featureData);
    return response.data;
  },

  /**
   * Update feature
   * @param id - Feature ID
   * @param updateData - Feature update data
   * @returns Promise resolving to updated feature
   */
  async updateFeature(
    id: string,
    updateData: UpdateFeature
  ): Promise<ApiResponse<Feature>> {
    const response = await apiClient.put(
      endpoints.features.byId(id),
      updateData
    );
    return response.data;
  },

  /**
   * Delete feature
   * @param id - Feature ID
   * @returns Promise resolving to null
   */
  async deleteFeature(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(endpoints.features.byId(id));
    return response.data;
  },
};
```

---

## Step 4: Create Query Keys

**File:** `src/constants/queryKeys.ts`

Add to existing file:

```typescript
export const featureKeys = {
  all: ["features"] as const,
  detail: (id: string) => [...featureKeys.all, id] as const,
};
```

---

## Step 5: Create Query Hooks

**File:** `src/hooks/queries/useFeatureQueries.ts`

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { featureService } from "@/services/feature-service";
import { featureKeys } from "@/constants/queryKeys";

/**
 * Hook to fetch all features
 * @returns Query for all features
 */
export const useGetFeatures = () =>
  useQuery({
    queryKey: featureKeys.all,
    queryFn: featureService.getAllFeatures,
  });

/**
 * Hook to fetch a feature by ID
 * @param id - Feature ID
 * @returns Query for specific feature
 */
export const useGetFeatureById = (id: string) =>
  useQuery({
    queryKey: featureKeys.detail(id),
    queryFn: () => featureService.getFeatureById(id),
    enabled: !!id,
  });
```

---

## Step 6: Create Mutation Hooks

**File:** `src/hooks/mutations/useFeatureMutations.ts`

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featureService } from "@/services/feature-service";
import { InsertFeature, UpdateFeature } from "@/types/feature";
import { featureKeys } from "@/constants/queryKeys";
import { toast } from "sonner";

/**
 * Hook to create a new feature
 * @returns Mutation for creating feature
 */
export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newFeature: InsertFeature) =>
      featureService.createFeature(newFeature),
    onSuccess: (response) => {
      toast.success(response.message || "Feature created successfully!");
      queryClient.invalidateQueries({ queryKey: featureKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create feature.");
    },
  });
};

/**
 * Hook to update a feature
 * @returns Mutation for updating feature
 */
export const useUpdateFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeature }) =>
      featureService.updateFeature(id, data),
    onSuccess: (response, { id }) => {
      toast.success(response.message || "Feature updated successfully!");
      queryClient.invalidateQueries({ queryKey: featureKeys.all });
      queryClient.invalidateQueries({ queryKey: featureKeys.detail(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update feature.");
    },
  });
};

/**
 * Hook to delete a feature
 * @returns Mutation for deleting feature
 */
export const useDeleteFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => featureService.deleteFeature(id),
    onSuccess: (response) => {
      toast.success(response.message || "Feature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: featureKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete feature.");
    },
  });
};
```

---

## Step 7: Create Validation Schemas

**File:** `src/schemas/feature-schema.ts`

```typescript
import { z } from "zod";

export const createFeatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  // Add other required fields based on your database schema
});

// Update schema makes all fields optional
export const updateFeatureSchema = createFeatureSchema.partial();
```

---

## Usage Example

```typescript
// In a React component
import {
  useGetFeatures,
  useCreateFeature,
} from "@/hooks/queries/useFeatureQueries";
import { useCreateFeature } from "@/hooks/mutations/useFeatureMutations";

export function FeatureList() {
  const { data: features, isLoading } = useGetFeatures();
  const createFeature = useCreateFeature();

  const handleCreate = (featureData) => {
    createFeature.mutate(featureData);
  };

  // Component logic...
}
```

---

## File Structure Overview

```
src/
├── hooks/
│   ├── queries/
│   │   └── useFeatureQueries.ts
│   └── mutations/
│       └── useFeatureMutations.ts
├── services/
│   └── feature-service.ts
├── types/
│   └── feature.ts
├── schemas/
│   └── feature-schema.ts
└── constants/
    └── queryKeys.ts          # Add feature keys
```
