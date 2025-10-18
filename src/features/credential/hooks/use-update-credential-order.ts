import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";
import { useToast } from "@/shared/ui/use-toast";
import type { UpdateCredentialOrderRequest } from "../schemas/credential-schemas";

export function useUpdateCredentialOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: UpdateCredentialOrderRequest;
    }) => {
      return credentialApi.updateOrder(groupId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
      toast({
        title: "✨ Order updated",
        description: "Credential order has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update credential order.",
        variant: "destructive",
      });
    },
  });
}
