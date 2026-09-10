import creditCardType from "credit-card-type";
import type { GlobalCardNetwork } from "./payment-card.types";
import { NETWORK_STYLE_MAP } from "./payment-card.themes";

export function detectGlobalCardNetwork(
  brand?: string | null,
  cardNumberOrLast4?: string | null,
): GlobalCardNetwork {
  const brandLower = (brand || "").toLowerCase().trim();

  if (brandLower.includes("rupay")) return "rupay";
  if (brandLower.includes("visa")) return "visa";
  if (brandLower.includes("master") || brandLower === "mc") return "mastercard";
  if (brandLower.includes("amex") || brandLower.includes("american")) return "american-express";
  if (brandLower.includes("discover")) return "discover";
  if (brandLower.includes("diners")) return "diners-club";
  if (brandLower.includes("jcb")) return "jcb";
  if (brandLower.includes("union") || brandLower.includes("cup")) return "unionpay";
  if (brandLower.includes("maestro")) return "maestro";
  if (brandLower.includes("elo")) return "elo";
  if (brandLower.includes("mir")) return "mir";
  if (brandLower.includes("hiper")) return "hipercard";
  if (brandLower.includes("troy")) return "troy";
  if (brandLower.includes("verve")) return "verve";

  // 2. Identification via credit-card-type package
  const cleanDigits = (cardNumberOrLast4 || "").replace(/\D/g, "");
  if (cleanDigits.length >= 2) {
    try {
      const matches = creditCardType(cleanDigits);
      if (matches && matches.length > 0) {
        const type = matches[0].type;
        if (type in NETWORK_STYLE_MAP) {
          return type as GlobalCardNetwork;
        }
      }
    } catch {
      // Ignore package parsing errors
    }

    // Heuristic fallbacks on first digit
    if (cleanDigits.startsWith("4")) return "visa";
    if (cleanDigits.startsWith("5")) return "mastercard";
    if (cleanDigits.startsWith("3")) return "american-express";
    if (cleanDigits.startsWith("6")) return "discover";
  }

  return "visa";
}
