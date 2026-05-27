import { AppError } from "../../lib/errors.js";
import { sendSuccess } from "../../lib/http.js";
import { serializeTask } from "../../lib/task-serializer.js";
import {
  createTaskForUser,
  deleteTaskForUser,
  getTaskByUser,
  listTasksByUser,
  updateTaskForUser,
} from "./tasks.service.js";

function parseTaskId(taskIdValue) {
  const taskId = Number(taskIdValue);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new AppError("ID de tarea invalido", 400, "INVALID_TASK_ID");
  }
  return taskId;
}

export async function getTasksController(req, res) {
  const tasks = await listTasksByUser(req.user.id);
  return sendSuccess(
    res,
    tasks.map(serializeTask)
  );
}

export async function createTaskController(req, res) {
  const task = await createTaskForUser(req.user.id, req.validatedBody);
  return sendSuccess(res, serializeTask(task), 201);
}

export async function updateTaskController(req, res) {
  const taskId = parseTaskId(req.params.id);
  const result = await updateTaskForUser(req.user.id, taskId, req.validatedBody);

  if (result.count === 0) {
    throw new AppError("Tarea no encontrada", 404, "TASK_NOT_FOUND");
  }

  // Devolvemos la tarea ya persistida para que el frontend no tenga que reconstruir estado.
  const updatedTask = await getTaskByUser(req.user.id, taskId);
  return sendSuccess(res, serializeTask(updatedTask));
}

export async function deleteTaskController(req, res) {
  const taskId = parseTaskId(req.params.id);
  const result = await deleteTaskForUser(req.user.id, taskId);

  if (result.count === 0) {
    throw new AppError("Tarea no encontrada", 404, "TASK_NOT_FOUND");
  }

  return sendSuccess(res, { id: taskId });
}
