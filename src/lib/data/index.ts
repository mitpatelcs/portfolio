/**
 * THE data access layer — the only module allowed to touch content/.
 *
 * Rules enforced here:
 * - Components import from '@/lib/data' and nowhere else (no direct JSON imports).
 * - Every file is validated against its Zod schema at build time; missing or
 *   malformed required fields throw with the file name, entry path and message.
 * - Documentation keys ("_desc", "_fields", ...) are stripped before validation.
 * - Sections disabled in content/config.json resolve to `null` and are never
 *   validated (an empty movies.json with sections.movies=false is fine).
 * - Derived data (blog categories, JSON-LD knowsAbout, footer navigate list)
 *   is computed here so it always stays consistent with its sources.
 *
 * This module uses node:fs for MDX and must only be imported from server code
 * (App Router server components / route handlers). Pass plain props to any
 * client component that needs content.
 */
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { ZodType } from 'zod';

import * as S from './schemas';

import rawConfig from '../../../content/config.json';
import rawProfile from '../../../content/profile.json';
import rawHero from '../../../content/hero.json';
import rawSocials from '../../../content/socials.json';
import rawSeo from '../../../content/seo.json';
import rawNavigation from '../../../content/navigation.json';
import rawFooter from '../../../content/footer.json';
import rawExperience from '../../../content/experience.json';
import rawEducation from '../../../content/education.json';
import rawProjects from '../../../content/projects.json';
import rawCertifications from '../../../content/certifications.json';
import rawAchievements from '../../../content/achievements.json';
import rawTalks from '../../../content/talks.json';
import rawQuotes from '../../../content/quotes.json';
import rawSkills from '../../../content/skills.json';
import rawTechnologies from '../../../content/technologies.json';
import rawBooks from '../../../content/books.json';
import rawMovies from '../../../content/movies.json';
import rawGears from '../../../content/gears.json';
import rawSetup from '../../../content/setup.json';
import rawTerminal from '../../../content/terminal.json';
import rawResume from '../../../content/resume.json';
import rawBlogConfig from '../../../content/blog/_config.json';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Recursively drop documentation keys (leading "_") before validation. */
function stripDocs(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripDocs);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, v]) => [k, stripDocs(v)]),
    );
  }
  return value;
}

