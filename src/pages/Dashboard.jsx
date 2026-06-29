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
  const { organizationId, teamId, selectedOrganization, currentMembership } =
    useWorkspace();
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
      <section className="relative overflow-hidden rounded-xl border border-white/10 bg-card/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Centro de operaciones
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedOrganization?.name || "Organización"} ·{" "}
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })} ·{" "}
              {tasks.length} tareas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-muted-foreground">Rol</p>
              <p className="font-semibold text-foreground">
                {currentMembership?.role || "MEMBER"}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-muted-foreground">Vencidas</p>
              <p className="font-semibold text-destructive">{overdueTasks.length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-muted-foreground">Próximas</p>
              <p className="font-semibold text-primary">{upcomingTasks.length}</p>
            </div>
          </div>
        </div>
      </section>

      <StatsCards tasks={tasks} />

      {overdueTasks.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/10 p-4">
          <CalendarDays className="h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              {overdueTasks.length} tarea{overdueTasks.length > 1 ? "s" : ""}{" "}
              atrasada{overdueTasks.length > 1 ? "s" : ""}
            </p>
            <p className="mt-0.5 text-xs text-destructive/80">
              Revisa las tareas con fecha vencida antes de publicar.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tareas recientes
            </h2>
            <Link
              to="/tasks"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <CalendarDays className="h-5 w-5 text-accent" />
              Próximas entregas
            </h2>
            <Link
              to="/board"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
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
                  className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-card/75 p-3 text-left shadow-lg shadow-black/10 transition-all hover:border-primary/25 hover:bg-card"
                  onClick={() => {
                    setEditTask(task);
                    setFormOpen(true);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.team?.name || "Sin equipo"} ·{" "}
                      {task.assignedTo?.name || "Sin responsable"}
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-xs font-semibold text-muted-foreground">
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
