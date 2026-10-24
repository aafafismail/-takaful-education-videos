import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cam, Scene, colors} from '../config';
import {easeInOut, sec} from '../lib/anim';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Camera move over the scene's life: returns CSS transform. */
const camera = (cam: Cam, t: number) => {
  const e = easeInOut(Math.min(1, Math.max(0, t)));
  switch (cam) {
    case 'in':
      return `scale(${1.06 + 0.16 * e})`;
    case 'out':
      return `scale(${1.24 - 0.16 * e})`;
    case 'up':
      return `scale(1.18) translateY(${50 - 100 * e}px)`;
    case 'down':
      return `scale(1.18) translateY(${-50 + 100 * e}px)`;
    case 'left':
      return `scale(1.18) translateX(${45 - 90 * e}px)`;
    case 'right':
      return `scale(1.18) translateX(${-45 + 90 * e}px)`;
  }
};

/** Jagged "torn paper" circle as a CSS polygon. */
const tearPolygon = (r: number) => {
  const pts: string[] = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const jag = 1 + (i % 2 === 0 ? 0.07 : -0.06) + 0.05 * Math.sin(i * 2.7);
    pts.push(`${540 + Math.cos(a) * r * jag}px ${960 + Math.sin(a) * r * jag}px`);
  }
  return `polygon(${pts.join(',')})`;
};

const TDUR: Record<string, number> = {fade: 0.4, cross: 0.7, thread: 1.0, tear: 0.8, flash: 0.5};

export const SceneStack: React.FC<{scenes: readonly Scene[]}> = ({scenes}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#05080F', overflow: 'hidden'}}>
      {scenes.map((sc, i) => {
        const next = scenes[i + 1];
        const startF = sec(sc.start);
        const endF = next ? sec(next.start) + sec(TDUR[next.tin] / 2) + 2 : durationInFrames;
        const tIn = sec(TDUR[sc.tin]);
        const inStart = i === 0 ? 0 : startF - tIn / 2;
        if (f < inStart - 1 || f > endF) return null;
        const p = i === 0 ? 1 : interpolate(f, [inStart, inStart + tIn], [0, 1], {...clamp, easing: easeInOut});
        const life = interpolate(f, [inStart, next ? sec(next.start) + 15 : durationInFrames], [0, 1], clamp);

        let opacity = 1;
        let clipPath: string | undefined;
        if (sc.tin === 'cross' || sc.tin === 'fade' || sc.tin === 'flash') opacity = p;
        if (sc.tin === 'tear') clipPath = p >= 1 ? undefined : tearPolygon(p * 1250);
        if (sc.tin === 'thread') {
          const open = interpolate(p, [0.35, 1], [0, 50], clamp);
          clipPath = p >= 1 ? undefined : `inset(0 ${50 - open}% 0 ${50 - open}%)`;
        }
        return (
          <AbsoluteFill key={i} style={{opacity, clipPath, WebkitClipPath: clipPath}}>
            <Img
              src={staticFile(`scenes/${sc.file}.jpg`)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: camera(sc.cam, life),
                filter: sc.blur ? `blur(${sc.blur}px)` : undefined,
              }}
            />
            {sc.dim ? <AbsoluteFill style={{background: `rgba(6,12,26,${sc.dim})`}} /> : null}
          </AbsoluteFill>
        );
      })}
      <TransitionFx scenes={scenes} />
    </AbsoluteFill>
  );
};

/** Gold thread beams, torn-edge glow and flashes drawn above the images. */
const TransitionFx: React.FC<{scenes: readonly Scene[]}> = ({scenes}) => {
  const f = useCurrentFrame();
  return (
    <>
      {scenes.map((sc, i) => {
        if (i === 0) return null;
        const tIn = sec(TDUR[sc.tin]);
        const s0 = sec(sc.start) - tIn / 2;
        if (f < s0 - 1 || f > s0 + tIn + 6) return null;
        const p = interpolate(f, [s0, s0 + tIn], [0, 1], clamp);
        if (sc.tin === 'thread') {
          // beam rises from the bottom, then splits open the next scene
          const rise = interpolate(p, [0, 0.4], [0, 1], {...clamp, easing: easeInOut});
          const open = interpolate(p, [0.35, 1], [0, 540], clamp);
          const fade = interpolate(f, [s0 + tIn - 4, s0 + tIn + 6], [1, 0], clamp);
          const beam = (x: number) => (
            <div
              style={{
                position: 'absolute',
                left: x - 5,
                bottom: 0,
                width: 10,
                height: 1920 * rise,
                borderRadius: 6,
                background: `linear-gradient(0deg, #FFF3C4, ${colors.captionHighlight} 60%, rgba(255,213,74,0.2))`,
                boxShadow: `0 0 30px 10px rgba(255,200,90,0.75), 0 0 90px 30px rgba(255,170,60,0.45)`,
                opacity: fade,
              }}
            />
          );
          return (
            <React.Fragment key={i}>
              {beam(540 - open)}
              {open > 2 && beam(540 + open)}
            </React.Fragment>
          );
        }
        if (sc.tin === 'flash') {
          const o = interpolate(p, [0, 0.45, 1], [0, 0.85, 0], clamp);
          return <AbsoluteFill key={i} style={{background: '#FFF4DA', opacity: o}} />;
        }
        if (sc.tin === 'tear') {
          const o = interpolate(p, [0, 0.2, 0.9, 1], [0, 1, 1, 0], clamp);
          return (
            <AbsoluteFill
              key={i}
              style={{
                opacity: o,
                background: `radial-gradient(circle at 50% 50%, transparent ${p * 600}px, rgba(255,230,180,0.55) ${p * 640}px, transparent ${p * 700}px)`,
              }}
            />
          );
        }
        return null;
      })}
    </>
  );
};

/** Floating golden dust, vignette and film grain — keeps stills feeling alive. */
export const Atmosphere: React.FC = () => {
  const f = useCurrentFrame();
  const motes = Array.from({length: 26}, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const x = (r * 1080 + Math.sin(f / (40 + i) + i) * 30) % 1080;
    const y = 1920 - (((f * (0.6 + r * 1.2) + i * 173) % 2100) - 90);
    const size = 3 + (i % 5) * 1.6;
    const o = 0.25 + 0.45 * Math.abs(Math.sin(f / 25 + i));
    return {x, y, size, o};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {motes.map((m, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: m.x,
            top: m.y,
            width: m.size,
            height: m.size,
            borderRadius: '50%',
            background: '#FFE3A1',
            boxShadow: '0 0 12px 4px rgba(255,210,120,0.6)',
            opacity: m.o,
          }}
        />
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 30} />
        </filter>
        <rect width={1080} height={1920} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
