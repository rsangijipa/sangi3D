// Launcher dos Ambientes 3D — servidor local.
// Serve a pasta "Ambientes 3D" inteira e monta o catálogo de apps em /api/apps.
// Uso: node launcher/server.mjs [--open] [--port 5170]
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readdir, readFile, open } from 'node:fs/promises';
import { extname, join, resolve, relative, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { isBuildProject, ensureBuilt, snapshot } from './builder.mjs';

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

// Pastas que nunca são apps (ou são partes internas de um app).
const SKIP_DIRS = new Set(['node_modules', 'dist', 'src', 'public', 'scripts', 'assets', 'capturas', 'demonstracao',
  'launcher', 'mockups', '.claude', '.git', '.vite', '00_INDICE', 'PROMPT_BASE_PADRAO_DOS_APPS',
  '00_Organizacao', '04_Prompts', '05_Referencias', 'referencia_3d', 'shared']);
const IMG_RE = /\.(png|jpe?g|webp)$/i;

const COLLECTIONS = {
  'Jardins do Sentir': 'Jardins do Sentir',
  'Jardins da TCC': 'Jardins da TCC',
  'Kit_17_jogos_3D_mockups_e_prompts': 'Kit 17 jogos 3D',
  'ambientes-interativos-adultos-e-marcas': 'Adultos e marcas',
};

// Ordem de exibição das coleções (as não listadas vão para o fim).
const COLLECTION_ORDER = ['Jardins da TCC', 'Jardins do Sentir', 'Projetos 3D', 'Kit 17 jogos 3D', 'Ambientes avulsos', 'Adultos e marcas'];

const idFor = (path) => path.replace(/[^\w-]+/g, '-').toLowerCase();
// id -> { dir, name, appUrl } dos projetos que precisam de build.
const projects = new Map();

const toUrl = (abs) => '/' + relative(ROOT, abs).split(sep).map(encodeURIComponent).join('/');

async function readHead(file, bytes = 24000) {
  const fh = await open(file, 'r');
  try {
    const buf = Buffer.alloc(bytes);
    const { bytesRead } = await fh.read(buf, 0, bytes, 0);
    return buf.subarray(0, bytesRead).toString('utf8');
  } finally { await fh.close(); }
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).trim();
}

