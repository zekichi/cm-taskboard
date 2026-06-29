import { cn } from "@/lib/utils";
import { TASK_STATUS_BY_KEY, TASK_STATUS } from "@/constants/task-options";

export default function StatusBadge({ status, size = "sm" }) {
  const config = TASK_STATUS_BY_KEY[status] || TASK_STATUS_BY_KEY[TASK_STATUS.PENDING];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "badge-shimmer inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200 hover:-translate-y-px",
        config.badgeClass,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {config.label}
    </span>
  );
}
