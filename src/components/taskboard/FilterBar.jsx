import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const platforms = [
  "Todas",
  "Instagram",
  "TikTok",
  "Facebook",
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Otra",
];

const statuses = ["Todos", "pendiente", "en diseño", "aprobado", "publicado"];

export default function FilterBar({ filters, onFilterChange }) {
  const hasFilters =
    filters.search ||
    filters.platform !== "Todas" ||
    filters.status !== "Todos";

  const clearFilters = () => {
    onFilterChange({ search: "", platform: "Todas", status: "Todos" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          className="pl-9"
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {/* Platform */}
        <Select
          value={filters.platform}
          onValueChange={(v) => onFilterChange({ ...filters, platform: v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(v) => onFilterChange({ ...filters, status: v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
