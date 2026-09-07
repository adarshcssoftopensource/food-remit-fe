"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TruncatedTextCellProps {
  text: string | number | null | undefined;
  maxWords?: number;
  maxChars?: number;
  className?: string;
}

export function TruncatedTextCell({
  text,
  maxWords,
  maxChars,
  className = "",
}: TruncatedTextCellProps) {
  const textString = String(text ?? "").trim();

  let shouldTruncate = false;
  let truncatedText = textString;

  if (maxChars !== undefined) {
    shouldTruncate = textString.length > maxChars;
    truncatedText = shouldTruncate ? `${textString.slice(0, maxChars)}...` : textString;
  } else {
    const limit = maxWords ?? 6;
    const words = textString.split(/\s+/).filter(Boolean);
    shouldTruncate = words.length > limit;
    truncatedText = shouldTruncate ? `${words.slice(0, limit).join(" ")}...` : textString;
  }

  if (!shouldTruncate) {
    return <span className={className}>{textString || "-"}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={className}>{truncatedText}</span>
        </TooltipTrigger>

        <TooltipContent side="top" align="center" className="max-w-md">
          <p className="whitespace-pre-wrap">{textString}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
