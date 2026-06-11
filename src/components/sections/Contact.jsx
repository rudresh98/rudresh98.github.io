"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import {
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  Stack,
  EnvelopeSimple,
  DownloadSimple,
  PaperPlaneTilt,
  CircleNotch,
} from "@phosphor-icons/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

const EMAILJS = {
  service: "service_jfu05ii",
  template: "template_ibljxpb",
  publicKey: "user_mmcXS3SIG6smGM1TZplKQ",
};

const ICONS = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
  instagram: InstagramLogo,
  stackoverflow: Stack,
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (!form.email.trim()) er.email = "Please enter your email.";
    else if (!isEmail(form.email.trim())) er.email = "That email doesn't look right.";
    if (!form.message.trim()) er.message = "Add a short message.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS.service,
        EMAILJS.template,
        {
          form_subject: "Portfolio contact",
          form_name: form.name.trim(),
          form_id: form.email.trim(),
          to_name: profile.name,
          message: form.message.trim(),
        },
        { publicKey: EMAILJS.publicKey }
      );
      toast.success("Message sent. I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Couldn't send your message. Please try again or email me directly.");
    } finally {
      setSending(false);
    }
  };

  const field = "bg-panel h-12 rounded-xl";

  return (
    <section id="contact" className="section">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Contact" title="Let's build something." />
          <Reveal delay={0.1} className="mt-6 max-w-[46ch] text-lg text-ink-soft">
            Have a project, a role, or an idea worth shipping? Send a note and
            I&apos;ll reply within a day or two.
          </Reveal>

          <Reveal delay={0.16} className="mt-8 flex flex-wrap gap-3">
            {socials.map((s) => {
              const Icon = ICONS[s.icon] || Stack;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-12 place-items-center rounded-xl border border-hairline bg-panel text-ink-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-line hover:bg-accent-tint hover:text-accent"
                >
                  <Icon size={20} weight="bold" />
                </a>
              );
            })}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="grid size-12 place-items-center rounded-xl border border-hairline bg-panel text-ink-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-line hover:bg-accent-tint hover:text-accent"
            >
              <EnvelopeSimple size={20} weight="bold" />
            </a>
          </Reveal>

          <Reveal delay={0.22} className="mt-8">
            <MagneticButton
              href={profile.resume}
              download="Rudresh-Oza-Resume.pdf"
              variant="ghost"
              Icon={DownloadSimple}
            >
              Download résumé
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={28}>
          <form onSubmit={onSubmit} noValidate className="bezel">
            <div className="bezel-core flex flex-col gap-4 p-6 sm:p-8">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-faint">
                  Name
                </label>
                <Input id="name" type="text" value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" className={field} />
                {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-faint">
                  Email
                </label>
                <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" className={field} />
                {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-faint">
                  Message
                </label>
                <Textarea id="message" rows={4} value={form.message} onChange={set("message")} placeholder="A brief about what you need..." className="bg-panel resize-none rounded-xl" />
                {errors.message && <p className="mt-1.5 text-sm text-destructive">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="group mt-1 h-12 rounded-full font-display font-semibold"
              >
                {sending ? (
                  <>
                    <CircleNotch size={18} weight="bold" className="animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <PaperPlaneTilt size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
