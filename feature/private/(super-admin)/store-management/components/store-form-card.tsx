import React from "react";

interface StoreFormCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconWrapperClassName: string;
  iconClassName: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function StoreFormCard({
  icon: Icon,
  iconWrapperClassName,
  iconClassName,
  title,
  subtitle,
  children,
}: StoreFormCardProps) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="flex min-w-0 items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3.5 sm:px-6 sm:py-4">
        <div className={`shrink-0 ${iconWrapperClassName}`}>
          <Icon className={iconClassName} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-800 sm:text-base">{title}</h3>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="min-w-0 space-y-4 p-4 sm:p-6">{children}</div>
    </div>
  );
}
