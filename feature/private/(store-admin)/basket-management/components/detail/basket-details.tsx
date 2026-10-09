"use client";

import {
  AlertTriangle,
  CalendarRange,
  Clock,
  Eye,
  EyeOff,
  FilePen,
  Pencil,
  Rocket,
  Store,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

import { useDeleteBasket } from "../../hooks/use-delete-basket";
import { useGetBasket } from "../../hooks/use-get-basket";
import { useBasketLifecycleActions } from "../../hooks/use-basket-lifecycle-actions";
import { BASKET_STATUS_META } from "../../../../../../constants/basket.constants";
import { describeAvailability } from "../../utils/basket-availability";
import { formatItemSize, formatMoney } from "../../utils/basket-format";
import { BasketStatusBadge } from "../shared/basket-badges";
import { BasketNotFound } from "../shared/basket-not-found";
import { BasketPricingBreakdown } from "../shared/basket-pricing-breakdown";
import { BasketSummaryCard } from "../shared/basket-summary-card";
import { PriceStack } from "../shared/price-display";
import { ProductThumb } from "../shared/product-thumb";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "—";

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function BasketDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetBasket(id);
  const lifecycle = useBasketLifecycleActions();
  const deleteMutation = useDeleteBasket();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-80 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (isError || !data?.data) return <BasketNotFound />;

  const basket = data.data;
  const symbol = basket.currencySymbol;
  const isDraft = basket.status === "DRAFT";
  const isActive = basket.status === "ACTIVE";
  const isInactive = basket.status === "INACTIVE";
  const busy = lifecycle.pendingId === basket.id;
  const editHref = ROUTES.ADMIN.BASKETS.EDIT(basket.id);
  const missing = basket.missingRequirements.join(", ");

  const meta = [
    { icon: Store, label: "Store", value: basket.store?.storeName ?? "—" },
    { icon: Rocket, label: "Published", value: formatDate(basket.publishedAt) },
    { icon: Clock, label: "Last updated", value: formatDate(basket.updatedAt) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Baskets", href: ROUTES.ADMIN.BASKETS.ROOT },
          { label: basket.name || "Untitled basket", active: true },
        ]}
        title={basket.name || "Untitled basket"}
        badge={<BasketStatusBadge status={basket.status} />}
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(true)}
              className="h-10 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="size-4" /> Delete
            </Button>
            <Link
              href={editHref}
              className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl")}
            >
              {isDraft ? <FilePen className="size-4" /> : <Pencil className="size-4" />}
              {isDraft ? "Edit Draft" : "Edit"}
            </Link>
            {isDraft && (
              <Tooltip>
                <TooltipTrigger render={<span className="inline-flex" />}>
                  <Button
                    type="button"
                    onClick={() => lifecycle.publish(basket)}
                    disabled={!basket.isPublishable || busy}
                    className="h-10 rounded-xl"
                  >
                    <Rocket className="size-4" /> Publish
                  </Button>
                </TooltipTrigger>
                {!basket.isPublishable && (
                  <TooltipContent className="max-w-64">
                    Complete the draft first: {missing}
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          </div>
        }
      />

      {isDraft && (
        <div className="flex items-start gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900">
          <Pencil className="mt-0.5 size-4 shrink-0" />
          <span>
            This basket is a draft and isn&apos;t visible to customers yet.{" "}
            {basket.isPublishable
              ? "It's complete and ready to publish."
              : `Still needed before publishing: ${missing}.`}
          </span>
        </div>
      )}
      {basket.hasUnavailableItems && (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Some items in this basket are no longer available. Edit the basket to remove or replace
          them.
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-6">
          <section className="grid gap-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 2xl:grid-cols-[minmax(0,1fr)_240px] dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-4">
              <BasketSummaryCard
                layout="horizontal"
                name={basket.name}
                shortDescription={basket.shortDescription}
                basketType={basket.basketType}
                householdSize={basket.householdSize}
                image={basket.image}
                libraryImage={basket.libraryImage}
                itemCount={basket.itemCount}
                totalUnits={basket.totalUnits}
                price={basket.price}
                originalPrice={basket.originalPrice}
                currencySymbol={symbol}
              />
              {basket.description && (
                <p className="text-muted-foreground border-t border-slate-100 pt-4 text-sm leading-relaxed whitespace-pre-line dark:border-slate-800">
                  {basket.description}
                </p>
              )}
            </div>
            <dl className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              {meta.map((m) => (
                <div key={m.label} className="flex items-start gap-3">
                  <m.icon className="mt-0.5 size-4 text-slate-400" />
                  <div className="min-w-0">
                    <dt className="text-muted-foreground text-[11px]">{m.label}</dt>
                    <dd className="truncate text-sm font-semibold">{m.value}</dd>
                  </div>
                </div>
              ))}
              <p className="text-muted-foreground text-[11px]">
                {basket.isDefaultImage
                  ? "Using a Food Remit template image"
                  : "Using your uploaded image"}
              </p>
            </dl>
          </section>
          <Panel
            title={`Basket items (${basket.itemCount})`}
            action={
              <Link href={editHref} className="text-primary text-xs font-semibold hover:underline">
                Edit items
              </Link>
            }
          >
            <div className="-mx-4 overflow-x-auto sm:-mx-5">
              <table className="w-full min-w-180 text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-2.5 text-left sm:px-5">Item</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Your price</th>
                    <th className="px-3 py-2.5 text-right">Markup</th>
                    <th className="px-4 py-2.5 text-right sm:px-5">Line total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {basket.items.map((line) => (
                    <tr
                      key={line.id}
                      className={
                        line.pricing && !line.pricing.isAvailable
                          ? "bg-amber-50/40 dark:bg-amber-950/10"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <ProductThumb
                            src={line.item?.productImageUrl}
                            alt={line.item?.productName ?? ""}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {line.item?.productName ?? "Removed item"}
                            </p>
                            {line.optionName && (
                              <span className="inline-flex max-w-full truncate rounded-md bg-violet-50 px-1.5 py-px text-[10px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                                {line.optionName}
                              </span>
                            )}
                            <p className="text-muted-foreground text-[11px]">
                              {line.item
                                ? formatItemSize(line.item) || line.item.category?.categoryName
                                : "No longer in catalogue"}
                            </p>
                            {line.pricing && !line.pricing.isAvailable && (
                              <p className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                                <AlertTriangle className="size-3" />{" "}
                                {line.pricing.unavailableReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-semibold">×{line.quantity}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        <p>{formatMoney(line.pricing?.discountedLineTotal, symbol)}</p>
                        <p className="text-[10px] text-slate-400">
                          {formatMoney(line.pricing?.discountedUnitPrice, symbol)} each
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right text-slate-600 tabular-nums dark:text-slate-300">
                        {formatMoney(line.pricing?.markupLineTotal, symbol)}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <PriceStack
                          price={line.pricing?.customerLineTotal}
                          originalPrice={line.pricing?.customerOriginalLineTotal}
                          currencySymbol={symbol}
                        />
                      </td>
                    </tr>
                  ))}
                  {basket.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-muted-foreground px-5 py-10 text-center">
                        No items yet.{" "}
                        <Link href={editHref} className="text-primary font-semibold">
                          Add items
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24">
          <Panel title="Status & availability">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800",
                  )}
                >
                  {isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {BASKET_STATUS_META[basket.status].visibility}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {BASKET_STATUS_META[basket.status].description}
                  </p>
                  {isInactive && !basket.isPublishable && (
                    <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                      Update the basket before reactivating: {missing}
                    </p>
                  )}
                </div>
                {!isDraft && (
                  <Switch
                    checked={isActive}
                    disabled={busy || (isInactive && !basket.isPublishable)}
                    onCheckedChange={(checked) =>
                      checked ? lifecycle.reactivate(basket) : lifecycle.setInactive(basket)
                    }
                    aria-label={isActive ? "Set basket inactive" : "Reactivate basket"}
                  />
                )}
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40">
                  <CalendarRange className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {basket.availabilityMode === "CUSTOM"
                      ? "Custom basket schedule"
                      : "Store operating hours"}
                  </p>
                  <p className="text-muted-foreground text-xs">{describeAvailability(basket)}</p>
                </div>
              </div>
              <p className="text-muted-foreground border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
                Orders are only fulfilled when your store is open, even with a custom schedule.
              </p>
            </div>
          </Panel>

          <Panel title="Pricing">
            <BasketPricingBreakdown pricing={basket.pricing} />
          </Panel>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete basket?"
        description={`"${basket.name}" will be removed from customers and moved to the recycle bin. You can restore it later.`}
        confirmLabel="Delete basket"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          await deleteMutation.mutateAsync({ id: basket.id });
          router.push(ROUTES.ADMIN.BASKETS.ROOT);
        }}
      />
      {lifecycle.dialogs}
    </div>
  );
}
