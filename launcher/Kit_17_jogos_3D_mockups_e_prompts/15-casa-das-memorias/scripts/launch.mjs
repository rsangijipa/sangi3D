import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
const child=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,CASA_PORT:'0'},stdio:['inherit','pipe','inherit']});
let opened=false;
createInterface({input:child.stdout}).on('line',line=>{
 console.log(line);
 if(!opened&&/^http:\/\/127\.0\.0\.1:\d+$/.test(line)){
  opened=true;
  const browser=spawn('explorer.exe',[line],{windowsHide:true,stdio:'ignore'});
  browser.on('error',()=>console.log('Abra o endereço acima no navegador.'));
 }
});
child.on('error',e=>{console.error(e.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??0;});
