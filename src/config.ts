/**
 * ============================================================
 *  EDIT HERE — the one place for colours, text, timing and CTA
 * ============================================================
 *
 *  - Colours ............ `colors`
 *  - Fonts .............. `fonts`
 *  - Chapter length ..... `chapters[n].durationSec`
 *  - Animation beats .... `chapters[n].beats` (seconds from chapter start)
 *  - Subtitles .......... `chapters[n].captions` (seconds from chapter start)
 *  - On-screen text ..... `chapters[n].text`
 *  - CTA / name ......... `cta`
 *  - Music / voiceover .. `audio`
 *
 *  After editing captions, run `npm run subtitles` to regenerate the
 *  .srt files in /subtitles.
 *
 *  This file has no imports so Node scripts can read it too.
 */

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
  title: 'Healing hari ini. Tenang juga esok.',
  /** Burn the narration subtitles into the video (keeps it clear on mute). */
  showCaptions: true,
};

export const colors = {
  // Brand
  navy: '#14254A', // ink: outlines and text
  navySoft: '#2B4478',
  cream: '#FBF3E4', // page background
  paper: '#F4E5C8',
  white: '#FFFCF5',
  gold: '#F0B54A',
  goldDeep: '#D8952A',
  goldSoft: 'rgba(240, 181, 74, 0.35)',
  red: '#E2604F',
  redSoft: 'rgba(226, 96, 79, 0.18)',
  // Illustration helpers
  sky: '#BFDCEB',
  leaf: '#7FBF8E',
  leafDeep: '#4E9A66',
  skin: '#F3C9A2',
  skinDeep: '#C98D63',
  blush: '#F5A28E',
  blue: '#3E66AE',
  muted: 'rgba(20, 37, 74, 0.62)',
  // Cinematic overlays
  glass: 'rgba(10, 20, 40, 0.58)',
  glassLine: 'rgba(255, 220, 150, 0.45)',
  creamText: '#FFF6E6',
  captionHighlight: '#FFD54A',
};

export const fonts = {
  /** Bold friendly headlines and numbers */
  display: 'Poppins, Arial, sans-serif',
  /** Labels, captions, notes */
  body: 'Poppins, Arial, sans-serif',
  /** Hand-written annotations */
  hand: 'Caveat, cursive',
  /** Big bold captions (reference style) */
  caption: 'Anton, Impact, sans-serif',
};

/**
 * Safe area for 1080x1920 Stories / Status / TikTok.
 * Keep essential text inside these bounds (pixels).
 * Top ~250px: profile bar / progress. Bottom ~400px: reply box, captions,
 * TikTok description. Right ~120px: TikTok action buttons.
 */
export const safe = {
  top: 260,
  bottom: 1520,
  left: 120,
  right: 960,
  /** Where the subtitle band starts (top edge). */
  captionTop: 1385,
};

export const cta = {
  line1: 'Healing hari ini.',
  line2: 'Tenang juga esok.',
  action: 'Nak mula? Reply ‘SEMAK’.',
  name: 'Afaf Ismail',
};

export const source = {
  label: 'Sumber: Persatuan Takaful Malaysia, Annual Report 2025',
  url: 'https://takaful4all.org/wp-content/uploads/2026/06/MTA_AR2025_FINAL.pdf',
};

export const audio = {
  /** Optional background music in /public. Generated locally, royalty-free. */
  musicFile: 'audio/ambient-pad.mp3',
  musicEnabled: false,
  musicVolume: 0.22,
  /**
   * Optional recorded voiceover, one file per chapter in /public.
   * e.g. 'voiceover/ch1.mp3'. Leave null until recorded.
   */
  voiceover: [null, null, null, null, null] as (string | null)[],
  voiceoverVolume: 1,
};

export type Caption = {start: number; end: number; text: string};

/**
 * One background image per scene. Files live in public/scenes/<file>.jpg.
 * start: seconds from chapter start. cam: camera move. tin: transition in.
 * dim: darken 0..1 (helps overlays read). blur: px blur.
 */
