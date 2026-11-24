// scripts/promote-batch2.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_FOLDERS = [
  '04_maquina-de-escrever-das-intencoes',
  '05_clepsidra-do-foco',
  '07_copos-musicais',
  '08_toca-discos-de-vinil',
  '10_maquina-de-reacao-em-cadeia',
  '11_relogio-aberto',
  '14_bancada-da-manicure',
  '15_barista-de-bancada',
  '18_orgao-do-perfumista'
];

console.log('--- Promovendo Lote 2 (Adultos e Marcas - 9 ambientes) ---');

// 1. Espelhar arquivos HTML para launcher/
for (const folder of TARGET_FOLDERS) {
  const src = path.join(ROOT, 'ambientes-interativos-adultos-e-marcas', 'ambientes-interativos-adultos-e-marcas', folder, 'index.html');
  const destDir = path.join(ROOT, 'launcher', 'ambientes-interativos-adultos-e-marcas', 'ambientes-interativos-adultos-e-marcas', folder);
  const dest = path.join(destDir, 'index.html');

  if (!fs.existsSync(src)) {
    console.error(`❌ Fonte não encontrada: ${src}`);
    process.exit(1);
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`✅ Espelhado: ${folder}/index.html -> launcher/`);
}

// 2. Atualizar manifestos
const CATALOG_PATHS = [
  path.join(ROOT, 'api', 'apps.json'),
  path.join(ROOT, 'launcher', 'api', 'apps.json')
];

for (const catPath of CATALOG_PATHS) {
  const apps = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  let updatedCount = 0;

  for (const app of apps) {
    for (const folder of TARGET_FOLDERS) {
      if (app.id && app.id.includes(folder)) {
        app.status = 'ready';
        app.kind = 'game';
        app.isConcept = false;
        app.url = `/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/${folder}/index.html`;
        app.path = `ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/${folder}/index.html`;
        app.mtime = Date.now();
        updatedCount++;
      }
    }
  }

  fs.writeFileSync(catPath, JSON.stringify(apps, null, 2), 'utf8');
  console.log(`✅ Atualizado ${path.relative(ROOT, catPath)}: ${updatedCount} entradas promovidas para 'ready'.`);
}

console.log('--- Promoção do Lote 2 concluída com sucesso! ---');
