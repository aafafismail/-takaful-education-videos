// Open-licence fonts (SIL OFL) bundled from npm — no network needed at render.
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/600-italic.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {continueRender, delayRender} from 'remotion';

const handle = delayRender('Loading fonts');
const faces = [
  '600 40px Fraunces',
  'italic 600 40px Fraunces',
  '700 40px Fraunces',
  '400 40px Inter',
  '500 40px Inter',
  '600 40px Inter',
  '700 40px Inter',
];
Promise.all(faces.map((f) => document.fonts.load(f)))
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
