import { useState } from "react";
import { Plus, ShieldCheck, Users } from "lucide-react";

import { useAddOrganizationMember, useCreateTeam } from "@/api/workspace";
import ErrorState from "@/components/feedback/ErrorState";
import LoadingState from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS } from "@/lib/permissions";
import { useWorkspace } from "@/lib/WorkspaceContext";

const roles = ["OWNER", "ADMIN", "MANAGER", "MEMBER"];
const specialties = [
  "Copywriter",
  "Diseñador",
  "Editor",
  "Community Manager",
  "Social Media Manager",
];

export default function Workspace() {
  const {
    selectedOrganization,
    organizationId,
    members,
    teams,
    permissions,
    isLoading,
    isError,
    refetch,
  } = useWorkspace();
  const createTeam = useCreateTeam();
  const addMember = useAddOrganizationMember();
  const [teamName, setTeamName] = useState("");
  const [memberForm, setMemberForm] = useState({
    email: "",
    name: "",
    role: "MEMBER",
    specialty: "Community Manager",
  });
  const canManageTeams = permissions.manageTeams;
  const canManageMembers = permissions.manageMembers;

  if (isLoading) {
    return <LoadingState label="Cargando equipo..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el equipo"
        message="Revisa la conexión con el backend."
        onRetry={refetch}
      />
    );
  }

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    if (!teamName.trim() || !canManageTeams) return;

    await createTeam.mutateAsync({
      name: teamName.trim(),
      organizationId: Number(organizationId),
    });
    setTeamName("");
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!canManageMembers) return;

    await addMember.mutateAsync({
      organizationId,
      payload: {
        ...memberForm,
        name: memberForm.name || undefined,
      },
    });
    setMemberForm({
      email: "",
      name: "",
      role: "MEMBER",
      specialty: "Community Manager",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Organización
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Equipo
          </h1>
          <p className="mt-1 text-muted-foreground">
            {selectedOrganization?.name} · roles, especialidades y equipos
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Miembros</h2>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
                {members.length} activos
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-white/10 bg-card/75 p-4 shadow-lg shadow-black/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {member.user?.name || member.user?.email}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {ROLE_LABELS[member.role] || member.role}
                    </span>
                    {member.specialty && (
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-muted-foreground">
                        {member.specialty}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Equipos</h2>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
                {teams.length} equipos
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-lg border border-white/10 bg-card/75 p-4 shadow-lg shadow-black/10"
                >
                  <p className="font-semibold text-foreground">{team.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {team.members.length} miembros
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-card/75 p-4 shadow-lg shadow-black/10">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Permisos
            </div>
            <p className="text-sm text-muted-foreground">
              {canManageMembers
                ? "Puedes crear equipos e invitar miembros en esta organización."
                : "Tu rol actual permite consultar el equipo, pero no administrarlo."}
            </p>
          </div>

          <form
            onSubmit={handleCreateTeam}
            className="space-y-3 rounded-lg border border-white/10 bg-card/75 p-4 shadow-lg shadow-black/10"
          >
            <h2 className="font-semibold text-foreground">Nuevo equipo</h2>
            <Input
              placeholder="Nombre del equipo"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              disabled={!canManageTeams || createTeam.isPending}
            />
            <Button
              className="w-full gap-2"
              disabled={!canManageTeams || createTeam.isPending || !teamName.trim()}
            >
              <Plus className="h-4 w-4" />
              Crear equipo
            </Button>
          </form>

          <form
            onSubmit={handleAddMember}
            className="space-y-3 rounded-lg border border-white/10 bg-card/75 p-4 shadow-lg shadow-black/10"
          >
            <h2 className="font-semibold text-foreground">Invitar miembro</h2>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={memberForm.email}
                onChange={(event) =>
                  setMemberForm({ ...memberForm, email: event.target.value })
                }
                disabled={!canManageMembers || addMember.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-name">Nombre</Label>
              <Input
                id="member-name"
                value={memberForm.name}
                onChange={(event) =>
                  setMemberForm({ ...memberForm, name: event.target.value })
                }
                disabled={!canManageMembers || addMember.isPending}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Select
                value={memberForm.role}
                onValueChange={(role) => setMemberForm({ ...memberForm, role })}
                disabled={!canManageMembers || addMember.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role] || role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={memberForm.specialty}
                onValueChange={(specialty) =>
                  setMemberForm({ ...memberForm, specialty })
                }
                disabled={!canManageMembers || addMember.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full gap-2"
              disabled={!canManageMembers || addMember.isPending || !memberForm.email}
            >
              <Plus className="h-4 w-4" />
              Agregar miembro
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
