import Link from "next/link";

export const metadata = { title: "Page not found — Rudresh Oza" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-accent">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          This page wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          The link may be broken or the page may have moved. Let&apos;s get you
          back to solid ground.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-display font-semibold text-canvas transition-colors duration-300 hover:bg-accent hover:text-accent-contrast"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
