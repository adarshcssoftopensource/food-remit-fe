import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StepHeaderProps {
  step: number;
  title: string;
  description: string;
  icon?: LucideIcon;
  totalSteps?: number;
  action?: ReactNode;
}

export function StepHeader({
  step,
  title,
  description,
  icon: Icon,
  totalSteps = 7,
  action,
}: StepHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <span className="from-primary flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br to-teal-500 text-white shadow-lg shadow-emerald-600/25">
          {Icon ? <Icon className="size-6" /> : <span className="text-lg font-black">{step}</span>}
        </span>
        <div className="space-y-0.5">
          <p className="text-primary text-[11px] font-bold tracking-widest uppercase">
            Step {step} of {totalSteps}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
