import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption, colors, fonts, safe, video} from '../config';
import {sec} from '../lib/anim';

/** Burned-in subtitle band, centred and inside the safe area. */
export const Captions: React.FC<{captions: readonly Caption[]}> = ({captions}) => {
  const f = useCurrentFrame();
  if (!video.showCaptions) return null;
  const cue = captions.find((c) => f >= sec(c.start) && f < sec(c.end));
  if (!cue) return null;
  const a = sec(cue.start);
  const b = sec(cue.end);
  const o = interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: safe.captionTop,
        left: safe.left,
        width: safe.right - safe.left,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 36,
          lineHeight: 1.32,
          color: colors.cream,
          textAlign: 'center',
          background: 'rgba(8,17,31,0.72)',
          border: `1px solid ${colors.navyLine}`,
          borderRadius: 22,
          padding: '14px 26px',
          maxWidth: '100%',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
