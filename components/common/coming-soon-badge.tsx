import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ComingSoonBadgeProps = {
  className?: string;
};

export function ComingSoonBadge({ className }: ComingSoonBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-violet-200 bg-linear-to-r from-violet-50 to-fuchsia-50 px-1.5 text-[10px] font-bold tracking-[0.08em] text-violet-700 shadow-sm dark:border-violet-500/30 dark:from-violet-500/15 dark:to-fuchsia-500/10 dark:text-violet-200",
        className,
      )}
    >
      <Sparkles size={20} />
      Coming soon
    </Badge>
  );
}
