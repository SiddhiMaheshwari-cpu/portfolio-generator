import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  url: z.url().optional(),
});
export const updateProjectSchema = createProjectSchema.partial();