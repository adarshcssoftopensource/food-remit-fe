"use client";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { LandingHero } from "@/feature/private/content-management/landing-page/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  data: LandingHero;
};

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden pt-28 pb-16 sm:items-center sm:pt-32 sm:pb-24">
      <Image
        src={data.backgroundImage}
        alt={data.backgroundImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#052e16]/90 via-[#052e16]/70 to-[#052e16]/25" />
      <div className="absolute inset-0 bg-linear-to-t from-[#052e16]/50 via-transparent to-[#052e16]/30" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="vendor-fade-up text-sm font-semibold tracking-[0.18em] text-[#fdba74] uppercase">
          {data.eyebrow}
        </p>
        <h1 className="vendor-fade-up vendor-delay-1 mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {data.title}
        </h1>
        <p className="vendor-fade-up vendor-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {data.subtitle}
        </p>

        <div className="vendor-fade-up vendor-delay-3 mt-8 flex flex-wrap gap-3">
          <Link
            href={ROUTES.AUTH.BECOME_A_PARTNER}
            className={cn(
              buttonVariants(),
              "h-12 rounded-full bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg hover:bg-emerald-700",
            )}
          >
            {data.ctaLabel}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
