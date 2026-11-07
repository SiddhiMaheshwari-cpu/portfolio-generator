import { Router } from "express";
import {
  createPortfolio,
  deletePortfolio,
  getMyPortfolio,
  listMyPortfolios,
  updatePortfolio,
} from "../controllers/portfolio.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { createProject, deleteProject, updateProject } from "../controllers/project.controller";

export const portfolioRouter = Router();

portfolioRouter.use(requireAuth);

portfolioRouter.get("/", listMyPortfolios);
portfolioRouter.post("/", createPortfolio);
portfolioRouter.get("/:id", getMyPortfolio);
portfolioRouter.patch("/:id", updatePortfolio);
portfolioRouter.delete("/:id", deletePortfolio);
portfolioRouter.post("/:id/projects", createProject);
portfolioRouter.patch("/:id/projects/:projectId", updateProject);
portfolioRouter.delete("/:id/projects/:projectId", deleteProject);