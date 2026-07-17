/**
 * Syncs content/images/** -> public/images/** so authors only ever touch content/.
 * Runs automatically before `dev` and `build` (predev/prebuild).
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'content', 'images');
const DEST = path.join(process.cwd(), 'public', 'images');

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

if (fs.existsSync(SRC)) {
  const n = syncDir(SRC, DEST);
  console.log(`[sync-images] content/images -> public/images (${n} file(s) copied)`);
}
