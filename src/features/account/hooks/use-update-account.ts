import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../api/account-api";
import { useToast } from "@/shared/ui/use-toast";
import type { UpdateAccountRequest } from "../types/account-types";

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountApi.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-account"] });
      toast({
        title: "✨ Account updated",
        description: "Your account has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update account.",
        variant: "destructive",
      });
    },
  });
}
