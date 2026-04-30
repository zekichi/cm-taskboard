import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Loader2 } from "lucide-react";
import { api } from "../../api/apiClient";

const platforms = [
  "Instagram",
  "TikTok",
  "Facebook",
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Otra",
];

const statuses = ["pendiente", "en diseño", "aprobado", "publicado"];
const priorities = ["baja", "media", "alta"];

export default function TaskFormDialog({ open, onOpenChange, task, onSaved }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    platform: "Instagram",
    status: "pendiente",
    due_date: "",
    priority: "media",
  });

  const [saving, setSaving] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        platform: task.platform || "Instagram",
        status: task.status || "pendiente",
        due_date: task.due_date || "",
        priority: task.priority || "media",
      });
    } else {
      setForm({
        title: "",
        description: "",
        platform: "Instagram",
        status: "pendiente",
        due_date: "",
        priority: "media",
      });
    }
  }, [task, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (task?.id) {
        // Editar
        await api.patch(`/tasks/${task.id}`, form);
      } else {
        // Crear
        await api.post("/tasks", form);
      }

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error guardando tarea:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {task ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ej: Reel de productos nuevos"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la tarea..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Plataforma + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plataforma *</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm({ ...form, platform: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prioridad + Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
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
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving || !form.title}>
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {task ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
