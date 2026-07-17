import Link from 'next/link';

import AnimateOnView from '@/components/common/AnimateOnView';
import Container from '@/components/common/Container';
import LinkCard from '@/components/common/LinkCard';
import ExperienceRow from '@/components/sections/ExperienceRow';
import Hero from '@/components/sections/Hero';
import { buttonVariants } from '@/components/ui/button';
import { formatPostDate } from '@/lib/utils';
import {
  HOME_BLOG_COUNT,
  HOME_EXPERIENCE_COUNT,
  certifications,
  config,
  education,
  experience,
  gears,
  getBlogPosts,
  projects,
  projectsTitle,
  setup,
  terminal,
} from '@/lib/data';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight">{children}</h2>;
}

export default function HomePage() {
  const posts = getBlogPosts().slice(0, HOME_BLOG_COUNT);
  const developmentCards = [
    gears && { href: '/gears', title: 'Gears', description: gears.homeCardDescription },
    setup && { href: '/setup', title: 'Setup', description: setup.homeCardDescription },
    terminal && { href: '/terminal', title: 'Terminal', description: terminal.homeCardDescription },
  ].filter(Boolean) as { href: string; title: string; description: string }[];
  const exploreCards = [
    projects && {
      href: '/projects',
      title: projectsTitle,
      description: projects.subtitle,
    },
    certifications && {
      href: '/certifications',
      title: 'Certifications',
      description: certifications.items.map((c) => c.name).slice(0, 2).join(', ') + (certifications.items.length > 2 ? ', and more' : ''),
    },
    education && {
      href: '/education',
      title: 'Education',
      description: education.items.map((e) => `${e.degree}, ${e.institution}`).join(' · '),
    },
  ].filter(Boolean) as { href: string; title: string; description: string }[];

  return (
    <Container className="min-h-screen">
      <div className="space-y-10 pt-8">
        <Hero />

        <AnimateOnView>
          <section className="space-y-4">
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-5">
              {experience.items.slice(0, HOME_EXPERIENCE_COUNT).map((item) => (
                <ExperienceRow key={`${item.company}-${item.start}`} item={item} />
              ))}
            </div>
            {experience.items.length > HOME_EXPERIENCE_COUNT ? (
              <div className="flex justify-center pt-2">
                <Link href="/work" className={buttonVariants({ variant: 'outline' })}>
                  Show all work experiences
                </Link>
              </div>
            ) : (
              <div className="flex justify-center pt-2">
                <Link href="/work" className={buttonVariants({ variant: 'outline' })}>
                  View work experience
                </Link>
              </div>
            )}
          </section>
        </AnimateOnView>

        {config.sections.blog && posts.length > 0 ? (
          <AnimateOnView>
            <section className="space-y-4">
              <SectionHeading>Blogs</SectionHeading>
              <div className="space-y-6">
                {posts.map((post) => {
                  const meta = (
                    <>
                      <h3 className="text-base font-semibold group-hover:text-primary">{post.title}</h3>
                      {post.description ? <p className="text-sm text-muted-foreground">{post.description}</p> : null}
                      <p className="text-sm text-muted-foreground">
                        {[post.tags.join(', '), formatPostDate(post.date)].filter(Boolean).join(' · ')}
                      </p>
                    </>
                  );
                  return (
                    <article key={post.slug}>
                      {post.sourceUrl ? (
                        <a
                          href={post.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block space-y-1"
                        >
                          {meta}
                        </a>
                      ) : (
                        <Link href={`/blog/${post.slug}`} className="group block space-y-1">
                          {meta}
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
              <div className="flex justify-center pt-2">
                <Link href="/blog" className={buttonVariants({ variant: 'outline' })}>
                  Show all blogs
                </Link>
              </div>
            </section>
          </AnimateOnView>
        ) : null}

        {developmentCards.length > 0 ? (
          <AnimateOnView>
            <section className="space-y-2">
              <SectionHeading>Development</SectionHeading>
              <div className="flex flex-col gap-2 pt-2">
                {developmentCards.map((card) => (
                  <LinkCard key={card.href} {...card} />
                ))}
              </div>
            </section>
          </AnimateOnView>
        ) : null}

        {exploreCards.length > 0 ? (
          <AnimateOnView>
            <section className="space-y-2">
              <SectionHeading>Explore</SectionHeading>
              <div className="flex flex-col gap-2 pt-2">
                {exploreCards.map((card) => (
                  <LinkCard key={card.href} {...card} />
                ))}
              </div>
            </section>
          </AnimateOnView>
        ) : null}
      </div>
    </Container>
  );
}
