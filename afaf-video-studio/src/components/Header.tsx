import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, safe} from '../brand';
import {progress} from './anim';

// Scene counter, series label and kicker. Sits just inside the top safe margin.
export const Header: React.FC<{index: number; total: number; label: string; kicker: string; dark?: boolean}> = ({
  index,
  total,
  label,
  kicker,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const p = progress(frame, 0, Math.round(0.8 * fps));
  const fg = dark ? colors.white : colors.navy;
  return (
    <div style={{position: 'absolute', top: safe.top, left: safe.left, width: width - safe.left - safe.right, opacity: p}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: fonts.sans, color: fg}}>
        <span style={{fontSize: 30, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase'}}>{label}</span>
        <span style={{fontSize: 30, fontWeight: 500, letterSpacing: '0.12em', opacity: 0.7}}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
      <div style={{display: 'flex', gap: 10, marginTop: 22}}>
        {Array.from({length: total}).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i <= index ? (dark ? colors.yellow : colors.navy) : dark ? 'rgba(255,255,255,0.22)' : 'rgba(30,42,71,0.14)',
            }}
          />
        ))}
      </div>
      {kicker ? (
        <div
          style={{
            marginTop: 54,
            fontFamily: fonts.sans,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: dark ? colors.yellow : colors.navySoft,
            translate: `${(1 - p) * -16}px 0px`,
          }}
        >
          {kicker}
        </div>
      ) : null}
    </div>
  );
};
