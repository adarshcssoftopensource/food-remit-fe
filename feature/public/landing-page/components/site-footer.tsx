"use client";

import Image from "next/image";
import Link from "next/link";

import { APP_ASSETS } from "@/config/assets";
import { ROUTES } from "@/config/routes";
import type { LandingFooter } from "@/feature/private/content-management/landing-page/types";
import { VENDOR_NAV_LINKS } from "../../../../constants/landing.constants";

type SiteFooterProps = {
  data: LandingFooter;
};

export function SiteFooter({ data }: SiteFooterProps) {
  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Image
            src={APP_ASSETS.LOGO.PATH}
            alt={APP_ASSETS.LOGO.ALT}
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">{data.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {VENDOR_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Sign In
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-100 px-5 pt-6 text-center sm:px-8">
        <p className="text-xs text-slate-400">{data.copyright}</p>
      </div>
    </footer>
  );
}
