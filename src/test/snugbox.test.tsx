import { QueryClient } from "@tanstack/react-query";
import { act, render, screen, within } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import {
  SnugboxDownload,
  SnugboxFeature,
} from "@/components/portfolio/snugbox";
import { navigation } from "@/lib/navigation";
import {
  canonicalUrl,
  llmsTxt,
  sitemapXml,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { snugbox } from "@/lib/snugbox";
import { snugboxScreenSizes } from "@/lib/snugbox-screens";
import { routeTree } from "@/routeTree.gen";
import { Route } from "@/routes/snugbox";

const SnugboxPage = Route.options.component!;

// Sections contain router Links, so render them as the root of a memory router.
async function renderInRouter(node: ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <>{node}</> }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
}

describe("Snugbox download", () => {
  it("stays a disabled coming-soon button until an APK is published", () => {
    render(<SnugboxDownload apkUrl={undefined} />);
    const button = screen.getByRole("button", { name: /Download APK/ });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Coming soon/i);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/APK will be available here soon/)).toBeVisible();
  });

  it("becomes a real download once an APK URL is set", () => {
    render(<SnugboxDownload apkUrl="/downloads/snugbox.apk" />);
    const link = screen.getByRole("link", { name: /Download APK/ });
    expect(link).toHaveAttribute("href", "/downloads/snugbox.apk");
    expect(link).toHaveAttribute("download", "Snugbox.apk");
    expect(link).not.toHaveAttribute("target");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens an external file host in a new tab and says so", () => {
    const url = "https://drive.google.com/drive/folders/example";
    render(<SnugboxDownload apkUrl={url} />);
    const link = screen.getByRole("link", {
      name: /Download APK.*opens .+ in a new tab/,
    });
    expect(link).toHaveAttribute("href", url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).not.toHaveAttribute("download");
  });
});

describe("Snugbox page", () => {
  it("describes the app, every feature, and every screen", async () => {
    await renderInRouter(<SnugboxPage />);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      snugbox.name,
    );
    for (const feature of snugbox.features)
      expect(
        screen.getByRole("heading", { level: 3, name: feature.title }),
      ).toBeInTheDocument();
    for (const screenshot of snugbox.screens) {
      const image = screen.getByRole("img", { name: screenshot.alt });
      const size = snugboxScreenSizes[screenshot.id];
      expect(image).toHaveAttribute("width", String(size.width));
      expect(image).toHaveAttribute("height", String(size.height));
      expect(screen.getByText(screenshot.caption)).toBeInTheDocument();
    }
  });

  it("offers the download in the intro and the closing call to action", async () => {
    await renderInRouter(<SnugboxPage />);
    const downloads = await screen.findAllByRole(
      snugbox.apkUrl ? "link" : "button",
      { name: /Download APK/ },
    );
    expect(downloads).toHaveLength(2);
    for (const download of downloads)
      if (snugbox.apkUrl)
        expect(download).toHaveAttribute("href", snugbox.apkUrl);
      else expect(download).toBeDisabled();
  });

  it("is reachable from the Projects page band", async () => {
    await renderInRouter(<SnugboxFeature />);
    const band = await screen.findByRole("heading", { name: snugbox.name });
    const link = within(band.parentElement!.parentElement!).getByRole("link", {
      name: /See the app/,
    });
    expect(link).toHaveAttribute("href", "/snugbox");
  });
});

describe("Snugbox navigation and search", () => {
  it("routes /snugbox and lists it in the dock", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });
    expect(router.matchRoutes("/snugbox").at(-1)?.routeId).toBe("/snugbox");
    expect(navigation.map((item) => item.to)).toContain("/snugbox");
  });

  it("describes the app without inventing a download, price, or rating", () => {
    const app = softwareApplicationJsonLd();
    expect(app).toMatchObject({
      "@type": "SoftwareApplication",
      name: snugbox.name,
      operatingSystem: "Android",
      url: canonicalUrl("/snugbox"),
    });
    if (snugbox.apkUrl) expect(app).toHaveProperty("downloadUrl");
    else expect(app).not.toHaveProperty("downloadUrl");
    expect(app).not.toHaveProperty("offers");
    expect(app).not.toHaveProperty("aggregateRating");
  });

  it("shows the app card, not the site card, when the page is shared", async () => {
    const head = await Route.options.head!({} as never);
    const image = "https://rudresh98.github.io/snugbox-og.jpg";
    for (const tag of [
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: snugbox.shareImage.alt },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: snugbox.shareImage.alt },
    ])
      expect(head?.meta).toContainEqual(tag);
    expect(existsSync(join("public", snugbox.shareImage.path))).toBe(true);
  });

  it("gives search engines the app card and every screenshot", () => {
    const app = softwareApplicationJsonLd([
      "/assets/save-link.png",
      "https://cdn.example.com/home.png",
    ]);
    expect(app).toMatchObject({
      image: "https://rudresh98.github.io/snugbox-og.jpg",
      screenshot: [
        "https://rudresh98.github.io/assets/save-link.png",
        "https://cdn.example.com/home.png",
      ],
    });
    expect(softwareApplicationJsonLd()).not.toHaveProperty("screenshot");
  });

  it("is in the sitemap and llms.txt", () => {
    expect(sitemapXml()).toContain(`<loc>${canonicalUrl("/snugbox")}</loc>`);
    expect(llmsTxt()).toContain(`[Snugbox](${canonicalUrl("/snugbox")})`);
  });
});
