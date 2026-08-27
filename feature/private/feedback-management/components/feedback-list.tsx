"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FEEDBACK } from "@/constants/feedback";
import { MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { feedbackColumns } from "../columns/feedback-columns";

import { useFilterState } from "@/hooks/use-filter-state";

export function FeedbackList() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    country: "all",
    city: "all",
  });

  const filteredFeedback = useMemo(() => {
    return MOCK_FEEDBACK.filter((item) => {
      if (
        applied.country !== "all" &&
        applied.country !== "All" &&
        (item as any).countryId &&
        (item as any).countryId !== applied.country
      ) {
        return false;
      }
      if (
        applied.city !== "all" &&
        applied.city !== "All" &&
        (item as any).cityId &&
        (item as any).cityId !== applied.city
      ) {
        return false;
      }
      return true;
    });
  }, [applied.country, applied.city]);

  const hasFilters =
    (applied.country !== "all" && applied.country !== "All") ||
    (applied.city !== "all" && applied.city !== "All");

  const clearFilters = () => {
    reset();
  };

  const activeFilterCount =
    (applied.country !== "all" && applied.country !== "All" ? 1 : 0) +
    (applied.city !== "all" && applied.city !== "All" ? 1 : 0);

  return (
    <div className="space-y-6">
      <ModuleFilters
        title="Filter Feedback"
        description="Filter feedback responses by country and city"
        countryId={draft.country}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        cityId={draft.city}
        onCityChange={(v) => setDraft((p) => ({ ...p, city: v }))}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        onApplyFilters={apply}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Feedback List
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {filteredFeedback.length} feedback item{filteredFeedback.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={feedbackColumns} data={filteredFeedback} searchKey="subject" />
        </CardContent>
      </Card>
    </div>
  );
}
