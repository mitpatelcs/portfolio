/**
 * Zod schemas for every file under content/.
 *
 * These schemas are the single contract between content and UI:
 * - All TypeScript types are inferred from here (no manual interfaces anywhere).
 * - Required fields use `req()`, so a missing value fails the build with a
 *   message naming the field — never silently ignored.
 * - Keys starting with "_" (docs) are stripped by the loader before parsing;
 *   schemas are `.strict()` so typos in key names also fail loudly.
 */
import { z } from 'zod';

/** Non-empty trimmed string with a human-readable error. */
const req = (label: string) =>
  z.string().trim().min(1, `${label} is required — fill it in or remove the entry`);

/** Optional string ("" allowed). */
const opt = z.string();

const url = z.string().url();
const optUrl = z.union([z.literal(''), url]);

/** config.json flags must be decided (true/false) before the build — null fails. */
const decided = (label: string) =>
  z.boolean({ error: `${label}: decide true or false in content/config.json (null = undecided)` });

// ---------------------------------------------------------------------------
// config.json
// ---------------------------------------------------------------------------
export const ConfigSchema = z
  .object({
    features: z
      .object({
        oneko: decided('features.oneko'),
        spotify: decided('features.spotify'),
        visitorCounter: decided('features.visitorCounter'),
        commandKSearch: decided('features.commandKSearch'),
        rss: decided('features.rss'),
        smoothScroll: decided('features.smoothScroll'),
        themeToggle: z
          .object({
            enabled: decided('features.themeToggle.enabled'),
            defaultTheme: z.enum(['system', 'light', 'dark']),
          })
          .strict(),
        uiSounds: decided('features.uiSounds'),
        quotes: decided('features.quotes'),
      })
      .strict(),
    sections: z
      .object({
        blog: decided('sections.blog'),
        projects: decided('sections.projects'),
        resume: decided('sections.resume'),
        gears: decided('sections.gears'),
        setup: decided('sections.setup'),
        terminal: decided('sections.terminal'),
        books: decided('sections.books'),
        movies: decided('sections.movies'),
        education: decided('sections.education'),
        certifications: decided('sections.certifications'),
        achievements: decided('sections.achievements'),
        talks: decided('sections.talks'),
        skills: decided('sections.skills'),
      })
      .strict(),
  })
  .strict()
  .superRefine((cfg, ctx) => {
    if (!cfg.sections.blog && cfg.features.rss)
      ctx.addIssue({ code: 'custom', message: 'features.rss requires sections.blog = true' });
  });

// ---------------------------------------------------------------------------
// profile.json / hero.json / socials.json / seo.json
// ---------------------------------------------------------------------------
export const ProfileSchema = z
  .object({
    fullName: req('profile.fullName'),
    alias: opt,
    jobTitle: req('profile.jobTitle'),
    email: req('profile.email').pipe(z.email()),
    location: opt,
    avatar: z.object({ image: req('profile.avatar.image'), alt: req('profile.avatar.alt') }).strict(),
  })
  .strict();

export const HeroSchema = z
  .object({
    roleLine: z.array(req('hero.roleLine entry')).min(1, 'hero.roleLine needs at least one descriptor'),
    bio: req('hero.bio'),
    avatarTreatment: opt,
    spotifyFallbackText: opt,
  })
  .strict();

export const SocialPlatform = z.enum([
  'x', 'linkedin', 'github', 'youtube', 'instagram', 'pinterest', 'medium', 'facebook', 'email', 'other',
]);

export const SocialsSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            platform: SocialPlatform,
            url: opt, // "" on the email row = auto mailto from profile.email; other rows with "" are dropped by the loader (documented, not silent)
            label: opt.optional(),
          })
          .strict()
          .refine((s) => s.platform !== 'other' || !s.url || (s.label ?? '').length > 0, {
            message: "socials: platform 'other' needs a label",
          }),
      )
      .min(1),
  })
  .strict();

export const SeoSchema = z
  .object({
    // Optional until deployment: the loader falls back to NEXT_PUBLIC_SITE_URL
    // or http://localhost:3000 (with a build-time warning).
    domain: z.union([z.literal(''), url]),
    siteTitle: req('seo.siteTitle'),
    description: req('seo.description'),
    keywords: z.array(z.string().trim().min(1)),
    ogImage: opt,
    favicon: opt,
    analytics: opt,
    analyticsUrl: optUrl,
  })
  .strict();

// ---------------------------------------------------------------------------
// navigation.json / footer.json
// ---------------------------------------------------------------------------
const NavLink = z.object({ label: req('link.label'), href: req('link.href') }).strict();

export const NavigationSchema = z.object({ links: z.array(NavLink).min(1) }).strict();

