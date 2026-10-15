"use client";

import Image from "next/image";
import Link from "next/link";
import { WifiOff, RefreshCw, RotateCcw, AlertTriangle, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_ASSETS } from "@/config/assets";
import { ROUTES } from "@/config/routes";

interface LandingErrorScreenProps {
  onRetry?: () => void;
  isRetrying?: boolean;
  errorMessage?: string;
}

export function LandingErrorScreen({ onRetry, isRetrying = false }: LandingErrorScreenProps) {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50/80 px-4 py-6 text-slate-800 antialiased sm:px-6 sm:py-8 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[28px_28px] opacity-60"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href={ROUTES.ROOT}
          className="group flex items-center gap-2.5 transition-transform hover:opacity-90 active:scale-95"
        >
          <Image
            src={APP_ASSETS.LOGO.PATH}
            alt={APP_ASSETS.LOGO.ALT}
            width={140}
            height={40}
            priority
            className="h-8 w-auto object-contain sm:h-9"
          />
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/90 px-3 py-1 text-xs font-medium text-amber-800 backdrop-blur-xs sm:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            Connection Alert
          </div>
        </div>
      </header>

      <main className="relative z-10 my-auto flex w-full items-center justify-center py-8">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <div className="relative mx-auto flex size-20 items-center justify-center rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 shadow-inner sm:size-24">
              <WifiOff className="size-9 text-emerald-600 sm:size-11" />
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-amber-500 shadow-xs">
                <AlertTriangle className="size-2.5 text-white" />
              </span>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-semibold text-amber-800">
              <Radio className="size-3 animate-pulse text-amber-600" />
              <span>Service Temporarily Unavailable</span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Unable to Load Landing Page
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              We&apos;re currently having trouble connecting to the Food Remit servers. This could
              be due to an internet outage or a momentary system update.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 font-semibold text-white hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] sm:w-auto"
              >
                <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? "Reconnecting..." : "Try Again"}
              </Button>
            )}

            <Button
              onClick={handleReload}
              variant="outline"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] sm:w-auto"
            >
              <RotateCcw className="size-4" />
              Reload Page
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-left">
            <h2 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Quick Suggestions
            </h2>
            <ul className="mt-2.5 space-y-2 text-xs text-slate-600 sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>Verify your internet connection or switch to a stable Wi-Fi network.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  Store partners and administrators can still{" "}
                  <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    log in directly
                  </Link>
                  .
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  Looking to join our network? Explore{" "}
                  <Link
                    href={ROUTES.AUTH.BECOME_A_PARTNER}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    Become a Partner
                  </Link>
                  .
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Food Remit. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link
            href={ROUTES.AUTH.BECOME_A_PARTNER}
            className="font-medium transition hover:text-slate-800"
          >
            Become a Partner
          </Link>
          <Link href={ROUTES.AUTH.LOGIN} className="font-medium transition hover:text-slate-800">
            Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
