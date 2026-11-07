import { Router } from "express";
import { getPublicPortfolio } from "../controllers/portfolio.controller";

export const publicRouter = Router();

publicRouter.get("/:slug", getPublicPortfolio);