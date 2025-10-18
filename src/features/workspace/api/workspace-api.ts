import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import { z } from "zod";
import {
  type CreateWorkspaceRequest,
  type UpdateWorkspaceRequest,
  type Workspace,
  workspaceSchema,
} from "../schemas/workspace-schemas";

export const workspaceApi = {
  getAll: async (): Promise<Workspace[]> => {
    const response = await apiClient.get("/workspace");
    const wrappedSchema = createResponseSchema(
      z.object({ items: z.array(workspaceSchema) })
    );
    const data = wrappedSchema.parse(response.data);
    return data.items;
  },

  create: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.post("/workspace", data);
    const wrappedSchema = createResponseSchema(workspaceSchema);
    return wrappedSchema.parse(response.data);
  },

  update: async (
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.patch(`/workspace/${id}`, data);
    const wrappedSchema = createResponseSchema(workspaceSchema);
    return wrappedSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workspace/${id}`);
  },

  setDefault: async (id: string): Promise<void> => {
    await apiClient.patch(`/workspace/${id}/set-default`);
  },
};
