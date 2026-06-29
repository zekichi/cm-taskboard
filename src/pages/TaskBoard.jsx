import { useState } from "react";
import { Plus } from "lucide-react";

import { useTasks } from "@/api/tasks";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import LoadingState from "@/components/feedback/LoadingState";
import TaskCard from "@/components/taskboard/TaskCard";
import TaskFormDialog from "@/components/taskboard/TaskFormDialog";
import { Button } from "@/components/ui/button";
import { TASK_STATUS, TASK_STATUS_OPTIONS } from "@/constants/task-options";
import { useWorkspace } from "@/lib/WorkspaceContext";
import { cn } from "@/lib/utils";

export default function TaskBoard() {
  const { organizationId, teamId, permissions } = useWorkspace();
  const { data: tasks = [], isLoading, isError, refetch } = useTasks({
    organizationId,
    teamId,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(TASK_STATUS.PENDING);
  const canManageTasks = permissions.manageTasks;

  const openNewTask = (status) => {
    setEditTask(null);
    setDefaultStatus(status);
    setFormOpen(true);
  };

  if (isLoading) {
    return <LoadingState label="Cargando tablero..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el tablero"
        message="Revisa que el backend esté disponible y vuelve a intentar."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Kanban operativo
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tablero
          </h1>
          <p className="mt-1 text-muted-foreground">
            Vista por estado de las tareas del equipo seleccionado.
          </p>
        </div>
      </div>

      {tasks.length === 0 && (
        <EmptyState
          title="Todavía no hay tareas"
          description={
            canManageTasks
              ? "Crea tu primera tarea desde cualquier columna."
              : "Cuando el equipo cree tareas, aparecerán en este tablero."
          }
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_STATUS_OPTIONS.map((column) => {
          const ColumnIcon = column.icon;
          const columnTasks = tasks.filter((task) => task.status === column.key);

          return (
            <section key={column.key} className="flex flex-col">
              <div className="mb-3 flex items-center gap-2 px-1">
                <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
                <ColumnIcon className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  {column.label}
                </h2>
                <span className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>

              <div className="kanban-column min-h-[260px] flex-1 space-y-3 rounded-lg border border-white/10 bg-secondary/30 p-3 shadow-inner shadow-black/10">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    onEdit={(selectedTask) => {
                      setEditTask(selectedTask);
                      setFormOpen(true);
                    }}
                  />
                ))}

                {columnTasks.length === 0 && tasks.length > 0 && (
                  <div className="rounded-md border border-dashed border-border/70 px-3 py-6 text-center text-xs text-muted-foreground">
                    Sin tareas
                  </div>
                )}

                {canManageTasks && (
                  <Button
                    variant="ghost"
                    className="h-10 w-full border border-dashed border-border/60 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                    onClick={() => openNewTask(column.key)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Agregar
                  </Button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editTask || { status: defaultStatus }}
        onSaved={() => setEditTask(null)}
      />
    </div>
  );
}
