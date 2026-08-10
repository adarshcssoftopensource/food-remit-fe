"use client";

import { CheckCircle2, ChevronRight, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

interface PartnerLeadSuccessProps {
  referenceNumber: string;
  onReset?: () => void;
  className?: string;
}

const NEXT_STEPS = [
  {
    step: "01",
    title: "Review Business Information",
    description: "We review your business profile and location coverage.",
  },
  {
    step: "02",
    title: "Partnership Team Outreach",
    description: "A Food Remit partnership representative contacts you.",
  },
  {
    step: "03",
    title: "Registration Invitation",
    description: "If there is a good fit, we invite you to complete your full vendor registration.",
  },
  {
    step: "04",
    title: "Store & Product Activation",
    description: "Your business, stores, products, and payment setup are activated on Food Remit.",
  },
];

export function PartnerLeadSuccess({
  referenceNumber,
  onReset,
  className,
}: PartnerLeadSuccessProps) {
  return (
    <div
      className={cn(
        "relative z-10 w-full overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/30 sm:p-10",
        className,
      )}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="size-9" />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Thank You for Your Interest in Food Remit
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          We’ve received your partnership request. A member of the Food Remit team will review your
          information and contact you regarding the next steps.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
        <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
          Reference Number
        </span>
        <div className="mt-1 font-mono text-xl font-bold tracking-wider text-emerald-950">
          {referenceNumber}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Store className="size-5 text-emerald-600" />
          What happens next?
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {NEXT_STEPS.map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                {item.step}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Link href={ROUTES.ROOT} className="w-full sm:w-auto">
          <Button className="h-12 w-full rounded-xl bg-emerald-700 px-6 font-semibold text-white shadow-sm hover:bg-emerald-800 sm:w-auto">
            Learn More About Food Remit
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </Link>
        {onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="h-12 w-full rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Submit Another Request
          </Button>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Food Remit. All rights reserved.
      </p>
    </div>
  );
}
