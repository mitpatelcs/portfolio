import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { certifications } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Certifications - Credentials',
  description: 'Workshops, hackathons, and course credentials.',
  alternates: { canonical: '/certifications' },
};

export default function CertificationsPage() {
  if (!certifications) notFound();
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Certifications" subtitle={certifications.subtitle} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          {certifications.items.map((cert, i) => {
            const card = (
              <Card className={cert.image ? 'pt-0' : undefined}>
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={`${cert.name} certificate`}
                    width={640}
                    height={452}
                    className="aspect-[4/3] w-full rounded-t-xl border-b border-border object-cover"
                  />
                ) : null}
                <CardContent>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base leading-tight font-semibold text-primary">{cert.name}</h3>
                    {cert.url ? (
                      <ArrowUpRight
                        className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{cert.description || cert.issuer}</p>
                  {cert.date ? <p className="text-sm text-muted-foreground">{cert.date}</p> : null}
                </CardContent>
              </Card>
            );
            return (
              <div key={cert.name} className="group animate-in-up" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
                {cert.url ? (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block h-full no-underline">
                    {card}
                  </a>
                ) : (
                  card
                )}
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
