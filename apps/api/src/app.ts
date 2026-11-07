import express from "express";
import healthRouter from "./routes/health.routes";
import { userRouter } from "./routes/user.routes";

// 1. create the app
// 2. add express.json() middleware
// 3. mount the router: app.use("/health", healthRouter);
// 4. export default app
const app = express();
app.use(express.json());
app.use("/health", healthRouter);
app.use("/users", userRouter);
export default app;