import { Calendar, Trash2, Pencil, ArrowRight } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../lib/utils";

import PlatformBadge from "./PlatformBadge";
import StatusBadge from "./StatusBadge";
import { Button } from "../ui/button";
import { api } from "../../api/apiClient";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const statuses = ["pendiente", "en diseño", "aprobado", "publicado"];

const priorityIndicator = {
  alta: "border-l-red-400",
  media: "border-l-amber-400",
  baja: "border-l-emerald-400",
};

export default function TaskCard({ task, onEdit, onRefresh, compact = false }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      onRefresh?.();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/tasks/${task.id}`, { status: newStatus });
      onRefresh?.();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const nextStatus = statuses[statuses.indexOf(task.status) + 1];

  const isOverdue =
    task.due_date &&
    isPast(new Date(task.due_date)) &&
    !isToday(new Date(task.due_date)) &&
    task.status !== "publicado";

  return (
    <div
      className={cn(
        "group bg-card rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-l-[3px]",
        priorityIndicator[task.priority] || "border-l-border"
      )}
    >
      <div className={cn("p-4", compact && "p-3")}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className={cn(
              "font-semibold text-foreground leading-tight",
              compact ? "text-sm" : "text-base"
            )}
          >
            {task.title}
          </h3>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit?.(task)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {!compact && task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <PlatformBadge platform={task.platform} />
          <StatusBadge status={task.status} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Due date */}
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
            <span className="text-xs text-muted-foreground/50">Sin fecha</span>
          )}

          {/* Status change */}
          {nextStatus && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-primary hover:text-primary"
                >
                  Mover <ArrowRight className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {statuses
                  .filter((s) => s !== task.status)
                  .map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="capitalize"
                    >
                      {s}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