/** Validate one content file; on failure, fail the build with a precise error. */
function parse<T>(schema: ZodType<T>, raw: unknown, file: string): T {
  const result = schema.safeParse(stripDocs(raw));
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.length ? i.path.join('.') + ': ' : ''}${i.message}`)
      .join('\n');
    throw new Error(`[content] ${file} is invalid:\n${issues}\nFix the file — invalid content is never silently ignored.`);
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Always-on content
// ---------------------------------------------------------------------------
export const config: S.Config = parse(S.ConfigSchema, rawConfig, 'content/config.json');
export const profile: S.Profile = parse(S.ProfileSchema, rawProfile, 'content/profile.json');
export const hero: S.Hero = parse(S.HeroSchema, rawHero, 'content/hero.json');
export const seo: S.Seo = parse(S.SeoSchema, rawSeo, 'content/seo.json');
export const navigation: S.Navigation = parse(S.NavigationSchema, rawNavigation, 'content/navigation.json');
export const footer: S.Footer = parse(S.FooterSchema, rawFooter, 'content/footer.json');
export const experience: S.Experience = parse(S.ExperienceSchema, rawExperience, 'content/experience.json');
export const technologies: S.Technologies = parse(S.TechnologiesSchema, rawTechnologies, 'content/technologies.json');
// Skills always parse (they feed JSON-LD knowsAbout) — but an empty file is
// only an error if the visible section is enabled.
export const skills: S.Skills | null = (() => {
  const parsed = parse(S.SkillsSchema, rawSkills, 'content/skills.json');
  const hasData = parsed.groups.some((g) => g.items.length > 0);
  if (config.sections.skills && !hasData)
    throw new Error('[content] sections.skills is true but content/skills.json is empty.');
  return hasData ? parsed : null;
})();

/**
 * Socials: the email row with url:"" auto-fills mailto from profile.email
 * (documented behavior). Any other row left with url:"" is treated as
 * "not used" ONLY if it is untouched template data; a partially-filled row
 * fails validation via the schema instead.
 */
export const socials: S.Social[] = parse(S.SocialsSchema, rawSocials, 'content/socials.json')
  .items.map((s) => (s.platform === 'email' && !s.url ? { ...s, url: `mailto:${profile.email}` } : s))
  .filter((s) => s.url.length > 0);

// ---------------------------------------------------------------------------
// Toggleable sections — null when disabled in config.json
// ---------------------------------------------------------------------------
function section<T>(enabled: boolean, schema: ZodType<T>, raw: unknown, file: string): T | null {
  return enabled ? parse(schema, raw, file) : null;
}

export const projects = section(config.sections.projects, S.ProjectsSchema, rawProjects, 'content/projects.json');
export const resume = section(config.sections.resume, S.ResumeSchema, rawResume, 'content/resume.json');
export const gears = section(config.sections.gears, S.GearsSchema, rawGears, 'content/gears.json');
export const setup = section(config.sections.setup, S.SetupSchema, rawSetup, 'content/setup.json');
export const terminal = section(config.sections.terminal, S.TerminalSchema, rawTerminal, 'content/terminal.json');
export const books = section(config.sections.books, S.BooksSchema, rawBooks, 'content/books.json');
export const movies = section(config.sections.movies, S.MoviesSchema, rawMovies, 'content/movies.json');
export const education = section(config.sections.education, S.EducationSchema, rawEducation, 'content/education.json');
export const certifications = section(config.sections.certifications, S.CertificationsSchema, rawCertifications, 'content/certifications.json');
export const achievements = section(config.sections.achievements, S.AchievementsSchema, rawAchievements, 'content/achievements.json');
export const talks = section(config.sections.talks, S.TalksSchema, rawTalks, 'content/talks.json');
export const quotes = section(config.features.quotes, S.QuotesSchema, rawQuotes, 'content/quotes.json');

/** Display label for the projects section (page H1, home card, footer, search). */
export const projectsTitle: string = projects?.title || 'Projects';

/** Convenience item types for component props. */
export type ExperienceItem = S.Experience['items'][number];
export type ProjectItem = S.Projects['items'][number];
export type CertificationItem = S.Certifications['items'][number];
export type EducationItem = S.Education['items'][number];

// ---------------------------------------------------------------------------
// Blog (MDX files in content/blog/, filename = slug)
// ---------------------------------------------------------------------------
export type BlogPost = S.BlogFrontmatter & { slug: string; content: string };

export const blogConfig: S.BlogConfig | null = config.sections.blog
  ? parse(S.BlogConfigSchema, rawBlogConfig, 'content/blog/_config.json')
  : null;

let postsCache: BlogPost[] | null = null;

/** All publishable posts, newest first. [] when the blog is disabled. */
export function getBlogPosts(): BlogPost[] {
  if (!config.sections.blog) return [];
  if (postsCache) return postsCache;
  const dir = path.join(CONTENT_DIR, 'blog');
  const posts = fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, '');
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      const fm = parse(S.BlogFrontmatterSchema, data, `content/blog/${f} (frontmatter)`);
      return { ...fm, slug, content };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
  postsCache = posts;
  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  return getBlogPosts().find((p) => p.slug === slug) ?? null;
}

/** Filter chips: category -> post count, ordered by blogConfig.categoriesOrder then count. */
export function getBlogCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getBlogPosts())
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  const preferred = blogConfig?.categoriesOrder ?? [];
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const ia = preferred.indexOf(a.name);
      const ib = preferred.indexOf(b.name);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
      return b.count - a.count;
    });
}

// ---------------------------------------------------------------------------
// Derived data — computed once, consistent with sources by construction
// ---------------------------------------------------------------------------

/** JSON-LD knowsAbout, derived from skills.json (never duplicated in seo.json). */
export const knowsAbout: string[] = skills?.groups.flatMap((g) => g.items) ?? [];

/** Canonical site URL: seo.domain, else NEXT_PUBLIC_SITE_URL, else localhost (warned). */
export const siteUrl: string = (() => {
  const fromContent = seo.domain.replace(/\/$/, '');
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
  const resolved = fromContent || fromEnv || 'http://localhost:3000';
  if (!fromContent && !fromEnv)
    console.warn('[content] seo.domain is empty — canonical URLs fall back to http://localhost:3000. Set it before deploying.');
  return resolved;
})();

/** Footer "Navigate" column: explicit override, or auto-list of enabled pages. */
export const footerNavigate: { label: string; href: string }[] =
  footer.navigateOverride.length > 0
    ? footer.navigateOverride
    : [
        { label: 'Home', href: '/' },
        { label: 'Work', href: '/work' },
        ...(config.sections.blog ? [{ label: 'Blog', href: '/blog' }] : []),
        ...(config.sections.resume ? [{ label: 'Resume', href: '/resume' }] : []),
        ...(config.sections.projects ? [{ label: projectsTitle, href: '/projects' }] : []),
        ...(config.sections.gears ? [{ label: 'Gears', href: '/gears' }] : []),
        ...(config.sections.setup ? [{ label: 'Setup', href: '/setup' }] : []),
        ...(config.sections.terminal ? [{ label: 'Terminal', href: '/terminal' }] : []),
        ...(config.sections.books ? [{ label: 'Books', href: '/books' }] : []),
        ...(config.sections.movies ? [{ label: 'Movies', href: '/movies' }] : []),
        ...(config.sections.education ? [{ label: 'Education', href: '/education' }] : []),
        ...(config.sections.certifications ? [{ label: 'Certifications', href: '/certifications' }] : []),
        ...(config.sections.achievements ? [{ label: 'Achievements', href: '/achievements' }] : []),
        ...(config.sections.talks ? [{ label: 'Talks', href: '/talks' }] : []),
        ...(config.features.rss ? [{ label: 'RSS FEED', href: '/blog/feed.xml' }] : []),
      ];

/** Copyright name, falling back to the profile. */
export const copyrightName: string = footer.copyrightName || profile.fullName;

/** Home page shows the first N of these (reference: 3). */
export const HOME_EXPERIENCE_COUNT = 3;
export const HOME_BLOG_COUNT = 3;

/**
 * Technology chip icon lookup. Unregistered names fall back to a default icon;
 * buildTechWarnings() surfaces them at build time (warned, never silent).
 */
const techIconMap = new Map(technologies.items.map((t) => [t.name.toLowerCase(), t]));

export function getTechnology(name: string): S.Technologies['items'][number] | null {
  return techIconMap.get(name.toLowerCase()) ?? null;
}

export function buildTechWarnings(): string[] {
  const used = new Set<string>([
    ...experience.items.flatMap((e) => e.technologies),
    ...(projects?.items.flatMap((p) => p.technologies) ?? []),
  ]);
  return [...used].filter((n) => !techIconMap.has(n.toLowerCase()));
}

/** URL-safe anchor for section headings (gears/books categories etc.). */
export function anchorSlug(title: string): string {
  return title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export type SearchEntry = {
  category: string;
  title: string;
  subtitle: string;
  href: string;
  external: boolean;
  /** extra lowercase haystack terms for fuzzy matching */
  keywords: string;
};

/**
 * Global ⌘K search index — derived entirely from the content layer at build
 * time. Disabled sections contribute nothing (their exports are null), so the
 * index always mirrors what is actually on the site. Never hardcode entries.
 */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const add = (category: string, title: string, subtitle: string, href: string, external = false, keywords = '') =>
    entries.push({ category, title, subtitle, href, external, keywords: keywords.toLowerCase() });

  for (const link of footerNavigate.filter((l) => !l.href.endsWith('.xml')))
    add('Pages', link.label, 'Page', link.href);

  for (const p of projects?.items ?? [])
    add(projectsTitle, p.name, p.description, p.url, true, p.technologies.join(' '));

  for (const e of experience.items)
    add('Experience', `${e.role} — ${e.company}`, [e.start, e.isCurrent ? 'Present' : e.end].join(' – '), '/work', false, e.technologies.join(' '));

  for (const e of education?.items ?? [])
    add('Education', e.institution, e.degree, '/education');

  for (const g of skills?.groups ?? [])
    for (const item of g.items) add('Skills', item, g.category, '/projects');

  for (const t of technologies.items)
    add('Technologies', t.name, 'Technology', '/projects');

  for (const post of getBlogPosts())
    add(
      'Blogs',
      post.title,
      [post.tags.join(', '), formatBlogDate(post.date)].filter(Boolean).join(' · '),
      post.sourceUrl || `/blog/${post.slug}`,
      Boolean(post.sourceUrl),
    );

  for (const c of certifications?.items ?? [])
    add('Certifications', c.name, c.description || c.issuer, '/certifications');

  for (const category of gears?.categories ?? [])
    for (const item of category.items)
      add(category.title, item.name, item.description || category.title, `/gears#${anchorSlug(category.title)}`);

  for (const group of books?.groups ?? [])
    for (const b of group.items) add('Books', b.title, b.author, `/books#${anchorSlug(group.theme)}`);

  for (const m of movies?.items ?? []) add('Movies', m.title, m.year, '/movies');

  if (setup) add('Pages', 'Setup Guide', setup.subtitle, '/setup');
  if (terminal) add('Pages', 'Terminal Setup', terminal.subtitle, '/terminal');

  for (const s of socials)
    add('Social', s.label || s.platform.charAt(0).toUpperCase() + s.platform.slice(1), 'Social link', s.url, true);

  return entries;
}

function formatBlogDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Read a content-referenced text file (e.g. setup settingsFile, terminal configFiles). */
export function readContentFile(relPath: string): string {
  const abs = path.join(process.cwd(), relPath);
  if (!abs.startsWith(process.cwd())) throw new Error(`[content] illegal path: ${relPath}`);
  if (!fs.existsSync(abs)) throw new Error(`[content] referenced file not found: ${relPath}`);
  return fs.readFileSync(abs, 'utf8');
}
