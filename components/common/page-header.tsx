import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { BreadcrumbItem, Breadcrumbs } from "./breadcrumbs";

type PageHeaderProps = {
  title?: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
  welcomeMessage?: string;
};

export function PageHeader({
  title,
  description,
  badge,
  action,
  className,
  breadcrumbs,
  welcomeMessage,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {welcomeMessage && (
          <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
            <span className="text-lg">👋</span>
            <p className="text-primary text-sm font-medium">{welcomeMessage}</p>
          </div>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-2" />
        )}
        {title && (
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">{title}</h1>
            {badge}
          </div>
        )}
        {description && <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
