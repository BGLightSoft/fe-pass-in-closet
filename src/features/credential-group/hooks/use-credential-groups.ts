import { useQuery } from "@tanstack/react-query";
import { credentialGroupApi } from "../api/credential-group-api";
import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";

export function useCredentialGroups() {
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["credential-groups", currentWorkspace?.id],
    queryFn: credentialGroupApi.getAll,
    enabled: !!currentWorkspace, // Only fetch when workspace is selected
  });
}
