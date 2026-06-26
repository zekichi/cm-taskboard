import { Link, Outlet, useLocation } from "react-router-dom";
import { Columns3, LayoutDashboard, List, LogOut, Plus, Users } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/lib/AuthContext";
import { useWorkspace } from "@/lib/WorkspaceContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Columns3, label: "Tablero" },
  { to: "/tasks", icon: List, label: "Lista" },
  { to: "/workspace", icon: Users, label: "Equipo" },
];

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
  } = useWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Columns3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                CM Taskboard
              </h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5 hidden sm:block">
                Community Management
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <select
              value={organizationId}
              onChange={(event) => {
                setOrganizationId(event.target.value);
                setTeamId("");
              }}
              className="h-9 max-w-[150px] rounded-lg border border-border bg-background px-3 text-sm"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
            <select
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              className="h-9 max-w-[170px] rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Todos los equipos</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Link
              to="/tasks?new=true"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Nueva tarea
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {user?.name || "Salir"}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            aria-label="Abrir menú"
          >
            <div className="space-y-1.5">
              <span className={cn("block h-0.5 w-5 bg-foreground transition-all", mobileOpen && "rotate-45 translate-y-2")} />
              <span className={cn("block h-0.5 w-5 bg-foreground transition-all", mobileOpen && "opacity-0")} />
              <span className={cn("block h-0.5 w-5 bg-foreground transition-all", mobileOpen && "-rotate-45 -translate-y-2")} />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
            <select
              value={organizationId}
              onChange={(event) => {
                setOrganizationId(event.target.value);
                setTeamId("");
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
            <select
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Todos los equipos</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              to="/tasks?new=true"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Nueva tarea
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
