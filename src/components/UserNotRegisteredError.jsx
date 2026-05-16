export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md w-full rounded-lg border border-border bg-card p-8 shadow">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Acceso denegado
          </h1>

          <p className="text-muted-foreground mb-6">
            No tienes permisos para acceder a esta sección.
          </p>

          <div className="rounded-md bg-secondary p-4 text-sm text-muted-foreground">
            <p>Posibles soluciones:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verifica tu cuenta o sesión</li>
              <li>Intenta volver al inicio</li>
              <li>Contacta al administrador si crees que es un error</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
