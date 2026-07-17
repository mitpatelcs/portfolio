import { Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { getBlogPost, getBlogPosts } from '@/lib/data';
import { formatPostDate } from '@/lib/utils';

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <Container className="max-w-4xl">
      <article className="pt-8">
        <header className="mb-8 space-y-4">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl leading-tight font-bold lg:text-5xl">{post.title}</h1>
            {post.description ? <p className="text-xl text-muted-foreground">{post.description}</p> : null}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" aria-hidden="true" />
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </div>
          </div>
          <Separator />
        </header>
        {post.content.trim() ? (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    [
                      rehypePrettyCode,
                      { themes: { light: 'github-light', dark: 'github-dark' }, keepBackground: false },
                    ],
                  ],
                },
              }}
            />
          </div>
        ) : (
          <div className="animate-in-up rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-lg font-semibold">Coming Soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This article is currently being written and will be published soon.
            </p>
          </div>
        )}
      </article>
    </Container>
  );
}
