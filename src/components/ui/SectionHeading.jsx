import Reveal from "@/components/ui/Reveal";

// Eyebrow + display heading. Used sparingly (not on every section).
export default function SectionHeading({ eyebrow, title, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <Reveal
          as="span"
          className="mb-5 inline-block rounded-full border border-accent-line bg-accent-tint px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent"
        >
          {eyebrow}
        </Reveal>
      )}
      <Reveal
        as="h2"
        delay={0.05}
        className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-balance text-ink"
      >
        {title}
      </Reveal>
      <Reveal
        delay={0.12}
        className={`mt-5 h-px w-28 origin-left bg-gradient-to-r from-accent via-accent-2 to-transparent ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
