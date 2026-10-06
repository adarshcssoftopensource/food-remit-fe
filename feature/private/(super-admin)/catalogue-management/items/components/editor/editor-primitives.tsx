import type { ReactNode } from "react";

export const labelClass = "text-[13px] font-semibold text-slate-700 dark:text-slate-200";
export const textareaClass = "resize-y rounded-xl shadow-none";

export function Optional() {
  return <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>;
}

export function Required() {
  return <span className="text-destructive ml-0.5">*</span>;
}

export function Section({
  icon,
  title,
  description,
  aside,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex min-w-0 items-start gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {aside}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ImageDropZone({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-2 dark:border-slate-700 dark:bg-slate-950/40">
      {children}
    </div>
  );
}
