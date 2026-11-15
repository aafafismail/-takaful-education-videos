import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, safe} from '../brand';
import type {CaptionCue} from '../types';

// Sentence-level captions for real voiceovers. Placed just above the bottom safe margin.
export const BurnedCaptions: React.FC<{cues: CaptionCue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cue = cues.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cue) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: safe.left,
        width: width - safe.left - safe.right,
        bottom: safe.bottom,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          backgroundColor: 'rgba(30,42,71,0.88)',
          color: colors.white,
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.3,
          padding: '16px 26px',
          borderRadius: 18,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

export const CAPTION_RESERVE = 220; // extra bottom space scenes leave free when captions are burned in
