"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TruncatedTextCellProps {
  text: string | number | null | undefined;
  maxWords?: number;
  maxChars?: number;
  truncateAfterAt?: boolean;
  className?: string;
}

export function TruncatedTextCell({
  text,
  maxWords,
  maxChars,
  truncateAfterAt,
  className = "",
}: TruncatedTextCellProps) {
  const textString = String(text ?? "").trim();
  if (!textString) return null;

  const displayText = textString.split("_")[0];
  let truncatedText = displayText;

  if (truncateAfterAt && textString.includes("@")) {
    const atIndex = textString.indexOf("@");
    const userPart = textString.slice(0, atIndex);
    truncatedText = `${userPart}@...`;
  } else if (maxChars !== undefined && !textString.includes("_")) {
    truncatedText = textString.slice(0, maxChars) + "...";
  } else if (!textString.includes("_")) {
    const limit = maxWords ?? 6;
    const words = textString.split(/[\s._-]+/).filter(Boolean);

    truncatedText = words.length > limit ? `${words.slice(0, limit).join(" ")}...` : textString;
  }

  return (
    <TooltipProvider delay={150}>
      <Tooltip>
        <TooltipTrigger render={<span className={className}>{truncatedText}</span>} />

        <TooltipContent side="top" align="center" className="max-w-md">
          <p className="whitespace-pre-wrap">{textString}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
