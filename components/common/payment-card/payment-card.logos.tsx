import React from "react";
import type { GlobalCardNetwork } from "./payment-card.types";

export function getNetworkLogo(network: GlobalCardNetwork): React.ReactNode {
  switch (network) {
    case "visa":
      return (
        <div className="flex flex-col items-end">
          <span className="font-serif text-xl font-black tracking-wider text-white italic drop-shadow-md">
            VISA
          </span>
          <span className="text-[7px] font-bold tracking-[0.25em] text-sky-200/90 uppercase">
            SIGNATURE
          </span>
        </div>
      );

    case "mastercard":
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center -space-x-2.5">
            <div className="size-6 rounded-full bg-[#EB001B] shadow-xs" />
            <div className="size-6 rounded-full bg-[#F79E1B]/95 shadow-xs" />
          </div>
          <span className="mt-0.5 text-[7px] font-bold tracking-tight text-slate-200">
            mastercard
          </span>
        </div>
      );

    case "american-express":
      return (
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
      );

    case "rupay":
      return (
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
      );

    case "discover":
      return (
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
      );

    case "diners-club":
      return (
        <div className="flex flex-col items-end">
          <div className="flex size-7 items-center justify-center rounded-full border-2 border-white/80 bg-[#0079be]">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white/90">
              <div className="h-3 w-0.5 bg-white" />
            </div>
          </div>
          <span className="mt-0.5 text-[6px] font-black tracking-widest text-slate-200 uppercase">
            DINERS CLUB
          </span>
        </div>
      );

    case "jcb":
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-0.5 rounded bg-white px-1.5 py-0.5 shadow-sm">
            <span className="font-sans text-xs font-black tracking-tighter text-[#007940]">J</span>
            <span className="font-sans text-xs font-black tracking-tighter text-[#003882]">C</span>
            <span className="font-sans text-xs font-black tracking-tighter text-[#d91424]">B</span>
          </div>
          <span className="mt-0.5 text-[6px] font-bold tracking-widest text-emerald-200 uppercase">
            GLOBAL
          </span>
        </div>
      );

    case "unionpay":
      return (
        <div className="flex flex-col items-end">
          <div className="flex overflow-hidden rounded border border-white/40 shadow-xs">
            <div className="bg-[#da251d] px-1 py-0.5 text-[8px] font-black text-white">Union</div>
            <div className="bg-[#002f6c] px-1 py-0.5 text-[8px] font-black text-white">Pay</div>
          </div>
          <span className="mt-0.5 text-[6px] font-bold tracking-widest text-red-200 uppercase">
            DIAMOND
          </span>
        </div>
      );

    case "maestro":
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center -space-x-2">
            <div className="size-5 rounded-full bg-[#0066cc] shadow-xs" />
            <div className="size-5 rounded-full bg-[#EB001B] shadow-xs" />
          </div>
          <span className="mt-0.5 text-[7px] font-bold tracking-tight text-blue-200">maestro</span>
        </div>
      );

    case "elo":
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center rounded-full bg-black px-2 py-0.5 ring-1 ring-white/30">
            <span className="font-sans text-xs font-black tracking-tighter text-[#00a4e4]">e</span>
            <span className="font-sans text-xs font-black tracking-tighter text-[#ffcc00]">l</span>
            <span className="font-sans text-xs font-black tracking-tighter text-[#ed1c24]">o</span>
          </div>
          <span className="mt-0.5 text-[6px] font-bold tracking-widest text-amber-200 uppercase">
            NANQUIM
          </span>
        </div>
      );

    case "mir":
      return (
        <div className="flex flex-col items-end">
          <div className="rounded bg-[#0f7544] px-1.5 py-0.5 shadow-sm">
            <span className="font-mono text-[9px] font-black tracking-wider text-white">MIR</span>
          </div>
          <span className="mt-0.5 text-[6px] font-bold tracking-widest text-emerald-200 uppercase">
            SUPREME
          </span>
        </div>
      );

    case "hipercard":
      return (
        <div className="flex flex-col items-end">
          <div className="rounded bg-[#990000] px-1.5 py-0.5">
            <span className="font-sans text-[8px] font-black text-white italic">HIPERCARD</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-end">
          <div className="flex size-7 items-center justify-center rounded-xl border border-white/40 bg-white/10 backdrop-blur-xs">
            <div className="size-3 rounded-full border border-white/80" />
          </div>
          <span className="mt-0.5 text-[6px] font-bold tracking-widest text-slate-300 uppercase">
            WORLD CARD
          </span>
        </div>
      );
  }
}
