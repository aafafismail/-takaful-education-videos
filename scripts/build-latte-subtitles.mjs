// Builds subtitles/latte-takaful.srt from src/latte/config.ts. Usage: npm run subtitles:latte
import fs from 'node:fs';
import {captions, latteText, beats} from '../src/latte/config.ts';

const ts = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
};
const cues = [
  {start: beats.hookIn, end: 4.2, text: latteText.hook},
  ...captions,
  {start: beats.end1, end: beats.cta, text: `${latteText.end1} ${latteText.end2}`},
  {start: beats.cta, end: 67.5, text: `Nak semak? ${latteText.cta}`},
];
fs.mkdirSync('subtitles', {recursive: true});
fs.writeFileSync(
  'subtitles/latte-takaful.srt',
  cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text.replace(/\*/g, '')}\n`).join('\n'),
);
console.log(`Wrote ${cues.length} cues to subtitles/latte-takaful.srt`);
