"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TruncatedTextCellProps {
  text: string | number | null | undefined;
  maxWords?: number;
  className?: string;
}

export function TruncatedTextCell({ text, maxWords = 6, className = "" }: TruncatedTextCellProps) {
  const textString = String(text ?? "").trim();

  const words = textString.split(/\s+/).filter(Boolean);

  const shouldTruncate = words.length > maxWords;

  const truncatedText = shouldTruncate ? `${words.slice(0, maxWords).join(" ")}...` : textString;

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
