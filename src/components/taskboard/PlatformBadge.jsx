import { PLATFORM_CONFIG } from "@/constants/task-options";
import { cn } from "@/lib/utils";

export default function PlatformBadge({ platform = "Otra", size = "sm" }) {
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.Otra;

  return (
    <span
      className={cn(
        "badge-shimmer inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200 hover:-translate-y-px",
        config.color,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      )}
    >
      <span className="text-[10px] font-bold leading-none">{config.label}</span>
      {platform}
    </span>
  );
}
