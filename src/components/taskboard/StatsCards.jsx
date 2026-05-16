import { TASK_STATUS_OPTIONS } from "@/constants/task-options";
import { cn } from "@/lib/utils";

export default function StatsCards({ tasks }) {
  const counts = TASK_STATUS_OPTIONS.map((status) => ({
    ...status,
    count: tasks.filter((task) => task.status === status.key).length,
  }));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {counts.map((stat) => (
        <div
          key={stat.key}
          className="relative overflow-hidden bg-card rounded-lg border border-border/60 p-4 sm:p-5"
        >
          <div
            className={cn(
              "absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-10 bg-gradient-to-br",
              stat.gradient
            )}
          />
          <div
            className={cn(
              "h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
              stat.gradient
            )}
          >
            <stat.icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {stat.count}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {stat.pluralLabel}
          </p>
        </div>
      ))}
    </div>
  );
}
