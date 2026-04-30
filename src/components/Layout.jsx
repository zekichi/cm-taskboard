import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, List, Columns3, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Columns3, label: "Tablero" },
  { to: "/tasks", icon: List, label: "Lista" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
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

          {/* New Task Button */}
          <Link
            to="/tasks?new=true"
            className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            <div className="space-y-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 bg-foreground transition-all",
                  mobileOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-foreground transition-all",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-foreground transition-all",
                  mobileOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-1">
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground mt-2"
            >
              <Plus className="h-4 w-4" />
              Nueva tarea
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
