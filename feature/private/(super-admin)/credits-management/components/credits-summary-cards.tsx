import { Card } from "@/components/ui/card";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { CheckCircle2, Clock, CreditCard, DollarSign } from "lucide-react";
import type { CreditsSummary } from "../types/credits.types";

export function CreditsSummaryCards({ summary }: { summary?: CreditsSummary }) {
  return (
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
  );
}
