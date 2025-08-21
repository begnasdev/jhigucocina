import { Database } from "./database";

// Generic API response structure (consistent across app)
export type ApiResponse<T> = {
  data: T | null;
  message: string;
  status: number;
  errors?: any; // For validation errors
};

// Restaurant types based on database schema
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type InsertRestaurant = Database["public"]["Tables"]["restaurants"]["Insert"];
export type UpdateRestaurant = Database["public"]["Tables"]["restaurants"]["Update"];
