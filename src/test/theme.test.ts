import { afterEach, describe, expect, it, vi } from 'vitest';

import { setTheme, THEME_STORAGE_KEY } from '@/lib/theme';

const REVEAL = '::view-transition-new(root) { animation-name: reveal; }';
const realMatchMedia = window.matchMedia;

function stubViewTransition() {
 const start = vi.fn((update: () => void) => { update(); });
 Object.defineProperty(document, 'startViewTransition', { configurable: true, writable: true, value: start });
 return start;
}

afterEach(() => {
 delete (document as { startViewTransition?: unknown }).startViewTransition;
 window.matchMedia = realMatchMedia;
 document.getElementById('theme-transition-styles')?.remove();
 document.documentElement.className = '';
 localStorage.clear();
});

describe('setTheme', () => {
 it('reveals the new theme through a View Transition when one is supported', () => {
  const start = stubViewTransition();
  setTheme(true, REVEAL);
  expect(start).toHaveBeenCalledOnce();
  expect(document.getElementById('theme-transition-styles')).toHaveTextContent(REVEAL);
  expect(document.documentElement).toHaveClass('dark');
  expect(document.documentElement).not.toHaveClass('theme-changing');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
 });

 it('fades colors instead when the browser has no View Transitions', () => {
  setTheme(true, REVEAL);
  expect(document.documentElement).toHaveClass('dark', 'theme-changing');
  expect(document.getElementById('theme-transition-styles')).toBeNull();
 });

 it('switches instantly under reduced motion', () => {
  const start = stubViewTransition();
  window.matchMedia = ((query: string) => ({ ...realMatchMedia(query), matches: query.includes('reduce') })) as typeof window.matchMedia;
  setTheme(true, REVEAL);
  expect(start).not.toHaveBeenCalled();
  expect(document.documentElement).toHaveClass('dark');
  expect(document.documentElement).not.toHaveClass('theme-changing');
 });
});
