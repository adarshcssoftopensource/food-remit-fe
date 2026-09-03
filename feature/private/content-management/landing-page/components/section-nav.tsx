"use client";

import {
  ArrowRight,
  Badge,
  Building2,
  Gift,
  Heart,
  HelpCircle,
  Layout,
  LayoutTemplate,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { LANDING_CMS_SECTIONS, type LandingSectionKey } from "../types";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Heart,
  TrendingUp,
  Workflow,
  Gift,
  Building2,
  Target,
  Badge,
  Trophy,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Layout,
};

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
          const Icon = iconMap[item.icon];
          return (
            <Button
              key={item.key}
              type="button"
              variant="ghost"
              onClick={() => onSelect(item.key)}
              className={cn(
                "relative h-auto w-full justify-start rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                active
                  ? "shadow-primary/25 bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 hover:text-white"
                  : "hover:bg-primary/8 hover:text-primary text-slate-600",
              )}
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </div>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
