import type { GlobalCardNetwork } from "./payment-card.types";

export function inferDefaultBank(currency?: string | null, network?: GlobalCardNetwork): string {
  const c = (currency || "").toUpperCase().trim();
  if (c === "INR" || c === "₹") {
    return network === "rupay"
      ? "STATE BANK OF INDIA"
      : network === "mastercard"
        ? "ICICI BANK"
        : "HDFC BANK";
  }
  if (c === "GBP" || c === "£") return "BARCLAYS PREMIER";
  if (c === "EUR" || c === "€") return "BNP PARIBAS";
  if (c === "JPY" || c === "¥") return "MITSUBISHI UFJ";
  if (c === "CAD") return "ROYAL BANK OF CANADA";
  if (c === "AUD") return "COMMONWEALTH BANK";
  if (c === "SGD") return "DBS BANK";
  if (c === "BRL") return "BANCO DO BRASIL";
  if (c === "AED") return "EMIRATES NBD";

  return network === "american-express" ? "AMERICAN EXPRESS" : "CHASE SAPPHIRE";
}
