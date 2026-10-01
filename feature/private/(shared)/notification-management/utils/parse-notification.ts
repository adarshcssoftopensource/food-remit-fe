const NOTIFICATION_DATE_FORMATTERS = {
  "Asia/Kolkata": new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }),
  "Asia/Manila": new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    dateStyle: "medium",
    timeStyle: "short",
  }),
  "America/Toronto": new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  }),
  "Europe/London": new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/London",
    dateStyle: "medium",
    timeStyle: "short",
  }),
  "Asia/Dubai": new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dubai",
    dateStyle: "medium",
    timeStyle: "short",
  }),
  "Australia/Sydney": new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Sydney",
    dateStyle: "medium",
    timeStyle: "short",
  }),
};

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

  let timeZone: keyof typeof NOTIFICATION_DATE_FORMATTERS = "Asia/Kolkata";
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
      const formatted = NOTIFICATION_DATE_FORMATTERS[timeZone].format(parsedDate);
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
          if (match && match[1] && match[2] && match[3]) {
            items.push({
              name: match[1].trim(),
              qty: match[2].trim(),
              price: match[3].trim(),
            });
            if (!detectedCurrency) {
              const currMatch = match[3].trim().match(/^([A-Za-z$₹₱€£]+)/);
              if (currMatch && currMatch[1]) detectedCurrency = currMatch[1];
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
        if (m && m[1]) markup = m[1];
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
        if (m && m[1]) commissionPercent = m[1];
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
    if (m && m[1]) detectedCurrency = m[1];
  }

  // Customer parsing
  let customerName = customerRaw;
  let customerPhone = "";
  let customerEmail = "";

  if (customerRaw.includes("•")) {
    const [namePhone = "", email = ""] = customerRaw.split("•").map((s) => s.trim());
    customerEmail = email;
    const phoneMatch = namePhone.match(/^(.*?)\s*\((.*?)\)$/);
    if (phoneMatch && phoneMatch[1] && phoneMatch[2]) {
      customerName = phoneMatch[1].trim();
      customerPhone = phoneMatch[2].trim();
    } else {
      customerName = namePhone;
    }
  } else {
    const phoneMatch = customerRaw.match(/^(.*?)\s*\((.*?)\)$/);
    if (phoneMatch && phoneMatch[1] && phoneMatch[2]) {
      customerName = phoneMatch[1].trim();
      customerPhone = phoneMatch[2].trim();
    }
  }

  // Recipient parsing
  let recipientName = recipientRaw;
  let recipientPhone = "";
  const recMatch = recipientRaw.match(/^(.*?)\s*\((.*?)\)$/);
  if (recMatch && recMatch[1] && recMatch[2]) {
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
