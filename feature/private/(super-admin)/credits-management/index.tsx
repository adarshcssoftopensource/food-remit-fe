"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFilterState } from "@/hooks/use-filter-state";
import { useDebounce } from "@/lib/debounce";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { SortingState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getCreditColumns } from "./columns/credit-columns";
import { CreditConfirmPay } from "./components/credit-confirm-pay";
import { CreditsStatusTabs } from "./components/credits-status-tabs";
import { CreditsSummaryCards } from "./components/credits-summary-cards";
import { useGetCredits } from "./hooks/use-get-credits";
import { usePayCreditRefund } from "./hooks/use-pay-credit-refund";
import type { CreditsData } from "./types/credits.types";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { ROUTES } from "@/config/routes";

function formatLocalDate(date?: Date): string | undefined {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getSortOrder(sorting: SortingState): "asc" | "desc" | undefined {
  return sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;
}

export function CreditsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";

  const { isSuperAdmin } = useProfile();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [payingCredit, setPayingCredit] = useState<CreditsData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const payRefundMutation = usePayCreditRefund();

  const handleConfirmPayFromTable = async () => {
    if (!payingCredit) return;
    try {
      await payRefundMutation.mutateAsync(payingCredit.orderId || payingCredit.id);
      setPayingCredit(null);
    } catch {
      // Toast handled by usePayCreditRefund
    }
  };

  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
  });

  const sortBy = sorting[0]?.id;
  const sortOrder = getSortOrder(sorting);

  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
      status: activeTab,
      fromDate: formatLocalDate(applied.fromDate),
      toDate: formatLocalDate(applied.toDate),
    };
  }, [page, limit, debouncedSearch, sortBy, sortOrder, activeTab, applied]);

  const { data: creditsResponse, isLoading } = useGetCredits(queryParams);

  const data = creditsResponse?.data ?? [];
  const summary = creditsResponse?.summary;
  const pagination = creditsResponse?.pagination;

  const hasFilters = Boolean(applied.fromDate || applied.toDate);

  const activeFilterCount = applied.fromDate || applied.toDate ? 1 : 0;

  const handleClearFilters = () => {
    reset();
    setSearchValue("");
    setPage(1);
  };

  const handleApplyFilters = () => {
    apply();
    setPage(1);
  };

  const columns = useMemo(
    () =>
      getCreditColumns({
        onViewDetails: (id) => router.push(`${ROUTES.ADMIN.CREDITS_MANAGEMENT}/${id}`),
        onPayRefund: (credit) => setPayingCredit(credit),
        isSuperAdmin,
        onImageClick: (url) => setSelectedImage(url),
      }),
    [isSuperAdmin, router],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credits Management"
        description="Unified management of out-of-stock item refunds, settlement records, and Super Admin payout execution."
      />

      <CreditsSummaryCards summary={summary} />

      <ModuleFilters
        title="Filter Credits"
        description="Filter records by date range"
        hideCountryFilter={true}
        hideCityFilter={true}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-70 flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={draft.fromDate}
            toDate={draft.toDate}
            onFromDateChange={(d) => setDraft((p) => ({ ...p, fromDate: d ?? undefined }))}
            onToDateChange={(d) => setDraft((p) => ({ ...p, toDate: d ?? undefined }))}
          />
        </div>
      </ModuleFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <CreditsStatusTabs
            activeTab={activeTab}
            onTabChange={(val) => {
              setActiveTab(val);
              setPage(1);
            }}
            summary={summary}
          />
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={data}
            loading={isLoading}
            searchKey="referenceNumber"
            searchValue={searchValue}
            onSearchChange={(val) => {
              setSearchValue(val);
              setPage(1);
            }}
            onSortingChange={(newSorting) => {
              setSorting(newSorting);
              setPage(1);
            }}
            manualSorting={true}
            manualFiltering={true}
            manualPagination={true}
            currentPage={pagination?.page ?? page}
            totalPages={pagination?.totalPages ?? 1}
            rowsPerPage={pagination?.limit ?? limit}
            onPageChange={setPage}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>

      {payingCredit && (
        <CreditConfirmPay
          open={Boolean(payingCredit)}
          onOpenChange={(open) => !open && setPayingCredit(null)}
          amount={cleanCurrencyDisplay(payingCredit.refundValue)}
          customerName={payingCredit.customer?.name || "Customer"}
          referenceNumber={payingCredit.referenceNumber}
          storeName={payingCredit.store?.name}
          isPending={payRefundMutation.isPending}
          onConfirm={handleConfirmPayFromTable}
          onCancel={() => setPayingCredit(null)}
        />
      )}

      <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
