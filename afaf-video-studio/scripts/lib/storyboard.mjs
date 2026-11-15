// Turns a validated brief into scene data with timings.

export const FPS = 30;
export const TRANSITION_FRAMES = 14;
export const MIN_SEC = 20;
export const MAX_SEC = 30;

const READ_WPS = 3.0; // on-screen reading speed (words/second)
const SPEAK_WPS = 2.5; // calm conversational narration (words/second), used only for planning
const HOLD_SEC = 1.3;
const MIN_SCENE_SEC = 3.6;

export const plain = (t) => t.replace(/\*/g, '');
export const words = (t) => plain(t).trim().split(/\s+/).filter(Boolean).length;

export const sentences = (t) =>
  t
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

const sizeFor = (t) => {
  const n = plain(t).length;
  if (n <= 26) return 'xl';
  if (n <= 52) return 'lg';
  if (n <= 90) return 'md';
  return 'sm';
};

const joinList = (items) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} dan ${items[items.length - 1]}`;

const figureFrom = (tip) => {
  const m = plain(tip).match(/(\d{1,3})\s*(minit|minutes?|mins?|hari|days?|jam|hours?)/i);
  return m ? {value: m[1], unit: m[2].toLowerCase()} : null;
};

/** Builds scenes without timing (structure + text). */
export const planScenes = (b) => {
  const k = b.kickers;
  const scenes = [
    {type: 'hook', kicker: k.hook ?? '', text: b.hook, narration: b.narration.hook ?? plain(b.hook)},
    {type: 'message', kicker: k.message ?? 'Cuba ini', text: b.mainMessage, narration: b.narration.message ?? plain(b.mainMessage)},
    {
      type: 'tip',
      kicker: k.tip ?? 'Langkah praktikal',
      text: b.tip,
      items: b.tipItems,
      figure: b.tipFigure === undefined ? figureFrom(b.tip) : b.tipFigure,
      narration: b.narration.tip ?? `${plain(b.tip)}${b.tipItems.length ? ` ${joinList(b.tipItems)}.` : ''}`,
    },
  ];
  if (b.reinforce) scenes.push({type: 'reinforce', kicker: k.reinforce ?? 'Kenapa ia membantu', text: b.reinforce, narration: b.narration.reinforce ?? plain(b.reinforce)});
  scenes.push({type: 'closing', kicker: k.closing ?? 'Minggu ini', text: b.closing, narration: b.narration.closing ?? plain(b.closing)});
  return scenes;
};

/** Natural reveal timeline for one scene, in seconds from scene start. */
const timeline = (s) => {
  // The hook must land immediately; other scenes give the transition a moment to settle.
  let t = s.type === 'hook' ? 0.1 : 0.45;
  const lines = [];
  // On the tip scene the big figure animates in first.
  if (s.type === 'tip' && s.figure) t += 0.6;
  for (const sentence of sentences(s.text)) {
    lines.push({text: sentence, at: t, size: s.type === 'tip' ? (plain(sentence).length <= 60 ? 'md' : 'sm') : sizeFor(sentence)});
    t += words(sentence) / READ_WPS + 0.35;
  }
  const items = (s.items ?? []).map((text) => {
    const at = t;
    t += Math.max(0.55, words(text) / READ_WPS);
    return {text, at};
  });
  const screenSec = t + HOLD_SEC;
  const speechSec = words(s.narration) / SPEAK_WPS + 0.9;
  return {lines, items, natural: Math.max(MIN_SCENE_SEC, screenSec, speechSec), contentEnd: t};
};

const totalFrames = (durations) => durations.reduce((a, b) => a + b, 0) - TRANSITION_FRAMES * (durations.length - 1);

/**
 * Assigns durations.
 *  - No voiceover: natural durations, stretched (more hold) to reach 20 s or compressed (faster reveals) to fit 30 s.
 *  - Voiceover: the audio length decides the total; scenes are shared out by narration word count.
 */
export const timeScenes = (planned, {voiceoverSec = null} = {}) => {
  const tl = planned.map(timeline);
  const n = planned.length;
  const overlap = TRANSITION_FRAMES * (n - 1);
  let durations;
  let scale = 1;
  const notes = [];

  if (voiceoverSec != null) {
    const target = Math.ceil((voiceoverSec + 0.8) * FPS);
    if (target > MAX_SEC * FPS) throw new Error(`Voiceover is ${voiceoverSec.toFixed(1)} s. The reel must be ${MAX_SEC} s or less, so trim the recording to about ${MAX_SEC - 1} s.`);
    const total = Math.max(target, MIN_SEC * FPS);
    if (target < MIN_SEC * FPS) notes.push(`Voiceover is ${voiceoverSec.toFixed(1)} s; the reel is padded to ${MIN_SEC} s with a silent hold at the end.`);
    const w = planned.map((s) => Math.max(1, words(s.narration)));
    const sum = w.reduce((a, b) => a + b, 0);
    durations = w.map((x) => Math.round(((total + overlap) * x) / sum));
    durations[n - 1] += total - totalFrames(durations);
  } else {
    durations = tl.map((t) => Math.round(t.natural * FPS));
    let total = totalFrames(durations);
    if (total > MAX_SEC * FPS) {
      scale = (MAX_SEC * FPS + overlap) / (total + overlap);
      if (scale < 0.8) {
        throw new Error(`Content needs about ${(total / FPS).toFixed(1)} s, which is too long for a ${MAX_SEC} s reel. Shorten the on-screen text or narration.`);
      }
      durations = durations.map((d) => Math.floor(d * scale));
      notes.push(`Reveals sped up to ${Math.round(scale * 100)}% to fit ${MAX_SEC} s.`);
    }
    total = totalFrames(durations);
    if (total < MIN_SEC * FPS) {
      const extra = MIN_SEC * FPS - total;
      const sum = durations.reduce((a, b) => a + b, 0);
      durations = durations.map((d) => d + Math.round((extra * d) / sum));
      notes.push(`Holds lengthened to reach the ${MIN_SEC} s minimum.`);
    }
    const diff = MIN_SEC * FPS - totalFrames(durations);
    if (diff > 0) durations[n - 1] += diff;
  }

  const scenes = planned.map((s, i) => {
    const t = tl[i];
    const sceneSec = durations[i] / FPS;
    // Keep reveals inside the scene; with a voiceover spread them across the spoken window.
    const f = voiceoverSec != null ? Math.min(1, (sceneSec - HOLD_SEC) / Math.max(0.1, t.contentEnd)) : scale;
    const r = (x) => Math.round(x * f * 100) / 100;
    return {
      id: `s${String(i + 1).padStart(2, '0')}-${s.type}`,
      type: s.type,
      kicker: s.kicker,
      lines: t.lines.map((l) => ({...l, at: r(l.at)})),
      ...(s.items?.length ? {items: t.items.map((it) => ({...it, at: r(it.at)}))} : {}),
      ...(s.type === 'tip' ? {figure: s.figure ?? null} : {}),
      narration: s.narration,
      durationInFrames: durations[i],
    };
  });
  return {scenes, totalFrames: totalFrames(durations), notes};
};

/** Start frame of each scene on the final timeline (transitions overlap). */
export const sceneStarts = (scenes, transitionFrames = TRANSITION_FRAMES) => {
  const starts = [];
  let f = 0;
  for (const s of scenes) {
    starts.push(f);
    f += s.durationInFrames - transitionFrames;
  }
  return starts;
};
