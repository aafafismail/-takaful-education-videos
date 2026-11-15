// Renders the five couple-money B-roll overlays to end-project/couple-money/.
// Usage: npm run couple:render
import {execSync} from 'node:child_process';

const jobs = [
  ['CoupleOverlay01', 'overlay_01.mp4'],
  ['CoupleOverlay02', 'overlay_02.mp4'],
  ['CoupleOverlay03', 'overlay_03.mp4'],
  ['CoupleOverlay04', 'overlay_04.mp4'],
  ['CoupleOverlay05', 'overlay_05.mp4'],
];

for (const [id, file] of jobs) {
  const out = `end-project/couple-money/${file}`;
  console.log(`\n▶ ${id} → ${out}`);
  // --muted: no audio track. --image-format=png: standard yuv420p output (JPEG frames give full-range yuvj420p).
  execSync(`npx remotion render ${id} ${out} --muted --image-format=png`, {stdio: 'inherit'});
}
