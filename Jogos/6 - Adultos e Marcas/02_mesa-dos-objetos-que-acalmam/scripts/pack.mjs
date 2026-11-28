import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFile(new URL('../' + path, import.meta.url));
const source = (path) => read(path).then((bytes) => bytes.toString('utf8'));
const inline = (text) => text.replace(/<\/script/gi, '<\\/script');

const options = {
  absWorkingDir: here,
  bundle: true,
  minify: true,
  write: false,
  format: 'esm',
  legalComments: 'inline',
  target: ['chrome104', 'firefox108', 'safari16.4'],
  platform: 'browser',
};

console.log('[Pack] Empacotando aplicação e Three.js r160...');

const [appBundle, template, style, threeLicense] = await Promise.all([
  build({
    ...options,
    entryPoints: ['src/app.js'],
  }),
  source('src/page.html'),
  source('src/style.css'),
  source('node_modules/three/LICENSE').catch(() => 'MIT License'),
]);

// Remover referências a arquivos locais na página
let html = template;

// Substituir link do style.css pelo estilo inline
html = html.replace('<link rel="stylesheet" href="src/style.css">', () => `<style>\n${style}\n</style>`);

// Remover importmap local já que o Three.js será empacotado inline
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');

// Substituir script src por script inline (usando função para evitar expansão de $ em strings minificadas)
html = html.replace('<script type="module" src="src/app.js"></script>', () => `<script type="module">\n${inline(appBundle.outputFiles[0].text)}\n</script>`);

const licenses = [['Three.js', threeLicense]];
html = html.replace(
  '</html>',
  `<!-- Licenças de componentes incorporados\n${licenses.map(([name, body]) => name + '\n' + body).join('\n\n').replaceAll('-->', '—>')} -->\n</html>`
);

await writeFile(new URL('../mesa-dos-objetos-que-acalmam.html', import.meta.url), html, 'utf8');
console.log('mesa-dos-objetos-que-acalmam.html · ' + Buffer.byteLength(html) + ' bytes gerados com sucesso.');
