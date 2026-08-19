import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="group hover:border-primary/20 hover:shadow-primary/5 relative flex h-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-900">
      <div className="group-hover:bg-primary/10 group-hover:ring-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100 transition-colors dark:bg-slate-800 dark:ring-slate-700">
        <div className="group-hover:text-primary text-slate-500 transition-colors dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
          {label}
        </span>
        <span className="truncate text-sm font-semibold text-slate-800 capitalize dark:text-slate-100">
          {value}
        </span>
      </div>
    </div>
  );
}
