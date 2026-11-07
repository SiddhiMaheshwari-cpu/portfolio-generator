import {Router} from "express";
import { createPortfolio, listMyPortfolios} from "../controllers/portfolio.controller";
import { requireAuth } from "../middleware/auth.middleware";
export const portfolioRouter = Router();
portfolioRouter.use(requireAuth);
portfolioRouter.get("/", listMyPortfolios);
portfolioRouter.post("/", createPortfolio);