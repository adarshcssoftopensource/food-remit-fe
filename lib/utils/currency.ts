const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  NZD: "NZ$",
  JPY: "¥",
  CNY: "¥",
  CHF: "CHF",
  AED: "د.إ",
  SAR: "﷼",
  SGD: "S$",
  HKD: "HK$",
  KRW: "₩",
  THB: "฿",
  MYR: "RM",
  PHP: "₱",
  IDR: "Rp",
  VND: "₫",
  PKR: "₨",
  BDT: "৳",
  LKR: "Rs",
  NPR: "रू",
  ALL: "L",
  ZAR: "R",
  NGN: "₦",
  KES: "KSh",
  GHS: "GH₵",
  EGP: "E£",
  TRY: "₺",
  RUB: "₽",
  BRL: "R$",
  MXN: "Mex$",
  ARS: "AR$",
  CLP: "CLP$",
  COP: "COL$",
  PEN: "S/",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
};

export function getCurrencySymbol(symbolOrCode?: string | null, fallback = "₹"): string {
  if (!symbolOrCode) return fallback;
  const trimmed = String(symbolOrCode).trim();
  const upper = trimmed.toUpperCase();

  if (
    upper === "INR" ||
    upper === "RS" ||
    upper === "RS." ||
    upper === "RUPEE" ||
    upper === "RUPEES" ||
    trimmed === "₹"
  ) {
    return "₹";
  }
  if (upper === "USD" || upper === "DOLLAR" || upper === "US DOLLAR" || trimmed === "$") {
    return "$";
  }
  if (upper === "PHP" || upper === "PESO" || upper === "PESOS" || trimmed === "₱") {
    return "₱";
  }
  if (upper === "EUR" || trimmed === "€") {
    return "€";
  }
  if (upper === "GBP" || trimmed === "£") {
    return "£";
  }
  if (CURRENCY_SYMBOLS[upper]) {
    return CURRENCY_SYMBOLS[upper];
  }
  // Check if string contains any code like INR, USD, PHP
  for (const [code, sym] of Object.entries(CURRENCY_SYMBOLS)) {
    if (new RegExp(`\\b${code}\\b`, "i").test(trimmed)) {
      return sym;
    }
  }
  for (const sym of Object.values(CURRENCY_SYMBOLS)) {
    if (trimmed.includes(sym)) {
      return sym;
    }
  }
  return fallback;
}

export function cleanCurrencyDisplay(val?: string | number | null, fallbackSymbol = "₹"): string {
  if (val === undefined || val === null || val === "") return `${fallbackSymbol}0.00`;
  let str = String(val).trim();
  if (str.endsWith("%")) return str;
  const isNegative = str.startsWith("-");
  if (isNegative) str = str.slice(1).trim();

  let detectedSymbol = fallbackSymbol;
  for (const [code, sym] of Object.entries(CURRENCY_SYMBOLS)) {
    const reg = new RegExp(`\\b${code}\\b`, "i");
    if (reg.test(str)) {
      detectedSymbol = sym;
      str = str.replace(reg, "").trim();
      break;
    }
  }

  for (const sym of Object.values(CURRENCY_SYMBOLS)) {
    if (str.includes(sym)) {
      detectedSymbol = sym;
      str = str.replace(sym, "").trim();
      break;
    }
  }

  const num = parseFloat(str.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) {
    return `${isNegative ? "-" : ""}${detectedSymbol}0.00`;
  }
  return `${isNegative ? "-" : ""}${detectedSymbol}${num.toFixed(2)}`;
}
