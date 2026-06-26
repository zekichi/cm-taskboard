import { ArrowRight, Calendar, Pencil, Trash2 } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";

import { useDeleteTask, useUpdateTaskStatus } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PRIORITY_INDICATOR,
  TASK_STATUS,
  TASK_STATUSES,
} from "@/constants/task-options";
import { cn } from "@/lib/utils";

import PlatformBadge from "./PlatformBadge";
import StatusBadge from "./StatusBadge";

export default function TaskCard({ task, onEdit, compact = false }) {
  const deleteTask = useDeleteTask();
  const updateStatus = useUpdateTaskStatus();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`
    );

    if (confirmed) {
      deleteTask.mutate(task.id);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateStatus.mutate({ id: task.id, status: newStatus });
  };

  const nextStatus = TASK_STATUSES[TASK_STATUSES.indexOf(task.status) + 1];
  const isBusy = deleteTask.isPending || updateStatus.isPending;

  const isOverdue =
    task.due_date &&
    isPast(new Date(task.due_date)) &&
    !isToday(new Date(task.due_date)) &&
    task.status !== TASK_STATUS.PUBLISHED;

  return (
    <div
      className={cn(
        "group bg-card rounded-lg border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-l-[3px]",
        PRIORITY_INDICATOR[task.priority] || "border-l-border",
        isBusy && "opacity-70"
      )}
    >
      <div className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className={cn(
              "font-semibold text-foreground leading-tight break-words",
              compact ? "text-sm" : "text-base"
            )}
          >
            {task.title}
          </h3>

          <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit?.(task)}
              aria-label="Editar tarea"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              aria-label="Eliminar tarea"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {!compact && task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <PlatformBadge platform={task.platform} />
          <StatusBadge status={task.status} />
        </div>

        <div className="mb-3 space-y-1 text-xs text-muted-foreground">
          {task.team && <p>Equipo: {task.team.name}</p>}
          {task.assignedTo && (
            <p>Responsable: {task.assignedTo.name || task.assignedTo.email}</p>
          )}
          {task.createdBy && (
            <p>Creada por: {task.createdBy.name || task.createdBy.email}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          {task.due_date ? (
            <span
              className={cn(
                "flex items-center gap-1.5 text-xs",
                isOverdue
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), "d MMM yyyy", { locale: es })}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/70">Sin fecha</span>
          )}

          {nextStatus && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-primary hover:text-primary"
                  disabled={updateStatus.isPending}
                >
                  Mover <ArrowRight className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {TASK_STATUSES.filter((status) => status !== task.status).map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
