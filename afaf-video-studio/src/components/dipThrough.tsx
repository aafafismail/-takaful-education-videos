import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

// Outgoing scene fades out in the first half, incoming scene fades (and lifts) in during the second half.
// Avoids two sets of text overlapping mid-transition.
const DipThrough: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const p = presentationProgress;
  const opacity = presentationDirection === 'exiting' ? Math.max(0, 1 - p * 2) : Math.max(0, p * 2 - 1);
  const lift = presentationDirection === 'entering' ? (1 - opacity) * 18 : 0;
  return <AbsoluteFill style={{opacity, translate: `0px ${lift}px`}}>{children}</AbsoluteFill>;
};

export const dipThrough = (): TransitionPresentation<Record<string, never>> => ({component: DipThrough, props: {}});
