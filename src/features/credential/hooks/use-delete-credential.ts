import { useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialApi } from "../api/credential-api";

export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => credentialApi.delete(id),
    onSuccess: () => {
      // Invalidate credentials list
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      // Invalidate credential groups to update counts
      queryClient.invalidateQueries({ queryKey: ["credential-groups"] });
    },
  });
}
