import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { afterEach, describe, expect, it } from "vitest";

import { CommandPaletteProvider } from "@/components/portfolio/command-palette";
import { Dock } from "@/components/portfolio/dock";
import { Header } from "@/components/portfolio/shell";

// Real leaf routes for every navigation target, so links resolve and active state matches the app.
async function renderShell(path = "/") {
  const root = createRootRoute({
    component: () => (
      <CommandPaletteProvider>
        <Header />
        <Outlet />
        <Dock />
      </CommandPaletteProvider>
    ),
  });
  const leaves = [
    "/",
    "about",
    "expertise",
    "experience",
    "projects",
    "projects/$projectId",
    "certifications",
    "training",
    "training/$courseId",
    "contact",
  ].map((p) =>
    createRoute({ getParentRoute: () => root, path: p, component: () => null }),
  );
  const router = createRouter({
    routeTree: root.addChildren(leaves),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
  await screen.findByRole("banner");
  return router;
}

// jsdom loads no CSS, so breakpoint-hidden controls are still present: scope queries by landmark.
const dock = () =>
  within(screen.getByRole("navigation", { name: "Main navigation" }));
const dockLinks = () => dock().getAllByRole("link");
async function openMenu() {
  const trigger = dock().getByRole("button", { name: "Open menu" });
  fireEvent.click(trigger);
  return {
    trigger,
    dialog: await screen.findByRole("dialog", { name: "Menu" }),
  };
}
const setScrollY = (value: number) =>
  Object.defineProperty(window, "scrollY", { value, configurable: true });

const labels = [
  "Home",
  "About",
  "Expertise",
  "Experience",
  "Projects",
  "Certifications",
  "Training",
  "Contact",
];
const hrefs = [
  "/",
  "/about",
  "/expertise",
  "/experience",
  "/projects",
  "/certifications",
  "/training",
  "/contact",
];

afterEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  setScrollY(0);
});

describe("Bottom dock", () => {
  it("links every page in order with accessible names", async () => {
    await renderShell();
    const links = dockLinks();
    expect(links.map((l) => l.getAttribute("aria-label"))).toEqual(labels);
    expect(links.map((l) => l.getAttribute("href"))).toEqual(hrefs);
  });

  it.each([
    ["/", "Home"],
    ["/about", "About"],
    ["/expertise", "Expertise"],
    ["/experience", "Experience"],
    ["/projects", "Projects"],
    ["/projects/music-ai", "Projects"],
    ["/certifications", "Certifications"],
    ["/training", "Training"],
    ["/training/fde", "Training"],
    ["/contact", "Contact"],
  ])("marks only the matching page active on %s", async (path, label) => {
    await renderShell(path);
    const current = dockLinks().filter(
      (l) => l.getAttribute("aria-current") === "page",
    );
    expect(current.map((l) => l.getAttribute("aria-label"))).toEqual([label]);
    expect(current[0]!.querySelector(".dock-indicator")).not.toBeNull();
  });

  it("marks the secondary pages that collapse into More on small screens", async () => {
    await renderShell();
    const secondary = dock()
      .getAllByRole("listitem")
      .filter((li) => li.hasAttribute("data-secondary"))
      .map((li) => within(li).getByRole("link").getAttribute("aria-label"));
    expect(secondary).toEqual([
      "About",
      "Expertise",
      "Experience",
      "Certifications",
    ]);
  });

  it("opens the command palette from its search button", async () => {
    await renderShell();
    fireEvent.click(dock().getByRole("button", { name: "Search the site" }));
    expect(
      await screen.findByRole("dialog", { name: "Search the site" }),
    ).toBeInTheDocument();
  });
});

