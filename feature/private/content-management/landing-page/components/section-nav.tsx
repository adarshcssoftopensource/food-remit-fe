"use client";

import { LayoutTemplate } from "lucide-react";

import { cn } from "@/lib/utils";
import { LANDING_CMS_SECTIONS, type LandingSectionKey } from "../types";

type SectionNavProps = {
  activeSection: LandingSectionKey;
  onSelect: (section: LandingSectionKey) => void;
};

export function SectionNav({ activeSection, onSelect }: SectionNavProps) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
      <div className="from-primary/8 border-b border-slate-100 bg-linear-to-r via-emerald-50/50 to-transparent px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-xl">
            <LayoutTemplate className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Landing Sections</p>
            <p className="text-xs text-slate-500">Click a section to edit</p>
          </div>
        </div>
      </div>

      <nav className="flex max-h-[min(70vh,640px)] flex-col gap-0.5 p-2">
        {LANDING_CMS_SECTIONS.map((item) => {
          const active = activeSection === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={cn(
                "relative w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                active
                  ? "shadow-primary/25 bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-sm"
                  : "hover:bg-primary/8 hover:text-primary text-slate-600",
              )}
            >
              {active ? (
                <span className="bg-primary-foreground/90 absolute top-1/2 left-1 h-4 w-0.5 -translate-y-1/2 rounded-full" />
              ) : null}
              <span className={cn(active && "pl-1.5")}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
