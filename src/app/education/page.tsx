import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { education } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Education - Academic Background',
  description: 'My academic background.',
  alternates: { canonical: '/education' },
};

export default function EducationPage() {
  if (!education) notFound();
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Education" subtitle={education.subtitle} />
        <div className="space-y-4">
          {education.items.map((item, i) => (
            <div
              key={`${item.institution}-${item.start}`}
              className="animate-in-up space-y-3 rounded-xl border border-border bg-card p-4"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold">{item.institution}</h3>
                  <p className="text-sm text-muted-foreground">{item.degree}</p>
                </div>
                <div className="shrink-0 text-right text-sm text-muted-foreground">
                  <p>
                    {item.start} – {item.end}
                  </p>
                  {item.location ? <p>{item.location}</p> : null}
                </div>
              </div>
              {item.details.length > 0 ? (
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {item.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
