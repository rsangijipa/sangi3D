from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
source = Image.open(root / "2449ef94-0127-493c-a9ca-0788af7f2099.webp").convert("RGB")
result = Image.open(root / "capturas/desktop-inicial.png").convert("RGB")
height = 478
images = [image.resize((round(height * image.width / image.height), height), Image.Resampling.LANCZOS)
          for image in (source, result)]
board = Image.new("RGB", (sum(image.width for image in images) + 36, height + 43), "#e9dfd2")
draw = ImageDraw.Draw(board)
draw.text((12, 10), "Mockup fornecido", fill="#36261c")
draw.text((24 + images[0].width, 10), "Sala 3D no Chromium", fill="#36261c")
board.paste(images[0], (12, 30))
board.paste(images[1], (24 + images[0].width, 30))
board.save(root / "capturas/comparacao-desktop.png")

