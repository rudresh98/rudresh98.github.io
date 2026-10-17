import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Award, Copy, Download, FolderKanban, Github, GraduationCap, Linkedin, SunMoon, type LucideIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import resume from '@/assets/rudresh-oza-resume.pdf';
import { commandGroups, commandIndex, socialLinks, type CommandEntry, type NavPath } from '@/lib/navigation';
import { navigationIcons } from '@/lib/navigation-icons';
import { toggleTheme } from '@/lib/theme';

type PaletteState = { open: boolean; setOpen: (open: boolean) => void };
const PaletteContext = createContext<PaletteState>({ open: false, setOpen: () => {} });
export const useCommandPalette = () => useContext(PaletteContext);

const RESUME_FILENAME = 'Rudresh-Oza-Resume.pdf';
const groupIcons: Record<Exclude<CommandEntry['group'], 'Pages'>, LucideIcon> = { Projects: FolderKanban, Courses: GraduationCap, Certifications: Award };

// Text fields keep ⌘K for themselves unless the field is the palette's own search input.
function typingElsewhere(target: EventTarget | null) {
 if (!(target instanceof HTMLElement)) return false;
 if (target.closest('[cmdk-root]')) return false;
 return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export function CommandPaletteProvider({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
 const [open, setOpen] = useState(false);
 useEffect(() => {
  if (disabled) return;
  const onKey = (event: KeyboardEvent) => {
   if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !typingElsewhere(event.target)) {
    event.preventDefault();
    setOpen(current => !current);
   }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [disabled]);
 const value = useMemo(() => ({ open, setOpen }), [open]);
 return <PaletteContext.Provider value={value}>{children}{!disabled && <CommandPalette />}</PaletteContext.Provider>;
}

export function CommandPalette() {
 const { open, setOpen } = useCommandPalette();
 const router = useRouter();
 const entries = useMemo(commandIndex, []);
 const [status, setStatus] = useState('');
 useEffect(() => { if (!open) setStatus(''); }, [open]);

 const choose = useCallback((entry: CommandEntry) => {
  setOpen(false);
  if (entry.external) window.open(entry.href, '_blank', 'noopener,noreferrer');
  else router.history.push(entry.href);
 }, [router, setOpen]);
 const runAndClose = (action: () => void) => () => { setOpen(false); action(); };
 const downloadResume = () => { const link = document.createElement('a'); link.href = resume; link.download = RESUME_FILENAME; link.click(); };
 const copyEmail = async () => {
  try { await navigator.clipboard.writeText(socialLinks.email); setStatus(`Copied ${socialLinks.email}`); }
  catch { setStatus(`Email: ${socialLinks.email}`); }
 };

 return <Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Portal>
   <Dialog.Overlay className="palette-overlay" />
   <Dialog.Content className="palette" aria-describedby={undefined}>
    <Dialog.Title className="sr-only">Search the site</Dialog.Title>
    <Command className="palette-command" loop>
     <CommandInput placeholder="Search pages, projects, courses, certifications…" className="palette-input" />
     <CommandList className="palette-list">
      <CommandEmpty className="palette-empty">No matches. Try “GenAI”, “Databricks”, or “contact”.</CommandEmpty>
      {commandGroups.map(group => <CommandGroup key={group} heading={group} className="palette-group">
       {entries.filter(entry => entry.group === group).map(entry => {
        const Icon = entry.group === 'Pages' ? navigationIcons[entry.href as NavPath] : groupIcons[entry.group];
        return <CommandItem key={entry.id} value={entry.id} keywords={entry.keywords} onSelect={() => choose(entry)} className="palette-item">
         <span className="palette-item-icon" aria-hidden="true"><Icon /></span>
         <span className="palette-item-label">{entry.label}</span>
         {entry.meta && <span className="palette-item-meta">{entry.meta}</span>}
         {entry.external && <ArrowUpRight className="palette-item-external" aria-label="opens in a new tab" />}
        </CommandItem>;
       })}
      </CommandGroup>)}
      <CommandGroup heading="Actions" className="palette-group">
       <CommandItem value="action:resume" keywords={['download', 'resume', 'cv', 'pdf']} onSelect={runAndClose(downloadResume)} className="palette-item"><span className="palette-item-icon" aria-hidden="true"><Download /></span><span className="palette-item-label">Download resume</span><span className="palette-item-meta">PDF</span></CommandItem>
       <CommandItem value="action:theme" keywords={['toggle', 'theme', 'dark', 'light', 'mode', 'appearance']} onSelect={runAndClose(toggleTheme)} className="palette-item"><span className="palette-item-icon" aria-hidden="true"><SunMoon /></span><span className="palette-item-label">Toggle theme</span></CommandItem>
       <CommandItem value="action:email" keywords={['copy', 'email', 'mail', 'contact']} onSelect={copyEmail} className="palette-item"><span className="palette-item-icon" aria-hidden="true"><Copy /></span><span className="palette-item-label">Copy email</span><span className="palette-item-meta">{socialLinks.email}</span></CommandItem>
       <CommandItem value="action:linkedin" keywords={['linkedin', 'social', 'profile']} onSelect={runAndClose(() => window.open(socialLinks.linkedin, '_blank', 'noopener,noreferrer'))} className="palette-item"><span className="palette-item-icon" aria-hidden="true"><Linkedin /></span><span className="palette-item-label">LinkedIn</span><ArrowUpRight className="palette-item-external" aria-label="opens in a new tab" /></CommandItem>
       <CommandItem value="action:github" keywords={['github', 'code', 'social']} onSelect={runAndClose(() => window.open(socialLinks.github, '_blank', 'noopener,noreferrer'))} className="palette-item"><span className="palette-item-icon" aria-hidden="true"><Github /></span><span className="palette-item-label">GitHub</span><ArrowUpRight className="palette-item-external" aria-label="opens in a new tab" /></CommandItem>
      </CommandGroup>
     </CommandList>
     <div className="palette-footer"><span role="status" className="palette-status">{status}</span><span className="palette-hints" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close</span></div>
    </Command>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}

// Platform-aware shortcut label; starts as ⌘K so prerendered HTML and hydration agree.
export function useShortcutLabel() {
 const [label, setLabel] = useState('⌘K');
 useEffect(() => { if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setLabel('Ctrl K'); }, []);
 return label;
}
