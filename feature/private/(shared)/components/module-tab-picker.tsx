"use client";

import { DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ModuleTabPickerProps<T extends string> {
  tabs: { id: T; label: string; icon: any }[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export function ModuleTabPicker<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: ModuleTabPickerProps<T>) {
  return (
    <div className="min-w-44 flex-1 space-y-3">
      <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Module
      </Label>
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <DrawerClose key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "text-secondary bg-teal-900 shadow-md dark:bg-teal-50 dark:text-teal-900"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </div>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            </DrawerClose>
          );
        })}
      </div>
    </div>
  );
}
