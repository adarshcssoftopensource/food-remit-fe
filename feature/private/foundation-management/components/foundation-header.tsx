"use client";

import { CardTitle } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FOUNDATION_TABS,
  MOCK_FOUNDATIONS_DATA,
  MOCK_FOUNDATION_REQUESTS,
} from "@/constants/foundation-management";

interface FoundationHeaderProps {
  activeTab: "registered" | "requests";
  filteredCount: number;
  onTabChange: (tab: "registered" | "requests") => void;
}

export function FoundationHeader({ activeTab, filteredCount, onTabChange }: FoundationHeaderProps) {
  const totalCount =
    activeTab === "registered" ? MOCK_FOUNDATIONS_DATA.length : MOCK_FOUNDATION_REQUESTS.length;
  const title = activeTab === "registered" ? "Registered Foundations" : "Foundation Requests";
  const subtitle = `${filteredCount} of ${totalCount} ${activeTab === "registered" ? "foundations" : "requests"}`;

  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      </div>
      <TabsList className="w-fit rounded-lg bg-gray-50 p-1">
        {FOUNDATION_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => onTabChange(tab.value as typeof activeTab)}
            className="data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
