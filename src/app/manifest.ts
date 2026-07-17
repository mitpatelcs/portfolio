import type { MetadataRoute } from 'next';

import { profile, seo } from '@/lib/data';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.fullName,
    short_name: profile.fullName,
    description: seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f9f9',
    theme_color: '#f9f9f9',
  };
}
