import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden pt-28 pb-16 sm:items-center sm:pt-32 sm:pb-24">
      <Image
        src="/vendor/hero-store.jpg"
        alt="Grocery store owner welcoming customers"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#052e16]/90 via-[#052e16]/70 to-[#052e16]/25" />
      <div className="absolute inset-0 bg-linear-to-t from-[#052e16]/50 via-transparent to-[#052e16]/30" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="vendor-fade-up text-sm font-semibold tracking-[0.18em] text-[#fdba74] uppercase">
          Food Remit
        </p>
        <h1 className="vendor-fade-up vendor-delay-1 mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          From Your Local Store to a Global Customer Base
        </h1>
        <p className="vendor-fade-up vendor-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          Connect your store to customers around the world who purchase groceries and meals for
          their loved ones.
        </p>

        <div className="vendor-fade-up vendor-delay-3 mt-8 flex flex-wrap gap-3">
          <Link
            href="#join"
            className={cn(
              buttonVariants(),
              "bg-primary hover:bg-primary/80 h-12 rounded-full px-6 text-base text-white",
            )}
          >
            Register Your Store
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
