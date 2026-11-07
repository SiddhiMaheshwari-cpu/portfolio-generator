import { Router } from "express";
import {
  createPortfolio,
  deletePortfolio,
  getMyPortfolio,
  listMyPortfolios,
  updatePortfolio,
} from "../controllers/portfolio.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const portfolioRouter = Router();

portfolioRouter.use(requireAuth);

portfolioRouter.get("/", listMyPortfolios);
portfolioRouter.post("/", createPortfolio);
portfolioRouter.get("/:id", getMyPortfolio);
portfolioRouter.patch("/:id", updatePortfolio);
portfolioRouter.delete("/:id", deletePortfolio);