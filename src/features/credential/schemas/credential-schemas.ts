import { z } from "zod";

export const credentialSchema = z.object({
  id: z.string(),
  credentialGroupId: z.string().nullable(),
  name: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  parameters: z.record(z.unknown()).optional(),
});

export const createCredentialRequestSchema = z.object({
  credentialGroupId: z.string().uuid(),
  name: z.string().min(1, "Credential name is required").max(255),
  parameters: z.record(z.string()),
});

export const credentialParameterListSchema = z.object({
  id: z.string(),
  credentialGroupTypeId: z.string().nullable(),
  name: z.string().nullable(),
  data: z.record(z.unknown()).nullable(),
  isActive: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type Credential = z.infer<typeof credentialSchema>;
export type CreateCredentialRequest = z.infer<
  typeof createCredentialRequestSchema
>;
export type CredentialParameterList = z.infer<
  typeof credentialParameterListSchema
>;
