"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type TestimonialsSectionProps = {
  data: LandingPageContent["testimonials"];
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || !data.items || data.items.length === 0) return null;

  const next = () => setActiveIndex((prev) => (prev + 1) % data.items.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + data.items.length) % data.items.length);

  const current = data.items[activeIndex];

  return (
    <section id="testimonials" className="bg-[#eef8f3] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        {data.title && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {data.title}
            </h2>
            {data.subtitle && <p className="mt-4 text-lg text-slate-600">{data.subtitle}</p>}
          </div>
        )}

        <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col items-center gap-8 px-2 md:flex-row md:gap-12 md:px-8">
            <div className="shrink-0">
              <div className="relative size-32 overflow-hidden rounded-full md:size-48">
                {current.image ? (
                  <Image src={current.image} alt={current.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex-1 text-center md:text-left">
              <div className="absolute -top-4 -left-2 font-serif text-6xl leading-none text-emerald-200 md:-left-6">
                “
              </div>
              <p className="relative z-10 text-lg leading-relaxed font-medium text-[#475569] md:text-[22px]">
                {current.quote}
              </p>
              <div className="mt-6">
                <p className="text-lg font-bold text-[#0c5942]">{current.name}</p>
                <p className="text-slate-500">{current.role}</p>
              </div>
            </div>
          </div>

          {data.items.length > 1 && (
            <div className="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between">
              <button
                type="button"
                className="pointer-events-auto flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#eef8f3] text-[#0c5942] shadow-sm transition-colors hover:bg-[#d1f0e1]"
                onClick={prev}
              >
                <ChevronLeft className="size-6" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="pointer-events-auto flex size-10 translate-x-1/2 items-center justify-center rounded-full bg-[#eef8f3] text-[#0c5942] shadow-sm transition-colors hover:bg-[#d1f0e1]"
                onClick={next}
              >
                <ChevronRight className="size-6" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        {data.items.length > 1 && (
          <div className="mt-8 flex justify-center gap-2.5">
            {data.items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`size-3 rounded-full transition-colors ${
                  idx === activeIndex ? "bg-[#0c5942]" : "bg-[#c5e6d4] hover:bg-[#86d0a7]"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
