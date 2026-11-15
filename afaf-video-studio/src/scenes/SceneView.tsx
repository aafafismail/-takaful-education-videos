import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../brand';
import {progress} from '../components/anim';
import {Portrait} from '../components/Portrait';
import {RevealLine} from '../components/RevealLine';
import type {Media, Scene} from '../types';
import {SceneFrame} from './SceneFrame';

type Props = {scene: Scene; index: number; total: number; label: string; signoff: string; media: Media; captionsOn: boolean};

const Rule: React.FC<{at: number; dark?: boolean}> = ({at, dark}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, Math.round(at * fps), Math.round(0.8 * fps));
  return <div style={{width: 160 * p, height: 3, backgroundColor: dark ? colors.yellow : colors.navy, borderRadius: 2}} />;
};

const Figure: React.FC<{value: string; unit: string}> = ({value, unit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, Math.round(0.15 * fps), Math.round(0.9 * fps));
  return (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: p, translate: `0px ${(1 - p) * 30}px`}}>
      <span style={{fontFamily: fonts.serif, fontWeight: 600, fontSize: 250, lineHeight: 0.9, color: colors.navy}}>{value}</span>
      <span style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 56, color: colors.navySoft, letterSpacing: '0.02em'}}>{unit}</span>
    </div>
  );
};

const CheckItem: React.FC<{text: string; at: number}> = ({text, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(at * fps);
  const p = progress(frame, start, Math.round(0.6 * fps));
  const tick = progress(frame, start + Math.round(0.25 * fps), Math.round(0.5 * fps));
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: p, translate: `${(1 - p) * 24}px 0px`}}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26" fill={colors.yellow} />
        <path d="M17 29 L25 37 L40 20" fill="none" stroke={colors.navy} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset={40 * (1 - tick)} />
      </svg>
      <span style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 46, color: colors.ink}}>{text}</span>
    </div>
  );
};

// Two outlined circles that drift together: a quiet picture of "seeing the same thing".
const Overlap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, 0, Math.round(1.6 * fps));
  const gap = interpolate(p, [0, 1], [150, 62]);
  const fill = progress(frame, Math.round(1.1 * fps), Math.round(0.8 * fps));
  return (
    <svg width="824" height="330" viewBox="0 0 824 330" style={{opacity: Math.min(1, p * 2)}}>
      <defs>
        <clipPath id="left-c">
          <circle cx={412 - gap} cy="165" r="140" />
        </clipPath>
      </defs>
      <circle cx={412 - gap} cy="165" r="140" fill={colors.nude} opacity="0.55" />
      <circle cx={412 + gap} cy="165" r="140" fill={colors.nude} opacity="0.55" />
      <circle cx={412 + gap} cy="165" r="140" fill={colors.yellow} clipPath="url(#left-c)" opacity={fill} />
      <circle cx={412 - gap} cy="165" r="140" fill="none" stroke={colors.navy} strokeWidth="3" />
      <circle cx={412 + gap} cy="165" r="140" fill="none" stroke={colors.navy} strokeWidth="3" />
    </svg>
  );
};

const Signoff: React.FC<{name: string; at: number}> = ({name, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, Math.round(at * fps), Math.round(0.8 * fps));
  return (
    <div style={{marginTop: 16, opacity: p}}>
      <div style={{width: 120 * p, height: 2, backgroundColor: colors.yellow, marginBottom: 24}} />
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 50, color: colors.white}}>{name}</div>
    </div>
  );
};

export const SceneView: React.FC<Props> = ({scene, index, total, label, signoff, media, captionsOn}) => {
  const dark = scene.type === 'closing';
  const lastAt = Math.max(0, ...scene.lines.map((l) => l.at), ...(scene.items ?? []).map((i) => i.at));
  const portrait = scene.showPortrait && media.portrait ? media.portrait : null;
  // A portrait takes vertical space, so text steps down one size to stay inside the safe area.
  const step = {xl: 'lg', lg: 'md', md: 'sm', sm: 'sm'} as const;
  const lines = scene.lines.map((l, i) => (
    <RevealLine key={i} line={portrait ? {...l, size: step[l.size ?? 'lg']} : l} dark={dark} />
  ));

  let body: React.ReactNode;
  switch (scene.type) {
    case 'hook':
      body = (
        <>
          {portrait ? <Portrait portrait={portrait} w={captionsOn ? 300 : 360} h={captionsOn ? 360 : 440} /> : null}
          {lines}
        </>
      );
      break;
    case 'message':
      body = (
        <>
          {lines.slice(0, 1)}
          <Rule at={(scene.lines[0]?.at ?? 0) + 0.5} />
          {lines.slice(1)}
        </>
      );
      break;
    case 'tip':
      body = (
        <>
          {scene.figure ? <Figure value={scene.figure.value} unit={scene.figure.unit} /> : null}
          {lines}
          {scene.items?.length ? (
            <div
              style={{
                marginTop: 12,
                padding: '38px 40px',
                borderRadius: 32,
                backgroundColor: 'rgba(255,255,255,0.78)',
                boxShadow: '0 18px 50px rgba(30,42,71,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 30,
              }}
            >
              {scene.items.map((it, i) => (
                <CheckItem key={i} text={it.text} at={it.at} />
              ))}
            </div>
          ) : null}
        </>
      );
      break;
    case 'reinforce':
      body = (
        <>
          <Overlap />
          {lines}
        </>
      );
      break;
    case 'closing':
      body = (
        <>
          {portrait ? <Portrait portrait={portrait} w={captionsOn ? 240 : 300} h={captionsOn ? 280 : 350} /> : null}
          {lines}
          <Signoff name={signoff} at={lastAt + 0.6} />
        </>
      );
      break;
  }

  return (
    <SceneFrame index={index} total={total} label={label} kicker={scene.kicker} dark={dark} captionsOn={captionsOn} compact={!!portrait}>
      {body}
    </SceneFrame>
  );
};
