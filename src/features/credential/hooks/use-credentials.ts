import { useQuery } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";

export function useCredentials(groupId: string | undefined) {
  return useQuery({
    queryKey: ["credentials", groupId],
    queryFn: () => credentialApi.getByGroup(groupId!),
    enabled: !!groupId,
  });
}
