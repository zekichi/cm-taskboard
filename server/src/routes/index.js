import { Router } from "express";

import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import authRouter from "../modules/auth/auth.routes.js";
import tasksRouter from "../modules/tasks/tasks.routes.js";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

apiRouter.use("/auth", authRouter);
// Protegemos todas las rutas de tareas bajo el mismo middleware.
apiRouter.use("/tasks", asyncHandler(authMiddleware), tasksRouter);

export default apiRouter;
