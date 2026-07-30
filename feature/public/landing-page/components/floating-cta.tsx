"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const join = document.getElementById("join");
      const joinTop = join?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const pastHero = window.scrollY > window.innerHeight * 0.7;
      const nearJoin = joinTop < window.innerHeight * 0.85;
      setVisible(pastHero && !nearJoin);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 transition-all duration-300 sm:bottom-8",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      <a
        href="#join"
        className={cn(
          buttonVariants(),
          "h-12 rounded-full bg-[#166534] px-6 text-white shadow-lg shadow-green-900/20 hover:bg-[#14532d]",
          visible ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        Become a Vendor Partner
        <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}
