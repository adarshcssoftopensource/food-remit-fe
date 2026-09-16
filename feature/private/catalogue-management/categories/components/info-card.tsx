export function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group hover:border-primary/20 hover:shadow-primary/5 relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-slate-50/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/30 dark:hover:bg-slate-900">
      <div className="group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-colors dark:bg-slate-800 dark:ring-slate-700">
        <div className="group-hover:text-primary text-slate-500 transition-colors dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-1">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</span>
      </div>
    </div>
  );
}
