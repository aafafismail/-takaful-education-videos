"""Renders the 15-second UGC cinematic edit "Same face. Different moments."
from the 15 storyboard panels in public/storyboard-ugc/ (p01.png … p15.png).

One cut per second, following the storyboard:
  0-1 medium shot · 1-2 zoom in · 2-3 pan right · 3-4 zoom out · 4-5 light leak
  5-6 doodle heart · 6-7 scarf detail · 7-8 look up (tilt) · 8-9 back view
  9-10 zoom in · 10-11 foreground blur · 11-12 pan left · 12-13 shadow play
  13-14 hold · 14-15 end frame

Output: end-project/ugc-storyboard/same-face-different-moments.mp4 (1080x1920, 30 fps)
Usage:  python3 scripts/make-ugc-storyboard.py   (needs numpy, Pillow, ffmpeg)
To use real footage stills later, replace pNN.png with a sharper image of the same framing.
"""
import math, os, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "storyboard-ugc")
FONT = os.path.join(ROOT, "public", "fonts", "GreatVibes-Regular.woff")
OUT_DIR = os.path.join(ROOT, "end-project", "ugc-storyboard")
OUT = os.path.join(OUT_DIR, "same-face-different-moments.mp4")
W, H, FPS, SHOT = 1080, 1920, 30, 30          # 30 frames = 1 s per cut
N = 15 * SHOT
rng = np.random.default_rng(7)


