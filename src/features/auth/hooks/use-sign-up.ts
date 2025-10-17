import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import type { SignUpRequest } from "../schemas/auth-schemas";

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data),
  });
}
