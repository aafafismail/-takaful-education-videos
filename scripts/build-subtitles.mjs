// Builds .srt and .vtt subtitle files from src/config.ts (full video + each chapter).
// Usage: npm run subtitles
import fs from 'node:fs';
import {chapters, chapterStartsSec} from '../src/config.ts';

const ts = (s, sep) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${sec}${sep}${String(ms % 1000).padStart(3, '0')}`;
};
const clean = (t) => t.replace(/\*/g, '');
const srt = (cues) => cues.map((c, i) => `${i + 1}\n${ts(c.start, ',')} --> ${ts(c.end, ',')}\n${clean(c.text)}\n`).join('\n');
const vtt = (cues) => 'WEBVTT\n\n' + cues.map((c) => `${ts(c.start, '.')} --> ${ts(c.end, '.')}\n${clean(c.text)}\n`).join('\n');

fs.mkdirSync('subtitles', {recursive: true});
const all = [];
chapters.forEach((c, i) => {
  const off = chapterStartsSec[i];
  const file = `subtitles/ch${i + 1}-${c.name.toLowerCase().replace(/\s+/g, '-')}`;
  fs.writeFileSync(`${file}.srt`, srt(c.captions));
  c.captions.forEach((cue) => all.push({...cue, start: cue.start + off, end: cue.end + off}));
});
fs.writeFileSync('subtitles/healing-hari-ini-full.srt', srt(all));
fs.writeFileSync('subtitles/healing-hari-ini-full.vtt', vtt(all));
console.log(`Wrote ${all.length} cues for the full video and ${chapters.length} chapter files.`);
