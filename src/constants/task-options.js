import { CheckCircle2, Clock, Palette, Rocket } from "lucide-react";

export const TASK_STATUS = {
  PENDING: "pendiente",
  DESIGN: "en diseño",
  APPROVED: "aprobado",
  PUBLISHED: "publicado",
};

export const TASK_STATUSES = [
  TASK_STATUS.PENDING,
  TASK_STATUS.DESIGN,
  TASK_STATUS.APPROVED,
  TASK_STATUS.PUBLISHED,
];

export const TASK_STATUS_OPTIONS = [
  {
    key: TASK_STATUS.PENDING,
    label: "Pendiente",
    pluralLabel: "Pendientes",
    icon: Clock,
    color: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    key: TASK_STATUS.DESIGN,
    label: "En diseño",
    pluralLabel: "En diseño",
    icon: Palette,
    color: "bg-violet-500",
    badgeClass: "bg-violet-100 text-violet-700 border-violet-200",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    key: TASK_STATUS.APPROVED,
    label: "Aprobado",
    pluralLabel: "Aprobados",
    icon: CheckCircle2,
    color: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    key: TASK_STATUS.PUBLISHED,
    label: "Publicado",
    pluralLabel: "Publicados",
    icon: Rocket,
    color: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    gradient: "from-blue-500 to-cyan-500",
  },
];

export const TASK_STATUS_BY_KEY = Object.fromEntries(
  TASK_STATUS_OPTIONS.map((status) => [status.key, status])
);

export const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok",
  "Facebook",
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Otra",
];

export const PLATFORM_CONFIG = {
  Instagram: {
    color: "bg-pink-100 text-pink-700 border-pink-200",
    label: "IG",
  },
  TikTok: {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    label: "TT",
  },
  Facebook: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    label: "FB",
  },
  "Twitter/X": {
    color: "bg-sky-100 text-sky-700 border-sky-200",
    label: "X",
  },
  LinkedIn: {
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    label: "IN",
  },
  YouTube: {
    color: "bg-red-100 text-red-700 border-red-200",
    label: "YT",
  },
  Pinterest: {
    color: "bg-rose-100 text-rose-700 border-rose-200",
    label: "PI",
  },
  Otra: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    label: "OT",
  },
};

export const TASK_PRIORITIES = ["baja", "media", "alta"];

export const PRIORITY_INDICATOR = {
  alta: "border-l-red-400",
  media: "border-l-amber-400",
  baja: "border-l-emerald-400",
};

export const ALL_PLATFORMS_FILTER = "Todas";
export const ALL_STATUSES_FILTER = "Todos";
