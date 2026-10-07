"use client";

import {
  ArrowRight,
  CalendarClock,
  Check,
  Eye,
  LayoutList,
  Package,
  Pencil,
  Plus,
  Store,
  Tag,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

import { formatHouseholdSize } from "../../constants/basket.constants";
import type { BasketDetail } from "../../types/basket.types";
import { formatMoney } from "../../utils/basket-format";
import { BasketTypeBadge } from "../shared/basket-badges";
import { BasketImage } from "../shared/basket-image";
import { PriceStack } from "../shared/price-display";
import { Button } from "@/components/ui/button";

const CONFETTI = [
  { className: "top-6 left-[8%] size-2.5 bg-amber-300", delay: "0ms" },
  { className: "top-16 left-[22%] size-1.5 bg-white", delay: "150ms" },
  { className: "top-8 right-[12%] size-3 bg-rose-300", delay: "300ms" },
  { className: "top-24 right-[26%] size-2 bg-sky-200", delay: "450ms" },
  { className: "bottom-10 left-[14%] size-2 bg-white/80", delay: "600ms" },
  { className: "bottom-14 right-[9%] size-2.5 bg-amber-200", delay: "750ms" },
  { className: "bottom-6 left-[42%] size-1.5 bg-rose-200", delay: "900ms" },
];

interface BasketPublishedProps {
  basket: BasketDetail;
  onCreateAnother: () => void;
}

/** Confirmation shown right after a basket is published */
export function BasketPublished({ basket, onCreateAnother }: BasketPublishedProps) {
  const isLive = basket.status === "ACTIVE";
  const symbol = basket.currencySymbol;
  const savings = basket.pricing.customerSavings;

  const stats = [
    {
      icon: Package,
      label: "Items",
      value: `${basket.itemCount} items · ${basket.totalUnits} units`,
    },
    {
      icon: Users,
      label: "Serves",
      value: basket.householdSize ? formatHouseholdSize(basket.householdSize) : "Any household",
    },
    { icon: Store, label: "Store", value: basket.store?.storeName ?? "—" },
    {
      icon: Wallet,
      label: "Your estimated payout",
      value: formatMoney(basket.pricing.estimatedPayout, symbol),
    },
  ];

  const nextSteps = [
    {
      icon: Eye,
      title: isLive ? "Visible to customers now" : "Published, but hidden",
      text: isLive
        ? "Customers can find and buy this basket in your store right away."
        : "Turn it on from Basket Details whenever you're ready to sell it.",
    },
    {
      icon: CalendarClock,
      title: "Follows your store schedule",
      text: "Pickup and delivery happen during your store's operating hours.",
    },
    {
      icon: Pencil,
      title: "Edit anytime",
      text: "Change items, quantities, image or availability from Basket Details.",
    },
  ];

  return (
    <div className="space-y-6 py-2">
      <div className="animate-in fade-in zoom-in-95 relative overflow-hidden rounded-[2rem] bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-400 px-6 py-12 text-center text-white shadow-2xl shadow-emerald-600/25 duration-500">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-white/10"
        />
        {CONFETTI.map((c) => (
          <span
            key={c.className}
            aria-hidden
            style={{ animationDelay: c.delay }}
            className={cn("pointer-events-none absolute animate-bounce rounded-full", c.className)}
          />
        ))}

        <div className="relative mx-auto flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-iteration-count:2]" />
          <span className="animate-in zoom-in fill-mode-both relative flex size-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xl delay-150 duration-500">
            <Check className="size-11" strokeWidth={3} />
          </span>
        </div>
        <p className="relative mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide uppercase ring-1 ring-white/30 backdrop-blur">
          <span
            className={cn(
              "size-1.5 rounded-full",
              isLive ? "animate-pulse bg-white" : "bg-white/60",
            )}
          />
          {isLive ? "Live now" : "Published · Inactive"}
        </p>
        <h1 className="relative mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Your basket is published!
        </h1>
        <p className="relative mx-auto mt-2 max-w-lg text-sm text-emerald-50 sm:text-base">
          <strong className="font-bold text-white">{basket.name}</strong>{" "}
          {isLive
            ? "is now available to customers in your store."
            : "is saved and ready. Activate it whenever you like."}
        </p>
      </div>

      {/* Summary */}
      <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm delay-200 duration-500 md:grid-cols-[340px_minmax(0,1fr)] dark:border-slate-800 dark:bg-slate-950">
        <div className="relative">
          <BasketImage
            image={basket.image}
            basketType={basket.basketType}
            alt={basket.name}
            className="aspect-[4/3] h-full w-full md:aspect-auto"
            priority
          />
          {savings > 0 && (
            <span className="absolute top-3 left-3 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              Customers save {formatMoney(savings, symbol)}
            </span>
          )}
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-1.5">
              <BasketTypeBadge type={basket.basketType} />
              <h2 className="text-2xl font-black tracking-tight break-words">{basket.name}</h2>
              {basket.shortDescription && (
                <p className="text-muted-foreground text-sm">{basket.shortDescription}</p>
              )}
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900">
              <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <Tag className="size-3" /> Customer price
              </p>
              <PriceStack
                price={basket.price}
                originalPrice={basket.originalPrice}
                currencySymbol={symbol}
                size="xl"
                align="left"
              />
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900"
              >
                <span className="text-primary flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs dark:bg-slate-800">
                  <stat.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] text-slate-500">{stat.label}</dt>
                  <dd className="truncate text-sm font-bold tabular-nums">{stat.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* What's next */}
      <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm delay-300 duration-500 sm:p-6 dark:border-slate-800 dark:bg-slate-950">
        <h3 className="mb-4 text-base font-bold">All set! Here&apos;s what happens next</h3>
        <ol className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((step, index) => (
            <li key={step.title} className="relative flex gap-3 md:flex-col">
              <div className="flex items-center gap-3">
                <span className="from-primary flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br to-teal-500 text-white shadow-md shadow-emerald-600/20">
                  <step.icon className="size-5" />
                </span>
                {index < nextSteps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden h-0.5 flex-1 rounded-full bg-linear-to-r from-emerald-200 to-transparent md:block"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-bold">{step.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="animate-in fade-in fill-mode-both flex flex-col-reverse gap-2.5 delay-500 duration-500 sm:flex-row sm:justify-center">
        <Button
          type="button"
          variant={"outline"}
          onClick={onCreateAnother}
          className={cn(buttonVariants({ variant: "ghost" }), "h-12 rounded-xl px-5")}
        >
          <Plus className="size-4" /> Create another basket
        </Button>
        <Link
          href={ROUTES.ADMIN.BASKETS.ROOT}
          className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl px-5")}
        >
          <LayoutList className="size-4" /> Manage baskets
        </Link>
        <Link
          href={ROUTES.ADMIN.BASKETS.DETAILS(basket.id)}
          className={cn(buttonVariants(), "h-12 rounded-xl px-6")}
        >
          View basket details <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
