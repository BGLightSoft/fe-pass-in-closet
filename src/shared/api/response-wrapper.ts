import { z } from "zod";

/**
 * Backend response wrapper schema
 * All API responses come wrapped in this format
 */
export function createResponseSchema<T extends z.ZodTypeAny>(payloadSchema: T) {
  return z
    .object({
      responseType: z.number(),
      path: z.string(),
      timestamp: z.string(),
      payload: payloadSchema,
    })
    .transform((data) => data.payload);
}
