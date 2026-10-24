import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {chapters, colors, fonts} from '../config';
import {Shell} from '../components/Shell';
import {Chip, Headline, Note} from '../components/Text';
import {easeInOut, prog, rise, sec, vis} from '../lib/anim';

const C = chapters[2];
const B = C.beats;
const T = C.text;

const BOTTOM = 1160;
const half = (y: number) => 420 - (350 / 580) * (BOTTOM - y);
const trap = (y1: number, y2: number) =>
  `${540 - half(y2)},${y2} ${540 + half(y2)},${y2} ${540 + half(y1)},${y1} ${540 - half(y1)},${y1}`;

const LEVELS = {
  base: {y1: 940, y2: 1160},
  middle: {y1: 745, y2: 920},
  top: {y1: 585, y2: 725},
};

const LevelText: React.FC<{y: number; w: number; x?: number; children: React.ReactNode; color: string; size?: number; opacity?: number}> = ({
  y,
  w,
  x = 540,
  children,
  color,
  size = 32,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y,
      width: w,
      textAlign: 'center',
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.15,
      color,
      opacity,
      transform: 'translateY(-50%)',
    }}
  >
    {children}
  </div>
);

export const Ch3Foundation: React.FC = () => {
  const f = useCurrentFrame();
  const away = prog(f, B.budget, 0.8, easeInOut);

  const lvl = (start: number) => {
    const p = prog(f, start, 0.8);
    return {opacity: p, transform: `translateY(${(1 - p) * 60}px)`};
  };
  const baseGlow = vis(f, B.base + 0.4) * (0.55 + 0.25 * Math.sin(f / 9)) * (1 - 0.6 * prog(f, B.middle, 1));

  // Slider knob drifts to show "set to your own capacity"
  const knob = interpolate(
    f,
    [sec(B.budget + 1.6), sec(B.budget + 2.8), sec(B.budget + 3.8), sec(B.budget + 4.8)],
    [0.18, 0.62, 0.38, 0.48],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut},
  );

  return (
    <Shell chapter={C}>
      <Headline top={370} size={82} style={rise(f, B.intro, B.budget)}>
        {T.headline}
      </Headline>

      {/* Pyramid, built bottom → top */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - away, transform: `scale(${1 - away * 0.1})`, transformOrigin: '50% 60%'}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="gold" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#E3C27E" />
              <stop offset="1" stopColor={colors.gold} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          <g style={lvl(B.base)}>
            <polygon points={trap(LEVELS.base.y1, LEVELS.base.y2)} fill={colors.gold} opacity={baseGlow} filter="url(#glow)" />
            <polygon points={trap(LEVELS.base.y1, LEVELS.base.y2)} fill="url(#gold)" />
            {[1, 2].map((k) => {
              const xm = 540 - half(1050) + (2 * half(1050) * k) / 3;
              return <line key={k} x1={xm} y1={958} x2={xm} y2={1142} stroke={colors.navy} strokeOpacity={0.35} strokeWidth={3} />;
            })}
          </g>
          <g style={lvl(B.middle)}>
            <polygon points={trap(LEVELS.middle.y1, LEVELS.middle.y2)} fill={colors.navySoft} stroke={colors.cream} strokeOpacity={0.5} strokeWidth={3} />
          </g>
          <g style={lvl(B.top)}>
            <polygon points={trap(LEVELS.top.y1, LEVELS.top.y2)} fill={colors.navySoft} stroke={colors.gold} strokeWidth={3} />
          </g>
        </svg>

        {T.base.map((label, i) => {
          const cellW = (2 * half(1050)) / 3;
          const x = 540 - half(1050) + cellW * (i + 0.5);
          return (
            <LevelText key={label} y={1052} w={cellW - 16} x={x} color={colors.navy} size={31} opacity={prog(f, B.base + 0.4 + i * 0.4, 0.5)}>
              {label}
            </LevelText>
          );
        })}
        <LevelText y={835} w={420} color={colors.cream} size={34} opacity={prog(f, B.middle + 0.3, 0.5)}>
          {T.middle}
        </LevelText>
        <LevelText y={660} w={230} color={colors.gold} size={30} opacity={prog(f, B.top + 0.3, 0.5)}>
          {T.top}
        </LevelText>

        <div style={{position: 'absolute', top: 1190, width: 1080, textAlign: 'center', ...rise(f, B.base + 0.2)}}>
          <Chip>{T.tag}</Chip>
        </div>
        <Note top={1258} style={{...rise(f, B.base + 1.6), fontSize: 26}}>
          {T.note}
        </Note>
      </div>

      {/* Budget flexibility */}
      <Headline top={370} size={78} style={rise(f, B.budget + 0.3)}>
        {T.budgetHeadline}
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 640,
          width: 1080,
          textAlign: 'center',
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 210,
          color: colors.cream,
          letterSpacing: -4,
          ...rise(f, B.budget + 0.8),
        }}
      >
        {T.tenPercent}
      </div>
      <Headline top={910} size={56} color={colors.gold} style={{...rise(f, B.budget + 1.1), fontStyle: 'italic'}}>
        {T.notRequired}
      </Headline>
      <div style={{opacity: vis(f, B.budget + 1.5)}}>
        <div style={{position: 'absolute', top: 1088, left: 220, width: 640, height: 10, borderRadius: 5, background: colors.creamFaint}} />
        <div style={{position: 'absolute', top: 1088, left: 220, width: 640 * knob, height: 10, borderRadius: 5, background: colors.gold}} />
        <div
          style={{
            position: 'absolute',
            top: 1093 - 26,
            left: 220 + 640 * knob - 26,
            width: 52,
            height: 52,
            borderRadius: 26,
            background: colors.cream,
            boxShadow: `0 0 0 8px ${colors.goldSoft}`,
          }}
        />
        <Note top={1150} style={{fontSize: 30, color: colors.creamDim}}>
          {T.sliderLabel}
        </Note>
      </div>
    </Shell>
  );
};
