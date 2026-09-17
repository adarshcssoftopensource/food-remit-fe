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
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

interface OrderNotificationCardProps {
  message: string;
  isRead?: boolean;
}

/**
 * Converts a raw date string (especially if ending in UTC) into the country's local timezone.
 * Defaults to IST (Asia/Kolkata) for Indian currency/numbers or the system default.
 */
function formatNotificationDate(rawDate: string, currency?: string, phone?: string): string {
  if (!rawDate) return "";

  // If already contains a country label (e.g. "(IST)", "(PHT)", "(EST)") and NOT UTC, return as is
  if (!rawDate.toUpperCase().includes("UTC") && /\([A-Z]{3,4}\)/.test(rawDate)) {
    return rawDate;
  }

  const curr = (currency || "").toUpperCase();
  const cleanPhone = (phone || "").replace(/[^\d+]/g, "");

  let timeZone = "Asia/Kolkata";
  let tzLabel = "IST";

  if (
    curr.includes("PHP") ||
    curr.includes("₱") ||
    cleanPhone.startsWith("+63") ||
    cleanPhone.startsWith("63")
  ) {
    timeZone = "Asia/Manila";
    tzLabel = "PHT";
  } else if (curr.includes("CAD") || cleanPhone.startsWith("+1") || cleanPhone.startsWith("1")) {
    timeZone = "America/Toronto";
    tzLabel = "EST";
  } else if (curr.includes("GBP") || cleanPhone.startsWith("+44")) {
    timeZone = "Europe/London";
    tzLabel = "GMT";
  } else if (curr.includes("AED") || cleanPhone.startsWith("+971")) {
    timeZone = "Asia/Dubai";
    tzLabel = "GST";
  } else if (curr.includes("AUD") || cleanPhone.startsWith("+61")) {
    timeZone = "Australia/Sydney";
    tzLabel = "AEST";
  } else {
    // Default to India IST (Food Remit default operations)
    timeZone = "Asia/Kolkata";
    tzLabel = "IST";
  }

  try {
    const cleanDateStr = rawDate.replace(/\s*UTC\s*$/i, " UTC").trim();
    const parsedDate = new Date(cleanDateStr);
    if (!isNaN(parsedDate.getTime())) {
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(parsedDate);
      return `${formatted} (${tzLabel})`;
    }
  } catch {
    // fallback
  }

  return rawDate.replace(/\s*UTC/gi, "").trim();
}

