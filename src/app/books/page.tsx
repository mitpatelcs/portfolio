import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { anchorSlug, books } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Books - My Reading List',
  description: 'Books that have influenced my thinking and growth.',
  alternates: { canonical: '/books' },
};

export default function BooksPage() {
  if (!books) notFound();
  return (
    <Container>
      <section className="space-y-8 pt-8">
        <div>
          <PageHeader title="Books" subtitle={books.subtitle} />
        </div>
        {books.groups.map((group) => (
          <div key={group.theme} className="scroll-mt-20 space-y-4" id={anchorSlug(group.theme)}>
            <h2 className="text-2xl font-semibold">{group.theme}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              {group.items.map((book, i) => (
                <div key={book.title} className="animate-in-up" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
                  <Card role="presentation" className="cursor-default">
                    <CardContent>
                      <h3 className="text-base leading-tight font-semibold text-primary">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </Container>
  );
}
