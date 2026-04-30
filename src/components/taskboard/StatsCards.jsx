import { Clock, Palette, CheckCircle2, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { key: "pendiente", label: "Pendientes", icon: Clock, gradient: "from-amber-500 to-orange-500" },
  { key: "en diseño", label: "En diseño", icon: Palette, gradient: "from-violet-500 to-purple-500" },
  { key: "aprobado", label: "Aprobados", icon: CheckCircle2, gradient: "from-emerald-500 to-green-500" },
  { key: "publicado", label: "Publicados", icon: Rocket, gradient: "from-blue-500 to-cyan-500" },
];

export default function StatsCards({ tasks }) {
  const counts = stats.map(s => ({
    ...s,
    count: tasks.filter(t => t.status === s.key).length,
  }));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {counts.map((stat) => (
        <div key={stat.key} className="relative overflow-hidden bg-card rounded-xl border border-border/60 p-4 sm:p-5">
          <div className={cn(
            "absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-10 bg-gradient-to-br",
            stat.gradient
          )} />
          <div className={cn(
            "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
            stat.gradient
          )}>
            <stat.icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.count}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}