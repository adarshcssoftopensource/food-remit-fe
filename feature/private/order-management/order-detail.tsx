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
  Clock,
  MapPin,
  Phone,
  Barcode,
  Tag,
  Repeat,
  DollarSign,
  Percent,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetOrder } from "./hooks/use-get-order";
import { formatDate } from "@/lib/date";

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);

  const renderStatus = (status: number) => {
    let label = "Unknown";
    let colorClass =
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
    let dotClass = "bg-slate-500";

    if (status === 0 || status === 7) {
      label = "Declined / Cancelled";
      colorClass =
        "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
      dotClass = "bg-red-500";
    } else if (status === 1) {
      label = "Pending";
      colorClass =
        "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
      dotClass = "bg-amber-500";
    } else if (status === 2) {
      label = "Preparing";
      colorClass =
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
      dotClass = "bg-amber-500";
    } else if (status === 3 || status === 4) {
      label = "Out for Delivery";
      colorClass =
        "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300";
      dotClass = "bg-indigo-500";
    } else if (status === 5) {
      label = "Accepted / Sent";
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
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
      >
        <span className={`size-2 rounded-full ${dotClass}`} />
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
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
          description={`Viewing comprehensive order #${order.refrenceNumber || order.id}`}
        />
        <Button variant="outline" onClick={() => router.back()} className="rounded-full shadow-sm">
          <ArrowLeft className="mr-2 size-4" /> Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
              <Package className="mr-2.5 size-5 text-emerald-500" />
              Order Summary & QR Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3.5">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Reference Number
                  </p>
                  <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {order.refrenceNumber || order.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Order ID
                  </p>
                  <p className="truncate font-mono text-xs text-slate-600 dark:text-slate-300">
                    {order.id}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="flex items-center text-xs font-medium text-slate-400">
                      <Calendar className="mr-1 size-3" /> Date
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center text-xs font-medium text-slate-400">
                      <Clock className="mr-1 size-3" /> Time
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {order.time || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="flex items-center text-xs font-medium text-slate-400">
                    <Tag className="mr-1 size-3" /> Food Type
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {order.foodType || "Sent Food Order"}
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-xs font-medium text-slate-400">
                    <Repeat className="mr-1 size-3" /> Recurring
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {order.recurring || "No"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-400">Current Status</p>
                  {renderStatus(order.orderStatus)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-center dark:border-slate-800 dark:bg-slate-800/40">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <img src={order.qrCode} alt="Order QR Code" className="size-36 object-contain" />
                </div>
                <span className="mt-2.5 inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="mr-1 size-3.5" /> Backend Generated QR
                </span>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Contains Order & Product Details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
              <DollarSign className="mr-2.5 size-5 text-purple-500" />
              Financial & Fee Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 p-4 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-indigo-950/20">
              <p className="text-xs font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                Total Order Amount
              </p>
              <p className="text-3xl font-black text-purple-950 dark:text-purple-100">
                {order.price || "0.00 USD"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <p className="flex items-center text-xs font-medium text-slate-400">
                  <CreditCard className="mr-1.5 size-3.5 text-purple-500" /> Mode of Payment
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {order.modeOfPayment || "Online Payment"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <p className="flex items-center text-xs font-medium text-slate-400">
                  <Receipt className="mr-1.5 size-3.5 text-indigo-500" /> Processing Fee
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {order.processingFee || "0.00 USD"}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center text-slate-500">
                  <Percent className="mr-1.5 size-3.5 text-slate-400" /> Total Tax
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {order.totalTax || "0.00 USD"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center text-slate-500">
                  <Tag className="mr-1.5 size-3.5 text-slate-400" /> Total Item Tax
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {order.totalItemTax || "0.00 USD"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
              <User className="mr-2.5 size-5 text-blue-500" />
              Sender & Receiver Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-100/60 bg-blue-50/40 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs">
                  <User className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    Sender
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {order.userName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <p className="flex items-center text-slate-600 dark:text-slate-300">
                  <Phone className="mr-2 size-3.5 shrink-0 text-blue-500" />
                  {order.senderPhoneNumber || "N/A"}
                </p>
                <p className="flex items-start text-slate-600 dark:text-slate-300">
                  <MapPin className="mr-2 size-3.5 shrink-0 text-blue-500" />
                  {order.senderAddress || "N/A"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100/60 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs">
                  <User className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                    Receiver
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {order.recieverName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <p className="flex items-center text-slate-600 dark:text-slate-300">
                  <Phone className="mr-2 size-3.5 shrink-0 text-amber-500" />
                  {order.receiverPhoneNumber || "N/A"}
                </p>
                <p className="flex items-start text-slate-600 dark:text-slate-300">
                  <MapPin className="mr-2 size-3.5 shrink-0 text-amber-500" />
                  {order.receiverAddress || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Fulfilling Store & Logistics */}
        <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
              <Store className="mr-2.5 size-5 text-emerald-500" />
              Fulfilling Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                  <Store className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                    Assigned Store
                  </p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {order.storeName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-start">
                  <MapPin className="mr-2 size-4 shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Store Address
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {order.storeAddress || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
            <ShoppingBag className="mr-2.5 size-5 text-rose-500" />
            Order Items & Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:bg-slate-800/60">
                  <tr>
                    <th className="px-6 py-4">Product Picture</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Product Barcode</th>
                    <th className="px-6 py-4">Unit Price</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item, idx) => {
                    const priceNum = Number(item.price || 0);
                    const qtyNum = Number(item.quantity || 1);
                    const totalFormatted = (priceNum * qtyNum).toFixed(2);
                    const unitStr = item.unit || "USD";

                    return (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4">
                          {item.productPicture ? (
                            <img
                              src={item.productPicture.split(",")[0].trim()}
                              alt={item.itemName || "Product"}
                              className="size-16 rounded-xl border border-slate-200 object-cover shadow-xs dark:border-slate-700"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent && !parent.querySelector(".fallback-bag-icon")) {
                                  const placeholder = document.createElement("div");
                                  placeholder.className =
                                    "fallback-bag-icon flex size-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800";
                                  placeholder.innerHTML = `<svg class="size-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
                                  parent.appendChild(placeholder);
                                }
                              }}
                            />
                          ) : (
                            <div className="flex size-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                              <ShoppingBag className="size-7" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          <p className="text-base font-semibold">
                            {item.itemName || "Unknown Product"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 font-mono text-sm font-bold tracking-wider text-amber-400 shadow-xs dark:border-slate-800 dark:bg-slate-950">
                            <Barcode className="size-4 shrink-0 text-amber-400" />
                            <span>{item.productBarcode || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {unitStr} {priceNum.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                          <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {qtyNum}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white">
                          {unitStr} {totalFormatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-44 flex-col items-center justify-center space-y-2 text-slate-400">
              <Receipt className="size-10 opacity-20" />
              <p className="text-sm font-medium">No items attached to this order</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
