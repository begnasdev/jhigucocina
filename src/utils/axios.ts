import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiException } from "@/types/api";
import { config } from "@/config";
import { routes } from "@/routes";
import { createClient } from "@/lib/supabase/client";

const API_BASE_URL = config.apiUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (client-side only) - for authenticated requests
    if (typeof window !== "undefined") {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error in API client:", sessionError);
      }

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Transform error responses
    const errorData = error.response?.data as ApiError;
    const apiError: ApiError = {
      message:
        errorData?.message || error.message || "An unexpected error occurred",
      code: errorData?.code || "UNKNOWN_ERROR",
      status: error.response?.status || 500,
      details: errorData?.details,
    };

    if (error.response?.status === 401) {
      // Handle unauthorized access (client-side only)
      if (typeof window !== "undefined") {
        const supabase = createClient();
        // Instead of immediately signing out, let's check the session first
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (error || !session) {
            supabase.auth.signOut();

            window.location.href = routes.auth.login;
          } else {
          }
        });
      }
    }

    throw new ApiException(apiError, error);
  }
);
