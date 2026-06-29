import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api/apiClient";

export const taskKeys = {
  all: ["tasks"],
  list: (filters) => ["tasks", filters],
};

function extractData(response) {
  return response?.data?.data;
}

function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
  );
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error?.message || error?.userMessage || fallback;
}

export async function fetchTasks(filters = {}) {
  const response = await api.get("/tasks", { params: cleanParams(filters) });
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

export function useTasks(filters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => fetchTasks(filters),
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
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo guardar la tarea"));
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
      toast.error(getErrorMessage(error, "No se pudo actualizar el estado"));
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
      toast.error(getErrorMessage(error, "No se pudo eliminar la tarea"));
    },
  });
}
