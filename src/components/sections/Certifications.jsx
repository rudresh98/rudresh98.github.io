import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { certifications } from "@/data/certifications";

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Credentials" title="Certifications." />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.07}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bezel group block h-full"
              >
                <div className="bezel-core flex h-full flex-col overflow-hidden">
                  <div className="overflow-hidden bg-panel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={`${c.title} certificate`}
                      loading="lazy"
                      className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="w-fit rounded-md bg-accent-tint px-2 py-0.5 font-mono text-[0.68rem] text-accent-strong dark:text-accent">
                      {c.provider}
                    </span>
                    <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-ink">
                      {c.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {c.note}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-accent">
                      View certificate
                      <ArrowUpRight
                        size={15}
                        weight="bold"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
