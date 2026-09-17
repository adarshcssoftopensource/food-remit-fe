"use client";

import { useMemo } from "react";
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
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

interface OrderNotificationCardProps {
  message: string;
  isRead?: boolean;
}

export function parseOrderNotification(message: string) {
  const lines = message
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let orderRef = "";
  let store = "";
  let status = "";
  let date = "";
  let customerRaw = "";
  let recipientRaw = "";
  const items: Array<{ name: string; qty: string; price: string }> = [];
  let subtotal = "";
  let markup = "";
  let tax = "";
  let fee = "";
  let discount = "";
  let grandTotal = "";
  let payment = "";

  let inItemsSection = false;

  for (const line of lines) {
    if (line.startsWith("Order Reference:")) {
      orderRef = line.replace("Order Reference:", "").trim();
    } else if (line.startsWith("Store:")) {
      store = line.replace("Store:", "").trim();
    } else if (line.startsWith("Status:")) {
      status = line.replace("Status:", "").trim();
    } else if (line.startsWith("Date:")) {
      date = line.replace("Date:", "").trim();
    } else if (line.startsWith("Customer:")) {
      customerRaw = line.replace("Customer:", "").trim();
    } else if (line.startsWith("Recipient:")) {
      recipientRaw = line.replace("Recipient:", "").trim();
    } else if (line.startsWith("Ordered Items:")) {
      inItemsSection = true;
    } else if (line.startsWith("Items Subtotal:")) {
      inItemsSection = false;
      subtotal = line.replace("Items Subtotal:", "").trim();
    } else if (line.startsWith("Markup:")) {
      markup = line.replace("Markup:", "").trim();
    } else if (line.startsWith("Tax:")) {
      tax = line.replace("Tax:", "").trim();
    } else if (line.startsWith("Processing Fee:")) {
      fee = line.replace("Processing Fee:", "").trim();
    } else if (line.startsWith("Discount:")) {
      discount = line.replace("Discount:", "").trim();
    } else if (line.startsWith("Grand Total:")) {
      grandTotal = line.replace("Grand Total:", "").trim();
    } else if (line.startsWith("Payment:")) {
      payment = line.replace("Payment:", "").trim();
    } else if (inItemsSection && (line.startsWith("•") || line.startsWith("-"))) {
      const clean = line.replace(/^[•\-]\s*/, "").trim();
      // Format: "BBQ Grilled Mushroom x 1 @ ₹ 216.00"
      const match = clean.match(/^(.*?)\s+x\s+(\d+)\s+@\s+(.*)$/);
      if (match) {
        items.push({
          name: match[1].trim(),
          qty: match[2].trim(),
          price: match[3].trim(),
        });
      } else {
        items.push({
          name: clean,
          qty: "1",
          price: "",
        });
      }
    }
  }

  // Customer parsing
  // e.g. "karan veer (9592701163) • karan@yopmail.com"
  let customerName = customerRaw;
  let customerPhone = "";
  let customerEmail = "";

  if (customerRaw.includes("•")) {
    const [namePhone, email] = customerRaw.split("•").map((s) => s.trim());
    customerEmail = email || "";
    const phoneMatch = namePhone.match(/^(.*?)\s*\((.*?)\)$/);
    if (phoneMatch) {
      customerName = phoneMatch[1].trim();
      customerPhone = phoneMatch[2].trim();
    } else {
      customerName = namePhone;
    }
  } else {
    const phoneMatch = customerRaw.match(/^(.*?)\s*\((.*?)\)$/);
    if (phoneMatch) {
      customerName = phoneMatch[1].trim();
      customerPhone = phoneMatch[2].trim();
    }
  }

  // Recipient parsing
  // e.g. "Jerry Hills (8278799817)"
  let recipientName = recipientRaw;
  let recipientPhone = "";
  const recMatch = recipientRaw.match(/^(.*?)\s*\((.*?)\)$/);
  if (recMatch) {
    recipientName = recMatch[1].trim();
    recipientPhone = recMatch[2].trim();
  }

  const isOrder = Boolean(orderRef || lines.some((l) => l.startsWith("Order Reference:")));

  return {
    isOrder,
    orderRef,
    store,
    status,
    date,
    customerName,
    customerPhone,
    customerEmail,
    recipientName,
    recipientPhone,
    items,
    subtotal,
    markup,
    tax,
    fee,
    discount,
    grandTotal,
    payment,
  };
}

