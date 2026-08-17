import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ComingSoonBadgeProps = {
  className?: string;
  label?: string;
  showIcon?: boolean;
  size?: "default" | "compact";
};

export function ComingSoonBadge({
  className,
  label = "Coming soon",
  size = "default",
  showIcon = size === "default",
}: ComingSoonBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-red-500/30 bg-linear-to-r from-red-500/10 to-red-500/5 font-bold text-red-500 shadow-sm dark:border-red-400/30 dark:from-red-500/15 dark:to-red-500/10 dark:text-red-400",
        size === "default"
          ? "px-1.5 text-[10px] tracking-[0.08em]"
          : "h-4 border-red-500 bg-red-500 px-1.5 text-[9px] tracking-[0.04em] text-white dark:border-red-500 dark:bg-red-500 dark:text-white",
        className,
      )}
    >
      {showIcon && <Sparkles size={20} />}
      {label}
    </Badge>
  );
}
