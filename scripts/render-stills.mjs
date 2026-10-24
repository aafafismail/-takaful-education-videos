// Renders key frames to out/stills/ for a quick visual check.
// Usage: node scripts/render-stills.mjs [time1 time2 ...]  (seconds in full video)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const times = process.argv.slice(2).map(Number);
const defaults = [1.2, 4.6, 7.0, 11.5, 15.0, 17.5, 20, 24.3, 26.5, 30, 34, 38, 41, 46, 49, 51, 54, 58, 63, 67, 71, 74.5, 78, 82.9];
const list = times.length ? times : defaults;
const out = path.resolve('out/stills');
fs.mkdirSync(out, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({serveUrl, id: process.env.COMP ?? 'HealingFull', inputProps: {}, browserExecutable});
for (const t of list) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
  const file = path.join(out, `t${t.toFixed(1).padStart(5, '0')}.png`);
  await renderStill({composition, serveUrl, output: file, frame, inputProps: {}, browserExecutable});
  console.log('wrote', file);
}
