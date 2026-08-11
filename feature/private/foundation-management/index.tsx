"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { FoundationFilters } from "./components/foundation-filters";
import { FoundationHeader } from "./components/foundation-header";
import { FoundationStats } from "./components/foundation-stats";
import { FoundationTable } from "./components/foundation-table";
import { useFoundationFilters } from "./hooks/useFoundationFilters";

export default function FoundationManagement() {
  const {
    activeTab,
    setActiveTab,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    country,
    setCountry,
    city,
    setCity,
    filteredData,
    stats,
    hasFilters,
    clearFilters,
  } = useFoundationFilters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Foundation And Charities Management"
        description="Manage and monitor all registered foundations and foundation requests."
        badge={<ComingSoonBadge />}
      />

      <FoundationStats stats={stats} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsContent value={activeTab} className="m-0">
          <FoundationFilters
            fromDate={fromDate}
            toDate={toDate}
            country={country}
            city={city}
            hasFilters={hasFilters}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onCountryChange={setCountry}
            onCityChange={setCity}
            onClearFilters={clearFilters}
          />
        </TabsContent>
        <FoundationHeader
          activeTab={activeTab}
          filteredCount={filteredData.length}
          onTabChange={setActiveTab}
        />
        <TabsContent value={activeTab} className="m-0">
          <FoundationTable data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
