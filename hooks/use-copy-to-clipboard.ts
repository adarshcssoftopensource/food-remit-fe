"use client";

import { useState, useCallback } from "react";
import { successToast, errorToast } from "@/components/toaster";

interface UseCopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  resetDuration?: number;
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy to clipboard",
    resetDuration = 2000,
  } = options;

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        errorToast({ description: "Clipboard not supported on this browser" });
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setIsCopied(true);
        if (successMessage) {
          successToast({ description: successMessage });
        }
        setTimeout(() => setIsCopied(false), resetDuration);
        return true;
      } catch {
        if (errorMessage) {
          errorToast({ description: errorMessage });
        }
        return false;
      }
    },
    [errorMessage, resetDuration, successMessage],
  );

  return { copy, isCopied, copiedText };
}
