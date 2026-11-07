import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";
import { publicUserSelect } from "../lib/user-select";
import { registerSchema } from "../schemas/auth.schema";

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  const { email, password, name } = result.data;

  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: publicUserSelect,
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to register" });
  }
}