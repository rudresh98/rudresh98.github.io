"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  House,
  UserRound,
  Cpu,
  Briefcase,
  FolderKanban,
  GraduationCap,
  BadgeCheck,
  Mail,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { routes } from "@/data/nav";

const ICONS = {
  House,
  UserRound,
  Cpu,
  Briefcase,
  FolderKanban,
  GraduationCap,
  BadgeCheck,
  Mail,
};

// Bottom-of-page guided flow: previous / next section as glass cards.
// Gives every single-section page a clear "what's next" CTA and ties the
// multi-page portfolio into one linear narrative.
export default function SectionPager() {
  const pathname = usePathname();
  const idx = routes.findIndex((r) => r.href === pathname);
  if (idx === -1) return null; // unknown route (e.g. 404) — render nothing

  const prev = idx > 0 ? routes[idx - 1] : null;
  const next = idx < routes.length - 1 ? routes[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="mx-auto w-full max-w-6xl px-6 pb-4"
    >
      <div className="grid grid-cols-1 gap-4 border-t border-hairline pt-12 sm:grid-cols-2">
        {prev ? (
          <PagerCard route={prev} dir="prev" />
        ) : (
          <span className="hidden sm:block" aria-hidden />
        )}
        {next ? (
          <PagerCard route={next} dir="next" />
        ) : (
          <span className="hidden sm:block" aria-hidden />
        )}
      </div>
    </nav>
  );
}

function PagerCard({ route, dir }) {
  const Icon = ICONS[route.icon] || House;
  const isNext = dir === "next";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={route.href}
        className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-hairline bg-[var(--glass)] p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent-line hover:shadow-[0_24px_60px_-20px_var(--glow)] ${
          isNext ? "sm:flex-row-reverse sm:text-right" : ""
        }`}
      >
        {/* hover glow wash, anchored toward the travel direction */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "var(--accent-tint)",
            [isNext ? "right" : "left"]: "-2.5rem",
          }}
        />
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent-line bg-accent-tint text-accent transition-transform duration-300 group-hover:scale-110">
          <Icon size={20} strokeWidth={2} />
        </span>
        <span
          className={`flex min-w-0 flex-1 flex-col ${
            isNext ? "sm:items-end" : ""
          }`}
        >
          <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
            {!isNext && (
              <ArrowLeft
                size={12}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            )}
            {isNext ? "Next" : "Previous"}
            {isNext && (
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            )}
          </span>
          <span className="mt-1 truncate font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
            {route.label}
          </span>
          <span className="truncate text-sm text-ink-soft">{route.desc}</span>
        </span>
      </Link>
    </motion.div>
  );
}
