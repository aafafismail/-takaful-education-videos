# Takaful education videos

Vertical (1080 × 1920) animated infographic videos for Instagram Stories, WhatsApp Status and TikTok, built with [Remotion](https://www.remotion.dev) (React → MP4).

## Video 1 — "Healing hari ini. Tenang juga esok."

83 seconds, five chapters that also work as separate Stories.

| # | Chapter | Length | Clip |
|---|---|---|---|
| 1 | Gaji masuk (hook, 19.63%) | 16 s | `renders/chapters/ch1-gaji-masuk.mp4` |
| 2 | Kenapa tangguh | 15 s | `renders/chapters/ch2-kenapa-tangguh.mp4` |
| 3 | Bina asas (pyramid) | 16 s | `renders/chapters/ch3-bina-asas.mp4` |
| 4 | Jadikan praktikal (RM300 / RM5,000 = 6%) | 17 s | `renders/chapters/ch4-jadikan-praktikal.mp4` |
| 5 | Langkah seterusnya + CTA | 19 s | `renders/chapters/ch5-langkah-seterusnya.mp4` |

**Rendered files**
- `renders/healing-hari-ini-full.mp4`: full video, silent, subtitles burned in
- `renders/healing-hari-ini-full-with-music.mp4`: same video with the optional ambient music
- `renders/chapters/*.mp4`: one clip per chapter (silent)
- `subtitles/*.srt`, `subtitles/*.vtt`: timed subtitles (full video and per chapter)
- `docs/voiceover-script.md`: narration script with timings and delivery notes
- `docs/keyframes.png`: key-frame contact sheet

## Edit everything in one file: `src/config.ts`

| What | Where in `src/config.ts` |
|---|---|
| Colours | `colors` |
| Fonts | `fonts` |
| Chapter length | `chapters[n].durationSec` |
| When things animate | `chapters[n].beats` (seconds from chapter start) |
| On-screen text | `chapters[n].text` |
| Subtitles | `chapters[n].captions`, then run `npm run subtitles` |
| Subtitles on/off in video | `video.showCaptions` |
| CTA and name | `cta` |
| Source line | `source` |
| Music and voiceover | `audio` |
| Safe area margins | `safe` |

## Commands

```bash
npm install
npm run studio          # live preview in the browser (scrub, play, inspect)
npm run render          # full MP4 → renders/healing-hari-ini-full.mp4
npm run render:chapters # five chapter MP4s → renders/chapters/
npm run subtitles       # rebuild .srt/.vtt from config
npm run stills          # key frames → out/stills/
```

Remotion downloads its own headless Chrome the first time. To use a Chrome you already have, set `REMOTION_BROWSER=/path/to/chrome`.

### Add your voiceover
1. Record `ch1.mp3` … `ch5.mp3` using `docs/voiceover-script.md`.
2. Put them in `public/voiceover/`.
3. In `src/config.ts` set `audio.voiceover = ['voiceover/ch1.mp3', 'voiceover/ch2.mp3', 'voiceover/ch3.mp3', 'voiceover/ch4.mp3', 'voiceover/ch5.mp3']`.
4. If a recording is longer than its chapter, increase that chapter's `durationSec` and shift its `captions`/`beats`.
5. Run `npm run render:all`.

### Music
`public/audio/ambient-pad.mp3` is an original pad generated from code (`scripts/make-music.py`). There are no samples or third-party recordings in it, so it is free to use. It is off by default. To turn it on, set `audio.musicEnabled: true`, or render with `--props='{"music":true}'`. With a voiceover, keep `musicVolume` around 0.15–0.25.

## Design notes
- **Safe area:** essential text stays within x 120–960 and y 260–1520. That keeps it clear of the Stories profile bar, the reply box, TikTok's right-hand buttons and its caption area. Subtitles sit in a band starting at y 1385.
- **Readable on mute:** one main idea on screen at a time, with subtitles burned in. The end card holds still for the last ~3 seconds.
- **Arithmetic:** RM300 ÷ RM5,000 = 6%. The percentage is computed in code from `salary` and `budget`, so it stays correct if you change either value.

## Accuracy and guardrails
- 19.63% is shown as family takaful *penetration*, with an on-screen note that it is not the exact share of individuals covered. The video makes no claim about the other 80.37%, and the 75% target is not used.
- Source: Persatuan Takaful Malaysia, Annual Report 2025. https://takaful4all.org/wp-content/uploads/2026/06/MTA_AR2025_FINAL.pdf. The source site could not be reached from the build environment, so please double-check the figure against the PDF before posting.
- The pyramid is labelled "Ilustrasi ringkas". The three foundation blocks are equal in size, and a note says protection complements emergency savings and does not replace them.
- In chapter 4, RM300 is labelled "Untuk dinilai, bukan jaminan" and carries the full illustration disclaimer. There are no benefit amounts or quotations.
- No phone numbers or company logos are used.

## Licences
- Fonts: Fraunces and Inter (SIL Open Font License), bundled through `@fontsource`.
- Remotion is free for individuals and companies with up to 3 employees. Larger companies need a company licence (see remotion.dev/license).
