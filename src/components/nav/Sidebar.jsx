"use client";

import { useState } from "react";
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
  Menu,
  Download,
} from "lucide-react";
import {
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  Stack,
} from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { routes } from "@/data/nav";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

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

const SOCIAL_ICONS = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
  instagram: InstagramLogo,
  stackoverflow: Stack,
};

function NavLinks({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {routes.map((r) => {
        const Icon = ICONS[r.icon] || House;
        const active = pathname === r.href;
        return (
          <Link
            key={r.href}
            href={r.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 ${
              active
                ? "text-accent"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 -z-10 rounded-xl border border-accent-line bg-accent-tint"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <Icon
              size={18}
              strokeWidth={active ? 2.4 : 1.9}
              className="shrink-0 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="flex-1">{r.label}</span>
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {r.desc}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span
        className="grid size-11 place-items-center rounded-2xl border border-accent-line bg-accent-tint text-2xl leading-none text-accent shadow-[0_0_22px_var(--glow)]"
        style={{ fontFamily: "var(--font-greatvibes), cursive" }}
      >
        {profile.initials}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-sm font-bold tracking-tight text-ink">
          {profile.name}
        </span>
        <span className="block truncate font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
          {profile.role}
        </span>
      </span>
    </Link>
  );
}

function SidebarFooter() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        asChild
        className="w-full bg-ink text-canvas hover:bg-accent hover:text-accent-contrast"
      >
        <a href={profile.resume} download="Rudresh-Oza-Resume.pdf">
          <Download size={16} />
          Résumé
        </a>
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.icon] || Stack;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-lg text-ink-soft transition-colors duration-300 hover:bg-accent-tint hover:text-accent"
              >
                <Icon size={17} weight="bold" />
              </a>
            );
          })}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}

// Shared inner content for both desktop rail and mobile drawer.
function SidebarBody({ onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Brand />
      <div className="flex-1 overflow-y-auto">
        <p className="mb-3 px-3.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
          Navigate
        </p>
        <NavLinks onNavigate={onNavigate} />
      </div>
      <SidebarFooter />
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-hairline bg-[var(--glass)] backdrop-blur-xl backdrop-saturate-150 md:block">
        <SidebarBody />
      </aside>

      {/* mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-hairline bg-[var(--glass)] px-4 py-3 backdrop-blur-xl backdrop-saturate-150 md:hidden">
        <Brand />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-hairline bg-canvas p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
