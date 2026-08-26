import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type HowItWorksSectionProps = {
  data: LandingPageContent["howItWorks"];
};

export function HowItWorksSection({ data }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ea580c] uppercase">
            {data.title}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.subtitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            {data.description}
          </p>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {data.steps.map((item, index) => (
            <li key={`${item.step}-${item.title}`} className="relative">
              {index < data.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-5 left-[calc(100%-0.25rem)] hidden h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-[#166534]/30 to-transparent lg:block"
                />
              )}
              <div className="flex size-10 items-center justify-center rounded-full bg-[#166534] text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
