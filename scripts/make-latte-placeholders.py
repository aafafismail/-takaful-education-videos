"""Creates labelled placeholders for missing latte-video images in public/latte/.
Your real illustrations (same file names) replace them. Usage: python3 scripts/make-latte-placeholders.py"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'latte')
os.makedirs(OUT, exist_ok=True)
SCENES = {
    'scene1-cafe': 'SCENE 1 · Café, collecting latte',
    'scene2-budget': 'SCENE 2 · Home budget, phone + notebook',
    'scene3-counter': 'SCENE 3 · Café counter, latte menu',
    'scene4-kitchen': 'SCENE 4 · Making coffee at home',
    'scene5-two-cups': 'SCENE 5 · Latte vs americano',
    'scene6-family': 'SCENE 6 · Calm moment with her child',
}
try:
    big = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 64)
    small = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 40)
except OSError:
    big = small = ImageFont.load_default()

def gradient(w, h, top, bottom):
    img = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[k] + (bottom[k] - top[k]) * t) for k in range(3)))
    return img

for i, (name, label) in enumerate(SCENES.items()):
    path = os.path.join(OUT, name + '.jpg')
    if os.path.exists(path):
        continue
    img = gradient(1080, 1920, (48, 30, 20), (196, 132, 74))
    glow = Image.new('L', (1080, 1920), 0)
    ImageDraw.Draw(glow).ellipse([240, 760, 840, 1360], fill=230)
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    img = Image.composite(Image.new('RGB', (1080, 1920), (255, 214, 150)), img, glow.point(lambda v: int(v * 0.5)))
    d = ImageDraw.Draw(img)
    d.text((540, 900), label.split(' · ')[0], font=big, fill=(255, 244, 226), anchor='mm')
    d.text((540, 990), label.split(' · ')[1], font=small, fill=(255, 236, 205), anchor='mm')
    d.text((540, 1060), 'placeholder — upload illustration', font=small, fill=(255, 226, 190), anchor='mm')
    img.save(path, quality=88)
    print('placeholder', path)

cup = os.path.join(OUT, 'cup.png')
if not os.path.exists(cup):
    img = gradient(600, 600, (90, 58, 36), (205, 150, 96))
    d = ImageDraw.Draw(img)
    d.text((300, 280), 'CUP', font=big, fill=(255, 244, 226), anchor='mm')
    d.text((300, 350), 'placeholder', font=small, fill=(255, 236, 205), anchor='mm')
    img.save(cup)
    print('placeholder', cup)
