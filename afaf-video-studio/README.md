# Afaf Video Studio

Turns a short content brief (JSON) into a polished 1080×1920 Instagram Reel with [Remotion](https://www.remotion.dev).
Text-led editorial design in Afaf Ismail's brand colours. It can use your own portrait photo or clip, and a real recorded voiceover.
Nothing is ever published automatically.

## Quick start

```bash
npm install                                   # also copies the brand fonts into public/fonts
npm run reel -- make briefs/couples-money-talk.json   # build + preview
npm run studio -- couples-money-talk          # optional: live, scrubbable preview
npm run reel -- approve couples-money-talk    # you approve what you previewed
npm run reel -- render couples-money-talk     # final MP4 + cover + SRT, then automatic checks
```

New reel: copy `briefs/_template.json`, fill it in (see `briefs/README.md`) and run `make` on it.

## The flow

| Step | Command | What you get in `exports/<slug>/` |
|---|---|---|
| 1. Validate | `reel -- validate <brief>` | Schema and content-rule check (no file output) |
| 2. Build | `reel -- build <brief>` | `scene-data.json` (editable), `storyboard.md`, `caption.txt`, `voiceover-script.md`, `subtitles.srt`, `report.json` |
| 3. Preview | `reel -- preview <slug>` | `preview/preview.mp4` (540×960), `preview/contact-sheet.png`, `preview/cover-preview.png`, `preview/frames/` |
| 4. Approve | `reel -- approve <slug> [--by name]` | `approval.json`, tied to a fingerprint of the scene data, media and template code |
| 5. Render | `reel -- render <slug>` | `final/<slug>.mp4`, `final/<slug>-cover.png`, `final/<slug>.srt`, `final/caption.txt`, `final/voiceover-script.md`, `final/render-report.json` |

Render refuses to run if anything changed after approval (text, timing, media or template code). Then you preview and approve again.
After rendering, ffprobe checks the MP4: 1080×1920, 30 fps, H.264, yuv420p, 20 to 30 s, matching duration and an AAC audio track. It also checks that the cover is 1080×1920.
The result goes to `render-report.json`. If any check fails, the command fails.

## Editing

- **Words, emphasis, kickers:** edit the brief and rebuild, or edit `exports/<slug>/scene-data.json` directly and run `preview` again.
  Wrap words in `*stars*` to highlight them.
- **Timing:** each scene has `durationInFrames` (30 = 1 s), and each line has `at` (seconds after the scene starts). The total must stay between 20 and 30 s.
- **Hand edits are protected:** `build` won't overwrite a hand-edited `scene-data.json` unless you pass `--force`.
- **Brand colours, fonts, safe margins:** `src/brand.ts`.
- **Scene layouts:** `src/scenes/SceneView.tsx`. Shared pieces live in `src/components/`.

## How timing works

- **Without voiceover:** each scene lasts as long as the slower of reading the on-screen text (about 3 words/s) and speaking the narration (about 2.5 words/s), plus a short hold. The total is then stretched to at least 20 s, or compressed to at most 30 s (reveals at no less than 80% speed). If the text still doesn't fit, the build fails and asks you to shorten it.
- **With voiceover:** the recording's length sets the total. Scenes are shared out by narration word count. A recording over about 29 s is rejected.

## Captions and SRT, honestly

| Situation | Burned-in captions | `subtitles.srt` contains |
|---|---|---|
| No voiceover | None (the video is the text) | On-screen text with the time each line appears. Not a speech transcript. |
| Voiceover + your SRT | Yes, from your SRT | Your SRT |
| Voiceover, no SRT | Only if `captions.allowEstimated: true` | Sentence-level cues **estimated** from the script, not matched to the audio |

The system never claims word-accurate timing. For exact captions, export an SRT from CapCut, Premiere or similar, or let Instagram auto-generate captions.

## Media rules

- **Portrait:** your own real photo or clip, with `consent: true`. It is shown as supplied: no filters, no face edits, no generated likeness. The only effect is a slight zoom.
- **Voiceover:** a real human recording only, with `realRecording: true`. No voice cloning or synthesis.
- **Music:** `none`, `generated`, or a licensed file with a `license` note. `generated` is an original ambient pad synthesised by ffmpeg from sine tones in `scripts/lib/media.mjs`, so there are no samples and no third-party audio.

## Content rules (enforced by `scripts/lib/lint.mjs`)

**Blocks the build:** takaful or insurance mentions, company or agency names, WhatsApp or DM CTAs, pricing, quotation or promotion language. This only applies when `allowTakaful` is false, which is the default.

**Warnings for human review:** percentages and RM amounts (verify the source), absolute claims, stock AI phrases, dashes in prose, and lines that sound like a personal story.

## Instagram notes

- **Safe margins** (`src/brand.ts`): top 270, bottom 500, left 96, right 160 px. Text stays clear of the Reels header, the action buttons and the caption area.
- **Cover:** the key content sits inside the centre 1080×1350 area, so it survives the 4:5 profile-grid crop.
- **AI labels:** these videos are motion graphics from your own text, with no synthetic people or voices. If you add AI-generated images or audio, check Meta's "AI info" labelling before posting.
- **Approval:** check whether your company needs to approve the material before posting.

## Environment notes

- Requires Node 18+ and ffmpeg/ffprobe on PATH.
- Remotion normally downloads its own headless Chrome from `remotion.media`. If that host is unreachable, the CLI says so and falls back to a locally installed Chrome Headless Shell. You can also set `REMOTION_BROWSER=/path/to/chrome`.
- **Remotion licence:** Remotion is free for individuals and companies of up to 3 people. Larger companies need a company licence. See https://www.remotion.dev/docs/license. If you have a key, set `REMOTION_LICENSE_KEY`. Without one, renders print a reminder.
- The official Remotion agent skills are installed in `.claude/skills/` (from `remotion-dev/skills`, pinned in `skills-lock.json`).

## Layout

```
briefs/            input briefs (JSON) and briefs/media/ for your photos, voiceovers, music
exports/<slug>/    everything generated for one reel (preview/, final/)
public/fonts/      Playfair Display + DM Sans (OFL), copied from @fontsource on install
public/media/      per-reel copies of your media (generated, git-ignored)
scripts/reel.mjs   the CLI;  scripts/lib/ schema, lint, storyboard timing, outputs, media, render
src/               Remotion compositions: Reel (video) and Cover (still)
```
