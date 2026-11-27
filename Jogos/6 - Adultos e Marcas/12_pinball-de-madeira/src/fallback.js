import { rails, flippers, rampPath, radius, start, posts } from './layout';
export function makeFallback(holder,brand,request){
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  canvas.className='board2d';canvas.setAttribute('aria-hidden','true');holder.append(canvas);
  let width=0,height=0,scale=1,left=0,top=0,last;
  const px=x=>left+(x+1.52)*scale, py=z=>top+(z+2.66)*scale;
  const ro=new ResizeObserver(()=>{width=holder.clientWidth;height=holder.clientHeight;canvas.width=width;canvas.height=height;request();});
  ro.observe(holder);
  function circle(x,z,r,color,edge){ctx.beginPath();ctx.arc(px(x),py(z),r*scale,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(edge){ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.stroke();}}
  function line(points,color,weight){
    ctx.strokeStyle=color;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=weight*scale;ctx.beginPath();
    points.forEach(([x,z],i)=>i===0?ctx.moveTo(px(x),py(z)):ctx.lineTo(px(x),py(z)));ctx.stroke();
  }
  function draw(state){
    if(state)last=state;if(!last||!width||!height)return;
    const s=last;
    scale=Math.min(width*.72/3.04,height*.73/5.33);
    const small=width<720;
    if(small)scale=Math.min(width*.87/3.04,height*.625/5.33);
    left=width*(small?.5:.67)-1.52*scale;top=height*(small?.238:.134);
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='#2b1c16';ctx.strokeStyle=brand.cores.metal;ctx.lineWidth=3;
    ctx.beginPath();ctx.roundRect(left,top,3.04*scale,5.35*scale,10);ctx.fill();ctx.stroke();
    const wood=ctx.createLinearGradient(left,top,left+3.04*scale,top+5.3*scale);
    wood.addColorStop(0,brand.cores.madeira);wood.addColorStop(.45,'#deb282');wood.addColorStop(1,'#a56e47');
    ctx.fillStyle=wood;ctx.beginPath();ctx.roundRect(px(-1.38),py(-2.48),2.76*scale,5.02*scale,7);ctx.fill();
    for(let i=0;i<31;i++){
      const x=-1.37+i*.09;
      ctx.strokeStyle=i%3?'#8f582d38':'#f5c89162';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px(x),py(-2.4));ctx.bezierCurveTo(px(x+.06),py(-.4),px(x-.04),py(1.27),px(x+.03),py(2.49));ctx.stroke();
    }
    ctx.fillStyle=brand.cores.verniz;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 '+Math.round(scale*.257)+'px Bungee, sans-serif';
    ctx.fillText(brand.textos.letreiro.at(-1),px(-.12),py(.60),1.75*scale);
    for(const rail of rails){line(rail.points,'#482618',rail.width*2.8);line(rail.points,'#f3c57b',rail.width*1.5);}
    for(const p of posts)circle(...p,.053,'#b47f48','#6d4220');
    for(const b of brand.mesa.bumpers){
      const lit=s.time-(s.hits[b.id]??-9)<.4;
      circle(b.x,b.z,.236,'#815628','#ffd38d');
      circle(b.x,b.z,.185,lit?brand.cores.destaque:b.color,lit?'#fff7df':'#9f6435');
      if(lit)circle(b.x,b.z,.105,'#fff4d4');
    }
    for(const b of brand.mesa.alvos){ctx.fillStyle=s.time-(s.hits[b.id]??-9)<.4?'#fff3c1':'#a9532a';ctx.fillRect(px(b.x-.08),py(b.z-.051),.16*scale,.102*scale);}
    for(const f of flippers){
      const n=flippers.indexOf(f),a=s.angles[n],tip=[f.x+.54*Math.cos(a),f.z+.54*Math.sin(a)];
      line([[f.x,f.z],tip],'#7e4328',.151);line([[f.x,f.z],tip],'#ffe6b3',.110);
    }
    for(const shift of [-.065,.065])line(rampPath.map(([x,,z])=>[x+shift,z]),'#bea483',.018);
    line([[start.x,2.12],[start.x,2.65+s.charge*.2]],'#593323',.095);
    if(s.phase!=='fim'&&s.phase!=='dreno'){
      const p=s.phase==='rampa'?rampPath[Math.min(rampPath.length-1,Math.round(s.ramp*(rampPath.length-1)))]:[s.x,0,s.z];
      circle(p[0],p[2],radius,'#efeaea','#352819');
      circle(p[0]-.017,p[2]-.023,.024,'#fff');
    }
  }
  const point=()=>[px(start.x),py(2.50)];
  return {canvas,draw,point,plungerAt(x,y){return Math.hypot(x-point()[0],y-point()[1])<=34;},quality(){},detect:()=> 'leve',glowing:()=>false,dispose(){ro.disconnect();canvas.remove();}};
}

