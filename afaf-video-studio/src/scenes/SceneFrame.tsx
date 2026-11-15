import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {safe} from '../brand';
import {Background} from '../components/Background';
import {CAPTION_RESERVE} from '../components/BurnedCaptions';
import {Header} from '../components/Header';

export const HEADER_BLOCK = 190; // height used by label, progress bar and kicker

export const SceneFrame: React.FC<{
  index: number;
  total: number;
  label: string;
  kicker: string;
  dark?: boolean;
  captionsOn: boolean;
  justify?: 'center' | 'flex-start';
  compact?: boolean;
  children: React.ReactNode;
}> = ({index, total, label, kicker, dark = false, captionsOn, justify = 'center', compact = false, children}) => {
  const {width, height} = useVideoConfig();
  const top = safe.top + HEADER_BLOCK;
  const bottom = safe.bottom + (captionsOn ? CAPTION_RESERVE : 0);
  return (
    <AbsoluteFill>
      <Background variant={index} dark={dark} />
      <Header index={index} total={total} label={label} kicker={kicker} dark={dark} />
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          top,
          width: width - safe.left - safe.right,
          height: height - top - bottom,
          display: 'flex',
          flexDirection: 'column',
          // 'safe' keeps tall content from spilling above the top of the box.
          justifyContent: justify === 'center' ? 'safe center' : justify,
          gap: compact ? 24 : 34,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
