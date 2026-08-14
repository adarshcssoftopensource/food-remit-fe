"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CityManagerData } from "@/feature/private/city-management/types/city-manager";
import { MapPinned } from "lucide-react";

type AssignedCitiesDialogProps = {
  manager: CityManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssignedCitiesDialog({ manager, open, onOpenChange }: AssignedCitiesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-0 p-0 shadow-2xl">
        <div className="relative bg-[linear-gradient(135deg,#0f172a_0%,#9a3412_100%)] px-6 pt-7 pb-5">
          <div className="absolute top-0 right-0 size-28 rounded-full bg-orange-400/25 blur-2xl" />
          <DialogHeader className="relative z-10 text-left">
            <DialogTitle className="flex items-center gap-3 text-xl font-extrabold text-white">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <MapPinned className="size-5 text-orange-300" />
              </span>
              Assigned Cities
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-orange-100/90">
              {manager
                ? `${manager.firstName} ${manager.lastName} · ${manager.countryName}`
                : "City assignments"}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          {manager?.assignedCityNames?.length ? (
            <div className="flex flex-wrap gap-2">
              {manager.assignedCityNames.map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-sm font-semibold text-orange-800"
                >
                  {city}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No cities assigned.</p>
          )}
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
