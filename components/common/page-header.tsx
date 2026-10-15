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
  showHomeBreadcrumb?: boolean;
  welcomeMessage?: string;
};

export function PageHeader({
  title,
  description,
  badge,
  action,
  className,
  breadcrumbs,
  showHomeBreadcrumb,
  welcomeMessage,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-full min-w-0 flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="w-full max-w-full min-w-0 space-y-2 sm:space-y-3">
        {welcomeMessage && (
          <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
            <span className="text-lg">👋</span>
            <p className="text-primary text-sm font-medium">{welcomeMessage}</p>
          </div>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} showHome={showHomeBreadcrumb ?? true} className="mb-2" />
        )}
        {title && (
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {badge}
          </div>
        )}
        {description && (
          <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">{description}</p>
        )}
      </div>

      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}
