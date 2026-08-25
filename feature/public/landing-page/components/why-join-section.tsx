import { Check } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type WhyJoinSectionProps = {
  data: LandingPageContent["whyJoin"];
};

export function WhyJoinSection({ data }: WhyJoinSectionProps) {
  return (
    <section id="why-join" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ea580c] uppercase">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            {data.description}
          </p>
          <p className="mt-4 text-sm font-medium text-slate-700">{data.highlight}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {data.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <Badge className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-green-600 p-0 hover:bg-green-600">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </Badge>
                <p className="text-sm leading-6 font-medium text-slate-700">{point}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] sm:aspect-5/4 lg:aspect-4/5">
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

type RevenueSectionProps = {
  data: LandingPageContent["revenue"];
};

export function RevenueSection({ data }: RevenueSectionProps) {
  const markets = data.markets ?? [];

  return (
    <section className="relative overflow-hidden bg-[#f8faf8] py-20 sm:py-28">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#166534]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-[#f97316]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#166534] uppercase">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            {data.description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {markets.map((market) => (
            <div
              key={market.isoCode || market.name}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-50 to-emerald-100 text-2xl shadow-sm">
                <span aria-hidden>{market.flag}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 transition-colors group-hover:text-green-700">
                  {market.name}
                </h4>
                <p className="text-xs text-slate-500">{data.marketLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
