"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

export function ProfileLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Background Blur Effects */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-2xl" />

          <div className="relative rounded-3xl">
            <Image
              src="/food_remid_logo.png"
              alt="Food Remit"
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

        <div className="relative mt-10 flex items-center justify-center">
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-emerald-500/15" />

          <div className="rounded-full">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
