import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { api } from "../api/apiClient";
import { Button } from "../components/ui/button";
import TaskCard from "../components/taskboard/TaskCard";
import TaskFormDialog from "../components/taskboard/TaskFormDialog";
import FilterBar from "../components/taskboard/FilterBar";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    platform: "Todas",
    status: "Todos",
  });

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

    // Abrir formulario si viene ?new=true en la URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "true") {
      setFormOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Filtrado de tareas
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      filters.search &&
      !t.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !(t.description || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    if (filters.search && matchesSearch) return false;
    if (filters.platform !== "Todas" && t.platform !== filters.platform)
      return false;
    if (filters.status !== "Todos" && t.status !== filters.status)
      return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Tareas
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredTasks.length} de {tasks.length} tareas
          </p>
        </div>

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
      </div>

      {/* Filtros */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Lista de tareas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(t) => {
              setEditTask(t);
              setFormOpen(true);
            }}
            onRefresh={loadTasks}
          />
        ))}
      </div>

      {/* Estado vacío */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-foreground font-medium">No se encontraron tareas</p>
          <p className="text-sm text-muted-foreground mt-1">
            {tasks.length === 0
              ? "Crea tu primera tarea para comenzar"
              : "Prueba con otros filtros"}
          </p>
        </div>
      )}

      {/* Formulario */}
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
