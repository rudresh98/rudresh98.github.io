// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import { llmsTxt, sitemapXml } from "./src/lib/seo";

// Emits sitemap.xml and llms.txt from portfolio data so every page is listed with its canonical URL.
const sitemap: Plugin = {
  name: "portfolio-sitemap",
  apply: "build",
  applyToEnvironment: (environment) => environment.name === "client",
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml() });
    this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt() });
  },
};

export default defineConfig({
  plugins: [sitemap],
  // GitHub Pages only serves static files, so skip the Cloudflare server bundle.
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Prerender every route to static HTML (crawling finds each /projects/<id> page).
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoSubfolderIndex: true,
      failOnError: true,
    },
    pages: [{ path: "/" }],
    // Route-agnostic shell written to 404.html; GitHub Pages serves it for unknown URLs
    // and the client router renders the matching route or the not-found page.
    spa: { enabled: true, maskPath: "/?shell", prerender: { outputPath: "/404" } },
  },
});
