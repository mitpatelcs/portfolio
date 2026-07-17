import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { projects, projectsTitle } from '@/lib/data';

export const metadata: Metadata = {
  title: `${projectsTitle} - Case Studies & Products`,
  description: projects?.subtitle ?? 'Projects and experiments.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  if (!projects) notFound();
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title={projectsTitle} subtitle={projects.subtitle} />
        <div>
          {projects.items.map((project, i) => (
            <article key={project.name} className="group animate-in-up py-4" style={{ animationDelay: `${i * 0.05}s` }}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-lg leading-tight font-semibold transition-colors group-hover:text-primary">
                    {project.name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