def ease(t):  # ease-in-out sine, clamped
    t = min(max(t, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * t)


def lerp(a, b, t):
    return a + (b - a) * t


# ---------- load and upscale panels once ----------
MARGIN = 1.45
panels = []
for i in range(1, 16):
    im = Image.open(os.path.join(SRC, f"p{i:02d}.png")).convert("RGB")
    pw, ph = im.size
    cover = max(W / pw, H / ph)
    s = cover * MARGIN
    big = im.resize((round(pw * 2), round(ph * 2)), Image.LANCZOS)
    big = big.resize((round(pw * s), round(ph * s)), Image.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(radius=4, percent=70, threshold=2))
    panels.append(dict(img=big, pw=pw, ph=ph, cover=cover, s=s))


def camera(idx, z, cx, cy, rot=0.0):
    """Frame of panel idx at zoom z (1 = fills screen), centre (cx, cy) in 0..1."""
    p = panels[idx]
    vw = W / (p["cover"] * z) / p["pw"]   # visible fraction of panel width
    vh = H / (p["cover"] * z) / p["ph"]
    cx = min(max(cx, vw / 2), 1 - vw / 2)
    cy = min(max(cy, vh / 2), 1 - vh / 2)
    bw, bh = p["img"].size
    box = ((cx - vw / 2) * bw, (cy - vh / 2) * bh, (cx + vw / 2) * bw, (cy + vh / 2) * bh)
    fr = p["img"].resize((W, H), Image.BICUBIC, box=box)
    if rot:
        fr = fr.rotate(rot, resample=Image.BICUBIC, expand=False)
    return np.asarray(fr).astype(np.float32)


# ---------- per-shot camera moves (t runs 0..1 over the shot, may overshoot for transitions) ----------
def shot(idx, t):
    e = ease(t)
    if idx == 0:  return camera(0, lerp(1.00, 1.07, e), 0.5, 0.45)                 # medium
    if idx == 1:  return camera(1, lerp(1.06, 1.18, e), 0.47, 0.45)                # zoom in close-up
    if idx == 2:  return camera(2, 1.10, lerp(0.34, 0.66, e), 0.48)                # pan right
    if idx == 3:  return camera(3, lerp(1.40, 1.00, ease(t * 1.1)), 0.5, 0.42)     # zoom out
    if idx == 4:  return camera(4, lerp(1.03, 1.10, e), 0.5, 0.45)                 # light/leaf overlay
    if idx == 5:  return camera(5, lerp(1.00, 1.04, e), 0.40, 0.5)                 # doodle heart (keep heart in frame)
    if idx == 6:  return camera(6, lerp(1.12, 1.20, e), 0.5, lerp(0.42, 0.58, e))  # scarf detail, slow tilt down
    if idx == 7:  return camera(7, lerp(1.16, 1.10, e), 0.52, lerp(0.56, 0.46, e), rot=lerp(-2.5, 0.0, e))  # look up
    if idx == 8:  return camera(8, lerp(1.02, 1.08, e), 0.55, 0.45)                # back view
    if idx == 9:  return camera(9, lerp(1.00, 1.13, e), 0.5, 0.45)                 # zoom in close-up
    if idx == 10: return camera(10, lerp(1.10, 1.04, e), lerp(0.44, 0.56, e), 0.5) # foreground blur drift
    if idx == 11: return camera(11, 1.10, lerp(0.66, 0.36, e), 0.48)               # slow pan left
    if idx == 12: return camera(12, lerp(1.08, 1.15, e), 0.5, 0.5)                 # shadow play
    if idx == 13: return camera(13, lerp(1.00, 1.02, e), 0.5, 0.45)               # hold
    return camera(14, lerp(1.00, 1.03, e), 0.58, 0.45)                             # end frame


# ---------- overlays ----------
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
vignette = 1 - 0.38 * np.clip(((xx - W / 2) / (W * 0.72)) ** 2 + ((yy - H / 2) / (H * 0.62)) ** 2, 0, 1) ** 1.4
vignette = vignette[..., None]


def light_leak(t, strength=1.0):
    """Warm moving glow (screen blend layer), 0..255."""
    cx = lerp(-0.1, 1.1, t) * W
    cy = lerp(0.15, 0.45, t) * H
    d = ((xx - cx) / (W * 0.55)) ** 2 + ((yy - cy) / (H * 0.45)) ** 2
    g = np.exp(-d * 1.6)[..., None] * strength
    return g * np.array([255, 170, 80], np.float32)


def screen(a, b):
    return 255 - (255 - a) * (255 - b) / 255


# dappled leaf shadow for shot 13: smooth noise upscaled
_leaf = Image.fromarray((rng.random((14, 9)) * 255).astype(np.uint8)).resize((W * 2, H), Image.BICUBIC)
_leaf = np.asarray(_leaf.filter(ImageFilter.GaussianBlur(40))).astype(np.float32) / 255


def leaf_shadow(t):
    off = int(lerp(0, W * 0.6, t))
    m = _leaf[:, off:off + W]
    m = np.clip((m - 0.35) * 2.2, 0, 1)
    return (0.72 + 0.28 * m)[..., None]


def dir_blur(fr, amount, axis=1):
    """Cheap directional (whip) blur: average shifted copies."""
    if amount < 1:
        return fr
    k = 9
    acc = np.zeros_like(fr)
    for j in range(k):
        acc += np.roll(fr, int((j - k // 2) * amount / k), axis=axis)
    return acc / k


def zoom_blur(fr, amount):
    if amount <= 0.002:
        return fr
    im = Image.fromarray(np.clip(fr, 0, 255).astype(np.uint8))
    acc = fr.copy()
    for j in range(1, 5):
        z = 1 + amount * j / 4
        cw, ch = W / z, H / z
        acc += np.asarray(im.resize((W, H), Image.BILINEAR,
                                    box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2))).astype(np.float32)
    return acc / 5


def grade(fr, f):
    x = fr / 255.0
    x = x * x * (3 - 2 * x) * 0.35 + x * 0.65                   # gentle S-curve
    lum = (0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2])[..., None]
    x = lum + (x - lum) * 0.92                                   # slightly muted colour
    sh = np.clip(1 - lum * 2.2, 0, 1)
    hi = np.clip(lum * 1.6 - 0.6, 0, 1)
    x = x + sh * np.array([-0.012, 0.010, 0.022]) + hi * np.array([0.025, 0.010, -0.018])  # teal shadows, warm highs
    x = x * 0.975 + 0.018                                        # soft film blacks
    x = x * 255 * vignette
    g = rng.normal(0, 3.8, (H // 2, W // 2)).astype(np.float32)  # film grain
    g = np.repeat(np.repeat(g, 2, 0), 2, 1)[..., None]
    return x + g


# ---------- text ----------
font_title = ImageFont.truetype(FONT, 112)


def text_layer(text, font, y, alpha):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    tw = d.textlength(text, font=font)
    x = (W - tw) / 2
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x, y + 4), text, font=font, fill=(0, 0, 0, int(230 * alpha)))
    sh = sh.filter(ImageFilter.GaussianBlur(7))
    d.text((x, y), text, font=font, fill=(255, 250, 242, int(255 * alpha)))
    return Image.alpha_composite(sh, lay)


def overlay(fr, layer):
    a = np.asarray(layer).astype(np.float32)
    al = a[..., 3:4] / 255
    return fr * (1 - al) + a[..., :3] * al


# ---------- transitions at cut k (between shot k-1 and k), in frames ----------
TRANS = {1: ("zoom", 4), 2: ("whip_r", 4), 4: ("flash_warm", 5), 9: ("flash", 4),
         11: ("whip_l", 4), 12: ("dissolve", 6), 14: ("dissolve", 8)}


def frame(f):
    k, lf = divmod(f, SHOT)
    t = (lf + 0.5) / SHOT
    fr = shot(k, t)

    # shot-specific effects
    if k == 4:
        fr = screen(fr, light_leak(t, 0.55))
        soft = np.asarray(Image.fromarray(np.clip(fr, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))).astype(np.float32)
        fr = screen(fr * 0.85, soft * 0.35)                      # dreamy bloom
    if k == 8:
        fr = screen(fr, light_leak(0.9, 0.18 + 0.06 * math.sin(t * 6)))
    if k == 12:
        fr = fr * leaf_shadow(t) * 1.12

    # transitions
    for cut, (kind, n) in TRANS.items():
        start = cut * SHOT
        d = f - start                                            # frames from the cut
        if -n <= d < n:
            p = (d + n) / (2 * n)                                # 0..1 across the transition
            if kind == "zoom":
                fr = zoom_blur(fr, 0.12 * (1 - abs(p * 2 - 1)))
            elif kind in ("whip_r", "whip_l"):
                amt = 260 * (1 - abs(p * 2 - 1))
                fr = dir_blur(fr, amt)
            elif kind == "flash":
                fr = fr + (255 - fr) * (1 - abs(p * 2 - 1)) ** 1.5 * 0.85
            elif kind == "flash_warm":
                fr = screen(fr, light_leak(p, 1.4 * (1 - abs(p * 2 - 1))))
            elif kind == "dissolve" and d < 0:
                pass
            elif kind == "dissolve":
                prev = shot(cut - 1, 1 + (d + 0.5) / SHOT)
                a = ease((d + 1) / n)
                fr = prev * (1 - a) + fr * a

    fr = grade(fr, f)

    # opening title over the first shot
    if f < SHOT + 6:
        tsec = f / FPS
        a = min(1, max(0, (tsec - 0.08) / 0.25)) * min(1, max(0, (1.2 - tsec) / 0.25))
        if a > 0:
            band = np.clip((yy[..., None] - 1150) / 350, 0, 1) * np.clip((1750 - yy[..., None]) / 200, 0, 1)
            fr = fr * (1 - 0.45 * a * band)                      # soft dark band so the title reads
            fr = overlay(fr, text_layer("Same face.", font_title, 1290, a))
            fr = overlay(fr, text_layer("Different moments.", font_title, 1410, a))

    # fade in from black, fade out at the end
    if f < 4:
        fr = fr * (f + 1) / 5
    if f >= N - 10:
        fr = fr * (N - f) / 11
    return np.clip(fr, 0, 255).astype(np.uint8)


# ---------- music: soft 120 bpm beat with a kick on every cut ----------
def make_music(path):
    sr, dur = 44100, 15.0
    t = np.arange(int(sr * dur)) / sr
    out = np.zeros((len(t), 2))
    chords = [[146.83, 220.0, 277.18, 369.99], [123.47, 185.0, 293.66, 277.18],
              [98.0, 196.0, 246.94, 293.66], [110.0, 220.0, 329.63, 277.18]]
    for c in range(4):
        s0 = c * 4.0
        seg = (t >= s0) & (t < s0 + 4.6)
        tt = t[seg] - s0
        env = np.minimum(1, tt / 0.6) * np.clip((4.6 - tt) / 0.8, 0, 1)
        for j, fq in enumerate(chords[c]):
            for side, det in ((0, -0.002), (1, 0.002)):
                ph = 2 * np.pi * fq * (1 + det) * tt
                out[seg, side] += (np.sin(ph) + 0.2 * np.sin(2 * ph)) * env * 0.07
    noise = np.random.default_rng(3).standard_normal(len(t))
    for b in range(30):                                          # beats every 0.5 s
        s0 = b * 0.5
        i0 = int(s0 * sr)
        if b % 2 == 0 and b > 0:                                 # kick on each cut
            n = int(0.35 * sr)
            tt = np.arange(n) / sr
            kick = np.sin(2 * np.pi * (48 * tt + 70 * (1 - np.exp(-tt * 30)) / 30)) * np.exp(-tt * 9) * 0.55
            out[i0:i0 + n] += kick[: len(out) - i0, None]
        n = int(0.06 * sr)                                       # soft hat on every beat
        hat = np.diff(noise[i0:i0 + n + 1]) * np.exp(-np.arange(n) / sr * 70) * (0.05 if b % 2 else 0.03)
        out[i0:i0 + len(hat)] += hat[:, None]
    for cut in (2, 11):                                          # whooshes on the whip pans
        s0, n = cut - 0.25, int(0.5 * sr)
        i0 = int(s0 * sr)
        tt = np.arange(n) / n
        w = np.convolve(noise[i0:i0 + n], np.ones(12) / 12, "same") * np.sin(np.pi * tt) ** 2 * 0.35
        out[i0:i0 + n, 0] += w * (1 - tt if cut == 2 else tt)
        out[i0:i0 + n, 1] += w * (tt if cut == 2 else 1 - tt)
    for s0 in (5.0, 8.0, 14.0):                                  # shimmer on heart, sun, end text
        n = int(1.2 * sr)
        tt = np.arange(n) / sr
        i0 = int(s0 * sr)
        sh = sum(np.sin(2 * np.pi * fq * tt) for fq in (1760, 2217, 2637)) * np.exp(-tt * 3.5) * 0.03
        out[i0:i0 + n] += sh[: len(out) - i0, None]
    out[: int(0.3 * sr)] *= np.linspace(0, 1, int(0.3 * sr))[:, None]
    out[-int(1.0 * sr):] *= np.linspace(1, 0, int(1.0 * sr))[:, None]
    out = out / np.abs(out).max() * 0.85
    with wave.open(path, "wb") as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr)
        wf.writeframes((out * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    wav = os.path.join(OUT_DIR, "_music.wav")
    make_music(wav)
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", wav, "-c:v", "libx264", "-preset", "slow", "-crf", "20",
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(N):
        proc.stdin.write(frame(f).tobytes())
        if f % 30 == 0:
            print(f"frame {f}/{N}", flush=True)
    proc.stdin.close()
    proc.wait()
    os.remove(wav)
    print("wrote", OUT)
