import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:3005"),
  VITE_APP_NAME: z.string().default("Pass-in-Closet"),
});

const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
});

export { env };
