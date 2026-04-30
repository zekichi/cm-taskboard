import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, CalendarDays } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { es } from "date-fns/locale";

import { api } from "../api/apiClient"; // ← tu nuevo cliente API
import StatsCards from "../components/taskboard/StatsCards";
import TaskCard from "../components/taskboard/TaskCard";
import TaskFormDialog from "../components/taskboard/TaskFormDialog";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  // Cargar tareas desde tu backend
  const loadTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Tareas próximas
  const upcomingTasks = tasks
    .filter(t => t.due_date && t.status !== "publicado")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  // Tareas recientes
  const recentTasks = tasks.slice(0, 4);

  // Tareas atrasadas
  const overdueTasks = tasks.filter(
    t =>
      t.due_date &&
      isPast(new Date(t.due_date)) &&
      !isToday(new Date(t.due_date)) &&
      t.status !== "publicado"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          {" · "}
          {tasks.length} tareas en total
        </p>
      </div>

      {/* Stats */}
      <StatsCards tasks={tasks} />

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              {overdueTasks.length} tarea
              {overdueTasks.length > 1 ? "s" : ""} atrasada
              {overdueTasks.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-destructive/80 mt-0.5">
              Revisa las tareas con fecha vencida
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent tasks */}
        <div>
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
              recentTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compact
                  onEdit={t => {
                    setEditTask(t);
                    setFormOpen(true);
                  }}
                  onRefresh={loadTasks}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No hay tareas aún</p>
                <p className="text-xs mt-1">
                  Crea tu primera tarea para comenzar
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div>
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
              upcomingTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-card rounded-lg border border-border/60 p-3 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => {
                    setEditTask(task);
                    setFormOpen(true);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {task.platform} · {task.status}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {isToday(new Date(task.due_date)) && "Hoy"}
                    {isTomorrow(new Date(task.due_date)) && "Mañana"}
                    {!isToday(new Date(task.due_date)) &&
                      !isTomorrow(new Date(task.due_date)) &&
                      format(new Date(task.due_date), "d MMM", { locale: es })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Sin entregas próximas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editTask}
        onSaved={() => {
          setEditTask(null);
          loadTasks();
        }}
      />
    </div>
  );
}
