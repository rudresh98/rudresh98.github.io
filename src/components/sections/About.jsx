import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Parallax from "@/components/ui/Parallax";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow="About" title="Engineer who builds the whole product." />
          <Reveal delay={0.1} className="mt-8 max-w-[60ch] text-lg leading-relaxed text-ink-soft text-pretty">
            {profile.about}
          </Reveal>

          <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-2.5">
            {profile.focusAreas.map((f) => (
              <span
                key={f}
                className="rounded-full border border-hairline bg-panel px-3.5 py-1.5 text-sm text-ink-soft"
              >
                {f}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} y={28} className="lg:col-span-5">
          <Parallax speed={36} className="mx-auto max-w-sm">
            <div className="bezel group">
              {/* glow halo behind the portrait */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-50 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, var(--accent-tint), transparent 70%)",
                }}
              />
              <div className="bezel-core overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/profile.jpeg"
                  alt="Portrait of Rudresh Oza"
                  width={520}
                  height={620}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
