// scripts/lib/catalog.mjs
// Scanner canônico compartilhado entre scripts/generate-catalog.mjs e launcher/server.mjs.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { stat, readdir, readFile, open } from 'node:fs/promises';
import { join, relative, sep, basename } from 'node:path';
import { isBuildProject } from '../../launcher/builder.mjs';

export const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'src', 'public', 'scripts', 'assets', 'capturas', 'demonstracao',
  'mockups', '.claude', '.git', '.vite', '00_INDICE', 'PROMPT_BASE_PADRAO_DOS_APPS',
  'referencia_3d', 'shared', 'tests', 'test'
]);

// Todos os jogos ficam em "Jogos/<n> - <Coleção>/". O nome da pasta define a coleção.
export const GAMES_DIR = 'Jogos';

const IMG_RE = /\.(png|jpe?g|webp)$/i;

const COLLECTIONS = {
  '1 - Jogos HTML': 'Ambientes avulsos',
  '2 - Projetos': 'Projetos 3D',
  '3 - Expressao e Desenvolvimento': 'Expressão e desenvolvimento',
  '4 - Kit 17 Jogos': 'Kit 17 jogos 3D',
  '5 - Sangi3D 15 Experiencias': 'Sangi3D 15 Experiências',
  '6 - Adultos e Marcas': 'Adultos e marcas',
  '9 - Arquivados': 'Legado arquivado',
};
const areaOf = (relDir) => relDir.split(sep)[1] ?? '';

const COLLECTION_ORDER = [
  'Sangi3D 15 Experiências',
  'Jardins da TCC',
  'Jardins do Sentir',
  'Projetos 3D',
  'Kit 17 jogos 3D',
  'Ambientes avulsos',
  'Adultos e marcas',
];

const BATCH1_KIT17_IDS = new Set([
  '4-kit-17-jogos-04-observatorio-da-luz',
  '4-kit-17-jogos-05-oficina-do-tempo',
  '4-kit-17-jogos-06-torre-do-impulso',
  '4-kit-17-jogos-07-ilha-das-pausas',
  '4-kit-17-jogos-09-estacao-das-trocas',
  '4-kit-17-jogos-13-museu-dos-pontos-de-vista',
  '4-kit-17-jogos-14-estudio-dos-limites',
  '4-kit-17-jogos-16-teatro-das-historias-possiveis',
]);

const BATCH2_ADULTOS_IDS = new Set([
  '6-adultos-e-marcas-04_maquina-de-escrever-das-intencoes',
  '6-adultos-e-marcas-05_clepsidra-do-foco',
  '6-adultos-e-marcas-07_copos-musicais',
  '6-adultos-e-marcas-08_toca-discos-de-vinil',
  '6-adultos-e-marcas-10_maquina-de-reacao-em-cadeia',
  '6-adultos-e-marcas-11_relogio-aberto',
  '6-adultos-e-marcas-14_bancada-da-manicure',
  '6-adultos-e-marcas-15_barista-de-bancada',
  '6-adultos-e-marcas-18_orgao-do-perfumista',
]);

const LEGADO_ARCHIVED_FROM = {
  '9-arquivados-atelie-dos-remendos-e-transformacoes-html':
    '1-jogos-html-atelie-dos-remendos-e-transformacoes-ateli_dos_remendos_e_transforma_es_3d_jardins_do_sentir-html',
  '9-arquivados-biblioteca-das-historias-inacabadas-html':
    '1-jogos-html-biblioteca-das-historias-inacabadas-biblioteca_das_hist_rias_inacabadas_3d_jardins_do_sentir-html',
  '9-arquivados-cidade-das-conexoes-html':
    '1-jogos-html-cidade-das-conexoes-cidade_das_conex_es_3d_jardins_do_sentir-html',
  '9-arquivados-correio-das-palavras-nao-ditas-html':
    '1-jogos-html-correio-das-palavras-nao-ditas-correio_das_palavras_n_o_ditas_3d_jardins_do_sentir-html',
};

const CORREIO_ACTIVE_ID =
  '1-jogos-html-correio-das-palavras-nao-ditas-correio_das_palavras_n_o_ditas_3d_jardins_do_sentir-html';
