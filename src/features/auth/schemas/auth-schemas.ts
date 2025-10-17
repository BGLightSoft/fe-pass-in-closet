import { z } from "zod";
import { createResponseSchema } from "@/shared/api/response-wrapper";

// Login schemas
export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginPayloadSchema = z.object({
  account: z.object({
    id: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    isFrozen: z.boolean(),
    createdAt: z.string().or(z.date()),
    updatedAt: z.string().or(z.date()),
    accountParameters: z.record(z.unknown()).optional(),
  }),
  authTokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export const loginSchema = createResponseSchema(loginPayloadSchema);

export const signUpRequestSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const signUpPayloadSchema = z.object({
  signUpVerifiedToken: z.string(),
  message: z.string(),
});

export const signUpSchema = createResponseSchema(signUpPayloadSchema);

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginSchema>;
export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignUpResponse = z.infer<typeof signUpSchema>;
