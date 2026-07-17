import { NextResponse } from 'next/server';

import { config } from '@/lib/data';

/**
 * Visitor counter (features.visitorCounter). Uses Upstash Redis REST if
 * configured; otherwise responds with { count: null } and the UI hides itself.
 */
async function redis(command: (string | number)[]): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: number };
  return data.result;
}

export async function GET() {
  if (!config.features.visitorCounter) return NextResponse.json({ count: null }, { status: 404 });
  const count = await redis(['GET', 'visitors']);
  return NextResponse.json({ count: count === null ? null : Number(count) });
}

export async function POST() {
  if (!config.features.visitorCounter) return NextResponse.json({ count: null }, { status: 404 });
  const count = await redis(['INCR', 'visitors']);
  return NextResponse.json({ count });
}
