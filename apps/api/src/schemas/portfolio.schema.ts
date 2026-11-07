import { z } from "zod";

export const createPortfolioSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  bio: z.string().max(500).optional(),
});
export const updatePortfolioSchema = createPortfolioSchema.partial();