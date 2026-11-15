import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, statSync} from 'node:fs';
import {extname, isAbsolute, join, resolve} from 'node:path';

export const IMAGE = ['.jpg', '.jpeg', '.png', '.webp'];
export const VIDEO = ['.mp4', '.mov', '.webm', '.m4v'];
export const AUDIO = ['.wav', '.mp3', '.m4a', '.aac'];

export const hasBinary = (bin) => {
  try {
    execFileSync(bin, ['-version'], {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
};

export const probe = (file) => {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {encoding: 'utf8'});
  return JSON.parse(out);
};

export const resolveInput = (root, briefDir, p) => {
  if (isAbsolute(p)) return p;
  const fromRoot = resolve(root, p);
  if (existsSync(fromRoot)) return fromRoot;
  return resolve(briefDir, p);
};

const must = (file, label, exts) => {
  if (!existsSync(file)) throw new Error(`${label} not found: ${file}`);
  if (!statSync(file).isFile()) throw new Error(`${label} is not a file: ${file}`);
  const ext = extname(file).toLowerCase();
  if (!exts.includes(ext)) throw new Error(`${label} must be one of ${exts.join(', ')} (got "${ext}")`);
  return ext;
};

/** Validates and copies user media into public/media/<slug>/. Returns scene-data media + report lines. */
export const prepareMedia = ({root, briefDir, brief}) => {
  const outDir = join(root, 'public', 'media', brief.slug);
  mkdirSync(outDir, {recursive: true});
  const rel = (name) => `media/${brief.slug}/${name}`;
  const report = [];
  const warnings = [];
  const media = {portrait: null, voiceover: null, music: null};

  const p = brief.media.portrait;
  if (p) {
    const src = resolveInput(root, briefDir, p.path);
    const ext = must(src, 'Portrait', [...IMAGE, ...VIDEO]);
    const kind = IMAGE.includes(ext) ? 'image' : 'video';
    const v = probe(src).streams.find((s) => s.codec_type === 'video');
    if (!v) throw new Error(`Portrait has no readable image/video stream: ${src}`);
    if (Math.min(v.width, v.height) < 1000) warnings.push(`Portrait is ${v.width}×${v.height}. Use at least 1080 px on the short side for a sharp result.`);
    copyFileSync(src, join(outDir, `portrait${ext}`));
    media.portrait = {kind, src: rel(`portrait${ext}`), focus: p.focus};
    report.push(`Portrait: ${src} (${kind}, ${v.width}×${v.height}). Shown unedited, with a gentle zoom only.`);
  } else {
    report.push('Portrait: none supplied. Text-led editorial design used.');
  }

  const vo = brief.media.voiceover;
  if (vo) {
    const src = resolveInput(root, briefDir, vo.path);
    const ext = must(src, 'Voiceover', AUDIO);
    const info = probe(src);
    if (!info.streams.some((s) => s.codec_type === 'audio')) throw new Error(`Voiceover has no audio stream: ${src}`);
    const durationSec = Number(info.format.duration);
    copyFileSync(src, join(outDir, `voiceover${ext}`));
    media.voiceover = {src: rel(`voiceover${ext}`), durationSec};
    report.push(`Voiceover: ${src} (${durationSec.toFixed(2)} s, real recording confirmed in brief).`);
    if (vo.srt) {
      const srt = resolveInput(root, briefDir, vo.srt);
      must(srt, 'Voiceover SRT', ['.srt']);
      media.voiceoverSrtPath = srt;
    }
  } else {
    report.push('Voiceover: none supplied. Text-led video; a voiceover script is still generated.');
  }

  const m = brief.media.music;
  if (m === 'generated') {
    media.music = {src: rel('music-generated.m4a'), volume: 0.8, credit: 'Original ambient pad synthesised by scripts/lib/media.mjs (no samples, no third-party audio)'};
    media.musicNeedsGeneration = join(outDir, 'music-generated.m4a');
    report.push('Music: original ambient pad generated locally with ffmpeg.');
  } else if (m && m !== 'none') {
    const src = resolveInput(root, briefDir, m.path);
    const ext = must(src, 'Music', AUDIO);
    copyFileSync(src, join(outDir, `music${ext}`));
    media.music = {src: rel(`music${ext}`), volume: m.volume, credit: m.license};
    report.push(`Music: ${src}. License noted in brief: ${m.license}`);
  } else {
    report.push('Music: none.');
  }
  return {media, report, warnings};
};

/**
 * Synthesises a quiet, original ambient pad (sine partials, slow swells, soft echo).
 * Entirely generated from maths, so there is no licensing question.
 */
export const generatePad = (file, durationSec) => {
  const d = (durationSec + 1).toFixed(2);
  const swell = (rate, phase) => `(0.55+0.45*sin(2*PI*${rate}*t+${phase}))`;
  const voice = (f, amp, rate, phase) => `${amp}*sin(2*PI*${f}*t)*${swell(rate, phase)}`;
  // Fmaj9 colour: F2 C3 F3 A3 C4 with E4/G4 alternating slowly.
  const expr = [
    voice(87.31, 0.10, 0.05, 0),
    voice(130.81, 0.07, 0.07, 1.1),
    voice(174.61, 0.08, 0.06, 2.3),
    voice(220.0, 0.06, 0.09, 0.7),
    voice(261.63, 0.045, 0.08, 1.9),
    `0.035*sin(2*PI*329.63*t)*(0.5+0.5*sin(2*PI*t/12))`,
    `0.03*sin(2*PI*392.0*t)*(0.5-0.5*sin(2*PI*t/12))`,
  ].join('+');
  const fadeOut = Math.max(0, durationSec - 2.5).toFixed(2);
  execFileSync(
    'ffmpeg',
    [
      '-y', '-v', 'error',
      '-f', 'lavfi', '-i', `aevalsrc=${expr}:s=48000:d=${d}`,
      '-af', `lowpass=f=1400,aecho=0.8:0.6:180|360:0.22|0.14,afade=t=in:d=2,afade=t=out:st=${fadeOut}:d=2.5,volume=2.0`,
      '-ac', '2', '-c:a', 'aac', '-b:a', '160k', file,
    ],
    {stdio: 'inherit'},
  );
};
