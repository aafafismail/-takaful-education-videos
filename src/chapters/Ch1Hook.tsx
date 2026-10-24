import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {chapters, colors, fonts, safe, source} from '../config';
import {Shell} from '../components/Shell';
import {Glass, Pill} from '../components/Glass';
import {IconShield} from '../components/Icons';
import {bounce, prog, sec, vis} from '../lib/anim';

const C = chapters[0];
const B = C.beats;
const T = C.text;
const W = safe.right - safe.left;

const popStyle = (f: number, inSec: number, outSec?: number) => {
  const p = bounce(f, inSec, 13);
  return {opacity: Math.min(1, p * 2) * (outSec === undefined ? 1 : 1 - prog(f, outSec, 0.3)), transform: `scale(${0.85 + 0.15 * p})`};
};

export const Ch1Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shell chapter={C}>
      {/* salary notification */}
      <div style={{position: 'absolute', top: 400, left: safe.left, width: W, ...popStyle(f, B.notification + 0.1, B.flowStart + 0.2)}}>
        <Glass strong style={{display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px'}}>
          <div style={{width: 80, height: 80, borderRadius: 22, background: colors.captionHighlight, color: '#1A1206', fontWeight: 800, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>RM</div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 24, opacity: 0.75}}>{T.notifyApp}</div>
            <div style={{fontSize: 40, fontWeight: 800}}>{T.notifyTitle}</div>
          </div>
          <div style={{fontSize: 40, fontWeight: 800, color: colors.captionHighlight}}>{T.notifyAmount}</div>
        </Glass>
      </div>

      {/* money gets split into blocks */}
      <div style={{position: 'absolute', top: 400, left: safe.left, width: W, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        {T.blocks.map((label, i) => {
          const start = B.flowStart + 0.3 + i * B.blockStagger * 0.7;
          return (
            <div key={label} style={popStyle(f, start, B.protectionWaits - 0.1)}>
              <Glass style={{padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, fontSize: 38, fontWeight: 800}}>
                <span style={{width: 34, height: 34, borderRadius: 17, background: colors.captionHighlight, boxShadow: '0 0 18px rgba(255,213,74,0.8)'}} />
                {label}
                <span style={{marginLeft: 'auto', fontSize: 30, color: colors.captionHighlight}}>✓</span>
              </Glass>
            </div>
          );
        })}
      </div>

      {/* protection waits for the leftovers */}
      <div style={{position: 'absolute', top: 410, left: safe.left, width: W, ...popStyle(f, B.protectionWaits + 0.2, B.statStart - 0.3)}}>
        <Glass strong style={{padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 22, border: `3px dashed ${colors.captionHighlight}`}}>
          <IconShield size={96} color={colors.captionHighlight} accent="#FFFFFF" />
          <div>
            <div style={{fontSize: 46, fontWeight: 800}}>{T.protection}</div>
            <div style={{fontSize: 32, opacity: 0.85, fontStyle: 'italic'}}>
              {T.waiting}
              {'.'.repeat(Math.floor(f / 9) % 4)}
            </div>
          </div>
        </Glass>
      </div>

      <Stat f={f} />
    </Shell>
  );
};

const Stat: React.FC<{f: number}> = ({f}) => {
  const s = B.statStart + 0.6;
  if (f < sec(s) - 1) return null;
  const count = interpolate(f, [sec(s + 0.3), sec(s + 1.8)], [0, T.statValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  return (
    <div style={{position: 'absolute', top: 380, left: safe.left, width: W, ...popStyle(f, s)}}>
      <Glass strong style={{padding: '34px 34px 30px', textAlign: 'center'}}>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.9}}>{T.statLabel}</div>
        <div style={{fontFamily: fonts.caption, fontSize: 250, lineHeight: 1.05, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>
          {count.toFixed(2)}
          <span style={{color: colors.captionHighlight}}>%</span>
        </div>
        <div style={{opacity: vis(f, s + 1.6)}}>
          <Pill>Malaysia | {T.statYear}</Pill>
        </div>
        <div style={{marginTop: 22, fontSize: 25, lineHeight: 1.4, opacity: 0.85 * vis(f, s + 2.2)}}>{T.statNote}</div>
        <div style={{marginTop: 12, fontSize: 21, opacity: 0.65 * vis(f, s + 2.6)}}>{source.label}</div>
      </Glass>
    </div>
  );
};
