export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-16">
      <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
        <span className="text-xl font-semibold text-muted-foreground">0</span>
      </div>
      <p className="text-foreground font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
