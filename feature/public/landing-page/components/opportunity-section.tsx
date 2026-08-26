import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type OpportunitySectionProps = {
  data: LandingPageContent["opportunity"];
};

export function OpportunitySection({ data }: OpportunitySectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#f8faf8] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ea580c] uppercase">
            {data.title}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.subtitle}
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {data.stories.map((story) => (
            <article key={story.from} className="border-l-2 border-[#f97316] pl-5">
              <p className="text-sm font-semibold tracking-wide text-[#ea580c] uppercase">
                One customer in {story.from}
              </p>
              <p className="mt-3 text-lg font-medium text-slate-900">{story.habit}</p>
              <p className="mt-1 text-base text-slate-600">For {story.for}.</p>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-xl text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          {data.closing}
        </p>
      </div>
    </section>
  );
}
