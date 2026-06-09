import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Stack" title="What I work with." />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.08}>
              <div className="bezel h-full">
                <div className="bezel-core flex h-full flex-col gap-4 p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {group.label}
                    </h3>
                    <span className="font-mono text-xs text-ink-faint">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="cursor-default rounded-lg border border-hairline bg-panel px-3 py-1.5 text-sm text-ink-soft transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:text-accent"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
