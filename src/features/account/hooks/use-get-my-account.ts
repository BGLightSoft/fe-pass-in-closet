import { useQuery } from "@tanstack/react-query";
import { accountApi } from "../api/account-api";

export function useGetMyAccount() {
  return useQuery({
    queryKey: ["my-account"],
    queryFn: accountApi.getMyAccount,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
