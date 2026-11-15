// Afaf Ismail brand tokens. Change colours, fonts and safe areas here.
export const colors = {
  paper: '#FAF6F0', // warm white
  white: '#FFFFFF',
  nude: '#E9D6C5',
  nudeDeep: '#D8BBA3',
  yellow: '#F5E3A1', // light yellow
  yellowSoft: '#FBF1CC',
  navy: '#1E2A47', // dark blue
  navySoft: '#46557A',
  ink: '#1E2A47',
  muted: '#7A7468',
};

export const fonts = {
  serif: '"Playfair Display", Georgia, serif',
  sans: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
};

// Instagram Reels UI covers the top bar, the right-hand action buttons and the
// caption/username block at the bottom. Keep text inside these margins.
export const safe = {
  top: 270,
  bottom: 500,
  left: 96,
  right: 160,
};

// Profile grid shows a 4:5 crop (1080x1350) from the centre of the cover.
export const gridCrop = {top: 285, height: 1350};

export const sizes = {xl: 116, lg: 92, md: 74, sm: 56} as const;
