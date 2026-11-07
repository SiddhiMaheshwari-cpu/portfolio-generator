import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

import { createPortfolioSchema, updatePortfolioSchema } from "../schemas/portfolio.schema";
export async function createPortfolio(req: Request, res: Response) {
  const result = createPortfolioSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  const { title, slug, bio } = result.data;

  try {
    const portfolio = await prisma.portfolio.create({
      data: { title, slug, bio, userId: res.locals.userId },
    });
    res.status(201).json(portfolio);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return res.status(409).json({ error: "Slug already taken" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create portfolio" });
  }
}

export async function listMyPortfolios(_req: Request, res: Response) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: res.locals.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(portfolios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch portfolios" });
  }
}
export async function getMyPortfolio(req: Request<{ id: string }>, res: Response) {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: req.params.id, userId: res.locals.userId },
    });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
}

export async function updatePortfolio(req: Request<{ id: string }>, res: Response) {
  const result = updatePortfolioSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  try {
    const portfolio = await prisma.portfolio.update({
      where: { id: req.params.id, userId: res.locals.userId },
      data: result.data,
    });
    res.json(portfolio);
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Slug already taken" });
      }
    }
    console.error(error);
    res.status(500).json({ error: "Failed to update portfolio" });
  }
}

export async function deletePortfolio(req: Request<{ id: string }>, res: Response) {
  try {
    await prisma.portfolio.delete({
      where: { id: req.params.id, userId: res.locals.userId },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to delete portfolio" });
  }
}