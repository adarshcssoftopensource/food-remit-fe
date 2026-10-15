/**
 * Translation helper for multi-language content management
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "en",
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return "";
  // Check if it's empty HTML from rich text editor
  const plainCheck = trimmed
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  if (!plainCheck) return "";

  if (targetLang.toLowerCase() === sourceLang.toLowerCase()) return trimmed;

  const isHtml = /<[a-z][\s\S]*>/i.test(trimmed);

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed,
    )}&langpair=${sourceLang}|${targetLang}`;
    const res = await fetch(url);
    if (!res.ok) return trimmed;
    const json = await res.json();
    const translated = json?.responseData?.translatedText;
    if (typeof translated === "string" && translated.trim()) {
      const clean = translated.trim();
      if (isHtml && !clean.startsWith("<")) {
        return `<p>${clean}</p>`;
      }
      return clean;
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}
