import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { snugbox } from "@/lib/snugbox";
import { snugboxFeatureIcons } from "@/lib/snugbox-icons";
import {
  snugboxScreenImages as screenImages,
  snugboxScreenSizes as screenSizes,
} from "@/lib/snugbox-screens";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

const isExternal = (url: string) => /^https?:\/\//.test(url);

// Until an APK URL is configured the button stays disabled and says so, rather than linking nowhere.
// A file host such as Google Drive opens in a new tab, since browsers ignore `download` across origins.
export function SnugboxDownload({
  apkUrl,
  className,
}: {
  apkUrl: string | undefined;
  className?: string;
}) {
  const external = apkUrl ? isExternal(apkUrl) : false;
  const host =
    apkUrl && external
      ? (snugbox.apkHost ?? new URL(apkUrl).hostname)
      : undefined;
  const note = apkUrl
    ? [
        `${snugbox.platform} APK`,
        snugbox.apkSize,
        host ? `hosted on ${host}` : undefined,
      ]
        .filter(Boolean)
        .join(" · ")
    : `The ${snugbox.platform} APK will be available here soon.`;
  return (
    <div className={cn("snugbox-download", className)}>
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
            <a href={apkUrl} download={`${snugbox.name}.apk`}>
              <Download />
              Download APK
            </a>
          )}
        </Button>
      ) : (
        <Button disabled className="h-12 px-6 shadow-none">
          <Download />
          Download APK
          <span className="snugbox-soon">Coming soon</span>
        </Button>
      )}
      <p className="snugbox-download-note">{note}</p>
    </div>
  );
}

// Hero aside: settings and home fanned together. The gallery below describes each screen, so these are decorative.
export function SnugboxPhones() {
  return (
    <figure className="snugbox-phones" aria-hidden="true">
      <div className="hero-map-head">
        <span>Fig. 01 — Home and settings</span>
        <span className="hero-map-live">
          <i />
          {snugbox.platform}
        </span>
      </div>
      <div className="snugbox-phones-stage">
        <span className="about-portrait-grid" />
        <span className="snugbox-phone snugbox-phone-back">
          <img
            src={screenImages.settings}
            alt=""
            {...screenSizes.settings}
            decoding="async"
          />
        </span>
        <span className="snugbox-phone snugbox-phone-front">
          <img
            src={screenImages.home}
            alt=""
            {...screenSizes.home}
            decoding="async"
          />
        </span>
      </div>
    </figure>
  );
}

export function SnugboxFeatures() {
  return (
    <section
      className="snugbox-section"
      aria-labelledby="snugbox-features-heading"
    >
      <Reveal>
        <p className="eyebrow">What it does</p>
        <h2 id="snugbox-features-heading" className="section-heading">
          Saved links you actually come back to.
        </h2>
      </Reveal>
      <ul className="snugbox-features">
        {snugbox.features.map(({ title, body, icon }) => {
          const Icon = snugboxFeatureIcons[icon];
          return (
            <li key={title}>
              <span className="snugbox-feature-icon">
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

export function SnugboxScreens() {
  return (
    <section
      className="snugbox-section"
      aria-labelledby="snugbox-screens-heading"
    >
      <Reveal>
        <p className="eyebrow">Inside the app</p>
        <h2 id="snugbox-screens-heading" className="section-heading">
          A closer look.
        </h2>
        <p className="section-description">
          Screens from the {snugbox.platform} app, and its five color themes in
          light and dark.
        </p>
      </Reveal>
      <ul className="snugbox-screens">
        {snugbox.screens.map((screen) => {
          const size = screenSizes[screen.id];
          // Wide captures such as the theme sheet span the row so they stay legible.
          const wide = size.width > size.height;
          return (
            <li key={screen.id} className={cn(wide && "snugbox-screen-wide")}>
              <figure>
                <span className={wide ? "snugbox-frame" : "snugbox-phone"}>
                  <img
                    src={screenImages[screen.id]}
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

export function SnugboxSteps() {
  return (
    <section
      className="snugbox-section"
      aria-labelledby="snugbox-steps-heading"
    >
      <Reveal>
        <p className="eyebrow">How it works</p>
        <h2 id="snugbox-steps-heading" className="section-heading">
          Three steps, no clutter.
        </h2>
      </Reveal>
      <ol className="snugbox-steps">
        {snugbox.steps.map((step, index) => (
          <li key={step.title}>
            <span className="snugbox-step-number" aria-hidden="true">
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

// Shares the Collaboration and Training CTA card.
export function SnugboxCta() {
  return (
    <section className="collaboration-band">
      <Reveal className="container-shell collaboration-inner">
        <div>
          <p className="eyebrow">Get {snugbox.name}</p>
          <h2>
            Stop losing the links
            <br />
            <span className="text-primary">you meant to come back to.</span>
          </h2>
          <p>
            {snugbox.name} is built for {snugbox.platform}.{" "}
            {snugbox.apkUrl
              ? `Download the APK${snugbox.apkHost ? ` from ${snugbox.apkHost}` : ""} and open it on your phone to install. Android may ask you to allow installing apps from that source first.`
              : "The APK download will appear here as soon as it is published."}
          </p>
        </div>
        <div className="collaboration-actions">
          <SnugboxDownload apkUrl={snugbox.apkUrl} />
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

// Compact band on the Projects page so the app stays one click from the case studies.
export function SnugboxFeature() {
  return (
    <Reveal className="snugbox-band">
      <span className="snugbox-phone snugbox-band-shot" aria-hidden="true">
        <img
          src={screenImages.home}
          alt=""
          {...screenSizes.home}
          loading="lazy"
          decoding="async"
        />
      </span>
      <div>
        <p className="eyebrow">Personal project · {snugbox.platform} app</p>
        <h2 className="snugbox-band-title">{snugbox.name}</h2>
        <p className="snugbox-band-copy">{snugbox.description}</p>
      </div>
      <Button asChild variant="outline" className="h-11 px-5 shadow-none">
        <Link to="/snugbox">
          See the app <ArrowRight />
        </Link>
      </Button>
    </Reveal>
  );
}
