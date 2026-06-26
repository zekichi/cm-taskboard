import { useState } from "react";
import { Plus, Users } from "lucide-react";

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
    if (!teamName.trim()) return;

    await createTeam.mutateAsync({
      name: teamName.trim(),
      organizationId: Number(organizationId),
    });
    setTeamName("");
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Equipo
        </h1>
        <p className="text-muted-foreground mt-1">
          {selectedOrganization?.name} · roles, especialidades y equipos
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Miembros
            </h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {member.user?.name || member.user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                      {member.role}
                    </span>
                    {member.specialty && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {member.specialty}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Equipos
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {teams.map((team) => (
                <div key={team.id} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-medium text-foreground">{team.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {team.members.length} miembros
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <form
            onSubmit={handleCreateTeam}
            className="rounded-lg border border-border bg-card p-4 space-y-3"
          >
            <h2 className="font-semibold text-foreground">Nuevo equipo</h2>
            <Input
              placeholder="Nombre del equipo"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <Button className="w-full gap-2" disabled={createTeam.isPending}>
              <Plus className="h-4 w-4" />
              Crear equipo
            </Button>
          </form>

          <form
            onSubmit={handleAddMember}
            className="rounded-lg border border-border bg-card p-4 space-y-3"
          >
            <h2 className="font-semibold text-foreground">Invitar miembro</h2>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={memberForm.email}
                onChange={(event) =>
                  setMemberForm({ ...memberForm, email: event.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={memberForm.name}
                onChange={(event) =>
                  setMemberForm({ ...memberForm, name: event.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Select
                value={memberForm.role}
                onValueChange={(role) => setMemberForm({ ...memberForm, role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={memberForm.specialty}
                onValueChange={(specialty) =>
                  setMemberForm({ ...memberForm, specialty })
                }
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
            <Button className="w-full gap-2" disabled={addMember.isPending}>
              <Plus className="h-4 w-4" />
              Agregar miembro
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
