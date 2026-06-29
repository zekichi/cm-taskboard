export default function LoadingState({ label = "Cargando..." }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border border-primary/20" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary border-r-accent animate-spin" />
        <div className="absolute inset-4 rounded-full bg-primary/60 shadow-[0_0_22px_hsl(var(--primary)/0.55)]" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