const CORREIO_LEGACY_ID =
  '9-arquivados-correio-das-palavras-nao-ditas-html';

const DISTINCT_ENTRY_IDS = new Set([
  '2-projetos-01-oficina-do-vitralista',
  '1-jogos-html-oficina-do-vitralista-index-html',
  '4-kit-17-jogos-04-observatorio-da-luz',
  '1-jogos-html-observatorio-da-luz-index-html',
  '01_jogos_html-terrario-de-vidro-terr_rio_de_vidro_verde_mi_do_plantas-html',
  '1-jogos-html-terrario-de-vidro-terrario-de-vidro-atelier-expandido-html',
  '5-sangi3d-15-experiencias-05-trem-sem-destino',
  '1-jogos-html-trem-sem-destino-trem-sem-destino-html',
  '5-sangi3d-15-experiencias-06-cidade-submersa',
  '1-jogos-html-cidade-submersa-cidade-submersa-html',
  '5-sangi3d-15-experiencias-08-universo-audioreativo',
  '1-jogos-html-universo-audioreativo-universo-audioreativo-html',
]);

export const idFor = (p) => String(p).split('\\').join('/').replace(/^Jogos\//, '')
  .replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

export function splitTitle(t) {
  const m = t.match(/^(.*?)\s+[—–|·•]\s+(.*)$/);
  const name = (m ? m[1] : t).replace(/\s+3D$/, '').trim();
  return { name, subtitle: m ? m[2].trim() : '' };
}

export function prettyFolder(name) {
  const s = name.replace(/^\d+[-_]/, '').replace(/[-_]+/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function collectionFor(title, relDir) {
  if (/jardins do sentir/i.test(title)) return 'Jardins do Sentir';
  if (/jardins da tcc/i.test(title)) return 'Jardins da TCC';
  return COLLECTIONS[areaOf(relDir)] ?? 'Projetos 3D';
}

const toUrl = (rootDir, abs) => '/' + relative(rootDir, abs).split(sep).map(encodeURIComponent).join('/');

async function listDir(dir) {
  try { return await readdir(dir, { withFileTypes: true }); } catch { return []; }
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

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

export async function pickThumb(rootDir, dir, files) {
  const own = files.find((f) => /^miniatura\.(png|jpe?g|webp)$/i.test(f));
  if (own) return toUrl(rootDir, join(dir, own));
  const pref = ['mockup.png', 'shot-desktop-final.png', 'shot-desktop.png'];
  for (const p of pref) if (files.includes(p)) return toUrl(rootDir, join(dir, p));
  const img = files.find((f) => IMG_RE.test(f) && !/mobile/i.test(f));
  if (img) return toUrl(rootDir, join(dir, img));
  const cap = join(dir, 'capturas');
  const caps = (await listDir(cap)).filter((e) => e.isFile() && IMG_RE.test(e.name)).map((e) => e.name).sort();
  return caps.length ? toUrl(rootDir, join(cap, caps[0])) : null;
}

function computeEntryContentHash(rootDir, entry) {
  const h = crypto.createHash('sha256');
  const targetRel = (entry.direct || entry.url || '').split('?')[0].split('#')[0];
  if (targetRel && !targetRel.startsWith('/play/')) {
    const clean = decodeURIComponent(targetRel).replace(/^\//, '');
    const candidate = clean.endsWith('/') ? join(rootDir, clean, 'index.html') : join(rootDir, clean);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      h.update(fs.readFileSync(candidate));
    }
  }
  h.update(String(entry.thumb || ''));
  return h.digest('hex').slice(0, 16);
}

export function applyCanonicalOverrides(apps) {
  const byId = new Map(apps.map((a) => [a.id, a]));
  let agenciaVersion = null;

  // Desanexa correio-das-palavras-nao-ditas-agencia-postal do legado (#87) e guarda para #9
  const legacyCorreio = byId.get(CORREIO_LEGACY_ID);
  if (legacyCorreio && Array.isArray(legacyCorreio.versions)) {
    const kept = [];
    for (const v of legacyCorreio.versions) {
      if (/correio-das-palavras-nao-ditas-agencia-postal/i.test(v.path || v.url || '')) {
        agenciaVersion = v;
      } else {
        kept.push(v);
      }
    }
    legacyCorreio.versions = kept;
  }

  for (const app of apps) {
    if (BATCH1_KIT17_IDS.has(app.id)) {
      app.kind = 'html';
      app.isConcept = false;
    }
    if (BATCH2_ADULTOS_IDS.has(app.id)) {
      app.kind = 'game';
      app.isConcept = false;
    }
    if (app.id === '2-projetos-01-oficina-do-vitralista') {
      app.name = 'Oficina do Vitralista';
      app.canonicalRole = 'canonical';
    } else if (app.id === '1-jogos-html-oficina-do-vitralista-index-html') {
      app.name = 'Oficina do Vitralista (HTML)';
      app.subtitle = 'Ateliê 3D Realista';
      app.canonicalRole = 'variant';
      app.variantOf = '2-projetos-01-oficina-do-vitralista';
    } else if (app.id === '4-kit-17-jogos-04-observatorio-da-luz') {
      app.name = 'Observatório da Luz';
      app.canonicalRole = 'canonical';
    } else if (app.id === '1-jogos-html-observatorio-da-luz-index-html') {
      app.name = 'Observatório da Luz (HTML)';
      app.subtitle = 'Exploração Sensorial de Iluminação';
      app.canonicalRole = 'variant';
      app.variantOf = '4-kit-17-jogos-04-observatorio-da-luz';
    } else if (app.id === '01_jogos_html-terrario-de-vidro-terr_rio_de_vidro_verde_mi_do_plantas-html') {
      app.canonicalRole = 'canonical';
    } else if (app.id === '1-jogos-html-terrario-de-vidro-terrario-de-vidro-atelier-expandido-html') {
      app.name = 'Terrário de Vidro (Ateliê Expandido)';
      app.subtitle = 'Ateliê Expandido · Verde Miúdo Plantas';
      app.canonicalRole = 'variant';
      app.variantOf = '01_jogos_html-terrario-de-vidro-terr_rio_de_vidro_verde_mi_do_plantas-html';
    }

    if (app.collection === 'Legado arquivado') {
      app.isLegacy = true;
      if (LEGADO_ARCHIVED_FROM[app.id]) {
        app.archivedFrom = LEGADO_ARCHIVED_FROM[app.id];
      }
    }

    if (app.id === '5-sangi3d-15-experiencias-05-trem-sem-destino') {
      app.name = 'Trem sem Destino (Experiência 3D)';
      app.canonicalRole = 'variant';
      app.variantOf = '1-jogos-html-trem-sem-destino-trem-sem-destino-html';
    } else if (app.id === '5-sangi3d-15-experiencias-06-cidade-submersa') {
      app.name = 'Cidade Submersa (Experiência 3D)';
      app.canonicalRole = 'variant';
      app.variantOf = '1-jogos-html-cidade-submersa-cidade-submersa-html';
    } else if (app.id === '5-sangi3d-15-experiencias-08-universo-audioreativo') {
      app.name = 'Universo Audioreativo (Experiência 3D)';
      app.canonicalRole = 'variant';
      app.variantOf = '1-jogos-html-universo-audioreativo-universo-audioreativo-html';
    }

    if (app.id === '1-jogos-html-oficina-do-ritmo-oficina-do-ritmo-html') {
      app.gateBlocker = 'T19';
    }
  }

  const activeCorreio = byId.get(CORREIO_ACTIVE_ID);
  if (activeCorreio && agenciaVersion) {
    activeCorreio.versions = activeCorreio.versions || [];
    if (!activeCorreio.versions.some((v) => v.url === agenciaVersion.url)) {
      activeCorreio.versions.push(agenciaVersion);
    }
  }

  return apps;
}

export function stabilizeMtimes(rootDir, apps, existingCatalog = null) {
  const prevById = new Map(
    Array.isArray(existingCatalog) ? existingCatalog.map((e) => [e.id, e]) : []
  );

  for (const app of apps) {
    const contentHash = computeEntryContentHash(rootDir, app);
    const prev = prevById.get(app.id);
    if (prev) {
      if (prev.contentHash && prev.contentHash === contentHash && typeof prev.mtime === 'number') {
        app.mtime = prev.mtime;
      } else if (!prev.contentHash && typeof prev.mtime === 'number' && Math.abs(prev.mtime - app.mtime) < 10000) {
        app.mtime = prev.mtime;
      }
    }
    app.contentHash = contentHash;
  }
  return apps;
}

export async function scanCatalog({
  rootDir,
  coverDir = join(rootDir, 'Sistema', 'launcher', 'capas'),
  staticMode = false,
  existingCatalog = null,
} = {}) {
  const entries = [];
  const projects = new Map();

  async function visit(dir, depth) {
    const items = await listDir(dir);
    const files = items.filter((e) => e.isFile()).map((e) => e.name);
    const dirs = items.filter((e) => e.isDirectory()).map((e) => e.name);
    const relDir = relative(rootDir, dir);
    const folder = basename(dir);
    const order = Number(folder.match(/^(\d+)/)?.[1] ?? 999);
    const st = await stat(dir);

    if (relDir) {
      const distIndex = join(dir, 'dist', 'index.html');
      const area = areaOf(relDir);
      const collectionEntry = /^\d{2}[-_]/.test(folder) && (
        area === '4 - Kit 17 Jogos' ||
        area === '6 - Adultos e Marcas' ||
        area === '5 - Sangi3D 15 Experiencias'
      );
      const standalone = !files.includes('package.json') && (
        collectionEntry || area === '1 - Jogos HTML' || (area === '2 - Projetos' && dirs.includes('assets'))
      );
      const hasImplementedIndex = standalone && files.includes('index.html');
      const htmls = files.filter((f) => {
        if (!f.toLowerCase().endsWith('.html')) return false;
        if (hasImplementedIndex && f.toLowerCase() === 'mockup.html') return false;
        return f !== 'index.html' || standalone;
      });
      const mdFile = files.includes('PROMPT.md')
        ? 'PROMPT.md'
        : files.includes('PROMPT_IMPLEMENTACAO.md')
          ? 'PROMPT_IMPLEMENTACAO.md'
          : files.find((f) => f.endsWith('.md') && f.startsWith(folder));
      const thumb = await pickThumb(rootDir, dir, files);
      const md = mdFile ? await mdInfo(join(dir, mdFile)) : {};

      if (await isBuildProject(dir, files)) {
        const hasDist = await exists(distIndex);
        const info = await htmlInfo(hasDist ? distIndex : join(dir, 'index.html'));
        const t = info.title ?? md.title ?? prettyFolder(folder);
        const id = idFor(relDir);
        const appUrl = toUrl(rootDir, join(dir, 'dist')) + '/';
        const staticDistUrl = hasDist ? appUrl + 'index.html' : null;
        projects.set(id, { dir, name: splitTitle(t).name, appUrl });
        entries.push({
          ...splitTitle(t),
          fullTitle: t,
          description: info.description ?? md.description,
          url: staticMode ? staticDistUrl : `/play/${id}`,
          direct: hasDist ? (staticMode ? staticDistUrl : appUrl) : null,
          status: 'ready',
          kind: 'project',
          collection: collectionFor(t, relDir),
          thumb,
          order,
          path: relDir,
          mtime: hasDist ? (await stat(distIndex)).mtimeMs : st.mtimeMs,
        });
        return;
      }
      if (await exists(distIndex)) {
        const info = await htmlInfo(distIndex);
        const t = info.title ?? md.title ?? prettyFolder(folder);
        entries.push({
          ...splitTitle(t),
          fullTitle: t,
          description: info.description ?? md.description,
          url: toUrl(rootDir, join(dir, 'dist')) + (staticMode ? '/index.html' : '/'),
          status: 'ready',
          kind: 'build',
          collection: collectionFor(t, relDir),
          thumb,
          order,
          path: relDir,
          mtime: (await stat(distIndex)).mtimeMs,
        });
        return;
      }
      if (htmls.length) {
        for (const h of htmls) {
          const abs = join(dir, h);
          const info = await htmlInfo(abs);
          const t = info.title ?? md.title ?? prettyFolder(folder);
          entries.push({
            ...splitTitle(t),
            fullTitle: t,
            description: info.description ?? md.description,
            url: toUrl(rootDir, abs),
            status: 'ready',
            kind: 'html',
            collection: collectionFor(t, relDir),
            thumb,
            order,
            path: h === 'index.html' && collectionEntry ? relDir : relative(rootDir, abs),
            mtime: (await stat(abs)).mtimeMs,
          });
        }
        return;
      }
      if (files.includes('package.json') && files.includes('index.html')) {
        const info = await htmlInfo(join(dir, 'index.html'));
        const t = info.title ?? md.title ?? prettyFolder(folder);
        entries.push({
          ...splitTitle(t),
          fullTitle: t,
          description: info.description ?? md.description,
          url: null,
          status: 'build',
          kind: 'source',
          collection: collectionFor(t, relDir),
          thumb,
          order,
          path: relDir,
          mtime: st.mtimeMs,
          hint: `cd "${relDir}" && npm install && npm run build`,
        });
        return;
      }
      if (mdFile && depth >= 1 && !dirs.some((d) => !SKIP_DIRS.has(d) && !d.startsWith('_') && !d.startsWith('.'))) {
        const t = md.title ?? prettyFolder(folder);
        entries.push({
          ...splitTitle(t),
          fullTitle: t,
          description: md.description,
          url: null,
          status: 'concept',
          kind: 'concept',
          collection: collectionFor(t, relDir),
          thumb,
          order,
          path: relDir,
          mtime: st.mtimeMs,
          doc: toUrl(rootDir, join(dir, mdFile)),
        });
        return;
      }
    } else {
      for (const h of files.filter((f) => f.toLowerCase().endsWith('.html') && !['index.html', 'loading.html'].includes(f.toLowerCase()))) {
        const abs = join(dir, h);
        const info = await htmlInfo(abs);
        const t = info.title ?? prettyFolder(h.replace(/\.html$/i, ''));
        entries.push({
          ...splitTitle(t),
          fullTitle: t,
          description: info.description,
          url: toUrl(rootDir, abs),
          status: 'ready',
          kind: 'html',
          collection: collectionFor(t, ''),
          thumb: null,
          order: 999,
          path: h,
          mtime: (await stat(abs)).mtimeMs,
        });
      }
    }

    if (depth >= 4) return;
    for (const d of dirs) {
      if (SKIP_DIRS.has(d) || d.startsWith('_') || d.startsWith('.')) continue;
      await visit(join(dir, d), depth + 1);
    }
  }

  await visit(join(rootDir, GAMES_DIR), 0);

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
    const entryId = idFor(e.path);
    const key = DISTINCT_ENTRY_IDS.has(entryId)
      ? `${e.status}|id:${entryId}`
      : `${e.status}|${e.fullTitle.toLowerCase()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }

  const covers = new Set((await listDir(coverDir)).filter((entry) => entry.isFile()).map((entry) => entry.name));
  const apps = [];
  for (const list of groups.values()) {
    list.sort((a, b) => b.mtime - a.mtime);
    const [main, ...older] = list;
    main.versions = older.map((o) => ({ url: o.url, path: o.path, mtime: o.mtime }));
    main.id = idFor(main.path);
    if (main.status === 'ready') {
      const candidates = list.flatMap((app) => [`${idFor(app.path)}.webp`, `${idFor(app.path)}.png`]);
      const cover = candidates.find((file) => covers.has(file));
      if (cover) main.thumb = `/launcher/capas/${cover}`;
    }
    apps.push(main);
  }

  applyCanonicalOverrides(apps);

  const rank = (c) => { const i = COLLECTION_ORDER.indexOf(c); return i < 0 ? 99 : i; };
  apps.sort((a, b) => rank(a.collection) - rank(b.collection) || a.collection.localeCompare(b.collection, 'pt') || a.order - b.order || a.name.localeCompare(b.name, 'pt'));

  // Remove any accidental self-reference
  const cleanApps = apps.filter((a) => a.id !== 'index-html' && a.url !== '/index.html' && a.name !== 'Ambientes');

  if (staticMode) {
    stabilizeMtimes(rootDir, cleanApps, existingCatalog);
  }

  return { apps: cleanApps, projects };
}
