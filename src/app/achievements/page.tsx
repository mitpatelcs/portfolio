import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { achievements } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Awards and notable milestones.',
  alternates: { canonical: '/achievements' },
};

export default function AchievementsPage() {
  if (!achievements) notFound();
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Achievements" subtitle={achievements.subtitle} />
        <div className="space-y-5">
          {achievements.items.map((item) => (
            <div key={item.title} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-base font-bold">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{item.context}</p>
              </div>
              <p className="shrink-0 text-right text-sm text-muted-foreground">{item.date}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
