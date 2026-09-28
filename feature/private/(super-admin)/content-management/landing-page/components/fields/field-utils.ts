type FieldsProps = {
  control: any;
  setValue?: any;
  errors: any;
};

export function fieldError(errors: FieldsProps["errors"], path: string) {
  const parts = path.split(".");
  let cur: unknown = errors;
  for (const part of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  if (cur && typeof cur === "object" && "message" in cur) {
    return String((cur as { message?: string }).message ?? "");
  }
  return undefined;
}

export function pickDirtyFields(
  values: Record<string, unknown>,
  dirty: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(dirty)) {
    const marker = dirty[key];
    if (marker === true) {
      out[key] = values[key];
      continue;
    }
    if (Array.isArray(marker)) {
      if (marker.some((item) => Boolean(item))) {
        out[key] = values[key];
      }
      continue;
    }
    if (marker && typeof marker === "object") {
      const nestedValues = (values[key] ?? {}) as Record<string, unknown>;
      const nested = pickDirtyFields(nestedValues, marker as Record<string, unknown>);
      if (Object.keys(nested).length > 0) out[key] = nested;
    }
  }
  return out;
}
