import { env } from "@/shared/config/env";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    const workspaceId = localStorage.getItem("workspace_id");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (workspaceId && config.headers) {
      config.headers["workspace-id"] = workspaceId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("workspace_id");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export type ApiError = AxiosError<{
  message: string;
  statusCode: number;
}>;
