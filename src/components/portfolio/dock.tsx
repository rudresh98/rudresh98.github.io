import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import resume from "@/assets/rudresh-oza-resume.pdf";
import {
  activeOptions,
  navCount,
  navigation,
  previewHref,
  type NavItem,
} from "@/lib/navigation";
import { navigationIcons } from "@/lib/navigation-icons";
import { cn } from "@/lib/utils";
import { useCommandPalette, useShortcutLabel } from "./command-palette";
import { TalkLink } from "./shell";

const RESUME_FILENAME = "Rudresh-Oza-Resume.pdf";

// A live, scaled-down render of the destination page; mounted only while its card is open.
function PagePreview({ item, current }: { item: NavItem; current: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const count = navCount(item.to);
  return (
    <div className="dock-preview" aria-hidden="true">
      <div className="dock-preview-frame">
        <iframe
          src={previewHref(item.to)}
          title={`${item.label} preview`}
          className={cn("dock-preview-iframe", loaded && "is-loaded")}
          tabIndex={-1}
          loading="eager"
          sandbox="allow-same-origin allow-scripts"
          onLoad={() => setLoaded(true)}
          inert
        />
        {!loaded && <span className="dock-preview-skeleton" />}
      </div>
      <div className="dock-preview-meta">
        <div>
          <p className="dock-preview-title">
            {item.label}
            {current && <span className="dock-preview-here">You are here</span>}
          </p>
          <p className="dock-preview-summary">{item.summary}</p>
        </div>
        {count !== undefined && (
          <span className="dock-preview-count">{count}</span>
        )}
      </div>
    </div>
  );
}

// macOS-style magnification: icons grow with pointer proximity on fine pointers only.
function DockLink({
  item,
  mouseX,
  magnify,
  fine,
}: {
  item: NavItem;
  mouseX: MotionValue<number>;
  magnify: boolean;
  fine: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    return box ? x - box.x - box.width / 2 : Infinity;
  });
  const size = useSpring(useTransform(distance, [-130, 0, 130], [42, 58, 42]), {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current =
    item.to === "/"
      ? pathname === "/"
      : pathname === item.to || pathname.startsWith(`${item.to}/`);
  const Icon = navigationIcons[item.to];
  const link = (
    <Link
      ref={ref}
      to={item.to}
      activeOptions={activeOptions(item.to)}
      aria-label={item.label}
      className="dock-link"
    >
      {({ isActive }) => (
        <>
          <motion.span
            className="dock-icon"
            style={magnify ? { width: size, height: size } : {}}
          >
            <Icon aria-hidden="true" />
          </motion.span>
          {isActive && (
            <motion.span
              layoutId="dock-indicator"
              className="dock-indicator"
              aria-hidden="true"
              transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
            />
          )}
        </>
      )}
    </Link>
  );
  // Fine pointers get a live page preview; elsewhere a label tooltip still serves keyboard users.
  if (fine)
    return (
      <HoverCard openDelay={220} closeDelay={80}>
        <HoverCardTrigger asChild>{link}</HoverCardTrigger>
        <HoverCardContent
          side="top"
          sideOffset={14}
          collisionPadding={12}
          className="dock-preview-card"
        >
          <PagePreview item={item} current={current} />
        </HoverCardContent>
      </HoverCard>
    );
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={12} className="dock-tooltip">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function MoreMenu({
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
        <button
          type="button"
          className="dock-button dock-more"
          aria-label="Open menu"
        >
          <span className="dock-icon">
            <Menu aria-hidden="true" />
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu-overlay" />
        <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
          <span className="mobile-menu-handle" aria-hidden="true" />
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
            <ul className="mobile-menu-grid">
              {navigation.map((item, i) => {
                const Icon = navigationIcons[item.to];
                return (
                  <li
                    key={item.to}
                    className="mobile-menu-item"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <Link
                      to={item.to}
                      activeOptions={activeOptions(item.to)}
                      onClick={close}
                      className="mobile-menu-link"
                    >
                      <Icon aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
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

export function Dock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(Infinity);
  const [fine, setFine] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen } = useCommandPalette();
  const shortcut = useShortcutLabel();
  const magnify = fine && !reduced;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  // Tuck away while reading downward; return on any upward scroll or at the end of the page.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const atEnd =
        window.innerHeight + y >= document.documentElement.scrollHeight - 48;
      if (atEnd || y < last - 4 || y < 120) setHidden(false);
      else if (y > last + 8) setHidden(true);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Close the sheet on any navigation, including browser back and forward.
  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);
  // The More button only exists on small screens, so close the sheet rather than strand focus.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const close = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, []);

  return (
    <TooltipProvider delayDuration={80}>
      <motion.nav
        aria-label="Main navigation"
        className={cn("dock", hidden && "dock-hidden")}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onFocus={() => setHidden(false)}
      >
        <ul className="dock-list">
          {navigation.map((item) => (
            <li
              key={item.to}
              className="dock-item"
              data-secondary={item.primary ? undefined : ""}
            >
              <DockLink
                item={item}
                mouseX={mouseX}
                magnify={magnify}
                fine={fine}
              />
            </li>
          ))}
          <li className="dock-divider" aria-hidden="true" />
          <li className="dock-item">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="dock-button"
                  onClick={() => setOpen(true)}
                  aria-label="Search the site"
                  aria-keyshortcuts="Meta+K Control+K"
                >
                  <span className="dock-icon">
                    <Search aria-hidden="true" />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={12}
                className="dock-tooltip"
              >
                Search <kbd>{shortcut}</kbd>
              </TooltipContent>
            </Tooltip>
          </li>
          <li className="dock-item dock-more-item">
            <MoreMenu open={menuOpen} onOpenChange={setMenuOpen} />
          </li>
        </ul>
      </motion.nav>
    </TooltipProvider>
  );
}
