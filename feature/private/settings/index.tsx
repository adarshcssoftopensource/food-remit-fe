"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePassword } from "./components/change-password";
import { CitiesManagement } from "./components/cities-management";
import { CountriesManagement } from "./components/countries-management";
import { MarkupManagement } from "./components/markup-management";
import { ProcessingFee } from "./components/processing-fee";

const tabs = [
  {
    value: "countries",
    label: "Countries Management",
    component: <CountriesManagement />,
  },
  {
    value: "cities",
    label: "Cities Management",
    component: <CitiesManagement />,
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

const triggerClass =
  "data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground h-8 rounded-md";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage countries, cities, fees, and other platform settings."
      />

      <Tabs defaultValue="countries" className="w-full">
        <TabsList className="bg-muted grid h-10! w-full grid-cols-5 rounded-lg p-1">
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
