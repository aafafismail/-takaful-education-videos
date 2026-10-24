"""Creates soft gradient placeholder images for any missing scene in public/scenes.
Real images (s01.jpg … s20.jpg) simply replace them. Usage: python3 scripts/make-placeholders.py"""
import os, re
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'scenes')
os.makedirs(OUT, exist_ok=True)
cfg = open(os.path.join(ROOT, 'src', 'config.ts'), encoding='utf-8').read()
files = sorted(set(re.findall(r"file: '(s\d+)'", cfg)))
LABELS = {
    's01': 'Aina + phone, salary in', 's02': 'Mall, shopping bags', 's03': '4 full jars, 1 empty jar',
    's04': 'Aerial Malaysia, golden thread', 's05': 'Sofa at night, thinking', 's06': 'Beach with friends',
    's07': 'Long road, tiny shield far away', 's08': 'Teh tarik at mamak', 's09': 'Budget at kitchen table',
    's10': 'Hands laying foundation', 's11': 'Malay house on foundation', 's12': 'Coin stacks + notebook',
    's13': 'Ringgit notes + envelope', 's14': 'Café with advisor', 's16': 'Family on porch',
    's17': 'Kind neighbours', 's18': 'Writing checklist', 's19': 'Window at sunrise', 's20': 'Paddy field sunrise',
}
PALETTES = [((24, 32, 64), (214, 140, 70)), ((30, 44, 78), (240, 180, 90)), ((44, 30, 50), (230, 120, 80)),
            ((20, 46, 60), (220, 170, 100)), ((36, 28, 60), (250, 160, 110))]
try:
    font_big = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 150)
    font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 46)
except OSError:
    font_big = font = ImageFont.load_default()
for i, name in enumerate(files):
    path = os.path.join(OUT, name + '.jpg')
    if os.path.exists(path):
        continue
    top, bottom = PALETTES[i % len(PALETTES)]
    img = Image.new('RGB', (1080, 1920))
    d = ImageDraw.Draw(img)
    for y in range(1920):
        t = (y / 1919) ** 1.3
        d.line([(0, y), (1080, y)], fill=tuple(int(top[k] + (bottom[k] - top[k]) * t) for k in range(3)))
    glow = Image.new('L', (1080, 1920), 0)
    ImageDraw.Draw(glow).ellipse([200 + (i * 97) % 400, 900, 900 + (i * 53) % 200, 1600], fill=200)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img = Image.composite(Image.new('RGB', (1080, 1920), (255, 214, 140)), img, glow.point(lambda v: int(v * 0.55)))
    d = ImageDraw.Draw(img)
    d.text((540, 820), name.upper(), font=font_big, fill=(255, 246, 230), anchor='mm')
    d.text((540, 960), LABELS.get(name, ''), font=font, fill=(255, 236, 200), anchor='mm')
    d.text((540, 1030), 'placeholder', font=font, fill=(255, 236, 200, 120), anchor='mm')
    img.save(path, quality=88)
    print('placeholder', path)
