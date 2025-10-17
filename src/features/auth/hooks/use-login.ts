import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth-api";
import type { LoginRequest } from "../schemas/auth-schemas";
import { useAuthStore } from "../store/auth-store";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(
        response.account,
        response.authTokens.accessToken,
        response.authTokens.refreshToken
      );

      // Fetch workspaces after login
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      navigate("/dashboard");
    },
  });
}
