import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rate-limit.middleware";
export const authRouter = Router();
authRouter.post("/register",authLimiter, register);
authRouter.post("/login",authLimiter ,login);
authRouter.get("/me", requireAuth, me);