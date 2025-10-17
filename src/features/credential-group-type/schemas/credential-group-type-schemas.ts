import { z } from "zod";

export const credentialGroupTypeSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type CredentialGroupType = z.infer<typeof credentialGroupTypeSchema>;
