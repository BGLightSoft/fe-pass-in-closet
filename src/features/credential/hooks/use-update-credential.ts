import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";
import { useToast } from "@/shared/ui/use-toast";
import type { UpdateCredentialRequest } from "../schemas/credential-schemas";

export function useUpdateCredential() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCredentialRequest;
    }) => {
      return credentialApi.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      queryClient.invalidateQueries({ queryKey: ["all-credentials"] });
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
      toast({
        title: "✨ Credential updated",
        description: `"${data.name}" has been updated successfully.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update credential.",
        variant: "destructive",
      });
    },
  });
}
