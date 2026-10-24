import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {chapters, colors, fonts, safe, source} from '../config';
import {Shell} from '../components/Shell';
import {Chip, Headline, Note} from '../components/Text';
import {lerp, prog, rise, sec, vis} from '../lib/anim';

const C = chapters[0];
const B = C.beats;
const T = C.text;

const ROW_TOP = 600;
const ROW_H = 96;
const ROW_GAP = 24;
const ROW_W = [840, 720, 580, 500];
const BLOCK_COLORS = [colors.cream, colors.gold, '#E7C98F', '#C9B79A'];

const Notification: React.FC<{f: number}> = ({f}) => {
  const p = prog(f, B.notification, 0.7);
  const out = 1 - prog(f, B.question - 0.5, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        top: 350,
        left: safe.left,
        width: safe.right - safe.left,
        height: 150,
        transform: `translateY(${(1 - p) * -60}px)`,
        opacity: p * out,
        borderRadius: 34,
        background: 'rgba(245,238,223,0.96)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 34px',
        gap: 26,
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 22,
          background: colors.navy,
          color: colors.gold,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        RM
      </div>
      <div style={{flex: 1}}>
        <div style={{fontSize: 24, color: '#6B6457', fontWeight: 500}}>{T.notifyApp}</div>
        <div style={{fontSize: 40, color: colors.navy, fontWeight: 700}}>{T.notifyTitle}</div>
      </div>
      <div style={{fontSize: 40, color: '#2F7A55', fontWeight: 700}}>{T.notifyAmount}</div>
    </div>
  );
};

const Coins: React.FC<{f: number; row: number}> = ({f, row}) => {
  const start = B.flowStart + row * B.blockStagger;
  const y1 = ROW_TOP + row * (ROW_H + ROW_GAP) + ROW_H / 2;
  const x1 = safe.left + ROW_W[row] - 40;
  const coins = [0, 1, 2, 3, 4];
  return (
    <>
      {coins.map((i) => {
        const t = interpolate(f, [sec(start) + i * 3, sec(start) + i * 3 + 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        if (t <= 0 || t >= 1) return null;
        const x = lerp(540, x1, t);
        const y = lerp(500, y1, t) - Math.sin(t * Math.PI) * 60;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 14,
              top: y - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
              background: colors.gold,
              boxShadow: `0 0 18px ${colors.gold}`,
              opacity: Math.sin(t * Math.PI),
            }}
          />
        );
      })}
    </>
  );
};

const Blocks: React.FC<{f: number}> = ({f}) => {
  const out = prog(f, B.statStart, 0.6);
  return (
    <div style={{opacity: 1 - out, transform: `translateX(${-out * 120}px)`}}>
      {T.blocks.map((label, i) => {
        const start = B.flowStart + i * B.blockStagger;
        const fill = prog(f, start + 0.2, 0.7);
        const labelIn = prog(f, start, 0.4);
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              top: ROW_TOP + i * (ROW_H + ROW_GAP),
              left: safe.left,
              width: ROW_W[i],
              height: ROW_H,
              borderRadius: 22,
              background: colors.creamFaint,
              overflow: 'hidden',
              opacity: labelIn,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${fill * 100}%`,
                background: BLOCK_COLORS[i],
                borderRadius: 22,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 30,
                top: 0,
                height: ROW_H,
                display: 'flex',
                alignItems: 'center',
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 40,
                color: fill > 0.35 ? colors.navy : colors.cream,
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
      {T.blocks.map((_, i) => (
        <Coins key={i} f={f} row={i} />
      ))}
      {/* Protection waits for the leftover */}
      <ProtectionRow f={f} />
    </div>
  );
};

const ProtectionRow: React.FC<{f: number}> = ({f}) => {
  const p = prog(f, B.protectionWaits, 0.6);
  const top = ROW_TOP + 4 * (ROW_H + ROW_GAP);
  const dots = Math.floor((f - sec(B.protectionWaits)) / 10) % 4;
  return (
    <div style={{position: 'absolute', top, left: safe.left, opacity: p, display: 'flex', alignItems: 'center', gap: 28}}>
      <div
        style={{
          width: 400,
          height: ROW_H,
          borderRadius: 22,
          border: `3px dashed ${colors.creamDim}`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 30,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 40,
          color: colors.cream,
          boxSizing: 'border-box',
        }}
      >
        {T.protection}
      </div>
      <div style={{fontFamily: fonts.body, fontSize: 34, color: colors.creamDim, fontStyle: 'italic', width: 300}}>
        <span style={{display: 'inline-block', width: 12, height: 12, borderRadius: 6, background: colors.red, marginRight: 12, verticalAlign: 'middle'}} />
        {T.waiting}
        {'.'.repeat(Math.max(0, dots))}
      </div>
    </div>
  );
};

const Stat: React.FC<{f: number}> = ({f}) => {
  const s = B.statStart + 0.5;
  const count = interpolate(f, [sec(s + 0.4), sec(s + 1.9)], [0, T.statValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const zoom = interpolate(f, [sec(s), sec(s) + sec(7)], [0.92, 1.0], {extrapolateRight: 'clamp'});
  const line = prog(f, s + 1.6, 0.8);
  return (
    <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 50%'}}>
      <Headline top={560} size={46} color={colors.creamDim} style={{fontFamily: fonts.body, fontWeight: 600, letterSpacing: 0, ...rise(f, s + 0.2)}}>
        {T.statLabel}
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 630,
          left: 0,
          width: 1080,
          textAlign: 'center',
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 240,
          letterSpacing: -6,
          color: colors.cream,
          fontVariantNumeric: 'tabular-nums',
          opacity: vis(f, s + 0.3),
        }}
      >
        {count.toFixed(2)}
        <span style={{color: colors.gold}}>%</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 935,
          left: 540 - 300 * line,
          width: 600 * line,
          height: 4,
          borderRadius: 2,
          background: colors.gold,
        }}
      />
      <div style={{position: 'absolute', top: 975, width: 1080, textAlign: 'center', ...rise(f, s + 1.8)}}>
        <Chip style={{fontSize: 34, letterSpacing: 4}}>Malaysia | {T.statYear}</Chip>
      </div>
      <Note top={1100} style={{...rise(f, s + 2.6), fontSize: 27}}>
        {T.statNote}
      </Note>
      <Note top={1230} style={{...rise(f, s + 3.0), fontSize: 24, color: 'rgba(245,238,223,0.6)'}}>
        {source.label}
      </Note>
    </div>
  );
};

export const Ch1Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shell chapter={C}>
      <Notification f={f} />
      <Headline top={360} size={86} style={rise(f, B.question, B.statStart)}>
        {T.question}
      </Headline>
      <Blocks f={f} />
      {f >= sec(B.statStart) && <Stat f={f} />}
    </Shell>
  );
};
