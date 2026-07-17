import { ImageResponse } from 'next/og';

import { profile, seo } from '@/lib/data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Portfolio';

/** OG card: generated from profile data while seo.ogImage is unset (documented default). */
export default function OpengraphImage() {
  void seo;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#100f0f',
          color: '#fafafa',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>{profile.fullName}</div>
        <div style={{ fontSize: 36, color: '#a1a1a1', marginTop: 12 }}>{profile.jobTitle}</div>
      </div>
    ),
    size,
  );
}
