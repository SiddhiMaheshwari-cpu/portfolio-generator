import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { userSchema } from "../schemas/user.schema";

export async function listUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function createUser(req: Request, res: Response) {
  const result =userSchema.safeParse(req.body);
  if(!result.success){
    return res.status(400).json({

    error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
}
const { name, email } = result.data;

  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}