export type Cam = 'in' | 'out' | 'up' | 'down' | 'left' | 'right';
export type Transition = 'fade' | 'cross' | 'thread' | 'tear' | 'flash';
export type Scene = {file: string; start: number; cam: Cam; tin: Transition; dim?: number; blur?: number};

export const chapters = [
  {
    id: 'Ch1Hook',
    scenes: [{file: 's01', start: 0, cam: 'in', tin: 'fade'}, {file: 's02', start: 2.0, cam: 'up', tin: 'thread'}, {file: 's03', start: 5.0, cam: 'in', tin: 'cross'}, {file: 's04', start: 8.0, cam: 'down', tin: 'thread', dim: 0.35}] as Scene[],
    number: '01',
    name: 'Gaji masuk',
    durationSec: 16,
    beats: {
      notification: 0.2,
      flowStart: 1.6,
      blockStagger: 0.8,
      protectionWaits: 5.0,
      question: 5.4,
      statStart: 8.0,
    },
    text: {
      notifyApp: 'Bank · sekarang',
      notifyTitle: 'Gaji masuk',
      notifyAmount: '+RM5,000.00',
      blocks: ['Keperluan', 'Komitmen', 'Shopping', 'Healing'],
      protection: 'Perlindungan',
      waiting: 'tunggu baki',
      question: 'Perlindungan tunggu baki?',
      statLabel: 'Penembusan takaful keluarga',
      statValue: 19.63,
      statYear: '2025',
      statNote: 'Kadar penembusan pasaran — bukan peratus tepat individu yang dilindungi.',
    },
    captions: [
      {start: 0.3, end: 2.0, text: 'Gaji *masuk.*'},
      {start: 2.0, end: 5.0, text: 'Komitmen, *shopping, healing…* semua dah ada bahagian.'},
      {start: 5.0, end: 8.0, text: '*Perlindungan?* Tunggu baki dulu. Familiar?'},
      {start: 8.0, end: 13.2, text: 'Kadar penembusan takaful keluarga Malaysia ialah *19.63%* pada 2025.'},
      {start: 13.2, end: 15.6, text: 'Jom mula dengan *bajet kita sendiri.*'},
    ] as Caption[],
    narration:
      'Gaji masuk. Komitmen, shopping, healing… semua dah ada bahagian. Perlindungan? Tunggu baki dulu. Familiar? Kadar penembusan takaful keluarga Malaysia ialah 19.63% pada 2025. Jom mula dengan bajet kita sendiri.',
  },
  {
    id: 'Ch2Postpone',
    scenes: [{file: 's05', start: 0, cam: 'in', tin: 'fade'}, {file: 's06', start: 1.8, cam: 'right', tin: 'tear'}, {file: 's07', start: 5.2, cam: 'in', tin: 'cross', dim: 0.2}, {file: 's08', start: 8.0, cam: 'out', tin: 'flash'}, {file: 's09', start: 9.8, cam: 'in', tin: 'cross', dim: 0.3}] as Scene[],
    number: '02',
    name: 'Kenapa tangguh',
    durationSec: 15,
    beats: {
      icons: 0.3,
      future: 5.2,
      healingOk: 8.0,
      balance: 9.8,
    },
    text: {
      now: 'Seronok sekarang.',
      later: 'Perlindungan… nanti?',
      icons: ['Shopping', 'Teh tarik', 'Cuti'],
      nowLabel: 'Sekarang',
      laterLabel: 'Nanti',
      healingOk: 'Healing tak salah.',
      makeRoom: 'Beri ruang untuk hari esok.',
      today: 'Hari ini',
      tomorrow: 'Esok',
    },
    captions: [
      {start: 0.2, end: 1.8, text: 'Kenapa kita *tangguh?*'},
      {start: 1.8, end: 5.2, text: 'Sebab seronok shopping atau bercuti, kita rasa *sekarang.*'},
      {start: 5.2, end: 8.0, text: 'Manfaat perlindungan pula terasa *jauh.*'},
      {start: 8.0, end: 9.8, text: '*Healing* tak salah.'},
      {start: 9.8, end: 14.4, text: 'Cuma, jangan sampai bajet *hari ini* buat kita risau *kemudian.*'},
    ] as Caption[],
    narration:
      'Kenapa kita tangguh? Sebab seronok shopping atau bercuti, kita rasa sekarang. Manfaat perlindungan pula terasa jauh. Healing tak salah. Cuma, jangan sampai bajet hari ini buat kita risau kemudian.',
  },
  {
    id: 'Ch3Foundation',
    scenes: [{file: 's10', start: 0, cam: 'in', tin: 'fade'}, {file: 's11', start: 2.6, cam: 'up', tin: 'thread', dim: 0.45}, {file: 's12', start: 10.6, cam: 'out', tin: 'tear', dim: 0.4}] as Scene[],
    number: '03',
    name: 'Bina asas',
    durationSec: 16,
    beats: {
      intro: 0.3,
      base: 2.6,
      middle: 6.6,
      top: 7.8,
      budget: 10.6,
    },
    text: {
      tag: 'Ilustrasi ringkas',
      headline: 'Kukuhkan asas dahulu.',
      base: ['Aliran tunai', 'Dana kecemasan', 'Perlindungan'],
      middle: 'Simpanan & pelaburan',
      top: 'Matlamat hidup',
      note: 'Perlindungan melengkapi dana kecemasan, bukan menggantikannya.',
      budgetHeadline: 'Bajet ikut keperluan & kemampuan',
      tenPercent: '10%',
      notRequired: 'bukan angka wajib',
      sliderLabel: 'ikut kemampuan anda',
    },
    captions: [
      {start: 0.2, end: 2.6, text: 'Bayangkan kewangan macam *piramid.*'},
      {start: 2.6, end: 6.2, text: 'Asasnya: *aliran tunai, dana kecemasan* dan *perlindungan.*'},
      {start: 6.2, end: 10.6, text: 'Bila asas lebih *kukuh,* lebih tenang kita bina simpanan, pelaburan dan *impian.*'},
      {start: 10.6, end: 15.6, text: 'Asingkan bajet awal—ikut *kemampuan,* bukan semestinya sepuluh peratus.'},
    ] as Caption[],
    narration:
      'Bayangkan kewangan macam piramid. Asasnya: aliran tunai, dana kecemasan dan perlindungan. Bila asas lebih kukuh, lebih tenang kita bina simpanan, pelaburan dan impian. Asingkan bajet awal—ikut kemampuan, bukan semestinya sepuluh peratus.',
  },
  {
    id: 'Ch4Practical',
    scenes: [{file: 's13', start: 0, cam: 'in', tin: 'fade', dim: 0.4}, {file: 's14', start: 6.0, cam: 'left', tin: 'cross', dim: 0.35}, {file: 's14', start: 10.6, cam: 'in', tin: 'cross', dim: 0.5, blur: 14}] as Scene[],
    number: '04',
    name: 'Jadikan praktikal',
    durationSec: 17,
    beats: {
      salary: 0.2,
      slice: 2.4,
      percent: 4.0,
      notGuarantee: 6.0,
      cards: 10.6,
      cardStagger: 1.4,
      checkFactors: 14.2,
    },
    text: {
      tag: 'Contoh',
      salaryLabel: 'Gaji',
      salary: 5000,
      budgetLabel: 'Bajet contoh',
      budget: 300,
      notGuarantee: 'Untuk dinilai, bukan jaminan',
      cards: [
        {title: 'Medical card', label: 'Kos rawatan yang dilindungi'},
        {title: 'Hibah takaful', label: 'Manfaat kematian untuk penerima'},
        {title: 'Penyakit kritikal', label: 'Tunai apabila syarat tuntutan dipenuhi'},
      ],
      factors: 'Semak ikut umur, kesihatan, tanggungan & kemampuan',
      note: 'Ilustrasi bajet sahaja. Sumbangan dan manfaat bergantung pada pelan, umur, kesihatan serta pengunderaitan. Tertakluk terma dan syarat.',
    },
    captions: [
      {start: 0.2, end: 2.4, text: 'Contoh gaji *lima ribu.*'},
      {start: 2.4, end: 6.0, text: 'Cuba semak ruang *tiga ratus* sebulan—*enam peratus.*'},
      {start: 6.0, end: 10.6, text: 'Itu bajet permulaan untuk *dinilai,* bukan jaminan semua manfaat cukup.'},
      {start: 10.6, end: 13.2, text: '*Medical, hibah* dan *penyakit kritikal:*'},
      {start: 13.2, end: 16.6, text: 'semak ikut umur, kesihatan, *tanggungan* dan *kemampuan.*'},
    ] as Caption[],
    narration:
      'Contoh gaji lima ribu. Cuba semak ruang tiga ratus sebulan—enam peratus. Itu bajet permulaan untuk dinilai, bukan jaminan semua manfaat cukup. Medical, hibah dan penyakit kritikal: semak ikut umur, kesihatan, tanggungan dan kemampuan.',
  },
  {
    id: 'Ch5NextStep',
    scenes: [{file: 's16', start: 0, cam: 'in', tin: 'fade'}, {file: 's17', start: 5.4, cam: 'right', tin: 'cross'}, {file: 's18', start: 9.0, cam: 'in', tin: 'thread', dim: 0.4}, {file: 's19', start: 13.4, cam: 'in', tin: 'cross'}, {file: 's20', start: 15.0, cam: 'out', tin: 'flash', dim: 0.3}] as Scene[],
    number: '05',
    name: 'Langkah seterusnya',
    durationSec: 19,
    beats: {
      family: 0.2,
      question: 2.4,
      crowd: 5.4,
      checklist: 9.0,
      item2: 10.8,
      item3: 12.4,
      wise: 13.4,
      end: 15.0,
    },
    text: {
      question1: 'Kalau pendapatan terhenti,',
      question2: 'apa pelan mereka?',
      crowd: 'Bantuan orang ramai membantu, tapi sukar dijangka.',
      checklistTitle: 'Mula kecil, hari ini',
      checklist: ['Semak komitmen', 'Kurangkan satu kehendak', 'Nilai perlindungan'],
      wise: 'You are wise—you can start.',
    },
    captions: [
      {start: 0.2, end: 2.4, text: 'Kalau ada *pasangan* atau *anak,* fikir:'},
      {start: 2.4, end: 5.4, text: 'kalau pendapatan kita terhenti, apa *pelan mereka?*'},
      {start: 5.4, end: 9.0, text: 'Bantuan orang ramai boleh membantu, tapi *sukar dijangka.*'},
      {start: 9.0, end: 10.8, text: 'Hari ini, *semak satu komitmen.*'},
      {start: 10.8, end: 12.4, text: '*Kurangkan* satu kehendak.'},
      {start: 12.4, end: 13.4, text: '*Mula kecil.*'},
      {start: 13.4, end: 15.4, text: 'You are *wise*—you *can start.*'},
    ] as Caption[],
    narration:
      'Kalau ada pasangan atau anak, fikir: kalau pendapatan kita terhenti, apa pelan mereka? Bantuan orang ramai boleh membantu, tapi sukar dijangka. Hari ini, semak satu komitmen. Kurangkan satu kehendak. Mula kecil. You are wise—you can start.',
  },
] as const;

export type ChapterConfig = (typeof chapters)[number];

export const chapterStartsSec = chapters.reduce<number[]>((acc, c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + chapters[i - 1].durationSec);
  return acc;
}, []);

export const totalDurationSec = chapters.reduce((s, c) => s + c.durationSec, 0);
