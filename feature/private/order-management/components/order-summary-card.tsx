"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { CheckCircle2, Clock, Package, Repeat, ShieldCheck, Tag, Calendar } from "lucide-react";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderData } from "../types/order.types";

interface OrderSummaryCardProps {
  order: OrderData;
}

function InfoField({
  label,
  icon,
  value,
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const recurringDateList = order.recurringDateList || [];
  const completedDates = recurringDateList.filter((d) => d.status === 1);
  const pendingDates = recurringDateList.filter((d) => d.status === 0);

  return (
    <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
      <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <CardTitle className="flex items-center justify-between text-base font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="flex items-center">
            <Package className="mr-2.5 size-5 text-emerald-500" />
            Order Summary
          </span>
          <OrderStatusBadge status={order.orderStatus} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left: Details */}
          <div className="flex-1 p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Reference Number
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {order.refrenceNumber || order.id}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Order ID
                </p>
                <p className="mt-1 truncate font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {order.id}
                </p>
              </div>
              <InfoField
                label="Date & Time"
                icon={<Calendar className="mr-1 size-3" />}
                value={
                  <>
                    {formatDate(order.createdAt || "")} •{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : order.time || "N/A"}
                  </>
                }
              />
              <InfoField
                label="Food Type"
                icon={<Tag className="mr-1 size-3" />}
                value={order.foodType || "Sent Food Order"}
              />
              <InfoField
                label="Recurring"
                icon={<Repeat className="mr-1 size-3" />}
                value={order.recurring || "No"}
              />
            </div>

            {/* Recurring details */}
            {order.isRecurring && (
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                <h4 className="mb-3 flex items-center text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-400">
                  <Repeat className="mr-2 size-3.5" /> Recurring Schedule Details
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-[10px] font-medium text-indigo-400/80 uppercase">
                      Frequency
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-indigo-900 dark:text-indigo-100">
                      {order.recurringFrequency || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-indigo-400/80 uppercase">
                      Start Date
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-indigo-900 dark:text-indigo-100">
                      {order.recurringStartDate ? formatDate(order.recurringStartDate) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-indigo-400/80 uppercase">End Date</p>
                    <p className="mt-0.5 text-sm font-bold text-indigo-900 dark:text-indigo-100">
                      {order.recurringEndDate ? formatDate(order.recurringEndDate) : "N/A"}
                    </p>
                  </div>
                </div>

                {recurringDateList.length > 0 && (
                  <div className="mt-4 border-t border-indigo-200/50 pt-4 dark:border-indigo-800/50">
                    <p className="mb-3 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                      Schedule Status ({completedDates.length}/{recurringDateList.length} Completed)
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1.5 flex items-center text-[10px] font-medium text-emerald-600 uppercase dark:text-emerald-400">
                          <CheckCircle2 className="mr-1 size-3" /> Paid / Completed (
                          {completedDates.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {completedDates.length > 0 ? (
                            completedDates.map((d, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                title={d.paidOn ? `Paid on: ${formatDate(d.paidOn)}` : undefined}
                              >
                                {formatDate(d.date)}
                                {d.paidOn && (
                                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400">
                                    (Paid: {formatDate(d.paidOn)})
                                  </span>
                                )}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">
                              No completed payments yet.
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1.5 flex items-center text-[10px] font-medium text-amber-600 uppercase dark:text-amber-400">
                          <Clock className="mr-1 size-3" /> Pending ({pendingDates.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {pendingDates.length > 0 ? (
                            pendingDates.map((d, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded border border-dashed border-amber-200/50 bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/30 dark:text-amber-300"
                              >
                                {formatDate(d.date)}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">
                              No pending payments.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: QR Code */}
          {order.qrCode && (
            <div className="flex w-full shrink-0 flex-col items-center justify-center border-t border-slate-100 bg-slate-50/50 p-6 md:w-72 md:border-t-0 md:border-l dark:border-slate-800 dark:bg-slate-800/30">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={order.qrCode} alt="Order QR Code" className="size-28 object-contain" />
              </div>
              <span className="mt-3 inline-flex items-center text-[11px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                <ShieldCheck className="mr-1.5 size-3.5" /> Backend Generated QR
              </span>
              <p className="mt-1 text-[10px] text-slate-400">Contains Order & Product Details</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
