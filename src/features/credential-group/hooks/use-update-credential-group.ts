import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialGroupApi } from "../api/credential-group-api";
import { useToast } from "@/shared/ui/use-toast";
import type { UpdateCredentialGroupRequest } from "../schemas/credential-group-schemas";

export function useUpdateCredentialGroup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCredentialGroupRequest;
    }) => {
      return credentialGroupApi.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
      toast({
        title: "✨ Group updated",
        description: `"${data.name}" has been updated successfully.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update group.",
        variant: "destructive",
      });
    },
  });
}
