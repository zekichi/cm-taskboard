import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, TrendingUp } from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";

import { useTasks } from "@/api/tasks";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import LoadingState from "@/components/feedback/LoadingState";
import StatsCards from "@/components/taskboard/StatsCards";
import TaskCard from "@/components/taskboard/TaskCard";
import TaskFormDialog from "@/components/taskboard/TaskFormDialog";
import { TASK_STATUS } from "@/constants/task-options";
import { useWorkspace } from "@/lib/WorkspaceContext";

export default function Dashboard() {
  const { organizationId, teamId, selectedOrganization } = useWorkspace();
  const { data: tasks = [], isLoading, isError, refetch } = useTasks({
    organizationId,
    teamId,
  });
  const [editTask, setEditTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.due_date && task.status !== TASK_STATUS.PUBLISHED)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5),
    [tasks]
  );

  const recentTasks = tasks.slice(0, 4);

  const overdueTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.due_date &&
          isPast(new Date(task.due_date)) &&
          !isToday(new Date(task.due_date)) &&
          task.status !== TASK_STATUS.PUBLISHED
      ),
    [tasks]
  );

  if (isLoading) {
    return <LoadingState label="Cargando dashboard..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el dashboard"
        message="Revisa que el backend esté disponible y vuelve a intentar."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          {selectedOrganization?.name || "Organización"} ·{" "}
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })} ·{" "}
          {tasks.length} tareas
        </p>
      </div>

      <StatsCards tasks={tasks} />

      {overdueTasks.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              {overdueTasks.length} tarea
              {overdueTasks.length > 1 ? "s" : ""} atrasada
              {overdueTasks.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-destructive/80 mt-0.5">
              Revisa las tareas con fecha vencida.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tareas recientes
            </h2>
            <Link
              to="/tasks"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compact
                  onEdit={(selectedTask) => {
                    setEditTask(selectedTask);
                    setFormOpen(true);
                  }}
                />
              ))
            ) : (
              <EmptyState
                title="No hay tareas aún"
                description="Crea tu primera tarea para comenzar."
              />
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-accent" />
              Próximas entregas
            </h2>
            <Link
              to="/board"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Tablero <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className="flex w-full items-center gap-3 bg-card rounded-lg border border-border/60 p-3 text-left hover:shadow-sm transition-shadow"
                  onClick={() => {
                    setEditTask(task);
                    setFormOpen(true);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.team?.name || "Sin equipo"} ·{" "}
                      {task.assignedTo?.name || "Sin responsable"}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {isToday(new Date(task.due_date)) && "Hoy"}
                    {isTomorrow(new Date(task.due_date)) && "Mañana"}
                    {!isToday(new Date(task.due_date)) &&
                      !isTomorrow(new Date(task.due_date)) &&
                      format(new Date(task.due_date), "d MMM", { locale: es })}
                  </span>
                </button>
              ))
            ) : (
              <EmptyState title="Sin entregas próximas" />
            )}
          </div>
        </section>
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editTask}
        onSaved={() => setEditTask(null)}
      />
    </div>
  );
}
