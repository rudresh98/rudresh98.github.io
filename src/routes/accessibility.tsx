import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Page, PageIntro } from "@/components/portfolio/content";
import { useAccessibility } from "@/components/portfolio/accessibility";
import {
  accessibilityFeatures,
  defaultPrefs,
  settingOptions,
  textSizeOptions,
  type AccessibilityPrefs,
  type TextSize,
} from "@/lib/accessibility";
import { profile } from "@/lib/portfolio";
import { pageHead, pageSeo, breadcrumbJsonLd } from "@/lib/seo";
export const Route = createFileRoute("/accessibility")({
  head: () =>
    pageHead(
      pageSeo["/accessibility"].title,
      pageSeo["/accessibility"].description,
      "/accessibility",
      {
        fullTitle: true,
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Accessibility", path: "/accessibility" },
          ]),
        ],
      },
    ),
  component: Accessibility,
});
function Accessibility() {
  const { prefs, systemReducedMotion, update, reset } = useAccessibility();
  const [status, setStatus] = useState("");
  const save = (change: Partial<AccessibilityPrefs>) => {
    update(change);
    setStatus("Saved on this device.");
  };
  const customized = (
    Object.keys(defaultPrefs) as (keyof AccessibilityPrefs)[]
  ).some((key) => prefs[key] !== defaultPrefs[key]);
  return (
    <Page>
      <PageIntro
        eyebrow="Accessibility"
        title="Read this site your way."
        description="Adjust text size, contrast, motion, and type. Changes apply instantly on every page and stay on this device."
      />
      <section
        aria-labelledby="display-settings-heading"
        className="pb-16 pt-4"
      >
        <div className="rounded-lg border border-border bg-card p-5 md:p-8">
          <h2 id="display-settings-heading" className="text-xl font-bold">
            Display settings
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Saved in this browser only; nothing is sent anywhere.
          </p>

          <h3 id="text-size-heading" className="mt-8 text-sm font-semibold">
            Text size
          </h3>
          <RadioGroup
            value={prefs.textSize}
            onValueChange={(value) => save({ textSize: value as TextSize })}
            aria-labelledby="text-size-heading"
            className="mt-3 grid-cols-3 gap-3"
          >
            {/* Each card is the radio itself, so narrow screens at large text keep the labels whole. */}
            {textSizeOptions.map((option) => (
              <RadioGroupPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer flex-col items-center gap-2 rounded-md border border-border px-2 py-4 text-center data-[state=checked]:border-primary data-[state=checked]:bg-accent"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 items-end font-bold leading-none"
                  style={{ fontSize: `calc(1.5rem * ${option.scale})` }}
                >
                  Aa
                </span>
                <span className="text-sm font-semibold">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.scale * 100}%
                </span>
                <RadioGroupPrimitive.Indicator className="absolute right-2 top-2 text-primary">
                  <Check className="size-4" aria-hidden="true" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroup>

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {settingOptions.map((option) => {
              // The OS setting already reduces motion; the switch can't turn it back on.
              const fromDevice =
                option.key === "reduceMotion" && systemReducedMotion;
              const id = `setting-${option.key}`;
              return (
                <li
                  key={option.key}
                  className="flex items-start justify-between gap-6 py-5"
                >
                  <div>
                    <Label htmlFor={id} className="text-sm font-semibold">
                      {option.label}
                    </Label>
                    <p
                      id={`${id}-description`}
                      className="mt-1 text-sm leading-6 text-muted-foreground"
                    >
                      {option.description}
                      {fromDevice &&
                        " Your device already asks for reduced motion, so it stays on."}
                    </p>
                  </div>
                  <Switch
                    id={id}
                    checked={prefs[option.key] || fromDevice}
                    disabled={fromDevice}
                    onCheckedChange={(checked) =>
                      save({ [option.key]: checked })
                    }
                    aria-describedby={`${id}-description`}
                    className="mt-0.5 data-[state=unchecked]:bg-muted-foreground"
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              className="shadow-none"
              disabled={!customized}
              onClick={() => {
                reset();
                setStatus("Settings reset to defaults.");
              }}
            >
              <RotateCcw aria-hidden="true" />
              Reset to defaults
            </Button>
            <p role="status" className="text-sm text-muted-foreground">
              {status}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="accessibility-statement-heading"
        className="border-t border-border pb-16 pt-10"
      >
        <p className="eyebrow">Accessibility statement</p>
        <h2 id="accessibility-statement-heading" className="section-heading">
          What the site already does.
        </h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-2">
          {accessibilityFeatures.map((feature) => (
            <li key={feature.title}>
              <h3 className="text-sm font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {feature.detail}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm leading-7 text-muted-foreground">
          Found something hard to use?{" "}
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent("Accessibility feedback")}`}
            className="font-semibold text-primary"
          >
            Email {profile.email}
          </a>{" "}
          and I'll look into it.
        </p>
      </section>
    </Page>
  );
}
