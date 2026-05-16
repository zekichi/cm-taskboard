import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api/apiClient";

export const taskKeys = {
  all: ["tasks"],
};

export async function fetchTasks() {
  const response = await api.get("/tasks");
  return Array.isArray(response.data) ? response.data : [];
}

export async function createTask(payload) {
  const response = await api.post("/tasks", payload);
  return response.data;
}

export async function updateTask(id, payload) {
  const response = await api.patch(`/tasks/${id}`, payload);
  return response.data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
  return id;
}

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: fetchTasks,
  });
}

export function useSaveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task) =>
      task.id ? updateTask(task.id, task.payload) : createTask(task.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Tarea guardada");
    },
    onError: () => {
      toast.error("No se pudo guardar la tarea");
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Estado actualizado");
    },
    onError: () => {
      toast.error("No se pudo actualizar el estado");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Tarea eliminada");
    },
    onError: () => {
      toast.error("No se pudo eliminar la tarea");
    },
  });
}
