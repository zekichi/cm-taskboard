import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases de Tailwind de forma segura
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
