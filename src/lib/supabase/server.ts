// import { Database } from "@/types/database";

import { config } from "@/config";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    config.supabase.url as string,
    config.supabase.anonKey as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options ?? {});
          });
        },
      },
    }
  );
};
