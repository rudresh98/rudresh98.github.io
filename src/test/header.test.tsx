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

import { Header } from "@/components/portfolio/shell";

// Real leaf routes for every header target, so links resolve and active state matches the app.
async function renderHeader(path = "/") {
  const root = createRootRoute({
    component: () => (
      <>
        <Header />
        <Outlet />
      </>
    ),
  });
  const leaves = [
    "/",
    "about",
    "expertise",
    "experience",
    "projects",
    "projects/$projectId",
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
const mainNav = () =>
  within(screen.getByRole("navigation", { name: "Main navigation" }));
async function openMenu() {
  const trigger = screen.getByRole("button", { name: "Open menu" });
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
  "Contact",
];
const hrefs = [
  "/",
  "/about",
  "/expertise",
  "/experience",
  "/projects",
  "/contact",
];

afterEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  setScrollY(0);
});

describe("Header", () => {
  it("links every page in order", async () => {
    await renderHeader();
    const links = mainNav().getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(labels);
    expect(links.map((l) => l.getAttribute("href"))).toEqual(hrefs);
  });

  it.each([
    ["/", "Home"],
    ["/about", "About"],
    ["/expertise", "Expertise"],
    ["/experience", "Experience"],
    ["/projects", "Projects"],
    ["/projects/music-ai", "Projects"],
    ["/contact", "Contact"],
  ])("marks only the matching page active on %s", async (path, label) => {
    await renderHeader(path);
    const current = mainNav()
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "page");
    expect(current.map((l) => l.textContent)).toEqual([label]);
    expect(current[0]!.querySelector(".header-link-indicator")).not.toBeNull();
  });

  it("links the logo home", async () => {
    await renderHeader("/about");
    const logo = screen.getByRole("link", { name: "Rudresh Oza home" });
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveTextContent("RO.");
    expect(logo).not.toHaveAttribute("aria-current");
  });

  it("offers Let's Talk and the resume download", async () => {
    await renderHeader();
    const talk = screen.getAllByRole("link", { name: "Let's Talk" });
    expect(talk).toHaveLength(1);
    expect(talk[0]).toHaveAttribute("href", "/contact");
    const resume = screen.getByRole("link", { name: "Download resume (PDF)" });
    expect(resume).toHaveAttribute("download", "Rudresh-Oza-Resume.pdf");
    expect(resume.getAttribute("href")).toMatch(/\.pdf/);
  });

  it("keeps a single theme toggle", async () => {
    await renderHeader();
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
    await renderHeader();
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

describe("Header mobile menu", () => {
  it("opens an accessible dialog with every destination", async () => {
    await renderHeader();
    const trigger = screen.getByRole("button", { name: "Open menu" });
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
    await renderHeader();
    const { trigger } = await openMenu();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body).not.toHaveAttribute("data-scroll-locked");
  });

  it("closes from the close button", async () => {
    await renderHeader();
    const { trigger, dialog } = await openMenu();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close menu" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("navigates and closes when a link is chosen", async () => {
    const router = await renderHeader();
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
    expect(mainNav().getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("closes when the current page is chosen", async () => {
    await renderHeader("/about");
    const { dialog } = await openMenu();
    fireEvent.click(within(dialog).getByRole("link", { name: "About" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("closes on history navigation", async () => {
    const router = await renderHeader();
    await openMenu();
    await act(async () => {
      await router.navigate({ to: "/contact" });
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("marks the active page inside the menu", async () => {
    await renderHeader("/projects/music-ai");
    const { dialog } = await openMenu();
    expect(
      within(dialog).getByRole("link", { name: "Projects" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
