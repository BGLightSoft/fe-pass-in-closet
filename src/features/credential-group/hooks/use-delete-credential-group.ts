import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialGroupApi } from "../api/credential-group-api";

export function useDeleteCredentialGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => credentialGroupApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
    },
  });
}
