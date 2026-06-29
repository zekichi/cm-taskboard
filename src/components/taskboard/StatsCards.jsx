import { TASK_STATUS_OPTIONS } from "@/constants/task-options";
import { cn } from "@/lib/utils";

export default function StatsCards({ tasks }) {
  const counts = TASK_STATUS_OPTIONS.map((status) => ({
    ...status,
    count: tasks.filter((task) => task.status === status.key).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {counts.map((stat) => (
        <div
          key={stat.key}
          className="relative overflow-hidden rounded-lg border border-white/10 bg-card/75 p-4 shadow-lg shadow-black/15 backdrop-blur sm:p-5"
        >
          <div
            className={cn(
              "absolute right-0 top-0 h-20 w-20 rounded-bl-[40px] bg-gradient-to-br opacity-15 blur-[1px]",
              stat.gradient
            )}
          />
          <div
            className={cn(
              "mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br shadow-[0_0_24px_hsl(var(--primary)/0.12)]",
              stat.gradient
            )}
          >
            <stat.icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-foreground sm:text-3xl">
            {stat.count}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {stat.pluralLabel}
          </p>
        </div>
      ))}
    </div>
  );
}
