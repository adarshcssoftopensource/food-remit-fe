import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { APP_ASSETS } from "@/config/assets";
import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type JoinSectionProps = {
  data: LandingPageContent["join"];
};

export function JoinSection({ data }: JoinSectionProps) {
  return (
    <section id="join" className="relative overflow-hidden bg-[#0c5942] py-16 sm:py-24">
      <div className="pointer-events-none absolute top-1/2 right-0 flex h-full w-full max-w-[800px] -translate-y-1/2 items-center justify-end opacity-[0.04] mix-blend-plus-lighter grayscale">
        <Image
          src={APP_ASSETS.LOGO.PATH}
          alt="Background Logo Pattern"
          width={800}
          height={800}
          className="mr-[-20%] h-[120%] w-[120%] object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="relative z-10 flex w-full flex-col items-start text-left md:w-1/2">
            <p className="text-sm font-bold tracking-widest text-[#f59e0b] uppercase">
              {data.title}
            </p>
            <h2 className="mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl">
              {data.subtitle}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-emerald-50 sm:text-xl">
              {data.description}
            </p>

            <div className="mt-10">
              <Link
                href={ROUTES.AUTH.BECOME_A_PARTNER}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-lg font-bold text-[#0c5942] shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Become a Vendor Partner
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>

          <div className="mt-4 flex w-full justify-center md:mt-0 md:w-1/2 md:justify-end">
            <div className="relative">
              <Image
                src={APP_ASSETS.IMAGES.VENDOR_PACKET.PATH}
                alt={APP_ASSETS.IMAGES.VENDOR_PACKET.ALT}
                width={600}
                height={600}
                className="w-full max-w-87.5 translate-y-4 object-contain drop-shadow-2xl sm:max-w-[450px] md:translate-y-8 lg:max-w-[550px]"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 65% 65% at center, black 40%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 65% 65% at center, black 40%, transparent 100%)",
                }}
                priority
              />

              <div className="absolute top-[65%] left-1/2 w-25 -translate-x-1/2 -translate-y-1/2 opacity-80 mix-blend-multiply drop-shadow-sm sm:w-[140px]">
                <Image
                  src={APP_ASSETS.LOGO.PATH}
                  alt="Food Remit Logo Overlay"
                  width={200}
                  height={80}
                  className="w-full object-contain"
                />
              </div>

              <div className="absolute top-[10%] right-[15%] z-20 -rotate-6 sm:top-[20%] sm:right-[5%] md:-right-4 lg:-right-10">
                <p className="text-right font-serif text-base leading-tight font-bold text-white italic drop-shadow-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Good
                  <br />
                  Food
                  <br />
                  Brighter
                  <br />
                  Families
                </p>
                <div className="mt-0.5 text-right text-lg text-white drop-shadow-md sm:text-xl md:text-2xl">
                  ♥
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
