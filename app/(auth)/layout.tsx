import { ROUTES } from "@/config/routes";
import { AUTH_FEATURES } from "@/constants/auth.constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-white lg:bg-linear-to-br lg:from-[#f4f9f7] lg:to-[#e6f4ea]">
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-100 w-100 sm:h-100 sm:w-100 md:h-100 md:w-100 lg:h-100 lg:w-100">
        <Image
          src="/login_background_image.png"
          alt="Food Decor"
          fill
          sizes="(max-width: 1024px) 0px, 400px"
          priority
          className="object-contain object-bottom-left"
        />
      </div>

      <div className="relative z-10 hidden h-full w-1/2 flex-col items-center justify-center px-12 lg:flex">
        <div className="flex max-w-md flex-col items-center">
          <Link href={ROUTES.ROOT}>
            <Image
              src="/food_remid_logo.png"
              alt="Food Remit"
              width={250}
              height={250}
              priority
              className="h-auto w-auto"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
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

      <div className="relative h-full w-full overflow-y-auto lg:w-1/2">
        <div className="fixed inset-y-0 right-0 hidden w-1/2 rounded-l-[60px] bg-white lg:block" />
        <div className="relative z-10 flex min-h-full w-full items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          {children}
        </div>
      </div>
    </main>
  );
}
