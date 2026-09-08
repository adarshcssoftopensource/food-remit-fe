import {
  ShoppingCart,
  Store,
  Utensils,
  Croissant,
  Beef,
  Fish,
  Leaf,
  Plus,
  Clock,
  Package,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type BusinessTypesSectionProps = {
  data: LandingPageContent["businessTypes"];
};

export function BusinessTypesSection({ data }: BusinessTypesSectionProps) {
  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("grocery")) return ShoppingCart;
    if (t.includes("supermarket")) return Store;
    if (t.includes("restaurant")) return Utensils;
    if (t.includes("baker")) return Croissant;
    if (t.includes("meat")) return Beef;
    if (t.includes("seafood") || t.includes("fish")) return Fish;
    if (t.includes("produce")) return Leaf;
    if (t.includes("pharmac")) return Plus;
    if (t.includes("convenience")) return Clock;
    if (t.includes("specialty") || t.includes("shop")) return Package;
    return Check;
  };

  return (
    <section className="bg-[#f3fbf6] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#22c55e] uppercase sm:text-sm">
            {data.title}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#064e3b] sm:text-4xl lg:text-5xl">
            {data.subtitle.split(" ").map((word, i) => (
              <span key={i} className="mr-2 inline-block">
                {word}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 sm:mt-6 sm:text-lg">
            {data.description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-2">
          {data.types.map((type) => {
            const Icon = getIconForType(type);
            return (
              <div
                key={type}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-6 sm:text-left"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f0fdf4]">
                  <Icon className="size-6 text-[#16a34a]" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-[#064e3b] sm:text-base lg:text-lg">
                  {type}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center sm:mt-12">
          <Link
            href={ROUTES.AUTH.BECOME_A_PARTNER}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0f766e] px-8 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#0f766e]/90 sm:w-auto sm:min-w-[300px] sm:text-lg"
          >
            Register your store
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
