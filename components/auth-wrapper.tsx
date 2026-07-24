import Image from "next/image";
import React from "react";
import { Globe, LucideIcon, ShieldCheck, Users, Zap } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
};

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const AUTH_FEATURES: Feature[] = [
    {
      icon: Globe,
      title: "Global Remittance",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
    },
    {
      icon: Users,
      title: "Connect & Support",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white lg:bg-linear-to-br lg:from-[#f4f9f7] lg:to-[#e6f4ea]">
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-[48vh] lg:w-[38vw]">
        <Image
          src="/login_background_image.png"
          alt="Food Decor"
          fill
          priority
          className="object-contain object-bottom-left"
        />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative z-10 hidden items-center justify-center px-12 lg:flex">
          <div className="flex max-w-md flex-col items-center">
            <Image src="/food_remid_logo.png" alt="Food Remit" width={250} height={250} priority />

            <div className="my-8 flex items-center">
              <div className="h-px w-12 bg-gray-300" />
              <span className="mx-3 text-green-700">🌿</span>
              <div className="h-px w-12 bg-gray-300" />
            </div>

            <h2 className="text-center text-4xl font-bold text-[#0f172a]">Welcome to Food Remit</h2>

            <p className="mt-5 text-center text-[15px] leading-7 text-gray-500">
              The ultimate platform for seamless global food remittances. Connect, share and support
              with ease and reliability.
            </p>

            <div className="mt-16 grid w-full grid-cols-4 gap-6">
              {AUTH_FEATURES.map(({ icon: Icon, title }) => (
                <div key={title} className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>

                  <span className="text-[11px] leading-tight font-semibold text-gray-600">
                    {title.split(" & ").map((text, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <>
                            {" "}
                            &
                            <br />
                          </>
                        )}
                        {text}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
          <div className="absolute inset-y-0 right-0 hidden w-full max-w-225 rounded-l-[60px] bg-white lg:block" />
          <div className="relative z-10 flex w-full justify-center">{children}</div>
        </div>
      </div>
    </main>
  );
}
