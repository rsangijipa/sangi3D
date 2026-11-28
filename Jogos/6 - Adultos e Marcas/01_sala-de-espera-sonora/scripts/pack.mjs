import { build } from 'esbuild';
import { readFile,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const here=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFile(new URL('../'+path,import.meta.url));
const source=path=>read(path).then(bytes=>bytes.toString('utf8'));
const inline=text=>text.replace(/<\/script/gi,'<\\/script');
const encode=(bytes,mime)=>'data:'+mime+';base64,'+Buffer.from(bytes).toString('base64');
const options={absWorkingDir:here,bundle:true,minify:true,write:false,format:'esm',legalComments:'inline',
  target:['chrome104','firefox108','safari16.4'],platform:'browser'};
const [scene,app,template,style,brand,still,fraunces,inter,threeLicense,frauncesLicense,interLicense]=await Promise.all([
  build({...options,entryPoints:['src/scene.js']}),
  build({...options,entryPoints:['src/app.js'],external:['sala/scene']}),
  source('src/page.html'),source('src/style.css'),source('src/brand.js'),read('assets/sala-2d.webp').catch(()=>null),
  read('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2'),
  read('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
  source('node_modules/three/LICENSE'),source('node_modules/@fontsource-variable/fraunces/LICENSE'),source('node_modules/@fontsource-variable/inter/LICENSE'),
]);
const fonts=[
  ['Fraunces','100 900',fraunces],['Inter','100 900',inter],
].map(([family,weight,bytes])=>`@font-face{font-family:${family};src:url(${encode(bytes,'font/woff2')}) format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`).join('\n');
const imports={imports:{'sala/scene':encode(scene.outputFiles[0].contents,'text/javascript')}};
const assignments={
  '/*FONTS*/':fonts,
  '/*STYLE*/':style,
  '/*BRAND*/':inline(brand)+'\nwindow.SALA_STILL = '+JSON.stringify(still?encode(still,'image/webp'):'')+';',
  '/*IMPORTS*/':JSON.stringify(imports),
  '/*APP*/':inline(app.outputFiles[0].text),
};
let html=template;
for(const [token,code] of Object.entries(assignments))html=html.replace(token,()=>code);
const licenses=[['Three.js',threeLicense],['Fraunces',frauncesLicense],['Inter',interLicense]];
html=html.replace('</html>',`<!-- Licenças de componentes incorporados\n${licenses.map(([name,body])=>name+'\n'+body).join('\n\n').replaceAll('-->','—>')} -->\n</html>`);
await writeFile(new URL('../sala-de-espera-sonora.html',import.meta.url),html,'utf8');
console.log('sala-de-espera-sonora.html · '+Buffer.byteLength(html)+' bytes · '+(still?'imagem de fallback incorporada':'sem imagem de fallback ainda'));

