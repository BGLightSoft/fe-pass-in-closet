import { useQuery } from "@tanstack/react-query";
import { credentialGroupTypeApi } from "../api/credential-group-type-api";

export function useCredentialGroupTypes() {
  return useQuery({
    queryKey: ["credential-group-types"],
    queryFn: credentialGroupTypeApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes - types don't change often
  });
}
