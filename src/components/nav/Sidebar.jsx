"use client";

import { Fragment, useState } from "react";
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
  PanelLeft,
  ChevronRight,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useSidebar } from "@/components/providers/SidebarProvider";
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

function NavLinks({ onNavigate, collapsed }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {routes.map((r) => {
        const Icon = ICONS[r.icon] || House;
        const active = pathname === r.href;

        const link = (
          <Link
            href={r.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            aria-label={collapsed ? r.label : undefined}
            className={`group relative flex items-center rounded-xl transition-colors duration-300 ${
              collapsed ? "justify-center p-1.5" : "gap-3 py-1.5 pl-2 pr-3"
            } ${
              active
                ? "text-accent"
                : "text-ink-soft hover:bg-panel hover:text-ink"
            }`}
          >
            {/* sliding active accent bar (desktop expanded only) */}
            {active && !collapsed && (
              <motion.span
                layoutId="sidebar-bar"
                className="absolute -left-2 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}

            {/* icon chip — fills with accent when active */}
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
                active
                  ? "border-transparent bg-accent text-accent-contrast shadow-[0_0_16px_var(--glow)]"
                  : "border-hairline bg-panel text-ink-soft group-hover:border-accent-line group-hover:text-accent"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
            </span>

            {!collapsed && (
              <>
                <span className="flex-1 truncate text-sm font-medium">
                  {r.label}
                </span>
                <ChevronRight
                  size={15}
                  className={`shrink-0 transition-all duration-300 ${
                    active
                      ? "text-accent opacity-100"
                      : "-translate-x-1 text-ink-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </>
            )}
          </Link>
        );

        if (collapsed) {
          return (
            <Tooltip key={r.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="font-medium">
                {r.label}
              </TooltipContent>
            </Tooltip>
          );
        }

        return <Fragment key={r.href}>{link}</Fragment>;
      })}
    </nav>
  );
}

function Brand({ collapsed }) {
  return (
    <Link
      href="/"
      aria-label={profile.name}
      className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
    >
      <span className="relative shrink-0">
        <Avatar className="size-11 rounded-2xl border border-hairline-strong shadow-[0_0_22px_var(--glow)]">
          <AvatarImage
            src="/profile-formal.jpg"
            alt={profile.name}
            className="object-cover"
          />
          <AvatarFallback
            className="rounded-2xl bg-accent-tint font-display font-bold text-accent"
          >
            {profile.initials}
          </AvatarFallback>
        </Avatar>
        {/* online / available dot */}
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-canvas" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-bold tracking-tight text-ink">
            {profile.name}
          </span>
          <span className="block truncate font-mono text-[0.66rem] uppercase tracking-wider text-ink-faint">
            {profile.role}
          </span>
        </span>
      )}
    </Link>
  );
}

function StatusChip() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-panel px-3 py-2.5">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-soft">
        Available for work
      </span>
    </div>
  );
}

function SidebarFooter({ collapsed }) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={profile.resume}
              download="Rudresh-Oza-Resume.pdf"
              aria-label="Download résumé"
              className="grid size-11 place-items-center rounded-xl bg-ink text-canvas transition-colors duration-300 hover:bg-accent hover:text-accent-contrast"
            >
              <Download size={17} />
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10} className="font-medium">
            Résumé
          </TooltipContent>
        </Tooltip>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        asChild
        className="w-full bg-ink font-medium text-canvas transition-colors hover:bg-accent hover:text-accent-contrast"
      >
        <a href={profile.resume} download="Rudresh-Oza-Resume.pdf">
          <Download size={16} />
          Download résumé
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
// `collapsed` only applies to the desktop rail; `onToggle` renders the
// collapse control (omitted in the mobile drawer).
function SidebarBody({ onNavigate, collapsed = false, onToggle }) {
  return (
    <div
      className={`flex h-full flex-col transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        collapsed ? "gap-5 p-3" : "gap-6 p-5"
      }`}
    >
      {/* header */}
      <div
        className={`flex ${
          collapsed
            ? "flex-col items-center gap-3"
            : "items-center justify-between gap-2"
        }`}
      >
        <Brand collapsed={collapsed} />
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors duration-300 hover:bg-accent-tint hover:text-accent"
          >
            <PanelLeft
              size={18}
              className={`transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {!collapsed && <StatusChip />}

      <div className="h-px bg-hairline" />

      {/* nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="mb-3 pl-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ink-faint">
            Navigate
          </p>
        )}
        <NavLinks onNavigate={onNavigate} collapsed={collapsed} />
      </div>

      <div className="h-px bg-hairline" />

      <SidebarFooter collapsed={collapsed} />
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { collapsed, toggle } = useSidebar();

  return (
    <>
      {/* desktop rail — collapsible */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden overflow-x-hidden border-r border-hairline bg-[var(--glass)] backdrop-blur-xl backdrop-saturate-150 transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:block ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* faint top sheen for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-tint/40 to-transparent"
        />
        <SidebarBody collapsed={collapsed} onToggle={toggle} />
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
