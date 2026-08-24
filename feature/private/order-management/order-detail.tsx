"use client";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  User,
  Store,
  Receipt,
  CreditCard,
  ShoppingBag,
  Banknote,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetOrder } from "./hooks/use-get-order";
import { formatDate } from "@/lib/date";

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);

  const renderStatus = (status: number) => {
    let label = "Unknown";
    let colorClass = "border-slate-200 bg-slate-50 text-slate-700";
    let dotClass = "bg-slate-500";

    if (status === 0) {
      label = "Declined";
      colorClass =
        "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
      dotClass = "bg-red-500";
    } else if (status === 1) {
      label = "Pending";
      colorClass =
        "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
      dotClass = "bg-amber-500";
    } else if (status === 5) {
      label = "Partial";
      colorClass =
        "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400";
      dotClass = "bg-blue-500";
    } else if (status === 6) {
      label = "Completed";
      colorClass =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
      dotClass = "bg-emerald-500";
    }

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
      >
        <span className={`size-1.5 rounded-full ${dotClass}`} />
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <Package className="size-12 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Order Not Found</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Order Details"
          description={`Viewing details for order #${order.id.split("-")[0]}`}
        />
        <Button variant="outline" onClick={() => router.back()} className="rounded-full shadow-sm">
          <ArrowLeft className="mr-2 size-4" /> Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Info Card */}
        <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              <Package className="mr-2 size-4 text-emerald-500" />
              Order Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-xs font-medium text-slate-500">Reference Number</p>
              <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                {order.id}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Order Date</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Order Type</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {order.orderType === 1
                  ? "Sent Food Order"
                  : order.orderType === 2
                    ? "Requested Food Order"
                    : "Recurring Order"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Current Status</p>
              {renderStatus(order.orderStatus)}
            </div>
          </CardContent>
        </Card>

        {/* Entities Card */}
        <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              <User className="mr-2 size-4 text-blue-500" />
              Involved Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <User className="size-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Sender</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {order.userName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <User className="size-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Receiver</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {order.recieverName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Store className="size-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Fulfilling Store</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {order.storeName || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              <CreditCard className="mr-2 size-4 text-purple-500" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {order.transactions && order.transactions.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.transactions.map((tx: any, idx: number) => (
                  <div key={idx} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Txn #{tx.id.substring(0, 8)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {tx.paymentMethod || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {tx.currency} {tx.transactionAmount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-500">Status</p>
                        <p
                          className={`text-sm font-semibold ${tx.transactionStatus === "Completed" ? "text-emerald-600" : "text-amber-600"}`}
                        >
                          {tx.transactionStatus || "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center space-y-2 p-5 text-slate-400">
                <Receipt className="size-8 opacity-20" />
                <p className="text-sm">No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items Table */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            <ShoppingBag className="mr-2 size-4 text-rose-500" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-xs text-slate-500 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-5 py-3 font-medium">Item</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Quantity</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.itemName || "Unknown Item"}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">
                        {item.unit} {item.price}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-slate-900 dark:text-white">
                        {item.unit} {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center space-y-2 text-slate-400">
              <Banknote className="size-8 opacity-20" />
              <p className="text-sm">No items attached to this order</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
