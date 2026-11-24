// scripts/lib/catalog.mjs
// Scanner canônico compartilhado entre scripts/generate-catalog.mjs e launcher/server.mjs.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { stat, readdir, readFile, open } from 'node:fs/promises';
import { join, relative, sep, basename } from 'node:path';
import { isBuildProject } from '../../launcher/builder.mjs';

export const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'src', 'public', 'scripts', 'assets', 'capturas', 'demonstracao',
  'launcher', 'mockups', '.claude', '.git', '.vite', '00_INDICE', 'PROMPT_BASE_PADRAO_DOS_APPS',
  '00_Organizacao', '04_Prompts', '05_Referencias', 'referencia_3d', 'shared'
]);

const IMG_RE = /\.(png|jpe?g|webp)$/i;

const COLLECTIONS = {
  'Jardins do Sentir': 'Jardins do Sentir',
  'Jardins da TCC': 'Jardins da TCC',
  'Kit_17_jogos_3D_mockups_e_prompts': 'Kit 17 jogos 3D',
  'ambientes-interativos-adultos-e-marcas': 'Adultos e marcas',
};

const COLLECTION_ORDER = [
  'Jardins da TCC',
  'Jardins do Sentir',
  'Projetos 3D',
  'Kit 17 jogos 3D',
  'Ambientes avulsos',
  'Adultos e marcas',
];

const BATCH1_KIT17_IDS = new Set([
  'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz',
  'kit_17_jogos_3d_mockups_e_prompts-05-oficina-do-tempo',
  'kit_17_jogos_3d_mockups_e_prompts-06-torre-do-impulso',
  'kit_17_jogos_3d_mockups_e_prompts-07-ilha-das-pausas',
  'kit_17_jogos_3d_mockups_e_prompts-09-estacao-das-trocas',
  'kit_17_jogos_3d_mockups_e_prompts-13-museu-dos-pontos-de-vista',
  'kit_17_jogos_3d_mockups_e_prompts-14-estudio-dos-limites',
  'kit_17_jogos_3d_mockups_e_prompts-16-teatro-das-historias-possiveis',
]);

const BATCH2_ADULTOS_IDS = new Set([
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-04_maquina-de-escrever-das-intencoes',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-05_clepsidra-do-foco',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-07_copos-musicais',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-08_toca-discos-de-vinil',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-10_maquina-de-reacao-em-cadeia',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-11_relogio-aberto',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-14_bancada-da-manicure',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-15_barista-de-bancada',
  'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-18_orgao-do-perfumista',
]);

const LEGADO_ARCHIVED_FROM = {
  '01_jogos_html-legado_arquivado-ambientes-html-atelie-dos-remendos-e-transformacoes-html':
    '01_jogos_html-atelie-dos-remendos-e-transformacoes-ateli_dos_remendos_e_transforma_es_3d_jardins_do_sentir-html',
  '01_jogos_html-legado_arquivado-ambientes-html-biblioteca-das-historias-inacabadas-html':
    '01_jogos_html-biblioteca-das-historias-inacabadas-biblioteca_das_hist_rias_inacabadas_3d_jardins_do_sentir-html',
  '01_jogos_html-legado_arquivado-ambientes-html-cidade-das-conexoes-html':
    '01_jogos_html-cidade-das-conexoes-cidade_das_conex_es_3d_jardins_do_sentir-html',
  '01_jogos_html-legado_arquivado-ambientes-html-correio-das-palavras-nao-ditas-html':
    '01_jogos_html-correio-das-palavras-nao-ditas-correio_das_palavras_n_o_ditas_3d_jardins_do_sentir-html',
};

const CORREIO_ACTIVE_ID =
  '01_jogos_html-correio-das-palavras-nao-ditas-correio_das_palavras_n_o_ditas_3d_jardins_do_sentir-html';
const CORREIO_LEGACY_ID =
  '01_jogos_html-legado_arquivado-ambientes-html-correio-das-palavras-nao-ditas-html';

const DISTINCT_ENTRY_IDS = new Set([
  '02_projetos-01-oficina-do-vitralista',
  '01_jogos_html-oficina-do-vitralista-index-html',
  'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz',
  '01_jogos_html-observatorio-da-luz-index-html',
  '01_jogos_html-terrario-de-vidro-terr_rio_de_vidro_verde_mi_do_plantas-html',
  '01_jogos_html-terrario-de-vidro-terrario-de-vidro-atelier-expandido-html',
]);

export const idFor = (p) => String(p).replace(/[^\w-]+/g, '-').toLowerCase();

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
    if (app.id === '02_projetos-01-oficina-do-vitralista') {
      app.name = 'Oficina do Vitralista';
      app.canonicalRole = 'canonical';
    } else if (app.id === '01_jogos_html-oficina-do-vitralista-index-html') {
      app.name = 'Oficina do Vitralista (HTML)';
      app.subtitle = 'Ateliê 3D Realista';
      app.canonicalRole = 'variant';
      app.variantOf = '02_projetos-01-oficina-do-vitralista';
    } else if (app.id === 'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz') {
      app.name = 'Observatório da Luz';
      app.canonicalRole = 'canonical';
    } else if (app.id === '01_jogos_html-observatorio-da-luz-index-html') {
      app.name = 'Observatório da Luz (HTML)';
      app.subtitle = 'Exploração Sensorial de Iluminação';
      app.canonicalRole = 'variant';
      app.variantOf = 'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz';
    } else if (app.id === '01_jogos_html-terrario-de-vidro-terr_rio_de_vidro_verde_mi_do_plantas-html') {
      app.canonicalRole = 'canonical';
    } else if (app.id === '01_jogos_html-terrario-de-vidro-terrario-de-vidro-atelier-expandido-html') {
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

    if (app.id === '01_jogos_html-oficina-do-ritmo-oficina-do-ritmo-html') {
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
  coverDir = join(rootDir, 'launcher', 'capas'),
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
      const rootFolder = relDir.split(sep)[0];
      const collectionEntry = /^\d{2}[-_]/.test(folder) && (
        rootFolder === 'Kit_17_jogos_3D_mockups_e_prompts' ||
        rootFolder === 'ambientes-interativos-adultos-e-marcas'
      );
      const standalone = !files.includes('package.json') && (
        collectionEntry || rootFolder === '01_Jogos_HTML' || (rootFolder === '02_Projetos' && dirs.includes('assets'))
      );
      const htmls = files.filter((f) => f.toLowerCase().endsWith('.html') && (f !== 'index.html' || standalone));
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

  await visit(rootDir, 0);

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
