import { ImageResponse } from 'next/og';

import { profile, seo } from '@/lib/data';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Favicon: seo.favicon file if provided, else generated from initials (documented default). */
export default function Icon() {
  const initials = profile.fullName
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  void seo; // file-based favicon (seo.favicon) is copied to /app when provided
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#100f0f',
          color: '#fafafa',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {initials}
      </div>
    ),
    size,
  );
}
