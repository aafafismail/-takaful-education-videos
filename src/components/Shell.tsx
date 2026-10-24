import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChapterConfig, colors, fonts, safe} from '../config';
import {Background} from './Background';
import {Captions} from './Captions';

/**
 * Wraps every chapter: background, chapter marker, gentle zoom,
 * in/out fades (so each chapter also works as a stand-alone Story),
 * and subtitles.
 */
export const Shell: React.FC<{
  chapter: ChapterConfig;
  children: React.ReactNode;
  holdEnd?: boolean;
}> = ({chapter, children, holdEnd}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = holdEnd
    ? 1
    : interpolate(f, [durationInFrames - 12, durationInFrames - 1], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const zoom = interpolate(f, [0, durationInFrames], [1, 1.02]);
  const enter = interpolate(f, [0, 14], [0.985, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
        <div
          style={{
            position: 'absolute',
            top: safe.top + 10,
            left: safe.left,
            width: safe.right - safe.left,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: colors.gold,
          }}
        >
          <span>{chapter.number} / 05</span>
          <span style={{flex: 1, height: 1, background: colors.goldSoft}} />
          <span style={{color: colors.creamDim}}>{chapter.name}</span>
        </div>
        <AbsoluteFill style={{transform: `scale(${zoom * enter})`, transformOrigin: '50% 45%'}}>
          {children}
        </AbsoluteFill>
        <Captions captions={chapter.captions} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
