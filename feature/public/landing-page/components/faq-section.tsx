import { ChevronDown } from "lucide-react";

import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type FaqSectionProps = {
  data: LandingPageContent["faq"];
};

export function FaqSection({ data }: FaqSectionProps) {
  return (
    <section id="faq" className="scroll-mt-24 bg-[#f8faf8] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#166534] uppercase">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.title}
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {data.items.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200/80 bg-white px-5 py-1 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-slate-950 marker:content-none [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
