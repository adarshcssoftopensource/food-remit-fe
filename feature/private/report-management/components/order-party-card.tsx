"use client";

import { Building2, FileSignature, MapPin, Phone, UserCheck, ZoomIn } from "lucide-react";

import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartyDetails {
  fullName?: string;
  fullPhone?: string;
  fullAddress?: string;
  customerSignature?: string | null;
}

interface OrderPartyCardProps {
  type: "sender" | "receiver";
  details?: PartyDetails | null;
  onPreviewSignature?: (url: string) => void;
}

export function OrderPartyCard({ type, details, onPreviewSignature }: OrderPartyCardProps) {
  const isSender = type === "sender";
  const title = isSender ? "Sender Information" : "Receiver Information";
  const badgeLabel = isSender ? "Purchaser / Sender" : "Beneficiary";
  const iconColor = isSender ? "text-indigo-500" : "text-emerald-500";
  const headerBg = isSender
    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";

  const fullName = details?.fullName || "N/A";
  const fullPhone = details?.fullPhone || "N/A";
  const fullAddress = details?.fullAddress || "N/A";
  const customerSignature = details?.customerSignature;

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
          <div className={`size-8 rounded-lg ${headerBg} flex items-center justify-center`}>
            {isSender ? <Building2 className="size-4" /> : <UserCheck className="size-4" />}
          </div>
          {title}
        </CardTitle>
        <Badge variant="secondary" className="text-[10px] font-bold uppercase">
          {badgeLabel}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <UserCheck className={`size-3.5 ${iconColor}`} /> Full Name
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{fullName}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Phone className={`size-3.5 ${iconColor}`} /> Telephone Number
          </span>
          <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
            {fullPhone}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <MapPin className={`size-3.5 ${iconColor}`} /> Location / Address
          </span>
          <div className="max-w-[220px] text-right">
            <TruncatedTextCell
              text={fullAddress}
              className="text-xs font-medium text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {customerSignature && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <FileSignature className={`size-3.5 ${iconColor}`} /> Customer Signature
            </span>
            <button
              type="button"
              onClick={() => onPreviewSignature?.(customerSignature)}
              className="group hover:ring-primary/40 relative size-12 overflow-hidden rounded-lg border border-slate-200 transition-all hover:ring-2 focus:outline-none dark:border-slate-800"
              title="Click to preview signature"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customerSignature}
                alt="Customer Signature"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-4 text-white drop-shadow-md" />
              </div>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
