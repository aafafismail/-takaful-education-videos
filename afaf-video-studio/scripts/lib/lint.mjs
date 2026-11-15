// Content rules for this use case. Errors block the build; warnings are reported for human review.

const SALES = [
  [/takaful/i, 'mentions takaful'],
  [/insuran|insurance/i, 'mentions insurance'],
  [/great\s*eastern/i, 'names a company'],
  [/alpha\s*legacy/i, 'names the agency'],
  [/wa\.me|whatsapp/i, 'WhatsApp CTA'],
  [/\b(dm|pm)\s+(saya|me|kami)\b/i, 'DM/PM sales CTA'],
  [/link\s+in\s+bio|klik\s+link/i, 'link CTA'],
  [/quotation|sebut\s*harga|\bpremium\b|caruman|sumbangan\s+bulanan/i, 'pricing or quotation language'],
  [/promosi|promo\b|diskaun|discount|offer\b|tawaran/i, 'promotion language'],
];

const WARN = [
  [/\d+(\.\d+)?\s?%/, 'contains a percentage: confirm it comes from a real, citable source or remove it'],
  [/\bRM\s?\d/i, 'contains a ringgit amount: confirm it is a neutral example, not a claim'],
  [/terbaik|paling\s+murah|100\s?peratus|dijamin|guaranteed|pasti\s+berjaya|\bbest\b/i, 'absolute or exaggerated wording'],
  [/tahukah\s+anda|dalam\s+era\s+digital|kesimpulannya/i, 'robotic stock phrase'],
  [/[—–]|\s-\s/, 'dash in prose (style rule: avoid dashes)'],
  [/!{2,}/, 'multiple exclamation marks'],
  [/saya\s+(dulu|pernah|sendiri)|my\s+(client|husband|wife)|klien\s+saya/i, 'sounds like a personal story or client case: make sure it is real and approved'],
];

const fields = (b) => [
  ['hook', b.hook],
  ['mainMessage', b.mainMessage],
  ['tip', b.tip],
  ...b.tipItems.map((t, i) => [`tipItems.${i}`, t]),
  ['reinforce', b.reinforce],
  ['closing', b.closing],
  ...Object.entries(b.narration).map(([k, v]) => [`narration.${k}`, v]),
  ['caption', b.caption],
  ['cover.title', b.cover.title],
  ['hashtags', b.hashtags.join(' ')],
];

export const lintBrief = (b) => {
  const errors = [];
  const warnings = [];
  for (const [name, value] of fields(b)) {
    if (!value) continue;
    if (!b.allowTakaful) {
      for (const [re, why] of SALES) if (re.test(value)) errors.push(`${name}: ${why} ("${value.match(re)[0]}"). Remove it, or set "allowTakaful": true if selling was explicitly requested.`);
    }
    for (const [re, why] of WARN) if (re.test(value)) warnings.push(`${name}: ${why}`);
    const stars = (value.match(/\*/g) || []).length;
    if (stars % 2) errors.push(`${name}: unmatched * highlight marker`);
  }
  return {errors, warnings};
};
