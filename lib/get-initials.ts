export function getInitials(name?: string | null, fallback = "--"): string {
  try {
    if (!name || typeof name !== "string") {
      return fallback;
    }

    const initials = name
      .trim()
      .split(/[\s-_]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return initials || fallback;
  } catch (error) {
    console.error("Failed to generate initials:", error);
    return fallback;
  }
}
