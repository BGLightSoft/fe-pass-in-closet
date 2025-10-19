import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import { z } from "zod";
import {
  type CreateCredentialRequest,
  type UpdateCredentialRequest,
  type UpdateCredentialOrderRequest,
  type Credential,
  type CredentialParameterList,
  credentialSchema,
  credentialParameterListSchema,
} from "../schemas/credential-schemas";

export const credentialApi = {
  getByGroup: async (groupId: string): Promise<Credential[]> => {
    const response = await apiClient.get(`/credential/group/${groupId}`);
    const wrappedSchema = createResponseSchema(
      z.object({ items: z.array(credentialSchema) })
    );
    const data = wrappedSchema.parse(response.data);
    return data.items;
  },

  getParameterListByType: async (
    credentialGroupTypeId: string
  ): Promise<CredentialParameterList[]> => {
    const response = await apiClient.get(
      `/credential/parameter-list/${credentialGroupTypeId}`
    );
    const wrappedSchema = createResponseSchema(
      z.object({ items: z.array(credentialParameterListSchema) })
    );
    const data = wrappedSchema.parse(response.data);
    return data.items;
  },

  create: async (data: CreateCredentialRequest): Promise<Credential> => {
    const response = await apiClient.post("/credential", data);
    const wrappedSchema = createResponseSchema(credentialSchema);
    return wrappedSchema.parse(response.data);
  },

  update: async (
    id: string,
    data: UpdateCredentialRequest
  ): Promise<Credential> => {
    const response = await apiClient.patch(`/credential/${id}`, data);
    const wrappedSchema = createResponseSchema(credentialSchema);
    return wrappedSchema.parse(response.data);
  },

  updateOrder: async (
    groupId: string,
    data: UpdateCredentialOrderRequest
  ): Promise<void> => {
    await apiClient.patch(`/credential/group/${groupId}/order`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/credential/${id}`);
  },
};
