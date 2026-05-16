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
import { cn } from "@/lib/utils";

export default function TaskBoard() {
  const { data: tasks = [], isLoading, isError, refetch } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(TASK_STATUS.PENDING);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Tablero
        </h1>
        <p className="text-muted-foreground mt-1">
          Vista kanban de todas tus tareas
        </p>
      </div>

      {tasks.length === 0 && (
        <EmptyState
          title="Todavía no hay tareas"
          description="Crea tu primera tarea desde cualquier columna."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {TASK_STATUS_OPTIONS.map((column) => {
          const ColumnIcon = column.icon;
          const columnTasks = tasks.filter((task) => task.status === column.key);

          return (
            <div key={column.key} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
                <ColumnIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  {column.label}
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5 ml-auto">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 min-h-[200px] bg-secondary/30 rounded-lg p-3 border border-border/40">
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

                <Button
                  variant="ghost"
                  className="w-full border border-dashed border-border/60 text-muted-foreground hover:text-foreground h-10"
                  onClick={() => openNewTask(column.key)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
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
