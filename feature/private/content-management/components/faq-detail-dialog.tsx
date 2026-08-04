"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FaqData } from "@/constants/content-management";
import { CalendarDays, CircleHelp, MessageSquareText } from "lucide-react";

type FaqDetailDialogProps = {
  faq: FaqData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FaqDetailDialog({ faq, open, onOpenChange }: FaqDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <div className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,_rgba(52,211,153,0.35),_transparent_70%),linear-gradient(135deg,#042f2e_0%,#0f172a_45%,#134e4a_100%)]" />
            <DialogHeader className="relative z-10 px-8 pt-8 pb-6 text-left">
              <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-white">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                  <CircleHelp className="size-5 text-emerald-300" />
                </span>
                FAQ Detail
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-teal-100/90">
                Full question and answer preview.
              </DialogDescription>
            </DialogHeader>
          </div>

          {faq ? (
            <div className="space-y-5 px-6 pt-2 pb-8">
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-400 uppercase">
                  <MessageSquareText className="size-3.5" />
                  Question
                </div>
                <p className="text-base font-semibold text-slate-900">{faq.question}</p>
              </section>

              <section className="rounded-2xl border border-teal-100 bg-linear-to-br from-teal-50 via-white to-cyan-50 p-5">
                <div className="mb-2 text-xs font-bold tracking-wide text-teal-700 uppercase">
                  Answer
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                  {faq.answer}
                </p>
              </section>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                    Created On
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{faq.createdAt}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
