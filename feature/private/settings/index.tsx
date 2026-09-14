"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitiesManagement } from "./components/cities-management";
import { CountriesManagement } from "./components/countries-management";
import { GovtTaxManagement } from "./components/govt-tax-management";
import { MarkupManagement } from "./components/markup-management";
import { ProcessingFee } from "./components/processing-fee";

import { useProfile } from "@/components/providers/profile-provider";
import { useMemo } from "react";
import { Globe, MapPin, Percent, Receipt, ShieldCheck } from "lucide-react";

export function SettingsPage() {
  const { hasPermission, profile } = useProfile();
  const isStoreManager = profile?.roleCode === "STORE_MANAGER";

  const tabs = useMemo(() => {
    const allTabs = [
      {
        value: "countries",
        label: "Countries Management",
        component: <CountriesManagement />,
        permission: "countryManagement",
        icon: <Globe className="size-4" />,
      },
      {
        value: "cities",
        label: "Cities Management",
        component: <CitiesManagement />,
        permission: "cityManagement",
        icon: <MapPin className="size-4" />,
      },
      {
        value: "processing-fee",
        label: "Processing Fee",
        component: <ProcessingFee />,
        icon: <Receipt className="size-4" />,
      },
      {
        value: "markup",
        label: "Markup (%)",
        component: <MarkupManagement />,
        icon: <Percent className="size-4" />,
      },
      ...(isStoreManager
        ? [
            {
              value: "govt-tax",
              label: "Govt Tax",
              component: <GovtTaxManagement />,
              icon: <ShieldCheck className="size-4" />,
            },
          ]
        : []),
    ];

    return allTabs.filter((tab) => !tab.permission || hasPermission(tab.permission));
  }, [hasPermission, isStoreManager]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage countries, cities, fees, and other platform settings."
      />

      <Tabs defaultValue={tabs[0]?.value} className="w-full">
        <TabsList
          className="grid h-auto! w-full gap-1.5 rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-xs backdrop-blur-xl md:w-auto dark:border-slate-800/80 dark:bg-slate-900/60"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-10 rounded-xl px-3 text-xs font-semibold md:px-4 md:text-sm"
            >
              {tab.icon}
              <span className="ml-2 hidden md:inline-block">{tab.label}</span>
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
