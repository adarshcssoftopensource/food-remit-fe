"use client";

import { useMemo } from "react";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentCardProps } from "./payment-card.types";
import { getNetworkLogo } from "./payment-card.logos";
import { NETWORK_STYLE_MAP } from "./payment-card.themes";
import { detectGlobalCardNetwork } from "./payment-card.detector";
import { inferDefaultBank } from "./payment-card.bank";

export function PaymentCard({
  brand,
  last4,
  cardNumber,
  cardholderName,
  expMonth = "12",
  expYear = "28",
  bankName,
  currency,
  funding = "credit",
  size = "md",
  className,
  interactive = true,
}: PaymentCardProps) {
  // 1. Detect world card network using credit-card-type package + heuristics
  const network = useMemo(() => {
    return detectGlobalCardNetwork(brand, cardNumber || last4);
  }, [brand, cardNumber, last4]);

  const styleConfig = NETWORK_STYLE_MAP[network] || NETWORK_STYLE_MAP.generic;

  // 2. Resolve issuing bank name
  const effectiveBank = useMemo(() => {
    if (bankName && bankName.trim()) return bankName.toUpperCase();
    return inferDefaultBank(currency, network);
  }, [bankName, currency, network]);

  // 3. Format displayed card number
  const formattedNumber = useMemo(() => {
    if (cardNumber && cardNumber.replace(/\D/g, "").length >= 12) {
      const clean = cardNumber.replace(/\D/g, "");
      return clean.replace(/(\d{4})/g, "$1 ").trim();
    }
    const cleanLast4 = (last4 || "4242").replace(/\D/g, "").slice(-4);
    if (network === "american-express") {
      return `•••• •••••• •${cleanLast4}`;
    }
    return `•••• •••• •••• ${cleanLast4}`;
  }, [cardNumber, last4, network]);

  // 4. Expiry formatting
  const formattedExpiry = useMemo(() => {
    const m = String(expMonth || "12")
      .padStart(2, "0")
      .slice(-2);
    const y = String(expYear || "28").slice(-2);
    return `${m}/${y}`;
  }, [expMonth, expYear]);

  // 5. Size scaling classes
  const sizeClasses = {
    sm: "max-w-[290px] p-4 rounded-xl text-xs",
    md: "max-w-[360px] p-5 rounded-2xl",
    lg: "max-w-[420px] p-6 rounded-3xl",
  }[size];

  const numberSizeClasses = {
    sm: "text-sm tracking-[0.18em]",
    md: "text-lg tracking-[0.22em]",
    lg: "text-xl tracking-[0.25em]",
  }[size];

  const logo = useMemo(() => getNetworkLogo(network), [network]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden shadow-2xl transition-all duration-300 select-none",
        sizeClasses,
        interactive && "hover:scale-[1.015] hover:shadow-indigo-500/10",
        className,
      )}
    >
      {/* Background Gradient & Dynamic Network Glow */}
      <div className={cn("absolute inset-0", styleConfig.gradient)} />
      <div
        className={cn(
          "absolute -top-12 -right-12 size-48 rounded-full bg-radial blur-2xl",
          styleConfig.glow,
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/10" />

      {/* Micro-texture Lines for authentic card feel */}
      <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_4px)] opacity-[0.035]" />

      <div className="relative z-10 flex flex-col justify-between space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-black tracking-widest text-white/95 uppercase drop-shadow-sm">
              {effectiveBank}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[8px] font-extrabold tracking-[0.2em] text-white/65 uppercase">
                {styleConfig.tier}
              </span>
              {funding && (
                <>
                  <span className="text-[8px] text-white/40">•</span>
                  <span className="text-[7px] font-bold tracking-wider text-white/60 uppercase">
                    {funding}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="shrink-0">{logo}</div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="relative flex h-8 w-11 items-center justify-center overflow-hidden rounded-md border border-amber-300/40 bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 shadow-md">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-amber-700/40" />
            <div className="absolute inset-y-0 left-1/3 w-px bg-amber-700/40" />
            <div className="absolute inset-y-0 right-1/3 w-px bg-amber-700/40" />
            <div className="size-3.5 rounded-xs border border-amber-700/30 bg-amber-400/50" />
          </div>

          <Wifi className="size-4.5 rotate-90 text-white/75 drop-shadow-xs" />

          <div
            className={cn(
              "ml-auto size-6 rounded-full opacity-75 shadow-inner ring-1 ring-white/30",
              styleConfig.hologramColor,
            )}
          />
        </div>

        {/* Card Number */}
        <div className="pt-2">
          <p
            className={cn(
              "font-mono font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]",
              numberSizeClasses,
            )}
          >
            {formattedNumber}
          </p>
        </div>

        {/* Bottom Row: Cardholder Name & Expiry */}
        <div className="flex items-end justify-between pt-1">
          <div className="max-w-[190px]">
            <p className="text-[8px] font-bold tracking-widest text-white/60 uppercase">
              Card Holder
            </p>
            <p className="truncate font-mono text-xs font-bold tracking-wider text-white uppercase drop-shadow-sm">
              {cardholderName || "CARDMEMBER"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[7px] font-bold tracking-widest text-white/60 uppercase">Expires</p>
            <p className="font-mono text-xs font-bold tracking-widest text-white/95 drop-shadow-sm">
              {formattedExpiry}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
