import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CollapsibleCode from '@/components/common/CollapsibleCode';
import Container from '@/components/common/Container';
import CopyButton from '@/components/common/CopyButton';
import PageHeader from '@/components/common/PageHeader';
import { readContentFile, terminal } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Terminal Setup - Shell Configuration Guide',
  description: 'Terminal setup configuration.',
  alternates: { canonical: '/terminal' },
};

export default function TerminalPage() {
  if (!terminal) notFound();
  const install = terminal.installCommandFile ? readContentFile(terminal.installCommandFile) : terminal.installCommand;
  return (
    <Container>
      <section className="space-y-8 pt-8">
        <div>
          <PageHeader title="Terminal Setup" subtitle={terminal.subtitle} />
        </div>

        {terminal.prerequisites.filter((p) => p.name).length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Prerequisites</h2>
            <ol className="space-y-2">
              {terminal.prerequisites
                .filter((p) => p.name)
                .map((p, i) => (
                  <li key={p.name} className="flex items-start gap-3">
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        ) : null}

        {install ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Install Required Packages</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex justify-end px-4 pt-3">
                <CopyButton text={install} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">{install}</pre>
            </div>
          </div>
        ) : null}

        {terminal.configFiles
          .filter((c) => c.file)
          .map((c) => (
            <CollapsibleCode key={c.file} title={c.title} code={readContentFile(c.file)} />
          ))}

        {terminal.sourceRepo.url ? (
          <a
            href={terminal.sourceRepo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 no-underline transition-colors hover:bg-muted/60"
          >
            <div>
              <h2 className="text-base font-semibold">{terminal.sourceRepo.name}</h2>
              <p className="text-sm text-muted-foreground">{terminal.sourceRepo.description}</p>
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          </a>
        ) : null}
      </section>
    </Container>
  );
}
