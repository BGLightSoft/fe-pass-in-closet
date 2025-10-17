import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace-api";
import type { CreateWorkspaceRequest } from "../schemas/workspace-schemas";
import { useWorkspaceStore } from "../store/workspace-store";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const { setCurrentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => workspaceApi.create(data),
    onSuccess: (newWorkspace) => {
      // Auto-select the newly created workspace
      setCurrentWorkspace(newWorkspace);
      // Refresh workspaces list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
