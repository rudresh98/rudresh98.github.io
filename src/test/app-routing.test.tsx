import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches individual project pages independently from the gallery", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const id of ['music-ai','supply-chain','anchor','izo-sdwan','reporting']) {
      expect(router.matchRoutes(`/projects/${id}`).at(-1)?.routeId).toBe('/projects/$projectId');
    }
    expect(router.matchRoutes('/projects').at(-1)?.routeId).toBe('/projects/');
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
