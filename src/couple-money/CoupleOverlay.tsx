import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Overlay} from './config';

// Smooth, symmetric ease: starts and ends gently, no sudden motion.
const ease = Easing.bezier(0.42, 0, 0.58, 1);

export const CoupleOverlay: React.FC<{overlay: Overlay}> = ({overlay}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  const m = overlay.move;
  let transform: string;
  let origin: string;
  if (m.kind === 'push') {
    const s = m.from + (m.to - m.from) * t;
    transform = `scale(${s})`;
    origin = `${m.focusX * 100}% ${m.focusY * 100}%`;
  } else {
    const x = m.fromX + (m.toX - m.fromX) * t;
    transform = `translateX(${x}px) scale(${m.scale})`;
    origin = `50% ${m.focusY * 100}%`;
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <Img
        src={staticFile(overlay.image)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover', // source is 941x1672, same 9:16 ratio: fills the frame, no bars
          transform,
          transformOrigin: origin,
          willChange: 'transform',
        }}
      />
    </AbsoluteFill>
  );
};
