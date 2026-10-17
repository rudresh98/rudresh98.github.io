// Appearance is a device preference, not account data: it lives on <html> and in localStorage.
export const THEME_STORAGE_KEY = 'portfolio-theme';
// Fired whenever the theme changes so every control (header toggle, palette action) stays in sync.
export const THEME_EVENT = 'portfolio-theme-change';

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

export function isDarkTheme() { return document.documentElement.classList.contains('dark'); }

export function setTheme(dark: boolean) {
 const root = document.documentElement;
 if (transitionTimer) clearTimeout(transitionTimer);
 if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.classList.add('theme-changing');
  // Commit transition rules before changing the theme's target colors.
  void root.offsetWidth;
  transitionTimer = setTimeout(() => root.classList.remove('theme-changing'), 480);
 }
 root.classList.toggle('dark', dark);
 try { localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light'); } catch { /* Appearance still works when storage is unavailable. */ }
 window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: dark }));
}

export function toggleTheme() { setTheme(!isDarkTheme()); }
