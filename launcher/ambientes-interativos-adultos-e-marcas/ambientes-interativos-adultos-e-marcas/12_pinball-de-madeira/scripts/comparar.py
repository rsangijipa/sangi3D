from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
paths = [root / "cb721f77-246f-40ad-8b9c-d6be9b6d5404.webp",
         root / "capturas" / "desktop-inicial.png"]
height = 466
images = []
for path in paths:
    scene = Image.open(path).convert("RGB")
    images.append(scene.resize((round(height * scene.width / scene.height), height), Image.Resampling.LANCZOS))
board = Image.new("RGB", (sum(scene.width for scene in images) + 36, height + 44), "#e9dfd3")
draw = ImageDraw.Draw(board)
draw.text((12, 10), "Mockup fornecido", fill="#352318")
draw.text((24 + images[0].width, 10), "Pinball de Madeira no Chromium", fill="#352318")
board.paste(images[0], (12, 31))
board.paste(images[1], (24 + images[0].width, 31))
board.save(root / "capturas" / "comparacao-desktop.png")

