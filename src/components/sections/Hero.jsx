"use client";

import { motion } from "framer-motion";
import { ArrowDown, DownloadSimple, ArrowRight } from "@phosphor-icons/react";
import { profile } from "@/data/profile";
import MagneticButton from "@/components/ui/MagneticButton";

const rise = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.1 },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* ambient mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 50% at 18% 22%, var(--accent-tint), transparent 70%), radial-gradient(45% 45% at 85% 12%, oklch(0.6 0.08 250 / 0.10), transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-28">
        <motion.span
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-tint px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          GenAI · Full-Stack Engineer
        </motion.span>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-7 max-w-[16ch] font-display text-[clamp(2.7rem,8vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] text-balance text-ink"
        >
          {profile.heroLine}
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-7 max-w-[58ch] text-lg text-ink-soft sm:text-xl"
        >
          {profile.heroSub}
        </motion.p>

        <motion.div
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <MagneticButton
            href={profile.resume}
            download="Rudresh-Oza-Resume.pdf"
            Icon={DownloadSimple}
          >
            Download résumé
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost" Icon={ArrowRight}>
            Get in touch
          </MagneticButton>
        </motion.div>

        <motion.div
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-14 flex items-center gap-3 text-sm text-ink-faint"
        >
          <ArrowDown size={16} className="animate-bounce" />
          <span className="font-mono">
            {profile.yearsExperience}+ years · based in {profile.location}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
