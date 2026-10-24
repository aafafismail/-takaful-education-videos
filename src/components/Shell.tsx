import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChapterConfig, fonts, safe} from '../config';
import {Atmosphere, SceneStack} from './SceneStack';
import {Captions} from './Captions';

/**
 * Wraps every chapter: cinematic scene images with camera moves and
 * transitions, atmosphere, a small chapter tag, overlays and captions.
 * Fades in/out so each chapter also works as a stand-alone Story.
 */
export const Shell: React.FC<{chapter: ChapterConfig; children?: React.ReactNode; holdEnd?: boolean}> = ({chapter, children, holdEnd}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = holdEnd
    ? 1
    : interpolate(f, [durationInFrames - 10, durationInFrames - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
        <SceneStack scenes={chapter.scenes} />
        <Atmosphere />
        <div
          style={{
            position: 'absolute',
            top: safe.top,
            left: safe.left,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'rgba(255,246,230,0.85)',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          {chapter.number}/05 · {chapter.name}
        </div>
        {children}
        <Captions captions={chapter.captions} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
