"""Serve the collection and the local shared Three.js modules on loopback."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


class ModuleHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript", ".cjs": "text/javascript"}


def main():
    parser = argparse.ArgumentParser(description="Abra o catálogo Sangi3D no servidor local.")
    parser.add_argument("--porta", type=int, default=8765)
    parser.add_argument("--sem-navegador", action="store_true")
    args = parser.parse_args()
    workspace = Path(__file__).resolve().parents[2]
    handler = partial(ModuleHandler, directory=str(workspace))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.porta), handler)
    except OSError as error:
        parser.exit(1, f"Não foi possível usar a porta {args.porta}. {error}\n")
    with server:
        url = f"http://127.0.0.1:{server.server_port}/Jogos/5%20-%20Sangi3D%2015%20Experiencias/"
        print(f"Abra {url}\nCtrl+C encerra o servidor.", flush=True)
        if not args.sem_navegador:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
