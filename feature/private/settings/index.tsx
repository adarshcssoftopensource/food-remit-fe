"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitiesManagement } from "./components/cities-management";
import { CountriesManagement } from "./components/countries-management";
import { EmailNotificationsSettings } from "./components/email-notifications-settings";
import { GovtTaxManagement } from "./components/govt-tax-management";
import { MarkupManagement } from "./components/markup-management";
import { OrderAbandonSettings } from "./components/order-abandon-settings";
import { ProcessingFee } from "./components/processing-fee";

import { useProfile } from "@/components/providers/profile-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemo } from "react";
import { Clock3, Globe, Mail, MapPin, Percent, Receipt, ShieldCheck } from "lucide-react";

export function SettingsPage() {
  const { hasPermission, profile } = useProfile();
  const isStoreManager = profile?.roleCode === "STORE_MANAGER";
  const isMobile = useIsMobile();

  const tabs = useMemo(() => {
    const allTabs = [
      {
        value: "email-notifications",
        label: "Email Notifications",
        component: <EmailNotificationsSettings />,
        icon: <Mail className="size-4" />,
      },
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
        label: "Markup",
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
            {
              value: "order-abandon",
              label: "Auto Abandon",
              component: <OrderAbandonSettings />,
              icon: <Clock3 className="size-4" />,
            },
          ]
        : []),
    ];

    return allTabs.filter(
      (tab) => !("permission" in tab) || !tab.permission || hasPermission(tab.permission),
    );
  }, [hasPermission, isStoreManager]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage email notification preferences, locations, fees, and platform policies."
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
              title={tab.label}
              className="flex h-10 items-center justify-center rounded-xl px-2.5 text-xs font-semibold sm:px-3 md:px-4 md:text-sm"
            >
              {tab.icon}
              {!isMobile && <span className="ml-2 whitespace-nowrap">{tab.label}</span>}
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
