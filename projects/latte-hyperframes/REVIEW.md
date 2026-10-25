# REVIEW — latte & takaful (HyperFrames redo)

## Creative calls
- Kept the person's storyboard, first-person narration and all numbers; only the visual treatment changed.
- New look: the numbers live on paper objects from her day (thermal receipt, notebook page, coffee loyalty stamp card, wall calendar with coffee rings, yellow sticky note, receipt CTA stub) instead of floating glass cards.
- Transitions, each with a cause: zoom through the latte cup (S1→S2), whip pans (S2→S3, S4→S5), blur swap (S3→S4), dip cut (S5→S6), iris from the ✓ tick onto the family (S6a→S6b). Punch-ins inside shots.
- Sound: Pixabay-licensed effects on visible actions only (receipt ticks, stamp pops, page clicks, whooshes on whips, one chime on "Perlindungan RM100 ✓"). No music bed: no licensed music source is available in this environment.

## Measured vs looked at
- `hyperframes check`: 0 errors. Craft audit: 0 findings over 544 samples.
- Looked at snapshots at 0, 2, 6, 13.5, 17, 22, 27.5, 31.8, 40, 44, 48, 50.5, 55.5, 57.4, 66 s.
- Sound was placed by time, not heard.

## Warnings kept on purpose
- `negative_z_index` on the highlighter swipe: its parent has `isolation: isolate`, so it paints correctly (seen in snapshots).
- `container_overflow` (info) on the camera wrappers: intended — the camera crops the illustration.

## Weakest shot / next time
- Calendar shot (29–33 s) is busy; with more time, drop the receipt total earlier so only the calendar holds.
- Illustrations are 941×1672 upscaled; punch-ins are slightly soft. Larger source images would sharpen them.
