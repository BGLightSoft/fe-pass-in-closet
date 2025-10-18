import { useQuery } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";

export function useCredentialParameterList(
  credentialGroupTypeId: string | null
) {
  return useQuery({
    queryKey: ["credential-parameter-list", credentialGroupTypeId],
    queryFn: () => credentialApi.getParameterListByType(credentialGroupTypeId!),
    enabled: !!credentialGroupTypeId,
  });
}
