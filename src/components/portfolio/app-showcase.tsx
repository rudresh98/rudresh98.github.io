import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppShowcase } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

// Every app page is built from these sections; each app's copy lives in its data module and its
// screenshots and icons in its own asset-keyed modules, passed in by the route.
type ScreenSize = { width: number; height: number };
type ScreenMedia<ScreenId extends string> = {
  images: Record<ScreenId, string>;
  sizes: Record<ScreenId, ScreenSize>;
};

const isExternal = (url: string) => /^https?:\/\//.test(url);

// Until an APK URL is configured the button stays disabled and says so, rather than linking nowhere.
// A file host such as Google Drive opens in a new tab, since browsers ignore `download` across origins.
export function AppDownload({
  app,
  className,
}: {
  app: AppShowcase;
  className?: string;
}) {
  const { apkUrl } = app;
  const external = apkUrl ? isExternal(apkUrl) : false;
  const host =
    apkUrl && external ? (app.apkHost ?? new URL(apkUrl).hostname) : undefined;
  const note = apkUrl
    ? [
        `${app.platform} APK`,
        app.apkSize,
        host ? `hosted on ${host}` : undefined,
      ]
        .filter(Boolean)
        .join(" · ")
    : `The ${app.platform} APK will be available here soon.`;
  return (
    <div className={cn("app-download", className)}>
      {apkUrl ? (
        <Button asChild className="h-12 px-6 shadow-none">
          {external ? (
            <a href={apkUrl} target="_blank" rel="noopener noreferrer">
              <Download />
              Download APK
              <ArrowUpRight />
              <span className="sr-only"> (opens {host} in a new tab)</span>
            </a>
          ) : (
            <a href={apkUrl} download={`${app.name}.apk`}>
              <Download />
              Download APK
            </a>
          )}
        </Button>
      ) : (
        <Button disabled className="h-12 px-6 shadow-none">
          <Download />
          Download APK
          <span className="app-soon">Coming soon</span>
        </Button>
      )}
      <p className="app-download-note">{note}</p>
    </div>
  );
}

// Intro aside: two screens fanned together. The gallery below describes each screen, so these are decorative.
export function AppPhones<ScreenId extends string>({
  app,
  images,
  sizes,
}: { app: AppShowcase<string, ScreenId> } & ScreenMedia<ScreenId>) {
  const { label, back, front } = app.hero;
  return (
    <figure className="app-phones" aria-hidden="true">
      <div className="hero-map-head">
        <span>Fig. 01 — {label}</span>
        <span className="hero-map-live">
          <i />
          {app.platform}
        </span>
      </div>
      <div className="app-phones-stage">
        <span className="about-portrait-grid" />
        <span className="app-phone app-phone-back">
          <img src={images[back]} alt="" {...sizes[back]} decoding="async" />
        </span>
        <span className="app-phone app-phone-front">
          <img src={images[front]} alt="" {...sizes[front]} decoding="async" />
        </span>
      </div>
    </figure>
  );
}

export function AppFeatures<FeatureIcon extends string>({
  app,
  icons,
}: {
  app: AppShowcase<FeatureIcon>;
  icons: Record<FeatureIcon, LucideIcon>;
}) {
  return (
    <section className="app-section" aria-labelledby="app-features-heading">
      <Reveal>
        <p className="eyebrow">What it does</p>
        <h2 id="app-features-heading" className="section-heading">
          {app.headings.features}
        </h2>
      </Reveal>
      <ul className="app-features">
        {app.features.map(({ title, body, icon }) => {
          const Icon: LucideIcon = icons[icon];
          return (
            <li key={title}>
              <span className="app-feature-icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AppScreens<ScreenId extends string>({
  app,
  images,
  sizes,
}: { app: AppShowcase<string, ScreenId> } & ScreenMedia<ScreenId>) {
  return (
    <section className="app-section" aria-labelledby="app-screens-heading">
      <Reveal>
        <p className="eyebrow">Inside the app</p>
        <h2 id="app-screens-heading" className="section-heading">
          {app.headings.screens.title}
        </h2>
        <p className="section-description">
          {app.headings.screens.description}
        </p>
      </Reveal>
      <ul className="app-screens">
        {app.screens.map((screen) => {
          const size = sizes[screen.id];
          // Wide captures such as a theme sheet span the row so they stay legible.
          const wide = size.width > size.height;
          return (
            <li key={screen.id} className={cn(wide && "app-screen-wide")}>
              <figure>
                <span className={wide ? "app-frame" : "app-phone"}>
                  <img
                    src={images[screen.id]}
                    alt={screen.alt}
                    {...size}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <figcaption>
                  <strong>{screen.title}</strong>
                  <span>{screen.caption}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AppSteps({ app }: { app: AppShowcase }) {
  return (
    <section className="app-section" aria-labelledby="app-steps-heading">
      <Reveal>
        <p className="eyebrow">How it works</p>
        <h2 id="app-steps-heading" className="section-heading">
          {app.headings.steps}
        </h2>
      </Reveal>
      <ol className="app-steps">
        {app.steps.map((step, index) => (
          <li key={step.title}>
            <span className="app-step-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// How the app is built, for apps that describe it; renders nothing otherwise.
export function AppBuild({ app }: { app: AppShowcase }) {
  if (!app.build?.length) return null;
  return (
    <section className="app-section" aria-labelledby="app-build-heading">
      <Reveal>
        <p className="eyebrow">How it's built</p>
        <h2 id="app-build-heading" className="section-heading">
          {app.headings.build}
        </h2>
      </Reveal>
      <ul className="app-steps app-build">
        {app.build.map((item) => (
          <li key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Shares the Collaboration and Training CTA card.
export function AppCta({ app }: { app: AppShowcase }) {
  const [lead, accent] = app.headings.cta;
  return (
    <section className="collaboration-band">
      <Reveal className="container-shell collaboration-inner">
        <div>
          <p className="eyebrow">Get {app.name}</p>
          <h2>
            {lead}
            <br />
            <span className="text-primary">{accent}</span>
          </h2>
          <p>
            {app.name} is built for {app.platform}.{" "}
            {app.apkUrl
              ? `Download the APK${app.apkHost ? ` from ${app.apkHost}` : ""} and open it on your phone to install. Android may ask you to allow installing apps from that source first.`
              : "The APK download will appear here as soon as it is published."}
          </p>
        </div>
        <div className="collaboration-actions">
          <AppDownload app={app} />
          <Link
            to="/contact"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Questions or feedback? Get in touch
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

// Compact band on the Projects page so each app stays one click from the case studies.
export function AppBand<ScreenId extends string>({
  app,
  images,
  sizes,
}: { app: AppShowcase<string, ScreenId> } & ScreenMedia<ScreenId>) {
  const shot = app.hero.front;
  return (
    <Reveal className="app-band">
      <span className="app-phone app-band-shot" aria-hidden="true">
        <img
          src={images[shot]}
          alt=""
          {...sizes[shot]}
          loading="lazy"
          decoding="async"
        />
      </span>
      <div>
        <p className="eyebrow">Personal project · {app.platform} app</p>
        <h2 className="app-band-title">{app.name}</h2>
        <p className="app-band-copy">{app.description}</p>
      </div>
      <Button asChild variant="outline" className="h-11 px-5 shadow-none">
        <Link to={app.path}>
          See the app <ArrowRight />
        </Link>
      </Button>
    </Reveal>
  );
}
