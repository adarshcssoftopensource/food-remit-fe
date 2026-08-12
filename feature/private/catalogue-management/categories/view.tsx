"use client";

import { useGetCategory } from "./hooks/use-get-category";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  User,
  Clock,
  Layers,
  Users,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CategoryViewProps {
  id: string;
}

export function CategoryView({ id }: CategoryViewProps) {
  const router = useRouter();
  const { data: category, isLoading } = useGetCategory(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-pulse border-slate-200/80 md:col-span-1">
            <CardHeader className="h-64 rounded-t-2xl bg-slate-100 dark:bg-slate-800" />
          </Card>
          <Card className="animate-pulse border-slate-200/80 md:col-span-2">
            <CardHeader className="h-20 border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40" />
            <CardContent className="h-96" />
          </Card>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex h-100 flex-col items-center justify-center space-y-4">
        <Building2 className="h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Category not found</h2>
        <Button onClick={() => router.back()} variant="outline">
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
          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title="Category Details"
          description="View comprehensive information about this category."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 md:col-span-1">
          <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 h-1 bg-gradient-to-r" />
          <CardHeader className="flex flex-col items-center justify-center border-b border-slate-100 bg-slate-50/50 py-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
            <div className="bg-primary/5 text-primary ring-primary/10 mb-4 flex h-24 w-24 items-center justify-center rounded-3xl shadow-sm ring-1">
              {category.categoryIcon ? (
                <Image
                  key={category.id}
                  src={category.categoryIcon}
                  alt={category.categoryName}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <Building2 className="h-10 w-10" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              {category.categoryName}
            </CardTitle>
            <span
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                category.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }`}
            >
              <span
                className={`inline-block size-2 rounded-full ${
                  category.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {category.status === "ACTIVE" ? "Active" : "Inactive"}
            </span>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 md:col-span-2">
          <CardHeader className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Information Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
              <div className="px-6 py-5 sm:py-6">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Building2 className="h-4.5 w-4.5" />
                  Department
                </dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.department?.departmentName || "Unknown"}
                </dd>
              </div>

              <div className="px-6 py-5 sm:border-t sm:border-slate-100 sm:py-6 dark:sm:border-slate-800">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Layers className="h-4.5 w-4.5" />
                  Parent Category
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.parentCategoryName || "None"}
                </dd>
              </div>

              <div className="px-6 py-5 sm:border-t sm:border-slate-100 sm:py-6 dark:sm:border-slate-800">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4.5 w-4.5" />
                  City
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.cityName || "All Cities"}
                </dd>
              </div>

              <div className="px-6 py-5 sm:border-t sm:border-slate-100 sm:py-6 dark:sm:border-slate-800">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <User className="h-4.5 w-4.5" />
                  Created By
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.createdBy || "System"}
                </dd>
              </div>

              <div className="px-6 py-5 sm:border-t sm:border-slate-100 sm:py-6 dark:sm:border-slate-800">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Users className="h-4.5 w-4.5" />
                  Sub-categories
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.children?.length || 0}
                </dd>
              </div>

              <div className="px-6 py-5 sm:border-t sm:border-slate-100 sm:py-6 dark:sm:border-slate-800">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4.5 w-4.5" />
                  Added On
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.addedOn
                    ? format(new Date(category.addedOn), "MMMM d, yyyy 'at' h:mm a")
                    : category.createdAt
                      ? format(new Date(category.createdAt), "MMMM d, yyyy 'at' h:mm a")
                      : "-"}
                </dd>
              </div>

              <div className="px-6 py-5 sm:border-t sm:border-slate-100 sm:py-6 dark:sm:border-slate-800">
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Clock className="h-4.5 w-4.5" />
                  Modified On
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.modifiedOn
                    ? format(new Date(category.modifiedOn), "MMMM d, yyyy 'at' h:mm a")
                    : category.updatedAt
                      ? format(new Date(category.updatedAt), "MMMM d, yyyy 'at' h:mm a")
                      : "-"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
