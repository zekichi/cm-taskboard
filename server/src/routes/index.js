import { Router } from "express";

import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import authRouter from "../modules/auth/auth.routes.js";
import organizationsRouter from "../modules/organizations/organizations.routes.js";
import tasksRouter from "../modules/tasks/tasks.routes.js";
import teamsRouter from "../modules/teams/teams.routes.js";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/organizations", asyncHandler(authMiddleware), organizationsRouter);
apiRouter.use("/teams", asyncHandler(authMiddleware), teamsRouter);
apiRouter.use("/tasks", asyncHandler(authMiddleware), tasksRouter);

export default apiRouter;
