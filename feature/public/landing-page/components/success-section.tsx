import { HandCoins, Headphones, Shield } from "lucide-react";
import Image from "next/image";

import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

const TRUST_ICONS = [Shield, HandCoins, Headphones] as const;

type SuccessSectionProps = {
  data: LandingPageContent["success"];
};

export function SuccessSection({ data }: SuccessSectionProps) {
  return (
    <section className="bg-[#f8faf8] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-5/4 overflow-hidden rounded-[2rem]">
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ea580c] uppercase">
            {data.title}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.subtitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            {data.description}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {data.investments.map((item) => (
              <li key={item} className="text-sm font-medium text-slate-700">
                <span className="mr-2 text-[#f97316]">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type TrustSectionProps = {
  data: LandingPageContent["trust"];
};

export function TrustSection({ data }: TrustSectionProps) {
  return (
    <section className="border-y border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {data.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {data.items.map((item, index) => {
            const Icon = TRUST_ICONS[index] ?? Shield;
            return (
              <div key={item.title} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#166534]/10 text-[#166534]">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
