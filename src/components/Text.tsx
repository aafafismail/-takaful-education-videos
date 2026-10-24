import React from 'react';
import {colors, fonts, safe} from '../config';

/** Headline block in the upper zone of the safe area. */
export const Headline: React.FC<{
  children: React.ReactNode;
  top?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  italic?: boolean;
}> = ({children, top = 360, size = 84, color = colors.cream, style, italic}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: safe.left,
      width: safe.right - safe.left,
      textAlign: 'center',
      fontFamily: fonts.display,
      fontWeight: 600,
      fontStyle: italic ? 'italic' : 'normal',
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: -1,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Note: React.FC<{children: React.ReactNode; top: number; style?: React.CSSProperties}> = ({
  children,
  top,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: safe.left,
      width: safe.right - safe.left,
      textAlign: 'center',
      fontFamily: fonts.body,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: 1.4,
      color: colors.creamDim,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({
  children,
  color = colors.gold,
  style,
}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: 24,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 999,
      padding: '8px 20px',
      ...style,
    }}
  >
    {children}
  </span>
);
