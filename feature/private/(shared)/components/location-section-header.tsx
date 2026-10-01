import { MapPin } from "lucide-react";

interface LocationSectionHeaderProps {
  description: string;
}

export function LocationSectionHeader({ description }: LocationSectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 bg-linear-to-r from-violet-50/80 to-transparent px-5 py-4 dark:border-slate-800 dark:from-violet-950/30">
      <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50">
        <MapPin className="size-5 text-violet-600 dark:text-violet-400" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Location</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
