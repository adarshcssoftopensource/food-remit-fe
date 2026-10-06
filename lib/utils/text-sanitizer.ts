import leoProfanity from "leo-profanity";

export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";

  return (
    input
      // Remove zero-width & invisible unicode characters (often used to bypass filters)
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // Strip HTML/script tags completely
      .replace(/<[^>]*>/g, "")
      // Normalize newlines to max 2 consecutive
      .replace(/\n{3,}/g, "\n\n")
      // Collapse redundant spaces
      .replace(/[ \t]+/g, " ")
      .trim()
  );
}

export interface RemarkValidationResult {
  isValid: boolean;
  error?: string;
  cleanedText?: string;
}

export function validateRemarkQuality(rawText: string): RemarkValidationResult {
  if (!rawText || typeof rawText !== "string") {
    return { isValid: false, error: "Remark is required." };
  }

  // 1. Disallow HTML or script tags
  if (/<[^>]*>/i.test(rawText)) {
    return {
      isValid: false,
      error: "HTML or script tags are not allowed in the remark.",
    };
  }

  const sanitized = sanitizeText(rawText);

  // 2. Minimum character length
  if (sanitized.length < 10) {
    return {
      isValid: false,
      error: "Please provide a more descriptive remark (at least 10 characters).",
    };
  }

  if (sanitized.length > 600) {
    return {
      isValid: false,
      error: "Remark cannot exceed 600 characters.",
    };
  }

  // 3. Word tokenization
  const tokens = sanitized
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
    .filter(Boolean);

  if (tokens.length < 2) {
    return {
      isValid: false,
      error: "Please enter at least 2 words explaining this status update.",
    };
  }

  // 4. Profanity check via leo-profanity
  if (leoProfanity.check(sanitized)) {
    const badWords = leoProfanity.badWordsUsed(sanitized);
    const sample = badWords && badWords.length > 0 ? ` (e.g., "${badWords[0]}")` : "";
    return {
      isValid: false,
      error: `Please remove inappropriate or unprofessional language${sample}.`,
    };
  }

  // 5. Repeated character spam (e.g., 4 or more identical consecutive characters: 'ggggggg', 'aaaaaa')
  if (/(.)\1{3,}/i.test(sanitized)) {
    return {
      isValid: false,
      error: "Remark contains excessively repeated characters (e.g. keyboard holding spam).",
    };
  }

  // 6. Repetitive word spam / 'bla bla bla' check
  // Check 3 consecutive identical words: "bla bla bla" or "test test test"
  const hasThreeConsecutiveIdentical = tokens.some(
    (word, i) => i >= 2 && word === tokens[i - 1] && word === tokens[i - 2],
  );
  if (hasThreeConsecutiveIdentical) {
    return {
      isValid: false,
      error: 'Please avoid repetitive filler words (e.g., "bla bla bla").',
    };
  }

  // Check if a single word dominates > 50% of the entire text (for 4+ words)
  if (tokens.length >= 4) {
    const freq: Record<string, number> = {};
    for (const w of tokens) freq[w] = (freq[w] || 0) + 1;
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq / tokens.length > 0.5) {
      return {
        isValid: false,
        error: "Remark contains too many repetitive words. Please provide a clear explanation.",
      };
    }
  }

  // 7. Keyboard mash / Vowel-less gibberish check (e.g. 'fdg fdg dfgfd gfdg')
  const alphaWords3Plus = tokens.filter((w) => w.length >= 3 && !/^\d+$/.test(w));
  if (alphaWords3Plus.length >= 2) {
    // English words with 3+ letters almost always contain at least one vowel (a, e, i, o, u, y)
    const vowelLessWords = alphaWords3Plus.filter((w) => !/[aeiouy]/i.test(w));
    if (vowelLessWords.length / alphaWords3Plus.length >= 0.35) {
      return {
        isValid: false,
        error: "Remark appears to be unreadable keyboard mashing. Please enter a valid sentence.",
      };
    }
  }

  // 8. Known placeholder / dummy patterns
  const lower = sanitized.toLowerCase();
  const dummyPatterns = [
    /^(test|testing|asdf|qwerty|blah|bla|xyz|abc|sample)(\s+\1)+$/i,
    /lorem ipsum/i,
  ];
  if (dummyPatterns.some((p) => p.test(lower))) {
    return {
      isValid: false,
      error: "Please enter a genuine business remark instead of placeholder text.",
    };
  }

  return {
    isValid: true,
    cleanedText: sanitized,
  };
}
