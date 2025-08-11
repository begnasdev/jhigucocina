"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getTablesByRestaurant(restaurantId: string) {
  noStore();

  console.log("restaurantId", restaurantId);

  const supabase = await createSupabaseServerClient();

  console.log("supabase", supabase);

  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurantId);

  console.log("data", data);

  if (error) {
    console.error("Error fetching tables:", error);
    return [];
  }

  return data;
}
