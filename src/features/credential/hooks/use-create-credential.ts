import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";
import { useToast } from "@/shared/ui/use-toast";

export function useCreateCredential() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => {
      console.log("🚀 API Call - Creating credential:", data);
      return credentialApi.create(data);
    },
    onSuccess: (data) => {
      console.log("✅ API Success - Credential created:", data);
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      toast({
        title: "✨ Credential created",
        description: "Your credential has been created successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("❌ API Error - Credential creation failed:", error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create credential.",
        variant: "destructive",
      });
    },
  });
}
