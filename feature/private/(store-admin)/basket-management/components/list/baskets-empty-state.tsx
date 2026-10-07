import { Calculator, ListChecks, Rocket, ShoppingBasket } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

const STEPS = [
  {
    icon: ShoppingBasket,
    title: "Pick a basket type",
    text: "Start from a Food Remit template or build a custom basket.",
  },
  {
    icon: ListChecks,
    title: "Add items & quantities",
    text: "Choose items from your store's catalogue.",
  },
  { icon: Calculator, title: "Automatic pricing", text: "The basket price is calculated for you." },
  {
    icon: Rocket,
    title: "Preview & publish",
    text: "Review everything, then go live for customers.",
  },
];

export function BasketsEmptyState({
  storeName,
  action,
}: {
  storeName?: string;
  action: ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-xs backdrop-blur-xl sm:p-10 dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="bg-primary/10 text-primary ring-primary/20 mb-5 flex size-16 items-center justify-center rounded-2xl ring-1">
          <ShoppingBasket className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Create your first basket</h2>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm">
          {storeName ? `${storeName} has no baskets yet. ` : ""}Bundle everyday essentials into one
          easy purchase that helps families get what they need.
        </p>
        <div className="mt-6">{action}</div>

        <ol className="mt-10 grid w-full gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="bg-primary flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <step.icon className="text-primary size-4" />
              </div>
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
