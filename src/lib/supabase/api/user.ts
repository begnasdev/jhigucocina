"use server";

import { createServerClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getUserRestaurantContext() {
  noStore();
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user restaurant context:", error);
    return null;
  }

  return data;
}
