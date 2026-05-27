import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { useSaveTask } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PLATFORM_OPTIONS,
  TASK_PRIORITIES,
  TASK_STATUS,
  TASK_STATUS_OPTIONS,
} from "@/constants/task-options";

const initialForm = {
  title: "",
  description: "",
  platform: "Instagram",
  status: TASK_STATUS.PENDING,
  due_date: "",
  priority: "media",
};

export default function TaskFormDialog({ open, onOpenChange, task, onSaved }) {
  const saveTask = useSaveTask();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        platform: task.platform || initialForm.platform,
        status: task.status || initialForm.status,
        due_date: task.due_date || "",
        priority: task.priority || initialForm.priority,
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [task, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // El backend espera null (no string vacio) para campos opcionales.
    const payload = {
      ...form,
      due_date: form.due_date ? form.due_date : null,
      description: form.description ? form.description : null,
    };

    try {
      await saveTask.mutateAsync({
        id: task?.id,
        payload,
      });
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      const message =
        error?.response?.data?.error?.message ||
        "No se pudo guardar la tarea. Revisa los datos e intenta otra vez.";
      setError(message);
    }
  };

  const saving = saveTask.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {task?.id ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ej: Reel de productos nuevos"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la tarea..."
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plataforma *</Label>
              <Select
                value={form.platform}
                onValueChange={(value) =>
                  setForm({ ...form, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm({ ...form, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Fecha límite</Label>
              <Input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  setForm({ ...form, due_date: event.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving || !form.title.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {task?.id ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
