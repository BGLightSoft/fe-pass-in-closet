import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";

export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => credentialApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });
}
