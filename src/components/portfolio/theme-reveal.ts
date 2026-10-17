import { createAnimation } from "@/components/ui/skiper-ui/skiper26";
import { toggleTheme } from "@/lib/theme";

// Every theme control reveals the new theme as a blurred circle from the header toggle's corner.
export function toggleThemeWithReveal() {
  toggleTheme(createAnimation("circle", "top-right", true).css);
}
