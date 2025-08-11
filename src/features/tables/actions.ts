"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { routes } from "@/routes";

export async function updateTableWithQrCode(tableId: string, qrUrl: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tables")
    .update({ qr_code_url: qrUrl, qr_code_data: qrUrl })
    .eq("table_id", tableId);

  if (error) {
    console.error("Error updating table with QR code:", error);
    return { error: "Failed to update table." };
  }

  revalidatePath(routes.dashboard.tables);

  return { success: true };
}
