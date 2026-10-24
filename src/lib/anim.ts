import {Easing, interpolate} from 'remotion';
import {video} from '../config';

export const sec = (s: number) => Math.round(s * video.fps);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 between startSec and startSec + durSec (eased). */
export const prog = (frame: number, startSec: number, durSec = 0.6, easing = easeOut) =>
  interpolate(frame, [sec(startSec), sec(startSec) + Math.max(1, sec(durSec))], [0, 1], {
    ...clamp,
    easing,
  });

/** Fade in at `inSec`, fade out at `outSec` (optional). */
export const vis = (frame: number, inSec: number, outSec?: number, dur = 0.5) =>
  prog(frame, inSec, dur) * (outSec === undefined ? 1 : 1 - prog(frame, outSec, dur, easeInOut));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Style helper: fade + rise. */
export const rise = (frame: number, inSec: number, outSec?: number, dist = 36) => {
  const pIn = prog(frame, inSec, 0.7);
  const v = vis(frame, inSec, outSec);
  return {
    opacity: v,
    transform: `translateY(${(1 - pIn) * dist}px)`,
  };
};

/** Soft pop for icons: scale 0.6 → 1 with slight overshoot. */
export const pop = (frame: number, inSec: number) => {
  const p = interpolate(frame, [sec(inSec), sec(inSec) + 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return {scale: lerp(0.6, 1, p), opacity: Math.min(1, p * 1.6)};
};

export const formatRM = (n: number) => 'RM' + Math.round(n).toLocaleString('en-US');
