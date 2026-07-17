# content/ — the single source of truth

Every page and component of the portfolio is populated from this directory. React components
contain **zero** personal information and **zero** hardcoded text — add a job, project,
certification, book, or blog post by editing only the files here.

## How to fill

1. **`_desc` / `_fields` keys are documentation** — read them, don't edit them. The data
   loader strips every key starting with `_` before validation.
2. **`""` or `[]` means "not provided yet."** Nothing is invented for empty fields — you'll be
   asked instead.
3. **`null` flags in `config.json` mean "undecided."** The build refuses to run until every
   flag is an explicit `true`/`false`, so nothing ships by accident.
4. **Arrays of entries** (experience, projects, books…): duplicate the template object per
   entry; array order = display order. **Delete template rows you don't use** — an entry with
   required fields left empty fails the build with a message naming the file, entry index, and field.
5. **Blog posts** are `.mdx` files in `content/blog/` — filename becomes the URL slug;
   frontmatter format is documented in `content/blog/_config.json`. Files starting with `_`
   are ignored by the post collector.
6. **Images** go in `content/images/<area>/` and are referenced from JSON as
   `/images/<area>/<file>` (a prebuild step syncs `content/images/` → `public/images/`).
7. **No secrets here.** Spotify tokens, analytics keys, etc. live in `.env.local`.

## File map

| File | Drives |
|---|---|
| `config.json` | Feature flags + section toggles (the only place optional behavior lives) |
| `profile.json` | Identity: name, alias, job title, email, avatar |
| `hero.json` | Home hero presentation: role line, bio, avatar treatment, Spotify fallback |
| `socials.json` | Hero icon row + footer Connect column |
| `seo.json` | Titles, meta, OG, JSON-LD, sitemap, analytics |
| `navigation.json` / `footer.json` | Header nav, footer columns, copyright |
| `experience.json` | Home Experience (first 3) + `/work` (all, with chips & bullets) |
| `projects.json` | `/projects` list |
| `blog/` | `/blog` + post pages (the "Blogs" section; empty body = Coming Soon), RSS |
| `quotes.json` | Rotating quote card above the footer |
| `gears.json`, `setup.json`, `terminal.json` | Development pages + home cards |
| `books.json`, `movies.json` | Personal pages + home cards |
| `resume.json` | `/resume` embed |
| `education.json`, `certifications.json`, `achievements.json`, `talks.json` | Optional extra sections (off on the reference layout) |
| `skills.json` | JSON-LD `knowsAbout` (always) + optional visible section |
| `technologies.json` | Tech-name → icon registry for chips (never blocks the build) |

## Data flow (enforced at build)

```
content/*.json + content/blog/*.mdx
        │  read + strip _docs
        ▼
src/lib/data/schemas.ts   ← Zod schemas; TypeScript types inferred (no manual interfaces)
        │  validate — missing required fields FAIL the build, naming file/entry/field
        ▼
src/lib/data/index.ts     ← the ONLY data access layer
        │  typed exports; disabled sections resolve to null
        ▼
React components (UI/presentation only)
```
