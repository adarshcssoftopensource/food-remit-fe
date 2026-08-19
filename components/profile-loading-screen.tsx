"use client";

import { APP_ASSETS } from "@/config/assets.config";
import Image from "next/image";

export function ProfileLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-green-300 blur-2xl" />

          <div className="relative rounded-3xl">
            <Image
              src={APP_ASSETS.LOGO.PATH}
              alt={APP_ASSETS.LOGO.ALT}
              width={150}
              height={50}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Loading Profile</h2>

          <p className="mt-2 text-sm text-slate-500">Setting up your workspace...</p>
        </div>
      </div>
    </div>
  );
}
