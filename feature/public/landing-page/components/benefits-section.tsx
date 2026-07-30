import { BadgeCheck, Package, ShieldCheck, Store, TrendingUp, Users } from "lucide-react";

import { VENDOR_LOVES } from "../../../../constants/landing.constants";

const ICONS = [Users, TrendingUp, ShieldCheck, Package, Store] as const;

export function BenefitsSection() {
  return (
    <section id="benefits" className="scroll-mt-24 bg-[#052e16] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#fdba74] uppercase">
            Why Vendors Love Food Remit
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built to grow your business—without changing how you operate
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VENDOR_LOVES.map((item, index) => {
            const Icon = ICONS[index] ?? BadgeCheck;
            return (
              <div key={item.title} className="border-t border-white/15 pt-6">
                <Icon className="size-6 text-[#fb923c]" strokeWidth={1.75} />
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
