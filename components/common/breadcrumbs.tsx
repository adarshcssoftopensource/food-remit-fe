import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center overflow-x-auto py-1", className)}
    >
      <ol className="flex items-center">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <li
              key={index}
              className="relative flex h-8 items-center"
              style={{ marginLeft: isFirst ? "0" : "-10px" }}
            >
              <div
                className={cn(
                  "flex h-full items-center justify-center text-xs font-medium shadow-xs transition-all",
                  isActive
                    ? "bg-linear-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-emerald-600/20"
                    : "bg-white/85 text-slate-600 hover:bg-white hover:text-slate-900 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800",
                )}
                style={{
                  clipPath: isFirst
                    ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
                    : "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
                  paddingLeft: isFirst ? "1.25rem" : "2rem",
                  paddingRight: "1.75rem",
                }}
              >
                {item.href && !isActive ? (
                  <Link href={item.href} className="flex h-full w-full items-center justify-center">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isActive ? "page" : undefined}>{item.label}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
