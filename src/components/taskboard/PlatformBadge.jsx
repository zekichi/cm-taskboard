import { cn } from "../lib/utils";

const platformConfig = {
  Instagram: {
    color: "bg-pink-100 text-pink-700 border-pink-200",
    emoji: "📸",
  },
  TikTok: {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    emoji: "🎵",
  },
  Facebook: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    emoji: "👤",
  },
  "Twitter/X": {
    color: "bg-sky-100 text-sky-700 border-sky-200",
    emoji: "𝕏",
  },
  LinkedIn: {
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    emoji: "💼",
  },
  YouTube: {
    color: "bg-red-100 text-red-700 border-red-200",
    emoji: "▶️",
  },
  Pinterest: {
    color: "bg-rose-100 text-rose-700 border-rose-200",
    emoji: "📌",
  },
  Otra: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    emoji: "🌐",
  },
};

export default function PlatformBadge({ platform, size = "sm" }) {
  const config = platformConfig[platform] || platformConfig["Otra"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        config.color,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      )}
    >
      <span>{config.emoji}</span>
      {platform}
    </span>
  );
}
