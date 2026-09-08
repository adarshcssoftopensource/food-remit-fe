import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type StatsSectionProps = {
  data: LandingPageContent["stats"];
};

export function StatsSection({ data }: StatsSectionProps) {
  return (
    <section className="bg-[#166534] py-14 text-white sm:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4">
        {data.items.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-white/75">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
