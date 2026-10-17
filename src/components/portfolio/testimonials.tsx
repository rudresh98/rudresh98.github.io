import { useEffect, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/testimonials";
import { Reveal } from "./motion";

// Quotes rotate through a swipeable carousel so every approved endorsement stays
// reachable without stacking seven full-height cards down the page.
export function Testimonials() {
  const reduced = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: reduced ? 0 : 22,
  });
  const [current, setCurrent] = useState(0);
  const [offScreen, setOffScreen] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    const sync = () => {
      setCurrent(embla.selectedScrollSnap());
      const visible = new Set(embla.slidesInView());
      setOffScreen(
        testimonials
          .map((_, index) => index)
          .filter((index) => !visible.has(index)),
      );
    };
    sync();
    embla.on("select", sync);
    embla.on("reInit", sync);
    return () => {
      embla.off("select", sync);
      embla.off("reInit", sync);
    };
  }, [embla]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      embla?.scrollNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      embla?.scrollPrev();
    }
  };

  const total = testimonials.length;

  return (
    <section
      className="testimonials-band"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-shell section">
        <Reveal>
          <p className="eyebrow">Testimonials</p>
          <h2 id="testimonials-heading" className="section-heading">
            Voices from collaboration<span className="text-primary">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div
            className="testimonials-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            onKeyDown={onKeyDown}
          >
            <div className="testimonials-viewport" ref={emblaRef}>
              <div className="testimonials-track">
                {testimonials.map((entry, index) => {
                  const hidden = offScreen.includes(index);
                  return (
                    <div
                      className="testimonials-slide"
                      key={entry.id}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`Testimonial ${index + 1} of ${total}`}
                      aria-hidden={hidden || undefined}
                      inert={hidden || undefined}
                    >
                      {/* Cards rise in as they first come into view, one column beat apart. */}
                      <motion.div
                        className="testimonial-motion"
                        initial={false}
                        whileInView={
                          reduced ? {} : { opacity: [0, 1], y: [18, 0] }
                        }
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.55,
                          delay: reduced ? 0 : (index % 2) * 0.09,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <figure className="testimonial-card">
                          <div className="testimonial-top">
                            <Quote size={23} aria-hidden="true" />
                          </div>
                          <blockquote>
                            {entry.quote
                              .split("\n\n")
                              .map((paragraph, paragraphIndex) => (
                                <p key={paragraphIndex}>{paragraph}</p>
                              ))}
                          </blockquote>
                          <figcaption className="testimonial-attribution">
                            {entry.name}
                          </figcaption>
                        </figure>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="testimonials-controls">
              <div className="testimonial-dots">
                {testimonials.map((entry, index) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="testimonial-dot"
                    aria-label={`Show testimonial ${index + 1} of ${total}`}
                    aria-current={current === index ? "true" : undefined}
                    onClick={() => embla?.scrollTo(index)}
                  />
                ))}
              </div>
              <div className="testimonials-meta">
                <p className="testimonials-count" aria-hidden="true">
                  <strong>{String(current + 1).padStart(2, "0")}</strong> /{" "}
                  {String(total).padStart(2, "0")}
                </p>
                <div className="testimonial-arrows">
                  <button
                    type="button"
                    className="testimonial-arrow"
                    aria-label="Previous testimonial"
                    onClick={() => embla?.scrollPrev()}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="testimonial-arrow"
                    aria-label="Next testimonial"
                    onClick={() => embla?.scrollNext()}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              Showing testimonial {current + 1} of {total}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
