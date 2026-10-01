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
    <div className="border-b border-emerald-100/60 bg-linear-to-r from-emerald-50/70 via-teal-50/30 to-emerald-50/40 p-8 pb-8">
      <div className="flex items-center gap-6">
        <div className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-emerald-500/10 text-2xl font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-500/20">
          {manager.image ? (
            <>
              <Image
                src={manager.image}
                alt={`${manager.firstName} ${manager.lastName}`}
                width={40}
                height={40}
                className="object-cover"
              />
              <Button
                variant="ghost"
                onClick={() => onImageExpand(manager.image || null)}
                className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:scale-110"
                title="View full screen"
              >
                <Expand className="h-3 w-3" />
              </Button>
            </>
          ) : (
            `${manager.firstName[0] ?? ""}${manager.lastName[0] ?? ""}`.toUpperCase()
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">
            {`${manager.firstName} ${manager.lastName}`}
          </h1>
        </div>

        <ViewStatusMeta
          status={manager.status}
          dateLabel="Created On"
          dateValue={formatDate(manager.createdAt)}
        />
      </div>
    </div>
  );
}
