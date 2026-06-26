import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api/apiClient";

export const workspaceKeys = {
  organizations: ["organizations"],
};

function extractData(response) {
  return response?.data?.data;
}

export async function fetchOrganizations() {
  const response = await api.get("/organizations");
  return extractData(response) || [];
}

export async function createTeam(payload) {
  const response = await api.post("/teams", payload);
  return extractData(response);
}

export async function addOrganizationMember(organizationId, payload) {
  const response = await api.post(`/organizations/${organizationId}/members`, payload);
  return extractData(response);
}

export function useOrganizations() {
  return useQuery({
    queryKey: workspaceKeys.organizations,
    queryFn: fetchOrganizations,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.organizations });
      toast.success("Equipo creado");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error?.message || "No se pudo crear el equipo");
    },
  });
}

export function useAddOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, payload }) =>
      addOrganizationMember(organizationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.organizations });
      toast.success("Miembro agregado");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error?.message || "No se pudo agregar el miembro");
    },
  });
}
