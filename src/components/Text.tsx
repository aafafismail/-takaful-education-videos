import React from 'react';
import {colors, fonts, safe} from '../config';

/** Big friendly headline in the upper zone of the safe area. */
export const Headline: React.FC<{
  children: React.ReactNode;
  top?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, top = 350, size = 76, color = colors.navy, style}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: safe.left,
      width: safe.right - safe.left,
      textAlign: 'center',
      fontFamily: fonts.display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: -1.5,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Highlighter-marker swipe behind words. `p` = 0..1 draw progress. */
export const Marker: React.FC<{children: React.ReactNode; p: number; color?: string}> = ({children, p, color = colors.gold}) => (
  <span
    style={{
      backgroundImage: `linear-gradient(${color}, ${color})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 88%',
      backgroundSize: `${p * 100}% 42%`,
      padding: '0 6px',
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone',
    }}
  >
    {children}
  </span>
);

/** Hand-written annotation. */
export const Hand: React.FC<{children: React.ReactNode; style?: React.CSSProperties; color?: string; size?: number; rotate?: number}> = ({
  children,
  style,
  color = colors.red,
  size = 54,
  rotate = -5,
}) => (
  <div style={{position: 'absolute', fontFamily: fonts.hand, fontWeight: 700, fontSize: size, color, lineHeight: 1, ...style}}>
    <div style={{transform: `rotate(${rotate}deg)`}}>{children}</div>
  </div>
);

export const Note: React.FC<{children: React.ReactNode; top: number; style?: React.CSSProperties}> = ({children, top, style}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: safe.left,
      width: safe.right - safe.left,
      textAlign: 'center',
      fontFamily: fonts.body,
      fontWeight: 500,
      fontSize: 25,
      lineHeight: 1.4,
      color: colors.muted,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Sticker label: rounded, outlined, slightly tilted. */
export const Sticker: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  rotate?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, bg = colors.white, color = colors.navy, rotate = 0, size = 30, style}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: size,
      color,
      background: bg,
      border: `4px solid ${colors.navy}`,
      borderRadius: 18,
      padding: '8px 22px',
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 6px 0 ${colors.navy}`,
      ...style,
    }}
  >
    {children}
  </span>
);
