import { config, getBlogPosts, profile, seo, siteUrl } from '@/lib/data';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function GET() {
  if (!config.features.rss || !config.sections.blog) return new Response('Not found', { status: 404 });
  const items = getBlogPosts()
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid>${siteUrl}/blog/${p.slug}</guid>
      <description>${escapeXml(p.description ?? '')}</description>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(profile.fullName)} - Blog</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(seo.description)}</description>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
