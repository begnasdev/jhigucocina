export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    storage: {
      buckets: {},
    },
  },

  endpoints: {
    tables: {
      root: "/tables",
      byId: (id: string) => `/tables/${id}`,
    },
  },
};