export function parsePartnerLeadNotification(message: string) {
  const isLead =
    message.includes("Partner Lead Reference:") || message.includes("partner registration lead");
  if (!isLead) return { isLead: false };

  const lines = message
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let ref = "";
  let business = "";
  let contact = "";
  let email = "";
  let phone = "";
  let country = "";

  for (const line of lines) {
    if (line.startsWith("Partner Lead Reference:")) {
      ref = line.replace("Partner Lead Reference:", "").trim();
    } else if (line.startsWith("Business:")) {
      business = line.replace("Business:", "").trim();
    } else if (line.startsWith("Contact:")) {
      contact = line.replace("Contact:", "").trim();
    } else if (line.startsWith("Email:")) {
      email = line.replace("Email:", "").trim();
    } else if (line.startsWith("Phone:")) {
      phone = line.replace("Phone:", "").trim();
    } else if (line.startsWith("Country:")) {
      country = line.replace("Country:", "").trim();
    }
  }

  return {
    isLead: true,
    ref,
    business,
    contact,
    email,
    phone,
    country,
  };
}

export function OrderNotificationCard({ message, isRead }: OrderNotificationCardProps) {
  const parsed = useMemo(() => parseOrderNotification(message), [message]);
  const parsedLead = useMemo(() => parsePartnerLeadNotification(message), [message]);

  if (parsedLead.isLead) {
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

  if (!parsed.isOrder) {
    // Regular plain text notification
    return (
      <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
        {message}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-2xl border transition-all duration-200",
        isRead
          ? "border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30"
          : "border-emerald-200/90 bg-emerald-50/20 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/10",
      )}
    >
      {/* Top Banner: Order Reference, Store Name & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 bg-white px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          {parsed.orderRef && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/70 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Receipt className="size-3.5" />
              {parsed.orderRef}
            </span>
          )}

          {parsed.status && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 uppercase dark:bg-emerald-500/20 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {parsed.status}
            </span>
          )}

          {parsed.store && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Store className="size-3.5 text-slate-400" />
              {parsed.store}
            </span>
          )}
        </div>

        {parsed.date && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Calendar className="size-3 text-slate-400" />
            <span>{parsed.date}</span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        {/* Customer & Recipient Cards */}
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
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3 text-slate-400" />
                    {parsed.customerPhone}
                  </span>
                )}
                {parsed.customerEmail && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="size-3 text-slate-400" />
                    {parsed.customerEmail}
                  </span>
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
                  <Phone className="size-3 text-slate-400" />
                  <span>{parsed.recipientPhone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ordered Items Table */}
        {parsed.items.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between bg-slate-50/80 px-3.5 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800/50 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="size-3.5 text-emerald-600" />
                Ordered Items ({parsed.items.length})
              </span>
              <span>Amount</span>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {parsed.items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
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
        )}

        {/* Financial Breakdown & Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {parsed.subtotal && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Subtotal: <strong>{parsed.subtotal}</strong>
              </span>
            )}
            {parsed.markup && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Markup: <strong>{parsed.markup}</strong>
              </span>
            )}
            {parsed.tax && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Tax: <strong>{parsed.tax}</strong>
              </span>
            )}
            {parsed.fee && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Fee: <strong>{parsed.fee}</strong>
              </span>
            )}
            {parsed.discount && (
              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                Discount: <strong>{parsed.discount}</strong>
              </span>
            )}
            {parsed.payment && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <CreditCard className="size-3 text-slate-400" />
                {parsed.payment}
              </span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {parsed.grandTotal && (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/30">
                <span>Grand Total:</span>
                <span className="text-sm">{parsed.grandTotal}</span>
              </div>
            )}

            <Link
              href={ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span>View Order</span>
              <ArrowUpRight className="size-3.5 text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
