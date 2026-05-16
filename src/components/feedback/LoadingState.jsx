export default function LoadingState({ label = "Cargando..." }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
