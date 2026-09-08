"use client";

import {
  Menu,
  X,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { APP_ASSETS } from "@/config/assets";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { VENDOR_NAV_LINKS } from "../../../../constants/landing.constants";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-18 sm:px-8">
        <Link href="#top" className="relative z-10 flex items-center gap-2.5">
          <Image
            src={APP_ASSETS.LOGO.PATH}
            alt={APP_ASSETS.LOGO.ALT}
            width={140}
            height={40}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {VENDOR_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 sm:flex">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-full px-5")}
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.AUTH.BECOME_A_PARTNER}
            className={cn(
              buttonVariants(),
              "bg-primary hover:bg-primary/80 h-10 rounded-full px-5 text-white",
            )}
          >
            Become a Vendor Partner
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 inline-flex size-10 items-center justify-center rounded-full text-slate-900 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-full h-[calc(100vh-64px)] overflow-y-auto bg-white transition-all duration-300 lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="flex h-full min-h-125 flex-col bg-white">
          <div className="flex flex-col px-5 py-2">
            {VENDOR_NAV_LINKS.map((link) => {
              let Icon = Menu;
              if (link.label === "Why Join") Icon = Users;
              else if (link.label === "How It Works") Icon = Settings;
              else if (link.label === "Benefits") Icon = BarChart3;
              else if (link.label === "FAQ") Icon = HelpCircle;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#f0fdf4]">
                      <Icon className="size-5 text-[#166534]" />
                    </div>
                    <span className="text-base font-bold text-slate-800">{link.label}</span>
                  </div>
                  <ChevronRight className="size-5 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 px-5 py-4">
            <Link
              href={ROUTES.AUTH.LOGIN}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center rounded-full border border-[#047857] font-semibold text-[#047857]"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.AUTH.BECOME_A_PARTNER}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#047857] font-semibold text-white"
            >
              Become a Vendor Partner
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative mt-auto flex min-h-65 flex-1 items-center overflow-hidden bg-gradient-to-br from-[#f3fbf6] via-[#e8f7ed] to-[#f3fbf6] px-6 py-10 sm:min-h-[320px] sm:px-12 sm:py-14">
            <div className="absolute -bottom-20 -left-20 size-75 rounded-full bg-white opacity-90 blur-3xl sm:size-[500px]" />
            <div className="absolute top-1/2 left-1/2 size-62.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dcfce7] opacity-40 blur-3xl sm:size-[400px]" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] grayscale">
              <Image
                src={APP_ASSETS.LOGO.PATH}
                alt="Watermark"
                width={400}
                height={400}
                className="w-62.5 object-contain sm:w-112.5"
              />
            </div>

            <div className="relative z-10 w-[60%] max-w-50 min-w-[140px] sm:w-[50%] sm:max-w-[350px]">
              <h3 className="text-[17px] leading-snug font-bold text-[#115e59] sm:text-[24px] lg:text-[28px]">
                Stronger
                <br />
                communities
                <br />
                through better
                <br />
                food access
              </h3>
              <div className="mt-4 h-1.5 w-10 rounded-full bg-[#86efac] sm:mt-6 sm:h-2 sm:w-16" />
            </div>

            <div className="absolute right-27.5 bottom-[160px] z-10 flex flex-col items-start text-[10px] font-bold tracking-widest text-[#115e59] sm:right-[150px] sm:bottom-[230px] sm:text-[12px] md:right-[200px] md:bottom-[280px]">
              <span>LOCAL</span>
              <span>STORES</span>
              <span>GLOBAL</span>
              <span>IMPACT</span>
              <div className="mt-1.5 h-1 w-8 rounded-full bg-[#86efac]" />
            </div>

            <div className="absolute -right-6 -bottom-2 z-0 h-[200px] w-[240px] sm:-right-4 sm:h-[320px] sm:w-[380px] md:h-[400px] md:w-[480px]">
              <Image
                src={APP_ASSETS.IMAGES.MOBILE_MENU_ILLUSTRATION.PATH}
                alt={APP_ASSETS.IMAGES.MOBILE_MENU_ILLUSTRATION.ALT}
                fill
                className="right-0 object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
