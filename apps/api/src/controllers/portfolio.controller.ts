import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createPortfolioSchema } from "../schemas/portfolio.schema";

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