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
    <Empty className={className ?? "border-border border border-dashed bg-slate-50"}>
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
