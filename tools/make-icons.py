"""Buat ikon PWA untuk 한국어 문법 memakai huruf 한 (Malgun Gothic).
Jalankan: python tools/make-icons.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "icons")
os.makedirs(OUT, exist_ok=True)

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\malgunbd.ttf",
    r"C:\Windows\Fonts\malgun.ttf",
    r"C:\Windows\Fonts\NanumGothic.ttf",
    "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc",
]

BG_TOP = (226, 76, 106)
BG_BOTTOM = (176, 46, 92)
GLYPH = "\uD55C"  # 한


def font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def linear_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        img.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img.resize((w, h))


def make(size, glyph_ratio=0.58, rounded=True, bg_inset=0):
    ss = 4  # supersampling
    canvas = size * ss
    img = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))

    grad = linear_gradient((canvas, canvas), BG_TOP, BG_BOTTOM).convert("RGBA")

    if rounded:
        mask = Image.new("L", (canvas, canvas), 0)
        d = ImageDraw.Draw(mask)
        d.rounded_rectangle([0, 0, canvas - 1, canvas - 1], radius=int(canvas * 0.22), fill=255)
        img.paste(grad, (0, 0), mask)
    else:
        d = ImageDraw.Draw(img)
        inset = int(canvas * bg_inset)
        d.rounded_rectangle([inset, inset, canvas - inset - 1, canvas - inset - 1],
                            radius=int(canvas * 0.18), fill=(0, 0, 0, 0))
        img.paste(grad, (0, 0))

    draw = ImageDraw.Draw(img)
    f = font(int(canvas * glyph_ratio))
    bbox = draw.textbbox((0, 0), GLYPH, font=f)
    gw, gh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (canvas - gw) / 2 - bbox[0]
    y = (canvas - gh) / 2 - bbox[1] - canvas * 0.01
    draw.text((x, y), GLYPH, font=f, fill=(255, 255, 255, 255))

    return img.resize((size, size), Image.LANCZOS)


def save(img, name):
    path = os.path.join(OUT, name)
    img.save(path, "PNG", optimize=True)
    print("  " + name + "  " + str(img.size))


if __name__ == "__main__":
    print("Membuat ikon di", OUT)
    save(make(192), "icon-192.png")
    save(make(512), "icon-512.png")
    # maskable: glyph lebih kecil, latar penuh tanpa sudut membulat
    maskable = make(512, glyph_ratio=0.44, rounded=False)
    save(maskable, "icon-maskable-512.png")
    save(make(180), "apple-touch-icon.png")
    save(make(32), "favicon-32.png")
    print("Selesai.")
