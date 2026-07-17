# Reference Blueprint — ramx.in (live site, v2 redesign)

> Source of truth: the **live site** (scraped with Scrapling on 2026-07-17, all 11 public pages)
> plus the owner's MIT-licensed source repo [ramxcodes/sleek-portfolio](https://github.com/ramxcodes/sleek-portfolio)
> (note: the public repo is one design generation **behind** the live site; the live HTML wins on structure,
> the repo informs implementation patterns). Raw scrape artifacts live in the session scratchpad
> (`scraped/*.html`, `scraped/*.json`).

---

## 1. Global design system

| Aspect | Value |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack), TypeScript, React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives), `tw-animate-css` |
| Motion | `motion` (Framer Motion v12) + CSS keyframe utilities + Lenis smooth scroll |
| Theme | next-themes, class-based `.dark`, toggle in header (moon/sun icon) |
| Fonts | **Hanken Grotesk** (body/UI sans), **Geist Mono** (code), **Instrument Serif** (blog-post display H1 only) |
| Light palette | bg `#f9f9f9`, fg `#100f0f`, muted-fg `#737373`, border `#e5e5e5`, secondary/muted `#f5f5f5`, destructive `#df2225` |
| Dark palette | bg `#100f0f`, fg `#fafafa`, card `#171717`, muted `#262626`, muted-fg `#a1a1a1`, border `#ffffff1a`, destructive `#ff6568` |
| Radius | `--radius: 0.45rem` (cards use `rounded-xl`) |
| Layout | Single narrow column: `container mx-auto max-w-2xl px-4` (≈672 px). Blog posts widen to `max-w-4xl`. |
| Header | Sticky `top-0 z-50 h-14`, `bg-background/95 backdrop-blur`. Left: nav links (Home, Work, Blog, Resume). Right: search button (`⌘K` / `Ctrl K` kbd chips) + theme toggle. No logo — the oneko cat idles at top-left. |
| Footer | Two groups: **Navigate** (Home, Work, Blog, Resume, Projects, Gears, Setup, Terminal, Books, Movies, RSS FEED) and **Connect** (social icon row). Copyright line `© {year} {name}. All rights reserved.` |

### Animation vocabulary
- `animate-in-up`: `0.35s ease-out both fade-in-up` — applied per item with inline `animation-delay` staggered in **0.05 s steps** (0, .05, .1, …).
- `animate-in-up-on-view`: starts `opacity:0; translateY(20px)`; an IntersectionObserver adds `.in-view` which plays the same fade-in-up. Used for below-fold sections/lists.
- Hero elements animate with `motion` inline styles (`opacity:0; translateY(15px)` → settle), staggered top-to-bottom; a `via-blur` keyframe gives a blur-to-sharp reveal on page load (`blur(5px)` → `blur-none`).
- Buttons: `active:scale-[0.98]`. Icon reveals: arrow icons `opacity-0 group-hover:opacity-100`.
- Tech chips: icon-only pill that **expands its text label on hover** (`max-w-0/opacity-0 → group-hover:max-w-32/opacity-100`, `duration-300` with `delay-150`), plus `hover:scale-[1.03]`.
- Page transitions: 100 ms fade/zoom on dialogs (`fade-in-0 zoom-in-95`); durations tokens `--duration-exit:.15s --duration-enter:.21s --duration-move:.4s`.

### Signature easter eggs / widgets
- **oneko.js** pixel cat chases the cursor; hero elements are marked `data-oneko-dodge="true"` so the cat dodges them.
- **Spotify "Last played"** strip in hero: Spotify icon, "Last played" label, ` — `, track + artists; loads client-side from `/api/spotify/currently-playing` with two skeleton shimmer bars while fetching.
- **⌘K blog search** dialog (cmdk): "Search Blog — Full-text search across blog titles, headings, and paragraphs", input placeholder "Search blog posts", category Filter row, `ESC` chip, results deep-link into posts.
- **Copy-email** affordance in hero role line: email is click-to-copy with a copy→check icon swap (shows "Email" text on mobile, address on ≥md).
- Visitor counter endpoint `/api/visitors` (present on live site; auth-gated).
- **Umami** self-hosted analytics (`/umami/script.js`).

