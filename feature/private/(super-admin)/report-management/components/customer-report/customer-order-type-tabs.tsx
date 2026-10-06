import type { CustomerReportDetailData } from "../../hooks/use-get-customer-report-detail";

interface CustomerOrderTypeTabsProps {
  stats?: CustomerReportDetailData["stats"];
  selectedOrderType: number | undefined;
  onSelectOrderType: (type: number | undefined) => void;
}

export function CustomerOrderTypeTabs({
  stats,
  selectedOrderType,
  onSelectOrderType,
}: CustomerOrderTypeTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-800/60">
      <button
        type="button"
        onClick={() => onSelectOrderType(undefined)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          selectedOrderType === undefined
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <span>All</span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            selectedOrderType === undefined
              ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              : "bg-slate-200/70 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
          }`}
        >
          {stats?.totalOrders ?? 0}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectOrderType(1)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          selectedOrderType === 1
            ? "bg-white text-slate-900 shadow-xs ring-1 ring-emerald-500/20 dark:bg-slate-900 dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <span>Sent</span>
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          {stats?.ordersSent ?? 0}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectOrderType(2)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          selectedOrderType === 2
            ? "bg-white text-slate-900 shadow-xs ring-1 ring-amber-500/20 dark:bg-slate-900 dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <span>Requested</span>
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          {stats?.ordersRequested ?? 0}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectOrderType(3)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          selectedOrderType === 3
            ? "bg-white text-slate-900 shadow-xs ring-1 ring-purple-500/20 dark:bg-slate-900 dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <span>Received</span>
        <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
          {stats?.completedOrders ?? 0}
        </span>
      </button>
    </div>
  );
}
