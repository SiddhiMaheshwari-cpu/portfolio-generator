import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  // 1. print a clear message with console.error
    console.error("❌ Invalid environment variables:", result.error.format());
  // 2. stop the program with process.exit(1)
  process.exit(1);
}

export const env = result.data;