"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/profile";
import { navLinks } from "@/data/socials";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // condense the pill once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy via IntersectionObserver
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // lock body scroll while the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <nav
        className={`relative z-10 mx-auto flex w-full max-w-fit items-center gap-1 rounded-full border border-hairline bg-[var(--glass)] px-2 py-2 shadow-[0_1px_2px_rgb(var(--shadow-color)/0.05),0_16px_40px_rgb(var(--shadow-color)/0.08)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
          scrolled ? "mt-2" : "mt-4"
        }`}
      >
        <a
          href="#top"
          className="px-3 font-[var(--font-space-grotesk)] text-xl leading-none text-ink"
          style={{ fontFamily: "var(--font-greatvibes), cursive" }}
          aria-label="Back to top"
        >
          {profile.initials}
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`relative rounded-full px-3.5 py-1.5 font-display text-sm font-medium transition-colors duration-300 ${
                  active === l.id
                    ? "text-accent"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-accent-tint"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* mobile controls */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full text-ink"
          >
            <span className="relative block h-4 w-5">
              <motion.span
                className="absolute left-0 top-1 block h-0.5 w-5 bg-current"
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              />
              <motion.span
                className="absolute bottom-1 left-0 block h-0.5 w-5 bg-current"
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile full-screen glass overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-0 flex flex-col items-center justify-center gap-2 bg-[var(--glass)] backdrop-blur-2xl md:hidden"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  delay: 0.06 + i * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display text-3xl font-semibold tracking-tight text-ink transition-colors hover:text-accent"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
