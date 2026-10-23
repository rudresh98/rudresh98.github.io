import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react";
import { Share2, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  fanPositions,
  homeShare,
  shareLinkFor,
  shareTargets,
  type ShareTarget,
} from "@/lib/share";
import { shareIcons } from "@/lib/share-icons";

// Wide enough that neighbouring 44px bubbles keep a visible gap along the quarter arc.
// Every link has the same targets, so the fan is laid out once.
const positions = fanPositions(shareTargets(homeShare).length, 168);
const origin = { x: 0, y: 0 };
// folder-preview's Rudras spring, so the bubbles pop out the same way its previews do.
const spring = { type: "spring", stiffness: 200, damping: 15 } as const;

export function ShareLauncher({ pathname = "/" }: { pathname?: string }) {
  const link = shareLinkFor(pathname);
  const targets = shareTargets(link);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const reduced = useReducedMotionConfig();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  // The link only reaches Instagram once pasted, so say exactly that.
  const copyLink = async (target: ShareTarget) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setStatus(`Link copied. Paste it in an ${target.label} chat.`);
    } catch {
      setStatus(`Copy this link: ${link.url}`);
    }
  };
  const choose = (target: ShareTarget) => {
    setOpen(false);
    if (target.copyFirst) void copyLink(target);
  };

  return (
    <TooltipProvider delayDuration={80}>
      <div ref={root} className="share-launcher">
        <button
          ref={trigger}
          type="button"
          className="share-trigger"
          aria-label={link.label}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          <motion.span
            className="share-trigger-icon"
            animate={{ rotate: open && !reduced ? 90 : 0 }}
            transition={reduced ? { duration: 0 } : spring}
          >
            {open ? <X aria-hidden="true" /> : <Share2 aria-hidden="true" />}
          </motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              key="targets"
              id={listId}
              className="share-targets"
              aria-label="Share on"
            >
              {targets.map((target, i) => {
                const { x, y } = positions[i] ?? origin;
                const glyph = shareIcons[target.id];
                const hidden = reduced
                  ? { opacity: 0, scale: 1, x, y }
                  : { opacity: 0, scale: 0, x: 0, y: 0 };
                return (
                  <motion.li
                    key={target.id}
                    className="share-target"
                    initial={hidden}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    exit={{
                      ...hidden,
                      transition: { duration: reduced ? 0 : 0.18 },
                    }}
                    transition={
                      reduced ? { duration: 0 } : { ...spring, delay: i * 0.04 }
                    }
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={target.href}
                          aria-label={target.label}
                          className="share-bubble"
                          data-target={target.id}
                          {...(target.external && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                          onClick={() => choose(target)}
                        >
                          <svg viewBox={glyph.viewBox} aria-hidden="true">
                            <path d={glyph.path} />
                          </svg>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        sideOffset={8}
                        className="dock-tooltip"
                      >
                        {target.label}
                      </TooltipContent>
                    </Tooltip>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
        <p
          role="status"
          className="share-status"
          data-visible={status ? "" : undefined}
        >
          {status}
        </p>
      </div>
    </TooltipProvider>
  );
}
