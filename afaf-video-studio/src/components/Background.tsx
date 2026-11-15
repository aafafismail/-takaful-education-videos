import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../brand';

// Soft editorial backdrop: warm paper, two slow-drifting colour fields and fine grain.
const layouts = [
  {a: [760, 1500, 620], b: [140, 420, 380]},
  {a: [180, 1560, 560], b: [880, 360, 340]},
  {a: [900, 980, 520], b: [120, 1500, 300]},
  {a: [540, 1650, 700], b: [860, 320, 300]},
  {a: [820, 1480, 600], b: [160, 380, 360]},
];

export const Background: React.FC<{variant: number; dark?: boolean}> = ({variant, dark = false}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const l = layouts[variant % layouts.length];
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill style={{backgroundColor: dark ? colors.navy : colors.paper, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: l.a[2] * 2,
          height: l.a[2] * 2,
          left: l.a[0] - l.a[2],
          top: l.a[1] - l.a[2],
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(70,85,122,0.55) 0%, rgba(70,85,122,0) 68%)'
            : `radial-gradient(circle, ${colors.nude} 0%, rgba(233,214,197,0) 68%)`,
          translate: `${drift * -40}px ${drift * -30}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: l.b[2] * 2,
          height: l.b[2] * 2,
          left: l.b[0] - l.b[2],
          top: l.b[1] - l.b[2],
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(245,227,161,0.16) 0%, rgba(245,227,161,0) 66%)'
            : `radial-gradient(circle, ${colors.yellowSoft} 0%, rgba(251,241,204,0) 66%)`,
          translate: `${drift * 30}px ${drift * 24}px`,
        }}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: dark ? 0.08 : 0.06, mixBlendMode: 'multiply'}}>
        <filter id={`grain-${variant}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${variant})`} />
      </svg>
    </AbsoluteFill>
  );
};
