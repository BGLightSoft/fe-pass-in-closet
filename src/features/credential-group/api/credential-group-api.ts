import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import { z } from "zod";
import {
  type CreateCredentialGroupRequest,
  type CredentialGroup,
  credentialGroupSchema,
} from "../schemas/credential-group-schemas";

export const credentialGroupApi = {
  getAll: async (): Promise<CredentialGroup[]> => {
    const response = await apiClient.get("/credential-group");
    const wrappedSchema = createResponseSchema(z.array(credentialGroupSchema));
    return wrappedSchema.parse(response.data);
  },

  create: async (
    data: CreateCredentialGroupRequest
  ): Promise<CredentialGroup> => {
    const response = await apiClient.post("/credential-group", data);
    const wrappedSchema = createResponseSchema(credentialGroupSchema);
    return wrappedSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/credential-group/${id}`);
  },
};
