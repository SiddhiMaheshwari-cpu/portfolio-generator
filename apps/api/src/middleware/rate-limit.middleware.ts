import { rateLimit } from "express-rate-limit";
import {env} from "../config/env";
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,

  message: { error: "Too many attempts, please try again later" },
  skip:()=> env.NODE_ENV === "test",
});