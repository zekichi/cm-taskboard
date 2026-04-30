import { useState, useEffect } from "react";
import { Clock, Palette, CheckCircle2, Rocket, Plus } from "lucide-react";

import { api } from "../api/apiClient";
import { cn } from "../lib/utils";
import TaskCard from "../components/taskboard/TaskCard";
import TaskFormDialog from "../components/taskboard/TaskFormDialog";
import { Button } from "../components/ui/button";

const columns = [
  { key: "pendiente", label: "Pendiente", icon: Clock, color: "bg-amber-500" },
  { key: "en diseño", label: "En diseño", icon: Palette, color: "bg-violet-500" },
  { key: "aprobado", label: "Aprobado", icon: CheckCircle2, color: "bg-emerald-500" },
  { key: "publicado", label: "Publicado", icon: Rocket, color: "bg-blue-500" },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("pendiente");

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

  const openNewTask = (status) => {
    setEditTask(null);
    setDefaultStatus(status);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);

          return (
            <div key={col.key} className="flex flex-col">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={cn("h-2.5 w-2.5 rounded-full", col.color)} />
                <h3 className="text-sm font-semibold text-foreground">
                  {col.label}
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5 ml-auto">
                  {colTasks.length}
                </span>
              </div>

              {/* Column body */}
              <div className="flex-1 space-y-3 min-h-[200px] bg-secondary/30 rounded-xl p-3 border border-border/40">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    onEdit={(t) => {
                      setEditTask(t);
                      setFormOpen(true);
                    }}
                    onRefresh={loadTasks}
                  />
                ))}

                <Button
                  variant="ghost"
                  className="w-full border border-dashed border-border/60 text-muted-foreground hover:text-foreground h-10"
                  onClick={() => openNewTask(col.key)}
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
        onSaved={() => {
          setEditTask(null);
          loadTasks();
        }}
      />
    </div>
  );
}
