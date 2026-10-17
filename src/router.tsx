import { QueryClient } from "@tanstack/react-query";
import { createRouter, type TrailingSlashOption } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // GitHub Pages serves each prerendered page as folder/index.html and 301-redirects /about to
    // /about/, so links must carry the trailing slash to reach the canonical URL without a redirect.
    // Typed as the full union so TanStack keeps route literals like to="/about" (it treats the union
    // as "never" at the type level); at runtime every rendered href still gets the slash.
    trailingSlash: "always" as TrailingSlashOption,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadDelay: 30,
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 0,
  });

  return router;
};
