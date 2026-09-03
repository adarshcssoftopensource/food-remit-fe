"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CreditCard,
  Expand,
  Landmark,
  MapPin,
  Package,
  Phone,
  QrCode,
  Receipt,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetOrder } from "./hooks/use-get-order";

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
    } else if (status === 6 || status === 8) {
      label = status === 8 ? "Paid" : "Completed";
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

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center justify-between text-base font-bold tracking-tight text-slate-900 dark:text-white">
            <span className="flex items-center">
              <Package className="mr-2.5 size-5 text-emerald-500" />
              Order Summary
            </span>
            {renderStatus(order.orderStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left Side: Order Details */}
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
                <div>
                  <p className="flex items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <Calendar className="mr-1 size-3" /> Date & Time
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formatDate(order.createdAt)} • {order.time || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <Tag className="mr-1 size-3" /> Food Type
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {order.foodType || "Sent Food Order"}
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <Repeat className="mr-1 size-3" /> Recurring
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {order.recurring || "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: QR Code */}
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
          </div>
        </CardContent>
      </Card>

      {/* The 3 Financial boxes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Customer Payment */}
        <Card className="rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/30 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-blue-50/50 bg-blue-50/30 px-5 py-3 dark:border-blue-900/20 dark:bg-blue-950/20">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Payment</h3>
            </div>
            <CreditCard className="size-4 text-blue-500" />
          </div>
          <div className="flex flex-col gap-3 p-5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">
                Items= Total Item price(base price+ markup price)
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.customerPayment?.merchandiseSubtotal || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Store Govt tax</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.customerPayment?.storeTax || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Processing Fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.customerPayment?.processingFee || "0.00"}
              </span>
            </div>

            <hr className="my-1 border-dashed border-slate-200 dark:border-slate-700" />

            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Order Total</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                {order.customerPayment?.totalCustomerPaid || "0.00"}
              </p>
            </div>

            <div className="mt-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-[10px] font-medium text-slate-400">Payment Method</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {order.customerPayment?.paymentMethod || "N/A"}
              </p>

              <p className="mt-2 text-[10px] font-medium text-slate-400">Paid</p>
              <span className="mt-1 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                {order.customerPayment?.paymentStatus || "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Food Remit Earnings */}
        <Card className="rounded-2xl border border-purple-100 bg-white shadow-sm dark:border-purple-900/30 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-purple-50/50 bg-purple-50/30 px-5 py-3 dark:border-purple-900/20 dark:bg-purple-950/20">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Food Remit Earnings
              </h3>
            </div>
            <BarChart3 className="size-4 text-purple-500" />
          </div>
          <div className="flex flex-col gap-3 p-5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">
                Food Remit Markup({order.foodRemitEarnings?.markupPercent || "0"}%)
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.foodRemitEarnings?.markupAmount || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">
                Food Remit commissions({order.foodRemitEarnings?.commissionPercent || "0"}%)
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.foodRemitEarnings?.commissionAmount || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Processing Fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.foodRemitEarnings?.processingFee || "0.00"}
              </span>
            </div>

            <hr className="my-1 border-dashed border-slate-200 dark:border-slate-700" />

            <div className="mt-2">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Total</p>
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">
                {order.foodRemitEarnings?.totalFoodRemitRevenue || "0.00"}
              </p>
            </div>
          </div>
        </Card>

        {/* Vendor Settlement */}
        <Card className="rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-emerald-900/30 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-emerald-50/50 bg-emerald-50/30 px-5 py-3 dark:border-emerald-900/20 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Vendor Settlement
              </h3>
            </div>
            <Landmark className="size-4 text-emerald-500" />
          </div>
          <div className="flex flex-col gap-3 p-5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Number of Items:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.items?.length || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Base Price</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.vendorSettlement?.vendorBaseAmount || "0.00"}
              </span>
            </div>
            {order.vendorSettlement?.govtTax && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Store Govt tax</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {order.vendorSettlement.govtTax}
                </span>
              </div>
            )}

            <hr className="my-1 border-dashed border-slate-200 dark:border-slate-700" />

            <div className="mt-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Total</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {order.vendorSettlement?.totalVendorSettlement ||
                  order.vendorSettlement?.vendorProceeds ||
                  "0.00"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    <th className="px-6 py-4">Product QR Code</th>
                    <th className="px-6 py-4">Stock Status</th>
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
                          <div className="relative inline-block">
                            {item.productPicture ? (
                              // eslint-disable-next-line @next/next/no-img-element
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
                            {item.productPicture && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setLightboxImage(item.productPicture!.split(",")[0].trim())
                                }
                                className="absolute -top-1 -right-1 h-6 w-6 rounded-full border border-white bg-slate-900/80 p-0 text-white shadow-md hover:bg-slate-900"
                              >
                                <Expand className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          <p className="text-base font-semibold">
                            {item.itemName || "Unknown Product"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const qrCodeText =
                              item.productBarcode || item.upcCode || item.itemId || "N/A";
                            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                              qrCodeText,
                            )}`;

                            return (
                              <div className="flex items-center gap-3">
                                <div className="group relative inline-block">
                                  <div className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-xs transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-950">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={qrImageUrl}
                                      alt={`QR Code ${qrCodeText}`}
                                      className="size-10 rounded-md object-contain"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setLightboxImage(qrImageUrl)}
                                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full border border-white bg-slate-900/80 p-0 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-slate-900"
                                    title="Zoom QR Code"
                                  >
                                    <Expand className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <QrCode className="size-3.5 shrink-0 text-emerald-500" />
                                    <span>{qrCodeText}</span>
                                  </div>
                                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    Product Reference QR
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          {item.inStock === true ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              In Stock
                            </span>
                          ) : item.inStock === false ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                              <span className="size-1.5 rounded-full bg-rose-500" />
                              Out of Stock
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>
                          )}
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

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
