// scripts/verify-catalog.mjs
// Validador automatizado da integridade do catálogo do Sangi3D
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CATALOG_PATHS = [
  path.join(ROOT, 'api', 'apps.json'),
  path.join(ROOT, 'launcher', 'api', 'apps.json')
];

let totalErrors = 0;
let totalWarnings = 0;

function logError(msg) {
  console.error(`❌ [ERRO] ${msg}`);
  totalErrors++;
}

function logWarning(msg) {
  console.warn(`⚠️ [AVISO] ${msg}`);
  totalWarnings++;
}

function logSuccess(msg) {
  console.log(`✅ ${msg}`);
}

for (const catPath of CATALOG_PATHS) {
  const relPath = path.relative(ROOT, catPath);
  console.log(`\n--- Validando catálogo: ${relPath} ---`);
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

  console.log(`Total de entradas listadas: ${apps.length}`);
  const idSet = new Set();
  const urlSet = new Map();

  let readyCount = 0;
  let conceptCount = 0;
  let archivedCount = 0;
  let missingFiles = 0;
  let selfRefs = 0;

  for (const app of apps) {
    // 1. Verificação de ID obrigatório e estável
    if (!app.id) {
      logError(`Entrada sem 'id': "${app.name || app.fullTitle}"`);
    } else if (idSet.has(app.id)) {
      logError(`ID duplicado detectado: "${app.id}"`);
    } else {
      idSet.add(app.id);
    }

    // 2. Verificação de autorreferência ao Launcher
    if (app.name === 'Ambientes' || app.url === '/index.html' || app.url === 'index.html' || app.path === 'index.html') {
      logError(`Autorreferência detectada: id "${app.id}", name "${app.name}", url "${app.url}"`);
      selfRefs++;
    }

    // 3. Status e contagem
    if (app.status === 'ready') readyCount++;
    else if (app.status === 'concept') conceptCount++;
    if (app.collection === 'Legado arquivado') archivedCount++;

    // 4. Verificação de existência física do arquivo se status === 'ready'
    if (app.status === 'ready' && app.url) {
      // url é tipicamente /01_Jogos_HTML/... ou /02_Projetos/...
      const cleanUrl = app.url.split('?')[0].split('#')[0];
      const localFile = path.join(ROOT, decodeURIComponent(cleanUrl).replace(/^\//, ''));
      if (!fs.existsSync(localFile)) {
        // Tenta verificar se existe em launcher/
        const altFile = path.join(ROOT, 'launcher', decodeURIComponent(cleanUrl).replace(/^\//, ''));
        if (!fs.existsSync(altFile)) {
          logWarning(`Arquivo de execução não encontrado no disco para "${app.name}" (${app.id}): ${cleanUrl}`);
          missingFiles++;
        }
      }

      if (urlSet.has(cleanUrl) && app.id !== urlSet.get(cleanUrl)) {
        logWarning(`URL compartilhada entre apps diferentes: "${cleanUrl}" (apps: ${urlSet.get(cleanUrl)} e ${app.id})`);
      } else {
        urlSet.set(cleanUrl, app.id);
      }
    }

    // 5. Verificação de conceitos: não devem fingir ter arquivo executável pronto
    if (app.status === 'concept' && app.url) {
      logWarning(`Conceito com URL de execução ativa: "${app.name}" (${app.url})`);
    }
  }

  console.log(`Resumo ${relPath}:`);
  console.log(`  - Prontos (ready): ${readyCount}`);
  console.log(`  - Conceitos (concept): ${conceptCount}`);
  console.log(`  - Versões legadas/arquivadas: ${archivedCount}`);
  console.log(`  - Autorreferências: ${selfRefs}`);
  console.log(`  - Arquivos ausentes: ${missingFiles}`);
}

console.log('\n======================================');
if (totalErrors === 0) {
  logSuccess(`Catálogo validado com sucesso! (Total avisos: ${totalWarnings})`);
  process.exit(0);
} else {
  logError(`Validação falhou com ${totalErrors} erro(s) e ${totalWarnings} aviso(s).`);
  process.exit(1);
}
