"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, DownloadSimple, ArrowRight } from "@phosphor-icons/react";
import { profile } from "@/data/profile";
import MagneticButton from "@/components/ui/MagneticButton";

// WebGL scene loads only in the browser (uses window/WebGL).
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const rise = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.1 },
  }),
};

// Static fallback shown until 3D is enabled (or when it shouldn't run).
function OrbFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className="size-[min(70vw,30rem)] rounded-full opacity-80 blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, var(--accent), transparent 60%), radial-gradient(circle at 70% 70%, var(--accent-2), transparent 55%)",
        }}
      />
    </div>
  );
}

export default function Hero() {
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData;
    const tiny = window.matchMedia("(max-width: 380px)").matches;
    if (!reduced && !saveData && !tiny) setEnable3d(true);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* 3D / fallback layer — right-biased on desktop, full bleed on mobile */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 sm:opacity-100 lg:left-[38%]"
      >
        {enable3d ? <HeroScene /> : <OrbFallback />}
      </div>

      {/* legibility wash behind the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-canvas via-canvas/70 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-28">
        <motion.span
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-tint px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          GenAI · Full-Stack Engineer
        </motion.span>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-7 max-w-[17ch] font-display text-[clamp(2.7rem,8vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] text-balance"
        >
          <span className="text-ink">I build </span>
          <span className="glow-text bg-gradient-to-br from-accent via-accent to-accent-2 bg-clip-text text-transparent">
            GenAI products
          </span>
          <span className="text-ink"> and the full-stack systems they run on.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-7 max-w-[54ch] text-lg text-ink-soft sm:text-xl"
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

        {/* quick-fact strip */}
        <motion.dl
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
        >
          {[
            { k: `${profile.yearsExperience}+`, v: "years shipping" },
            { k: "MERN / MEAN", v: "full-stack" },
            { k: "LLM · RAG · agents", v: "in production" },
          ].map((s) => (
            <div key={s.v}>
              <dt className="font-display text-2xl font-bold tracking-tight text-ink">
                {s.k}
              </dt>
              <dd className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                {s.v}
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          custom={5}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-14 flex items-center gap-3 text-sm text-ink-faint"
        >
          <ArrowDown size={16} className="animate-bounce" />
          <span className="font-mono">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}
