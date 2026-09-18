/** Mask order reference for employees — only last 4 characters visible. */
export function maskOrderReference(reference?: string | null): string {
  const value = String(reference || "").trim();
  if (!value) return "—";
  if (value.length <= 4) return value;
  const visible = value.slice(-4);
  const hiddenLen = Math.min(value.length - 4, 8);
  return `${"•".repeat(hiddenLen)}${visible}`;
}

export function getOrderReference(order: { refrenceNumber?: string | null; id?: string }): string {
  return String(order.refrenceNumber || order.id || "").trim();
}
