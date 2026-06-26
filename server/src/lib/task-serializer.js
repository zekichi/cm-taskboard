import { toDateOnlyString } from "./date.js";
import { serializeTeam, serializeUser } from "./workspace-serializer.js";

export function serializeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    platform: task.platform,
    status: task.status,
    due_date: toDateOnlyString(task.dueDate),
    priority: task.priority,
    organizationId: task.organizationId,
    teamId: task.teamId,
    userId: task.userId,
    assignedToId: task.assignedToId,
    organization: task.organization
      ? {
          id: task.organization.id,
          name: task.organization.name,
        }
      : null,
    team: task.team ? serializeTeam(task.team) : null,
    createdBy: serializeUser(task.createdBy),
    assignedTo: serializeUser(task.assignedTo),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
