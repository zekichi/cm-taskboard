import { useState } from "react";
import { Eye, EyeOff, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import InteractiveBackground from "@/components/effects/InteractiveBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const { login, sessionMessage } = useAuth();
  const [email, setEmail] = useState("valentina.rios@cts-demo.local");
  const [password, setPassword] = useState("CtsDemo2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      toast.success("Sesión iniciada");
    } catch (error) {
      const message =
        error?.response?.data?.error?.message ||
        error?.userMessage ||
        "No se pudo iniciar sesión con esas credenciales";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <InteractiveBackground variant="login" />
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-70" />

      <section className="ambient-panel motion-card relative z-10 grid w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-card/70 shadow-2xl shadow-black/35 backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden border-r border-white/10 p-8 md:flex md:flex-col md:justify-between">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Gestión creativa multi-equipo
            </div>
            <h1 className="max-w-md text-4xl font-bold leading-tight text-foreground">
              CM Taskboard para coordinar contenido sin perder el pulso.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Organiza equipos, responsables, estados y entregas desde un tablero claro,
              conectado al backend en Render y listo para producción.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
            {["CTS demo", "Roles activos", "Kanban + lista"].map((item) => (
              <div key={item} className="motion-card rounded-lg border border-white/10 bg-white/[0.03] p-3">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">CM Taskboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Inicia sesión para gestionar tareas, equipos y entregas.
            </p>
          </div>

          {sessionMessage && (
            <div className="mb-4 rounded-md border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
              {sessionMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button className="w-full gap-2" type="submit" disabled={isSubmitting}>
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Demo CTS: Valentina, Mateo y Lara usan la misma contraseña
            <code className="ml-1 rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 text-foreground">
              CtsDemo2026!
            </code>
          </p>
        </div>
      </section>
    </main>
  );
}
