import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useOrganizations } from "@/api/workspace";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const organizationsQuery = useOrganizations();
  const organizations = organizationsQuery.data || [];
  const [organizationId, setOrganizationId] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    if (!organizationId && organizations.length > 0) {
      setOrganizationId(String(organizations[0].id));
    }
  }, [organizationId, organizations]);

  const selectedOrganization = organizations.find(
    (organization) => String(organization.id) === String(organizationId)
  );
  const teams = selectedOrganization?.teams || [];
  const members = selectedOrganization?.members || [];

  useEffect(() => {
    if (teamId && !teams.some((team) => String(team.id) === String(teamId))) {
      setTeamId("");
    }
  }, [teamId, teams]);

  const value = useMemo(
    () => ({
      organizations,
      selectedOrganization,
      organizationId,
      setOrganizationId,
      teams,
      teamId,
      setTeamId,
      members,
      isLoading: organizationsQuery.isLoading,
      isError: organizationsQuery.isError,
      refetch: organizationsQuery.refetch,
    }),
    [organizations, selectedOrganization, organizationId, teams, teamId, members, organizationsQuery]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
