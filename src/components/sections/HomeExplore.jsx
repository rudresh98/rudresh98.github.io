"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserRound,
  Cpu,
  Briefcase,
  FolderKanban,
  GraduationCap,
  BadgeCheck,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import SectionHeading from "@/components/ui/SectionHeading";
import { routes } from "@/data/nav";

const ICONS = {
  UserRound,
  Cpu,
  Briefcase,
  FolderKanban,
  GraduationCap,
  BadgeCheck,
  Mail,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomeExplore() {
  const cards = routes.filter((r) => r.href !== "/");

  return (
    <section className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Explore" title="Everything, one click away." />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((r) => {
            const Icon = ICONS[r.icon] || UserRound;
            return (
              <motion.div key={r.href} variants={item}>
                <Link href={r.href} className="group block h-full">
                  <Card className="relative h-full gap-0 overflow-hidden border-hairline bg-[var(--glass)] py-0 backdrop-blur-xl transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-accent-line group-hover:shadow-[0_24px_60px_-20px_var(--glow)]">
                    {/* hover glow wash */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "var(--accent-tint)" }}
                    />
                    <div className="flex h-full flex-col gap-4 p-6">
                      <div className="flex items-center justify-between">
                        <span className="grid size-11 place-items-center rounded-xl border border-accent-line bg-accent-tint text-accent">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <ArrowUpRight
                          size={18}
                          className="text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                          {r.label}
                        </h3>
                        <p className="mt-1 text-sm text-ink-soft">{r.desc}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
