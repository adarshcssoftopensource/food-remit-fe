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

type TestimonialsSectionProps = {
  data: LandingPageContent["testimonials"];
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ea580c] uppercase">
            {data.title}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.subtitle}
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {data.items.map((item) => (
            <blockquote key={item.name} className="flex flex-col border-t border-slate-200 pt-6">
              <p className="flex-1 text-base leading-relaxed text-slate-700">“{item.quote}”</p>
              <footer className="mt-6">
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="mt-0.5 text-sm text-slate-500">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
