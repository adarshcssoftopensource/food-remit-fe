"use client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InboxIcon } from "lucide-react";
import { type ReactNode } from "react";

interface NoDataFoundProps {
  icon?: ReactNode;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function NoDataFound({
  icon = <InboxIcon className="size-8" />,
  title = "No Data Found",
  action,
  className,
}: NoDataFoundProps) {
  return (
    <Empty
      className={
        className ??
        "rounded-2xl border border-dashed border-slate-200/90 bg-white/50 py-10 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-900/50"
      }
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>

      <EmptyContent>
        {action && (
          <Button onClick={action.onClick} variant="default" size="sm">
            {action.label}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
