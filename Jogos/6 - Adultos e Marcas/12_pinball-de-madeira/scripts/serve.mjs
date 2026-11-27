import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const html=new URL('../pinball-de-madeira.html',import.meta.url);
const port=Number(process.env.PINBALL_PORT||4420);
const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://127.0.0.1').pathname;
  if(path==='/teste-iframe'){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end('<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><style>html,body,iframe{height:100%;width:100%;border:0;margin:0}</style><iframe title="Pinball incorporado" src="/?embed=1&modo=2d&diagnostico=1"></iframe>');
    return;
  }
  if(path!=='/'&&path!=='/pinball-de-madeira.html'){res.writeHead(404).end();return;}
  try{
    const page=await readFile(html);
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:page);
  }catch{res.writeHead(503).end('Gere o HTML antes de iniciar a prévia.');}
});
server.listen(port,'127.0.0.1',()=>console.log('Pinball de Madeira · http://127.0.0.1:'+port+'/'));
