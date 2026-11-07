import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { userSchema } from "../schemas/user.schema";
import { publicUserSelect } from "../lib/user-select";

export async function listUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: publicUserSelect,
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}


export async function getuser(req: Request<{id: string}>, res: Response) {
    const {id}=req.params;
    try {
        const user = await prisma.user.findUnique({where:{id},select:publicUserSelect});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
}