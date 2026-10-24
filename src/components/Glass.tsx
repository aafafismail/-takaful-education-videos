import React from 'react';
import {colors, fonts} from '../config';

/** Frosted dark-glass panel with a thin gold edge. */
export const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode; strong?: boolean}> = ({style, children, strong}) => (
  <div
    style={{
      background: strong ? 'rgba(8,16,34,0.74)' : colors.glass,
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: `2px solid ${colors.glassLine}`,
      borderRadius: 34,
      boxShadow: '0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
      color: colors.creamText,
      fontFamily: fonts.body,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small gold pill label. */
export const Pill: React.FC<{children: React.ReactNode; style?: React.CSSProperties; tone?: 'gold' | 'line' | 'red'}> = ({children, style, tone = 'gold'}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: 1,
      padding: '8px 22px',
      borderRadius: 999,
      color: tone === 'gold' ? '#1A1206' : tone === 'red' ? '#FFE9E4' : colors.creamText,
      background: tone === 'gold' ? colors.captionHighlight : tone === 'red' ? 'rgba(226,96,79,0.85)' : 'rgba(255,255,255,0.08)',
      border: tone === 'line' ? `2px solid ${colors.glassLine}` : 'none',
      ...style,
    }}
  >
    {children}
  </span>
);

/** Big condensed title in the caption typeface. */
export const BigTitle: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size = 96,
  color = '#FFFFFF',
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.caption,
      fontSize: size,
      lineHeight: 1.02,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color,
      textShadow: '0 4px 0 rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.5)',
      ...style,
    }}
  >
    {children}
  </div>
);
