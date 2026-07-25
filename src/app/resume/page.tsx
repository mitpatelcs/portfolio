import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { buttonVariants } from '@/components/ui/button';
import { profile, resume } from '@/lib/data';
import { driveToPreview } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Resume - Professional CV',
  description: 'View and download my professional resume.',
  alternates: { canonical: '/resume' },
};

export default function ResumePage() {
  if (!resume) notFound();
  const isFile = resume.source === 'file';
  // Clean on-page preview: hide the native PDF viewer chrome (toolbar + thumbnails).
  const previewSrc = isFile ? `${resume.file}#toolbar=0&navpanes=0&view=FitH` : driveToPreview(resume.driveUrl);
  // "View / Download" opens the Drive link (view + download there) when set,
  // otherwise downloads the self-hosted file directly.
  const hasDrive = resume.driveUrl.length > 0;
  const actionHref = hasDrive ? resume.driveUrl : resume.file;
  const downloadName = `${profile.fullName.replace(/\s+/g, '-')}-Resume.pdf`;

  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Resume" subtitle={resume.subtitle} />
        <div className="animate-in-up flex justify-end" style={{ animationDelay: '0.08s' }}>
          <a
            href={actionHref}
            target={hasDrive ? '_blank' : undefined}
            download={hasDrive ? undefined : downloadName}
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ExternalLink className="size-4" />
            View
          </a>
        </div>
        <div
          className="animate-in-up overflow-hidden rounded-lg border border-border bg-muted/30"
          style={{ animationDelay: '0.1s' }}
        >
          <iframe src={previewSrc} title="Resume" className="h-[70vh] min-h-[500px] w-full" />
        </div>
      </section>
    </Container>
  );
}
