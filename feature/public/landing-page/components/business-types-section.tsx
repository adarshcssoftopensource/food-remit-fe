import { Check } from "lucide-react";

import { BUSINESS_TYPES } from "../../../../constants/landing.constants";

export function BusinessTypesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#166534] uppercase">
            Built for Every Food Business
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Food Remit welcomes partners of every size
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Whether you operate one location or hundreds, Food Remit can connect your business to
            new customers worldwide.
          </p>
        </div>

        <ul className="mt-12 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {BUSINESS_TYPES.map((type) => (
            <li
              key={type}
              className="mb-3 flex break-inside-avoid items-center gap-2.5 text-sm font-medium text-slate-800"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#166534]/10 text-[#166534]">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {type}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
