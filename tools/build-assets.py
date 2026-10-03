import math
import os
import urllib.request

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
os.makedirs(IMG, exist_ok=True)

BG = (11, 15, 20)
BG2 = (14, 20, 28)
ACCENT = (56, 189, 248)
ACCENT2 = (167, 139, 250)
ACCENT3 = (52, 211, 153)
TEXT = (232, 238, 245)
MUTED = (147, 161, 181)


def font(size, bold=False, mono=False):
    if mono:
        names = ["consolab.ttf", "cour.ttf", "segoeui.ttf"]
    else:
        names = ["segoeuib.ttf", "segoeui.ttf", "arialbd.ttf", "arial.ttf"] if bold else [
            "segoeui.ttf",
            "arial.ttf",
        ]
    for n in names:
        p = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", n)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def aurora_bg(w, h):
    img = Image.new("RGB", (w, h), BG)
    px = img.load()
    blobs = [
        (0.78, 0.02, 0.62, ACCENT2, 0.55),
        (0.08, 0.18, 0.55, ACCENT, 0.45),
        (0.62, 0.95, 0.50, ACCENT3, 0.30),
    ]
    cx_max, cy_max = w, h
    for bx, by, br, col, strength in blobs:
        cx, cy, r = bx * cx_max, by * cy_max, br * max(w, h)
        rad2 = r * r
        for y in range(h):
            dy2 = (y - cy) ** 2
            if dy2 > rad2:
                continue
            for x in range(0, w, 2):
                dx2 = (x - cx) ** 2
                if dx2 + dy2 > rad2:
                    continue
                t = 1 - math.sqrt(dx2 + dy2) / r
                t = t ** 2 * strength
                for xx in (x, min(x + 1, w - 1)):
                    c = px[xx, y]
                    px[xx, y] = lerp(c, col, min(t, 1))
    return img.filter(ImageFilter.GaussianBlur(28))


def grid(img, step=48, alpha=16):
    d = ImageDraw.Draw(img, "RGBA")
    w, h = img.size
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=(255, 255, 255, alpha))
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=(255, 255, 255, alpha))


def rounded(size, radius):
    m = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1], radius=radius * 4, fill=255)
    return m.resize((size, size), Image.LANCZOS)


def gradient_square(size, radius):
    img = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(img)
    for i in range(size * 4):
        t = i / (size * 4 - 1)
        d.line([(0, i), (size, i)], fill=lerp(ACCENT, ACCENT2, t))
    mask = rounded(size, radius)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def make_icons():
    for size in (180, 192, 512):
        g = gradient_square(size, max(8, size // 6))
        d = ImageDraw.Draw(g)
        f = font(int(size * 0.40), bold=True)
        txt = "AG"
        box = d.textbbox((0, 0), txt, font=f)
        d.text(
            ((size - (box[2] - box[0])) / 2 - box[0], (size - (box[3] - box[1])) / 2 - box[1]),
            txt,
            font=f,
            fill=(4, 18, 29, 255),
        )
        g.save(os.path.join(IMG, "icon-%d.png" % size))
    print("icons done")


def make_og():
    w, h = 1200, 630
    img = aurora_bg(w, h)
    grid(img, 48, 14)
    d = ImageDraw.Draw(img, "RGBA")

    d.rounded_rectangle([64, 64, 232, 232], radius=44, fill=(*ACCENT, 255))
    f_mark = font(56, bold=True)
    d.text((96, 108), "AG", font=f_mark, fill=(4, 18, 29, 255))

    f_name = font(88, bold=True)
    d.text((64, 300), "Ahmad Golbooee", font=f_name, fill=(*TEXT, 255))

    f_role = font(36)
    d.text((66, 412), "Software Developer", font=f_role, fill=(*ACCENT, 255))
    d.text((66, 462), "Physics Student  ·  Isfahan University of Technology", font=font(28), fill=(*MUTED, 255))

    tags = ["C", "C++", "Python", "NumPy", "Matplotlib", "Git"]
    x = 64
    f_tag = font(24)
    for t in tags:
        tw = int(d.textlength(t, font=f_tag))
        d.rounded_rectangle([x, 540, x + tw + 34, 582], radius=21, fill=(255, 255, 255, 16), outline=(255, 255, 255, 40))
        d.text((x + 17, 549), t, font=f_tag, fill=(*TEXT, 255))
        x += tw + 46

    d.rounded_rectangle([w - 300, 66, w - 64, 118], radius=26, fill=(*ACCENT3, 34), outline=(*ACCENT3, 120))
    d.text((w - 276, 79), "ahmadgolbooee.github.io", font=font(24), fill=(*ACCENT3, 255))

    img.save(os.path.join(IMG, "og-image.png"))
    print("og done")


def make_avatar():
    url = "https://avatars.githubusercontent.com/u/337410342?v=4"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=25) as r:
            raw = r.read()
        with open(os.path.join(IMG, "avatar-raw.png"), "wb") as f:
            f.write(raw)
        im = Image.open(os.path.join(IMG, "avatar-raw.png")).convert("RGB")
        side = min(im.size)
        im = im.crop(((im.width - side) // 2, (im.height - side) // 2, (im.width + side) // 2, (im.height + side) // 2))
        im = im.resize((512, 512), Image.LANCZOS)
        im.save(os.path.join(IMG, "avatar.png"))
        os.remove(os.path.join(IMG, "avatar-raw.png"))
        print("avatar done")
    except Exception as e:
        print("avatar skipped:", e)


make_icons()
make_og()
make_avatar()
