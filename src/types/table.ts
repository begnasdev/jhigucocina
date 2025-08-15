// src/types/table.ts

import { Database } from "./database";

// A generic structure for all API responses
export type ApiResponse<T> = {
  data: T | null;
  message: string;
  status: number;
  errors?: any; // For validation errors
};

// Specific types for tables based on your database schema
export type Table = Database["public"]["Tables"]["tables"]["Row"];
export type InsertTable = Database["public"]["Tables"]["tables"]["Insert"];
export type UpdateTable = Database["public"]["Tables"]["tables"]["Update"];
