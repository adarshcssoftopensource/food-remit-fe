import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("inline-flex items-center overflow-x-auto py-0.5", className)}
    >
      <ol className="inline-flex items-center gap-1.5 rounded-2xl border border-white/80 bg-white/80 p-1.5 shadow-xs backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-900/70">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              title="Dashboard"
              className="group flex h-7 w-7 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
            >
              <Home className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              <span className="sr-only">Dashboard</span>
            </Link>
            <ChevronRight className="mx-0.5 h-3.5 w-3.5 shrink-0 stroke-[2.2] text-slate-300 dark:text-slate-600" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {isActive ? (
                <span
                  aria-current="page"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-3 py-1 text-[13px] font-semibold text-white shadow-xs shadow-emerald-600/20"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-xl px-2.5 py-1 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-emerald-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 stroke-[2.2] text-slate-300 dark:text-slate-600" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
