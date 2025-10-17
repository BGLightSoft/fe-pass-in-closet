import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { workspaceApi } from "../api/workspace-api";
import { useWorkspaceStore } from "../store/workspace-store";

export function useWorkspaces() {
  const { setWorkspaces } = useWorkspaceStore();

  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceApi.getAll,
  });

  useEffect(() => {
    if (query.data) {
      setWorkspaces(query.data);
    }
  }, [query.data, setWorkspaces]);

  return query;
}
