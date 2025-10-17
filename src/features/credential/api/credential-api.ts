import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import { z } from "zod";
import {
  type CreateCredentialRequest,
  type Credential,
  credentialSchema,
} from "../schemas/credential-schemas";

export const credentialApi = {
  getByGroup: async (groupId: string): Promise<Credential[]> => {
    const response = await apiClient.get(`/credential/group/${groupId}`);
    const wrappedSchema = createResponseSchema(z.array(credentialSchema));
    return wrappedSchema.parse(response.data);
  },

  create: async (data: CreateCredentialRequest): Promise<Credential> => {
    const response = await apiClient.post("/credential", data);
    const wrappedSchema = createResponseSchema(credentialSchema);
    return wrappedSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/credential/${id}`);
  },
};
