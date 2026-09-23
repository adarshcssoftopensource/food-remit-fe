import { Bot, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SYSTEM_PREFIX = /^\[System\]\s*/i;

export function parseAbandonRemark(raw?: string | null): {
  isSystem: boolean;
  remark: string;
} {
  const text = (raw || "").trim();
  if (!text) return { isSystem: false, remark: "" };
  const isSystem = SYSTEM_PREFIX.test(text);
  return {
    isSystem,
    remark: text.replace(SYSTEM_PREFIX, "").trim(),
  };
}

export function SystemAbandonBadge({
  isSystem,
  className,
}: {
  isSystem: boolean;
  className?: string;
}) {
  if (isSystem) {
    return (
      <Button
        variant={"ghost"}
        className={cn(
          "inline-flex h-8 w-fit items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-sm dark:bg-slate-200 dark:text-slate-900",

          className,
        )}
      >
        <Bot className="size-3" />
        System
      </Button>
    );
  }

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "inline-flex h-8 w-fit items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-900 uppercase ring-1 ring-amber-200/80 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800",
        className,
      )}
    >
      <UserRound className="size-3" />
      Manual
    </Button>
  );
}