export function parseOrderNotification(message: string) {
  const lines = message
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let orderRef = "";
  let store = "";
  let status = "";
  let rawDate = "";
  let customerRaw = "";
  let recipientRaw = "";
  const items: Array<{ name: string; qty: string; price: string }> = [];

  // Customer Payment
  let subtotal = "";
  let markup = "";
  let tax = "";
  let fee = "";
  let discount = "";
  let grandTotal = "";

  // Vendor Settlement
  let vendorBase = "";
  let vendorTax = "";
  let commission = "";
  let commissionPercent = "";
  let vendorSettlement = "";

  let payment = "";
  let detectedCurrency = "";

  let inItemsSection = false;

  for (const line of lines) {
    if (line.startsWith("Order Reference:")) {
      orderRef = line.replace("Order Reference:", "").trim();
    } else if (line.startsWith("Store:")) {
      store = line.replace("Store:", "").trim();
    } else if (line.startsWith("Status:")) {
      status = line.replace("Status:", "").trim();
    } else if (line.startsWith("Date:")) {
      rawDate = line.replace("Date:", "").trim();
    } else if (line.startsWith("Customer:")) {
      customerRaw = line.replace("Customer:", "").trim();
    } else if (line.startsWith("Recipient:")) {
      recipientRaw = line.replace("Recipient:", "").trim();
    } else if (line.startsWith("Ordered Items:")) {
      inItemsSection = true;
    } else if (
      line.startsWith("---") ||
      line.includes("Customer Payment") ||
      line.includes("Vendor Settlement") ||
      line.startsWith("Items Subtotal:") ||
      line.startsWith("Item Price") ||
      line.startsWith("Base Price:") ||
      line.startsWith("Payment:")
    ) {
      inItemsSection = false;
    }

    if (inItemsSection) {
      // Must NOT be a separator or header
      if (
        !line.startsWith("---") &&
        !line.includes("Customer Payment") &&
        !line.includes("Vendor Settlement") &&
        !line.startsWith("Ordered Items:")
      ) {
        // Must match either "• Item x 2 @ INR 100" or start with "•" or "- " followed by item structure
        if (line.startsWith("•") || line.match(/^[-*]\s+.*\s+x\s+\d+/)) {
          const clean = line.replace(/^[•\-*]\s*/, "").trim();
          const match = clean.match(/^(.*?)\s+x\s+(\d+)\s+@\s+(.*)$/);
          if (match) {
            items.push({
              name: match[1].trim(),
              qty: match[2].trim(),
              price: match[3].trim(),
            });
            if (!detectedCurrency) {
              const currMatch = match[3].trim().match(/^([A-Za-z$₹₱€£]+)/);
              if (currMatch) detectedCurrency = currMatch[1];
            }
          } else if (clean) {
            items.push({
              name: clean,
              qty: "1",
              price: "",
            });
          }
        }
      }
    } else {
      // Parse Financial lines
      if (line.startsWith("Item Price")) {
        // e.g. "Item Price (Including Markup 10.0%): INR 566.00"
        const m = line.match(/Markup\s+([\d.]+%?)/i);
        if (m) markup = m[1];
        subtotal = line.split(":").slice(1).join(":").trim();
      } else if (line.startsWith("Items Subtotal:")) {
        subtotal = line.replace("Items Subtotal:", "").trim();
      } else if (line.startsWith("Markup:")) {
        markup = line.replace("Markup:", "").trim();
      } else if (line.startsWith("Discount Applied:") || line.startsWith("Discount:")) {
        discount = line.split(":").slice(1).join(":").trim();
      } else if (line.startsWith("Store Govt tax")) {
        // "Store Govt tax (10.0%): INR 56.60" or "+INR 56.60"
        const val = line.split(":").slice(1).join(":").trim();
        if (val.startsWith("+")) {
          vendorTax = val;
        } else {
          tax = val;
        }
      } else if (line.startsWith("Tax:")) {
        tax = line.replace("Tax:", "").trim();
      } else if (line.startsWith("Processing Fee:")) {
        fee = line.replace("Processing Fee:", "").trim();
      } else if (line.startsWith("Order Total:") || line.startsWith("Grand Total:")) {
        grandTotal = line.split(":").slice(1).join(":").trim();
      } else if (line.startsWith("Base Price:")) {
        vendorBase = line.replace("Base Price:", "").trim();
      } else if (line.startsWith("Food Remit Commission")) {
        // "Food Remit Commission (5.0%): -INR 25.73"
        const m = line.match(/\(([\d.]+%?)\)/);
        if (m) commissionPercent = m[1];
        commission = line.split(":").slice(1).join(":").trim();
      } else if (line.startsWith("Total Settlement:")) {
        vendorSettlement = line.replace("Total Settlement:", "").trim();
      } else if (line.startsWith("Payment:")) {
        const rawP = line.replace("Payment:", "").trim();
        payment = rawP
          .replace(/^1\b/, "Card")
          .replace(/^2\b/, "Apple Pay")
          .replace(/^3\b/, "Google Pay");
      }
    }
  }

  // Detect currency from any field if not yet set
  if (!detectedCurrency) {
    const textToCheck = `${grandTotal} ${subtotal} ${fee} ${tax} ${vendorBase}`;
    const m = textToCheck.match(/\b(INR|CAD|USD|PHP|GBP|AUD|AED|₹|₱|\$|€|£)\b/);
    if (m) detectedCurrency = m[1];
  }

  // Customer parsing
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
  let recipientName = recipientRaw;
  let recipientPhone = "";
  const recMatch = recipientRaw.match(/^(.*?)\s*\((.*?)\)$/);
  if (recMatch) {
    recipientName = recMatch[1].trim();
    recipientPhone = recMatch[2].trim();
  }

  const isOrder = Boolean(orderRef || lines.some((l) => l.startsWith("Order Reference:")));
  const formattedDate = formatNotificationDate(rawDate, detectedCurrency, customerPhone);

  return {
    isOrder,
    orderRef,
    store,
    status,
    rawDate,
    date: formattedDate || rawDate,
    customerName,
    customerPhone,
    customerEmail,
    recipientName,
    recipientPhone,
    items,
    // Customer Payment
    subtotal,
    markup,
    tax,
    fee,
    discount,
    grandTotal,
    // Vendor Settlement
    vendorBase,
    vendorTax,
    commission,
    commissionPercent,
    vendorSettlement,
    payment,
    currency: detectedCurrency,
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
    return (
      <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
        {message}
      </p>
    );
  }

  const cleanOrderRef = parsed.orderRef.replace(/^#/, "");
  const orderSearchLink = cleanOrderRef
    ? `${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}?search=${encodeURIComponent(cleanOrderRef)}`
    : ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT;

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-2xl border transition-all duration-200",
        isRead
          ? "border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/30"
          : "border-emerald-200/90 bg-emerald-50/15 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/10",
      )}
    >
      {/* Top Banner: Reference, Status, Store, and Country Date */}
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

      <div className="space-y-3.5 p-4">
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

        {/* Ordered Items Table */}
        {parsed.items.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-3.5 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="size-3.5 text-emerald-600" />
                Ordered Items ({parsed.items.length})
              </span>
              <span>Amount</span>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {parsed.items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
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
        )}

        {/* Financial Breakdown: Customer Payment & Vendor Settlement */}
        <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
          {/* Customer Payment Row */}
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

          {/* Vendor Settlement (Store Payout) if available */}
          {(parsed.vendorBase || parsed.vendorSettlement) && (
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
                    <strong className="text-amber-600 dark:text-amber-400">
                      {parsed.commission}
                    </strong>
                    {parsed.commissionPercent && (
                      <span className="ml-1 text-[10px] text-slate-400">
                        ({parsed.commissionPercent})
                      </span>
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
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-1">
          <Link
            href={orderSearchLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>View Order</span>
            <ArrowUpRight className="size-3.5 text-emerald-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