export const FooterSchema = z
  .object({
    navigateOverride: z.array(NavLink),
    copyrightName: opt,
    extraLinks: z.array(NavLink),
  })
  .strict();

// ---------------------------------------------------------------------------
// experience.json / education.json
// ---------------------------------------------------------------------------
export const ExperienceKind = z.enum(['full-time', 'internship', 'freelance', 'founding', 'contract']);

export const ExperienceSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            company: req('experience.company'),
            kind: ExperienceKind,
            role: req('experience.role'),
            isCurrent: z.boolean(),
            start: req('experience.start'),
            end: opt,
            // location/technologies/highlights may be empty (e.g. only a certificate
            // as evidence) — the UI omits the corresponding blocks when empty.
            location: opt,
            locationShort: opt,
            technologies: z.array(z.string().trim().min(1)),
            highlights: z.array(z.string().trim().min(1)),
            companyUrl: optUrl,
            logo: opt,
          })
          .strict()
          .refine((e) => e.isCurrent || e.end.length > 0, {
            message: 'experience.end is required unless isCurrent is true',
          }),
      )
      .min(1, 'experience.items must contain at least one role'),
  })
  .strict();

export const EducationSchema = z
  .object({
    subtitle: opt,
    items: z
      .array(
        z
          .object({
            institution: req('education.institution'),
            degree: req('education.degree'),
            start: req('education.start'),
            end: req('education.end'),
            location: opt,
            details: z.array(z.string().trim().min(1)),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

// ---------------------------------------------------------------------------
// projects.json
// ---------------------------------------------------------------------------
export const ProjectsSchema = z
  .object({
    /** Optional section title override (page H1, home card, footer label). Empty/absent = 'Projects'. */
    title: opt.optional(),
    subtitle: req('projects.subtitle'),
    items: z
      .array(
        z
          .object({
            name: req('project.name'),
            description: req('project.description').pipe(
              z.string().max(120, 'project.description should stay under ~90-120 chars (it clamps to 2 lines)'),
            ),
            url: req('project.url').pipe(url),
            github: optUrl,
            technologies: z.array(z.string()),
            highlights: z.array(z.string()),
            image: opt,
            featured: z.boolean(),
          })
          .strict(),
      )
      .min(1, 'projects.items must contain at least one project'),
  })
  .strict();

// ---------------------------------------------------------------------------
// certifications.json / achievements.json / talks.json / skills.json / technologies.json
// ---------------------------------------------------------------------------
export const CertificationsSchema = z
  .object({
    subtitle: opt,
    items: z
      .array(
        z
          .object({
            name: req('certification.name'),
            issuer: req('certification.issuer'),
            description: opt.optional(),
            date: req('certification.date'),
            url: optUrl,
            image: opt,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const AchievementsSchema = z
  .object({
    subtitle: opt,
    items: z
      .array(
        z
          .object({
            title: req('achievement.title'),
            context: req('achievement.context'),
            date: req('achievement.date'),
            url: optUrl,
            image: opt,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const TalksSchema = z
  .object({
    subtitle: opt,
    items: z
      .array(
        z
          .object({
            title: req('talk.title'),
            event: req('talk.event'),
            date: req('talk.date'),
            url: optUrl,
            description: opt,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

/** External writing (LinkedIn/Medium/etc.) — rendered as the "Blogs" section. */
export const QuotesSchema = z
  .object({
    intervalSeconds: z.number().min(2).max(120),
    items: z
      .array(z.object({ quote: req('quotes.quote'), author: req('quotes.author') }).strict())
      .min(1),
  })
  .strict();

export const SkillsSchema = z
  .object({
    groups: z.array(
      z.object({ category: req('skills.category'), items: z.array(z.string().trim().min(1)).min(1) }).strict(),
    ),
  })
  .strict();

export const TechnologiesSchema = z
  .object({
    items: z.array(
      z.object({ name: req('technology.name'), icon: req('technology.icon'), url: optUrl }).strict(),
    ),
  })
  .strict();

// ---------------------------------------------------------------------------
// books.json / movies.json
// ---------------------------------------------------------------------------
export const BooksSchema = z
  .object({
    subtitle: req('books.subtitle'),
    homeCardDescription: req('books.homeCardDescription'),
    groups: z
      .array(
        z
          .object({
            theme: req('books.group.theme'),
            items: z.array(z.object({ title: req('book.title'), author: req('book.author') }).strict()).min(1),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const MoviesSchema = z
  .object({
    subtitle: req('movies.subtitle'),
    homeCardDescription: req('movies.homeCardDescription'),
    items: z.array(z.object({ title: req('movie.title'), year: req('movie.year') }).strict()).min(1),
  })
  .strict();

// ---------------------------------------------------------------------------
// gears.json / setup.json / terminal.json
// ---------------------------------------------------------------------------
export const GearsSchema = z
  .object({
    subtitle: req('gears.subtitle'),
    homeCardDescription: req('gears.homeCardDescription'),
    categories: z
      .array(
        z
          .object({
            title: req('gears.category.title'),
            numbered: z.boolean(),
            items: z
              .array(
                z
                  .object({
                    name: req('gear.name'),
                    description: opt.optional(),
                    icon: opt.optional(),
                    url: optUrl,
                  })
                  .strict(),
              )
              .min(1),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

const SetupSubstep = z
  .object({
    text: req('setup step text'),
    kbd: opt.optional(),
    code: opt.optional(),
    downloadRef: opt.optional(),
  })
  .strict();

export const SetupSchema = z
  .object({
    subtitle: req('setup.subtitle'),
    homeCardDescription: req('setup.homeCardDescription'),
    editors: z.array(z.string().trim().min(1)).min(1, 'setup.editors: name at least one editor'),
    downloads: z.array(z.object({ label: req('setup.download.label'), file: req('setup.download.file') }).strict()),
    settingsFile: req('setup.settingsFile'),
    steps: z.array(z.object({ title: req('setup.step.title'), substeps: z.array(SetupSubstep).min(1) }).strict()),
  })
  .strict();

export const TerminalSchema = z
  .object({
    subtitle: req('terminal.subtitle'),
    homeCardDescription: req('terminal.homeCardDescription'),
    prerequisites: z
      .array(z.object({ name: req('terminal.prerequisite.name'), description: opt }).strict())
      .min(1),
    installCommand: opt,
    installCommandFile: opt,
    configFiles: z.array(
      z.object({ title: req('terminal.configFile.title'), file: req('terminal.configFile.file'), language: opt }).strict(),
    ),
    sourceRepo: z.object({ name: opt, url: optUrl, description: opt }).strict(),
  })
  .strict()
  .refine((t) => t.installCommand.length > 0 || t.installCommandFile.length > 0, {
    message: 'terminal: provide installCommand or installCommandFile',
  });

// ---------------------------------------------------------------------------
// resume.json
// ---------------------------------------------------------------------------
export const ResumeSchema = z
  .object({
    subtitle: req('resume.subtitle'),
    source: z.enum(['drive', 'file'], { error: "resume.source must be 'drive' or 'file'" }),
    driveUrl: optUrl,
    file: opt,
  })
  .strict()
  .superRefine((r, ctx) => {
    if (r.source === 'drive' && !r.driveUrl)
      ctx.addIssue({ code: 'custom', message: "resume.driveUrl is required when source = 'drive'" });
    if (r.source === 'file' && !r.file)
      ctx.addIssue({ code: 'custom', message: "resume.file is required when source = 'file'" });
  });

// ---------------------------------------------------------------------------
// blog/_config.json + MDX frontmatter
// ---------------------------------------------------------------------------
export const BlogConfigSchema = z
  .object({
    subtitle: req('blog subtitle (content/blog/_config.json)'),
    categoriesOrder: z.array(z.string().trim().min(1)),
  })
  .strict();

export const BlogFrontmatterSchema = z
  .object({
    title: req('blog post title'),
    description: opt.optional(),
    sourceUrl: optUrl.optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'blog post date must be YYYY-MM-DD'),
    tags: z.array(z.string().trim().min(1)).min(1).max(3),
    image: opt.optional(),
    draft: z.boolean().optional(),
  })
  .strict();

// ---------------------------------------------------------------------------
// Inferred types — the only TypeScript types for content in the codebase.
// ---------------------------------------------------------------------------
export type Config = z.infer<typeof ConfigSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Hero = z.infer<typeof HeroSchema>;
export type Socials = z.infer<typeof SocialsSchema>;
export type Social = Socials['items'][number];
export type Seo = z.infer<typeof SeoSchema>;
export type Navigation = z.infer<typeof NavigationSchema>;
export type Footer = z.infer<typeof FooterSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type ExperienceItem = Experience['items'][number];
export type Education = z.infer<typeof EducationSchema>;
export type Projects = z.infer<typeof ProjectsSchema>;
export type Project = Projects['items'][number];
export type Certifications = z.infer<typeof CertificationsSchema>;
export type Achievements = z.infer<typeof AchievementsSchema>;
export type Talks = z.infer<typeof TalksSchema>;
export type Quotes = z.infer<typeof QuotesSchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type Technologies = z.infer<typeof TechnologiesSchema>;
export type Books = z.infer<typeof BooksSchema>;
export type Movies = z.infer<typeof MoviesSchema>;
export type Gears = z.infer<typeof GearsSchema>;
export type Setup = z.infer<typeof SetupSchema>;
export type Terminal = z.infer<typeof TerminalSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type BlogConfig = z.infer<typeof BlogConfigSchema>;
export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;
