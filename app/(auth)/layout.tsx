import { APP_ASSETS } from "@/config/assets.config";
import { ROUTES } from "@/config/routes";
import { AUTH_FEATURES } from "@/constants/auth.constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="brand-mesh-canvas relative flex min-h-screen w-full overflow-y-auto">
      <div className="pointer-events-none absolute -top-40 -left-40 h-125 w-125 rounded-full bg-linear-to-br from-emerald-500/10 to-teal-500/0 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-linear-to-tl from-emerald-600/10 to-transparent blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-96 w-96 opacity-40">
        <Image
          src="/login_background_image.png"
          alt="Food Decor"
          fill
          sizes="(max-width: 1024px) 0px, 400px"
          priority
          className="object-contain object-bottom-left"
        />
      </div>

      <div className="relative z-10 hidden min-h-screen w-1/2 flex-col items-center justify-center px-12 lg:flex">
        <div className="flex max-w-md flex-col items-center">
          <Link href={ROUTES.ROOT} className="transition-transform duration-200 hover:scale-105">
            <Image
              src={APP_ASSETS.LOGO.PATH}
              alt={APP_ASSETS.LOGO.ALT}
              width={250}
              height={250}
              priority
              className="h-auto w-auto drop-shadow-sm"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <div className="my-8 flex items-center">
            <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
            <span className="mx-3 text-emerald-600">🌿</span>
            <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
          </div>

          <h2 className="text-center text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Welcome to Food Remit
          </h2>

          <p className="mt-4 text-center text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
            The premier platform for seamless global food remittances. Connect, share and support
            with effortless reliability.
          </p>

          <div className="mt-12 grid w-full grid-cols-4 gap-4">
            {AUTH_FEATURES.map(({ icon: Icon, title }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/80 shadow-md shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                  <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <span className="text-[11px] leading-tight font-semibold text-slate-600 dark:text-slate-400">
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

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-8 lg:w-1/2 lg:px-12">
        {children}
      </div>
    </main>
  );
}
