import React from 'react';
import {colors} from '../config';

type P = {size?: number; color?: string; accent?: string; style?: React.CSSProperties};

const Svg: React.FC<P & {children: React.ReactNode}> = ({size = 120, style, children}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    {children}
  </svg>
);

const stroke = (c: string) => ({
  stroke: c,
  strokeWidth: 5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconBag: React.FC<P> = ({color = colors.cream, accent = colors.gold, ...p}) => (
  <Svg {...p}>
    <path d="M22 36h56l-5 48H27z" fill={accent} fillOpacity={0.18} {...stroke(color)} />
    <path d="M37 42V30a13 13 0 0 1 26 0v12" {...stroke(color)} />
  </Svg>
);

export const IconCoffee: React.FC<P> = ({color = colors.cream, accent = colors.gold, ...p}) => (
  <Svg {...p}>
    <path d="M20 42h48v14a24 24 0 0 1-48 0z" fill={accent} fillOpacity={0.18} {...stroke(color)} />
    <path d="M68 47h5a9 9 0 0 1 0 18h-6" {...stroke(color)} />
    <path d="M34 18c-3 5 3 8 0 13M46 16c-3 5 3 8 0 13" {...stroke(accent)} />
    <path d="M18 88h54" {...stroke(color)} />
  </Svg>
);

export const IconPlane: React.FC<P> = ({color = colors.cream, accent = colors.gold, ...p}) => (
  <Svg {...p}>
    <path
      d="M47 52 18 40l6-6 34 4 15-15c4-4 10-4 10 0 0 4-1 6-4 9L64 47l4 34-6 6-12-29-12 11 1 10-5 5-5-13-13-5 5-5 10 1z"
      fill={accent}
      fillOpacity={0.18}
      {...stroke(color)}
    />
  </Svg>
);

export const IconShield: React.FC<P> = ({color = colors.gold, accent = colors.cream, ...p}) => (
  <Svg {...p}>
    <path d="M50 10 82 22v24c0 22-14 36-32 44C32 82 18 68 18 46V22z" fill={color} fillOpacity={0.2} {...stroke(color)} />
    <path d="m36 50 10 10 19-21" {...stroke(accent)} />
  </Svg>
);

export const IconCalendar: React.FC<P> = ({color = colors.cream, accent = colors.red, ...p}) => (
  <Svg {...p}>
    <rect x="14" y="20" width="72" height="66" rx="9" fill={colors.navySoft} {...stroke(color)} />
    <path d="M14 38h72" {...stroke(color)} />
    <path d="M32 12v16M68 12v16" {...stroke(accent)} />
  </Svg>
);

export const IconMedical: React.FC<P> = ({color = colors.cream, accent = colors.gold, ...p}) => (
  <Svg {...p}>
    <rect x="10" y="24" width="80" height="54" rx="9" fill={accent} fillOpacity={0.16} {...stroke(color)} />
    <path d="M34 39v22M23 50h22" {...stroke(accent)} />
    <path d="M58 43h20M58 57h14" {...stroke(color)} />
  </Svg>
);

export const IconHibah: React.FC<P> = ({color = colors.cream, accent = colors.gold, ...p}) => (
  <Svg {...p}>
    {/* heart held above an open hand */}
    <path
      d="M50 50c-10-7-17-12-17-20a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 8-7 13-17 20z"
      fill={accent}
      fillOpacity={0.3}
      {...stroke(accent)}
    />
    <path d="M12 66h16l14 6h14a5 5 0 0 1 0 10H40" {...stroke(color)} />
    <path d="M56 78l20-10a5 5 0 0 1 6 8L60 90H30l-18-6" {...stroke(color)} />
  </Svg>
);

export const IconCritical: React.FC<P> = ({color = colors.cream, accent = colors.gold, ...p}) => (
  <Svg {...p}>
    {/* banknote with a check — a lump-sum cash benefit */}
    <rect x="8" y="26" width="84" height="50" rx="8" fill={accent} fillOpacity={0.16} {...stroke(color)} />
    <circle cx="50" cy="51" r="13" {...stroke(accent)} />
    <path d="m44 51 4 4 8-9" {...stroke(accent)} />
    <path d="M20 40v0M80 62v0" {...stroke(color)} strokeWidth={8} />
  </Svg>
);

export const IconCheck: React.FC<P & {done: number}> = ({size = 64, done, color = colors.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect
      x="4"
      y="4"
      width="56"
      height="56"
      rx="14"
      fill={done > 0.01 ? color : 'transparent'}
      fillOpacity={done}
      stroke={color}
      strokeWidth="4"
    />
    <path
      d="m18 33 10 10 18-21"
      fill="none"
      stroke={colors.navy}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - done}
    />
  </svg>
);

/** Warm, simple family: two adults and a child under a home arc. */
export const Family: React.FC<{width?: number; t?: number}> = ({width = 620, t = 1}) => {
  const bob = (i: number) => Math.sin(t * 2 + i) * 2;
  return (
    <svg width={width} height={width * 0.78} viewBox="0 0 400 312" fill="none">
      <path
        d="M40 150 200 40l160 110"
        stroke={colors.gold}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="200" cy="292" rx="170" ry="14" fill={colors.goldSoft} />
      {/* adult left */}
      <g transform={`translate(0 ${bob(0)})`}>
        <circle cx="122" cy="132" r="28" fill={colors.cream} />
        <path d="M78 290v-70a44 44 0 0 1 88 0v70z" fill={colors.gold} />
      </g>
      {/* adult right (tudung) */}
      <g transform={`translate(0 ${bob(1.5)})`}>
        <path d="M250 104a32 32 0 0 1 64 0v40h-64z" fill={colors.red} fillOpacity={0.85} />
        <circle cx="282" cy="130" r="22" fill={colors.cream} />
        <path d="M238 290v-74a44 44 0 0 1 88 0v74z" fill={colors.red} fillOpacity={0.85} />
      </g>
      {/* child */}
      <g transform={`translate(0 ${bob(3)})`}>
        <circle cx="202" cy="196" r="20" fill={colors.cream} />
        <path d="M172 290v-40a30 30 0 0 1 60 0v40z" fill={colors.cream} fillOpacity={0.85} />
      </g>
      {/* small heart */}
      <path
        d="M202 92c-6-4-10-7-10-12a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 5-4 8-10 12z"
        fill={colors.red}
        opacity={0.6 + Math.sin(t * 3) * 0.3}
      />
    </svg>
  );
};
