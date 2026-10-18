import { afterEach, describe, expect, it } from "vitest";

import {
  A11Y_STORAGE_KEY,
  accessibilityBootScript,
  applyPrefs,
  defaultPrefs,
  parsePrefs,
  prefersReducedMotion,
} from "@/lib/accessibility";

const root = document.documentElement;
const realMatchMedia = window.matchMedia;
const attributes = [
  "data-text-size",
  "data-contrast",
  "data-reduce-motion",
  "data-readable-font",
  "data-underline-links",
];
const everything = {
  textSize: "larger",
  reduceMotion: true,
  highContrast: true,
  readableFont: true,
  underlineLinks: true,
} as const;

function stubReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    ...realMatchMedia(query),
    matches: matches && query.includes("reduce"),
  })) as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = realMatchMedia;
  for (const name of attributes) root.removeAttribute(name);
  localStorage.clear();
});

describe("parsePrefs", () => {
  it("falls back to defaults for missing, malformed, or unknown values", () => {
    expect(parsePrefs(null)).toEqual(defaultPrefs);
    expect(parsePrefs("{not json")).toEqual(defaultPrefs);
    expect(parsePrefs('"large"')).toEqual(defaultPrefs);
    expect(
      parsePrefs(
        JSON.stringify({ textSize: "huge", reduceMotion: "yes", extra: 1 }),
      ),
    ).toEqual(defaultPrefs);
  });

  it("keeps every valid saved setting", () => {
    expect(parsePrefs(JSON.stringify(everything))).toEqual(everything);
  });
});

describe("applyPrefs", () => {
  it("sets an attribute for each setting and clears them again", () => {
    applyPrefs(root, everything, false);
    expect(root).toHaveAttribute("data-text-size", "larger");
    expect(root).toHaveAttribute("data-contrast", "more");
    expect(root).toHaveAttribute("data-reduce-motion");
    expect(root).toHaveAttribute("data-readable-font");
    expect(root).toHaveAttribute("data-underline-links");

    applyPrefs(root, defaultPrefs, false);
    for (const name of attributes) expect(root).not.toHaveAttribute(name);
  });

  it("reduces motion when only the OS asks for it", () => {
    applyPrefs(root, defaultPrefs, true);
    expect(root).toHaveAttribute("data-reduce-motion");
  });
});

describe("prefersReducedMotion", () => {
  it("follows the visitor's setting or the OS", () => {
    expect(prefersReducedMotion()).toBe(false);
    root.setAttribute("data-reduce-motion", "");
    expect(prefersReducedMotion()).toBe(true);
    root.removeAttribute("data-reduce-motion");
    stubReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
  });
});

describe("accessibilityBootScript", () => {
  it("applies saved settings exactly as applyPrefs does", () => {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(everything));
    new Function(accessibilityBootScript)();
    const booted = attributes.map((name) => root.getAttribute(name));
    for (const name of attributes) root.removeAttribute(name);
    applyPrefs(root, everything, false);
    expect(booted).toEqual(attributes.map((name) => root.getAttribute(name)));
  });

  it("adds the OS reduced-motion setting and survives broken storage", () => {
    stubReducedMotion(true);
    localStorage.setItem(A11Y_STORAGE_KEY, "{broken");
    expect(() => new Function(accessibilityBootScript)()).not.toThrow();
    expect(root).toHaveAttribute("data-reduce-motion");
    expect(root).not.toHaveAttribute("data-text-size");
  });
});
