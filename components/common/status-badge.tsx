import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  activeLabel?: string;
  displayLabel?: string;
  className?: string;
}

export function StatusBadge({
  status,
  activeLabel = "Active",
  displayLabel,
  className,
}: StatusBadgeProps) {
  const isActive = status === activeLabel;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-2",
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-red-500")} />
      {displayLabel || status}
    </Badge>
  );
}
