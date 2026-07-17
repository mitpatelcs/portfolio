# Your Content — Questionnaire (mirrors ramx.in structure)

Fill in every section that should appear on your portfolio. If a section doesn't apply to you,
write **SKIP** next to it and it will be omitted (the layout adapts). Nothing will be invented on
your behalf — anything left blank will be asked about again, not fabricated.

---

## 0. Site identity & meta
1. Domain you'll deploy to (used for canonical URL, sitemap, OG links): 
2. Site title pattern (reference: `"{Name} - Full Stack Web Developer"`): 
3. Meta description (1–2 sentences, ~150 chars — used for SEO + JSON-LD): 
4. SEO keywords (comma-separated): 
5. Online alias/handle (reference uses "ramxcodes / ramx" in descriptions): 
6. OG/social share image — provide one, or should we generate a simple text-based one?
7. Analytics: Umami (self-hosted URL?), none, or other?
8. Favicon / manifest icon (file, or generate from initials?):

## 1. Hero (home page)
1. Full name (H1): 
2. Role line — 2–3 words separated by "·" (reference: "Engineer · Polymath"): 
3. Public email (shown in hero with click-to-copy): 
4. One-line bio (reference: "Love to build cool stuff, content creator & polymath."): 
5. Profile photo: file/path please. The reference uses a **pixel-art avatar on a colored disc**
   (blue in light mode, yellow in dark). Options:
   a) supply your own pixel-art/normal photo as-is,
   b) supply a photo + I'll note that you want it placed on the colored disc,
   c) different treatment (describe).
6. Social links — give URLs only for ones you have (order matters, they render as icons):
   - X/Twitter:
   - LinkedIn:
   - GitHub:
   - YouTube:
   - Instagram:
   - Pinterest:
   - Medium / blog:
   - Other (name + URL):
7. **Spotify "Last played" widget** — keep it? If yes you'll need a Spotify app
   (Client ID, Client Secret, Refresh Token — I'll give setup steps at build time; secrets go in `.env`, never in chat/code).
   Alternatives: static text, or SKIP.
8. **oneko cat** easter egg (pixel cat that follows the cursor) — keep, or SKIP?

## 2. Experience (home shows latest 3; /work shows all)
For **each** role, most recent first:
- Company name:
- Currently working here? (yes → green "Working" badge):
- Role title:
- Start month/year – end month/year (or "Present"):
- Location — long form ("Hyderabad, India (On-Site)") and short form ("Hyd, IN"):
- Technologies & tools used (list; each becomes an icon chip — e.g. Next.js, TypeScript, AWS…):
- "What I've done" — 3–5 bullet points, factual, with metrics where real:

*(Repeat this block per company. The reference has 6.)*

## 3. Blog
1. Do you have existing posts to migrate? Provide files (Markdown/MDX) or links.
   For each post: title, one-line description, date, category tags (1–3), body, images.
2. If no posts yet: should the Blog section/page ship empty-but-wired (MDX pipeline, categories,
   RSS, ⌘K search ready) or be SKIPped for now?
3. Category taxonomy you want (reference: Personal, AI, Next.js, Design, Frontend, Security, …):
4. Keep the **⌘K full-text blog search**? (yes/no)
5. Keep the **RSS feed**? (yes/no)

## 4. Projects (list page; each row links to a live URL)
For **each** project (reference has 12; any number works):
- Name:
- One-line description (≤ ~90 chars, it clamps to 2 lines):
- Live URL (the whole row links here). If a project has no live URL, give the GitHub URL instead:

Order them exactly as you want them to appear.

## 5. Development section (home cards + subpages)
These three are optional individually — SKIP any and the card disappears from home.

**5a. Gears (`/gears`)**
- Page subtitle (reference: "My gears and tools I use to get my work done."):
- Devices & Accessories — list of { item name, link (store/affiliate, optional) }:
- Web Extensions — ordered list of { name, link }:
- Software — ordered list of { name, link }:
- Any other gear category you want (name + items):

**5b. Setup (`/setup`)** — editor setup guide
- Which editor(s)? (reference: VS Code / Cursor)
- Files to offer for download (font zip, extensions list, etc.) — provide them:
- Your `settings.json` (or equivalent) to embed in the collapsible panel:
- Step list if it differs from the reference flow (download → install extensions → paste settings):

**5c. Terminal (`/terminal`)** — shell setup guide
- Shell/tools (reference: Zsh, Starship, eza, fzf, zoxide, fastfetch, …):
- Install one-liner (brew/apt/etc.):
- Your `.zshrc` (or equivalent) content:
- Extra config files (e.g. fastfetch config):
- Public dotfiles repo to link as "Source Repository" (URL):

## 6. Personal section (home cards + subpages)
SKIP either to drop its card.

**6a. Books (`/books`)**
- Page subtitle (reference: "A collection of books that have influenced my thinking and growth."):
- Books **grouped by theme** — for each group: group heading (e.g. "Mastery & Focus") and
  list of { title, author }:

**6b. Movies (`/movies`)**
- Page subtitle (reference: "Movies and shows that have inspired and entertained me."):
- List of { title, year } (mix of films/shows is fine):

## 7. Resume (`/resume`)
1. Your resume as: Google Drive share link (reference approach — renders in an iframe) **or** a PDF
   file to self-host. Which, and provide it:
2. Page subtitle (reference: "View and download my professional resume."):

## 8. Structure decisions
1. Keep the exact nav (Home · Work · Blog · Resume) or adjust labels/order?
2. Footer: same two columns (Navigate + Connect) with your links — anything to add/remove?
3. Copyright line name (defaults to your full name):
4. Visitor counter API — the reference has one (auth-gated). Recreate, or SKIP?
5. Anything on ramx.in you explicitly *don't* want, or any personal section you want added
   in the same visual language?

---

### Ground rules (restating your own)
- No invented facts, projects, dates, or achievements — only what you provide above.
- No Lorem Ipsum: sections without content get SKIPped or shipped empty-but-wired, per your answers.
- Secrets (Spotify tokens, analytics keys) go into `.env.local` at build time — don't paste them here.
