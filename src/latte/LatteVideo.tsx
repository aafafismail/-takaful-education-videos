import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Atmosphere} from '../components/SceneStack';
import {audio, americanoTags, beats as B, captions, cupImage, latteText as T, latteVideo, maths, prices, rm, shots, steam} from './config';

/* ---------------- look ---------------- */
const C = {
  cream: '#FFF4E2',
  yellow: '#FFD54A',
  espresso: 'rgba(28, 16, 8, 0.62)',
  espressoStrong: 'rgba(24, 13, 6, 0.78)',
  line: 'rgba(255, 214, 150, 0.45)',
  red: '#E8735E',
};
const F = {body: 'Poppins, Arial, sans-serif', title: 'Anton, Impact, sans-serif'};
const SAFE = {left: 120, right: 960, top: 260};
const W = SAFE.right - SAFE.left;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const s2f = (s: number) => Math.round(s * latteVideo.fps);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const p = (f: number, start: number, dur = 0.5) => interpolate(f, [s2f(start), s2f(start + dur)], [0, 1], {...clamp, easing: ease});
const vis = (f: number, a: number, b?: number, d = 0.4) => p(f, a, d) * (b === undefined ? 1 : 1 - p(f, b, d));
const pop = (f: number, start: number) => spring({frame: f - s2f(start), fps: latteVideo.fps, config: {damping: 13, stiffness: 190, mass: 0.7}});
const popStyle = (f: number, start: number, end?: number): React.CSSProperties => {
  const k = pop(f, start);
  return {opacity: Math.min(1, k * 2) * (end === undefined ? 1 : 1 - p(f, end, 0.35)), transform: `scale(${0.88 + 0.12 * k}) translateY(${(1 - k) * 20}px)`};
};

/* ---------------- shots ---------------- */
const Shots: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#0B0704', overflow: 'hidden'}}>
      {shots.map((sh, i) => {
        const next = shots[i + 1];
        const a = s2f(sh.start);
        const tin = sh.tin === 'cut' ? 1 : sh.tin === 'flash' ? 9 : 16;
        const b = next ? s2f(next.start) + (next.tin === 'cut' ? 0 : next.tin === 'flash' ? 9 : 16) : durationInFrames;
        if (f < a - 1 || f > b) return null;
        const o = i === 0 ? 1 : interpolate(f, [a, a + tin], [0, 1], clamp);
        const life = ease(interpolate(f, [a, next ? s2f(next.start) : durationInFrames], [0, 1], clamp));
        const z = sh.from[0] + (sh.to[0] - sh.from[0]) * life;
        const x = sh.from[1] + (sh.to[1] - sh.from[1]) * life;
        const y = sh.from[2] + (sh.to[2] - sh.from[2]) * life;
        return (
          <AbsoluteFill key={i} style={{opacity: o}}>
            <Img
              src={staticFile(`latte/${sh.file}.jpg`)}
              style={{width: '100%', height: '100%', objectFit: 'cover', transformOrigin: `${x}% ${y}%`, transform: `scale(${z})`, filter: sh.blur ? `blur(${sh.blur}px)` : undefined}}
            />
            {sh.dim ? <AbsoluteFill style={{background: `rgba(12,6,2,${sh.dim})`}} /> : null}
          </AbsoluteFill>
        );
      })}
      {/* warm flash for 'flash' transitions */}
      {shots.map((sh, i) => {
        if (sh.tin !== 'flash') return null;
        const a = s2f(sh.start);
        const o = interpolate(f, [a - 3, a + 2, a + 10], [0, 0.75, 0], clamp);
        return o > 0 ? <AbsoluteFill key={`fl${i}`} style={{background: '#FFE9C2', opacity: o}} /> : null;
      })}
    </AbsoluteFill>
  );
};

