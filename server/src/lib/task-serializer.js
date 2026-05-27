import { toDateOnlyString } from "./date.js";

export function serializeTask(task) {
  // Convertimos naming interno (dueDate) al contrato publico (due_date).
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    platform: task.platform,
    status: task.status,
    due_date: toDateOnlyString(task.dueDate),
    priority: task.priority,
    userId: task.userId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
