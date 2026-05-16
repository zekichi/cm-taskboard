import { prisma } from "../../lib/prisma.js";
import { parseDateOnlyInput } from "../../lib/date.js";

export async function listTasksByUser(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function createTaskForUser(userId, payload) {
  return prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description ?? null,
      platform: payload.platform,
      status: payload.status,
      dueDate: parseDateOnlyInput(payload.due_date),
      priority: payload.priority,
      userId,
    },
  });
}

export async function updateTaskForUser(userId, taskId, payload) {
  return prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data: {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
      ...(payload.platform !== undefined ? { platform: payload.platform } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.priority !== undefined ? { priority: payload.priority } : {}),
      ...(payload.due_date !== undefined
        ? { dueDate: parseDateOnlyInput(payload.due_date) }
        : {}),
    },
  });
}

export async function getTaskByUser(userId, taskId) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
}

export async function deleteTaskForUser(userId, taskId) {
  return prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });
}
