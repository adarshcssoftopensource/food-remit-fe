import Image from "next/image";
import React from "react";
import { Globe, ShieldCheck, Zap, Users } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-linear-to-br from-[#f4f9f7] to-[#e6f4ea]">
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[50vh] max-h-150 w-[50vw] max-w-150">
        <Image
          src="/login_background_image.png"
          alt="Food Decor"
          fill
          className="object-contain object-bottom-left opacity-95"
          priority
        />
      </div>

      <div className="relative z-10 hidden w-[45%] flex-col items-center justify-center p-8 shadow-2xl lg:flex xl:w-[50%]">
        <div className="-mt-20 flex w-full max-w-105 flex-col items-center justify-center">
          <Image
            src="/food_remid_logo.png"
            alt="Food Remit Logo"
            width={260}
            height={260}
            className="object-contain"
            priority
          />

          <div className="mt-8 mb-6 flex w-full items-center justify-center opacity-60">
            <div className="h-px w-12 bg-gray-400"></div>
            <span className="mx-3 text-[16px] text-green-700">🌿</span>
            <div className="h-px w-12 bg-gray-400"></div>
          </div>

          <div className="text-center">
            <h2 className="text-[22px] font-bold tracking-tight text-[#0f172a]">
              Welcome to Food Remit
            </h2>
            <p className="mx-auto mt-4 max-w-85 text-[13px] leading-relaxed font-medium text-gray-500">
              The ultimate platform for seamless global food remittances. Connect, share, and
              support with ease and reliability.
            </p>
          </div>

          <div className="mt-14 flex w-full max-w-100 items-start justify-between gap-2 px-2">
            <div className="flex w-[25%] flex-col items-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <Globe className="h-4.5 w-4.5 stroke-[1.5] text-gray-700" />
              </div>
              <span className="text-[10px] leading-tight font-bold text-gray-600">
                Global
                <br />
                Remittance
              </span>
            </div>

            <div className="flex w-[25%] flex-col items-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 stroke-[1.5] text-gray-700" />
              </div>
              <span className="text-[10px] leading-tight font-bold text-gray-600">
                Secure &<br />
                Reliable
              </span>
            </div>

            <div className="flex w-[25%] flex-col items-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <Zap className="h-4.5 w-4.5 stroke-[1.5] text-gray-700" />
              </div>
              <span className="text-[10px] leading-tight font-bold text-gray-600">
                Fast &<br />
                Efficient
              </span>
            </div>

            <div className="flex w-[25%] flex-col items-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <Users className="h-4.5 w-4.5 stroke-[1.5] text-gray-700" />
              </div>
              <span className="text-[10px] leading-tight font-bold text-gray-600">
                Connect &<br />
                Support
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex w-full flex-col items-center justify-center px-4 py-12 lg:w-[55%] xl:w-[50%]">
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-full rounded-l-[120px] bg-white shadow-2xl lg:block xl:rounded-l-[60px]"></div>

        <div className="absolute inset-0 -z-10 block bg-white lg:hidden"></div>

        <div className="absolute top-[-10%] right-[-10%] -z-10 h-96 w-96 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-[#1B3A8C]/5 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] -z-10 h-96 w-96 animate-[pulse_10s_ease-in-out_infinite_reverse] rounded-full bg-[#2ba641]/5 blur-[80px]"></div>

        <div className="z-10 flex w-full justify-center perspective-[1000px]">
          <div className="flex w-full transform-gpu justify-center transition-all duration-700 ease-out">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
