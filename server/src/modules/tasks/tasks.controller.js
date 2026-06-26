import { AppError } from "../../lib/errors.js";
import { sendSuccess } from "../../lib/http.js";
import { serializeTask } from "../../lib/task-serializer.js";
import {
  createTaskForUser,
  deleteTaskForUser,
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

function parseOptionalId(value) {
  if (!value) {
    return null;
  }

  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Filtro invalido", 400, "INVALID_FILTER");
  }
  return id;
}

export async function getTasksController(req, res) {
  const tasks = await listTasksByUser(req.user.id, {
    organizationId: parseOptionalId(req.query.organizationId),
    teamId: parseOptionalId(req.query.teamId),
    assignedToId: parseOptionalId(req.query.assignedToId),
  });
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
  const task = await updateTaskForUser(req.user.id, taskId, req.validatedBody);
  return sendSuccess(res, serializeTask(task));
}

export async function deleteTaskController(req, res) {
  const taskId = parseTaskId(req.params.id);
  const result = await deleteTaskForUser(req.user.id, taskId);
  return sendSuccess(res, result);
}
