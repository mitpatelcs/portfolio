/**
 * Syncs content assets into public/ so authors only ever touch content/.
 *   content/images -> public/images   (photos, certificate scans, ...)
 *   content/files  -> public/files    (resume PDF and other downloadables)
 * Runs automatically before `dev` and `build` (predev/prebuild).
 */
import fs from 'node:fs';
import path from 'node:path';

const PAIRS = [
  ['images', 'images'],
  ['files', 'files'],
];

function syncDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let copied = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copied += syncDir(from, to);
    } else {
      const stale = !fs.existsSync(to) || fs.statSync(to).mtimeMs < fs.statSync(from).mtimeMs;
      if (stale) {
        fs.copyFileSync(from, to);
        copied += 1;
      }
    }
  }
  return copied;
}

for (const [srcName, destName] of PAIRS) {
  const src = path.join(process.cwd(), 'content', srcName);
  if (!fs.existsSync(src)) continue;
  const n = syncDir(src, path.join(process.cwd(), 'public', destName));
  console.log(`[sync-content] content/${srcName} -> public/${destName} (${n} file(s) copied)`);
}
