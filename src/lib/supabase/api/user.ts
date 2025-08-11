"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getUserRestaurantContext() {
  noStore();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  console.log("user", user);

  const { data, error } = await supabase
    .from("user_roles")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .single();

  console.log("data", data);

  if (error) {
    console.error("Error fetching user restaurant context:", error);
    return null;
  }

  return data;
}
