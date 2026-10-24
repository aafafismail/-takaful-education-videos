import React from 'react';
import {useCurrentFrame} from 'remotion';
import {chapters, colors, fonts} from '../config';
import {Shell} from '../components/Shell';
import {Headline} from '../components/Text';
import {IconBag, IconCalendar, IconCoffee, IconPlane, IconShield} from '../components/Icons';
import {easeInOut, lerp, pop, prog, rise, sec, vis} from '../lib/anim';

const C = chapters[1];
const B = C.beats;
const T = C.text;

const ICONS = [IconBag, IconCoffee, IconPlane];
const PIVOT = {x: 540, y: 905};
const ARM = 320;
const CAL = {x: 815, y: 960};

const Label: React.FC<{x: number; y: number; children: React.ReactNode; opacity: number; color?: string}> = ({
  x,
  y,
  children,
  opacity,
  color = colors.creamDim,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 200,
      top: y,
      width: 400,
      textAlign: 'center',
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: 32,
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

export const Ch2Postpone: React.FC = () => {
  const f = useCurrentFrame();
  const tB = prog(f, B.future, 0.9, easeInOut);
  const tD = prog(f, B.balance, 1.0, easeInOut);
  const dimC = 1 - 0.7 * vis(f, B.healingOk, B.balance, 0.4);

  // Balance beam: tilts toward "today" first, then levels as the shield lands.
  const land = prog(f, B.balance + 1.4, 1.0, easeInOut);
  const theta = ((-11 + 11 * land) * Math.PI) / 180;
  const left = {x: PIVOT.x - ARM * Math.cos(theta), y: PIVOT.y - ARM * Math.sin(theta)};
  const right = {x: PIVOT.x + ARM * Math.cos(theta), y: PIVOT.y + ARM * Math.sin(theta)};
  const PAN_DROP = 120;

  const timelineOpacity = vis(f, B.future + 0.2) * (1 - tD) * dimC;
  const scaleOpacity = vis(f, B.balance + 0.2);

  return (
    <Shell chapter={C}>
      {/* Headlines, one idea at a time */}
      <Headline top={370} size={92} style={rise(f, B.icons + 0.2, B.future - 0.3)}>
        {T.now}
      </Headline>
      <Headline top={370} size={92} style={{...rise(f, B.future, B.healingOk - 0.2), opacity: vis(f, B.future, B.healingOk - 0.2) * dimC}}>
        {T.later}
      </Headline>
      <Headline top={380} size={112} color={colors.gold} style={rise(f, B.healingOk, B.balance)}>
        {T.healingOk}
      </Headline>
      <Headline top={370} size={86} style={rise(f, B.balance + 0.3)}>
        {T.makeRoom}
      </Headline>

      {/* Timeline: now → later */}
      <div style={{opacity: timelineOpacity}}>
        <div style={{position: 'absolute', top: 1110, left: 170, width: 740 * tB, height: 4, background: colors.navyLine, borderRadius: 2}} />
        <div
          style={{
            position: 'absolute',
            top: 1110,
            left: 170,
            width: 740 * tB,
            height: 4,
            backgroundImage: `linear-gradient(90deg, ${colors.gold} 0 40%, transparent 40%)`,
            backgroundSize: '28px 4px',
          }}
        />
        <div style={{position: 'absolute', top: 1096, left: 290, width: 30, height: 30, borderRadius: 15, background: colors.gold}} />
        <Label x={305} y={1148} opacity={1}>
          {T.nowLabel}
        </Label>
        <Label x={CAL.x} y={1148} opacity={1}>
          {T.laterLabel}
        </Label>
        <div style={{position: 'absolute', left: CAL.x - 85, top: CAL.y - 85, opacity: tB}}>
          <IconCalendar size={170} />
        </div>
      </div>

      {/* Balance scale */}
      <div style={{opacity: scaleOpacity}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d={`M${PIVOT.x} ${PIVOT.y} L${PIVOT.x - 70} ${PIVOT.y + 250} L${PIVOT.x + 70} ${PIVOT.y + 250} Z`} fill={colors.navySoft} stroke={colors.gold} strokeWidth={4} strokeLinejoin="round" />
          <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={colors.gold} strokeWidth={8} strokeLinecap="round" />
          <circle cx={PIVOT.x} cy={PIVOT.y} r={14} fill={colors.gold} />
          {[left, right].map((p, i) => (
            <g key={i}>
              <line x1={p.x} y1={p.y} x2={p.x - 95} y2={p.y + PAN_DROP} stroke={colors.creamDim} strokeWidth={3} />
              <line x1={p.x} y1={p.y} x2={p.x + 95} y2={p.y + PAN_DROP} stroke={colors.creamDim} strokeWidth={3} />
              <path d={`M${p.x - 120} ${p.y + PAN_DROP} Q${p.x} ${p.y + PAN_DROP + 50} ${p.x + 120} ${p.y + PAN_DROP}`} fill={colors.goldSoft} stroke={colors.gold} strokeWidth={4} />
            </g>
          ))}
        </svg>
        <Label x={left.x} y={left.y + PAN_DROP + 48} opacity={1} color={colors.cream}>
          {T.today}
        </Label>
        <Label x={right.x} y={right.y + PAN_DROP + 48} opacity={1} color={colors.cream}>
          {T.tomorrow}
        </Label>
      </div>

      {/* Lifestyle icons: big → timeline → left pan */}
      {ICONS.map((Icon, i) => {
        const A = {x: 270 + i * 270, y: 790, s: 150};
        const Bp = {x: 190 + i * 120, y: 985, s: 92};
        const D = {x: left.x + (i - 1) * 72, y: left.y + PAN_DROP - 40, s: 70};
        const x = lerp(lerp(A.x, Bp.x, tB), D.x, tD);
        const y = lerp(lerp(A.y, Bp.y, tB), D.y, tD);
        const s = lerp(lerp(A.s, Bp.s, tB), D.s, tD);
        const pp = pop(f, B.icons + 0.3 + i * 0.35);
        const pulseT = ((f + i * 15) % 45) / 45;
        const bgO = 1 - tD;
        return (
          <div key={i} style={{opacity: pp.opacity * dimC}}>
            <div
              style={{
                position: 'absolute',
                left: x - s * 0.75,
                top: y - s * 0.75,
                width: s * 1.5,
                height: s * 1.5,
                borderRadius: '50%',
                border: `3px solid ${i === 1 ? colors.red : colors.gold}`,
                opacity: (1 - pulseT) * 0.55 * bgO,
                transform: `scale(${1 + pulseT * 0.45})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x - s * 0.75,
                top: y - s * 0.75,
                width: s * 1.5,
                height: s * 1.5,
                borderRadius: '50%',
                background: colors.navySoft,
                opacity: bgO,
              }}
            />
            <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${pp.scale})`}}>
              <Icon size={s} />
            </div>
            <Label x={x} y={A.y + 125} opacity={1 - tB}>
              {T.icons[i]}
            </Label>
          </div>
        );
      })}

      {/* Shield: distant & faint → flies into the present (right pan) */}
      {(() => {
        const fly = prog(f, B.balance + 0.4, 1.1, easeInOut);
        const start = {x: CAL.x, y: CAL.y + 18, s: 78};
        const end = {x: right.x, y: right.y + PAN_DROP - 52, s: 104};
        const x = lerp(start.x, end.x, fly);
        const y = lerp(start.y, end.y, fly) - Math.sin(fly * Math.PI) * 140;
        const s = lerp(start.s, end.s, fly);
        const o = tB * lerp(0.45, 1, fly) * (fly > 0 ? 1 : dimC);
        const glow = fly > 0.95 ? 0.6 + Math.sin(f / 8) * 0.2 : 0;
        return (
          <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity: o, filter: `drop-shadow(0 0 ${24 * glow}px ${colors.gold})`}}>
            <IconShield size={s} />
          </div>
        );
      })()}
    </Shell>
  );
};
