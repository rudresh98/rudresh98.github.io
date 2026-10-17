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
import { certifications } from "@/lib/certifications";
import {
  commandIndex,
  isPreviewSearch,
  navCount,
  navigation,
  previewHref,
} from "@/lib/navigation";
import { projects } from "@/lib/portfolio";
import { courses } from "@/lib/training";

async function renderPalette() {
  const root = createRootRoute({
    component: () => (
      <CommandPaletteProvider>
        <Outlet />
      </CommandPaletteProvider>
    ),
  });
  const leaves = [
    "/",
    "projects/$projectId",
    "training/$courseId",
    "contact",
  ].map((path) =>
    createRoute({ getParentRoute: () => root, path, component: () => null }),
  );
  const router = createRouter({
    routeTree: root.addChildren(leaves),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
  return router;
}
const openWithShortcut = async () => {
  fireEvent.keyDown(window, { key: "k", ctrlKey: true });
  return screen.findByRole("dialog", { name: "Search the site" });
};

afterEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});

describe("Command index", () => {
  it("covers every page, project, course, and certification with the right destination", () => {
    const entries = commandIndex();
    const by = (group: string) => entries.filter((e) => e.group === group);
    expect(by("Pages").map((e) => e.href)).toEqual(navigation.map((n) => n.to));
    expect(by("Projects").map((e) => e.href)).toEqual(
      projects.map((p) => `/projects/${p.id}`),
    );
    expect(by("Courses").map((e) => e.href)).toEqual(
      courses.map((c) => `/training/${c.id}`),
    );
    expect(by("Certifications")).toHaveLength(certifications.length);
    for (const cert of by("Certifications")) expect(cert.external).toBe(true);
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length);
  });
});

describe("Navigation previews", () => {
  it("gives every page a summary and live counts from the data modules", () => {
    for (const item of navigation)
      expect(item.summary.length).toBeGreaterThan(0);
    expect(navCount("/projects")).toBe(projects.length);
    expect(navCount("/training")).toBe(courses.length);
    expect(navCount("/certifications")).toBe(certifications.length);
    expect(navCount("/about")).toBeUndefined();
  });
  it("frames pages in preview mode only when asked", () => {
    expect(previewHref("/projects")).toBe("/projects/?preview=1");
    expect(previewHref("/")).toBe("/?preview=1");
    expect(isPreviewSearch({ preview: 1 })).toBe(true);
    expect(isPreviewSearch({ preview: "1" })).toBe(true);
    expect(isPreviewSearch({})).toBe(false);
    expect(isPreviewSearch({ preview: 0 })).toBe(false);
    expect(isPreviewSearch(undefined)).toBe(false);
  });
});

describe("Command palette", () => {
  it("opens with Ctrl+K and closes with Escape", async () => {
    await renderPalette();
    const dialog = await openWithShortcut();
    expect(within(dialog).getByRole("combobox")).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("ignores the shortcut while typing in another field", async () => {
    await renderPalette();
    const input = document.createElement("input");
    document.body.append(input);
    fireEvent.keyDown(input, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    input.remove();
  });

  it("finds a project by name and navigates to its case study", async () => {
    const router = await renderPalette();
    const dialog = await openWithShortcut();
    fireEvent.change(within(dialog).getByRole("combobox"), {
      target: { value: "mealboy" },
    });
    const option = await within(dialog).findByRole("option", {
      name: /MealBoy Ordering Platform/,
    });
    await act(async () => {
      fireEvent.click(option);
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/projects/mealboy"),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("finds courses by tool and certifications by issuer", async () => {
    await renderPalette();
    const dialog = await openWithShortcut();
    const search = within(dialog).getByRole("combobox");
    fireEvent.change(search, { target: { value: "terraform" } });
    expect(
      await within(dialog).findByRole("option", {
        name: /Cloud Infrastructure Setup/,
      }),
    ).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "Databricks Academy" } });
    expect(
      await within(dialog).findByRole("option", {
        name: /Databricks Certified Data Engineer Professional/,
      }),
    ).toBeInTheDocument();
  });

  it("toggles the theme from an action", async () => {
    await renderPalette();
    const dialog = await openWithShortcut();
    fireEvent.click(
      within(dialog).getByRole("option", { name: /Toggle theme/ }),
    );
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("portfolio-theme")).toBe("dark");
  });
});
