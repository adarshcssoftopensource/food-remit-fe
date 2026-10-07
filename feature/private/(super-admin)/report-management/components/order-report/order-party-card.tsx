"use client";

import { Building2, FileSignature, MapPin, Phone, UserCheck, ZoomIn } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/lib/utils";

interface PartyDetails {
  fullName?: string;
  fullPhone?: string;
  fullAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
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
  const rawAddress =
    details?.fullAddress && details.fullAddress !== "N/A"
      ? details.fullAddress
      : [details?.address, details?.city, details?.state, details?.country, details?.zipCode]
          .filter(Boolean)
          .join(", ");
  const resolvedAddress = formatAddress(rawAddress) || "N/A";
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

        <div className="flex items-start justify-between gap-3 py-2">
          <span className="flex shrink-0 items-center gap-2 pt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <MapPin className={`size-3.5 ${iconColor}`} /> Location / Address
          </span>
          <div className="max-w-[340px] text-right">
            <span
              className="text-xs leading-relaxed font-semibold text-slate-800 dark:text-slate-200"
              title={resolvedAddress}
            >
              {resolvedAddress}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
