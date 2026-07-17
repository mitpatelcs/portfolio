import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { movies } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Movies - My Favorites',
  description: 'Films and shows that have inspired and entertained me.',
  alternates: { canonical: '/movies' },
};

export default function MoviesPage() {
  if (!movies) notFound();
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Movies" subtitle={movies.subtitle} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          {movies.items.map((movie, i) => (
            <div key={movie.title} className="animate-in-up" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
              <Card role="presentation" className="cursor-default">
                <CardContent>
                  <h3 className="text-base leading-tight font-semibold text-primary">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">{movie.year}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
