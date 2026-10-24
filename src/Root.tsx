import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile} from 'remotion';
import './fonts';
import {audio, chapters, chapterStartsSec, totalDurationSec, video} from './config';
import {sec} from './lib/anim';
import {Ch1Hook} from './chapters/Ch1Hook';
import {Ch2Postpone} from './chapters/Ch2Postpone';
import {Ch3Foundation} from './chapters/Ch3Foundation';
import {Ch4Practical} from './chapters/Ch4Practical';
import {Ch5NextStep} from './chapters/Ch5NextStep';

const SCENES = [Ch1Hook, Ch2Postpone, Ch3Foundation, Ch4Practical, Ch5NextStep];

type AudioProps = {music?: boolean};

const ChapterAudio: React.FC<{index: number}> = ({index}) => {
  const vo = audio.voiceover[index];
  return vo ? <Audio src={staticFile(vo)} volume={audio.voiceoverVolume} /> : null;
};

const Music: React.FC<{on?: boolean}> = ({on}) =>
  on ? <Audio src={staticFile(audio.musicFile)} volume={audio.musicVolume} /> : null;

export const Full: React.FC<AudioProps> = ({music}) => (
  <AbsoluteFill>
    {SCENES.map((Scene, i) => (
      <Sequence key={i} from={sec(chapterStartsSec[i])} durationInFrames={sec(chapters[i].durationSec)} name={chapters[i].id}>
        <Scene />
        <ChapterAudio index={i} />
      </Sequence>
    ))}
    <Music on={music} />
  </AbsoluteFill>
);

const single = (i: number): React.FC<AudioProps> => {
  const Scene = SCENES[i];
  const C: React.FC<AudioProps> = ({music}) => (
    <AbsoluteFill>
      <Scene />
      <ChapterAudio index={i} />
      {music ? (
        <Sequence from={-sec(chapterStartsSec[i])}>
          <Music on />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
  return C;
};

const common = {width: video.width, height: video.height, fps: video.fps};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HealingFull"
      component={Full}
      durationInFrames={sec(totalDurationSec)}
      defaultProps={{music: audio.musicEnabled} as AudioProps}
      {...common}
    />
    {chapters.map((c, i) => (
      <Composition
        key={c.id}
        id={c.id}
        component={single(i)}
        durationInFrames={sec(c.durationSec)}
        defaultProps={{music: audio.musicEnabled} as AudioProps}
        {...common}
      />
    ))}
  </>
);
