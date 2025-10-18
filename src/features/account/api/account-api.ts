import { apiClient } from "@/shared/api/client";
import type {
  GetMyAccountResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  DeleteAccountResponse,
} from "../types/account-types";

export const accountApi = {
  getMyAccount: async (): Promise<GetMyAccountResponse> => {
    const response = await apiClient.get("/account/my");
    return response.data.payload;
  },

  updateAccount: async (
    accountId: string,
    data: UpdateAccountRequest
  ): Promise<UpdateAccountResponse> => {
    const response = await apiClient.patch(`/account/${accountId}`, data);
    return response.data.payload;
  },

  updatePassword: async (
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> => {
    const response = await apiClient.put("/account/password", data);
    return response.data.payload;
  },

  deleteAccount: async (accountId: string): Promise<DeleteAccountResponse> => {
    const response = await apiClient.delete(`/account/${accountId}`);
    return response.data.payload;
  },
};
