import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorState({ title = "Algo salió mal", message, onRetry }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 border-destructive/30 bg-background text-destructive hover:bg-destructive/10"
              onClick={onRetry}
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
