# Set up this project on your laptop

On a laptop nothing is blocked, so yt-dlp (downloading reference reels) and free transcription work too.

## 1. Install once
- **Node.js 22+**: https://nodejs.org (LTS installer)
- **Git**: https://git-scm.com
- **FFmpeg**: Mac `brew install ffmpeg` · Windows `winget install ffmpeg`
- **Claude Code**: https://claude.com/claude-code

## 2. Get this repo
```bash
git clone https://github.com/aafafismail/-takaful-education-videos.git
cd -takaful-education-videos
git checkout claude/healing-hari-ini-video
npm install
claude
```

## 3. Ask Claude
- HyperFrames video: *"Buka projects/latte-hyperframes dan preview"*, which runs `npx hyperframes preview` and opens the live editor in your browser.
- Remotion videos: *"npm run studio"*.
- New video: *"Start new project: hibah. Reference ada dalam reference/hibah/."*

## Folders
- `reference/`: inspiration and b-roll, one folder per video
- `projects/`: each video's working files (HyperFrames projects live here)
- `end-project/`: finished MP4s
