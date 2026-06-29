export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-border/80 bg-card/45 px-6 py-14 text-center shadow-inner shadow-black/10">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
        <span className="text-xl font-semibold text-primary">0</span>
      </div>
      <p className="text-foreground font-medium">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
