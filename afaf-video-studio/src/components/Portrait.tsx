import React from 'react';
import {Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../brand';
import type {Media} from '../types';
import {progress} from './anim';

// Shows the user-supplied photo/video as-is (no filters, no face edits). Only a gentle zoom.
export const Portrait: React.FC<{portrait: NonNullable<Media['portrait']>; w: number; h: number; still?: boolean}> = ({portrait, w, h, still = false}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = still ? 1 : progress(frame, 0, Math.round(0.9 * fps));
  const zoom = still ? 1 : interpolate(frame, [0, Math.max(1, durationInFrames)], [1, 1.04]);
  const media: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: portrait.focus, scale: String(zoom)};
  return (
    <div style={{position: 'relative', width: w, height: h, flexShrink: 0, opacity: p, translate: `0px ${(1 - p) * 30}px`}}>
      <div style={{position: 'absolute', inset: 0, translate: '22px 22px', borderRadius: `${w / 2}px ${w / 2}px 28px 28px`, backgroundColor: colors.nude}} />
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: `${w / 2}px ${w / 2}px 28px 28px`, backgroundColor: colors.nude}}>
        {portrait.kind === 'image' ? (
          <Img src={staticFile(portrait.src)} style={media} />
        ) : (
          <OffthreadVideo src={staticFile(portrait.src)} muted style={media} />
        )}
      </div>
    </div>
  );
};
