import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CreditsSummary } from "../types/credits.types";

interface CreditsStatusTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  summary?: CreditsSummary;
}

export function CreditsStatusTabs({ activeTab, onTabChange, summary }: CreditsStatusTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
      <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100 p-1 sm:w-auto dark:bg-slate-800">
        <TabsTrigger
          value="all"
          className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white"
        >
          All Credits
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-amber-400"
        >
          Pending ({summary?.pendingCredits ?? 0})
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-emerald-400"
        >
          Completed ({summary?.completedCredits ?? 0})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
