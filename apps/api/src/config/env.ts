import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),
  CLIENT_URL: z.string()
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  
    console.error("❌ Invalid environment variables:", result.error.format());
 
  process.exit(1);
}

export const env = result.data;