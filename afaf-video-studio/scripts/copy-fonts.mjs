// Copies the OFL-licensed Fontsource font files into public/fonts so Remotion can load them locally.
import {copyFileSync, existsSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'fonts');
mkdirSync(out, {recursive: true});

const files = [
  ['playfair-display', 'playfair-display-latin-500-normal.woff2'],
  ['playfair-display', 'playfair-display-latin-600-normal.woff2'],
  ['playfair-display', 'playfair-display-latin-500-italic.woff2'],
  ['dm-sans', 'dm-sans-latin-400-normal.woff2'],
  ['dm-sans', 'dm-sans-latin-500-normal.woff2'],
  ['dm-sans', 'dm-sans-latin-700-normal.woff2'],
];

let missing = 0;
for (const [pkg, file] of files) {
  const src = join(root, 'node_modules', '@fontsource', pkg, 'files', file);
  if (!existsSync(src)) {
    console.warn(`[fonts] missing ${src}`);
    missing++;
    continue;
  }
  copyFileSync(src, join(out, file));
}
console.log(`[fonts] copied ${files.length - missing}/${files.length} font files to public/fonts`);
