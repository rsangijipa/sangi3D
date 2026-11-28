import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = fileURLToPath(new URL('../', import.meta.url));
const searchNodeModules = [
  path.join(here, 'node_modules'),
  path.resolve(here, '..', '12_pinball-de-madeira', 'node_modules'),
  path.resolve(here, '..', '01_sala-de-espera-sonora', 'node_modules'),
].filter((dir) => existsSync(dir));

const esbuildDir = searchNodeModules.find((dir) => existsSync(path.join(dir, 'esbuild', 'lib', 'main.js')));
const { build } = esbuildDir
  ? await import(pathToFileURL(path.join(esbuildDir, 'esbuild', 'lib', 'main.js')).href)
  : await import('esbuild');
const threeDir = searchNodeModules.find((dir) => existsSync(path.join(dir, 'three', 'LICENSE')));

const read = (p) => readFile(new URL('../' + p, import.meta.url));
const source = (p) => read(p).then((bytes) => bytes.toString('utf8'));
const inline = (text) => text.replace(/<\/script/gi, '<\\/script');
const encode = (bytes, mime) => 'data:' + mime + ';base64,' + Buffer.from(bytes).toString('base64');

const options = {
  absWorkingDir: here,
  nodePaths: searchNodeModules,
  bundle: true,
  minify: true,
  write: false,
  format: 'esm',
  legalComments: 'inline',
  target: ['chrome104', 'firefox108', 'safari16.4'],
  platform: 'browser',
};

const [appBundle, template, style, brand, still, threeLicense] = await Promise.all([
  build({
    ...options,
    entryPoints: ['src/app.js'],
    external: ['@dimforge/rapier3d-compat'],
  }),
  source('src/page.html'),
  source('src/style.css'),
  source('src/brand.js'),
  read('26a63d91-3c0a-4444-b6ef-799d8a80e009.webp').catch(() => null),
  (threeDir ? readFile(path.join(threeDir, 'three', 'LICENSE'), 'utf8') : source('node_modules/three/LICENSE')).catch(() => 'MIT License'),
]);

const importMap = {
  imports: {
    '@dimforge/rapier3d-compat': 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.14.0/rapier.es.js',
  },
};

const assignments = {
  '/*FONTS*/': '',
  '/*STYLE*/': style,
  '/*BRAND*/': inline(brand).replace(/^export\s+/gm, '') + '\nwindow.ROCHAS_STILL = ' + JSON.stringify(still ? encode(still, 'image/webp') : '') + ';',
  '/*IMPORTS*/': JSON.stringify(importMap, null, 2),
  '/*APP*/': inline(appBundle.outputFiles[0].text),
};

let html = template;
for (const [token, code] of Object.entries(assignments)) {
  html = html.replace(token, () => code);
}

const licenses = [['Three.js', threeLicense]];
html = html.replace(
  '</html>',
  `<!-- Licenças de componentes incorporados\n${licenses.map(([name, body]) => name + '\n' + body).join('\n\n').replaceAll('-->', '—>')} -->\n</html>`
);

await writeFile(new URL('../rochas-em-equilibrio.html', import.meta.url), html, 'utf8');
console.log('rochas-em-equilibrio.html · ' + Buffer.byteLength(html) + ' bytes gerados com sucesso.');
