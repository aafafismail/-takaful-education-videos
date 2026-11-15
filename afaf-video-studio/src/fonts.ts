import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const faces = [
  {family: 'Playfair Display', file: 'playfair-display-latin-500-normal.woff2', weight: '500', style: 'normal'},
  {family: 'Playfair Display', file: 'playfair-display-latin-600-normal.woff2', weight: '600', style: 'normal'},
  {family: 'Playfair Display', file: 'playfair-display-latin-500-italic.woff2', weight: '500', style: 'italic'},
  {family: 'DM Sans', file: 'dm-sans-latin-400-normal.woff2', weight: '400', style: 'normal'},
  {family: 'DM Sans', file: 'dm-sans-latin-500-normal.woff2', weight: '500', style: 'normal'},
  {family: 'DM Sans', file: 'dm-sans-latin-700-normal.woff2', weight: '700', style: 'normal'},
] as const;

let loaded: Promise<unknown> | null = null;
export const loadBrandFonts = () => {
  if (!loaded) {
    loaded = Promise.all(
      faces.map((f) =>
        loadFont({family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style, display: 'block'}),
      ),
    );
  }
  return loaded;
};
