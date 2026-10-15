import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    document.documentElement.classList.remove('theme-changing');
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const readPreference = () => {
      try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
    };
    const apply = () => {
      const preference = readPreference();
      const next = preference === 'dark' || (preference !== 'light' && media.matches);
      document.documentElement.classList.toggle('dark', next);
      setDark(next);
    };
    apply();
    media.addEventListener('change', apply);
    window.addEventListener('storage', apply);
    return () => { media.removeEventListener('change', apply); window.removeEventListener('storage', apply); };
  }, []);

  function toggle() {
    const next = !dark;
    const root = document.documentElement;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-changing');
      // Commit transition rules before changing the theme's target colors.
      void root.offsetWidth;
      transitionTimer.current = setTimeout(() => root.classList.remove('theme-changing'), 480);
    }
    setDark(next);
    root.classList.toggle('dark', next);
    try { localStorage.setItem('portfolio-theme', next ? 'dark' : 'light'); } catch { /* Appearance still works when storage is unavailable. */ }
  }

  return <Button variant="ghost" size="icon" className="theme-toggle shrink-0" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={dark}><span key={dark ? 'dark' : 'light'} className="theme-icon" aria-hidden="true">{dark ? <Sun/> : <Moon/>}</span></Button>;
}