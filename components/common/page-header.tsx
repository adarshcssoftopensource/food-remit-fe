import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, badge, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 pb-5 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
