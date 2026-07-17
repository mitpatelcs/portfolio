import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { resume } from '@/lib/data';
import { driveToPreview } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Resume - Professional CV',
  description: 'View and download my professional resume.',
  alternates: { canonical: '/resume' },
};

export default function ResumePage() {
  if (!resume) notFound();
  const src = resume.source === 'drive' ? driveToPreview(resume.driveUrl) : resume.file;
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Resume" subtitle={resume.subtitle} />
        <div
          className="animate-in-up overflow-hidden rounded-lg border border-border bg-muted/30"
          style={{ animationDelay: '0.1s' }}
        >
          <iframe src={src} title="Resume" className="h-[70vh] min-h-[500px] w-full" />
        </div>
      </section>
    </Container>
  );
}
