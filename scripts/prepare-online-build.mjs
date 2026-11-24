import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LAUNCHER = path.join(ROOT, 'launcher');

function copyRecursive(src, dest, ignore = ['node_modules', '.git', '.vite', '_versoes']) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (ignore.some(ig => path.basename(src) === ig)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child), ignore);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('--- 1. Copiando capas duplas para /capas e /launcher/capas ---');
copyRecursive(path.join(LAUNCHER, 'capas'), path.join(LAUNCHER, 'launcher', 'capas'));

console.log('--- 2. Copiando HTMLs avulsos da raiz para launcher/ ---');
const rootHtmls = ['Colmeia Transparente.html', 'Gerador de Mundos Climáticos.html', 'Vulcão em Miniatura.html'];
for (const h of rootHtmls) {
  const p = path.join(ROOT, h);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(LAUNCHER, h));
    console.log(`Copiado: ${h}`);
  }
}

console.log('--- 3. Copiando ambientes-interativos-adultos-e-marcas ---');
copyRecursive(
  path.join(ROOT, 'ambientes-interativos-adultos-e-marcas'),
  path.join(LAUNCHER, 'ambientes-interativos-adultos-e-marcas')
);

console.log('--- 4. Copiando 02_Projetos (sem node_modules) ---');
copyRecursive(
  path.join(ROOT, '02_Projetos'),
  path.join(LAUNCHER, '02_Projetos')
);

console.log('--- 5. Copiando 04-tear-dos-vinculos (dist e assets) ---');
copyRecursive(
  path.join(ROOT, '04-tear-dos-vinculos'),
  path.join(LAUNCHER, '04-tear-dos-vinculos')
);

console.log('--- 6. Copiando Kit_17_jogos_3D_mockups_e_prompts (sem node_modules) ---');
copyRecursive(
  path.join(ROOT, 'Kit_17_jogos_3D_mockups_e_prompts'),
  path.join(LAUNCHER, 'Kit_17_jogos_3D_mockups_e_prompts')
);

console.log('--- 7. Copiando 03_Colecoes (sem node_modules) ---');
copyRecursive(
  path.join(ROOT, '03_Colecoes'),
  path.join(LAUNCHER, '03_Colecoes')
);

console.log('--- 8. Ajustando URLs de /play/ e capas no catálogo apps.json ---');
const appsJsonPath = path.join(ROOT, 'api', 'apps.json');
let apps = JSON.parse(fs.readFileSync(appsJsonPath, 'utf8'));
// Filtra qualquer autorreferência ao index.html
apps = apps.filter(app => app.id !== 'index-html' && app.url !== '/index.html' && app.name !== 'Ambientes');

for (const app of apps) {
  // Ajuste de URLs /play/<id> para apontar diretamente para a pasta dist compilada
  if (app.url && app.url.startsWith('/play/')) {
    const normPath = app.path.replace(/\\/g, '/');
    const directDistUrl = `/${normPath}/dist/index.html`;
    app.url = directDistUrl;
  }
  // Se for conceito sem URL, adicionar marcador explícito
  if (!app.url && app.status === 'concept') {
    app.isConcept = true;
  }
}

const updatedJson = JSON.stringify(apps, null, 2);
fs.writeFileSync(path.join(ROOT, 'api', 'apps.json'), updatedJson, 'utf8');
fs.writeFileSync(path.join(LAUNCHER, 'api', 'apps.json'), updatedJson, 'utf8');
console.log(`Catálogo atualizado: ${apps.length} apps processados.`);

console.log('--- Tudo pronto para sincronização online! ---');
