"use client";

import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function GlobalNotFound() {
  const router = useRouter();

  return (
    <div className="bg-background flex min-h-[80vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="bg-primary/10 text-primary mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-sm">
        <SearchX className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Page Not Found
      </h1>

      <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted,
        or perhaps the URL is incorrect.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex h-11 items-center gap-2 rounded-xl px-6 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button
          asChild
          className="flex h-11 items-center gap-2 rounded-xl px-6 font-semibold shadow-md transition-transform hover:-translate-y-0.5"
        >
          <Link href={ROUTES.ADMIN.DASHBOARD}>Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
