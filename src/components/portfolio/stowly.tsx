import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stowly } from "@/lib/stowly";
import { stowlyFeatureIcons } from "@/lib/stowly-icons";
import {
  stowlyScreenImages as screenImages,
  stowlyScreenSize as screenSize,
} from "@/lib/stowly-screens";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

const isExternal = (url: string) => /^https?:\/\//.test(url);

// Until an APK URL is configured the button stays disabled and says so, rather than linking nowhere.
// A file host such as Google Drive opens in a new tab, since browsers ignore `download` across origins.
export function StowlyDownload({
  apkUrl,
  className,
}: {
  apkUrl: string | undefined;
  className?: string;
}) {
  const external = apkUrl ? isExternal(apkUrl) : false;
  const host =
    apkUrl && external
      ? (stowly.apkHost ?? new URL(apkUrl).hostname)
      : undefined;
  const note = apkUrl
    ? [
        `${stowly.platform} APK`,
        stowly.apkSize,
        host ? `hosted on ${host}` : undefined,
      ]
        .filter(Boolean)
        .join(" · ")
    : `The ${stowly.platform} APK will be available here soon.`;
  return (
    <div className={cn("stowly-download", className)}>
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
            <a href={apkUrl} download={`${stowly.name}.apk`}>
              <Download />
              Download APK
            </a>
          )}
        </Button>
      ) : (
        <Button disabled className="h-12 px-6 shadow-none">
          <Download />
          Download APK
          <span className="stowly-soon">Coming soon</span>
        </Button>
      )}
      <p className="stowly-download-note">{note}</p>
    </div>
  );
}

// Hero aside: both themes fanned together. The gallery below describes each screen, so these are decorative.
export function StowlyPhones() {
  return (
    <figure className="stowly-phones" aria-hidden="true">
      <div className="hero-map-head">
        <span>Fig. 01 — Home screen</span>
        <span className="hero-map-live">
          <i />
          {stowly.platform}
        </span>
      </div>
      <div className="stowly-phones-stage">
        <span className="about-portrait-grid" />
        <span className="stowly-phone stowly-phone-dark">
          <img
            src={screenImages["home-dark"]}
            alt=""
            {...screenSize}
            decoding="async"
          />
        </span>
        <span className="stowly-phone stowly-phone-light">
          <img
            src={screenImages["home-light"]}
            alt=""
            {...screenSize}
            decoding="async"
          />
        </span>
      </div>
    </figure>
  );
}

export function StowlyFeatures() {
  return (
    <section
      className="stowly-section"
      aria-labelledby="stowly-features-heading"
    >
      <Reveal>
        <p className="eyebrow">What it does</p>
        <h2 id="stowly-features-heading" className="section-heading">
          Saved links you actually come back to.
        </h2>
      </Reveal>
      <ul className="stowly-features">
        {stowly.features.map(({ title, body, icon }) => {
          const Icon = stowlyFeatureIcons[icon];
          return (
            <li key={title}>
              <span className="stowly-feature-icon">
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

export function StowlyScreens() {
  return (
    <section
      className="stowly-section"
      aria-labelledby="stowly-screens-heading"
    >
      <Reveal>
        <p className="eyebrow">Inside the app</p>
        <h2 id="stowly-screens-heading" className="section-heading">
          A closer look.
        </h2>
        <p className="section-description">
          Screens from the {stowly.platform} app in its light and dark themes.
        </p>
      </Reveal>
      <ul className="stowly-screens">
        {stowly.screens.map((screen) => (
          <li key={screen.id}>
            <figure>
              <span className="stowly-phone">
                <img
                  src={screenImages[screen.id]}
                  alt={screen.alt}
                  {...screenSize}
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
        ))}
      </ul>
    </section>
  );
}

export function StowlySteps() {
  return (
    <section className="stowly-section" aria-labelledby="stowly-steps-heading">
      <Reveal>
        <p className="eyebrow">How it works</p>
        <h2 id="stowly-steps-heading" className="section-heading">
          Three steps, no clutter.
        </h2>
      </Reveal>
      <ol className="stowly-steps">
        {stowly.steps.map((step, index) => (
          <li key={step.title}>
            <span className="stowly-step-number" aria-hidden="true">
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
export function StowlyCta() {
  return (
    <section className="collaboration-band">
      <Reveal className="container-shell collaboration-inner">
        <div>
          <p className="eyebrow">Get {stowly.name}</p>
          <h2>
            Stop losing the links
            <br />
            <span className="text-primary">you meant to come back to.</span>
          </h2>
          <p>
            {stowly.name} is built for {stowly.platform}.{" "}
            {stowly.apkUrl
              ? `Download the APK${stowly.apkHost ? ` from ${stowly.apkHost}` : ""} and open it on your phone to install. Android may ask you to allow installing apps from that source first.`
              : "The APK download will appear here as soon as it is published."}
          </p>
        </div>
        <div className="collaboration-actions">
          <StowlyDownload apkUrl={stowly.apkUrl} />
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
export function StowlyFeature() {
  return (
    <Reveal className="stowly-band">
      <span className="stowly-phone stowly-band-shot" aria-hidden="true">
        <img
          src={screenImages["home-light"]}
          alt=""
          {...screenSize}
          loading="lazy"
          decoding="async"
        />
      </span>
      <div>
        <p className="eyebrow">Personal project · {stowly.platform} app</p>
        <h2 className="stowly-band-title">{stowly.name}</h2>
        <p className="stowly-band-copy">{stowly.description}</p>
      </div>
      <Button asChild variant="outline" className="h-11 px-5 shadow-none">
        <Link to="/stowly">
          See the app <ArrowRight />
        </Link>
      </Button>
    </Reveal>
  );
}
