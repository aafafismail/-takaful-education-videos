/**
 * ============================================================
 *  LATTE & TAKAFUL — EDIT HERE (text, prices, timing, images, CTA)
 * ============================================================
 *  All money maths is computed from `prices`, so the on-screen
 *  numbers stay correct if you change a price.
 *  Times are seconds from the start of the video.
 *  No imports, so Node scripts can read this file too.
 */

export const latteVideo = {
  id: 'LatteTakaful',
  title: 'Kena stop latte ke kalau nak mula takaful?',
  fps: 30,
  width: 1080,
  height: 1920,
  durationSec: 68,
  sampleSec: 10,
};

export const prices = {
  monthlyContribution: 100, // example contribution, RM / month
  daysInMonth: 30,
  latte: 13,
  cupsToCut: 8,
  homeCoffee: 3, // illustrative cost of one home-made coffee
  switches: 10,
  americano: 9.5,
};

// Derived numbers (do not edit — change `prices` instead)
export const maths = {
  perDay: prices.monthlyContribution / prices.daysInMonth, // 3.333…
  cupsTotal: prices.cupsToCut * prices.latte, // 104
  savingPerSwitch: prices.latte - prices.homeCoffee, // 10
  switchTotal: prices.switches * (prices.latte - prices.homeCoffee), // 100
  americanoGap: prices.latte - prices.americano, // 3.5
};

export const rm = (n: number, dp?: number) => {
  const d = dp ?? (Number.isInteger(n) ? 0 : 2);
  return 'RM' + n.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
};

export const latteText = {
  hook: 'Kena stop latte ke kalau nak mula takaful?',
  // Scene 2 — monthly budget
  contributionLabel: 'Contoh sumbangan takaful',
  perMonth: `${rm(prices.monthlyContribution)}/bulan`,
  divide: `÷ ${prices.daysInMonth}`,
  perDay: `≈ ${rm(maths.perDay, 2)} sehari`,
  // ⚠️ Replace with the product illustration + qualification from your original script
  qualification:
    'Ilustrasi sahaja. Sumbangan sebenar bergantung pada pelan, umur, kesihatan dan pengunderaitan. Tertakluk pada terma dan syarat.',
  // Scene 3 — the small change
  lattePrice: `Contoh harga latte ${rm(prices.latte)}`,
  cupsEquation: `${prices.cupsToCut} × ${rm(prices.latte)} = ${rm(maths.cupsTotal)}`,
  notAll: 'Bukan stop semua.',
  cutEight: `Kurangkan ${prices.cupsToCut} pembelian.`,
  calendarMonth: 'Contoh sebulan',
  // Scene 4 — coffee at home
  illustrative: 'Kos ilustrasi',
  homeCost: `Kopi rumah ≈ ${rm(prices.homeCoffee)}`,
  perSwitch: `${rm(prices.latte)} − ${rm(prices.homeCoffee)} = jimat ${rm(maths.savingPerSwitch)} setiap tukar`,
  switchTotal: `${prices.switches} kali tukar = ${rm(maths.switchTotal)}`,
  // Scene 5 — the americano joke
  latteTag: `Latte ${rm(prices.latte)}`,
  americanoTag: `Americano ${rm(prices.americano)}`,
  gapTag: `Beza ${rm(maths.americanoGap)}`,
  // Scene 6 — making room
  budgetTitle: 'Bajet bulanan',
  budgetLines: ['Keperluan', 'Komitmen', 'Simpanan', 'Kopi & healing'],
  protectionLine: `Perlindungan ${rm(prices.monthlyContribution)}`,
  end1: 'Tak perlu cut semua.',
  end2: 'Beri ruang untuk perlindungan.',
  cta: 'Reply ‘SEMAK’',
  name: 'Afaf Ismail',
};

/** Where things happen (seconds). */
export const beats = {
  hookIn: 0.6,
  s2: 8.0,
  perMonth: 9.0,
  divide: 11.4,
  perDay: 12.6,
  qualification: 14.6,
  s3: 20.0,
  lattePrice: 20.8,
  cups: 24.6,
  cupStagger: 0.42,
  cupsEquation: 28.0,
  calendar: 29.4,
  s4: 33.0,
  homeCost: 37.6,
  perSwitch: 40.0,
  switchTotal: 42.6,
  s5: 46.0,
  tags: 46.6,
  gap: 48.4,
  s6: 53.0,
  protectionLine: 54.6,
  family: 57.4,
  end1: 60.6,
  end2: 61.6,
  cta: 62.8,
};

/**
 * Images live in public/latte/. Each shot crops one image:
 * from/to = [zoom, focusX %, focusY %] — the camera moves between them.
 * tin = transition in: 'cut' | 'cross' | 'flash'.
 */
export type Shot = {
  file: string;
  start: number;
  from: [number, number, number];
  to: [number, number, number];
  tin: 'cut' | 'cross' | 'flash';
  dim?: number;
  blur?: number;
};

