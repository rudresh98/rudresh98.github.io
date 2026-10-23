import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/portfolio/auth";
import { Page, PageIntro } from "@/components/portfolio/content";
import { SocialLinks } from "@/components/portfolio/shell";
import { authCopy } from "@/lib/auth";
import { profile, emailDraft } from "@/lib/portfolio";
import { pageHead, pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import resume from "@/assets/rudresh-oza-resume.pdf";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      pageSeo["/contact"].title,
      pageSeo["/contact"].description,
      "/contact",
      {
        fullTitle: true,
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ],
      },
    ),
  component: Contact,
});
function Contact() {
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const auth = useAuth();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const fields = form.current?.elements;
    if (!auth.user || !fields) return;
    // Fill only empty fields, so nothing the visitor already typed is overwritten.
    for (const [name, value] of [
      ["name", auth.user.name],
      ["email", auth.user.email],
    ] as const) {
      const input = fields.namedItem(name);
      if (input instanceof HTMLInputElement && !input.value && value)
        input.value = value;
    }
  }, [auth.user]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim(),
      email = String(data.get("email") ?? "").trim(),
      subject = String(data.get("subject") ?? "").trim(),
      message = String(data.get("message") ?? "").trim();
    const next: Record<string, string> = {};
    if (!name) next["name"] = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next["email"] = "Please enter a valid email address.";
    if (!subject) next["subject"] = "Please enter a subject.";
    if (!message) next["message"] = "Please enter your message.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      window.location.href = emailDraft(name, email, subject, message);
      setStatus(
        "Your email draft is ready. Send it from your email app to complete your message.",
      );
    } catch {
      setStatus(
        `Could not open your email app. Please email ${profile.email} directly.`,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page>
      <PageIntro
        eyebrow="Get in touch"
        title="Let's Build Something Meaningful."
        description="Have an opportunity involving full-stack engineering, cloud platforms, Generative AI, or data systems? I'd be happy to connect."
      />
      <section className="section grid gap-14 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-xl font-bold">A conversation is a good start.</h2>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            I'm interested in international remote teams that value engineering
            quality, ownership, collaboration, and continuous learning.
          </p>
          <a
            className="mt-7 flex items-center gap-3 break-all text-sm font-semibold text-primary"
            href={`mailto:${profile.email}`}
          >
            <Mail size={17} />
            {profile.email}
          </a>
          <p className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin size={17} />
            Jaipur, India
          </p>
          <div className="mt-7">
            <SocialLinks />
          </div>
          <Button asChild variant="outline" className="mt-8 shadow-none">
            <a href={resume} download="Rudresh-Oza-Resume.pdf">
              <Download />
              Download Resume
            </a>
          </Button>
        </div>
        <form ref={form} onSubmit={submit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {field("name", "Name", "Your name")}
            {field("email", "Work email", "you@company.com", "email")}
          </div>
          {field("subject", "Subject", "An opportunity to build together")}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-xs font-semibold"
            >
              Message
            </label>
            <textarea
              className="contact-input min-h-36 resize-y"
              name="message"
              id="message"
              placeholder="Tell me about your team or project…"
              aria-invalid={!!errors["message"]}
              aria-describedby={errors["message"] ? "message-error" : undefined}
            />
            {errors["message"] && (
              <p id="message-error" className="mt-2 text-xs text-destructive">
                {errors["message"]}
              </p>
            )}
          </div>
          {auth.status === "signed-out" && (
            <p className="text-xs leading-6 text-muted-foreground">
              <button
                type="button"
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:underline disabled:opacity-60"
                disabled={auth.pending}
                onPointerEnter={auth.warm}
                onFocus={auth.warm}
                onClick={auth.signIn}
              >
                {authCopy.signIn}
              </button>{" "}
              {authCopy.contactPrompt}
            </p>
          )}
          <p className="text-xs leading-6 text-muted-foreground">
            Opens a draft in your email app. Your message is sent only when you
            send the email.
          </p>
          <Button
            type="submit"
            disabled={busy}
            className="h-11 px-5 shadow-none"
          >
            {busy ? "Opening draft…" : "Open Email Draft"}
            <ArrowUpRight />
          </Button>
          <p role="status" className="text-sm leading-7 text-primary">
            {status}
          </p>
        </form>
      </section>
    </Page>
  );
  function field(
    name: string,
    label: string,
    placeholder: string,
    type = "text",
  ) {
    return (
      <div>
        <label htmlFor={name} className="mb-2 block text-xs font-semibold">
          {label}
        </label>
        <input
          className="contact-input"
          name={name}
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={
            name === "name" ? "name" : name === "email" ? "email" : "off"
          }
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <p id={`${name}-error`} className="mt-2 text-xs text-destructive">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
}
