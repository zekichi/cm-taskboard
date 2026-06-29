import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || "Página";

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-7xl font-light text-muted-foreground/50">404</h1>
          <div className="mx-auto h-0.5 w-16 bg-border" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Página no encontrada
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            La página <span className="font-medium">"{pageName}"</span> no
            existe dentro de esta aplicación.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
