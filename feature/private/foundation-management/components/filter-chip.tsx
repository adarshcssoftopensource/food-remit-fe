import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors">
      {label}
      <Button
        onClick={onRemove}
        variant="ghost"
        className="hover:bg-primary/20 hover:text-primary ml-0.5 size-5 p-0"
      >
        <X className="size-3.5" />
      </Button>
    </span>
  );
}
