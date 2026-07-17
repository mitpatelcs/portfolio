import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { talks } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Talks',
  description: 'Talks, podcasts, and workshops.',
  alternates: { canonical: '/talks' },
};

export default function TalksPage() {
  if (!talks) notFound();
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Talks" subtitle={talks.subtitle} />
        <div>
          {talks.items.map((talk, i) => (
            <article key={talk.title} className="group animate-in-up py-4" style={{ animationDelay: `${i * 0.05}s` }}>
              <a href={talk.url || undefined} target="_blank" rel="noopener noreferrer" className="block space-y-1">
                <h2 className="text-lg leading-tight font-semibold transition-colors group-hover:text-primary">{talk.title}</h2>
                <p className="text-sm text-muted-foreground">{[talk.event, talk.date].filter(Boolean).join(' · ')}</p>
                {talk.description ? <p className="line-clamp-2 text-sm text-muted-foreground">{talk.description}</p> : null}
              </a>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
