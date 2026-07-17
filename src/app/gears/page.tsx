import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { RegistryIcon } from '@/lib/icons';
import { anchorSlug, gears } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Gears - My Setup & Tools',
  description: 'Gear and tools.',
  alternates: { canonical: '/gears' },
};

export default function GearsPage() {
  if (!gears) notFound();
  return (
    <Container>
      <section className="space-y-8 pt-8">
        <div>
          <PageHeader title="Gears" subtitle={gears.subtitle} />
        </div>
        {gears.categories.map((category) => (
          <div key={category.title} className="scroll-mt-20 space-y-3" id={anchorSlug(category.title)}>
            <h2 className="text-2xl font-semibold">{category.title}</h2>
            <ul className="space-y-2">
              {category.items.map((item, i) => (
                <li key={item.name} className="animate-in-up flex items-center gap-3" style={{ animationDelay: `${i * 0.04}s` }}>
                  {category.numbered ? <span className="w-5 shrink-0 text-sm text-muted-foreground">{i + 1}</span> : null}
                  {item.icon ? (
                    <span className="shrink-0 text-muted-foreground">
                      <RegistryIcon iconKey={item.icon} className="size-4" />
                    </span>
                  ) : null}
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-w-0 items-center gap-2 no-underline"
                    >
                      <h3 className="min-w-0 truncate text-xs text-muted-foreground group-hover:underline sm:text-sm">
                        {item.name}
                        {item.description ? (
                          <span className="text-muted-foreground/70"> — {item.description}</span>
                        ) : null}
                      </h3>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  ) : (
                    <h3 className="min-w-0 truncate text-xs text-muted-foreground sm:text-sm">
                      {item.name}
                      {item.description ? <span className="text-muted-foreground/70"> — {item.description}</span> : null}
                    </h3>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Container>
  );
}
