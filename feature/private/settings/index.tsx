"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePassword } from "./components/change-password";
import { CitiesManagement } from "./components/cities-management";
import { CountriesManagement } from "./components/countries-management";
import { MarkupManagement } from "./components/markup-management";
import { ProcessingFee } from "./components/processing-fee";

import { useProfile } from "@/components/providers/profile-provider";
import { useMemo } from "react";

const triggerClass =
  "data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground h-8 rounded-md";

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
        value: "password",
        label: "Change Password",
        component: <ChangePassword />,
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
          className="bg-muted grid h-10! w-full rounded-lg p-1"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={triggerClass}>
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
