import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.slice(7); // Remove "Bearer " prefix

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.locals.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}