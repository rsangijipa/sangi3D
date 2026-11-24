// scripts/verify-catalog.mjs
// Validador automatizado da integridade e paridade do catálogo Sangi3D
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function resolveCatalogUrl(baseDir, rawUrl) {
  const cleanUrl = rawUrl.split('?')[0].split('#')[0];
  const rel = decodeURIComponent(cleanUrl).replace(/^\//, '');
  let target = path.join(baseDir, rel);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, 'index.html');
  }
  return { cleanUrl, rel, target };
}

function collectFilesRecursive(dir, base = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesRecursive(full, base));
    } else if (entry.isFile()) {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

function findOrphanedLauncherAssets(rootDir, launcherDir) {
  const orphans = [];
  if (!fs.existsSync(launcherDir)) return orphans;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      if (['node_modules', '.git', 'capas', 'api'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const rel = path.relative(launcherDir, full);
      if (rel === 'launcher') continue; // launcher/launcher/capas

      if (entry.name === 'assets' && path.basename(path.dirname(full)) === 'dist') {
        const rootAssetsDir = path.join(rootDir, rel);
        for (const assetEntry of fs.readdirSync(full, { withFileTypes: true })) {
          if (!assetEntry.isFile()) continue;
          const rootAssetFile = path.join(rootAssetsDir, assetEntry.name);
          if (!fs.existsSync(rootAssetFile)) {
            orphans.push(path.join('launcher', rel, assetEntry.name));
          }
        }
        continue;
      }
      walk(full);
    }
  }

  walk(launcherDir);
  return orphans;
}

export function verifyCatalog({
  rootDir = process.cwd(),
  allowMissingThumbs = false,
  quiet = false,
} = {}) {
  const errors = [];
  const warnings = [];
  const summary = {};

  const logError = (msg) => {
    errors.push(msg);
    if (!quiet) console.error(`❌ [ERRO] ${msg}`);
  };
  const logWarning = (msg) => {
    warnings.push(msg);
    if (!quiet) console.warn(`⚠️ [AVISO] ${msg}`);
  };
  const log = (msg) => {
    if (!quiet) console.log(msg);
  };

  const rootCatalogPath = path.join(rootDir, 'api', 'apps.json');
  const launcherCatalogPath = path.join(rootDir, 'launcher', 'api', 'apps.json');
  const catalogPaths = [rootCatalogPath, launcherCatalogPath];

  // 0. Paridade byte a byte entre api/apps.json e launcher/api/apps.json
  if (fs.existsSync(rootCatalogPath) && fs.existsSync(launcherCatalogPath)) {
    const rootRaw = fs.readFileSync(rootCatalogPath, 'utf8');
    const launcherRaw = fs.readFileSync(launcherCatalogPath, 'utf8');
    if (rootRaw !== launcherRaw) {
      logError('Catálogos divergem: api/apps.json e launcher/api/apps.json não são idênticos byte a byte.');
    }
  }

  for (const catPath of catalogPaths) {
    const relPath = path.relative(rootDir, catPath);
    log(`\n--- Validando catálogo: ${relPath} ---`);
    if (!fs.existsSync(catPath)) {
      logError(`Arquivo do catálogo não encontrado: ${relPath}`);
      continue;
    }

    let apps;
    try {
      apps = JSON.parse(fs.readFileSync(catPath, 'utf8'));
    } catch (err) {
      logError(`Falha ao ler JSON em ${relPath}: ${err.message}`);
      continue;
    }

    if (!Array.isArray(apps)) {
      logError(`Conteúdo do catálogo não é uma array: ${relPath}`);
      continue;
    }

    log(`Total de entradas listadas: ${apps.length}`);
    const idSet = new Set();
    const urlSet = new Map();
    const nonArchivedNames = new Map();

    let readyCount = 0;
    let conceptCount = 0;
    let archivedCount = 0;
    let missingFiles = 0;
    let selfRefs = 0;

    for (const app of apps) {
      if (!app.id) {
        logError(`Entrada sem 'id': "${app.name || app.fullTitle}"`);
      } else if (idSet.has(app.id)) {
        logError(`ID duplicado detectado: "${app.id}"`);
      } else {
        idSet.add(app.id);
      }

      if (app.name === 'Ambientes' || app.url === '/index.html' || app.url === 'index.html' || app.path === 'index.html') {
        logError(`Autorreferência detectada: id "${app.id}", name "${app.name}", url "${app.url}"`);
        selfRefs++;
      }

      if (app.status === 'ready') readyCount++;
      else if (app.status === 'concept') conceptCount++;
      if (app.collection === 'Legado arquivado') archivedCount++;

      // Contradição kind === 'concept' || isConcept === true em status === 'ready'
      if (app.status === 'ready' && (app.kind === 'concept' || app.isConcept === true)) {
        logError(`Contradição concept/ready em "${app.id}": status="ready" mas kind="${app.kind}", isConcept=${app.isConcept}`);
      }

      // Nomes duplicados entre entradas não-arquivadas
      if (app.collection !== 'Legado arquivado' && app.name) {
        if (nonArchivedNames.has(app.name) && nonArchivedNames.get(app.name) !== app.id) {
          logError(`Nome duplicado não-arquivado "${app.name}" em "${nonArchivedNames.get(app.name)}" e "${app.id}" (${relPath})`);
        } else {
          nonArchivedNames.set(app.name, app.id);
        }
      }

      // Validação de capa (thumb)
      if (app.status === 'ready') {
        if (!app.thumb) {
          if (!allowMissingThumbs) {
            logError(`Capa (thumb) ausente para "${app.name}" (${app.id}) em ${relPath}`);
          }
        } else {
          const { target: rootThumb } = resolveCatalogUrl(rootDir, app.thumb);
          const { target: launcherThumb } = resolveCatalogUrl(path.join(rootDir, 'launcher'), app.thumb);
          if (!fs.existsSync(rootThumb)) {
            logError(`Arquivo de capa (thumb) ausente no disco para "${app.id}": ${app.thumb}`);
          }
          if (!fs.existsSync(launcherThumb)) {
            logError(`Arquivo de capa (thumb) ausente em launcher/ para "${app.id}": ${app.thumb}`);
          }
        }
      }

      // Validação de dist/index.html para kind === 'project'
      if (app.kind === 'project' && app.path) {
        const rootDist = path.join(rootDir, app.path, 'dist', 'index.html');
        const launcherDist = path.join(rootDir, 'launcher', app.path, 'dist', 'index.html');
        if (!fs.existsSync(rootDist)) {
          logError(`dist/index.html ausente na raiz para projeto "${app.id}": ${path.relative(rootDir, rootDist)}`);
        }
        if (!fs.existsSync(launcherDist)) {
          logError(`dist/index.html ausente em launcher/ para projeto "${app.id}": ${path.relative(rootDir, launcherDist)}`);
        }
      }

      // Validação de execução e paridade de hash para status === 'ready'
      if (app.status === 'ready' && app.url) {
        const { cleanUrl, target: rootFile } = resolveCatalogUrl(rootDir, app.url);
        const { target: launcherFile } = resolveCatalogUrl(path.join(rootDir, 'launcher'), app.url);

        if (!fs.existsSync(rootFile)) {
          logError(`Arquivo de execução ausente na raiz para "${app.name}" (${app.id}): ${cleanUrl}`);
          missingFiles++;
        }
        if (!fs.existsSync(launcherFile)) {
          logError(`Arquivo de execução ausente em launcher/ para "${app.name}" (${app.id}): ${cleanUrl}`);
          missingFiles++;
        }
        if (fs.existsSync(rootFile) && fs.existsSync(launcherFile)) {
          if (sha256(rootFile) !== sha256(launcherFile)) {
            logError(`Divergência SHA256 entre raiz e launcher/ para "${app.id}": ${cleanUrl}`);
          }
        }

        if (urlSet.has(cleanUrl) && app.id !== urlSet.get(cleanUrl)) {
          logWarning(`URL compartilhada entre apps diferentes: "${cleanUrl}" (apps: ${urlSet.get(cleanUrl)} e ${app.id})`);
        } else {
          urlSet.set(cleanUrl, app.id);
        }
      }

      if (app.status === 'concept' && app.url) {
        logWarning(`Conceito com URL de execução ativa: "${app.name}" (${app.url})`);
      }
    }

    summary[relPath] = { total: apps.length, readyCount, conceptCount, archivedCount, selfRefs, missingFiles };
    log(`Resumo ${relPath}:`);
    log(`  - Prontos (ready): ${readyCount}`);
    log(`  - Conceitos (concept): ${conceptCount}`);
    log(`  - Versões legadas/arquivadas: ${archivedCount}`);
    log(`  - Autorreferências: ${selfRefs}`);
    log(`  - Arquivos ausentes: ${missingFiles}`);
  }

  // Paridade index.html raiz vs launcher/index.html
  const rootIndex = path.join(rootDir, 'index.html');
  const launcherIndex = path.join(rootDir, 'launcher', 'index.html');
  if (fs.existsSync(rootIndex) && fs.existsSync(launcherIndex)) {
    if (sha256(rootIndex) !== sha256(launcherIndex)) {
      logError('Paridade SHA256 falhou: index.html diverge de launcher/index.html.');
    }
  } else if (fs.existsSync(rootIndex) && !fs.existsSync(launcherIndex)) {
    logError('launcher/index.html ausente.');
  }

  // Paridade shared/* vs launcher/shared/* e 01_Jogos_HTML/shared/*
  const sharedDir = path.join(rootDir, 'shared');
  if (fs.existsSync(sharedDir)) {
    for (const rel of collectFilesRecursive(sharedDir)) {
      const srcFile = path.join(sharedDir, rel);
      const launcherFile = path.join(rootDir, 'launcher', 'shared', rel);
      if (!fs.existsSync(launcherFile)) {
        logError(`Arquivo shared ausente em launcher/shared/: ${rel}`);
      } else if (sha256(srcFile) !== sha256(launcherFile)) {
        logError(`Divergência SHA256 em launcher/shared/: ${rel}`);
      }
    }
    for (const name of ['imersivo.js', 'sangi-bridge.js']) {
      const srcFile = path.join(sharedDir, name);
      if (!fs.existsSync(srcFile)) continue;
      if (fs.existsSync(path.join(rootDir, '01_Jogos_HTML'))) {
        const htmlShared = path.join(rootDir, '01_Jogos_HTML', 'shared', name);
        if (!fs.existsSync(htmlShared) || sha256(srcFile) !== sha256(htmlShared)) {
          logError(`Divergência SHA256 em 01_Jogos_HTML/shared/${name}`);
        }
      }
      if (name === 'imersivo.js') {
        const legadoDir = path.join(rootDir, '01_Jogos_HTML', 'Legado_Arquivado', 'ambientes-html', 'shared');
        if (fs.existsSync(legadoDir)) {
          const legadoFile = path.join(legadoDir, 'imersivo.js');
          if (!fs.existsSync(legadoFile) || sha256(srcFile) !== sha256(legadoFile)) {
            logError('Divergência SHA256 em 01_Jogos_HTML/Legado_Arquivado/ambientes-html/shared/imersivo.js');
          }
        }
      }
    }
  }

  // Arquivos órfãos em launcher/*/dist/assets/
  for (const orphan of findOrphanedLauncherAssets(rootDir, path.join(rootDir, 'launcher'))) {
    logError(`Arquivo órfão em launcher: ${orphan}`);
  }

  return { errors, warnings, summary };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const args = new Set(process.argv.slice(2));
  const result = verifyCatalog({
    rootDir: process.cwd(),
    allowMissingThumbs: args.has('--allow-missing-thumbs'),
    quiet: false,
  });

  console.log('\n======================================');
  if (result.errors.length === 0) {
    console.log(`✅ Catálogo validado com sucesso! (Total avisos: ${result.warnings.length})`);
    process.exit(0);
  } else {
    console.error(`❌ [ERRO] Validação falhou com ${result.errors.length} erro(s) e ${result.warnings.length} aviso(s).`);
    process.exit(1);
  }
}
