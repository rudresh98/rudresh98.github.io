<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep portfolio content and verified achievements in typed browser-safe data modules, separate from presentation, so every view uses the same source of truth.
- Use TanStack file routes for named portfolio pages and the root route for the shared header and footer, preserving type-safe navigation.
- Keep primary navigation in a root-mounted bottom dock plus a ⌘K command palette, both built from the browser-safe navigation module, so every page, project, course, and certification stays one step away; the top bar holds only identity, search, and quick actions.
- Keep Projects as an Outlet layout with a gallery index and a dynamic case-study leaf resolved from portfolio data, so direct URLs and gallery links share the same content.
- Mount testimonials once in the root shell before the footer and keep their typed content separate from presentation, so every page renders the same user-supplied quotes; rotate them through a swipeable carousel so all remain reachable without stacking cards, and never invent or reword endorsements.
- Use Lovable Assets pointers for uploaded portrait and resume media so binary files stay outside the source repository.
- Contact submission opens a validated mailto draft until a real sending service is configured; never model it as successful email delivery.

- Keep illustrative project topology and layer descriptions in a typed browser-safe visual data module; reusable SVG renderers and Motion interactions keep presentation consistent without implying production screenshots.

- Keep appearance in global semantic tokens; the shared header toggle applies a document-level theme after hydration and remembers the local device preference, because appearance is not account data. Header and ⌘K theme changes share one Skiper26 View Transition reveal passed into the theme module, falling back to the color fade without View Transitions and switching instantly under reduced motion.
- Keep general skill explanations in a browser-safe data module and use the shared Radix tooltip with controlled hover, focus, and tap state so descriptions stay separate from verified experience claims.
- Keep decorative skill-icon mappings in a browser-safe module separate from presentation so every skill uses a consistent theme-aware symbol.
- Keep client-country geography in a typed browser-safe data module and lazy-load the home globe behind a client-only boundary, so realistic 3D never blocks navigation or changes the rest of Home's server rendering.
- Keep site URL, trailing-slash canonical paths, head metadata, JSON-LD, and sitemap pages in the browser-safe, asset-free SEO module; the root route sets shared social and structured-data defaults and each leaf route sets its own canonical link, so prerendered HTML, social previews, and the build-generated sitemap stay in sync with portfolio data.
- Keep every page's search title and description in the SEO module's `pageSeo` map (titles ≤60, descriptions ≤160 characters) so heads, sitemap, and llms.txt stay in sync; Training is the selling page, so there is no separate services page.
- Keep the Experience journey a decorative, scroll-linked road and car built from the existing experience data, with road geometry in the pure route-path module; it stays parked and fully drawn under reduced motion.
- Keep the Home page's Skiper19 scroll-drawn stroke decorative: aria-hidden, behind all Home content in the primary token, stretched to the page's full height by the pure stroke-path module, and fully drawn under reduced motion.
