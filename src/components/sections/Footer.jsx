import Link from "next/link";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="bg-gradient-to-r from-ink via-ink to-accent bg-clip-text font-display text-2xl font-bold tracking-tight text-transparent">
              {profile.name}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{profile.role}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            <Link href="/about" className="transition-colors hover:text-accent">About</Link>
            <Link href="/projects" className="transition-colors hover:text-accent">Projects</Link>
            <Link href="/contact" className="transition-colors hover:text-accent">Contact</Link>
            <a href={`mailto:${profile.email}`} className="transition-colors hover:text-accent">Email</a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-hairline pt-8 sm:flex-row">
          <p className="order-2 text-sm text-ink-faint sm:order-1">
            © {year} {profile.name}. Built with Next.js.
          </p>

          <div className="order-1 flex items-center gap-4 sm:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/make-in-india.gif"
              alt="Made in India"
              width={72}
              height={36}
              className="h-8 w-auto opacity-80"
            />
            <a
              href="#main"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent-line hover:text-accent"
            >
              Back to top
              <ArrowUp size={14} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