async function htmlInfo(file) {
  const head = await readHead(file);
  const title = head.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  const desc = head.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]
    ?? head.match(/<meta\s+name=["']description["'][^>]*content=\s*["']([^"']*)["']/is)?.[1];
  return { title: title ? decodeEntities(title) : null, description: desc ? decodeEntities(desc) : null };
}

async function mdInfo(file) {
  const text = await readFile(file, 'utf8').catch(() => '');
  const h1 = text.match(/^#\s+(.+)$/m)?.[1] ?? null;
  const title = h1?.replace(/^PROMPT DE IMPLEMENTA[ÇC][ÃA]O\s*[—–-]\s*/i, '').replace(/^\d+\.\s*/, '').trim() ?? null;
  const concept = text.match(/\*\*Conceito\.?\*\*\.?\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  return { title, description: concept };
}

// "Escada da Coragem — Jardins da TCC · Experiência 3D" -> nome + subtítulo
function splitTitle(t) {
  const m = t.match(/^(.*?)\s+[—–|·•]\s+(.*)$/);
  const name = (m ? m[1] : t).replace(/\s+3D$/, '').trim();
  return { name, subtitle: m ? m[2].trim() : '' };
}

function prettyFolder(name) {
  const s = name.replace(/^\d+[-_]/, '').replace(/[-_]+/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function collectionFor(title, relDir) {
  if (/jardins do sentir/i.test(title)) return COLLECTIONS['Jardins do Sentir'];
  if (/jardins da tcc/i.test(title)) return COLLECTIONS['Jardins da TCC'];
  const parts = relDir.split(sep);
  for (const part of parts) if (COLLECTIONS[part]) return COLLECTIONS[part];
  if (parts.includes('Adultos_e_Marcas')) return 'Adultos e marcas';
  if (parts.includes('Expressao_e_Desenvolvimento')) return 'Expressão e desenvolvimento';
  if (parts.includes('Legado_Arquivado')) return 'Legado arquivado';
  if (parts[0] === '01_Jogos_HTML') return 'Ambientes avulsos';
  if (relDir) return 'Projetos 3D';
  return 'Ambientes avulsos';
}

async function listDir(dir) {
  try { return await readdir(dir, { withFileTypes: true }); } catch { return []; }
}

async function exists(p) { try { await stat(p); return true; } catch { return false; } }

async function pickThumb(dir, files) {
  // "miniatura.*" (feita à mão) tem prioridade sobre qualquer outra imagem da pasta.
  const own = files.find((f) => /^miniatura\.(png|jpe?g|webp)$/i.test(f));
  if (own) return toUrl(join(dir, own));
  const pref = ['mockup.png', 'shot-desktop-final.png', 'shot-desktop.png'];
  for (const p of pref) if (files.includes(p)) return toUrl(join(dir, p));
  const img = files.find((f) => IMG_RE.test(f) && !/mobile/i.test(f));
  if (img) return toUrl(join(dir, img));
  const cap = join(dir, 'capturas');
  const caps = (await listDir(cap)).filter((e) => e.isFile() && IMG_RE.test(e.name)).map((e) => e.name).sort();
  return caps.length ? toUrl(join(cap, caps[0])) : null;
}

async function scan() {
  const entries = [];

  async function visit(dir, depth) {
    const items = await listDir(dir);
    const files = items.filter((e) => e.isFile()).map((e) => e.name);
    const dirs = items.filter((e) => e.isDirectory()).map((e) => e.name);
    const relDir = relative(ROOT, dir);
    const folder = basename(dir);
    const order = Number(folder.match(/^(\d+)/)?.[1] ?? 999);
    const st = await stat(dir);

    if (relDir) {
      const distIndex = join(dir, 'dist', 'index.html');
      const rootFolder = relDir.split(sep)[0];
      const standalone = !files.includes('package.json') && (
        rootFolder === '01_Jogos_HTML' || (rootFolder === '02_Projetos' && dirs.includes('assets'))
      );
      const htmls = files.filter((f) => f.toLowerCase().endsWith('.html') && (f !== 'index.html' || standalone));
      const mdFile = files.includes('PROMPT.md') ? 'PROMPT.md' : files.includes('PROMPT_IMPLEMENTACAO.md') ? 'PROMPT_IMPLEMENTACAO.md' : files.find((f) => f.endsWith('.md') && f.startsWith(folder));
      const thumb = await pickThumb(dir, files);
      const md = mdFile ? await mdInfo(join(dir, mdFile)) : {};

      if (await isBuildProject(dir, files)) {
        // Projeto com arquitetura própria: abre via /play/<id>, que compila se precisar.
        const hasDist = await exists(distIndex);
        const info = await htmlInfo(hasDist ? distIndex : join(dir, 'index.html'));
        const t = info.title ?? md.title ?? prettyFolder(folder);
        const id = idFor(relDir);
        const appUrl = toUrl(join(dir, 'dist')) + '/';
        projects.set(id, { dir, name: splitTitle(t).name, appUrl });
        entries.push({ ...splitTitle(t), fullTitle: t, description: info.description ?? md.description,
          url: `/play/${id}`, direct: hasDist ? appUrl : null, status: 'ready', kind: 'project',
          collection: collectionFor(t, relDir), thumb, order, path: relDir,
          mtime: hasDist ? (await stat(distIndex)).mtimeMs : st.mtimeMs });
        return;
      }
      if (await exists(distIndex)) {
        const info = await htmlInfo(distIndex);
        const t = info.title ?? md.title ?? prettyFolder(folder);
        entries.push({ ...splitTitle(t), fullTitle: t, description: info.description ?? md.description,
          url: toUrl(join(dir, 'dist')) + '/', status: 'ready', kind: 'build', collection: collectionFor(t, relDir),
          thumb, order, path: relDir, mtime: (await stat(distIndex)).mtimeMs });
        return; // não desce em apps
      }
      if (htmls.length) {
        for (const h of htmls) {
          const abs = join(dir, h);
          const info = await htmlInfo(abs);
          const t = info.title ?? md.title ?? prettyFolder(folder);
          entries.push({ ...splitTitle(t), fullTitle: t, description: info.description ?? md.description,
            url: toUrl(abs), status: 'ready', kind: 'html', collection: collectionFor(t, relDir), thumb, order,
            path: relative(ROOT, abs), mtime: (await stat(abs)).mtimeMs });
        }
        return;
      }
      if (files.includes('package.json') && files.includes('index.html')) {
        const info = await htmlInfo(join(dir, 'index.html'));
        const t = info.title ?? md.title ?? prettyFolder(folder);
        entries.push({ ...splitTitle(t), fullTitle: t, description: info.description ?? md.description, url: null,
          status: 'build', kind: 'source', collection: collectionFor(t, relDir), thumb, order, path: relDir,
          mtime: st.mtimeMs, hint: `cd "${relDir}" && npm install && npm run build` });
        return;
      }
      if (mdFile && depth >= 1 && !dirs.some((d) => !SKIP_DIRS.has(d) && !d.startsWith('_') && !d.startsWith('.'))) {
        const t = md.title ?? prettyFolder(folder);
        entries.push({ ...splitTitle(t), fullTitle: t, description: md.description, url: null, status: 'concept',
          kind: 'concept', collection: collectionFor(t, relDir), thumb, order, path: relDir, mtime: st.mtimeMs,
          doc: toUrl(join(dir, mdFile)) });
        return;
      }
    } else {
      // Raiz: cada .html é um app (exceto index.html e loading.html que pertencem ao launcher).
      for (const h of files.filter((f) => f.toLowerCase().endsWith('.html') && !['index.html', 'loading.html'].includes(f.toLowerCase()))) {
        const abs = join(dir, h);
        const info = await htmlInfo(abs);
        const t = info.title ?? prettyFolder(h.replace(/\.html$/i, ''));
        entries.push({ ...splitTitle(t), fullTitle: t, description: info.description, url: toUrl(abs), status: 'ready',
          kind: 'html', collection: collectionFor(t, ''), thumb: null, order: 999, path: h,
          mtime: (await stat(abs)).mtimeMs });
      }
    }

    if (depth >= 4) return;
    for (const d of dirs) {
      if (SKIP_DIRS.has(d) || d.startsWith('_') || d.startsWith('.')) continue;
      await visit(join(dir, d), depth + 1);
    }
  }

  await visit(ROOT, 0);

  // Agrupa versões com o mesmo título: a mais recente vira principal.
  // Um prompt pode ter sido implementado em outra pasta do acervo.
  const normalizeTitle = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/^\d+[.\s-]*/, '').split(/\s+[—–|·]\s+/)[0].replace(/[^a-z0-9]+/g, ' ').trim();
  const implemented = entries.filter((e) => e.status === 'ready').map((e) => e.fullTitle.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
  const groups = new Map();
  for (const e of entries) {
    if (e.status === 'concept') {
      const title = normalizeTitle(e.fullTitle);
      if (title && implemented.some((t) => t.includes(title))) continue;
    }
    const key = `${e.status}|${e.fullTitle.toLowerCase()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  const covers = new Set((await listDir(COVER_DIR)).filter((entry) => entry.isFile()).map((entry) => entry.name));
  const apps = [];
  for (const list of groups.values()) {
    list.sort((a, b) => b.mtime - a.mtime);
    const [main, ...older] = list;
    main.versions = older.map((o) => ({ url: o.url, path: o.path, mtime: o.mtime }));
    main.id = idFor(main.path);
    if (main.status === 'ready') {
      const cover = list.map((app) => `${idFor(app.path)}.webp`).find((file) => covers.has(file));
      if (cover) main.thumb = toUrl(join(COVER_DIR, cover));
    }
    apps.push(main);
  }
  const rank = (c) => { const i = COLLECTION_ORDER.indexOf(c); return i < 0 ? 99 : i; };
  apps.sort((a, b) => rank(a.collection) - rank(b.collection) || a.collection.localeCompare(b.collection, 'pt') ||a.order - b.order || a.name.localeCompare(b.name, 'pt'));
  return apps;
}

let cache = { at: 0, data: null };
async function getApps() {
  if (!cache.data || Date.now() - cache.at > 5000) cache = { at: Date.now(), data: await scan() };
  return cache.data;
}

async function serveFile(req, res, path) {
  const file = await stat(path);
  if (file.isDirectory()) {
    if (!req.url.split('?')[0].endsWith('/')) {
      res.writeHead(301, { Location: req.url.split('?')[0] + '/' }).end();
      return;
    }
    return serveFile(req, res, join(path, 'index.html'));
  }
  const type = MIME[extname(path).toLowerCase()] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : file.size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : file.size - 1;
    start = Math.max(0, start); end = Math.min(end, file.size - 1);
    if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${file.size}` }).end(); return; }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${file.size}`, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    createReadStream(path, { start, end }).on('error', () => res.destroy()).pipe(res);
    return;
  }
  res.writeHead(200, { ...headers, 'Content-Length': file.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(path).on('error', () => res.destroy()).pipe(res);
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
      const apps = (await getApps()).map((a) => a.kind === 'project' && projects.has(a.id)
        ? { ...a, build: snapshot(projects.get(a.id).dir) } : a);
      const body = JSON.stringify(apps);
      res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' }).end(body);
      return;
    }
    // /play/<id>: abre o jogo; se precisar compilar, mostra a tela de carregamento.
    const play = pathname.match(/^\/play\/([\w-]+)\/?$/);
    if (play) {
      await getApps();
      const p = projects.get(play[1]);
      if (!p) { res.writeHead(302, { Location: '/' }).end(); return; }
      const snap = await ensureBuilt(p.dir, { priority: true, name: p.name });
      if (snap.state === 'ready') { res.writeHead(302, { Location: p.appUrl, 'Cache-Control': 'no-store' }).end(); return; }
      return await serveFile(req, res, join(LAUNCHER_DIR, 'loading.html'));
    }
    const api = pathname.match(/^\/api\/build\/([\w-]+)(\/retry)?$/);
    if (api) {
      await getApps();
      const p = projects.get(api[1]);
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
        const p = a.kind === 'project' && projects.get(a.id);
        if (p) await ensureBuilt(p.dir, { name: p.name });
      }
    }).catch((err) => console.error('[build] verificação inicial falhou:', err.message));
    if (args.includes('--open') && process.platform === 'win32') {
      spawn('cmd.exe', ['/d', '/c', 'start', '', url], { windowsHide: true, stdio: 'ignore' }).on('error', () => {});
    }
  });
}
listen(START_PORT);
