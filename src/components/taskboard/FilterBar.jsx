import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_PLATFORMS_FILTER,
  ALL_STATUSES_FILTER,
  PLATFORM_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "@/constants/task-options";

const ALL_ASSIGNEES = "Todos";
const platformFilters = [ALL_PLATFORMS_FILTER, ...PLATFORM_OPTIONS];
const statusFilters = [
  { key: ALL_STATUSES_FILTER, label: ALL_STATUSES_FILTER },
  ...TASK_STATUS_OPTIONS,
];

export default function FilterBar({ filters, onFilterChange, members = [] }) {
  const hasFilters =
    filters.search ||
    filters.platform !== ALL_PLATFORMS_FILTER ||
    filters.status !== ALL_STATUSES_FILTER ||
    filters.assignedToId !== ALL_ASSIGNEES;

  const clearFilters = () => {
    onFilterChange({
      search: "",
      platform: ALL_PLATFORMS_FILTER,
      status: ALL_STATUSES_FILTER,
      assignedToId: ALL_ASSIGNEES,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          className="pl-9"
          value={filters.search}
          onChange={(event) =>
            onFilterChange({ ...filters, search: event.target.value })
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.platform}
          onValueChange={(value) =>
            onFilterChange({ ...filters, platform: value })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            {platformFilters.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFilterChange({ ...filters, status: value })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((status) => (
              <SelectItem key={status.key} value={status.key}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.assignedToId}
          onValueChange={(value) =>
            onFilterChange({ ...filters, assignedToId: value })
          }
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Responsable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ASSIGNEES}>Responsables</SelectItem>
            {members.map((member) => (
              <SelectItem key={member.userId} value={String(member.userId)}>
                {member.user?.name || member.user?.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
            aria-label="Limpiar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
