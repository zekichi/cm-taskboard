import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Columns3, FileText, LayoutDashboard, List, LogOut, Menu, Plus, Users, X } from "lucide-react";

import InteractiveBackground from "@/components/effects/InteractiveBackground";
import { useAuth } from "@/lib/AuthContext";
import { ROLE_LABELS } from "@/lib/permissions";
import { useWorkspace } from "@/lib/WorkspaceContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Columns3, label: "Tablero" },
  { to: "/tasks", icon: List, label: "Lista" },
  { to: "/workspace", icon: Users, label: "Equipo" },
  { to: "/about", icon: FileText, label: "Informe" },
];

const selectClass =
  "h-9 max-w-[180px] rounded-md border border-border bg-background/80 px-3 text-sm text-foreground shadow-inner shadow-black/10 outline-none transition-colors hover:border-primary/35 focus:ring-2 focus:ring-ring";

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const {
    organizations,
    organizationId,
    setOrganizationId,
    teams,
    teamId,
    setTeamId,
    currentMembership,
    permissions,
  } = useWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);
  const canCreateTasks = permissions.manageTasks;

  const renderNavigation = (isMobile = false) =>
    navItems.map((item) => {
      const isActive = location.pathname === item.to;
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => isMobile && setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200",
            isMobile ? "px-4 py-3" : "px-3 py-2",
            isActive
              ? "bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.22)]"
              : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      );
    });

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveBackground variant="app" className="opacity-70" />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/78 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="CM Taskboard">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
              <Columns3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                CM Taskboard
              </h1>
              <p className="-mt-0.5 hidden text-[11px] text-muted-foreground sm:block">
                Community Management OS
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {renderNavigation()}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <select
              aria-label="Seleccionar organización"
              value={organizationId}
              onChange={(event) => {
                setOrganizationId(event.target.value);
                setTeamId("");
              }}
              className={selectClass}
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Seleccionar equipo"
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              className={selectClass}
            >
              <option value="">Todos los equipos</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            {canCreateTasks && (
              <Link
                to="/tasks?new=true"
                className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.22)] transition-all hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nueva tarea
              </Link>
            )}

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="max-w-[150px] truncate">{user?.name || "Salir"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="space-y-3 border-t border-white/10 bg-background/96 p-4 lg:hidden">
            <div className="grid gap-2">
              <select
                aria-label="Seleccionar organización"
                value={organizationId}
                onChange={(event) => {
                  setOrganizationId(event.target.value);
                  setTeamId("");
                }}
                className={cn(selectClass, "h-10 max-w-none")}
              >
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Seleccionar equipo"
                value={teamId}
                onChange={(event) => setTeamId(event.target.value)}
                className={cn(selectClass, "h-10 max-w-none")}
              >
                <option value="">Todos los equipos</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1">{renderNavigation(true)}</div>

            {canCreateTasks && (
              <Link
                to="/tasks?new=true"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Nueva tarea
              </Link>
            )}

            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-card/60 px-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {user?.name || user?.email || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ROLE_LABELS[currentMembership?.role] || "Miembro"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="parallax-depth relative z-10 mx-auto min-w-0 max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
