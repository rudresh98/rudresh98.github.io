import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  useRouterState,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  ScriptOnce,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer } from "@/components/portfolio/shell";
import { Dock } from "@/components/portfolio/dock";
import { CommandPaletteProvider } from "@/components/portfolio/command-palette";
import { Testimonials } from "@/components/portfolio/testimonials";
import { ShareLauncher } from "@/components/portfolio/share-launcher";
import { AccessibilityProvider } from "@/components/portfolio/accessibility";
import { accessibilityBootScript } from "@/lib/accessibility";
import { defaultMeta, site, siteJsonLd } from "@/lib/seo";
import { isPreviewSearch } from "@/lib/navigation";
import portrait from "@/assets/rudresh-oza.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...defaultMeta(),
        { "script:ld+json": siteJsonLd(portrait) },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        {
          rel: "icon",
          href: "/icon-192.png",
          type: "image/png",
          sizes: "192x192",
        },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          // Atkinson Hyperlegible Next backs the Accessibility page's readable font; its files only download when used.
          href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@200..800&family=Manrope:wght@400;500;600;650;700;800&display=swap",
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    // The boot script sets accessibility attributes on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ScriptOnce>{accessibilityBootScript}</ScriptOnce>
        {/* Head meta keeps one tag per name, so Search Console tokens render here to keep every owner verified. */}
        {site.googleSiteVerifications.map((token) => (
          <meta key={token} name="google-site-verification" content={token} />
        ))}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({
    select: (s) => (s.resolvedLocation ?? s.location).pathname,
  });
  // Dock hover previews frame pages with ?preview=1: render the page alone, without dock or palette.
  const preview = useRouterState({
    select: (s) => isPreviewSearch(s.location.search),
  });
  useEffect(() => {
    document.documentElement.toggleAttribute("data-preview", preview);
  }, [preview]);
  const [animate, setAnimate] = useState(false);
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (previous.current !== null && previous.current !== pathname) {
      setAnimate(true);
    }
    previous.current = pathname;
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <AccessibilityProvider>
        <CommandPaletteProvider disabled={preview}>
          <Header />
          <div
            key={pathname}
            className={animate ? "page-transition" : undefined}
          >
            <Outlet />
          </div>
          <Testimonials />
          <Footer />
          {!preview && <Dock />}
          {!preview && <ShareLauncher />}
        </CommandPaletteProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}
