import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../config';

/** Warm paper background with soft drifting colour blobs and tiny sparkles. */
export const Background: React.FC<{tint?: string}> = ({tint = colors.gold}) => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 80) * 30;
  const d2 = Math.cos(f / 95) * 36;
  return (
    <AbsoluteFill style={{backgroundColor: colors.cream}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="blur80">
            <feGaussianBlur stdDeviation="70" />
          </filter>
        </defs>
        <circle cx={900 + d1} cy={300 + d2} r={300} fill={tint} opacity={0.32} filter="url(#blur80)" />
        <circle cx={120 - d2} cy={1650 + d1} r={340} fill={colors.red} opacity={0.14} filter="url(#blur80)" />
        <circle cx={150 + d2} cy={700 - d1} r={200} fill={colors.sky} opacity={0.5} filter="url(#blur80)" />
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(20,37,74,0.07) 1.4px, transparent 1.6px)',
          backgroundSize: '26px 26px',
        }}
      />
    </AbsoluteFill>
  );
};
