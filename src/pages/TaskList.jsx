import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { useTasks } from "@/api/tasks";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import LoadingState from "@/components/feedback/LoadingState";
import FilterBar from "@/components/taskboard/FilterBar";
import TaskCard from "@/components/taskboard/TaskCard";
import TaskFormDialog from "@/components/taskboard/TaskFormDialog";
import { Button } from "@/components/ui/button";
import {
  ALL_PLATFORMS_FILTER,
  ALL_STATUSES_FILTER,
} from "@/constants/task-options";
import { useWorkspace } from "@/lib/WorkspaceContext";

const ALL_ASSIGNEES = "Todos";

export default function TaskList() {
  const { organizationId, teamId, members, permissions } = useWorkspace();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    platform: ALL_PLATFORMS_FILTER,
    status: ALL_STATUSES_FILTER,
    assignedToId: ALL_ASSIGNEES,
  });
  const canManageTasks = permissions.manageTasks;

  const apiFilters = {
    organizationId,
    teamId,
    assignedToId:
      filters.assignedToId === ALL_ASSIGNEES ? "" : filters.assignedToId,
  };
  const { data: tasks = [], isLoading, isError, refetch } = useTasks(apiFilters);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("new") === "true" && canManageTasks) {
      setFormOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [canManageTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const search = filters.search.trim().toLowerCase();
      const title = task.title?.toLowerCase() || "";
      const description = task.description?.toLowerCase() || "";

      if (search && !title.includes(search) && !description.includes(search)) {
        return false;
      }

      if (
        filters.platform !== ALL_PLATFORMS_FILTER &&
        task.platform !== filters.platform
      ) {
        return false;
      }

      if (filters.status !== ALL_STATUSES_FILTER && task.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters, tasks]);

  if (isLoading) {
    return <LoadingState label="Cargando tareas..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudieron cargar las tareas"
        message="Revisa que el backend esté disponible y vuelve a intentar."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Centro de tareas
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tareas
          </h1>
          <p className="mt-1 text-muted-foreground">
            {filteredTasks.length} de {tasks.length} tareas visibles
          </p>
        </div>

        {canManageTasks && (
          <Button
            onClick={() => {
              setEditTask(null);
              setFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Button>
        )}
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} members={members} />

      {filteredTasks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(selectedTask) => {
                setEditTask(selectedTask);
                setFormOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron tareas"
          description={
            tasks.length === 0
              ? canManageTasks
                ? "Crea tu primera tarea para comenzar."
                : "Aún no hay tareas asignadas a este espacio."
              : "Prueba con otros filtros."
          }
        />
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editTask}
        onSaved={() => setEditTask(null)}
      />
    </div>
  );
}
