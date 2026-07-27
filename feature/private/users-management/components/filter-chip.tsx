import { Button } from "@/components/ui/button";

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
      {label}
      <Button onClick={onRemove} variant={"ghost"} className="size-6">
        ×
      </Button>
    </span>
  );
}
