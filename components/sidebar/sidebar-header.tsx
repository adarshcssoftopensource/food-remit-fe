"use client";

import { Input } from "@/components/ui/input";
import { APP_ASSETS } from "@/config/assets";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SidebarHeader({ isCollapsed, searchQuery, onSearchChange }: SidebarHeaderProps) {
  return (
    <>
      <div
        className={cn(
          "flex items-center justify-center transition-colors duration-200",
          isCollapsed ? "h-14 px-1" : "h-18 px-4",
        )}
      >
        {isCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 shadow-md ring-1 shadow-emerald-600/20 ring-emerald-500/30 transition-colors transition-transform hover:scale-105">
            <span className="text-sm font-black tracking-wider text-white">FR</span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center px-3 py-2.5">
            <Image
              src={APP_ASSETS.LOGO.PATH}
              alt={APP_ASSETS.LOGO.ALT}
              width={130}
              height={44}
              className="h-auto max-h-20 w-auto object-contain drop-shadow-xs"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="mt-2 px-3 pb-3">
          <div className="group relative flex h-10 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 shadow-xs backdrop-blur-md transition-colors duration-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-[0_4px_16px_-4px_rgba(16,185,129,0.25)] focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/60 dark:focus-within:bg-slate-900 dark:hover:border-slate-700">
            <Search className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
            <Input
              placeholder="Search menu…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-full border-none bg-transparent p-0 text-sm shadow-none placeholder:text-slate-400 focus-visible:bg-transparent focus-visible:ring-0 dark:focus-visible:bg-transparent"
            />
          </div>
        </div>
      )}
    </>
  );
}
