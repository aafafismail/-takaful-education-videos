"""Generates public/audio/ambient-pad.mp3 — a soft, original ambient pad.
Made from scratch with numpy (no samples), so it is free to use anywhere.
Usage: python3 scripts/make-music.py  (needs numpy + ffmpeg)"""
import numpy as np, subprocess, wave, os

SR = 44100
DUR = 84.0
CHORD_LEN = 8.0
# Calm progression (Dmaj9 – Bm9 – Gmaj9 – Asus), frequencies in Hz
CHORDS = [
    [146.83, 220.00, 277.18, 329.63, 369.99],
    [123.47, 185.00, 220.00, 293.66, 277.18],
    [98.00, 196.00, 246.94, 293.66, 220.00],
    [110.00, 220.00, 293.66, 329.63, 246.94],
]
t = np.arange(int(SR * DUR)) / SR
out = np.zeros((len(t), 2))
n_chords = int(np.ceil(DUR / CHORD_LEN)) + 1
for k in range(n_chords):
    start = k * CHORD_LEN - 1.5
    seg = (t >= start) & (t < start + CHORD_LEN + 3)
    tt = t[seg] - start
    env = np.minimum(1, tt / 2.5) * np.minimum(1, np.maximum(0, (CHORD_LEN + 3 - tt) / 3.0))
    for j, f in enumerate(CHORDS[k % 4]):
        det = 0.0015 * (j + 1)
        for side, d in ((0, -det), (1, det)):
            ph = 2 * np.pi * f * (1 + d) * tt
            tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
            trem = 1 + 0.08 * np.sin(2 * np.pi * (0.13 + 0.03 * j) * tt + j)
            out[seg, side] += tone * env * trem * (0.16 / (1 + 0.25 * j))
# simple feedback-delay "room"
for delay, g in ((0.31, 0.32), (0.53, 0.22), (0.89, 0.14)):
    d = int(delay * SR)
    out[d:, 0] += g * out[:-d, 1]
    out[d:, 1] += g * out[:-d, 0]
# soft low-pass (moving average)
k = 9
kern = np.ones(k) / k
for c in range(2):
    out[:, c] = np.convolve(out[:, c], kern, mode='same')
# global fade in/out and normalise
fade = np.minimum(1, t / 3) * np.minimum(1, (DUR - t) / 5)
out *= fade[:, None]
out /= np.max(np.abs(out)) / 0.6
os.makedirs('public/audio', exist_ok=True)
wav = 'public/audio/_pad.wav'
with wave.open(wav, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-b:a', '160k', 'public/audio/ambient-pad.mp3'], check=True)
os.remove(wav)
print('wrote public/audio/ambient-pad.mp3')
