import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Testimonials } from "@/components/portfolio/testimonials";
import { testimonials } from "@/lib/testimonials";

describe("Testimonial carousel", () => {
  it("keeps every approved quote on its own labeled slide with working controls", () => {
    render(<Testimonials />);
    const slides = screen.getAllByRole("group", { hidden: true });
    expect(slides).toHaveLength(testimonials.length);
    slides.forEach((slide, index) =>
      expect(slide).toHaveAttribute(
        "aria-label",
        `Testimonial ${index + 1} of ${testimonials.length}`,
      ),
    );
    for (const entry of testimonials)
      expect(screen.getByText(entry.name)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous testimonial" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next testimonial" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /^Show testimonial \d+ of \d+$/ }),
    ).toHaveLength(testimonials.length);
  });
});
