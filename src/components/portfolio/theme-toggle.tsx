import { useEffect, useState } from "react";
import { ThemeToggleButton2 } from "@/components/ui/skiper-ui/skiper4";
import { THEME_EVENT, THEME_STORAGE_KEY } from "@/lib/theme";
import { toggleThemeWithReveal } from "./theme-reveal";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(
    () => () => document.documentElement.classList.remove("theme-changing"),
    [],
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const readPreference = () => {
      try {
        return localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        return null;
      }
    };
    const apply = () => {
      const preference = readPreference();
      const next =
        preference === "dark" || (preference !== "light" && media.matches);
      document.documentElement.classList.toggle("dark", next);
      setDark(next);
    };
    // Other controls (the command palette) change the theme through the shared module.
    const sync = (event: Event) =>
      setDark((event as CustomEvent<boolean>).detail);
    apply();
    media.addEventListener("change", apply);
    window.addEventListener("storage", apply);
    window.addEventListener(THEME_EVENT, sync);
    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", apply);
      window.removeEventListener(THEME_EVENT, sync);
    };
  }, []);

  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <ThemeToggleButton2
      isDark={dark}
      onClick={toggleThemeWithReveal}
      className="theme-toggle size-9 shrink-0 cursor-pointer p-2.5 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      aria-label={label}
      title={label}
      aria-pressed={dark}
    />
  );
}
