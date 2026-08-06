import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FileTooltipProps {
  children: React.ReactNode;
  content: string;
}

export const TooltipWrapper: React.FC<FileTooltipProps> = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xl px-2 py-1 text-sm break-all">
          <p className="">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