export const shots: Shot[] = [
  // 1 — the coffee moment: wide café → close on the cup and her face
  {file: 'scene1-cafe', start: 0, from: [1.04, 50, 50], to: [1.14, 50, 48], tin: 'cross'},
  {file: 'scene1-cafe', start: 3.4, from: [1.45, 52, 60], to: [1.7, 52, 62], tin: 'cut'},
  // 2 — the monthly budget at home
  {file: 'scene2-budget', start: 8.0, from: [1.05, 50, 50], to: [1.16, 50, 55], tin: 'flash', dim: 0.15},
  {file: 'scene2-budget', start: 13.8, from: [1.4, 50, 70], to: [1.55, 48, 72], tin: 'cut', dim: 0.3},
  // 3 — the small change: café counter → cups → calendar
  {file: 'scene3-counter', start: 20.0, from: [1.12, 50, 45], to: [1.04, 50, 50], tin: 'cross'},
  {file: 'scene3-counter', start: 24.4, from: [1.3, 50, 50], to: [1.38, 50, 50], tin: 'cross', dim: 0.55, blur: 10},
  // 4 — coffee at home
  {file: 'scene4-kitchen', start: 33.0, from: [1.04, 50, 50], to: [1.12, 50, 50], tin: 'flash'},
  {file: 'scene4-kitchen', start: 37.2, from: [1.38, 50, 62], to: [1.5, 52, 64], tin: 'cut', dim: 0.2},
  // 5 — the americano joke: drift between the two cups
  {file: 'scene5-two-cups', start: 46.0, from: [1.25, 40, 55], to: [1.25, 60, 55], tin: 'cross', dim: 0.1},
  // 6 — making room: budget again → family moment
  {file: 'scene2-budget', start: 53.0, from: [1.3, 50, 66], to: [1.4, 50, 68], tin: 'cross', dim: 0.35},
  {file: 'scene6-family', start: 57.2, from: [1.14, 50, 52], to: [1.04, 50, 50], tin: 'cross', dim: 0.15},
];

/** Steam wisps: [start, end, x px, y px] in the 1080×1920 frame. Adjust once real images are in. */
export const steam: [number, number, number, number][] = [
  [3.4, 8.0, 560, 1000],
  [37.2, 46.0, 560, 1040],
];

/** Price-tag positions over scene 5's cups (px). Adjust to the real image. */
export const americanoTags = {latte: {x: 330, y: 820}, americano: {x: 750, y: 820}};

/** Optional single-cup illustration for the counting sequence. */
export const cupImage = 'latte/cup.png';

export const audio = {
  voiceover: null as string | null, // e.g. 'latte/voiceover.mp3'
  music: null as string | null,
  musicVolume: 0.2,
};

export type Cue = {start: number; end: number; text: string};

/**
 * Narration subtitles — told by the main character, first person. Wrap *keywords* for yellow.
 * The hook (0.6–4.2 s) and end card lines are shown as big on-screen text instead.
 */
export const captions: Cue[] = [
  {start: 4.4, end: 7.6, text: 'Itu soalan saya dulu. Latte ni *healing kecil* saya.'},
  {start: 8.6, end: 11.4, text: 'Malam tu, saya buka *bajet bulanan.*'},
  {start: 11.4, end: 14.6, text: 'Contoh takaful *RM100 sebulan*\u2026 bahagi 30, *RM3.33 sehari.*'},
  {start: 14.6, end: 19.6, text: 'Itu contoh je\u2014jumlah sebenar ikut *pelan, umur & kesihatan.*'},
  {start: 20.4, end: 24.4, text: 'Esoknya kat kafe, saya tengok harga latte\u2014*RM13.*'},
  {start: 24.6, end: 28.8, text: 'Saya kira\u2026 lapan cawan sebulan dah *RM104.*'},
  {start: 29.0, end: 32.8, text: 'Oh. Bukan kena stop semua. Cuma *kurangkan lapan* kali.'},
  {start: 33.4, end: 37.2, text: 'Jadi sesetengah pagi, saya buat kopi *sendiri.*'},
  {start: 37.4, end: 41.0, text: 'Kopi rumah pun ada kos\u2014katakan *RM3.*'},
  {start: 41.2, end: 45.6, text: 'Setiap tukar jimat RM10. *Sepuluh kali, RM100.*'},
  {start: 46.4, end: 49.6, text: 'Kadang-kadang tukar ke americano\u2014*beza RM3.50.*'},
  {start: 49.8, end: 52.6, text: '*Coffee maths* pula \uD83D\uDE02'},
  {start: 53.4, end: 57.2, text: 'Akhirnya, saya asingkan *RM100* untuk perlindungan.'},
  {start: 57.4, end: 60.4, text: 'Sebab ada orang yang saya *sayang.*'},
];

/** Full narration per scene (for recording). */
export const narration = [
  'Kena stop latte ke kalau nak mula takaful? Itu soalan saya dulu. Latte ni healing kecil saya.',
  'Malam tu, saya buka bajet bulanan. Contoh takaful RM100 sebulan… bahagi 30, RM3.33 sehari. Itu contoh je—jumlah sebenar ikut pelan, umur dan kesihatan.',
  'Esoknya kat kafe, saya tengok harga latte—RM13. Saya kira… lapan cawan sebulan dah RM104. Oh. Bukan kena stop semua. Cuma kurangkan lapan kali.',
  'Jadi sesetengah pagi, saya buat kopi sendiri. Kopi rumah pun ada kos—katakan RM3. Setiap tukar jimat RM10. Sepuluh kali, RM100.',
  'Kadang-kadang tukar ke americano—beza RM3.50. Coffee maths pula!',
  'Akhirnya, saya asingkan RM100 untuk perlindungan. Sebab ada orang yang saya sayang. Tak perlu cut semua. Beri ruang untuk perlindungan. Nak semak? Reply SEMAK.',
];
