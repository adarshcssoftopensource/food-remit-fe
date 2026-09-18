/** Mask order reference for employees — only last 4 characters visible. */
export function maskOrderReference(reference?: string | null): string {
  const { hidden, visible, empty } = maskOrderReferenceParts(reference);
  if (empty) return "—";
  return `${hidden}${visible}`;
}

export function maskOrderReferenceParts(reference?: string | null): {
  hidden: string;
  visible: string;
  empty: boolean;
} {
  const value = String(reference || "").trim();
  if (!value) return { hidden: "", visible: "", empty: true };
  if (value.length <= 4) return { hidden: "", visible: value, empty: false };
  const visible = value.slice(-4);
  const hiddenLen = Math.min(value.length - 4, 8);
  return { hidden: "•".repeat(hiddenLen), visible, empty: false };
}

export function getOrderReference(order: { refrenceNumber?: string | null; id?: string }): string {
  return String(order.refrenceNumber || order.id || "").trim();
}
