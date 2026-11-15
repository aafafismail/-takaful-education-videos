import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors, fonts, gridCrop, safe} from './brand';
import {Background} from './components/Background';
import {Portrait} from './components/Portrait';
import {RichText, serifStyle} from './components/RichText';
import type {SceneData} from './types';

// Reel cover. All key content sits inside the 4:5 profile-grid crop.
export const Cover: React.FC<SceneData> = (data) => {
  const portrait = data.cover.noPortrait ? null : data.media.portrait;
  return (
    <AbsoluteFill>
      <Background variant={0} />
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          right: safe.left,
          top: gridCrop.top + 80,
          height: gridCrop.height - 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 44,
        }}
      >
        <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, letterSpacing: '0.24em', textTransform: 'uppercase', color: colors.navy}}>
          {data.cover.kicker}
        </div>
        {portrait ? <Portrait portrait={portrait} w={400} h={480} still /> : null}
        <div style={{...serifStyle(portrait ? 84 : 112, false)}}>
          <RichText text={data.cover.title} start={-100} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 90, height: 3, backgroundColor: colors.navy}} />
          <span style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 42, color: colors.navySoft}}>{data.signoff}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
