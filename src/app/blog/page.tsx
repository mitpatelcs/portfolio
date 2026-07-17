import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogList from '@/components/blog/BlogList';
import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import { blogConfig, getBlogCategories, getBlogPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog - Thoughts & Tutorials',
  description: 'Blog posts.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  if (!blogConfig) notFound();
  const posts = getBlogPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    sourceUrl: p.sourceUrl,
  }));
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <PageHeader title="Blog" subtitle={blogConfig.subtitle} />
        <BlogList posts={posts} categories={getBlogCategories()} />
      </section>
    </Container>
  );
}