/** Soft rising steam wisps (code-drawn, so they never touch the illustration itself). */
const Steam: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {steam.map(([a, b, x, y], i) => {
        const o = vis(f, a + 0.2, b - 0.3, 0.6);
        if (o <= 0) return null;
        return (
          <svg key={i} width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o * 0.55}}>
            <defs>
              <filter id={`steam${i}`}>
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>
            {[0, 1, 2].map((k) => {
              const t = ((f + k * 20) % 60) / 60;
              const sway = Math.sin(f / 14 + k * 2) * 18;
              return (
                <path
                  key={k}
                  d={`M${x - 30 + k * 30} ${y} q${-20 + sway} -60 0 -120 q${20 + sway} -60 0 -120`}
                  stroke="#FFF6EA"
                  strokeWidth={14}
                  strokeLinecap="round"
                  fill="none"
                  filter={`url(#steam${i})`}
                  opacity={Math.sin(t * Math.PI)}
                  transform={`translate(0 ${-t * 90})`}
                />
              );
            })}
          </svg>
        );
      })}
    </>
  );
};

/* ---------------- text pieces ---------------- */
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; strong?: boolean}> = ({children, style, strong}) => (
  <div
    style={{
      background: strong ? C.espressoStrong : C.espresso,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `2px solid ${C.line}`,
      borderRadius: 30,
      boxShadow: '0 18px 44px rgba(0,0,0,0.4)',
      color: C.cream,
      fontFamily: F.body,
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{children: React.ReactNode; tone?: 'yellow' | 'dark'; style?: React.CSSProperties}> = ({children, tone = 'dark', style}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: F.body,
      fontWeight: 800,
      fontSize: 34,
      padding: '10px 24px',
      borderRadius: 999,
      color: tone === 'yellow' ? '#1E1205' : C.cream,
      background: tone === 'yellow' ? C.yellow : C.espressoStrong,
      border: tone === 'yellow' ? 'none' : `2px solid ${C.line}`,
      boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {children}
  </span>
);

const parse = (text: string) =>
  text.split(/(\*[^*]+\*)/).filter(Boolean).map((part) => ({t: part.replace(/\*/g, ''), hi: part.startsWith('*')}));

/** Short subtitles: white, yellow keywords, on a subtle dark backing, clear of platform UI. */
const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const cue = captions.find((c) => f >= s2f(c.start) && f < s2f(c.end));
  if (!cue) return null;
  const a = s2f(cue.start);
  const b = s2f(cue.end);
  const o = interpolate(f, [a, a + 5, b - 5, b], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', top: 1395, left: SAFE.left, width: W, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - Math.min(1, (f - a) / 6)) * 10}px)`}}>
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1.28,
          textAlign: 'center',
          color: '#FFFFFF',
          background: 'rgba(10,6,2,0.5)',
          borderRadius: 22,
          padding: '12px 26px',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        {parse(cue.text).map((w, i) => (
          <span key={i} style={{color: w.hi ? C.yellow : '#FFFFFF'}}>
            {w.t.split('\u{1F602}').map((chunk, j) =>
              j === 0 ? (
                chunk
              ) : (
                <React.Fragment key={j}>
                  {/* Twemoji (CC-BY 4.0) — colour emoji fonts don't render in headless Chrome */}
                  <Img src={staticFile('latte/emoji-1f602.svg')} style={{height: '1.05em', verticalAlign: '-0.18em'}} />
                  {chunk}
                </React.Fragment>
              ),
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------------- scene overlays ---------------- */
const Hook: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', top: 1240, left: SAFE.left, width: W, textAlign: 'center', ...popStyle(f, B.hookIn, 3.9)}}>
    <div style={{fontFamily: F.title, fontSize: 80, lineHeight: 1.06, textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 4px 0 rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.55)'}}>
      Kena stop <span style={{color: C.yellow}}>latte</span> ke kalau nak mula <span style={{color: C.yellow}}>takaful?</span>
    </div>
  </div>
);

const Budget: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', top: 1000, left: SAFE.left, width: W, ...popStyle(f, B.perMonth - 0.2, B.s3 - 0.4)}}>
    <Card style={{padding: '20px 30px 22px', textAlign: 'center'}}>
      <div style={{fontSize: 24, fontWeight: 600, opacity: 0.85}}>{T.contributionLabel}</div>
      <div style={{fontFamily: F.title, fontSize: 88, lineHeight: 1.05}}>
        {T.perMonth} <span style={{fontSize: 64, opacity: vis(f, B.divide)}}>{T.divide}</span>
      </div>
      <div style={{fontFamily: F.title, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...popStyle(f, B.perDay)}}>{T.perDay}</div>
      <div style={{marginTop: 8, fontSize: 19, lineHeight: 1.35, opacity: 0.85 * vis(f, B.qualification)}}>{T.qualification}</div>
    </Card>
  </div>
);

const Cup: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, overflow: 'hidden', border: `3px solid ${C.line}`, boxShadow: '0 8px 20px rgba(0,0,0,0.4)'}}>
    <Img src={staticFile(cupImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </div>
);

const SmallChange: React.FC<{f: number}> = ({f}) => {
  const counted = Math.max(0, Math.min(prices.cupsToCut, Math.floor((f - s2f(B.cups)) / s2f(B.cupStagger)) + 1));
  const highlightDays = [3, 7, 10, 14, 17, 21, 24, 28].slice(0, prices.cupsToCut);
  return (
    <>
      {/* price tag at the counter */}
      <div style={{position: 'absolute', top: 430, left: SAFE.left, width: W, textAlign: 'right', ...popStyle(f, B.lattePrice, B.cups - 0.3)}}>
        <Tag tone="yellow" style={{fontSize: 44, padding: '16px 34px'}}>
          {T.lattePrice}
        </Tag>
      </div>
      {/* counting cups */}
      <div style={{position: 'absolute', top: 340, left: SAFE.left, width: W, opacity: vis(f, B.cups - 0.1, B.calendar - 0.2)}}>
        <Card strong style={{padding: '30px 30px 26px', textAlign: 'center'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, justifyItems: 'center'}}>
            {Array.from({length: prices.cupsToCut}).map((_, i) => {
              const k = pop(f, B.cups + i * B.cupStagger);
              return (
                <div key={i} style={{position: 'relative', opacity: Math.min(1, k * 2), transform: `scale(${0.6 + 0.4 * k})`}}>
                  <Cup size={150} />
                  <div style={{position: 'absolute', right: -6, top: -6, width: 48, height: 48, borderRadius: 24, background: C.yellow, color: '#1E1205', fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 24, fontFamily: F.title, fontSize: 64, color: C.cream, fontVariantNumeric: 'tabular-nums'}}>
            {counted > 0 ? `${counted} × ${rm(prices.latte)} = ${rm(counted * prices.latte)}` : ' '}
          </div>
          <div style={{fontFamily: F.title, fontSize: 92, color: C.yellow, lineHeight: 1.05, ...popStyle(f, B.cupsEquation)}}>{T.cupsEquation}</div>
        </Card>
      </div>
      {/* calendar with eight days highlighted */}
      <div style={{position: 'absolute', top: 330, left: SAFE.left, width: W, ...popStyle(f, B.calendar, B.s4 - 0.3)}}>
        <Card strong style={{padding: '26px 30px 30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <div style={{fontSize: 30, fontWeight: 800}}>{T.calendarMonth}</div>
            <Tag tone="yellow" style={{fontSize: 26, padding: '6px 18px'}}>
              {prices.cupsToCut} hari
            </Tag>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10}}>
            {Array.from({length: 30}).map((_, i) => {
              const day = i + 1;
              const idx = highlightDays.indexOf(day);
              const on = idx >= 0 ? p(f, B.calendar + 0.4 + idx * 0.18, 0.25) : 0;
              return (
                <div
                  key={day}
                  style={{
                    height: 78,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 700,
                    background: on ? `rgba(255,213,74,${on})` : 'rgba(255,255,255,0.07)',
                    color: on > 0.5 ? '#1E1205' : C.cream,
                    transform: `scale(${1 + 0.08 * Math.sin(on * Math.PI)})`,
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 22, textAlign: 'center', fontFamily: F.title, fontSize: 58, lineHeight: 1.12, textTransform: 'uppercase', ...popStyle(f, B.calendar + 2.0)}}>
            {T.notAll} <span style={{color: C.yellow}}>{T.cutEight}</span>
          </div>
        </Card>
      </div>
    </>
  );
};

const HomeCoffee: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', top: 1010, left: SAFE.left, width: W, ...popStyle(f, B.homeCost, B.s5 - 0.4)}}>
    <Card style={{padding: '18px 28px 22px', textAlign: 'center'}}>
      <Tag style={{fontSize: 22, padding: '4px 16px'}}>{T.illustrative}</Tag>
      <div style={{marginTop: 6, fontFamily: F.title, fontSize: 70, lineHeight: 1.08}}>{T.homeCost}</div>
      <div style={{fontSize: 30, fontWeight: 700, marginTop: 4, ...popStyle(f, B.perSwitch)}}>{T.perSwitch}</div>
      <div style={{fontFamily: F.title, fontSize: 72, lineHeight: 1.1, color: C.yellow, marginTop: 4, ...popStyle(f, B.switchTotal)}}>{T.switchTotal}</div>
    </Card>
  </div>
);

const Americano: React.FC<{f: number}> = ({f}) => {
  const tag = (pos: {x: number; y: number}, text: string, delay: number) => (
    <div style={{position: 'absolute', left: pos.x - 220, top: pos.y, width: 440, textAlign: 'center', ...popStyle(f, B.tags + delay, B.s6 - 0.4)}}>
      <Tag>{text}</Tag>
    </div>
  );
  return (
    <>
      {tag(americanoTags.latte, T.latteTag, 0)}
      {tag(americanoTags.americano, T.americanoTag, 0.4)}
      <div style={{position: 'absolute', top: 1220, left: SAFE.left, width: W, textAlign: 'center', ...popStyle(f, B.gap, B.s6 - 0.4)}}>
        <Tag tone="yellow" style={{fontSize: 52, padding: '14px 36px'}}>
          {T.gapTag}
        </Tag>
      </div>
    </>
  );
};

const MakingRoom: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', top: 850, left: SAFE.left, width: W, ...popStyle(f, B.s6 + 0.3, B.family - 0.3)}}>
    <Card strong style={{padding: '26px 34px'}}>
      <div style={{fontSize: 30, fontWeight: 800, marginBottom: 8}}>{T.budgetTitle}</div>
      {T.budgetLines.map((l) => (
        <div key={l} style={{display: 'flex', alignItems: 'center', gap: 16, height: 62, fontSize: 32, fontWeight: 600, opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.12)'}}>
          <span style={{width: 18, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.4)'}} />
          {l}
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 84,
          marginTop: 8,
          padding: '0 20px',
          borderRadius: 20,
          fontSize: 38,
          fontWeight: 800,
          color: '#1E1205',
          background: C.yellow,
          ...popStyle(f, B.protectionLine),
        }}
      >
        ✓ {T.protectionLine}
      </div>
    </Card>
  </div>
);

const EndCard: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{position: 'absolute', top: 1000, left: SAFE.left, width: W, textAlign: 'center', fontFamily: F.title, textTransform: 'uppercase', textShadow: '0 4px 0 rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.55)'}}>
      <div style={{fontSize: 84, lineHeight: 1.05, color: '#FFFFFF', ...popStyle(f, B.end1)}}>{T.end1}</div>
      <div style={{fontSize: 66, lineHeight: 1.08, color: C.yellow, marginTop: 10, ...popStyle(f, B.end2)}}>{T.end2}</div>
    </div>
    <div style={{position: 'absolute', top: 1300, left: SAFE.left, width: W, textAlign: 'center', ...popStyle(f, B.cta)}}>
      <Tag tone="yellow" style={{fontSize: 46, padding: '16px 40px'}}>
        {T.cta}
      </Tag>
      <div style={{marginTop: 22, fontFamily: F.body, fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.75)'}}>{T.name}</div>
    </div>
  </>
);

/* ---------------- full composition ---------------- */
export const LatteVideo: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: fadeIn}}>
        <Shots />
        <Steam />
        <Atmosphere />
        {f < s2f(B.s2) && <Hook f={f} />}
        {f >= s2f(B.s2) - 5 && f < s2f(B.s3) && <Budget f={f} />}
        {f >= s2f(B.s3) - 5 && f < s2f(B.s4) && <SmallChange f={f} />}
        {f >= s2f(B.s4) - 5 && f < s2f(B.s5) && <HomeCoffee f={f} />}
        {f >= s2f(B.s5) - 5 && f < s2f(B.s6) && <Americano f={f} />}
        {f >= s2f(B.s6) - 5 && <MakingRoom f={f} />}
        {f >= s2f(B.end1) - 5 && <EndCard f={f} />}
        <Subtitles />
      </AbsoluteFill>
      {audio.voiceover ? <Audio src={staticFile(audio.voiceover)} /> : null}
      {audio.music ? <Audio src={staticFile(audio.music)} volume={audio.musicVolume} /> : null}
    </AbsoluteFill>
  );
};

