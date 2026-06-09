import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="work" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Experience" title="Six years, end to end." />

        <ol className="relative mt-14 ml-3 border-l border-hairline">
          {experience.map((job, i) => (
            <li key={job.role + i} className="relative pl-8 pb-10 last:pb-0">
              <span className="absolute -left-[7px] top-1.5 size-3.5 rounded-full border-2 border-accent bg-canvas" />
              <Reveal delay={i * 0.05}>
                <div className="bezel">
                  <div className="bezel-core flex flex-col gap-3 p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                        {job.role}
                      </h3>
                      <span className="font-mono text-xs text-ink-faint">
                        {job.location}
                      </span>
                    </div>
                    <p className="max-w-[62ch] text-ink-soft">{job.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-accent-tint px-2 py-0.5 font-mono text-[0.7rem] text-accent-strong dark:text-accent"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
