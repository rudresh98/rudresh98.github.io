import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Work" title="Things I've shipped." />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
          {projects.map((p, i) => (
            <Reveal
              key={p.title}
              delay={(i % 3) * 0.07}
              className={p.size === "wide" ? "md:col-span-4" : "md:col-span-2"}
            >
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bezel group block h-full"
              >
                <div className="bezel-core flex h-full flex-col overflow-hidden">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={`${p.title} screenshot`}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                        p.size === "wide" ? "h-64" : "h-48"
                      }`}
                    />
                    {/* scrim ties the screenshot into the dark surface */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"
                    />
                    <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-canvas/80 text-accent opacity-0 shadow-[0_0_18px_var(--glow)] backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={16} weight="bold" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {p.blurb}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {p.tech.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-8 text-center text-sm text-ink-faint">
          More on{" "}
          <a
            href="https://github.com/rudresh98"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          .
        </Reveal>
      </div>
    </section>
  );
}
