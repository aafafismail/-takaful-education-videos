import React from 'react';
import {Composition, Still, delayRender, continueRender} from 'remotion';
import {Cover} from './Cover';
import {loadBrandFonts} from './fonts';
import {Reel, reelDuration} from './Reel';
import defaultData from './default-scene-data.json';
import type {SceneData} from './types';

const fontHandle = delayRender('Loading brand fonts');
loadBrandFonts().then(() => continueRender(fontHandle));

const defaults = defaultData as unknown as SceneData;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reel"
      component={Reel}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={reelDuration(defaults)}
      defaultProps={defaults}
      calculateMetadata={({props}) => ({
        durationInFrames: reelDuration(props),
        fps: props.fps,
        width: props.width,
        height: props.height,
      })}
    />
    <Still id="Cover" component={Cover} width={1080} height={1920} defaultProps={defaults} />
  </>
);
