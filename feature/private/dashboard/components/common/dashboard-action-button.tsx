"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardActionButtonProps {
  href: string;
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

export function DashboardActionButton({
  href,
  label = "View All",
  icon: Icon = ArrowRight,
  className,
}: DashboardActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200",
        className,
      )}
    >
      <span>{label}</span>
      <Icon className="group-hover:text-primary h-3.5 w-3.5 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 dark:text-slate-500" />
    </Link>
  );
}
