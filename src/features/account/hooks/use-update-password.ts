import { useMutation } from "@tanstack/react-query";
import { accountApi } from "../api/account-api";
import { useToast } from "@/shared/ui/use-toast";
import type { UpdatePasswordRequest } from "../types/account-types";

export function useUpdatePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) =>
      accountApi.updatePassword(data),
    onSuccess: () => {
      toast({
        title: "✨ Password updated",
        description: "Your password has been changed successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    },
  });
}
