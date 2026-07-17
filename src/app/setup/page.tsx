import { Download } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CollapsibleCode from '@/components/common/CollapsibleCode';
import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { Kbd } from '@/components/ui/kbd';
import { readContentFile, setup } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Setup Guide - Editor Configuration',
  description: 'Editor setup guide.',
  alternates: { canonical: '/setup' },
};

export default function SetupPage() {
  if (!setup) notFound();
  const settings = setup.settingsFile ? readContentFile(setup.settingsFile) : null;
  return (
    <Container>
      <section className="space-y-8 pt-8">
        <div>
          <PageHeader title="Setup" subtitle={setup.subtitle} />
        </div>

        {setup.downloads.filter((d) => d.file).length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Download necessary files</h2>
            <div className="flex flex-wrap gap-2">
              {setup.downloads
                .filter((d) => d.file)
                .map((d) => (
                  <a
                    key={d.file}
                    href={d.file.replace(/^public/, '')}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {d.label}
                  </a>
                ))}
            </div>
          </div>
        ) : null}

        {setup.steps.map((step, si) => (
          <div key={step.title} className="space-y-3">
            <h2 className="text-2xl font-semibold">{step.title}</h2>
            <ol className="space-y-3">
              {step.substeps.map((sub, i) => (
                <li key={i} className="animate-in-up flex items-start gap-3" style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {si + 1}.{i + 1}
                  </span>
                  <div className="min-w-0 space-y-2 text-sm text-muted-foreground">
                    {sub.text ? <p>{sub.text}</p> : null}
                    {sub.kbd ? (
                      <p className="flex flex-wrap gap-1">
                        {sub.kbd.split('+').map((k) => (
                          <Kbd key={k}>{k.trim()}</Kbd>
                        ))}
                      </p>
                    ) : null}
                    {sub.code ? (
                      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-xs">{sub.code}</pre>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {settings ? <CollapsibleCode title="settings.json" code={settings} /> : null}
      </section>
    </Container>
  );
}