### SEO / infrastructure
- Per-page `<title>` + meta description (patterns like "Work Experience - Professional Journey", "Blog - Thoughts & Tutorials").
- Canonical + hreflang, OG/Twitter cards (`/meta` images), JSON-LD `Person` schema (name, url, image, jobTitle, sameAs socials, knowsAbout skills).
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, RSS at `/blog/feed.xml`.
- Fonts preloaded as woff2; hero avatar preloaded `fetchPriority="high"` (AVIF).

---

## 2. Page-by-page blueprint

### 2.1 Home `/`
Order: **Hero → Experience → Blog → Development → Personal → Footer** (`space-y-10 pt-8`).

**Hero** — layout: avatar left (96 px `rounded-full`, pixel-art portrait on colored disc — `bg-blue-300` light / `bg-yellow-300` dark), text block right.
- Fields: name (H1, `text-lg sm:text-2xl font-bold`), role line (`{Role} · {Role} · {email}` with copy-to-clipboard), one-line bio (`text-sm text-muted-foreground`), Spotify last-played, social icon row.
- Socials (8, tooltip on hover, `size-6` outline icons): X, LinkedIn, GitHub, YouTube, Instagram, Pinterest, Medium, Email.
- Animation: staggered motion fade-up + blur reveal on load.

**Experience** — H2 "Experience". The **3 most recent** roles, compact two-column rows:
- Left: company (H3 bold) + current-role badge ("● Working", green dot on light-green pill) + role title (muted).
- Right (right-aligned, muted): date range ("January 2026 – Present") + location ("Hyderabad, India (On-Site)").
- Responsive: short forms on mobile ("Jan 26 – Present", "Hyd, IN").
- CTA: outlined button "Show all work experiences" → `/work`, centered.

**Blog** — H2 "Blog". 3 latest posts as list items: title (H3), one-line description, date, "Read more" link. CTA "Show all blogs" → `/blog`.

**Development** — H2 "Development". 3 link-cards (`rounded-xl border bg-card px-3 py-2.5`, hover `bg-muted/60`, arrow icon fades in): Gears, Setup, Terminal — each title + one-line description.

**Personal** — H2 "Personal". Same card pattern: Books, Movies.

### 2.2 Work `/work`
- Page header: H1 "Work Experience" (`text-2xl font-bold tracking-tight`) + subtitle "My work experiences across different companies and roles." + separator (this **H1+subtitle+separator header pattern repeats on every subpage**).
- Full experience cards (all roles, most recent first, staggered reveal). Each card:
  - Company + optional "● Working" badge; role title; long+short date range; long+short location.
  - **Technologies & Tools**: H4 + wrap of icon chips (expand-label-on-hover behavior).
  - **What I've done**: H4 + bulleted accomplishment list (•, 3–5 bullets each).
- Reference data: 6 roles (ASBL; Promote; Upsurge Labs; Prepeasy; Expelee; + earlier), each 3–5 bullets, 4–14 tech chips.

### 2.3 Resume `/resume`
- Header pattern (H1 "Resume", subtitle "View and download my professional resume.").
- Embedded PDF: Google Drive preview iframe, `h-[70vh] min-h-[500px] w-full`, `rounded-lg border bg-muted/30`.

### 2.4 Blog `/blog`
- Header pattern (H1 "Blog", subtitle "Thoughts, tutorials, and insights on engineering and programming.").
- **Category filter chips with counts** (e.g. All 18, Personal 10, AI 4, Next.js 3, Design 2, …) — client-side filtering.
- Post list (staggered `blog-list-item` reveal): title (H3), description, tag chips (overflow → "+1 more"), date, "Read more".
- RSS feed `/blog/feed.xml`.

