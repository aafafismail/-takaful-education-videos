# SPEC — "Kena stop latte ke kalau nak mula takaful?" (HyperFrames redo)

GOAL:    The viewer smiles at her coffee maths and leaves thinking "I don't have to give up everything — I can make room for protection," then replies SEMAK.
OUTPUT:  HyperFrames, 1080 × 1920, 30 fps, 68 s.
TIME:    68 s × 30 = 2040 frames. No music (no licensed source available here); sound effects only, on visible actions.

LOOK:    Her painterly illustrations are the world, full-bleed, ungraded.
         The numbers live on PAPER FROM HER DAY, never on floating cards:
         - Café receipt: thermal paper #F7F2E7, ink #2B2622, Space Mono 700, 34 px lines, 46 px leading,
           torn zig-zag bottom (14 px teeth), shadow 0 18px 28px rgba(45,25,8,.38), prints downward line by line.
         - Notebook page: #FBF6EA, blue rules #BFD0E6 every 64 px, red margin #E5A6A0 at x=96,
           ballpoint ink #1E3A8A in Caveat 700 (60–86 px), written left→right by a wipe; tilted −3°.
         - Loyalty stamp card: kraft #E9D3AE, 8 circles Ø150 in a 4×2 grid, each stamped with the cup illustration.
         - Wall calendar: #FFFDF8 sheet, header #C2410C, 30 day cells, 8 days marked with a coffee ring #7A4A22 @ 75%.
         Display type (hook, end card): Archivo Black, white #FFFFFF, 84–96 px, tracking −1%, one keyword in #FFC93C.
         Captions: Montserrat 800, 44 px, white, keywords #FFC93C, scrim rgba(24,12,4,.42) sized to text, radius 16.
         Accent #FFC93C appears only on: caption keywords, the payoff figure on paper (highlighter swipe), end-card line 2.

OBJECTS: latte cup (from the illustration), receipt, notebook page, loyalty card, calendar, kettle & mug (illustration), two cups, budget page with "Perlindungan RM100 ✓".

LAYOUT:  Platform band 168–1330 px. Faces stay clear (all faces sit between y 330 and 900).
         Paper objects live in y 820–1170. Captions sit at y 1190–1325. Nothing readable under 1330 or right of x 960.

MOTION:  enter = expo.out 0.5–0.7 s; paper settle = spring damping 0.75 (back.out(1.2)); exit = power3.in 0.3 s;
         camera = power2.inOut, 1.04 → 1.12 scale per shot; punch-ins = hard cut to 1.3×.
         Receipt prints at 0.18 s per line; handwriting wipes at ~14 characters/s; stamps press 1.25 → 1 in 0.18 s.

SHOTS:
  0.0–3.4   S1 café medium, slow push. Hook types in per word (blur 6→0, 0.07 s apart) in y 1150–1320. Frame 0 already shows her + first word.
  3.4–8.0   S1 punch-in on cup + face. Captions start. Steam is in the painting. Exit: zoom through the cup (2.4× in 0.45 s, power3.in) → S2.
  8.0–20.0  S2 home at the table. Notebook page slides up from bottom (spring), handwriting: "RM100 / bulan" → "÷ 30" → "≈ RM3.33 sehari" (highlighter swipe). Small print note under it. Exit: whip left.
  20.0–24.4 S3 café counter wide. Receipt prints from top-right: "LATTE ........ RM13.00".
  24.4–29.0 S3 punch-in, loyalty card slides in; 8 cups stamped 0.42 s apart (pop each); receipt total "8 × RM13 = RM104".
  29.0–33.0 calendar drops in over S3; 8 coffee rings stamp; handwritten "Bukan stop semua. Kurangkan 8 pembelian." Exit: blur swap.
  33.0–46.0 S4 kitchen pour; punch-in at 37.6. Notebook note: "Kos ilustrasi" stamp, "Kopi rumah ≈ RM3", "RM13 − RM3 = jimat RM10", "10 kali tukar = RM100". Exit: whip right.
  46.0–53.0 S5 two cups. Receipt tags at the cups: "LATTE RM13.00", "AMERICANO RM9.50"; then torn receipt strip "BEZA RM3.50". Caption "Coffee maths pula 😂".
  53.0–57.2 S6a budget page: ruled list, last line written "Perlindungan RM100 ✓" with highlighter + chime.
  57.2–68.0 S6b family on the sofa, slow pull-out. End card types in at 60.6: "Tak perlu cut semua." / "Beri ruang untuk perlindungan." CTA receipt stub "Reply 'SEMAK'" + "AFAF ISMAIL". Holds ≥ 4 s.

SOUND:   key-press ticks on receipt lines (rotate volume 0.25–0.35); pop on each stamp; whoosh / whoosh-short alternating on whips and the zoom-through; click-soft on paper landing; chime once on "Perlindungan RM100 ✓". All Pixabay licence (commercial OK).

BANNED:  dark glass cards; glow, bloom, particles, light leaks; dark navy void; pill chips as decoration; three cards in a row;
         everything fading and sliding up; text moving while read; logo in a corner; CSS filters on the illustrations; emoji fonts (Twemoji image instead).

QA:      t=0.0 hook word on frame 0 · 6.0 punch-in face+cup clear · 13.5 notebook "≈ RM3.33 sehari" readable · 27.5 card 6–8 stamps ·
         31.5 calendar 8 rings + handwritten line · 44.0 "10 kali tukar = RM100" · 50.5 three receipt tags · 55.5 "Perlindungan RM100 ✓" · 66.0 end card.
