"use client";

import { useMemo, useState } from "react";
import { Check, Copy, CreditCard, ShieldCheck, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CreditDetailData } from "../types/credits.types";

interface CreditPaymentCardProps {
  transaction: CreditDetailData["transaction"];
  customerName: string;
  currency?: string;
}

type CardNetwork = "visa" | "mastercard" | "amex" | "rupay" | "discover";

interface CardStyleConfig {
  name: string;
  gradient: string;
  glow: string;
  tier: string;
  logo: React.ReactNode;
  bankName: string;
  textColor: string;
  hologramColor: string;
}

export function CreditPaymentCard({
  transaction,
  customerName,
  currency = "INR",
}: CreditPaymentCardProps) {
  const [copied, setCopied] = useState(false);

  // Detect card network from brand or cardType or last4
  const detectedNetwork = useMemo<CardNetwork>(() => {
    const raw = (transaction.cardBrand || transaction.paymentMethod || "").toLowerCase();
    const l4 = transaction.cardLast4 || "";

    if (raw.includes("master") || l4.startsWith("5")) return "mastercard";
    if (raw.includes("amex") || raw.includes("american") || l4.startsWith("3")) return "amex";
    if (raw.includes("rupay")) return "rupay";
    if (raw.includes("discover") || l4.startsWith("6")) return "discover";
    return "visa";
  }, [transaction.cardBrand, transaction.paymentMethod, transaction.cardLast4]);

  const activeNetwork = detectedNetwork;

  const cardLast4 = transaction.cardLast4 || "4242";
  const fundingType = (transaction.cardFunding || "credit").toUpperCase();
  const expMonth = transaction.expMonth || "12";
  const expYear = transaction.expYear || "28";

  // Dynamic Bank Name based on currency and network
  const defaultBank = useMemo(() => {
    const c = currency.toUpperCase();
    if (c === "INR" || c === "₹") {
      return activeNetwork === "rupay"
        ? "STATE BANK OF INDIA"
        : activeNetwork === "mastercard"
          ? "ICICI BANK"
          : "HDFC BANK";
    }
    if (c === "GBP" || c === "£") return "BARCLAYS PREMIER";
    if (c === "EUR" || c === "€") return "BNP PARIBAS";
    return activeNetwork === "amex" ? "AMERICAN EXPRESS" : "CHASE SAPPHIRE";
  }, [currency, activeNetwork]);

  const bankName = transaction.bankName || defaultBank;

  // Authentic style configs for each card brand
  const networkConfigs: Record<CardNetwork, CardStyleConfig> = {
    visa: {
      name: "Visa",
      gradient: "bg-gradient-to-br from-[#0c1f3d] via-[#102a54] to-[#1a3d6d]",
      glow: "from-blue-500/20 via-sky-400/10 to-transparent",
      tier: "SIGNATURE",
      bankName,
      textColor: "text-white",
      hologramColor: "bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-400",
      logo: (
        <div className="flex flex-col items-end">
          <span className="font-serif text-xl font-black tracking-wider text-white italic drop-shadow-md">
            VISA
          </span>
          <span className="text-[7px] font-bold tracking-[0.25em] text-sky-200/90 uppercase">
            SIGNATURE
          </span>
        </div>
      ),
    },
    mastercard: {
      name: "Mastercard",
      gradient: "bg-gradient-to-br from-[#121214] via-[#1c1c20] to-[#26262b]",
      glow: "from-rose-500/20 via-amber-400/15 to-transparent",
      tier: "WORLD ELITE",
      bankName,
      textColor: "text-white",
      hologramColor: "bg-gradient-to-tr from-amber-400 via-rose-400 to-yellow-300",
      logo: (
        <div className="flex flex-col items-end">
          <div className="flex items-center -space-x-2.5">
            <div className="size-6 rounded-full bg-[#EB001B] shadow-xs" />
            <div className="size-6 rounded-full bg-[#F79E1B]/95 shadow-xs" />
          </div>
          <span className="mt-0.5 text-[7px] font-bold tracking-tight text-slate-200">
            mastercard
          </span>
        </div>
      ),
    },
    amex: {
      name: "American Express",
      gradient: "bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b]",
      glow: "from-slate-400/25 via-slate-200/15 to-transparent",
      tier: "CENTURION",
      bankName: "AMERICAN EXPRESS",
      textColor: "text-slate-100",
      hologramColor: "bg-gradient-to-tr from-slate-300 via-cyan-200 to-slate-400",
      logo: (
        <div className="flex flex-col items-end">
          <div className="rounded border border-white/60 bg-[#006fcf] px-1.5 py-0.5 shadow-sm">
            <span className="font-mono text-[9px] font-black tracking-tighter text-white uppercase">
              AMEX
            </span>
          </div>
          <span className="mt-0.5 text-[6px] font-extrabold tracking-widest text-slate-300 uppercase">
            PLATINUM
          </span>
        </div>
      ),
    },
    rupay: {
      name: "RuPay",
      gradient: "bg-gradient-to-br from-[#0a1c38] via-[#0f2c4f] to-[#0c4a52]",
      glow: "from-amber-500/20 via-emerald-500/20 to-transparent",
      tier: "SELECT",
      bankName,
      textColor: "text-white",
      hologramColor: "bg-gradient-to-tr from-orange-400 via-emerald-300 to-cyan-400",
      logo: (
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-0.5 font-sans font-black tracking-tight text-white drop-shadow-sm">
            <span className="text-base text-white">RuPay</span>
            <div className="flex flex-col gap-0.5">
              <span className="size-1.5 rounded-full bg-[#f97316]" />
              <span className="size-1.5 rounded-full bg-[#10b981]" />
            </div>
          </div>
          <span className="text-[7px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
            SELECT
          </span>
        </div>
      ),
    },
    discover: {
      name: "Discover",
      gradient: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#431407]",
      glow: "from-orange-500/25 via-amber-500/15 to-transparent",
      tier: "CASHBACK",
      bankName,
      textColor: "text-white",
      hologramColor: "bg-gradient-to-tr from-orange-400 via-amber-300 to-yellow-200",
      logo: (
        <div className="flex flex-col items-end">
          <div className="flex items-center font-black tracking-wider text-white">
            <span className="text-sm">DISC</span>
            <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ea580c] text-white" />
            <span className="text-sm">VER</span>
          </div>
          <span className="text-[7px] font-bold tracking-widest text-orange-300/90 uppercase">
            NETWORK
          </span>
        </div>
      ),
    },
  };

  const currentConfig = networkConfigs[activeNetwork];

  const handleCopyChargeId = () => {
    if (transaction.stripeChargeId) {
      navigator.clipboard.writeText(transaction.stripeChargeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
      <CardHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CreditCard className="size-3.5" />
            </div>
            <CardTitle className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Card Payment Details
            </CardTitle>
          </div>

          {/* Payment Status Badge */}
          <Badge
            variant="outline"
            className="border-emerald-200/80 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500" />
            Verified & Captured
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between p-5">
        {/* Realistic Physical Bank Card Mockup */}
        <div className="relative mx-auto w-full max-w-[360px] py-1 select-none">
          {/* Card Container with authentic standard 85.6mm x 53.98mm ratio */}
          <div
            className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl ${currentConfig.gradient} p-5 ${currentConfig.textColor} shadow-2xl ring-1 shadow-slate-950/30 ring-white/20 transition-all duration-300`}
          >
            {/* Ambient Dynamic Spotlight Glow */}
            <div
              className={`pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-gradient-to-br ${currentConfig.glow} blur-2xl transition-all duration-500`}
            />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-2xl" />

            {/* Subtle Diagonal Glare Texture */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_65%)]" />

            {/* Top Row: Bank / Issuer Name & Network Logo */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="block font-mono text-[11px] font-black tracking-widest text-slate-100 uppercase drop-shadow-sm">
                  {currentConfig.bankName}
                </span>
                <span className="py-0.2 mt-0.5 inline-block rounded-xs bg-white/15 px-1.5 text-[8px] font-bold tracking-wider text-slate-200 uppercase backdrop-blur-xs">
                  {fundingType}
                </span>
              </div>

              {/* Dynamic Network Logo */}
              <div className="shrink-0">{currentConfig.logo}</div>
            </div>

            {/* Middle Row: EMV Microchip & Contactless Waves */}
            <div className="relative z-10 mt-3.5 flex items-center gap-3">
              {/* Metallic Gold EMV Chip with realistic traces */}
              <div className="relative flex h-8 w-11 items-center justify-center overflow-hidden rounded-md border border-amber-300/80 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner">
                {/* Circuitry trace grooves */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-amber-900/35" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-900/35" />
                <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-900/35" />
                <div className="size-3.5 rounded-xs border border-amber-900/30 bg-amber-300/80 shadow-2xs" />
              </div>

              {/* Contactless Radio Waves Symbol */}
              <Wifi className="size-4.5 rotate-90 text-slate-300/80" />
            </div>

            {/* Embossed Card Number with authentic 3D foil depth */}
            <div className="relative z-10 mt-3.5 flex items-center justify-between font-mono text-base font-bold tracking-[0.24em] text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-lg">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span className="font-black text-white">{cardLast4}</span>
            </div>

            {/* Bottom Row: Cardholder Name, Expiry Date & Security Hologram */}
            <div className="relative z-10 mt-3 flex items-end justify-between text-[10px]">
              {/* Cardholder */}
              <div>
                <span className="block text-[7.5px] font-bold tracking-wider text-slate-400 uppercase drop-shadow-xs">
                  Cardholder
                </span>
                <span className="mt-0.5 block max-w-[170px] truncate font-mono text-xs font-bold tracking-wider text-slate-100 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                  {customerName || "Customer"}
                </span>
              </div>

              {/* Expiry Date */}
              <div className="text-center">
                <span className="block text-[7.5px] font-bold tracking-wider text-slate-400 uppercase">
                  Valid Thru
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold tracking-wider text-slate-100 drop-shadow-xs">
                  {expMonth}/{expYear}
                </span>
              </div>

              {/* Metallic Security Hologram Patch */}
              <div
                className={`size-6 rounded-md ${currentConfig.hologramColor} opacity-75 shadow-xs ring-1 ring-white/30`}
                title="Security Hologram"
              />
            </div>
          </div>
        </div>

        {/* Transaction Metadata Card Footer */}
        <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Card Network:</span>
            <span className="font-bold text-slate-800 capitalize dark:text-slate-200">
              {currentConfig.name} ({currentConfig.tier})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Card Category:</span>
            <span className="font-semibold text-slate-800 capitalize dark:text-slate-200">
              {fundingType.toLowerCase()} Card
            </span>
          </div>

          {transaction.stripeChargeId && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Stripe Charge:</span>
              <div className="flex items-center gap-1.5">
                <code className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 shadow-2xs ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                  {transaction.stripeChargeId.slice(0, 16)}...
                </code>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleCopyChargeId}
                  onKeyDown={(e) => e.key === "Enter" && handleCopyChargeId()}
                  className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Copy Charge ID"
                >
                  {copied ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Source Card Routing
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Direct to {currentConfig.name} (•••• {cardLast4})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
