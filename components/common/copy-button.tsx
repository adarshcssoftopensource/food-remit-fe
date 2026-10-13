"use client";

import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "value"> {
  /** The value that will be copied to clipboard */
  value: string | null | undefined;
  /** Toast and tooltip label (e.g. "Order ID", "Coupon Code") */
  label?: string;
  /** Whether to render "Copy" text alongside icon */
  showText?: boolean;
  /** Optional custom text to show when not copied */
  text?: string;
  /** Optional custom text to show when copied */
  copiedText?: string;
}

export function CopyButton({
  value,
  label,
  showText = false,
  text = "Copy",
  copiedText = "Copied!",
  variant = "ghost",
  size = "icon",
  className,
  ...props
}: CopyButtonProps) {
  const successMsg = label ? `${label} copied to clipboard!` : "Copied to clipboard!";
  const { copy, isCopied } = useCopyToClipboard({ successMessage: successMsg });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!value) return;
    copy(value);
  };

  if (!value) return null;

  return (
    <TooltipProvider delay={150}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={variant}
              size={size}
              onClick={handleClick}
              aria-label={label ? `Copy ${label}` : "Copy to clipboard"}
              className={cn(
                "relative shrink-0 transition-colors focus-visible:ring-1",
                size === "icon" && "text-muted-foreground hover:text-foreground h-6 w-6 p-0",
                showText && "h-7 gap-1.5 px-2 text-xs font-medium",
                isCopied && "text-emerald-600 hover:text-emerald-600 dark:text-emerald-400",
                className,
              )}
              {...props}
            />
          }
        >
          {isCopied ? (
            <Check className="animate-in zoom-in-75 h-3.5 w-3.5 duration-150" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {showText && <span>{isCopied ? copiedText : text}</span>}
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {isCopied ? (
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" /> Copied!
            </span>
          ) : (
            <span>Copy {label || "to clipboard"}</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
