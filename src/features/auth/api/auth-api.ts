import { apiClient } from "@/shared/api/client";
import {
  type LoginRequest,
  type LoginResponse,
  type SignUpRequest,
  type SignUpResponse,
  loginSchema,
  signUpSchema,
} from "../schemas/auth-schemas";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/log-in", data);
    return loginSchema.parse(response.data);
  },

  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiClient.post("/auth/sign-up", data);
    return signUpSchema.parse(response.data);
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  getMyAccount: async () => {
    const response = await apiClient.get("/account/my");
    return response.data;
  },
};
