import { useQuery } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";

export function useCredentialParameterList(
  credentialGroupTypeId: string | null
) {
  console.log(
    "🔍 useCredentialParameterList called with:",
    credentialGroupTypeId
  );

  return useQuery({
    queryKey: ["credential-parameter-list", credentialGroupTypeId],
    queryFn: () => {
      console.log(
        "🔍 API call to get parameter list for type:",
        credentialGroupTypeId
      );
      return credentialApi.getParameterListByType(credentialGroupTypeId!);
    },
    enabled: !!credentialGroupTypeId,
  });
}
