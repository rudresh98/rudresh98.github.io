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

import { AppBand } from "@/components/portfolio/app-showcase";
import { navigation } from "@/lib/navigation";
import {
  canonicalUrl,
  llmsTxt,
  sitemapXml,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { splitMoney } from "@/lib/split-money";
import {
  splitMoneyScreenImages,
  splitMoneyScreenSizes,
} from "@/lib/split-money-screens";
import { routeTree } from "@/routeTree.gen";
import { Route } from "@/routes/split-money";

const SplitMoneyPage = Route.options.component!;

// Sections contain router Links, so render them as the root of a memory router.
async function renderInRouter(node: ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <>{node}</> }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
}

describe("Split Money page", () => {
  it("describes the app, every feature, and how it is built", async () => {
    await renderInRouter(<SplitMoneyPage />);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      splitMoney.name,
    );
    for (const item of [...splitMoney.features, ...splitMoney.build])
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
  });

  it("shows every screenshot at its real size with a caption", async () => {
    await renderInRouter(<SplitMoneyPage />);
    await screen.findByRole("heading", { level: 1 });
    for (const screenshot of splitMoney.screens) {
      const image = screen.getByRole("img", { name: screenshot.alt });
      const size = splitMoneyScreenSizes[screenshot.id];
      expect(image).toHaveAttribute(
        "src",
        splitMoneyScreenImages[screenshot.id],
      );
      expect(image).toHaveAttribute("width", String(size.width));
      expect(image).toHaveAttribute("height", String(size.height));
      expect(screen.getByText(screenshot.caption)).toBeInTheDocument();
    }
  });

  it("offers the Google Drive download in the intro and the closing call to action", async () => {
    await renderInRouter(<SplitMoneyPage />);
    const downloads = await screen.findAllByRole("link", {
      name: /Download APK.*opens Google Drive in a new tab/,
    });
    expect(downloads).toHaveLength(2);
    for (const download of downloads) {
      expect(download).toHaveAttribute("href", splitMoney.apkUrl);
      expect(download).toHaveAttribute("target", "_blank");
    }
    expect(
      screen.getAllByText(
        `Android APK · ${splitMoney.apkSize} · hosted on Google Drive`,
      ),
    ).toHaveLength(2);
  });

  it("is reachable from the Projects page band", async () => {
    await renderInRouter(
      <AppBand
        app={splitMoney}
        images={splitMoneyScreenImages}
        sizes={splitMoneyScreenSizes}
      />,
    );
    const band = await screen.findByRole("heading", { name: splitMoney.name });
    const link = within(band.parentElement!.parentElement!).getByRole("link", {
      name: /See the app/,
    });
    expect(link).toHaveAttribute("href", "/split-money");
  });
});

describe("Split Money navigation and search", () => {
  it("routes /split-money and lists it in the dock", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });
    expect(router.matchRoutes("/split-money").at(-1)?.routeId).toBe(
      "/split-money",
    );
    expect(navigation.map((item) => item.to)).toContain("/split-money");
  });

  it("describes the finance app and its download without a price, rating, or card", () => {
    const app = softwareApplicationJsonLd(splitMoney, ["/assets/home.jpg"]);
    expect(app).toMatchObject({
      "@type": "SoftwareApplication",
      name: splitMoney.name,
      operatingSystem: "Android",
      applicationCategory: "FinanceApplication",
      url: canonicalUrl("/split-money"),
      downloadUrl: splitMoney.apkUrl,
      fileSize: splitMoney.apkSize,
      screenshot: ["https://rudresh98.github.io/assets/home.jpg"],
    });
    expect(app).not.toHaveProperty("offers");
    expect(app).not.toHaveProperty("aggregateRating");
    expect(app).not.toHaveProperty("image");
  });

  it("keeps the site preview card and its own canonical URL", async () => {
    const head = await Route.options.head!({} as never);
    expect(head?.meta).not.toContainEqual(
      expect.objectContaining({ property: "og:image" }),
    );
    expect(head?.links).toEqual([
      { rel: "canonical", href: canonicalUrl("/split-money") },
    ]);
  });

  it("is in the sitemap and llms.txt", () => {
    expect(sitemapXml()).toContain(
      `<loc>${canonicalUrl("/split-money")}</loc>`,
    );
    expect(llmsTxt()).toContain(
      `[Split Money](${canonicalUrl("/split-money")})`,
    );
  });
});
