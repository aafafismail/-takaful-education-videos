import {Easing, interpolate} from 'remotion';

export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 progress starting at `startFrame` and lasting `len` frames. */
export const progress = (frame: number, startFrame: number, len: number) =>
  interpolate(frame, [startFrame, startFrame + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
