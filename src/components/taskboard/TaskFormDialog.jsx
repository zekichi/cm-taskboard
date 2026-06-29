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
import { useWorkspace } from "@/lib/WorkspaceContext";

const UNASSIGNED_VALUE = "__unassigned";

const initialForm = {
  title: "",
  description: "",
  platform: "Instagram",
  status: TASK_STATUS.PENDING,
  due_date: "",
  priority: "media",
  organizationId: "",
  teamId: "",
  assignedToId: "",
};

export default function TaskFormDialog({ open, onOpenChange, task, onSaved }) {
  const saveTask = useSaveTask();
  const { organizationId, teamId, teams, members, permissions } = useWorkspace();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const canManageTasks = permissions.manageTasks;
  const canAssignTasks = permissions.assignTasks;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        platform: task.platform || initialForm.platform,
        status: task.status || initialForm.status,
        due_date: task.due_date || "",
        priority: task.priority || initialForm.priority,
        organizationId: String(task.organizationId || organizationId || ""),
        teamId: task.teamId ? String(task.teamId) : teamId || "",
        assignedToId: task.assignedToId ? String(task.assignedToId) : "",
      });
    } else {
      setForm({
        ...initialForm,
        organizationId: organizationId || "",
        teamId: teamId || "",
      });
    }

    setError("");
  }, [task, open, organizationId, teamId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!canManageTasks) {
      setError("Tu rol actual permite ver tareas, pero no modificarlas.");
      return;
    }

    const payload = {
      ...form,
      organizationId: Number(form.organizationId),
      teamId: form.teamId ? Number(form.teamId) : null,
      assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
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
        error?.userMessage ||
        "No se pudo guardar la tarea. Revisa los datos e intenta otra vez.";
      setError(message);
    }
  };

  const saving = saveTask.isPending;
  const formDisabled = saving || !canManageTasks;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {task?.id ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {!canManageTasks && (
            <div className="rounded-md border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
              Tu rol actual no permite crear ni editar tareas.
            </div>
          )}

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
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              disabled={formDisabled}
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
              disabled={formDisabled}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Equipo</Label>
              <Select
                value={form.teamId || UNASSIGNED_VALUE}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    teamId: value === UNASSIGNED_VALUE ? "" : value,
                  })
                }
                disabled={formDisabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED_VALUE}>Sin equipo</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsable</Label>
              <Select
                value={form.assignedToId || UNASSIGNED_VALUE}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    assignedToId: value === UNASSIGNED_VALUE ? "" : value,
                  })
                }
                disabled={formDisabled || !canAssignTasks}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED_VALUE}>Sin asignar</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.userId} value={String(member.userId)}>
                      {member.user?.name || member.user?.email} ·{" "}
                      {member.specialty || member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plataforma *</Label>
              <Select
                value={form.platform}
                onValueChange={(value) => setForm({ ...form, platform: value })}
                disabled={formDisabled}
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
                disabled={formDisabled}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={form.priority}
                onValueChange={(value) => setForm({ ...form, priority: value })}
                disabled={formDisabled}
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
                onChange={(event) => setForm({ ...form, due_date: event.target.value })}
                disabled={formDisabled}
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

            <Button
              type="submit"
              disabled={formDisabled || !form.title.trim() || !form.organizationId}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {task?.id ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
