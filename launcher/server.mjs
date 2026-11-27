// Launcher dos Ambientes 3D — servidor local.
// Serve a pasta "Ambientes 3D" inteira e monta o catálogo de apps em /api/apps via scripts/lib/catalog.mjs.
// Uso: node launcher/server.mjs [--open] [--port 5170] [--no-prebuild]
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { ensureBuilt, snapshot } from './builder.mjs';
import { scanCatalog } from '../scripts/lib/catalog.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const LAUNCHER_DIR = resolve(fileURLToPath(new URL('.', import.meta.url)));
const COVER_DIR = join(LAUNCHER_DIR, 'capas');
const args = process.argv.slice(2);
// Compatibilidade com os caminhos anteriores à organização do acervo.
const movedPaths = JSON.parse(await readFile(join(ROOT, '00_Organizacao', 'movimentacoes.json'), 'utf8').catch(() => '[]'))
  .sort((a, b) => b.origem.length - a.origem.length);
const portArg = args.indexOf('--port');
const START_PORT = Number(portArg >= 0 ? args[portArg + 1] : process.env.LAUNCHER_PORT ?? 5170);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.avif': 'image/avif', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav',
  '.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.hdr': 'application/octet-stream',
  '.exr': 'application/octet-stream', '.ktx2': 'image/ktx2', '.wasm': 'application/wasm',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

const exists = (p) => stat(p).then(() => true, () => false);

let cache = { at: 0, data: null, projects: new Map() };
async function getApps() {
  if (!cache.data || Date.now() - cache.at > 5000) {
    const { apps, projects } = await scanCatalog({
      rootDir: ROOT,
      coverDir: COVER_DIR,
      staticMode: false,
    });
    cache = { at: Date.now(), data: apps, projects };
  }
  return cache.data;
}

async function serveFile(req, res, filePath) {
  const file = await stat(filePath);
  if (file.isDirectory()) {
    if (!req.url.split('?')[0].endsWith('/')) {
      res.writeHead(301, { Location: req.url.split('?')[0] + '/' }).end();
      return;
    }
    return serveFile(req, res, join(filePath, 'index.html'));
  }
  const type = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : file.size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : file.size - 1;
    start = Math.max(0, start); end = Math.min(end, file.size - 1);
    if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${file.size}` }).end(); return; }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${file.size}`, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    createReadStream(filePath, { start, end }).on('error', () => res.destroy()).pipe(res);
    return;
  }
  res.writeHead(200, { ...headers, 'Content-Length': file.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(filePath).on('error', () => res.destroy()).pipe(res);
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname).replaceAll('\\', '/');
    const oldPath = pathname.slice(1);
    const moved = movedPaths.find((m) => oldPath === m.origem || oldPath.startsWith(m.origem + '/'));
    if (moved) {
      const destination = '/' + (moved.destino + oldPath.slice(moved.origem.length)).split('/').map(encodeURIComponent).join('/');
      res.writeHead(302, { Location: destination + new URL(req.url, 'http://127.0.0.1').search }).end();
      return;
    }
    if (pathname === '/api/apps') {
      const apps = (await getApps()).map((a) => a.kind === 'project' && cache.projects.has(a.id)
        ? { ...a, build: snapshot(cache.projects.get(a.id).dir) } : a);
      const body = JSON.stringify(apps);
      res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' }).end(body);
      return;
    }
    // /play/<id>: abre o jogo; se precisar compilar, mostra a tela de carregamento.
    const play = pathname.match(/^\/play\/([\w-]+)\/?$/);
    if (play) {
      await getApps();
      const p = cache.projects.get(play[1]);
      if (!p) { res.writeHead(302, { Location: '/' }).end(); return; }
      const snap = await ensureBuilt(p.dir, { priority: true, name: p.name });
      if (snap.state === 'ready') { res.writeHead(302, { Location: p.appUrl, 'Cache-Control': 'no-store' }).end(); return; }
      return await serveFile(req, res, join(LAUNCHER_DIR, 'loading.html'));
    }
    const api = pathname.match(/^\/api\/build\/([\w-]+)(\/retry)?$/);
    if (api) {
      await getApps();
      const p = cache.projects.get(api[1]);
      if (!p) { res.writeHead(404).end(); return; }
      const snap = api[2] ? await ensureBuilt(p.dir, { force: true, priority: true, name: p.name }) : snapshot(p.dir);
      const hasDist = await exists(join(p.dir, 'dist', 'index.html'));
      res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' })
        .end(JSON.stringify({ name: p.name, appUrl: p.appUrl, hasDist, ...snap }));
      return;
    }
    // Apps com launcher próprio (ex.: Bússola do Corpo) voltam para o launcher principal.
    if (/\/dist\/launcher\.html$/i.test(pathname)) { res.writeHead(302, { Location: '/' }).end(); return; }
    if (pathname === '/' || pathname === '/index.html') return await serveFile(req, res, join(LAUNCHER_DIR, 'index.html'));
    if (pathname.startsWith('/launcher/')) {
      const p = resolve(LAUNCHER_DIR, '.' + pathname.slice('/launcher'.length));
      if (!p.startsWith(LAUNCHER_DIR + sep)) { res.writeHead(404).end(); return; }
      return await serveFile(req, res, p);
    }
    const p = resolve(ROOT, '.' + pathname);
    if (p !== ROOT && !p.startsWith(ROOT + sep)) { res.writeHead(404).end(); return; }
    if (p.split(sep).includes('node_modules') || p.split(sep).includes('.claude')) { res.writeHead(404).end(); return; }
    await serveFile(req, res, p);
  } catch {
    if (!res.headersSent) res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
  }
});

function listen(port, tries = 20) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && tries > 0) listen(port + 1, tries - 1);
    else { console.error(err.message); process.exit(1); }
  });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${server.address().port}/`;
    console.log(`Launcher dos Ambientes 3D rodando em ${url}`);
    console.log('Feche esta janela para desligar.');
    // Ao abrir: confere todos os projetos e compila em segundo plano os que estão desatualizados.
    if (!args.includes('--no-prebuild')) getApps().then(async (apps) => {
      for (const a of apps) {
        const p = a.kind === 'project' && cache.projects.get(a.id);
        if (p) await ensureBuilt(p.dir, { name: p.name });
      }
    }).catch((err) => console.error('[build] verificação inicial falhou:', err.message));
    if (args.includes('--open') && process.platform === 'win32') {
      spawn('cmd.exe', ['/d', '/c', 'start', '', url], { windowsHide: true, stdio: 'ignore' }).on('error', () => {});
    }
  });
}
listen(START_PORT);
