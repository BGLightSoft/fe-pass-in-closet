import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace-api";
import { useToast } from "@/shared/ui/use-toast";

export function useSetDefaultWorkspace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => workspaceApi.setDefault(id),
    onSuccess: () => {
      // Invalidate workspaces query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast({
        title: "✨ Default workspace set",
        description: "Workspace has been set as default successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to set default workspace.",
        variant: "destructive",
      });
    },
  });
}
