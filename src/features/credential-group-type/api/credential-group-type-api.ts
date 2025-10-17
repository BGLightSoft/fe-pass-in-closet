import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import { z } from "zod";
import { credentialGroupTypeSchema } from "../schemas/credential-group-type-schemas";
import type { CredentialGroupType } from "../schemas/credential-group-type-schemas";

export const credentialGroupTypeApi = {
  getAll: async (): Promise<CredentialGroupType[]> => {
    const response = await apiClient.get("/credential-group-type");
    const wrappedSchema = createResponseSchema(
      z.object({ items: z.array(credentialGroupTypeSchema) })
    );
    const data = wrappedSchema.parse(response.data);
    return data.items;
  },
};