### 2.5 Blog post `/blog/[slug]`
- `article.max-w-4xl`: H1 in **Instrument Serif** (`text-4xl lg:text-5xl`), lede paragraph (`text-xl text-muted-foreground`), calendar icon + date, separator.
- Body: MDX rendered with `prose prose-neutral dark:prose-invert`; images under `/blog/…`; code blocks highlighted with Shiki (Geist Mono); GFM support.
- Posts are findable via the ⌘K full-text search.

### 2.6 Projects `/projects`
- Header pattern (H1 "Projects", subtitle "A few products and experiments I've shipped.").
- Minimal list — **no images, no detail pages**: each `article.group.py-4` (staggered) is one link row → external live product URL (`target="_blank"`): project name (H2 `text-lg font-semibold`, hover→primary) + one-line description (`line-clamp-2 text-sm text-secondary`).
- Reference has 12 projects, most hosted on subdomains of the owner's domain.

### 2.7 Books `/books`
- Header pattern (H1 "Books", subtitle "A collection of books that have influenced my thinking and growth.").
- **Themed groups**, each: H2 (`text-2xl font-semibold`, e.g. "Power & Influence", "Mastery & Focus", "Discipline & Grit", …) + 2-col grid (`grid-cols-1 md:grid-cols-2 gap-4 md:gap-8`) of cards (`rounded-xl ring-1 ring-foreground/10 border bg-card`): book title + author (muted). Staggered reveal.

### 2.8 Movies `/movies`
- Header pattern (H1 "Movies", subtitle "Movies and shows that have inspired and entertained me.").
- Single 2-col grid of the same cards: title + release year. (Reference: 10 titles.)

### 2.9 Gears `/gears`
- Header pattern (H1 "Gears", subtitle "My gears and tools I use to get my work done.").
- Sections:
  1. **Devices & Accessories** — rows: item name (truncating, hover underline) + external-link icon → store/affiliate URL. (~15 items.)
  2. **Web Extensions** — numbered rows (1., 2., …) linking out. (7 items.)
  3. **Software** — numbered rows linking out. (6 items.)

### 2.10 Setup `/setup`
- Header pattern (H1 "Setup", subtitle "Complete guide to setting up VSCode / Cursor with my settings.").
- Stepped tutorial with numbered step badges (1.1, 1.2 …):
  - Downloadable file buttons (font zip, `vsc-extensions.txt`).
  - `<kbd>` keyboard chips (e.g. `Ctrl + ⇧ + P`).
  - Inline command strings, **collapsible code panels** ("Show"/"Hide" toggle, e.g. full `settings.json`), copy buttons.
  - Closing "Complete Setup" checklist + "Done! Your editor is now configured."

### 2.11 Terminal `/terminal`
- Header pattern (H1 "Terminal Setup", subtitle "Below is my terminal setup configuration.").
- Sections: Prerequisites (numbered w/ descriptions) → collapsible "Linux Installation" → Install Required Packages (multi-line `brew install` code block + Copy) → Configure Zsh → Configure Fastfetch → collapsible `.zshrc` / Fastfetch configs → Apply Configuration → "Done!" → **Source Repository card** linking to the dotfiles GitHub repo.

### 2.12 System pages
- **404**: big "404", "Page not found", "The page you're looking for doesn't exist or has been moved.", Home + Blog buttons.
- API routes: `/api/spotify/currently-playing` (Spotify OAuth refresh-token flow), `/api/visitors`.

---

## 3. Deltas between live site and public repo (for awareness)
The public repo contains an older homepage (About/GitHub-calendar/CTA/Journey sections), a contact form with
Telegram integration, project case-study subpages, and an AI chat API. The live v2 site **dropped all of these**
in favor of the minimal structure above. We recreate the **live v2**; repo patterns (config-driven data files in
`src/config/*`, MDX pipeline, shadcn component setup) remain useful implementation references.
