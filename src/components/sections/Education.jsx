import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { education } from "@/data/education";

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Education" title="Where I learned the fundamentals." />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.08}>
              <div className="bezel h-full">
                <div className="bezel-core flex h-full flex-col gap-3 p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent-tint text-accent">
                    <GraduationCap size={20} weight="bold" />
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight text-ink">
                    {e.degree}
                  </h3>
                  <p className="text-sm font-medium text-ink-soft">{e.school}</p>
                  <p className="font-mono text-xs text-ink-faint">
                    {e.location} · {e.years}
                  </p>
                  <p className="mt-auto pt-2 text-sm leading-relaxed text-ink-soft">
                    {e.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
