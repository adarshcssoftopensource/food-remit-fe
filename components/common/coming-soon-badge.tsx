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
        "border-violet-200 bg-linear-to-r from-violet-50 to-fuchsia-50 font-bold text-violet-700 shadow-sm dark:border-violet-500/30 dark:from-violet-500/15 dark:to-fuchsia-500/10 dark:text-violet-200",
        size === "default"
          ? "px-1.5 text-[10px] tracking-[0.08em]"
          : "border-primary bg-primary text-primary-foreground dark:border-primary dark:bg-primary dark:text-primary-foreground h-4 px-1.5 text-[9px] tracking-[0.04em]",
        className,
      )}
    >
      {showIcon && <Sparkles size={20} />}
      {label}
    </Badge>
  );
}
