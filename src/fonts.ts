// Open-licence fonts (SIL OFL) bundled from npm — no network needed at render.
import '@fontsource/anton/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import {continueRender, delayRender} from 'remotion';

const handle = delayRender('Loading fonts');
const faces = ['400 40px Anton', '500 40px Poppins', '600 40px Poppins', '700 40px Poppins', '800 40px Poppins'];
Promise.all(faces.map((f) => document.fonts.load(f)))
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
