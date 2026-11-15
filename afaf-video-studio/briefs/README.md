# Briefs

One JSON file per reel. Copy `_template.json`, fill it in, then run:

```bash
npm run reel -- make briefs/<your-file>.json
```

## Optional media (put files in `briefs/media/`)

Portrait photo or clip (your own, real footage only):

```json
"portrait": {"path": "briefs/media/afaf.jpg", "focus": "50% 30%", "useIn": ["hook", "closing", "cover"], "consent": true}
```

Real recorded voiceover (no voice clones). Add an SRT exported from your editor for accurate captions:

```json
"voiceover": {"path": "briefs/media/vo.m4a", "srt": "briefs/media/vo.srt", "realRecording": true}
```

Music: `"none"`, `"generated"` (original pad made by the script), or a track you hold a licence for:

```json
"music": {"path": "briefs/media/track.mp3", "volume": 0.2, "license": "Where it came from and the licence terms"}
```

Fields you can leave out: `tipFigure` (auto-detected from "15 minit" etc.), `tipItems`, `reinforce`, `kickers`, `narration` (defaults to the on-screen text), `caption` (built from the brief), `hashtags`, `cover`.
