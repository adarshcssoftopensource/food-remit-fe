import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

export function JoinSection() {
  return (
    <section
      id="join"
      className="relative scroll-mt-24 overflow-hidden bg-[#052e16] py-20 text-white sm:py-28"
    >
      <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-[#f97316]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-[#166534]/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-[#fdba74] uppercase">
          Join the Future of Global Food Commerce
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Start selling to the world—right from your neighborhood
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          Thousands of families already support loved ones across borders. Become one of our trusted
          Vendor Partners and help shape the future of food remittances.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(
              buttonVariants(),
              "h-12 rounded-full bg-[#f97316] px-7 text-base text-white hover:bg-[#ea580c]",
            )}
          >
            Become a Vendor Partner
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-full border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white",
            )}
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
