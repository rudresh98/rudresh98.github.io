import { prefersReducedMotion } from "./accessibility";

// Appearance is a device preference, not account data: it lives on <html> and in localStorage.
export const THEME_STORAGE_KEY = "portfolio-theme";
// Fired whenever the theme changes so every control (header toggle, palette action) stays in sync.
export const THEME_EVENT = "portfolio-theme-change";
// Holds the View Transition reveal keyframes for the current theme change.
const REVEAL_STYLE_ID = "theme-transition-styles";

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

export function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    /* Appearance still works when storage is unavailable. */
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: dark }));
}

// `revealCss` is View Transition CSS (see skiper26's createAnimation); without it, or where the
// browser lacks View Transitions, colors fade instead.
export function setTheme(dark: boolean, revealCss?: string) {
  const root = document.documentElement;
  if (transitionTimer) clearTimeout(transitionTimer);
  root.classList.remove("theme-changing");
  if (prefersReducedMotion()) {
    applyTheme(dark);
    return;
  }
  if (revealCss && typeof document.startViewTransition === "function") {
    let style = document.getElementById(REVEAL_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = REVEAL_STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = revealCss;
    // The reveal swaps snapshots, so the color fade would only make the new view start from old colors.
    document.startViewTransition(() => applyTheme(dark));
    return;
  }
  root.classList.add("theme-changing");
  // Commit transition rules before changing the theme's target colors.
  void root.offsetWidth;
  transitionTimer = setTimeout(
    () => root.classList.remove("theme-changing"),
    480,
  );
  applyTheme(dark);
}

export function toggleTheme(revealCss?: string) {
  setTheme(!isDarkTheme(), revealCss);
}
