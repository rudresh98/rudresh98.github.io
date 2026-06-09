"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  // Read the live class on <html> so there's no hydration mismatch and no
  // mount-flag setState. Icons are swapped purely by the `dark:` variant.
  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors duration-300 hover:bg-accent-tint hover:text-accent active:scale-95"
    >
      <Sun size={18} weight="bold" className="hidden dark:block" />
      <Moon size={18} weight="bold" className="block dark:hidden" />
    </button>
  );
}
