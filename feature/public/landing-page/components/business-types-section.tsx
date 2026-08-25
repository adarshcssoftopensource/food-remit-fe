import { Check } from "lucide-react";

import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type BusinessTypesSectionProps = {
  data: LandingPageContent["businessTypes"];
};

export function BusinessTypesSection({ data }: BusinessTypesSectionProps) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
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

        <ul className="mt-12 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {data.types.map((type) => (
            <li
              key={type}
              className="group mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-emerald-600 text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </div>
              <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-green-700">
                {type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
