#!/usr/bin/env node
// Afaf Video Studio CLI. Run `npm run reel -- help`.
import {createHash} from 'node:crypto';
import {execFileSync, spawn} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {briefSchema, formatZodError} from './lib/schema.mjs';
import {lintBrief} from './lib/lint.mjs';
import {FPS, MAX_SEC, MIN_SEC, TRANSITION_FRAMES, planScenes, plain, sceneStarts, timeScenes} from './lib/storyboard.mjs';
import {buildCaption, estimatedCues, onScreenCues, parseSrt, storyboardMd, toSrt, voiceoverScript} from './lib/outputs.mjs';
import {generatePad, hasBinary, prepareMedia, probe} from './lib/media.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTS = join(ROOT, 'exports');
const rel = (p) => relative(process.cwd(), p) || '.';

class UserError extends Error {}
const fail = (msg) => {
  throw new UserError(msg);
};

const readJson = (file, label) => {
  if (!existsSync(file)) fail(`${label} not found: ${rel(file)}`);
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    fail(`${label} is not valid JSON (${rel(file)}): ${e.message}`);
  }
};
const writeJson = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
const sha = (s) => createHash('sha256').update(s).digest('hex');

const dirsFor = (slug) => {
  const base = join(EXPORTS, slug);
  return {base, preview: join(base, 'preview'), final: join(base, 'final'), sceneData: join(base, 'scene-data.json')};
};

/** Hash of the scene data plus the media it points at, used by the approval gate. */
const contentHash = (slug) => {
  const d = dirsFor(slug);
  const raw = readFileSync(d.sceneData, 'utf8');
  const data = JSON.parse(raw);
  const files = [data.media.portrait?.src, data.media.voiceover?.src, data.media.music?.src].filter(Boolean);
  const mediaSig = files
    .map((f) => {
      const p = join(ROOT, 'public', f);
      if (!existsSync(p)) fail(`Media file referenced in scene-data.json is missing: public/${f}. Run build again.`);
      return `${f}:${sha(readFileSync(p))}`;
    })
    .join('|');
  return sha(raw + '|' + mediaSig + '|' + codeHash());
};

/** Template code also counts: changing a component after approval needs a new preview. */
const codeHash = () => {
  const walk = (dir) =>
    readdirSync(dir, {withFileTypes: true}).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
  const files = walk(join(ROOT, 'src'))
    .filter((f) => /\.(tsx?|css)$/.test(f))
    .sort();
  return sha(files.map((f) => sha(readFileSync(f))).join('|'));
};

const loadSceneData = (slug) => {
  if (!slug) fail('Give the video slug, e.g. `npm run reel -- preview couples-money-talk`.');
  const d = dirsFor(slug);
  if (!existsSync(d.sceneData)) fail(`No scene data for "${slug}". Run \`npm run reel -- build briefs/<file>.json\` first.`);
  const data = readJson(d.sceneData, 'scene-data.json');
  validateSceneData(data);
  return data;
};

const validateSceneData = (data) => {
  const errs = [];
  if (data.width !== 1080 || data.height !== 1920) errs.push('width/height must be 1080×1920');
  if (data.fps !== FPS) errs.push(`fps must be ${FPS}`);
  if (!Array.isArray(data.scenes) || data.scenes.length < 4 || data.scenes.length > 5) errs.push('there must be 4 or 5 scenes');
  (data.scenes || []).forEach((s, i) => {
    if (!Number.isInteger(s.durationInFrames) || s.durationInFrames < 2 * data.transitionFrames + 30) errs.push(`scene ${i + 1}: durationInFrames is too short`);
    for (const l of s.lines || []) {
      if (!l.text) errs.push(`scene ${i + 1}: empty line`);
      if (l.at < 0 || l.at * data.fps > s.durationInFrames - 20) errs.push(`scene ${i + 1}: line "${plain(l.text).slice(0, 30)}" appears at ${l.at}s, outside the scene`);
    }
  });
  const total = (data.scenes || []).reduce((a, s) => a + s.durationInFrames, 0) - data.transitionFrames * ((data.scenes || []).length - 1);
  if (total < MIN_SEC * data.fps || total > MAX_SEC * data.fps) errs.push(`total length is ${(total / data.fps).toFixed(1)} s; it must be ${MIN_SEC} to ${MAX_SEC} s`);
  if (errs.length) fail(`scene-data.json for "${data.slug}" has problems:\n${errs.map((e) => `  • ${e}`).join('\n')}`);
  return total;
};

