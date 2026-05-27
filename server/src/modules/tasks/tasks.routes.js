import { Router } from "express";

import { asyncHandler } from "../../middleware/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import {
  createTaskController,
  deleteTaskController,
  getTasksController,
  updateTaskController,
} from "./tasks.controller.js";
import { createTaskSchema, updateTaskSchema } from "./tasks.schemas.js";

const tasksRouter = Router();

tasksRouter.get("/", asyncHandler(getTasksController));
tasksRouter.post("/", validateBody(createTaskSchema), asyncHandler(createTaskController));
tasksRouter.patch(
  "/:id",
  // PATCH parcial con validacion para no sobrescribir campos no enviados.
  validateBody(updateTaskSchema),
  asyncHandler(updateTaskController)
);
tasksRouter.delete("/:id", asyncHandler(deleteTaskController));

export default tasksRouter;
