import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a Google Drive /view share link into the /preview embed form. */
export function driveToPreview(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
