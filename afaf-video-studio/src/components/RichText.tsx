import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../brand';
import {progress} from './anim';

/** Splits "plain *highlight* plain" into parts. */
export const parseEmphasis = (text: string) =>
  text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) =>
    part.startsWith('*') && part.endsWith('*')
      ? {text: part.slice(1, -1), em: true}
      : {text: part, em: false},
  );

const Marker: React.FC<{children: string; start: number; dark: boolean}> = ({children, start, dark}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, start + Math.round(0.35 * fps), Math.round(0.7 * fps));
  return (
    <span
      style={{
        fontStyle: 'italic',
        color: dark ? colors.yellow : colors.navy,
        // Light scenes: soft yellow marker. Dark scenes: thin yellow underline.
        backgroundImage: `linear-gradient(${colors.yellow}, ${colors.yellow})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: dark ? '0 96%' : '0 88%',
        backgroundSize: `${p * 100}% ${dark ? '5%' : '34%'}`,
        padding: '0 0.06em',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {children}
    </span>
  );
};

export const RichText: React.FC<{text: string; start: number; dark?: boolean}> = ({text, start, dark = false}) => (
  <>
    {parseEmphasis(text).map((p, i) =>
      p.em ? (
        <Marker key={i} start={start} dark={dark}>
          {p.text}
        </Marker>
      ) : (
        <span key={i}>{p.text}</span>
      ),
    )}
  </>
);

export const serifStyle = (size: number, dark: boolean): React.CSSProperties => ({
  fontFamily: fonts.serif,
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.14,
  letterSpacing: '-0.01em',
  color: dark ? colors.white : colors.ink,
  textWrap: 'balance',
});
