import { cn } from "../lib/utils";
import { Clock, Palette, CheckCircle2, Rocket } from "lucide-react";

const statusConfig = {
  pendiente: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    label: "Pendiente",
  },
  "en diseño": {
    color: "bg-violet-100 text-violet-700 border-violet-200",
    icon: Palette,
    label: "En diseño",
  },
  aprobado: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "Aprobado",
  },
  publicado: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Rocket,
    label: "Publicado",
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = statusConfig[status] || statusConfig["pendiente"];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.color,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {config.label}
    </span>
  );
}
