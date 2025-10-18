import { z } from "zod";

export const workspaceSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .nullable()
    .transform((val) => (val === null ? "" : String(val))),
  isActive: z.boolean(),
  isDefault: z.boolean().optional(),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) =>
      val instanceof Date ? val.toISOString() : String(val)
    ),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) =>
      val instanceof Date ? val.toISOString() : String(val)
    ),
});

export const createWorkspaceRequestSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(255),
});

export const updateWorkspaceRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type CreateWorkspaceRequest = z.infer<
  typeof createWorkspaceRequestSchema
>;
export type UpdateWorkspaceRequest = z.infer<
  typeof updateWorkspaceRequestSchema
>;
