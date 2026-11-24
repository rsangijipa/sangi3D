import { readdir, readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { join } from 'node:path';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','assets']) await cp(file,join('dist',file),{recursive:true});
async function compile(dir) {
 await mkdir(join('dist',dir),{recursive:true});
 for(const entry of await readdir(dir,{withFileTypes:true})) {
  const path=join(dir,entry.name);
  if(entry.isDirectory()) await compile(path);
  else if(path.endsWith('.ts')) {
   const source=await readFile(path,'utf8');
   await writeFile(join('dist',path.replace(/\.ts$/,'.js')),stripTypeScriptTypes(source).replace(/(from ['"][^'"]+)\.ts(['"])/g,'$1.js$2'));
  }
 }
}
for(const dir of ['game','scene','ui','input','audio']) await compile(dir);
await writeFile('dist/main.js',stripTypeScriptTypes(await readFile('main.ts','utf8')).replace(/(from ['"][^'"]+)\.ts(['"])/g,'$1.js$2'));
