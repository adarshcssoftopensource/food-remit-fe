import { cn } from "@/lib/utils";
import { Globe2, MapPin } from "lucide-react";

type ScopeBadgeProps = {
  isGlobal?: boolean | null;
  scopeLabel?: string | null;
  cityName?: string | null;
  className?: string;
};

export function ScopeBadge({ isGlobal, scopeLabel, cityName, className }: ScopeBadgeProps) {
  const global = isGlobal ?? !cityName;
  const label =
    scopeLabel ||
    (global ? "Global (All Cities)" : cityName ? `City · ${cityName}` : "City scoped");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        global
          ? "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300"
          : "bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300",
        className,
      )}
      title={label}
    >
      {global ? <Globe2 className="h-3 w-3 shrink-0" /> : <MapPin className="h-3 w-3 shrink-0" />}
      <span className="max-w-44 truncate">{label}</span>
    </span>
  );
}
