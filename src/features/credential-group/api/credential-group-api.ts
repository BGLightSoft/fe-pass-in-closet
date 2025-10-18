import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import { z } from "zod";
import {
  type CreateCredentialGroupRequest,
  type UpdateCredentialGroupRequest,
  type CredentialGroup,
  credentialGroupSchema,
} from "../schemas/credential-group-schemas";

export const credentialGroupApi = {
  getAll: async (): Promise<CredentialGroup[]> => {
    const response = await apiClient.get("/credential-group");
    const wrappedSchema = createResponseSchema(
      z.object({ items: z.array(credentialGroupSchema) })
    );
    const data = wrappedSchema.parse(response.data);
    return data.items;
  },

  create: async (
    data: CreateCredentialGroupRequest
  ): Promise<CredentialGroup> => {
    const response = await apiClient.post("/credential-group", data);
    const wrappedSchema = createResponseSchema(credentialGroupSchema);
    return wrappedSchema.parse(response.data);
  },

  update: async (
    id: string,
    data: UpdateCredentialGroupRequest
  ): Promise<CredentialGroup> => {
    const response = await apiClient.patch(`/credential-group/${id}`, data);
    const wrappedSchema = createResponseSchema(credentialGroupSchema);
    return wrappedSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/credential-group/${id}`);
  },
};
