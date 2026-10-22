import { QueryClient } from "@tanstack/react-query";
import { act, render, screen, within } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { StowlyDownload, StowlyFeature } from "@/components/portfolio/stowly";
import { navigation } from "@/lib/navigation";
import {
  canonicalUrl,
  llmsTxt,
  sitemapXml,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { stowly } from "@/lib/stowly";
import { routeTree } from "@/routeTree.gen";
import { Route } from "@/routes/stowly";

const StowlyPage = Route.options.component!;

// Sections contain router Links, so render them as the root of a memory router.
async function renderInRouter(node: ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <>{node}</> }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
}

describe("Stowly download", () => {
  it("stays a disabled coming-soon button until an APK is published", () => {
    render(<StowlyDownload apkUrl={undefined} />);
    const button = screen.getByRole("button", { name: /Download APK/ });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Coming soon/i);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/APK will be available here soon/)).toBeVisible();
  });

  it("becomes a real download once an APK URL is set", () => {
    render(<StowlyDownload apkUrl="/downloads/stowly.apk" />);
    const link = screen.getByRole("link", { name: /Download APK/ });
    expect(link).toHaveAttribute("href", "/downloads/stowly.apk");
    expect(link).toHaveAttribute("download", "Stowly.apk");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("Stowly page", () => {
  it("describes the app, every feature, and every screen", async () => {
    await renderInRouter(<StowlyPage />);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      stowly.name,
    );
    for (const feature of stowly.features)
      expect(
        screen.getByRole("heading", { level: 3, name: feature.title }),
      ).toBeInTheDocument();
    for (const screenshot of stowly.screens) {
      const image = screen.getByRole("img", { name: screenshot.alt });
      expect(image).toHaveAttribute("width", "780");
      expect(image).toHaveAttribute("height", "1688");
      expect(screen.getByText(screenshot.caption)).toBeInTheDocument();
    }
  });

  it("offers the download in the intro and the closing call to action", async () => {
    await renderInRouter(<StowlyPage />);
    const downloads = await screen.findAllByRole(
      stowly.apkUrl ? "link" : "button",
      { name: /Download APK/ },
    );
    expect(downloads).toHaveLength(2);
    for (const download of downloads)
      if (stowly.apkUrl)
        expect(download).toHaveAttribute("href", stowly.apkUrl);
      else expect(download).toBeDisabled();
  });

  it("is reachable from the Projects page band", async () => {
    await renderInRouter(<StowlyFeature />);
    const band = await screen.findByRole("heading", { name: stowly.name });
    const link = within(band.parentElement!.parentElement!).getByRole("link", {
      name: /See the app/,
    });
    expect(link).toHaveAttribute("href", "/stowly");
  });
});

describe("Stowly navigation and search", () => {
  it("routes /stowly and lists it in the dock", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });
    expect(router.matchRoutes("/stowly").at(-1)?.routeId).toBe("/stowly");
    expect(navigation.map((item) => item.to)).toContain("/stowly");
  });

  it("describes the app without inventing a download, price, or rating", () => {
    const app = softwareApplicationJsonLd();
    expect(app).toMatchObject({
      "@type": "SoftwareApplication",
      name: stowly.name,
      operatingSystem: "Android",
      url: canonicalUrl("/stowly"),
    });
    if (stowly.apkUrl) expect(app).toHaveProperty("downloadUrl");
    else expect(app).not.toHaveProperty("downloadUrl");
    expect(app).not.toHaveProperty("offers");
    expect(app).not.toHaveProperty("aggregateRating");
  });

  it("is in the sitemap and llms.txt", () => {
    expect(sitemapXml()).toContain(`<loc>${canonicalUrl("/stowly")}</loc>`);
    expect(llmsTxt()).toContain(`[Stowly](${canonicalUrl("/stowly")})`);
  });
});
