"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Store,
  User,
  Phone,
  Mail,
  CreditCard,
  ArrowUpRight,
  Receipt,
  Calendar,
  Sparkles,
  Building2,
  Globe,
  Handshake,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { parseOrderNotification, parsePartnerLeadNotification } from "../utils/parse-notification";

type ParsedOrderNotification = ReturnType<typeof parseOrderNotification>;
type ParsedPartnerLeadNotification = ReturnType<typeof parsePartnerLeadNotification>;

interface PartnerLeadNotificationCardProps {
  parsedLead: ParsedPartnerLeadNotification;
  isRead?: boolean;
}

export function PartnerLeadNotificationCard({
  parsedLead,
  isRead,
}: PartnerLeadNotificationCardProps) {
  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-2xl border transition-all duration-200",
        isRead
          ? "border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30"
          : "border-emerald-200/90 bg-emerald-50/20 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/10",
      )}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 bg-white px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          {parsedLead.ref && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/70 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Handshake className="size-3.5" />
              {parsedLead.ref}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-300/40 bg-teal-500/15 px-2.5 py-0.5 text-[11px] font-bold text-teal-700 uppercase dark:bg-teal-500/20 dark:text-teal-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
            Vendor Registration
          </span>
          {parsedLead.business && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Building2 className="size-3.5 text-slate-400" />
              {parsedLead.business}
            </span>
          )}
        </div>
      </div>

      {/* Details Content */}
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Business & Contact */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              <User className="size-3.5 text-emerald-600" />
              <span>Contact Person</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {parsedLead.contact || "N/A"}
            </div>
            {parsedLead.country && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <Globe className="size-3 text-slate-400" />
                <span>{parsedLead.country}</span>
              </div>
            )}
          </div>

          {/* Email & Phone */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              <Mail className="size-3.5 text-teal-600" />
              <span>Contact Info</span>
            </div>
            <div className="space-y-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              {parsedLead.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="size-3 text-slate-400" />
                  <span>{parsedLead.email}</span>
                </div>
              )}
              {parsedLead.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="size-3 text-slate-400" />
                  <span>{parsedLead.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end pt-1">
          <Link
            href={ROUTES.ADMIN.PARTNER_LEADS}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>View in Partner Leads CRM</span>
            <ArrowUpRight className="size-3.5 text-emerald-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ParsedOrderProps {
  parsed: ParsedOrderNotification;
}

export function OrderNotificationBanner({ parsed }: ParsedOrderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 bg-white px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        {parsed.orderRef && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/70 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <Receipt className="size-3.5 text-emerald-600" />
            {parsed.orderRef}
          </span>
        )}

        {parsed.status && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/50 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 uppercase dark:bg-emerald-500/20 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {parsed.status}
          </span>
        )}

        {parsed.store && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            <Store className="size-3.5 text-emerald-600" />
            {parsed.store}
          </span>
        )}
      </div>

      {parsed.date && (
        <div className="flex items-center gap-1.5 rounded-md bg-slate-100/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
          <Calendar className="size-3.5 text-slate-400" />
          <span className="font-semibold">{parsed.date}</span>
        </div>
      )}
    </div>
  );
}

export function OrderNotificationPeople({ parsed }: ParsedOrderProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* Customer */}
      {parsed.customerName && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            <User className="size-3.5 text-emerald-600" />
            <span>Customer</span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {parsed.customerName}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            {parsed.customerPhone && (
              <a
                href={`tel:${parsed.customerPhone}`}
                className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Phone className="size-3 text-slate-400" />
                {parsed.customerPhone}
              </a>
            )}
            {parsed.customerEmail && (
              <a
                href={`mailto:${parsed.customerEmail}`}
                className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Mail className="size-3 text-slate-400" />
                {parsed.customerEmail}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Recipient */}
      {parsed.recipientName && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            <Sparkles className="size-3.5 text-teal-600" />
            <span>Delivery Recipient</span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {parsed.recipientName}
          </div>
          {parsed.recipientPhone && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <a
                href={`tel:${parsed.recipientPhone}`}
                className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <Phone className="size-3 text-slate-400" />
                {parsed.recipientPhone}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function OrderNotificationItems({ parsed }: ParsedOrderProps) {
  if (parsed.items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-3.5 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShoppingBag className="size-3.5 text-emerald-600" />
          Ordered Items ({parsed.items.length})
        </span>
        <span>Amount</span>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {parsed.items.map((item) => (
          <li
            key={`${item.name}|${item.qty}|${item.price}`}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                {item.qty}x
              </span>
              <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                {item.name}
              </span>
            </div>
            {item.price && (
              <span className="shrink-0 text-xs font-bold text-slate-900 dark:text-slate-100">
                {item.price}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CustomerPaymentBreakdown({ parsed }: ParsedOrderProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
        <CheckCircle2 className="size-3 text-emerald-600" />
        <span>Customer Payment Breakdown</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {parsed.subtotal && (
          <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Item Price: <strong>{parsed.subtotal}</strong>
            {parsed.markup && (
              <span className="ml-1 text-[10px] text-slate-400">(+{parsed.markup})</span>
            )}
          </span>
        )}

        {parsed.discount && !parsed.discount.includes("0.00") && (
          <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            Discount: <strong>{parsed.discount}</strong>
          </span>
        )}

        {parsed.tax && (
          <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Tax: <strong>{parsed.tax}</strong>
          </span>
        )}

        {parsed.fee && (
          <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Fee: <strong>{parsed.fee}</strong>
          </span>
        )}

        {parsed.payment && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <CreditCard className="size-3 text-slate-400" />
            {parsed.payment}
          </span>
        )}

        {parsed.grandTotal && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-2xs">
            <span>Total Paid:</span>
            <span>{parsed.grandTotal}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function VendorSettlementBreakdown({ parsed }: ParsedOrderProps) {
  if (!(parsed.vendorBase || parsed.vendorSettlement)) return null;

  return (
    <div className="border-t border-slate-200/60 pt-2.5 dark:border-slate-800">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
        <Wallet className="size-3 text-emerald-600" />
        <span>Vendor Settlement (Store Payout)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {parsed.vendorBase && (
          <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Base Price: <strong>{parsed.vendorBase}</strong>
          </span>
        )}

        {parsed.vendorTax && (
          <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Govt Tax: <strong className="text-emerald-600">{parsed.vendorTax}</strong>
          </span>
        )}

        {parsed.commission && (
          <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Commission:{" "}
            <strong className="text-amber-600 dark:text-amber-400">{parsed.commission}</strong>
            {parsed.commissionPercent && (
              <span className="ml-1 text-[10px] text-slate-400">({parsed.commissionPercent})</span>
            )}
          </span>
        )}

        {parsed.vendorSettlement && (
          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-200">
            <span>Net Settlement:</span>
            <span>{parsed.vendorSettlement}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function OrderNotificationFinancials({ parsed }: ParsedOrderProps) {
  return (
    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
      {/* Customer Payment Row */}
      <CustomerPaymentBreakdown parsed={parsed} />

      {/* Vendor Settlement (Store Payout) if available */}
      <VendorSettlementBreakdown parsed={parsed} />
    </div>
  );
}
