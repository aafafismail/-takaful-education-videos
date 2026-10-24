import React from 'react';
import {useCurrentFrame} from 'remotion';
import {chapters, colors, safe} from '../config';
import {Shell} from '../components/Shell';
import {BigTitle, Glass} from '../components/Glass';
import {IconBag, IconCoffee, IconShield} from '../components/Icons';
import {bounce, easeInOut, lerp, prog, vis} from '../lib/anim';

const C = chapters[1];
const B = C.beats;
const T = C.text;
const W = safe.right - safe.left;

export const Ch2Postpone: React.FC = () => {
  const f = useCurrentFrame();
  const land = prog(f, B.balance + 1.4, 0.9, easeInOut);
  const fly = prog(f, B.balance + 0.5, 1.0, easeInOut);
  const tilt = -9 + 9 * land;
  return (
    <Shell chapter={C}>
      {/* now ……… later */}
      <div style={{position: 'absolute', top: 400, left: safe.left, width: W, opacity: vis(f, B.future + 0.2, B.healingOk - 0.3)}}>
        <Glass style={{padding: '30px 36px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <span style={{width: 26, height: 26, borderRadius: 13, background: colors.captionHighlight, boxShadow: '0 0 16px rgba(255,213,74,0.9)'}} />
            <div style={{flex: 1, height: 4, backgroundImage: `linear-gradient(90deg, ${colors.captionHighlight} 50%, transparent 50%)`, backgroundSize: '26px 4px', clipPath: `inset(0 ${100 - prog(f, B.future + 0.3, 1.2) * 100}% 0 0)`}} />
            <div style={{opacity: 0.35 + 0.25 * Math.sin(f / 8)}}>
              <IconShield size={70} color={colors.captionHighlight} accent="#FFFFFF" />
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 32, fontWeight: 800}}>
            <span>{T.nowLabel}</span>
            <span style={{opacity: 0.7}}>{T.laterLabel}?</span>
          </div>
        </Glass>
      </div>

      {/* make room for tomorrow: balance */}
      <div style={{position: 'absolute', top: 380, left: safe.left, width: W, opacity: vis(f, B.balance + 0.2), transform: `scale(${0.9 + 0.1 * bounce(f, B.balance + 0.2, 14)})`}}>
        <Glass strong style={{padding: '30px 30px 34px', textAlign: 'center'}}>
          <BigTitle size={64}>
            Beri ruang untuk <span style={{color: colors.captionHighlight}}>hari esok.</span>
          </BigTitle>
          <div style={{position: 'relative', height: 300, marginTop: 10}}>
            <svg width={W - 60} height={300} viewBox={`0 0 ${W - 60} 300`}>
              <g transform={`translate(${(W - 60) / 2} 150) rotate(${tilt})`}>
                <rect x={-320} y={-6} width={640} height={12} rx={6} fill={colors.captionHighlight} />
                <g transform="translate(-250 -100)">
                  <IconBagSvg />
                </g>
              </g>
              <path d={`M${(W - 60) / 2} 150 l-50 120 h100 z`} fill="rgba(255,255,255,0.12)" stroke={colors.captionHighlight} strokeWidth={4} strokeLinejoin="round" />
              <circle cx={(W - 60) / 2} cy={150} r={12} fill={colors.captionHighlight} />
            </svg>
            {/* shield flies in from "later" and lands on the right */}
            <div
              style={{
                position: 'absolute',
                left: lerp(W - 140, (W - 60) / 2 + 30 + 250 * Math.cos((tilt * Math.PI) / 180) - 50, fly),
                top: lerp(-60, 150 + 250 * Math.sin((tilt * Math.PI) / 180) - 110, fly) - Math.sin(fly * Math.PI) * 80,
                opacity: prog(f, B.balance + 0.4, 0.3),
                filter: `drop-shadow(0 0 ${20 * land}px rgba(255,213,74,0.9))`,
              }}
            >
              <IconShield size={100} color={colors.captionHighlight} accent="#FFFFFF" />
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 40px', fontSize: 32, fontWeight: 800}}>
            <span>{T.today}</span>
            <span style={{color: colors.captionHighlight}}>{T.tomorrow}</span>
          </div>
        </Glass>
      </div>
    </Shell>
  );
};

/** Bag + cup sitting on the "today" side of the beam (SVG group). */
const IconBagSvg: React.FC = () => (
  <g>
    <foreignObject x={-50} y={-10} width={220} height={110}>
      <div style={{display: 'flex', gap: 6}}>
        <IconBag size={100} color="#FFFFFF" accent={colors.captionHighlight} />
        <IconCoffee size={100} color="#FFFFFF" accent={colors.captionHighlight} />
      </div>
    </foreignObject>
  </g>
);
