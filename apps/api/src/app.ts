import express from "express";
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
app.use("/health", healthRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/portfolios",portfolioRouter);
app.use(notFound);
app.use(errorHandler);
app.use("/p", publicRouter);
export default app;