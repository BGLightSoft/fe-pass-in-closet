import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";
import { useToast } from "@/shared/ui/use-toast";

export function useCreateCredential() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => {
      return credentialApi.create(data);
    },
    onSuccess: () => {
      // Invalidate credentials list
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      queryClient.invalidateQueries({ queryKey: ["all-credentials"] });
      // Invalidate credential groups to update counts
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
      toast({
        title: "✨ Credential created",
        description: "Your credential has been created successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create credential.",
        variant: "destructive",
      });
    },
  });
}
