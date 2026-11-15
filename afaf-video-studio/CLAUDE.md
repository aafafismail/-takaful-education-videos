# Afaf Video Studio: notes for Claude Code

This project turns a brief into an Instagram Reel for Afaf Ismail. Read README.md for commands.

## When asked to make a new reel
1. Draft `briefs/<slug>.json` from the user's content (copy `briefs/_template.json`).
2. `npm run reel -- make briefs/<slug>.json`. Fix any validation or lint errors by rewording, never by weakening the rules.
3. Look at `exports/<slug>/preview/contact-sheet.png` and `cover-preview.png`, then show the user the preview.
4. Only run `approve` and `render` after the user approves the preview, or when they explicitly ask you to.
5. Never claim a render succeeded unless `render` printed all ✓ checks (see `final/render-report.json`).

## Content rules
- Natural Malay and English mix, short sentences, addressed as "anda".
- One hook, one main point, one practical action.
- No invented stories, clients, testimonials or statistics.
- No takaful, insurance, company or agency names, WhatsApp or DM CTAs, products or promotions, unless the user explicitly asks (then set `allowTakaful: true`).
- Avoid "Tahukah anda", "Dalam era digital", "Kesimpulannya", dashes in prose and exaggerated claims.
- Closing invites people to try the tip. Do not add a second CTA.

## Media rules
- Use only media the user supplies or that is licensed. Never generate or alter Afaf's face, and never synthesise or clone a voice.
- Captions must not be presented as word-accurate unless they come from a real SRT for the real audio.
- Never publish or upload anywhere.

## Remotion
Official skills are in `.claude/skills/` (start with `remotion-best-practices`).
Animate with `useCurrentFrame()` and `interpolate()` only, never CSS transitions.
Brand tokens are in `src/brand.ts`.
