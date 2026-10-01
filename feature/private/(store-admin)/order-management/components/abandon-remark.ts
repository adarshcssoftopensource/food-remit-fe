const SYSTEM_PREFIX = /^\[System\]\s*/i;

export function parseAbandonRemark(raw?: string | null): {
  isSystem: boolean;
  remark: string;
} {
  const text = (raw || "").trim();
  if (!text) return { isSystem: false, remark: "" };
  const isSystem = SYSTEM_PREFIX.test(text);
  return {
    isSystem,
    remark: text.replace(SYSTEM_PREFIX, "").trim(),
  };
}
