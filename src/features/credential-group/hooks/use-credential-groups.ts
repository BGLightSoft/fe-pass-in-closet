import { useQuery } from "@tanstack/react-query";
import { credentialGroupApi } from "../api/credential-group-api";

export function useCredentialGroups() {
  return useQuery({
    queryKey: ["credential-groups"],
    queryFn: credentialGroupApi.getAll,
  });
}
