"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getTablesByRestaurant(restaurantId: string) {
  noStore();

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error("Error fetching tables:", error);
    return [];
  }

  return data;
}
