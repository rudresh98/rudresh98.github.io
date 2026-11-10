import type { Faq } from "@/lib/faq";

// Questions render as visible H3s with their answer directly below, so search and AI answer
// engines can lift a self-contained answer; the same entries feed the page's FAQPage JSON-LD.
export function FaqSection({
  faqs,
  eyebrow = "Questions",
  title = "Frequently asked questions",
}: {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-border pb-16 pt-10"
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id="faq-heading" className="section-heading">
        {title}
      </h2>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-sm font-bold">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
