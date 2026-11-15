// B-roll overlays for the TikTok talking-head video
// "How couples can discuss money without blaming each other".
// Still-image camera moves only (Ken Burns). No AI motion, text or audio.

export const overlayVideo = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationSec: 5,
};

export type OverlayMove =
  // Push-in: scale grows from `from` to `to` around the focus point (0..1 of the image).
  | {kind: 'push'; from: number; to: number; focusX: number; focusY: number}
  // Pan: fixed scale, horizontal travel in px (positive = image moves right).
  | {kind: 'pan'; scale: number; fromX: number; toX: number; focusY: number};

export type Overlay = {
  id: string; // composition id
  file: string; // output file name
  image: string; // path inside public/
  label: string;
  move: OverlayMove;
};

// Image numbering follows the animation plan, not the upload order:
// 01 = upload #2, 02 = upload #5, 03 = upload #3, 04 = upload #4, 05 = upload #1.
export const overlays: Overlay[] = [
  {
    id: 'CoupleOverlay01',
    file: 'overlay_01.mp4',
    image: 'couple-money/01-tension.png',
    label: 'Financial tension',
    // Wide shot: centre between the two, slightly above the table, so both stay in frame.
    move: {kind: 'push', from: 1.0, to: 1.07, focusX: 0.5, focusY: 0.42},
  },
  {
    id: 'CoupleOverlay02',
    file: 'overlay_02.mp4',
    image: 'couple-money/02-blamed.png',
    label: 'Feeling blamed',
    // Extremely subtle zoom toward her face.
    move: {kind: 'push', from: 1.0, to: 1.035, focusX: 0.46, focusY: 0.3},
  },
  {
    id: 'CoupleOverlay03',
    file: 'overlay_03.mp4',
    image: 'couple-money/03-approach.png',
    label: 'Changing approach',
    // Gentle left-to-right drift; scale 1.07 leaves ~37px each side, travel stays inside it.
    move: {kind: 'pan', scale: 1.07, fromX: 30, toX: -30, focusY: 0.5},
  },
  {
    id: 'CoupleOverlay04',
    file: 'overlay_04.mp4',
    image: 'couple-money/04-commitments.png',
    label: 'Listing commitments',
    // Toward the centre of the three card columns.
    move: {kind: 'push', from: 1.0, to: 1.06, focusX: 0.5, focusY: 0.45},
  },
  {
    id: 'CoupleOverlay05',
    file: 'overlay_05.mp4',
    image: 'couple-money/05-together.png',
    label: 'Working together',
    // Balanced push toward the couple and notebook.
    move: {kind: 'push', from: 1.0, to: 1.06, focusX: 0.5, focusY: 0.48},
  },
];
