import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ShareLauncher } from "@/components/portfolio/share-launcher";
import { homeShare, shareLinkFor, shareTargets } from "@/lib/share";

// jsdom cannot navigate, so cancel the links' default action once React has handled the click.
const blockNavigation = (event: Event) => event.preventDefault();
afterEach(() => document.removeEventListener("click", blockNavigation));

describe("Share launcher", () => {
  it("fans out every target as a named link and closes on Escape", async () => {
    render(<ShareLauncher />);
    const trigger = screen.getByRole("button", { name: "Share this site" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("list", { name: "Share on" })).toBeNull();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const list = screen.getByRole("list", { name: "Share on" });
    expect(trigger).toHaveAttribute("aria-controls", list.id);
    for (const target of shareTargets(homeShare)) {
      const link = within(list).getByRole("link", { name: target.label });
      expect(link).toHaveAttribute("href", target.href);
      if (target.external) expect(link).toHaveAttribute("target", "_blank");
      else expect(link).not.toHaveAttribute("target");
    }

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    await waitFor(() =>
      expect(screen.queryByRole("list", { name: "Share on" })).toBeNull(),
    );
  });

  it("closes when the visitor presses outside it", () => {
    render(<ShareLauncher />);
    const trigger = screen.getByRole("button", { name: "Share this site" });
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("copies the link before opening Instagram and says it still needs pasting", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    document.addEventListener("click", blockNavigation);
    render(<ShareLauncher />);
    fireEvent.click(screen.getByRole("button", { name: "Share this site" }));
    fireEvent.click(screen.getByRole("link", { name: "Instagram" }));

    expect(writeText).toHaveBeenCalledWith(homeShare.url);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Link copied. Paste it in an Instagram chat.",
      ),
    );
    expect(
      screen.getByRole("button", { name: "Share this site" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("shares the Snugbox page, not the homepage, while on Snugbox", () => {
    render(<ShareLauncher pathname="/snugbox/" />);
    fireEvent.click(screen.getByRole("button", { name: "Share Snugbox" }));
    const list = screen.getByRole("list", { name: "Share on" });
    for (const target of shareTargets(shareLinkFor("/snugbox")))
      expect(
        within(list).getByRole("link", { name: target.label }),
      ).toHaveAttribute("href", target.href);
    expect(
      within(list).getByRole("link", { name: "WhatsApp" }).getAttribute("href"),
    ).toContain(encodeURIComponent("https://rudresh98.github.io/snugbox/"));
  });
});
