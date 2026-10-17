import { act, fireEvent, render, screen, within } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/portfolio/hero";
import { achievements, heroCredentials, profile } from "@/lib/portfolio";
import { heroSystem } from "@/lib/portfolio-visuals";

async function renderHero() {
  const router = createRouter({
    routeTree: createRootRoute({ component: Hero }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
  return screen.findByRole("heading", { level: 1 });
}

describe("Home hero", () => {
  it("leads with the editorial headline and working calls to action", async () => {
    const heading = await renderHero();
    expect(heading).toHaveTextContent(
      "Engineering the future. Building what matters.",
    );
    expect(
      screen.getByRole("link", { name: /Explore My Work/ }),
    ).toHaveAttribute("href", "/projects");
    const resume = screen.getByRole("link", { name: /Download Resume/ });
    expect(resume).toHaveAttribute("download", "Rudresh-Oza-Resume.pdf");
    expect(resume.getAttribute("href")).toMatch(/rudresh-oza-resume.*\.pdf/);
    expect(screen.getByText(profile.availability)).toBeInTheDocument();
  });

  it("only shows verified credibility figures", async () => {
    await renderHero();
    const strip = screen.getByRole("list", { name: "Professional highlights" });
    expect(within(strip).getAllByRole("listitem")).toHaveLength(
      heroCredentials.length,
    );
    expect(heroCredentials.map((fact) => fact.value)).toEqual([
      6,
      achievements.clients,
      achievements.transactions,
      achievements.transactionSpeedPercent,
      achievements.studentsTrained,
    ]);
  });

  it("describes each engineering domain when its panel is focused", async () => {
    await renderHero();
    const panels = heroSystem.panels.map((panel) =>
      screen.getByRole("button", { name: new RegExp(`^${panel.title}`) }),
    );
    expect(panels).toHaveLength(4);
    const [first, , third] = panels;
    const thirdPanel = heroSystem.panels[2];
    if (!first || !third || !thirdPanel)
      throw new Error("Expected four hero panels");
    expect(first).toHaveAttribute("aria-pressed", "true");
    fireEvent.focus(third);
    expect(third).toHaveAttribute("aria-pressed", "true");
    expect(await screen.findByText(thirdPanel.description)).toBeInTheDocument();
  });
});
