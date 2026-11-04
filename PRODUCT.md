# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

In priority order:

1. **Hiring managers and recruiters for international remote roles.** Engineering leads evaluating Rudresh Oza for a Forward Deployed Engineer or full-stack and GenAI engineering role, usually partway through a hiring process and comparing several candidates.
2. **Freelance and project clients.** Founders and teams deciding whether to commission an app, cloud platform, or AI agent.
3. **Peers and the developer community.** Engineers following the work, including the personal apps Snugbox and Split Money.
4. **Training buyers.** Companies, colleges, and individuals looking at the GenAI, full-stack, backend, database, cloud infrastructure, Forward Deployed Engineering, and Databricks courses. Training stays a real offering with its own pages, but it ranks below the three audiences above.

## Product Purpose

A personal portfolio that shows what Rudresh Oza builds and how, so the right people get in touch. A visit succeeds when the visitor does one of these:

- opens the contact form's pre-filled email draft, or emails directly
- downloads the resume PDF
- connects on LinkedIn or checks the code on GitHub

A training enquiry is welcome, but it is not a primary success signal.

## Positioning

Forward deployed in practice. Rudresh works inside client teams and carries a system from the first conversation to production. The client work spans the United States, the United Kingdom, Australia, Germany, Switzerland, Sweden, China, and India. The current role is Forward Deployed Engineer at Celebal Technologies (Feb 2026 to present), building AI supply chain solutions. Before that, as a Software Engineer at HornBlower Encore Studio (May 2023 to Feb 2026), Rudresh worked on Anchor, an operations and reservations platform. Future work should show this embedded, client-side delivery, not a list of technologies.

## Operating Context

- Visitors arrive from LinkedIn, the resume, search, and shared links, often on a phone first.
- A hiring evaluation is short and comparative: role, proof, and a way to reach Rudresh need to be clear quickly. Deeper evidence lives in the project case studies and the experience timeline.
- Rudresh is based in Jaipur, India (IST, UTC+5:30) and works remotely across time zones.

## Capabilities and Constraints

- Pages: Home, About, Expertise, Experience, Projects with a case-study page per project, Certifications, Training with a page per course, the Snugbox and Split Money app pages, Contact, and Accessibility. A bottom dock and a ⌘K command palette reach every page.
- Contact opens a validated, pre-filled email draft in the visitor's mail app. No sending service is configured, so nothing may claim a message was sent.
- Optional Google sign-in only fills the header account control and empty Contact fields. The site has no other account features and must not imply any.
- Theme and reading preferences are device settings, not account data.
- The site is prerendered with TanStack Start and deployed to GitHub Pages. It is also connected to Lovable, so published git history must not be rewritten.
- App download buttons stay disabled ("coming soon") until a real APK URL exists.

## Brand Commitments

- Name: Rudresh Oza. Role title as used across the site: Forward Deployed Engineer (FDE).
- Portrait and resume are uploaded media served through Lovable Assets.
- Copy is in the first person and plain.

## Evidence on Hand

- Verified achievements in `src/lib/portfolio.ts`:
  - 6+ years of professional engineering
  - 200,000+ clients served by transfer and split (Anchor)
  - 15,000+ redemption transactions in six months
  - 40% faster transfer and split transactions
  - 5,000+ students trained over five years
- 13 projects with case studies in `src/lib/portfolio.ts`, some with live links (for example Pollstar and Genie AI on Google Play). Their architecture diagrams are illustrative, not production screenshots.
- Seven real testimonials in `src/lib/testimonials.ts`. They are never invented, reworded, or extended.
- Certifications from Anthropic, Databricks Academy, and Microsoft, with verification links, in `src/lib/certifications.ts`.
- Client countries in `src/lib/client-countries.ts`.
- Course syllabi in `src/lib/training.ts`. Some drafted course outlines still await Rudresh's review (see `roadmap.md`).
- Not on hand, and not to be fabricated: client logos, production screenshots of client systems, pricing or rates, extra metrics, endorsements, and press.

## Product Principles

1. **Show the deployment, not the stack.** Lead with what was built, for whom, and what changed, and let technologies support that story.
2. **Every claim is verifiable.** Use only figures, quotes, credentials, and countries recorded in the data modules, and label illustrations as illustrations.
3. **Make contact easy to find.** Email, resume, and LinkedIn are always close at hand, because they are what a successful visit ends with.
4. **Respect the evaluator's time.** A hiring manager should understand the role, the proof, and how to get in touch quickly. Depth is there for anyone who wants it.

## Accessibility & Inclusion

- Visitors can set text size, contrast, motion, font, and link underlines on the Accessibility page. These apply before first paint.
- Reduced motion, whether set by the OS or chosen on the site, is honored everywhere.
- Font sizes stay in `rem` so text scaling works.
- The accessibility statement names only features the site really has.
