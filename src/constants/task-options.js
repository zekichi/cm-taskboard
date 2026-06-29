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
    badgeClass: "bg-amber-400/12 text-amber-200 border-amber-400/25",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    key: TASK_STATUS.DESIGN,
    label: "En diseño",
    pluralLabel: "En diseño",
    icon: Palette,
    color: "bg-violet-500",
    badgeClass: "bg-violet-400/12 text-violet-200 border-violet-400/25",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    key: TASK_STATUS.APPROVED,
    label: "Aprobado",
    pluralLabel: "Aprobados",
    icon: CheckCircle2,
    color: "bg-emerald-500",
    badgeClass: "bg-emerald-400/12 text-emerald-200 border-emerald-400/25",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    key: TASK_STATUS.PUBLISHED,
    label: "Publicado",
    pluralLabel: "Publicados",
    icon: Rocket,
    color: "bg-blue-500",
    badgeClass: "bg-cyan-400/12 text-cyan-200 border-cyan-400/25",
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
    color: "bg-pink-400/12 text-pink-200 border-pink-400/25",
    label: "IG",
  },
  TikTok: {
    color: "bg-slate-300/12 text-slate-200 border-slate-300/25",
    label: "TT",
  },
  Facebook: {
    color: "bg-blue-400/12 text-blue-200 border-blue-400/25",
    label: "FB",
  },
  "Twitter/X": {
    color: "bg-sky-400/12 text-sky-200 border-sky-400/25",
    label: "X",
  },
  LinkedIn: {
    color: "bg-indigo-400/12 text-indigo-200 border-indigo-400/25",
    label: "IN",
  },
  YouTube: {
    color: "bg-red-400/12 text-red-200 border-red-400/25",
    label: "YT",
  },
  Pinterest: {
    color: "bg-rose-400/12 text-rose-200 border-rose-400/25",
    label: "PI",
  },
  Otra: {
    color: "bg-gray-300/12 text-gray-200 border-gray-300/25",
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
