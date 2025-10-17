import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { workspaceApi } from "../api/workspace-api";
import { useWorkspaceStore } from "../store/workspace-store";

export function useWorkspaces() {
  const { setWorkspaces, initializeWorkspace, isInitialized } =
    useWorkspaceStore();

  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceApi.getAll,
  });

  useEffect(() => {
    if (query.data) {
      if (!isInitialized) {
        // First time loading workspaces - auto-select default
        initializeWorkspace(query.data);
      } else {
        // Subsequent loads - just update the list, preserve selection
        setWorkspaces(query.data);
      }
    }
  }, [query.data, setWorkspaces, initializeWorkspace, isInitialized]);

  return query;
}
