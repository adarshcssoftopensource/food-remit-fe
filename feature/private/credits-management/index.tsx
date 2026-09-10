"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, CreditCard, DollarSign } from "lucide-react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterState } from "@/hooks/use-filter-state";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";
import { getCreditColumns } from "./columns/credit-columns";
import { CreditConfirmPay } from "./components/credit-confirm-pay";
import { useGetCredits } from "./hooks/use-get-credits";
import { usePayCreditRefund } from "./hooks/use-pay-credit-refund";
import type { CreditsData } from "./types/credits.types";

function formatLocalDate(date?: Date): string | undefined {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder: "asc" | "desc" | undefined =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

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
        onViewDetails: (id) => router.push(`/credits-management/${id}`),
        onPayRefund: (credit) => setPayingCredit(credit),
        isSuperAdmin,
      }),
    [isSuperAdmin, router],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credits Management"
        description="Unified management of out-of-stock item refunds, settlement records, and Super Admin payout execution."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Total Credits
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                {summary?.totalCredits ?? 0}
              </p>
            </div>
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <CreditCard className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">All recorded credit orders</p>
        </Card>

        <Card className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-5 shadow-xs backdrop-blur-xl dark:border-amber-500/20 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                Pending Credits
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-amber-900 dark:text-amber-200">
                {summary?.pendingCredits ?? 0}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-amber-700/80 dark:text-amber-400/80">
            Awaiting Super Admin refund payment
          </p>
        </Card>

        <Card className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-5 shadow-xs backdrop-blur-xl dark:border-emerald-500/20 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                Completed Credits
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-emerald-900 dark:text-emerald-200">
                {summary?.completedCredits ?? 0}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-400/80">
            Successfully refunded & finalized
          </p>
        </Card>

        {/* Total Pending Refund Value */}
        <Card className="rounded-2xl border border-rose-200/60 bg-rose-50/40 p-5 shadow-xs backdrop-blur-xl dark:border-rose-500/20 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-rose-700 uppercase dark:text-rose-400">
                Pending Refund Amount
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-rose-900 dark:text-rose-200">
                {cleanCurrencyDisplay(summary?.totalPendingRefund || "$0.00")}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
              <DollarSign className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-rose-700/80 dark:text-rose-400/80">
            Total out-of-stock items value
          </p>
        </Card>
      </div>

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
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setPage(1);
            }}
            className="w-full sm:w-auto"
          >
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
    </div>
  );
}
