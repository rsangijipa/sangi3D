import { build } from 'esbuild';
import { readFile,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const here=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFile(new URL('../'+path,import.meta.url));
const source=path=>read(path).then(bytes=>bytes.toString('utf8'));
const inline=text=>text.replace(/<\/script/gi,'<\\/script');
const encode=(bytes,mime)=>'data:'+mime+';base64,'+Buffer.from(bytes).toString('base64');
const options={absWorkingDir:here,bundle:true,minify:true,write:false,format:'esm',legalComments:'inline',target:['chrome104','firefox108','safari16.4'],platform:'browser'};
const modules=['scene','physics'];
const [bundles,app,template,style,brand,still,bungee,rubik,licenses]=await Promise.all([
  Promise.all(modules.map(name=>build({...options,entryPoints:['src/'+name+'.js']}))),
  build({...options,entryPoints:['src/app.js'],external:modules.map(n=>'pinball/'+n)}),
  source('src/page.html'),source('src/style.css'),source('src/brand.js'),
  read('assets/mesa-2d.webp').catch(()=>null),
  read('node_modules/@fontsource/bungee/files/bungee-latin-400-normal.woff2'),
  read('node_modules/@fontsource-variable/rubik/files/rubik-latin-wght-normal.woff2'),
  Promise.all([
    ['Three.js','node_modules/three/LICENSE'],
    ['Rapier','assets/RAPIER-LICENSE.txt'],
    ['Bungee','node_modules/@fontsource/bungee/LICENSE'],
    ['Rubik','node_modules/@fontsource-variable/rubik/LICENSE'],
  ].map(async ([name,path])=>[name,await source(path)])),
]);
const fonts=[
  ['Bungee',400,bungee],['Rubik','300 900',rubik],
].map(([family,weight,bytes])=>`@font-face{font-family:${family};src:url(${encode(bytes,'font/woff2')}) format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`).join('\n');
const imports={imports:Object.fromEntries(modules.map((name,i)=>['pinball/'+name,encode(bundles[i].outputFiles[0].contents,'text/javascript')]))};
const assignments={
  '/*FONTS*/':fonts, '/*STYLE*/':style,
  '/*BRAND*/':inline(brand)+'\nwindow.PINBALL_STILL = '+JSON.stringify(still?encode(still,'image/webp'):'')+';',
  '/*IMPORTS*/':JSON.stringify(imports),
  '/*APP*/':inline(app.outputFiles[0].text),
};
let html=template;
for(const [token,code] of Object.entries(assignments))html=html.replace(token,()=>code);
html=html.replace('</html>',`<!-- Licenças de componentes incorporados\n${licenses.map(([name,body])=>name+'\n'+body).join('\n\n').replaceAll('-->','—>')} -->\n</html>`);
await writeFile(new URL('../pinball-de-madeira.html',import.meta.url),html,'utf8');
console.log('pinball-de-madeira.html · '+Buffer.byteLength(html)+' bytes · '+(still?'imagem de fallback incorporada':'sem imagem de fallback ainda'));
