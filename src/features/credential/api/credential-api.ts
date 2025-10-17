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
    const wrappedSchema = createResponseSchema(
      z.object({ items: z.array(credentialSchema) })
    );
    const data = wrappedSchema.parse(response.data);
    return data.items;
  },

  create: async (data: CreateCredentialRequest): Promise<Credential> => {
    console.log("🌐 API Request - POST /credential:", data);
    const response = await apiClient.post("/credential", data);
    console.log("🌐 API Response:", response.data);
    const wrappedSchema = createResponseSchema(credentialSchema);
    return wrappedSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/credential/${id}`);
  },
};
