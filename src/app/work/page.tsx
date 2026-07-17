import type { Metadata } from 'next';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import ExperienceCard from '@/components/sections/ExperienceCard';
import { experience } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Work Experience - Professional Journey',
  description: 'My work experiences across different companies and roles.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Work Experience" subtitle="My work experiences across different companies and roles." />
        <div className="space-y-4">
          {experience.items.map((item, i) => (
            <div key={`${item.company}-${item.start}`} className="animate-in-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <ExperienceCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
