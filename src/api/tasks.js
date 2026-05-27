import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api/apiClient";

export const taskKeys = {
  all: ["tasks"],
};

function extractData(response) {
  // Centralizar esto evita duplicar response?.data?.data en cada endpoint.
  return response?.data?.data;
}

export async function fetchTasks() {
  const response = await api.get("/tasks");
  const data = extractData(response);
  return Array.isArray(data) ? data : [];
}

export async function createTask(payload) {
  const response = await api.post("/tasks", payload);
  return extractData(response);
}

export async function updateTask(id, payload) {
  const response = await api.patch(`/tasks/${id}`, payload);
  return extractData(response);
}

export async function deleteTask(id) {
  const response = await api.delete(`/tasks/${id}`);
  return extractData(response);
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
      // Invalidar la lista completa mantiene board, dashboard y list sincronizados.
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Tarea guardada");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error?.message || "No se pudo guardar la tarea";
      toast.error(message);
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
    onError: (error) => {
      const message =
        error?.response?.data?.error?.message ||
        "No se pudo actualizar el estado";
      toast.error(message);
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
    onError: (error) => {
      const message =
        error?.response?.data?.error?.message || "No se pudo eliminar la tarea";
      toast.error(message);
    },
  });
}
