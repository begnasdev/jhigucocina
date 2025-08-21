import { createServerClient } from "@/lib/supabase/server";
import {
  InsertRestaurant,
  Restaurant,
  UpdateRestaurant,
} from "@/types/restaurant";

export async function createRestaurant(
  restaurantData: InsertRestaurant
): Promise<Restaurant> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("restaurants")
    .insert(restaurantData)
    .select()
    .single();

  if (error) throw new Error(`Error creating restaurant: ${error.message}`);
  return data;
}

export async function getRestaurantById(
  restaurantId: string
): Promise<Restaurant | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();

  if (error) throw new Error(`Error fetching restaurant: ${error.message}`);
  return data;
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("restaurants").select("*");

  if (error) throw new Error(`Error fetching all restaurants: ${error.message}`);
  return data || [];
}

export async function updateRestaurant(
  restaurantId: string,
  updateData: UpdateRestaurant
): Promise<Restaurant> {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: existingRestaurant, error: checkError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking restaurant:", checkError);
    throw new Error(`Error checking restaurant: ${checkError.message}`);
  }

  if (!existingRestaurant) {
    throw new Error(`Restaurant with ID ${restaurantId} not found`);
  }

  const { data, error } = await supabase
    .from("restaurants")
    .update(updateData)
    .eq("id", restaurantId)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Error updating restaurant: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Failed to update restaurant. You may not have permission or the restaurant does not exist.`
    );
  }

  return data;
}

export async function deleteRestaurant(restaurantId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("restaurants")
    .delete()
    .eq("id", restaurantId);

  if (error) throw new Error(`Error deleting restaurant: ${error.message}`);
}
