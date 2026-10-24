import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../config';

/** Deep navy field with slow-drifting warm glows and a faint dot grid. */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 90) * 40;
  const drift2 = Math.cos(f / 110) * 50;
  return (
    <AbsoluteFill style={{backgroundColor: colors.navy}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${780 + drift}px ${260 + drift2}px, rgba(211,174,98,0.16), transparent 70%),
            radial-gradient(1000px 1000px at ${180 - drift2}px ${1700 + drift}px, rgba(210,86,74,0.10), transparent 70%),
            linear-gradient(180deg, ${colors.navy} 0%, ${colors.navyDeep} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(245,238,223,0.07) 1.6px, transparent 1.6px)',
          backgroundSize: '44px 44px',
          backgroundPosition: `${(f * 0.15) % 44}px ${(f * 0.3) % 44}px`,
          maskImage: 'linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
