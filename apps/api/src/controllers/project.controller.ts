import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createProjectSchema } from "../schemas/project.schema";
import { updateProjectSchema } from "../schemas/project.schema";
export async function createProject(req: Request<{ id: string }>, res: Response) {
  const result = createProjectSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: req.params.id, userId: res.locals.userId },
      select: { id: true },
    });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const project = await prisma.project.create({
      data: { ...result.data, portfolioId: portfolio.id },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create project" });
  }
}
type ProjectParams = { id: string; projectId: string };

export async function updateProject(req: Request<ProjectParams>, res: Response) {
  const result = updateProjectSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  try {
    const project = await prisma.project.update({
      where: {
        id: req.params.projectId,
        portfolioId: req.params.id,
        portfolio: { userId: res.locals.userId },
      },
      data: result.data,
    });
    res.json(project);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to update project" });
  }
}

export async function deleteProject(req: Request<ProjectParams>, res: Response) {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.projectId,
        portfolioId: req.params.id,
        portfolio: { userId: res.locals.userId },
      },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to delete project" });
  }
}