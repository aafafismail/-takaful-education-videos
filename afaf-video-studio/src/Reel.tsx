import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {colors} from './brand';
import {BurnedCaptions} from './components/BurnedCaptions';
import {dipThrough} from './components/dipThrough';
import {SceneView} from './scenes/SceneView';
import type {SceneData} from './types';

export const reelDuration = (d: SceneData) =>
  d.scenes.reduce((sum, s) => sum + s.durationInFrames, 0) - d.transitionFrames * Math.max(0, d.scenes.length - 1);

const Music: React.FC<{src: string; volume: number}> = ({src, volume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <Audio
      src={staticFile(src)}
      volume={(f) =>
        interpolate(f, [0, 1.5 * fps, durationInFrames - 2 * fps, durationInFrames], [0, volume, volume, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};

export const Reel: React.FC<SceneData> = (data) => {
  const captionsOn = data.captions.burnIn && data.captions.cues.length > 0;
  return (
    <AbsoluteFill style={{backgroundColor: colors.paper}}>
      <TransitionSeries>
        {data.scenes.map((scene, i) => (
          <React.Fragment key={scene.id}>
            {i > 0 ? (
              <TransitionSeries.Transition presentation={dipThrough()} timing={linearTiming({durationInFrames: data.transitionFrames})} />
            ) : null}
            <TransitionSeries.Sequence name={`${String(i + 1).padStart(2, '0')} ${scene.type}`} durationInFrames={scene.durationInFrames}>
              <SceneView
                scene={scene}
                index={i}
                total={data.scenes.length}
                label={data.seriesLabel}
                signoff={data.signoff}
                media={data.media}
                captionsOn={captionsOn}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      {captionsOn ? <BurnedCaptions cues={data.captions.cues} /> : null}
      {data.media.voiceover ? <Audio src={staticFile(data.media.voiceover.src)} /> : null}
      {data.media.music ? <Music src={data.media.music.src} volume={data.media.music.volume} /> : null}
    </AbsoluteFill>
  );
};
