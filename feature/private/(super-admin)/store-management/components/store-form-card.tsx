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
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className={iconWrapperClassName}>
          <Icon className={iconClassName} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 p-6">{children}</div>
    </div>
  );
}
