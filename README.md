# Mit Patel — Portfolio

A faithful recreation of the [ramx.in](https://ramx.in) portfolio experience (design system, layout,
animations, interactions — see [BLUEPRINT.md](./BLUEPRINT.md)) populated entirely from a content
data layer. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, motion, and Lenis.

## Quick start

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build (validates all content first)
```

## Editing content — the only thing you ever touch

**All** personal data lives in [`content/`](./content). React components contain zero personal
text; every page reads from the data layer ([`src/lib/data/index.ts`](./src/lib/data/index.ts)),
which validates every file against Zod schemas at build time — missing or malformed required
fields fail the build with a precise error, never silently.

| Change | File |
|---|---|
| Name, title, email, avatar | `content/profile.json` |
| Hero role line / bio | `content/hero.json` |
| Social links | `content/socials.json` |
| Add a job/internship | `content/experience.json` (prepend to `items`) |
| Add a project | `content/projects.json` |
| Add a blog post ("Blogs" section) | drop `content/blog/my-post.mdx` (frontmatter documented in `content/blog/_config.json`; empty body renders "Coming Soon") |
| Add a certification | `content/certifications.json` |
| Education | `content/education.json` |
| Rotating quotes above the footer | `content/quotes.json` |
| Skills (also feeds SEO knowsAbout) | `content/skills.json` |
| Tech chip icons | `content/technologies.json` |
| Books / movies / gears / setup / terminal | matching file + flip flag in `config.json` |
| Resume PDF | `content/resume.json` |
| SEO, domain, analytics | `content/seo.json` |
| Feature flags & section toggles | `content/config.json` |

Conventions: keys starting with `_` are inline documentation (stripped before validation).
Images go in `content/images/**` and are synced to `public/images/**` automatically on
`dev`/`build`. Reference them as `/images/...` in content files.

### Turning sections on/off

`content/config.json` → `sections`: set e.g. `"books": true`, fill `content/books.json`, done —
the page, home card, and footer link appear automatically. No component changes, ever.

`features` toggles the reference's signature extras: `oneko` (cursor-chasing pixel cat),
`spotify` (hero "Last played" strip — currently off), `visitorCounter`, `commandKSearch` (⌘K
blog search), `rss`, `themeToggle`, `smoothScroll`, `uiSounds` (synthesized click ticks,
autoplay-policy safe), and `quotes` (rotating quote card above the footer).

## Before deploying

1. Set your domain in `content/seo.json` (`"domain": "https://your-domain.com"`) — until then
   canonical URLs fall back to localhost with a build warning.
2. Optional: visitor counter needs Upstash Redis credentials in `.env.local`
   (see [`.env.example`](./.env.example)). Without them the counter hides itself gracefully.
3. Favicon + OG image are generated from your name/title (`src/app/icon.tsx`,
   `src/app/opengraph-image.tsx`); drop real files and point `seo.json` at them whenever ready.

## Provenance & credits

- Reference design: [ramx.in](https://ramx.in) by Ramkrishna Swarnkar — open source (MIT) at
  [ramxcodes/sleek-portfolio](https://github.com/ramxcodes/sleek-portfolio).
- `public/oneko/` — oneko.js cat (from the MIT-licensed reference project, originally
  [adryd325/oneko.js](https://github.com/adryd325/oneko.js)).
- All content facts sourced from Mit Patel's resume, certificates, GitHub, and LinkedIn
  (provenance notes are embedded as `_sources` keys inside each content file).
