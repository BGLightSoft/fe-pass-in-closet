import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace-api";
import { useToast } from "@/shared/ui/use-toast";
import type { UpdateWorkspaceRequest } from "../schemas/workspace-schemas";

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWorkspaceRequest;
    }) => {
      return workspaceApi.update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast({
        title: "✨ Workspace updated",
        description: `"${data.name}" has been updated successfully.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update workspace.",
        variant: "destructive",
      });
    },
  });
}
