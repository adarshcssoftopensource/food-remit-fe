"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitiesManagement } from "./components/cities-management";
import { CountriesManagement } from "./components/countries-management";
import { MarkupManagement } from "./components/markup-management";
import { ProcessingFee } from "./components/processing-fee";

import { useProfile } from "@/components/providers/profile-provider";
import { useMemo } from "react";

export function SettingsPage() {
  const { hasPermission } = useProfile();

  const tabs = useMemo(() => {
    const allTabs = [
      {
        value: "countries",
        label: "Countries Management",
        component: <CountriesManagement />,
        permission: "countryManagement",
      },
      {
        value: "cities",
        label: "Cities Management",
        component: <CitiesManagement />,
        permission: "cityManagement",
      },
      {
        value: "processing-fee",
        label: "Processing Fee",
        component: <ProcessingFee />,
      },
      {
        value: "markup",
        label: "Markup (%)",
        component: <MarkupManagement />,
      },
    ];

    return allTabs.filter((tab) => !tab.permission || hasPermission(tab.permission));
  }, [hasPermission]);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage countries, cities, fees, and other platform settings."
      />

      <Tabs defaultValue={tabs[0]?.value} className="w-full">
        <TabsList
          className="grid h-auto! w-full gap-1.5 rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-10 rounded-xl text-xs font-semibold sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
