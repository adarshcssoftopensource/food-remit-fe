import Image from "next/image";
import React from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full bg-[#f8fafc]">
      <div className="relative z-20 hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-[#f4f7fb] p-12 lg:flex">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1B3A8C]/8 blur-[70px]"></div>
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#2ba641]/8 blur-[70px]"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            src="/food_remid_logo.png"
            alt="Food Remit Logo"
            width={400}
            height={400}
            className="object-contain drop-shadow-xl"
            priority
          />

          <div className="mt-12 max-w-sm text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#131b4d]">
              Welcome to Food Remit
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed font-medium text-gray-600">
              The ultimate platform for seamless global food remittances. Connect, share, and
              support with ease and reliability.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 lg:w-1/2">
        <div className="absolute top-[-10%] right-[-10%] h-150 w-150 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-[#1B3A8C]/8 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] h-150 w-150 animate-[pulse_10s_ease-in-out_infinite_reverse] rounded-full"></div>
        <div className="z-10 flex w-full justify-center perspective-[1000px]">
          <div className="flex w-full transform-gpu justify-center transition-all duration-700 ease-out">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
