import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AccessibilityProvider } from "@/components/portfolio/accessibility";
import { ExperienceRoute } from "@/components/portfolio/experience-route";
import { A11Y_STORAGE_KEY, defaultPrefs } from "@/lib/accessibility";
import { Route } from "@/routes/accessibility";

const AccessibilityPage = Route.options.component!;
const root = document.documentElement;
const realMatchMedia = window.matchMedia;
const saved = () => JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) ?? "{}");

function renderPage() {
  return render(
    <AccessibilityProvider>
      <AccessibilityPage />
    </AccessibilityProvider>,
  );
}

afterEach(() => {
  window.matchMedia = realMatchMedia;
  for (const name of [...root.attributes].map((a) => a.name))
    if (name.startsWith("data-")) root.removeAttribute(name);
  localStorage.clear();
});

describe("Accessibility page", () => {
  it("applies a setting to every page and saves it on this device", () => {
    renderPage();
    const contrast = screen.getByRole("switch", { name: "High contrast" });
    expect(contrast).not.toBeChecked();
    fireEvent.click(contrast);
    expect(contrast).toBeChecked();
    expect(root).toHaveAttribute("data-contrast", "more");
    expect(saved()).toMatchObject({ highContrast: true });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Saved on this device.",
    );
  });

  it("scales text from the text size options", () => {
    renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /^Larger/ }));
    expect(screen.getByRole("radio", { name: /^Larger/ })).toBeChecked();
    expect(root).toHaveAttribute("data-text-size", "larger");
    expect(saved()).toMatchObject({ textSize: "larger" });
  });

  it("restores saved settings and resets them to defaults", async () => {
    localStorage.setItem(
      A11Y_STORAGE_KEY,
      JSON.stringify({
        ...defaultPrefs,
        textSize: "large",
        underlineLinks: true,
      }),
    );
    renderPage();
    expect(
      await screen.findByRole("switch", { name: "Underline links" }),
    ).toBeChecked();
    expect(screen.getByRole("radio", { name: /^Large\b(?!r)/ })).toBeChecked();
    expect(root).toHaveAttribute("data-underline-links");

    fireEvent.click(screen.getByRole("button", { name: "Reset to defaults" }));
    expect(root).not.toHaveAttribute("data-underline-links");
    expect(root).not.toHaveAttribute("data-text-size");
    expect(saved()).toEqual(defaultPrefs);
    expect(
      screen.getByRole("button", { name: "Reset to defaults" }),
    ).toBeDisabled();
  });

  it("stops animations for a visitor who opts in, even when the OS doesn't ask", () => {
    localStorage.setItem(
      A11Y_STORAGE_KEY,
      JSON.stringify({ ...defaultPrefs, reduceMotion: true }),
    );
    const { container } = render(
      <AccessibilityProvider>
        <ExperienceRoute />
      </AccessibilityProvider>,
    );
    expect(container.querySelector(".exp-car")).toHaveClass("is-parked");
    expect(root).toHaveAttribute("data-reduce-motion");
  });

  it("keeps reduced motion on, and says why, when the device asks for it", () => {
    window.matchMedia = ((query: string) => ({
      ...realMatchMedia(query),
      matches: query.includes("reduce"),
    })) as typeof window.matchMedia;
    renderPage();
    const motion = screen.getByRole("switch", { name: "Reduce motion" });
    expect(motion).toBeChecked();
    expect(motion).toBeDisabled();
    expect(motion).toHaveAccessibleDescription(
      /Your device already asks for reduced motion/,
    );
    expect(root).toHaveAttribute("data-reduce-motion");
  });
});
