import { z } from "zod";

export const credentialGroupSchema: z.ZodType<CredentialGroup> = z.lazy(() =>
  z.object({
    id: z.string(),
    credentialGroupTypeId: z.string().nullable(),
    credentialGroupId: z.string().nullable(),
    workspaceId: z.string(),
    name: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().or(z.date()),
    updatedAt: z.string().or(z.date()),
    children: z.array(credentialGroupSchema).optional(),
  })
);

export const createCredentialGroupRequestSchema = z.object({
  credentialGroupTypeName: z.string().min(1, "Type name is required"),
  credentialGroupId: z.string().uuid().optional(),
  name: z.string().min(1, "Group name is required").max(255),
});

export type CredentialGroup = {
  id: string;
  credentialGroupTypeId: string | null;
  credentialGroupId: string | null;
  workspaceId: string;
  name: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  children?: CredentialGroup[] | undefined;
};

export type CreateCredentialGroupRequest = z.infer<
  typeof createCredentialGroupRequestSchema
>;
