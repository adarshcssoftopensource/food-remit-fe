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
                  "flex h-full items-center justify-center text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#1f8c1f] text-white"
                    : "bg-[#f2f2f2] text-slate-700 hover:bg-[#e5e5e5]",
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
