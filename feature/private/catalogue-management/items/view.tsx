"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Package,
  Barcode,
  Scale,
  Percent,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetItemById } from "./hooks/use-get-item-by-id";

interface ItemViewProps {
  id: string;
}

export function ItemView({ id }: ItemViewProps) {
  const router = useRouter();
  const { data: response, isLoading } = useGetItemById(id);
  const item = response?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="animate-pulse overflow-hidden border-slate-200/80 lg:col-span-1 dark:border-slate-800">
            <div className="h-32 bg-slate-200 dark:bg-slate-800" />
            <div className="px-6 pt-0 pb-6 text-center">
              <div className="mx-auto -mt-12 h-24 w-24 rounded-3xl bg-slate-300 ring-4 ring-white dark:bg-slate-700 dark:ring-slate-950" />
              <div className="mx-auto mt-4 h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="mx-auto mt-3 h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </Card>
          <Card className="animate-pulse border-slate-200/80 lg:col-span-2 dark:border-slate-800">
            <CardHeader className="h-20 border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20" />
            <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/50" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Package className="h-16 w-16 text-slate-300" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-700">Item not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-2 rounded-full px-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:scale-105 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title="Item Details"
          description="View comprehensive information about this catalogue item."
        />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 grid gap-6 duration-700 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="relative flex h-fit flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-1 dark:bg-slate-950 dark:shadow-none">
          {/* Cover Background */}
          <div className="from-primary/80 via-primary to-primary/40 absolute inset-x-0 top-0 h-32 bg-linear-to-br opacity-90" />

          <CardHeader className="relative flex flex-1 flex-col px-6 pt-2 pb-8 text-center">
            {/* Icon Container with overlap */}
            <div className="shadow-primary/20 mx-auto flex h-60 w-60 shrink-0 items-center justify-center rounded-[3rem] bg-white p-3 shadow-xl ring-4 ring-white transition-transform duration-500 hover:scale-105 dark:bg-slate-900 dark:ring-slate-950">
              <div className="bg-primary/5 text-primary relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem]">
                {item.productImageUrl ? (
                  <Image
                    key={item.id}
                    src={item.productImageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Package className="h-20 w-20" />
                )}
              </div>
            </div>

            <div className="mt-10 w-full text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {item.productName}
              </CardTitle>
              {item.description && (
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              )}

              <div className="mt-4 flex justify-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm transition-colors ${
                    item.status === "ACTIVE"
                      ? "bg-green-500/10 text-green-700 ring-1 ring-green-500/20 dark:bg-green-500/20 dark:text-green-400"
                      : "bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:bg-red-500/20 dark:text-red-400"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${item.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    <span
                      className={`relative inline-flex h-2 w-2 rounded-full ${item.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                  </span>
                  {item.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>

                {item.adminShare && (
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-500/20">
                    Admin Share
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Information Grid */}
        <Card className="rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-2 dark:bg-slate-950 dark:shadow-none">
          <CardHeader className="border-b border-slate-100/80 px-8 py-6 dark:border-slate-800/80">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
              <div className="bg-primary h-5 w-1.5 rounded-full" />
              Information Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                label="Country"
                value={item.country?.name || "Unknown"}
              />
              <InfoCard
                icon={<Building2 className="h-5 w-5" />}
                label="Department"
                value={item.department?.departmentName || "None"}
              />
              <InfoCard
                icon={<Layers className="h-5 w-5" />}
                label="Category"
                value={item.category?.categoryName || "None"}
              />
              <InfoCard
                icon={<Barcode className="h-5 w-5" />}
                label="UPC Code"
                value={item.upcCode || "N/A"}
              />
              <InfoCard
                icon={<Scale className="h-5 w-5" />}
                label="Base Quantity"
                value={item.baseQuantity && item.unit ? `${item.baseQuantity} ${item.unit}` : "N/A"}
              />
              <InfoCard
                icon={<Percent className="h-5 w-5" />}
                label="Discount"
                value={
                  item.discountAvailability
                    ? item.discountPercentage
                      ? `${item.discountPercentage}%`
                      : "Available"
                    : "Not Available"
                }
              />
              <InfoCard
                icon={<Calendar className="h-5 w-5" />}
                label="Added On"
                value={
                  item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a") : "-"
                }
              />
              <InfoCard
                icon={<Clock className="h-5 w-5" />}
                label="Modified On"
                value={
                  item.updatedAt ? format(new Date(item.updatedAt), "MMM d, yyyy 'at' h:mm a") : "-"
                }
              />
            </div>

            {/* Additional info images if present */}
            {(item.productInfoImageUrl || item.nutritionInfoImageUrl) && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">Additional Images</h3>
                <div className="flex gap-4">
                  {item.productInfoImageUrl && (
                    <div className="relative h-32 w-32 overflow-hidden rounded-xl border">
                      <Image
                        src={item.productInfoImageUrl}
                        alt="Product Info"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {item.nutritionInfoImageUrl && (
                    <div className="relative h-32 w-32 overflow-hidden rounded-xl border">
                      <Image
                        src={item.nutritionInfoImageUrl}
                        alt="Nutrition Info"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="group hover:border-primary/20 hover:shadow-primary/5 relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-900">
      <div className="group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-colors dark:bg-slate-800 dark:ring-slate-700">
        <div className="group-hover:text-primary text-slate-500 transition-colors dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-1">
        <span className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-900 capitalize dark:text-slate-100">
          {value}
        </span>
      </div>
    </div>
  );
}
