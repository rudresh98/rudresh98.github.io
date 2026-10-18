// Reading preferences are device settings, not account data: they live on <html> and in localStorage.
// Browser-safe and asset-free: the boot script, root provider, and Accessibility page all read from here.
export const A11Y_STORAGE_KEY = "portfolio-accessibility";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type TextSize = "default" | "large" | "larger";
export type AccessibilityPrefs = {
  textSize: TextSize;
  reduceMotion: boolean;
  highContrast: boolean;
  readableFont: boolean;
  underlineLinks: boolean;
};
export type AccessibilityToggle = Exclude<keyof AccessibilityPrefs, "textSize">;

export const defaultPrefs: AccessibilityPrefs = {
  textSize: "default",
  reduceMotion: false,
  highContrast: false,
  readableFont: false,
  underlineLinks: false,
};

// parsePrefs and applyPrefs also run inline before first paint (see accessibilityBootScript), so they must
// stay self-contained: no imports or module-level references inside their bodies.

// Unknown or malformed values fall back to defaults, so a stale or hand-edited entry never breaks a page.
export function parsePrefs(raw: string | null): AccessibilityPrefs {
  let value: unknown = null;
  try {
    value = raw ? JSON.parse(raw) : null;
  } catch {
    value = null;
  }
  const stored: Record<string, unknown> =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const size = stored["textSize"];
  return {
    textSize: size === "large" || size === "larger" ? size : "default",
    reduceMotion: stored["reduceMotion"] === true,
    highContrast: stored["highContrast"] === true,
    readableFont: stored["readableFont"] === true,
    underlineLinks: stored["underlineLinks"] === true,
  };
}

// data-reduce-motion is the effective setting (the visitor's choice or the OS), so CSS, MotionConfig,
// and imperative checks all read one signal.
export function applyPrefs(
  root: HTMLElement,
  prefs: AccessibilityPrefs,
  systemReducedMotion: boolean,
) {
  if (prefs.textSize === "default") root.removeAttribute("data-text-size");
  else root.setAttribute("data-text-size", prefs.textSize);
  if (prefs.highContrast) root.setAttribute("data-contrast", "more");
  else root.removeAttribute("data-contrast");
  root.toggleAttribute(
    "data-reduce-motion",
    prefs.reduceMotion || systemReducedMotion,
  );
  root.toggleAttribute("data-readable-font", prefs.readableFont);
  root.toggleAttribute("data-underline-links", prefs.underlineLinks);
}

export function readPrefs() {
  try {
    return parsePrefs(localStorage.getItem(A11Y_STORAGE_KEY));
  } catch {
    return defaultPrefs;
  }
}

export function writePrefs(prefs: AccessibilityPrefs) {
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* Settings still apply for this visit when storage is unavailable. */
  }
}

export function systemPrefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// For imperative checks outside React (theme reveal, back-to-top scroll).
export function prefersReducedMotion() {
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    systemPrefersReducedMotion()
  );
}

// Runs inline in <head> before first paint, so saved text size, contrast, and motion never shift or flash
// after hydration. It reuses parsePrefs and applyPrefs' own source, so the two paths can't drift.
export const accessibilityBootScript = `try{(${applyPrefs.toString()})(document.documentElement,(${parsePrefs.toString()})(localStorage.getItem(${JSON.stringify(A11Y_STORAGE_KEY)})),window.matchMedia(${JSON.stringify(REDUCED_MOTION_QUERY)}).matches)}catch(e){}`;

// Page copy, kept apart from presentation.
export const textSizeOptions: {
  value: TextSize;
  label: string;
  // Matches the root font-size each value sets in styles.css.
  scale: number;
}[] = [
  { value: "default", label: "Default", scale: 1 },
  { value: "large", label: "Large", scale: 1.125 },
  { value: "larger", label: "Larger", scale: 1.25 },
];

export const settingOptions: {
  key: AccessibilityToggle;
  label: string;
  description: string;
}[] = [
  {
    key: "reduceMotion",
    label: "Reduce motion",
    description:
      "Stops the spinning globe, scroll-drawn lines, the driving car, hover lifts, and theme reveal.",
  },
  {
    key: "highContrast",
    label: "High contrast",
    description:
      "Darker text, stronger borders, and solid surfaces in both light and dark themes.",
  },
  {
    key: "readableFont",
    label: "Readable font",
    description:
      "Switches to Atkinson Hyperlegible, designed for low-vision readers, with roomier spacing.",
  },
  {
    key: "underlineLinks",
    label: "Underline links",
    description:
      "Underlines links in running text so they don't rely on color alone.",
  },
];

// Only features the site actually has; no conformance claims.
export const accessibilityFeatures = [
  {
    title: "Keyboard navigation",
    detail:
      "Links, buttons, and controls are reachable with Tab and show a visible focus outline.",
  },
  {
    title: "Command palette",
    detail:
      "Press ⌘K or Ctrl+K to search and jump to any page, project, course, or certification.",
  },
  {
    title: "Your motion setting",
    detail:
      "If your device asks for reduced motion, animations stop without you changing anything here.",
  },
  {
    title: "Quiet decoration",
    detail:
      "Decorative strokes, diagrams, and icons are hidden from screen readers, and icon-only buttons have labels.",
  },
  {
    title: "Light and dark themes",
    detail:
      "Switch themes from the header or the command palette; your choice is remembered on this device.",
  },
];
