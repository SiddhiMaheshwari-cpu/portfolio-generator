import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { publicUserSelect } from "../lib/user-select";
import { registerSchema,loginSchema } from "../schemas/auth.schema";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

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
export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordOk = user ? await verifyPassword(password, user.passwordHash) : false;

    if (!user || !passwordOk) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
}