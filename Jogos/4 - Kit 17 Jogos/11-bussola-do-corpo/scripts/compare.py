from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
captures = root / "capturas"
source = Image.open(root / "mockup.png").convert("RGB")
draw_font = "#22372e"

def comparison(name, box, target, match_height):
    left = source.crop(box)
    right = Image.open(captures / target).convert("RGB")
    ratio = match_height / left.height
    left = left.resize((round(left.width * ratio), match_height), Image.Resampling.LANCZOS)
    ratio = match_height / right.height
    right = right.resize((round(right.width * ratio), match_height), Image.Resampling.LANCZOS)
    out = Image.new("RGB", (left.width + right.width + 39, match_height + 45), "#e9decf")
    draw = ImageDraw.Draw(out)
    draw.text((13, 12), "Referência recortada", fill=draw_font)
    draw.text((left.width + 26, 12), "Jogo no Chromium", fill=draw_font)
    out.paste(left, (13, 32))
    out.paste(right, (left.width + 26, 32))
    out.save(captures / name)

# Coordenadas internas à arte fornecida, excluindo a prancha de apresentação.
comparison("comparacao-desktop.png", (20, 108, 1253, 827), "1280x720-sensacao.png", 550)
comparison("comparacao-mobile.png", (1274, 42, 1662, 900), "390x844-sensacao.png", 740)

