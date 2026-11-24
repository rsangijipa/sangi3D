from pathlib import Path
import random
from PIL import Image, ImageDraw, ImageFilter

rng = random.Random(1117)
size = 384
paper = Image.new("L", (size, size))
paper.putdata([min(255, max(185, int(rng.gauss(247, 8)))) for _ in range(size * size)])
grain = ImageDraw.Draw(paper)
for _ in range(3400):
    x, y = rng.randrange(size), rng.randrange(size)
    grain.line((x, y, x + rng.randint(-4, 4), y + rng.randrange(1, 4)), fill=rng.randint(207, 245))
dest = Path(__file__).resolve().parent.parent / "assets" / "paper.webp"
paper.filter(ImageFilter.GaussianBlur(0.32)).save(dest, quality=86)

