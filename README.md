# Rudresh Oza — Portfolio

Personal portfolio of Rudresh Oza, Forward Deployed Engineer (FDE) in Jaipur, India, covering full-stack apps, Azure and AWS cloud platforms, and Generative AI agent systems.

**Live site**: https://rudresh98.github.io. Every push to `master` is tested, prerendered, and deployed to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Pages

| Path                 | What it shows                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                  | Introduction, headline metrics, featured projects, architecture flow, and an interactive client globe |
| `/about`             | Background, portrait, education, and training and mentoring                                           |
| `/expertise`         | Skills with icons and descriptive tooltips                                                            |
| `/experience`        | Career timeline drawn as a scroll-linked road                                                         |
| `/projects`          | Filterable project gallery                                                                            |
| `/projects/<id>`     | Case study for each project, with an illustrative architecture diagram                                |
| `/certifications`    | Verified credentials with issuer filter and verification links                                        |
| `/training`          | Courses and delivery formats for corporate and individual training                                    |
| `/training/<course>` | Full syllabus for each course                                                                         |
| `/contact`           | Contact form that opens a pre-filled email draft in your mail app                                     |
| `/accessibility`     | Reading preferences (text size, contrast, motion, font, links) and statement                          |

Every page shares a bottom navigation dock, a ⌘K / Ctrl+K command palette, a light/dark theme toggle, a share launcher, and the testimonials carousel.

## Tech stack

- [TanStack Start](https://tanstack.com/start) and TanStack Router (file-based, type-safe routes) on React 19
- Vite 8, TypeScript, Tailwind CSS 4, and Radix UI primitives
- Motion for animation, with reduced-motion support throughout
- Three.js with React Three Fiber for the client globe
- Vitest and Testing Library for tests, ESLint and Prettier for linting

## Project structure

```text
src/
  routes/               File-based routes; __root.tsx is the shared shell
  components/portfolio/ Page sections (hero, dock, command palette, globe, …)
  components/ui/        Reusable UI primitives
  lib/                  Typed content and logic: portfolio data, SEO, navigation, theme, accessibility
  assets/               Portrait, resume PDF, and globe textures
  test/                 Vitest suites
public/                 Favicons, Open Graph image, robots.txt, web manifest
```

## Updating content

All content lives in typed data modules under [`src/lib/`](src/lib/), separate from the components that display it, so every page reads from the same source.

| To change                                  | Edit                                                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Profile, metrics, projects, experience     | [`src/lib/portfolio.ts`](src/lib/portfolio.ts)                                                           |
| Skills and their descriptions              | [`src/lib/skills.ts`](src/lib/skills.ts), [`src/lib/skill-information.ts`](src/lib/skill-information.ts) |
| Certifications                             | [`src/lib/certifications.ts`](src/lib/certifications.ts)                                                 |
| Training courses and formats               | [`src/lib/training.ts`](src/lib/training.ts)                                                             |
| Testimonials                               | [`src/lib/testimonials.ts`](src/lib/testimonials.ts)                                                     |
| Client countries on the globe              | [`src/lib/client-countries.ts`](src/lib/client-countries.ts)                                             |
| Page titles, descriptions, structured data | [`src/lib/seo.ts`](src/lib/seo.ts)                                                                       |
| Portrait and resume                        | Replace `src/assets/rudresh-oza.png` and `src/assets/rudresh-oza-resume.pdf`                             |
| Snugbox app page, features, and screenshots | [`src/lib/snugbox.ts`](src/lib/snugbox.ts) and the images in `src/assets/snugbox/` |
| Snugbox APK download | Set `apkUrl`, `apkHost`, and `apkSize` in [`src/lib/snugbox.ts`](src/lib/snugbox.ts); it currently points to the APK file on Google Drive. A file host opens in a new tab, and a `/downloads/snugbox.apk` path in `public/` downloads directly |

`sitemap.xml` and `llms.txt` are generated at build time from these modules, so new projects, courses, and certifications are listed automatically.

## Development

You need Node.js 24 ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)). Yarn 4 is pinned in `package.json` and provided by Corepack.

```sh
git clone git@github.com:rudresh98/rudresh98.github.io.git
cd rudresh98.github.io
corepack enable
yarn install
yarn dev
```

| Command        | Purpose                                                               |
| -------------- | --------------------------------------------------------------------- |
| `yarn dev`     | Start the dev server                                                  |
| `yarn build`   | Prerender every route to static HTML in `dist/client`                 |
| `yarn preview` | Serve the production build locally                                    |
| `yarn test`    | Run the test suite once (`yarn test:watch` to keep it running)        |
| `yarn lint`    | Run ESLint, including Prettier checks                                 |
| `yarn format`  | Format the codebase with Prettier; run before committing              |
| `yarn verify`  | Run the Prettier check, lint, and tests (what the pre-push hook runs) |

Installing dependencies enables a [husky](https://typicode.github.io/husky/) pre-push hook that runs `yarn verify`, so a push that would fail the deploy workflow's tests is stopped locally. Skip it in an emergency with `git push --no-verify`. If a Git GUI reports `yarn: command not found`, add your nvm or Corepack `PATH` setup to `~/.config/husky/init.sh`.

## Deployment

The site is fully static. `yarn build` prerenders every route, including each project and course page, and writes a `404.html` shell so GitHub Pages can serve unknown URLs through the client router. The deploy workflow runs `yarn install --immutable`, `yarn test`, and `yarn build`, then publishes `dist/client` to GitHub Pages.
