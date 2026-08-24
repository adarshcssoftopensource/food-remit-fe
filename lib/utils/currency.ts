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

export function getCurrencySymbol(symbol?: string, currencyCode?: string): string {
  if (symbol && symbol !== currencyCode && !/^[A-Z]{3}$/.test(symbol)) {
    return symbol;
  }
  if (currencyCode) {
    const upper = currencyCode.toUpperCase();
    if (CURRENCY_SYMBOLS[upper]) {
      return CURRENCY_SYMBOLS[upper];
    }
  }
  if (symbol) {
    const upper = symbol.toUpperCase();
    if (CURRENCY_SYMBOLS[upper]) {
      return CURRENCY_SYMBOLS[upper];
    }
    return symbol;
  }
  return "$";
}
