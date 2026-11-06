import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

// 1. create a router: const router = Router();
const router = Router();
// 2. connect GET "/" to getHealth: router.get("/", getHealth);
router.get("/", getHealth);
// 3. export it: export default router;
export default router;