import { z } from "zod";

// Common schemas
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export const timestampsSchema = z.object({
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  deletedAt: z.string().or(z.date()).nullable().optional(),
});

// Helper type
export type Pagination = z.infer<typeof paginationSchema>;
