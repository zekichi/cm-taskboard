import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border border-white/10 bg-card/95 text-foreground shadow-2xl shadow-black/30",
        },
      }}
    />
  );
}
