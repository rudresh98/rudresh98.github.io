import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME_EVENT, THEME_STORAGE_KEY, toggleTheme } from '@/lib/theme';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => () => document.documentElement.classList.remove('theme-changing'), []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const readPreference = () => {
      try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; }
    };
    const apply = () => {
      const preference = readPreference();
      const next = preference === 'dark' || (preference !== 'light' && media.matches);
      document.documentElement.classList.toggle('dark', next);
      setDark(next);
    };
    // Other controls (the command palette) change the theme through the shared module.
    const sync = (event: Event) => setDark((event as CustomEvent<boolean>).detail);
    apply();
    media.addEventListener('change', apply);
    window.addEventListener('storage', apply);
    window.addEventListener(THEME_EVENT, sync);
    return () => { media.removeEventListener('change', apply); window.removeEventListener('storage', apply); window.removeEventListener(THEME_EVENT, sync); };
  }, []);

  return <Button variant="ghost" size="icon" className="theme-toggle shrink-0" onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={dark}><span key={dark ? 'dark' : 'light'} className="theme-icon" aria-hidden="true">{dark ? <Sun/> : <Moon/>}</span></Button>;
}
