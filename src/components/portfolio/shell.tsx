import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { MotionConfig, motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  ArrowUp,
  Download,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import resume from "@/assets/rudresh-oza-resume.pdf";
import { profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Expertise", to: "/expertise" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Certifications", to: "/certifications" },
  { label: "Training", to: "/training" },
  { label: "Contact", to: "/contact" },
] as const;
const RESUME_FILENAME = "Rudresh-Oza-Resume.pdf";
// The logo already links home, so the desktop bar leaves Home out to fit every page; the mobile menu keeps it.
const desktopNavigation = navigation.filter((n) => n.to !== "/");
// Home matches exactly; every other link stays active on nested routes such as /projects/$projectId.
const activeOptions = (to: string) => ({ exact: to === "/" });

function TalkLink({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      to="/contact"
      onClick={onClick}
      className={cn("header-cta", className)}
    >
      Let's Talk
      <span className="header-cta-icon" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  // Close the menu on any navigation, including browser back and forward.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  // The menu trigger is hidden at lg, so close the menu rather than strand focus when the desktop nav appears.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-40",
        scrolled && "header-scrolled",
      )}
    >
      <div className="header-bar container-shell flex items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="header-brand"
          aria-label="Rudresh Oza home"
        >
          <span className="monogram">
            RO<span className="text-primary">.</span>
          </span>
          <span className="header-brand-name hidden sm:inline">
            Rudresh Oza
          </span>
        </Link>
        <MotionConfig reducedMotion="user">
          {/* layoutRoot measures the indicator relative to the nav, not the scrolled page, because the header is sticky. */}
          <motion.nav
            layoutRoot
            aria-label="Main navigation"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {desktopNavigation.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={activeOptions(n.to)}
                className="header-link"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="header-nav-indicator"
                        className="header-link-indicator"
                        style={{ borderRadius: 999 }}
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.45,
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{n.label}</span>
                  </>
                )}
              </Link>
            ))}
          </motion.nav>
        </MotionConfig>
        <div className="header-actions">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden rounded-full lg:inline-flex"
          >
            <a
              href={resume}
              download={RESUME_FILENAME}
              aria-label="Download resume (PDF)"
              title="Download resume (PDF)"
            >
              <Download />
            </a>
          </Button>
          <ThemeToggle />
          <TalkLink className="hidden sm:inline-flex" />
          <MobileMenu open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Links also close on click, which covers selecting the page you are already on.
  const close = () => onOpenChange(false);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 rounded-full lg:hidden"
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </Dialog.Trigger>
      {/* Portalled to <body>: the blurred bar's backdrop-filter would otherwise contain this fixed panel. */}
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu-overlay" />
        <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
          <div className="mobile-menu-head">
            <Dialog.Title className="mobile-menu-title">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full"
                aria-label="Close menu"
              >
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile navigation">
            <ul className="grid gap-0.5">
              {navigation.map((n, i) => (
                <li
                  key={n.to}
                  className="mobile-menu-item"
                  style={{ "--i": i } as CSSProperties}
                >
                  <Link
                    to={n.to}
                    activeOptions={activeOptions(n.to)}
                    onClick={close}
                    className="mobile-menu-link"
                  >
                    {n.label}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div
            className="mobile-menu-actions mobile-menu-item"
            style={{ "--i": navigation.length } as CSSProperties}
          >
            <TalkLink onClick={close} className="flex justify-between" />
            <a
              href={resume}
              download={RESUME_FILENAME}
              className="mobile-menu-resume"
            >
              <Download aria-hidden="true" />
              Download Resume
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function SocialLinks(){return <div className="flex items-center gap-4"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin size={17}/></a><a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary"><Github size={17}/></a><a href={`mailto:${profile.email}`} aria-label="Email Rudresh" className="text-muted-foreground hover:text-primary"><Mail size={17}/></a></div>}
export function Footer(){return <footer className="border-t border-border py-9"><div className="container-shell"><div className="flex flex-wrap items-center justify-between gap-6"><Link to="/" className="flex items-center gap-3"><span className="monogram">RO.</span><div><p className="text-xs font-bold">Rudresh Oza</p><p className="mt-1 text-[10px] text-muted-foreground">Forward Deployed Engineer (FDE) | Cloud & GenAI</p></div></Link><SocialLinks/><Button variant="ghost" size="icon" aria-label="Back to top" title="Back to top" onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ArrowUp/></Button></div><div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-border pt-5 text-[10px] text-muted-foreground"><p>© {new Date().getFullYear()} Rudresh Oza</p><p>Building thoughtful software, intelligent systems, and scalable digital products.</p></div></div></footer>}
