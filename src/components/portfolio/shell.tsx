import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowUp,
  Download,
  Github,
  Heart,
  Linkedin,
  Mail,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import resume from "@/assets/rudresh-oza-resume.pdf";
import { profile } from "@/lib/portfolio";
import { prefersReducedMotion } from "@/lib/accessibility";
import { utilityPages } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { AccountMenu } from "./account-menu";
import { useCommandPalette, useShortcutLabel } from "./command-palette";
const RESUME_FILENAME = "Rudresh-Oza-Resume.pdf";

export function TalkLink({
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

function SearchTrigger() {
  const { setOpen } = useCommandPalette();
  const shortcut = useShortcutLabel();
  return (
    <button
      type="button"
      className="header-search"
      onClick={() => setOpen(true)}
      aria-label="Search the site"
      aria-keyshortcuts="Meta+K Control+K"
    >
      <Search aria-hidden="true" />
      <span className="header-search-label">Search</span>
      <kbd aria-hidden="true">{shortcut}</kbd>
    </button>
  );
}

// Page links live in the bottom dock; the top bar keeps identity, search, and quick actions.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-40",
        scrolled && "header-scrolled",
      )}
    >
      <div className="header-bar container-shell flex items-center justify-between gap-3">
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
        <div className="header-actions">
          <SearchTrigger />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden rounded-full sm:inline-flex"
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
          <AccountMenu />
          <TalkLink className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-muted-foreground hover:text-primary"
      >
        <Linkedin size={17} />
      </a>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="text-muted-foreground hover:text-primary"
      >
        <Github size={17} />
      </a>
      <a
        href={`mailto:${profile.email}`}
        aria-label="Email Rudresh"
        className="text-muted-foreground hover:text-primary"
      >
        <Mail size={17} />
      </a>
    </div>
  );
}
export function Footer() {
  return (
    <footer className="border-t border-border py-9">
      <div className="container-shell">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="monogram">RO.</span>
            <div>
              <p className="text-xs font-bold">Rudresh Oza</p>
              <p className="mt-1 text-[0.625rem] text-muted-foreground">
                Forward Deployed Engineer (FDE) | Cloud & GenAI
              </p>
            </div>
          </Link>
          <SocialLinks />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to top"
            title="Back to top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? "instant" : "smooth",
              })
            }
          >
            <ArrowUp />
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-border pt-5 text-[0.625rem] text-muted-foreground">
          <p>© {new Date().getFullYear()} Rudresh Oza</p>
          {utilityPages.map((page) => (
            <p key={page.to}>
              <Link to={page.to}>{page.label}</Link>
            </p>
          ))}
          <p className="flex items-center gap-1">
            Made with
            <Heart
              size={11}
              className="fill-primary text-primary"
              aria-hidden="true"
            />
            <span className="sr-only">love</span> in India
          </p>
          <p>
            Building thoughtful software, intelligent systems, and scalable
            digital products.
          </p>
        </div>
      </div>
    </footer>
  );
}
