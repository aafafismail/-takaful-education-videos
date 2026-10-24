import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {chapters, colors, fonts, safe} from '../config';
import {Shell} from '../components/Shell';
import {BigTitle, Glass, Pill} from '../components/Glass';
import {easeInOut, prog, rise, sec, vis} from '../lib/anim';

const C = chapters[2];
const B = C.beats;
const T = C.text;
const W = safe.right - safe.left;

// Pyramid geometry (pixels in the 1080×1920 frame)
const BOTTOM = 1030;
const half = (y: number) => 420 - (350 / 560) * (BOTTOM - y);
const trap = (y1: number, y2: number) =>
  `${540 - half(y2)},${y2} ${540 + half(y2)},${y2} ${540 + half(y1)},${y1} ${540 - half(y1)},${y1}`;
const L = {base: [820, 1030], middle: [630, 805], top: [480, 615]} as const;

const Label: React.FC<{y: number; w: number; x?: number; color: string; size?: number; opacity: number; children: React.ReactNode}> = ({
  y,
  w,
  x = 540,
  color,
  size = 30,
  opacity,
  children,
}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: fonts.body, fontWeight: 800, fontSize: size, lineHeight: 1.12, color, opacity}}>
    {children}
  </div>
);

export const Ch3Foundation: React.FC = () => {
  const f = useCurrentFrame();
  const show = vis(f, B.base - 0.2, B.budget - 0.3);
  const lvl = (start: number) => {
    const p = prog(f, start, 0.7);
    return {opacity: p, transform: `translateY(${(1 - p) * 70}px)`};
  };
  const glow = vis(f, B.base + 0.4, B.middle + 0.5) * (0.55 + 0.3 * Math.sin(f / 7));
  const cellW = (2 * half(925)) / 3;
  const knob = interpolate(f, [sec(B.budget + 1.6), sec(B.budget + 2.8), sec(B.budget + 3.8), sec(B.budget + 4.8)], [0.15, 0.62, 0.36, 0.48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });

  return (
    <Shell chapter={C}>
      {/* ---------- pyramid ---------- */}
      <div style={{position: 'absolute', inset: 0, opacity: show}}>
        <BigTitle size={70} style={{position: 'absolute', top: 330, left: safe.left, width: W, textAlign: 'center', ...rise(f, B.base - 0.2)}}>
          Kukuhkan <span style={{color: colors.captionHighlight}}>asas</span> dahulu.
        </BigTitle>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="gold" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FFE08A" />
              <stop offset="1" stopColor="#E9A93A" />
            </linearGradient>
            <filter id="glow" x="-30%" y="-80%" width="160%" height="260%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
          </defs>
          <g style={lvl(B.base)}>
            <polygon points={trap(L.base[0], L.base[1])} fill="#FFD54A" opacity={glow} filter="url(#glow)" />
            <polygon points={trap(L.base[0], L.base[1])} fill="url(#gold)" stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
            {[1, 2].map((k) => {
              const x = 540 - half(925) + cellW * k;
              return <line key={k} x1={x} y1={836} x2={x} y2={1014} stroke="#1A1206" strokeOpacity={0.3} strokeWidth={3} />;
            })}
          </g>
          <g style={lvl(B.middle)}>
            <polygon points={trap(L.middle[0], L.middle[1])} fill="rgba(8,16,34,0.72)" stroke={colors.glassLine} strokeWidth={3} />
          </g>
          <g style={lvl(B.top)}>
            <polygon points={trap(L.top[0], L.top[1])} fill="rgba(8,16,34,0.78)" stroke={colors.captionHighlight} strokeWidth={3} />
          </g>
        </svg>
        {T.base.map((label, i) => (
          <Label key={label} y={925} w={cellW - 14} x={540 - half(925) + cellW * (i + 0.5)} color="#1A1206" size={29} opacity={prog(f, B.base + 0.4 + i * 0.4, 0.5)}>
            {label}
          </Label>
        ))}
        <Label y={718} w={440} color={colors.creamText} size={34} opacity={prog(f, B.middle + 0.3, 0.5)}>
          {T.middle}
        </Label>
        <Label y={550} w={230} color={colors.captionHighlight} size={30} opacity={prog(f, B.top + 0.3, 0.5)}>
          {T.top}
        </Label>
        <div style={{position: 'absolute', top: 1050, left: safe.left, width: W, textAlign: 'center', ...rise(f, B.base + 1.2)}}>
          <Pill tone="line" style={{fontSize: 22, padding: '6px 16px', background: 'rgba(8,16,34,0.6)'}}>
            {T.tag}
          </Pill>
          <div style={{marginTop: 8, fontFamily: fonts.body, fontWeight: 600, fontSize: 23, color: colors.creamText, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{T.note}</div>
        </div>
      </div>

      {/* ---------- budget flexibility ---------- */}
      <div style={{position: 'absolute', top: 390, left: safe.left, width: W, opacity: vis(f, B.budget + 0.2), transform: `translateY(${(1 - prog(f, B.budget + 0.2, 0.7)) * 60}px)`}}>
        <Glass strong style={{padding: '34px 34px 40px', textAlign: 'center'}}>
          <BigTitle size={64}>
            Bajet ikut <span style={{color: colors.captionHighlight}}>keperluan & kemampuan</span>
          </BigTitle>
          <div style={{position: 'relative', display: 'inline-block', fontFamily: fonts.caption, fontSize: 190, lineHeight: 1.1, marginTop: 10}}>
            {T.tenPercent}
            <div style={{position: 'absolute', left: -14, right: -14, top: '52%', height: 10, borderRadius: 5, background: colors.red, transform: `scaleX(${prog(f, B.budget + 1.3, 0.5)}) rotate(-8deg)`, transformOrigin: 'left'}} />
          </div>
          <div style={{fontSize: 40, fontWeight: 800, color: colors.captionHighlight, ...rise(f, B.budget + 1.4)}}>{T.notRequired}</div>
          <div style={{position: 'relative', height: 70, margin: '34px 30px 0', opacity: vis(f, B.budget + 1.6)}}>
            <div style={{position: 'absolute', top: 28, left: 0, right: 0, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.15)'}} />
            <div style={{position: 'absolute', top: 28, left: 0, width: `${knob * 100}%`, height: 14, borderRadius: 7, background: colors.captionHighlight}} />
            <div style={{position: 'absolute', top: 5, left: `calc(${knob * 100}% - 30px)`, width: 60, height: 60, borderRadius: 30, background: '#FFFFFF', boxShadow: '0 0 0 8px rgba(255,213,74,0.35)'}} />
          </div>
          <div style={{fontSize: 28, fontWeight: 600, opacity: 0.85 * vis(f, B.budget + 1.6)}}>{T.sliderLabel}</div>
        </Glass>
      </div>
    </Shell>
  );
};