const checkTools = () => {
  if (!hasBinary('ffmpeg') || !hasBinary('ffprobe')) fail('ffmpeg and ffprobe are required (used to check media and the rendered file). Install ffmpeg and try again.');
};

// ---------- commands ----------

const loadBrief = (briefPath) => {
  if (!briefPath) fail('Give a brief file, e.g. `npm run reel -- build briefs/couples-money-talk.json`.');
  const file = resolve(process.cwd(), briefPath);
  const raw = readJson(file, 'Brief');
  const parsed = briefSchema.safeParse(raw);
  if (!parsed.success) fail(`Brief ${rel(file)} is not valid:\n${formatZodError(parsed.error)}`);
  const brief = parsed.data;
  const {errors, warnings} = lintBrief(brief);
  if (errors.length) fail(`Brief ${rel(file)} breaks the content rules:\n${errors.map((e) => `  • ${e}`).join('\n')}`);
  return {file, brief, warnings};
};

const cmdValidate = ([briefPath]) => {
  const {file, brief, warnings} = loadBrief(briefPath);
  const {totalFrames, notes} = timeScenes(planScenes(brief));
  console.log(`✓ ${rel(file)} is valid. ${planScenes(brief).length} scenes, about ${(totalFrames / FPS).toFixed(1)} s.`);
  for (const n of notes) console.log(`  note: ${n}`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
};

const cmdBuild = ([briefPath, ...flags]) => {
  checkTools();
  const {file, brief, warnings} = loadBrief(briefPath);
  const d = dirsFor(brief.slug);
  mkdirSync(d.base, {recursive: true});

  if (existsSync(d.sceneData) && !flags.includes('--force')) {
    const prev = existsSync(join(d.base, 'report.json')) ? readJson(join(d.base, 'report.json'), 'report.json') : {};
    if (prev.generatedSceneDataHash !== sha(readFileSync(d.sceneData, 'utf8'))) {
      fail(`exports/${brief.slug}/scene-data.json has hand edits. Rebuilding would overwrite them. Re-run with --force to replace it, or skip build and run preview.`);
    }
  }

  const {media, report: mediaReport, warnings: mediaWarnings} = prepareMedia({root: ROOT, briefDir: dirname(file), brief});
  const planned = planScenes(brief);
  const {scenes, totalFrames, notes} = timeScenes(planned, {voiceoverSec: media.voiceover?.durationSec ?? null});

  const usePortrait = brief.media.portrait?.useIn ?? [];
  scenes.forEach((s) => (s.showPortrait = !!media.portrait && usePortrait.includes(s.type)));

  const data = {
    version: 1,
    slug: brief.slug,
    topic: brief.topic,
    fps: FPS,
    width: 1080,
    height: 1920,
    transitionFrames: TRANSITION_FRAMES,
    seriesLabel: brief.seriesLabel,
    signoff: brief.signoff,
    media: {portrait: media.portrait, voiceover: media.voiceover, music: media.music},
    captions: {mode: 'none', burnIn: false, cues: []},
    cover: {title: brief.cover.title ?? brief.hook, kicker: brief.cover.kicker ?? brief.seriesLabel},
    scenes,
  };
  if (data.media.portrait && !usePortrait.includes('cover')) data.cover.noPortrait = true;

  const captionNotes = [];
  if (media.voiceover && media.voiceoverSrtPath) {
    data.captions = {mode: 'provided-srt', burnIn: true, cues: parseSrt(readFileSync(media.voiceoverSrtPath, 'utf8'))};
    captionNotes.push('Captions come from your SRT file and are burned in.');
  } else if (media.voiceover) {
    data.captions = {mode: 'estimated-from-script', burnIn: !!brief.captions.allowEstimated, cues: estimatedCues(data)};
    captionNotes.push(
      brief.captions.allowEstimated
        ? 'Captions are ESTIMATED from the script (sentence level, not matched to the audio) and burned in because captions.allowEstimated is true. Check them in preview.'
        : 'Captions are ESTIMATED from the script and NOT burned in. Supply an SRT from your audio editor (media.voiceover.srt) for accurate burned-in captions, or set captions.allowEstimated to true after checking.',
    );
  } else {
    captionNotes.push('No voiceover, so no captions are burned in. subtitles.srt lists the on-screen text with the time each line appears (it is not a speech transcript).');
  }

  if (media.musicNeedsGeneration) generatePad(media.musicNeedsGeneration, totalFrames / FPS);

  writeJson(d.sceneData, data);
  copyFileSync(file, join(d.base, 'brief.json'));
  writeFileSync(join(d.base, 'caption.txt'), buildCaption(brief));
  writeFileSync(join(d.base, 'voiceover-script.md'), voiceoverScript(data));
  writeFileSync(join(d.base, 'storyboard.md'), storyboardMd(data, notes));
  writeSubtitles(data);
  rmSync(join(d.base, 'approval.json'), {force: true});

  const report = {
    slug: brief.slug,
    builtAt: new Date().toISOString(),
    brief: rel(file),
    durationSec: +(totalFrames / FPS).toFixed(2),
    scenes: scenes.length,
    media: mediaReport,
    captions: captionNotes,
    timingNotes: notes,
    warnings: [...warnings, ...mediaWarnings],
    generatedSceneDataHash: sha(readFileSync(d.sceneData, 'utf8')),
  };
  writeJson(join(d.base, 'report.json'), report);

  console.log(`✓ Built "${brief.slug}": ${scenes.length} scenes, ${report.durationSec} s → ${rel(d.base)}/`);
  for (const l of [...mediaReport, ...captionNotes, ...notes]) console.log(`  · ${l}`);
  for (const w of report.warnings) console.log(`  ⚠ ${w}`);
  console.log(`\nNext: npm run reel -- preview ${brief.slug}`);
  return brief.slug;
};

const writeSubtitles = (data) => {
  const d = dirsFor(data.slug);
  const cues = data.captions.mode === 'none' ? onScreenCues(data) : data.captions.cues;
  writeFileSync(join(d.base, 'subtitles.srt'), toSrt(cues));
};

const tile = (inputs, output) => {
  const args = ['-y', '-v', 'error'];
  inputs.forEach((f) => args.push('-i', f));
  const pads = inputs.map((_, i) => `[${i}:v]pad=iw+16:ih+16:8:8:color=0xE9D6C5[p${i}]`).join(';');
  const stack = `${inputs.map((_, i) => `[p${i}]`).join('')}hstack=inputs=${inputs.length}`;
  args.push('-filter_complex', `${pads};${stack}`, output);
  execFileSync('ffmpeg', args, {stdio: 'inherit'});
};

const cmdPreview = async ([slug]) => {
  checkTools();
  const data = loadSceneData(slug);
  const d = dirsFor(slug);
  const {makeBundle, renderFrame, renderReel} = await import('./lib/render.mjs');
  writeSubtitles(data);
  mkdirSync(join(d.preview, 'frames'), {recursive: true});
  const hash = contentHash(slug);
  const serveUrl = await makeBundle(ROOT);

  const starts = sceneStarts(data.scenes, data.transitionFrames);
  const frames = [];
  for (const [i, s] of data.scenes.entries()) {
    const lastAt = Math.max(0, ...s.lines.map((l) => l.at), ...(s.items ?? []).map((x) => x.at));
    const local = Math.min(s.durationInFrames - data.transitionFrames - 2, Math.round((lastAt + 1.4) * data.fps));
    const out = join(d.preview, 'frames', `scene-${String(i + 1).padStart(2, '0')}.png`);
    await renderFrame({serveUrl, inputProps: data, id: 'Reel', frame: starts[i] + local, output: out, scale: 0.5});
    frames.push(out);
    console.log(`[frames] scene ${i + 1} at frame ${starts[i] + local}`);
  }
  tile(frames, join(d.preview, 'contact-sheet.png'));
  await renderFrame({serveUrl, inputProps: data, id: 'Cover', output: join(d.preview, 'cover-preview.png'), scale: 0.5});
  await renderReel({serveUrl, inputProps: data, output: join(d.preview, 'preview.mp4'), preview: true});
  writeJson(join(d.preview, 'preview.json'), {renderedAt: new Date().toISOString(), contentHash: hash});
  rmSync(join(d.base, 'approval.json'), {force: true});

  console.log(`\n✓ Preview ready in ${rel(d.preview)}/`);
  console.log('  preview.mp4 (540×960), contact-sheet.png, cover-preview.png, frames/');
  console.log(`  Live, scrubbable preview: npm run studio -- ${slug}`);
  console.log(`\nWhen you are happy: npm run reel -- approve ${slug}`);
};

const cmdApprove = ([slug, ...rest]) => {
  const data = loadSceneData(slug);
  const d = dirsFor(slug);
  const metaFile = join(d.preview, 'preview.json');
  if (!existsSync(metaFile)) fail(`No preview for "${slug}" yet. Run \`npm run reel -- preview ${slug}\` and watch it first.`);
  const meta = readJson(metaFile, 'preview.json');
  if (meta.contentHash !== contentHash(slug)) fail(`scene-data.json or media changed after the last preview. Run \`npm run reel -- preview ${slug}\` again before approving.`);
  const byIdx = rest.indexOf('--by');
  const by = byIdx >= 0 ? rest[byIdx + 1] : process.env.USER || 'unknown';
  writeJson(join(d.base, 'approval.json'), {approvedAt: new Date().toISOString(), approvedBy: by, contentHash: meta.contentHash, preview: meta.renderedAt});
  console.log(`✓ Approved "${data.slug}". Next: npm run reel -- render ${slug}`);
};

const verify = (file, expect) => {
  if (!existsSync(file) || statSync(file).size === 0) fail(`Render finished but ${rel(file)} is missing or empty.`);
  const info = probe(file);
  const v = info.streams.find((s) => s.codec_type === 'video');
  const a = info.streams.find((s) => s.codec_type === 'audio');
  const [num, den] = (v?.r_frame_rate || '0/1').split('/').map(Number);
  const duration = Number(info.format.duration);
  const checks = [
    ['video stream present', !!v],
    ['resolution 1080×1920', v?.width === 1080 && v?.height === 1920],
    ['30 fps', Math.abs(num / den - 30) < 0.01],
    ['H.264', v?.codec_name === 'h264'],
    ['yuv420p', v?.pix_fmt === 'yuv420p'],
    [`duration ${MIN_SEC} to ${MAX_SEC} s (got ${duration.toFixed(2)} s)`, duration >= MIN_SEC - 0.05 && duration <= MAX_SEC + 0.05],
    [`duration matches scene data (${(expect / FPS).toFixed(2)} s)`, Math.abs(duration - expect / FPS) < 0.15],
    ['audio track present (AAC)', a?.codec_name === 'aac'],
  ];
  return {checks, size: statSync(file).size, duration, frames: Number(v?.nb_frames)};
};

const cmdRender = async ([slug]) => {
  checkTools();
  const data = loadSceneData(slug);
  const d = dirsFor(slug);
  const approvalFile = join(d.base, 'approval.json');
  if (!existsSync(approvalFile)) fail(`"${slug}" is not approved. Preview it, then run \`npm run reel -- approve ${slug}\`.`);
  const approval = readJson(approvalFile, 'approval.json');
  if (approval.contentHash !== contentHash(slug)) fail(`Content changed after approval. Run preview and approve again.`);

  const {makeBundle, renderFrame, renderReel} = await import('./lib/render.mjs');
  mkdirSync(d.final, {recursive: true});
  writeSubtitles(data);
  const serveUrl = await makeBundle(ROOT);
  const mp4 = join(d.final, `${slug}.mp4`);
  const cover = join(d.final, `${slug}-cover.png`);
  await renderReel({serveUrl, inputProps: data, output: mp4});
  await renderFrame({serveUrl, inputProps: data, id: 'Cover', output: cover});
  copyFileSync(join(d.base, 'subtitles.srt'), join(d.final, `${slug}.srt`));
  copyFileSync(join(d.base, 'caption.txt'), join(d.final, 'caption.txt'));
  copyFileSync(join(d.base, 'voiceover-script.md'), join(d.final, 'voiceover-script.md'));

  const total = validateSceneData(data);
  const result = verify(mp4, total);
  const coverInfo = probe(cover).streams[0];
  result.checks.push(['cover PNG is 1080×1920', coverInfo.width === 1080 && coverInfo.height === 1920]);
  const ok = result.checks.every(([, pass]) => pass);
  writeJson(join(d.final, 'render-report.json'), {
    renderedAt: new Date().toISOString(),
    ok,
    file: rel(mp4),
    bytes: result.size,
    durationSec: result.duration,
    frames: result.frames,
    checks: Object.fromEntries(result.checks),
    approval,
    published: false,
  });
  console.log('\nOutput checks (ffprobe):');
  for (const [label, pass] of result.checks) console.log(`  ${pass ? '✓' : '✗'} ${label}`);
  if (!ok) fail('The rendered file did not pass every check. See render-report.json.');
  console.log(`\n✓ Final files in ${rel(d.final)}/ (${(result.size / 1e6).toFixed(1)} MB). Nothing was published.`);
};

const cmdStudio = ([slug]) => {
  const args = ['remotion', 'studio', 'src/index.ts'];
  if (slug) {
    loadSceneData(slug);
    args.push(`--props=${join('exports', slug, 'scene-data.json')}`);
  }
  console.log(`Opening Remotion Studio${slug ? ` with exports/${slug}/scene-data.json` : ''}…`);
  spawn('npx', args, {cwd: ROOT, stdio: 'inherit'}).on('exit', (c) => process.exit(c ?? 0));
};

const cmdMake = async ([briefPath, ...flags]) => {
  const slug = cmdBuild([briefPath, ...flags]);
  await cmdPreview([slug]);
};

const HELP = `Afaf Video Studio: brief → Instagram Reel

  npm run reel -- validate <brief.json>   Check a brief against the schema and content rules
  npm run reel -- build <brief.json>      Brief → scene data, storyboard, caption, script, SRT
  npm run reel -- preview <slug>          Contact sheet, cover preview and 540p preview MP4
  npm run reel -- make <brief.json>       build + preview in one go
  npm run studio -- <slug>                Live preview in Remotion Studio
  npm run reel -- approve <slug>          Approve the current preview (required before render)
  npm run reel -- render <slug>           Final 1080×1920 MP4 + cover PNG + SRT, then ffprobe checks

Flags: build --force (overwrite hand-edited scene data), approve --by <name>
Nothing is ever published. Outputs live in exports/<slug>/.`;

const commands = {validate: cmdValidate, build: cmdBuild, preview: cmdPreview, approve: cmdApprove, render: cmdRender, studio: cmdStudio, make: cmdMake};

const [cmd, ...args] = process.argv.slice(2);
try {
  if (!cmd || cmd === 'help' || !commands[cmd]) {
    console.log(HELP);
    if (cmd && cmd !== 'help') process.exitCode = 1;
  } else {
    await commands[cmd](args);
  }
} catch (e) {
  if (e instanceof UserError) {
    console.error(`\n✗ ${e.message}`);
  } else {
    console.error(`\n✗ Unexpected error: ${e.stack || e.message}`);
  }
  process.exitCode = 1;
}
