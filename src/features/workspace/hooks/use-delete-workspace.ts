import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace-api";
import { toast } from "@/shared/ui/use-toast";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspaceApi.delete(id),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "🗑️ Workspace deleted",
        description: "The workspace and all its data have been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "❌ Failed to delete workspace",
        description: error.message || "Please try again later.",
      });
    },
  });
}
