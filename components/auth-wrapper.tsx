import Image from "next/image";
import React from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full">
      <div className="bg-primary/5 relative hidden w-1/2 flex-col items-center justify-center overflow-hidden p-12 md:flex">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            src="/food_remid_logo.png"
            alt="Food Remit Logo"
            width={400}
            height={400}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center py-12 md:w-1/2">
        {children}
      </div>
    </main>
  );
}
