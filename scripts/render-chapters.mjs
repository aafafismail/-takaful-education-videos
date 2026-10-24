// Renders each chapter as its own MP4 into renders/chapters/.
import {execFileSync} from 'node:child_process';
import {chapters} from '../src/config.ts';

chapters.forEach((c, i) => {
  const out = `renders/chapters/ch${i + 1}-${c.name.toLowerCase().replace(/\s+/g, '-')}.mp4`;
  console.log(`Rendering ${c.id} → ${out}`);
  execFileSync('npx', ['remotion', 'render', c.id, out, '--log=error', ...process.argv.slice(2)], {stdio: 'inherit'});
});
