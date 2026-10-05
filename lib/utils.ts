import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address?: string | null) {
  if (!address) return "";
  const parts = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const uniqueParts: string[] = [];
  const lowerParts = new Set<string>();

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (!lowerParts.has(lower)) {
      uniqueParts.push(part);
      lowerParts.add(lower);
    }
  }

  return uniqueParts.join(", ");
}
