import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const html = new URL('../rochas-em-equilibrio.html', import.meta.url);
const root = new URL('../', import.meta.url);
const port = Number(process.env.ROCHAS_PORT || 4430);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const pathname = url.pathname;

  if (pathname === '/favicon.ico') {
    res.writeHead(204).end();
    return;
  }

  if (pathname === '/teste-iframe') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><meta charset="utf-8"><style>html,body,iframe{height:100%;width:100%;border:0;margin:0}</style><iframe title="Rochas incorporadas" src="/?embed=1"></iframe>');
    return;
  }

  if (pathname === '/' || pathname === '/rochas-em-equilibrio.html') {
    try {
      const page = await readFile(html);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : page);
    } catch {
      res.writeHead(503).end('Gere o rochas-em-equilibrio.html antes de iniciar a prévia.');
    }
    return;
  }

  // Arquivos estáticos adicionais na pasta do projeto
  try {
    const fileRelative = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const filePath = new URL(fileRelative, root);
    const content = await readFile(filePath);
    const ext = extname(pathname);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404).end();
  }
});

server.listen(port, '127.0.0.1', () => console.log('Rochas em Equilíbrio · http://127.0.0.1:' + port + '/'));
