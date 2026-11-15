import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {sizes} from '../brand';
import type {Line} from '../types';
import {progress} from './anim';
import {RichText, serifStyle} from './RichText';

export const RevealLine: React.FC<{line: Line; dark?: boolean; align?: 'left' | 'center'}> = ({line, dark = false, align = 'left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(line.at * fps);
  const p = progress(frame, start, Math.round(0.7 * fps));
  return (
    <div
      style={{
        ...serifStyle(sizes[line.size ?? 'lg'], dark),
        textAlign: align,
        opacity: p,
        translate: `0px ${(1 - p) * 28}px`,
      }}
    >
      <RichText text={line.text} start={start} dark={dark} />
    </div>
  );
};