describe("Dock page previews", () => {
  const original = window.matchMedia;
  // Report a fine, hovering pointer so the dock renders live previews instead of tooltips.
  const useFinePointer = () => {
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query.includes("pointer: fine"),
    })) as typeof window.matchMedia;
  };
  afterEach(() => {
    window.matchMedia = original;
  });
  const previews = () => document.querySelectorAll(".dock-preview");

  it("shows a live preview with the page title, summary, and count", async () => {
    useFinePointer();
    await renderShell("/projects");
    act(() => dock().getByRole("link", { name: "Training" }).focus());
    await waitFor(() => expect(previews()).toHaveLength(1));
    const card = previews()[0] as HTMLElement;
    expect(card).toHaveAttribute("aria-hidden", "true");
    expect(card.querySelector(".dock-preview-title")).toHaveTextContent(
      "Training",
    );
    expect(card).toHaveTextContent("Courses I teach");
    expect(card.querySelector(".dock-preview-count")).toHaveTextContent("7");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "/training/?preview=1",
    );
    expect(card.querySelector("iframe")).toHaveAttribute("tabindex", "-1");
  });

  it("keeps a single preview mounted and marks the current page", async () => {
    useFinePointer();
    await renderShell("/projects/music-ai");
    act(() => dock().getByRole("link", { name: "Projects" }).focus());
    await waitFor(() => expect(previews()).toHaveLength(1));
    expect(previews()[0]).toHaveTextContent("You are here");
    act(() => dock().getByRole("link", { name: "Contact" }).focus());
    await waitFor(() =>
      expect(document.querySelector(".dock-preview iframe")).toHaveAttribute(
        "src",
        "/contact/?preview=1",
      ),
    );
    expect(previews()).toHaveLength(1);
  });

  it("falls back to label tooltips without a fine pointer", async () => {
    await renderShell();
    act(() => dock().getByRole("link", { name: "Projects" }).focus());
    await new Promise((r) => setTimeout(r, 300));
    expect(previews()).toHaveLength(0);
  });
});

describe("Top bar", () => {
  it("links the logo home and keeps page links out of the bar", async () => {
    await renderShell("/about");
    const banner = within(screen.getByRole("banner"));
    const logo = banner.getByRole("link", { name: "Rudresh Oza home" });
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveTextContent("RO.");
    expect(banner.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("offers search, Let's Talk, and the resume download", async () => {
    await renderShell();
    const banner = within(screen.getByRole("banner"));
    expect(
      banner.getByRole("button", { name: "Search the site" }),
    ).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K");
    expect(banner.getByRole("link", { name: "Let's Talk" })).toHaveAttribute(
      "href",
      "/contact",
    );
    const resume = banner.getByRole("link", { name: "Download resume (PDF)" });
    expect(resume).toHaveAttribute("download", "Rudresh-Oza-Resume.pdf");
    expect(resume.getAttribute("href")).toMatch(/\.pdf/);
  });

  it("keeps a single theme toggle", async () => {
    await renderShell();
    const toggles = screen.getAllByRole("button", {
      name: "Switch to dark mode",
    });
    expect(toggles).toHaveLength(1);
    fireEvent.click(toggles[0]!);
    expect(document.documentElement).toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("adds a surface once the page scrolls", async () => {
    await renderShell();
    const banner = screen.getByRole("banner");
    expect(banner).not.toHaveClass("header-scrolled");
    setScrollY(40);
    fireEvent.scroll(window);
    expect(banner).toHaveClass("header-scrolled");
    setScrollY(0);
    fireEvent.scroll(window);
    expect(banner).not.toHaveClass("header-scrolled");
  });
});

describe("More menu sheet", () => {
  it("opens an accessible dialog with every destination", async () => {
    await renderShell();
    const trigger = dock().getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const { dialog } = await openMenu();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const links = within(
      within(dialog).getByRole("navigation", { name: "Mobile navigation" }),
    ).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(hrefs);
    expect(
      within(dialog).getByRole("link", { name: "Let's Talk" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      within(dialog).getByRole("link", { name: "Download Resume" }),
    ).toHaveAttribute("download", "Rudresh-Oza-Resume.pdf");
    expect(document.body).toHaveAttribute("data-scroll-locked");
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    );
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    await renderShell();
    const { trigger } = await openMenu();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body).not.toHaveAttribute("data-scroll-locked");
  });

  it("closes from the close button", async () => {
    await renderShell();
    const { trigger, dialog } = await openMenu();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close menu" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("navigates and closes when a link is chosen", async () => {
    const router = await renderShell();
    const { dialog } = await openMenu();
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("link", { name: "Projects" }));
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/projects"),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(dock().getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("closes on history navigation", async () => {
    const router = await renderShell();
    await openMenu();
    await act(async () => {
      await router.navigate({ to: "/contact" });
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("marks the active page inside the sheet", async () => {
    await renderShell("/projects/music-ai");
    const { dialog } = await openMenu();
    expect(
      within(dialog).getByRole("link", { name: "Projects" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
