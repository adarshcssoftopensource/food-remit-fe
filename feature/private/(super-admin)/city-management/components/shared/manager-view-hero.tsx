"use client";

import { Expand } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import { ViewStatusMeta } from "./view-status-meta";

type ManagerViewHeroProps = {
  manager: {
    image?: string | null;
    firstName: string;
    lastName: string;
    status: React.ReactNode;
    createdAt: string;
  };
  onImageExpand: (src: string | null) => void;
};

export function ManagerViewHero({ manager, onImageExpand }: ManagerViewHeroProps) {
  return (
    <div className="border-b border-emerald-100/60 bg-linear-to-r from-emerald-50/70 via-teal-50/30 to-emerald-50/40 p-4.5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-4 sm:contents">
          <div className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-500/10 text-xl font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-500/20 sm:size-20 sm:text-2xl">
            {manager.image ? (
              <>
                <Image
                  src={manager.image}
                  alt={`${manager.firstName} ${manager.lastName}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="ghost"
                  onClick={() => onImageExpand(manager.image || null)}
                  className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-xs hover:scale-110"
                  title="View full screen"
                >
                  <Expand className="h-3 w-3" />
                </Button>
              </>
            ) : (
              `${manager.firstName[0] ?? ""}${manager.lastName[0] ?? ""}`.toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold break-words text-slate-900 sm:text-3xl">
              {`${manager.firstName} ${manager.lastName}`}
            </h1>
          </div>
        </div>

        <div className="shrink-0 border-t border-emerald-100/60 pt-3 sm:ml-auto sm:border-t-0 sm:pt-0">
          <ViewStatusMeta
            status={manager.status}
            dateLabel="Created On"
            dateValue={formatDate(manager.createdAt)}
          />
        </div>
      </div>
    </div>
  );
}
