import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

type DifferentSectionProps = {
  data: LandingPageContent["different"];
};

export function DifferentSection({ data }: DifferentSectionProps) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#166534] uppercase">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {data.items.map((item) => (
            <div key={item.unlike}>
              <p className="text-sm font-medium text-slate-500">{item.unlike}</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                {item.point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
