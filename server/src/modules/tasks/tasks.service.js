import {
  canAssignTasks,
  canManageTasks,
  requireOrganizationMembership,
  requireOrganizationPermission,
} from "../../lib/access-control.js";
import { parseDateOnlyInput } from "../../lib/date.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

const taskInclude = {
  organization: true,
  team: {
    include: {
      members: {
        include: { user: { select: { id: true, email: true, name: true } } },
      },
    },
  },
  createdBy: { select: { id: true, email: true, name: true } },
  assignedTo: { select: { id: true, email: true, name: true } },
};

export async function listTasksByUser(userId, filters = {}) {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: { organizationId: true },
  });
  const organizationIds = memberships.map((membership) => membership.organizationId);

  return prisma.task.findMany({
    where: {
      organizationId: filters.organizationId
        ? filters.organizationId
        : { in: organizationIds },
      ...(filters.teamId ? { teamId: filters.teamId } : {}),
      ...(filters.assignedToId ? { assignedToId: filters.assignedToId } : {}),
    },
    include: taskInclude,
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function createTaskForUser(userId, payload) {
  await requireOrganizationPermission(
    userId,
    payload.organizationId,
    canManageTasks,
    "No puedes crear tareas en esta organización"
  );
  await assertTaskRelations(payload.organizationId, payload.teamId, payload.assignedToId);

  return prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description ?? null,
      platform: payload.platform,
      status: payload.status,
      dueDate: parseDateOnlyInput(payload.due_date),
      priority: payload.priority,
      organizationId: payload.organizationId,
      teamId: payload.teamId ?? null,
      assignedToId: payload.assignedToId ?? null,
      userId,
    },
    include: taskInclude,
  });
}

export async function updateTaskForUser(userId, taskId, payload) {
  const existing = await getTaskByAccessibleUser(userId, taskId);
  if (!existing) {
    throw new AppError("Tarea no encontrada", 404, "TASK_NOT_FOUND");
  }

  const organizationId = payload.organizationId ?? existing.organizationId;
  await requireOrganizationPermission(
    userId,
    organizationId,
    canManageTasks,
    "No puedes editar tareas en esta organización"
  );

  if (payload.assignedToId !== undefined) {
    await requireOrganizationPermission(
      userId,
      organizationId,
      canAssignTasks,
      "No puedes asignar tareas en esta organización"
    );
  }

  await assertTaskRelations(
    organizationId,
    payload.teamId !== undefined ? payload.teamId : existing.teamId,
    payload.assignedToId !== undefined ? payload.assignedToId : existing.assignedToId
  );

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
      ...(payload.platform !== undefined ? { platform: payload.platform } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.priority !== undefined ? { priority: payload.priority } : {}),
      ...(payload.organizationId !== undefined
        ? { organizationId: payload.organizationId }
        : {}),
      ...(payload.teamId !== undefined ? { teamId: payload.teamId } : {}),
      ...(payload.assignedToId !== undefined
        ? { assignedToId: payload.assignedToId }
        : {}),
      ...(payload.due_date !== undefined
        ? { dueDate: parseDateOnlyInput(payload.due_date) }
        : {}),
    },
    include: taskInclude,
  });
}

export async function getTaskByAccessibleUser(userId, taskId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: taskInclude,
  });

  if (!task) {
    return null;
  }

  await requireOrganizationMembership(userId, task.organizationId);
  return task;
}

export async function deleteTaskForUser(userId, taskId) {
  const task = await getTaskByAccessibleUser(userId, taskId);
  if (!task) {
    throw new AppError("Tarea no encontrada", 404, "TASK_NOT_FOUND");
  }

  await requireOrganizationPermission(
    userId,
    task.organizationId,
    canManageTasks,
    "No puedes eliminar tareas en esta organización"
  );

  await prisma.task.delete({ where: { id: taskId } });
  return { id: taskId };
}

async function assertTaskRelations(organizationId, teamId, assignedToId) {
  if (teamId) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, organizationId },
    });
    if (!team) {
      throw new AppError("El equipo no pertenece a la organización", 400, "TEAM_ORG_MISMATCH");
    }
  }

  if (assignedToId) {
    const member = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: assignedToId,
        },
      },
    });
    if (!member) {
      throw new AppError(
        "El responsable debe pertenecer a la organización",
        400,
        "ASSIGNEE_ORG_MISMATCH"
      );
    }
  }
}
