import { toast } from "@/shared/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialGroupApi } from "../api/credential-group-api";

export function useDeleteCredentialGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => credentialGroupApi.delete(id),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "🗑️ Group deleted",
        description:
          "The group and all its contents have been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
      queryClient.invalidateQueries({ queryKey: ["all-credentials"] });
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "❌ Failed to delete group",
        description: error.message || "Please try again later.",
      });
    },
  });
}
