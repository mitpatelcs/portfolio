import type { MetadataRoute } from 'next';

import { footerNavigate, getBlogPosts, siteUrl } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = footerNavigate
    .filter((l) => !l.href.endsWith('.xml'))
    .map((l) => ({
      url: `${siteUrl}${l.href === '/' ? '' : l.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: l.href === '/' ? 1 : 0.7,
    }));
  const posts = getBlogPosts().map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00Z`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
