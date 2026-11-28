import {mkdir,copyFile} from 'node:fs/promises';
const dest=new URL('../demonstracao/',import.meta.url),media=new URL('media/',dest);
await mkdir(media,{recursive:true});
for(const [from,to] of [
  ['capturas/desktop-interacao.png','desktop.png'],['capturas/celular.png','mobile.png'],
  ['node_modules/gsap/dist/gsap.min.js','gsap.min.js'],
  ['node_modules/@fontsource/bungee/files/bungee-latin-400-normal.woff2','bungee.woff2'],
  ['node_modules/@fontsource-variable/rubik/files/rubik-latin-wght-normal.woff2','rubik.woff2'],
])await copyFile(new URL('../'+from,import.meta.url),new URL(to,media));

