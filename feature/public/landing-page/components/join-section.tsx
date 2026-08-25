import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";
import { cn } from "@/lib/utils";

type JoinSectionProps = {
  data: LandingPageContent["join"];
};

export function JoinSection({ data }: JoinSectionProps) {
  return (
    <section
      id="join"
      className="relative scroll-mt-24 overflow-hidden bg-[#052e16] py-20 text-white sm:py-28"
    >
      <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-[#f97316]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-[#166534]/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-[#fdba74] uppercase">
          {data.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{data.title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          {data.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ROUTES.AUTH.BECOME_A_PARTNER}
            className={cn(
              buttonVariants(),
              "h-12 rounded-full bg-emerald-600 px-7 text-base font-semibold text-white shadow-lg hover:bg-emerald-700",
            )}
          >
            Become a Vendor Partner
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-full border-white/30 bg-white/10 px-7 text-base text-white hover:bg-white/20 hover:text-white",
            )}
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
