"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-18 sm:px-8">
        <Link
          href="#top"
          className={cn(
            "relative z-10 flex items-center gap-2.5",
            !scrolled && "rounded-xl bg-white/90 p-2.5",
          )}
        >
          <Image
            src="/food_remid_logo.png"
            alt="Food Remit"
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
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled ? "text-slate-600 hover:text-slate-950" : "text-white/85 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 sm:flex">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(
              buttonVariants({ variant: scrolled ? "outline" : "ghost" }),
              "h-10 rounded-full px-5",
              !scrolled &&
                "border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
            )}
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
            Become a Partner
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className={cn(
            "relative z-10 inline-flex size-10 items-center justify-center rounded-full lg:hidden",
            scrolled || open ? "text-slate-900" : "text-white",
          )}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-16 bg-white transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-full flex-col gap-2 px-5 py-6">
          {VENDOR_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-6">
            <Link
              href={ROUTES.AUTH.LOGIN}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-full")}
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.AUTH.BECOME_A_PARTNER}
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants(),
                "h-12 rounded-full bg-[#f97316] text-white hover:bg-[#ea580c]",
              )}
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
