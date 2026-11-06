import { Request, Response } from "express";

export function getHealth(req: Request, res: Response) {
  // send back the same JSON as before: { status: "ok" }
  res.json({ status: "ok" });
}