import React from 'react';
import {interpolate, spring, useCurrentFrame} from 'remotion';
import {Caption, colors, fonts, safe, video} from '../config';
import {sec} from '../lib/anim';

/** Split "plain *highlight* plain" into words with a highlight flag. */
const words = (text: string) => {
  const out: {w: string; hi: boolean}[] = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    const hi = part.startsWith('*') && part.endsWith('*');
    part
      .replace(/\*/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({w, hi}));
  });
  return out;
};

const OUTLINE = [
  '3px 0 0 #000', '-3px 0 0 #000', '0 3px 0 #000', '0 -3px 0 #000',
  '2px 2px 0 #000', '-2px 2px 0 #000', '2px -2px 0 #000', '-2px -2px 0 #000',
  '0 6px 14px rgba(0,0,0,0.6)',
].join(', ');

/** Bold uppercase captions, yellow keywords, words pop in one by one. */
export const Captions: React.FC<{captions: readonly Caption[]}> = ({captions}) => {
  const f = useCurrentFrame();
  if (!video.showCaptions) return null;
  const cue = captions.find((c) => f >= sec(c.start) && f < sec(c.end));
  if (!cue) return null;
  const a = sec(cue.start);
  const b = sec(cue.end);
  const out = interpolate(f, [b - 5, b], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const list = words(cue.text);
  const stagger = Math.min(3, Math.floor((b - a) * 0.45 / Math.max(1, list.length)));
  return (
    <div
      style={{
        position: 'absolute',
        top: safe.captionTop - 205,
        left: safe.left - 10,
        width: safe.right - safe.left + 20,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'flex-start',
        columnGap: 16,
        rowGap: 2,
        opacity: out,
        fontFamily: fonts.caption,
        fontSize: 72,
        lineHeight: 1.08,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textShadow: OUTLINE,
      }}
    >
      {list.map(({w, hi}, i) => {
        const s = spring({frame: f - a - i * stagger, fps: video.fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: hi ? colors.captionHighlight : '#FFFFFF',
              transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 18}px)`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
