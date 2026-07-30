import { Check } from "lucide-react";
import Image from "next/image";

import { MARKETS, WHY_JOIN_POINTS } from "../../../../constants/landing.constants";

export function WhyJoinSection() {
  return (
    <section id="why-join" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ea580c] uppercase">
            Why Join Food Remit?
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Imagine if instead of sending cash… they purchased food from your store.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Every day, millions of people send money home. Food Remit transforms international food
            support into local shopping. When families abroad purchase groceries through Food Remit,
            the order is fulfilled by trusted local partner stores like yours.
          </p>

          <p className="mt-4 text-sm font-medium text-slate-700">
            Increase sales. Gain new customers. Reach international buyers. No marketing costs.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {WHY_JOIN_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm font-medium text-slate-800"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#166534]/10 text-[#166534]">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src="/vendor/grocery.jpg"
            alt="Fresh groceries prepared for local pickup"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function RevenueSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8faf8] py-20 sm:py-28">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#166534]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-[#f97316]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#166534] uppercase">
            Increase Your Revenue
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            One store. Global customers.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Food Remit brings you customers you would never have reached. Instead of competing only
            for shoppers in your city, your store becomes available to customers living across the
            world—anywhere Food Remit operates.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {MARKETS.map((market) => (
            <div key={market} className="border-b border-slate-200/80 pb-4">
              <span className="text-sm font-semibold text-slate-800">{market}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
