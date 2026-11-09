import express from "express";
import cors from "cors";
import helmet from "helmet";
import {env} from "./config/env";
import healthRouter from "./routes/health.routes";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { portfolioRouter } from "./routes/portfolio.routes";
import { errorHandler,  notFound } from "./middleware/error.middleware";
import { publicRouter } from "./routes/public.routes";


// 1. create the app
// 2. add express.json() middleware
// 3. mount the router: app.use("/health", healthRouter);
// 4. export default app
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json({ limit: "10kb" }));
app.use("/health", healthRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/portfolios",portfolioRouter);
app.use("/p", publicRouter);
app.use(notFound);
app.use(errorHandler);

export default app;