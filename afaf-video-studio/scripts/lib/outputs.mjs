import {plain, sceneStarts, sentences, words} from './storyboard.mjs';

const pad = (n, l = 2) => String(n).padStart(l, '0');
export const srtTime = (ms) => {
  const t = Math.max(0, Math.round(ms));
  return `${pad(Math.floor(t / 3600000))}:${pad(Math.floor(t / 60000) % 60)}:${pad(Math.floor(t / 1000) % 60)},${pad(t % 1000, 3)}`;
};

export const toSrt = (cues) =>
  cues.map((c, i) => `${i + 1}\n${srtTime(c.startMs)} --> ${srtTime(c.endMs)}\n${c.text}\n`).join('\n');

export const parseSrt = (src) => {
  const toMs = (s) => {
    const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
    if (!m) throw new Error(`Bad SRT timestamp "${s}"`);
    return ((+m[1] * 60 + +m[2]) * 60 + +m[3]) * 1000 + +m[4].padEnd(3, '0').slice(0, 3);
  };
  return src
    .replace(/\r/g, '')
    .split(/\n\s*\n/)
    .map((block) => block.trim().split('\n'))
    .filter((l) => l.length >= 2)
    .map((l) => {
      const i = l[0].includes('-->') ? 0 : 1;
      const [a, b] = l[i].split('-->');
      return {startMs: toMs(a), endMs: toMs(b), text: l.slice(i + 1).join(' ').trim()};
    })
    .filter((c) => c.text);
};

/** Cues for what appears on screen (text-led video, no voiceover). */
export const onScreenCues = (data) => {
  const starts = sceneStarts(data.scenes, data.transitionFrames);
  const cues = [];
  data.scenes.forEach((s, i) => {
    const sceneStartMs = (starts[i] / data.fps) * 1000;
    const sceneEndMs = ((starts[i] + s.durationInFrames - (i < data.scenes.length - 1 ? data.transitionFrames / 2 : 0)) / data.fps) * 1000;
    const parts = [
      ...s.lines.map((l) => ({at: l.at, text: plain(l.text)})),
      ...(s.figure ? [{at: 0.15, text: `${s.figure.value} ${s.figure.unit}`}] : []),
      ...(s.items ?? []).map((it) => ({at: it.at, text: it.text})),
    ].sort((a, b) => a.at - b.at);
    parts.forEach((p, j) => {
      const startMs = sceneStartMs + p.at * 1000;
      const endMs = j < parts.length - 1 ? sceneStartMs + parts[j + 1].at * 1000 : sceneEndMs;
      cues.push({startMs: Math.round(startMs), endMs: Math.round(Math.max(endMs, startMs + 400)), text: p.text});
    });
  });
  // Never let cues overlap across scene boundaries.
  for (let i = 0; i < cues.length - 1; i++) cues[i].endMs = Math.min(cues[i].endMs, cues[i + 1].startMs);
  return cues;
};

/**
 * Sentence-level cues spread across each scene's narration window.
 * ESTIMATED: based on word counts, not on the audio. Never word-accurate.
 */
export const estimatedCues = (data) => {
  const starts = sceneStarts(data.scenes, data.transitionFrames);
  const cues = [];
  data.scenes.forEach((s, i) => {
    const startMs = (starts[i] / data.fps) * 1000 + 250;
    const endMs = ((starts[i] + s.durationInFrames - data.transitionFrames) / data.fps) * 1000;
    const parts = sentences(s.narration);
    const total = parts.reduce((a, p) => a + words(p), 0) || 1;
    let t = startMs;
    for (const p of parts) {
      const len = ((endMs - startMs) * words(p)) / total;
      cues.push({startMs: Math.round(t), endMs: Math.round(t + len), text: p});
      t += len;
    }
  });
  return cues;
};

export const buildCaption = (b) => {
  if (b.caption) return b.caption.trim() + '\n';
  const list = b.tipItems.length ? `\n${b.tipItems.map((t) => `• ${t}`).join('\n')}` : '';
  const tags = (b.hashtags.length ? b.hashtags : ['#MoneyTalk', '#PasanganMuda', '#KewanganKeluarga']).join(' ');
  return [plain(b.hook), plain(b.mainMessage), `${plain(b.narration.tip ?? b.tip)}${list}`, b.reinforce ? plain(b.reinforce) : null, plain(b.closing), tags]
    .filter(Boolean)
    .join('\n\n') + '\n';
};

export const voiceoverScript = (data) => {
  const starts = sceneStarts(data.scenes, data.transitionFrames);
  const rows = data.scenes
    .map((s, i) => {
      const a = (starts[i] / data.fps).toFixed(1);
      const b = ((starts[i] + s.durationInFrames) / data.fps).toFixed(1);
      return `## Scene ${i + 1} · ${s.type} · ${a}s to ${b}s\n\n${s.narration}\n`;
    })
    .join('\n');
  const total = data.scenes.reduce((a, s) => a + words(s.narration), 0);
  return `# Voiceover script: ${data.topic}

This is a script for a real human recording. It is not a transcript and it is not synthesised.

Total: ${total} words, about ${Math.round(total / 2.5)} s at a calm pace. Keep the full recording between 19 and 29 s.

How to record
- Quiet room, phone 20 cm from your mouth, one take per scene or one continuous take.
- Warm, conversational, unhurried. Small pause between scenes.
- Save as WAV or M4A in briefs/media/, set media.voiceover.path in the brief, then rebuild.
- For captions that match the audio exactly, also export an SRT from your editor and set media.voiceover.srt.

${rows}`;
};

export const storyboardMd = (data, notes) => {
  const starts = sceneStarts(data.scenes, data.transitionFrames);
  const total = (starts[starts.length - 1] + data.scenes[data.scenes.length - 1].durationInFrames) / data.fps;
  const rows = data.scenes
    .map((s, i) => {
      const a = (starts[i] / data.fps).toFixed(1);
      const len = (s.durationInFrames / data.fps).toFixed(1);
      const screen = [
        s.figure ? `**${s.figure.value} ${s.figure.unit}**` : null,
        ...s.lines.map((l) => `${l.text} _(at ${l.at}s, ${l.size})_`),
        ...(s.items ?? []).map((it) => `☐ ${it.text} _(at ${it.at}s)_`),
      ]
        .filter(Boolean)
        .join('<br>');
      return `| ${i + 1} | ${s.type} | ${a}s | ${len}s | ${s.kicker || '–'} | ${screen} |`;
    })
    .join('\n');
  return `# Storyboard: ${data.topic}

${data.width}×${data.height}, ${data.fps} fps, ${total.toFixed(1)} s, ${data.scenes.length} scenes, ${data.transitionFrames}-frame crossfades.
Portrait: ${data.media.portrait ? data.media.portrait.src : 'none supplied (text-led design)'}.
Voiceover: ${data.media.voiceover ? `${data.media.voiceover.src} (${data.media.voiceover.durationSec.toFixed(1)} s)` : 'none supplied (text-led video)'}.
Music: ${data.media.music ? `${data.media.music.src} (${data.media.music.credit})` : 'none'}.
${notes.length ? `\nTiming notes: ${notes.join(' ')}\n` : ''}
| # | Scene | Starts | Length | Kicker | On screen |
|---|---|---|---|---|---|
${rows}

Edit exports/${data.slug}/scene-data.json to change text, timing or sizes, then run \`npm run reel -- preview ${data.slug}\`.
`;
};
