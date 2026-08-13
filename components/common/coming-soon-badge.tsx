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
        "border-primary/20 from-primary/5 to-primary/5 text-primary dark:border-primary/30 dark:from-primary/50/15 dark:to-primary/50/10 dark:text-primary/80 bg-linear-to-r font-bold shadow-sm",
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
