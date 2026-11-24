import * as T from 'three';
import { mesh, rbox, lathe, cylinderBetween, taperedTube, mergeStatic, canvasTexture } from './core/model';
import { rng } from './core/noise';
import { makeTexSet, woodSampler, plasterSampler, fabricSampler, barkSampler, paperSampler, pbrMaterial, physicalMaterial, withRepeat } from './core/pbr';

const v=(x,y,z)=>new T.Vector3(x,y,z);
const rgba=(color,alpha)=>'rgba('+color+','+alpha+')';
const gold=new T.Color('#f2bd82');
const block=(w,h,d,mat,x,y,z,bevel=.022)=>mesh(rbox(w,h,d,bevel,2),mat,x,y,z);
const group=(name,x=0,y=0,z=0)=>{
  const g=new T.Group(); g.name=name; g.position.set(x,y,z); return g;
};
const plain=(color,roughness=.88,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
function batch(parent) {
  const geometries=new Set();
  parent.traverse(child=>{if(child.isMesh&&!child.isInstancedMesh)geometries.add(child.geometry);});
  const merged=mergeStatic(parent,true,true);
  geometries.forEach(g=>g.dispose());
  parent.clear();
  parent.add(merged);
}
function makeMaterials() {
  const make=(fn,normalStrength=1,size=512)=>makeTexSet({size,aniso:4,sample:fn,normalStrength});
  const wall=make(plasterSampler('#96806d',11,.75),.8);
  const walnut=make(woodSampler({light:'#a26b42',dark:'#3a2218',seed:19}),1.2);
  const oak=make(woodSampler({light:'#bd8852',dark:'#735036',seed:7}),.95);
  const velvet=make(fabricSampler('#93916e',22,118),.72);
  const linen=make(fabricSampler('#bda789',8,145),1);
  const shag=make(fabricSampler('#9d8164',13,85),1.8);
  const brick=make(plasterSampler('#bd8a68',6,2.4),1.1);
  const bark=make(barkSampler(36),1,256);
  const paper=make(paperSampler('#c4ae88',19),.8,256);
  return {
    wall:pbrMaterial(wall,{roughness:.97},.34),
    oak:pbrMaterial(oak,{roughness:.75,metalness:0}),
    walnut:pbrMaterial(walnut,{roughness:.68}),
    walnutDark:pbrMaterial(walnut,{color:'#765241',roughness:.82}),
    upholstery:physicalMaterial(withRepeat(velvet,2.05,2.05),{roughness:.91,sheen:.92,sheenColor:new T.Color('#a7a27b'),sheenRoughness:.84},.27),
    textile:physicalMaterial(linen,{roughness:.98,sheen:.42,sheenColor:new T.Color('#e9ca98')},.31),
    linen:pbrMaterial(linen,{roughness:.94,emissive:'#fbc585',emissiveIntensity:.48},.32),
    rug:pbrMaterial(shag,{color:'#c7b19b',roughness:1}),
    brick:pbrMaterial(brick,{roughness:.93}),
    bark:pbrMaterial(bark,{color:'#513329',roughness:1}),
    face:pbrMaterial(paper,{color:'#cbb498',roughness:.85}),
    brass:plain('#b78552',.39,.76),
    bronze:plain('#604331',.58,.61),
    frame:plain('#2a2524',.72,.24),
    ash:plain('#1c1410',.94),
    mortar:plain('#654a3b',.98),
    seam:plain('#736447',1),
  };
}
function instanced(geometry, material, specs, name) {
  const result=new T.InstancedMesh(geometry,material,specs.length);
  result.name=name;
  const dummy=new T.Object3D();
  specs.forEach(({p,s,r,c},i)=>{
    dummy.position.set(...p); dummy.scale.set(...(s||[1,1,1])); dummy.rotation.set(...(r||[0,0,0])); dummy.updateMatrix();
    result.setMatrixAt(i,dummy.matrix); if(c)result.setColorAt(i,new T.Color(c));
  });
  result.castShadow=true; result.receiveShadow=true;
  return result;
}
function architecture(m) {
  const shell=group('alvenaria');
  shell.add(block(5.79,4.5,.24,m.wall,-2.61,2.23,-2.73,.012));
  shell.add(block(.68,4.50,.24,m.wall,4.23,2.23,-2.73,.012));
  shell.add(block(4.54,.20,.24,m.wall,2.43,4.35,-2.73,.012));
  shell.add(block(4.44,.13,.24,m.wall,2.25,.039,-2.73,.013));
  shell.add(block(9.95,.12,.21,m.walnutDark,-.07,.105,-2.55,.014));
  shell.add(block(.18,4.6,6.8,m.wall,-5.47,2.18,.54,.012));
  shell.add(block(.17,4.6,6.8,m.wall,4.59,2.18,.54,.012));
  shell.add(block(10.1,.25,7.1,m.wall,-.4,4.47,.48,.025));
  batch(shell);
  const rand=rng(26), boards=[];
  for(let row=0;row<29;row++){
    for(let i=0;i<7;i++){
      const shade=rand();
      boards.push({p:[-5.85+i*1.58+(row%3)*.52,-.036+i*.00006,3.72-row*.269],
        s:[1.56,.075,.263],c:[1-shade*.26,.90-shade*.25,.79-shade*.21]});
    }
  }
  const floor=instanced(rbox(1,1,1,.017,1),m.oak,boards.map(board=>({...board,c:new T.Color(...board.c)})),'parquete');
  floor.castShadow=false; shell.add(floor);
  return shell;
}

function cityTexture() {
  return canvasTexture(1024,1024,ctx=>{
    const random=rng(71);
    const sky=ctx.createLinearGradient(0,0,0,1024);
    sky.addColorStop(0,'#1d344a');sky.addColorStop(.35,'#365b77');sky.addColorStop(.62,'#55738d');sky.addColorStop(1,'#151d2b');
    ctx.fillStyle=sky;ctx.fillRect(0,0,1024,1024);
    for(let i=0;i<56;i++){
      const x=random()*1024,y=random()*750, radius=95+random()*220;
      const mist=ctx.createRadialGradient(x,y,0,x,y,radius);
      mist.addColorStop(0,i%2?'#a9b1ad11':'#17294335');mist.addColorStop(1,'#0e1d2d00');
      ctx.fillStyle=mist;ctx.fillRect(x-radius,y-radius,2*radius,2*radius);
    }
    for(let row=0;row<3;row++){
      ctx.save();ctx.filter='blur('+[7,4,2][row]+'px)';
      for(let i=0;i<16;i++){
        const x=i*74-37+random()*30,y=356+row*122+random()*190,w=35+random()*71;
        ctx.fillStyle=['#334553','#263240','#14232f'][row];
        ctx.fillRect(x,y,w,1024-y);
        if(i%4===0)ctx.fillRect(x+w*.53,y-34,w*.18,44);
        for(let k=0;k<12;k++){
          const sx=x+12+random()*(w-17),sy=y+18+random()*250;
          if(sy>1000)continue;
          const color=k%4===0?'201,225,239':'249,192,112';
          const g=ctx.createRadialGradient(sx,sy,0,sx,sy,5+row*2);
          g.addColorStop(0,rgba(color,.68));g.addColorStop(.3,rgba(color,.55));g.addColorStop(1,rgba(color,0));
          ctx.fillStyle=g;ctx.fillRect(sx-11,sy-11,22,22);
        }
      }
      ctx.restore();
    }
    for(let i=0;i<90;i++){
      const x=random()*1024,y=464+random()*539,r=2+random()*7;
      const c=i%4===0?'163,202,236':i%6===0?'220,105,59':'248,206,144';
      const g=ctx.createRadialGradient(x,y,0,x,y,r*2.7);
      g.addColorStop(0,rgba(c,.87));g.addColorStop(.32,rgba(c,.8));g.addColorStop(.56,rgba(c,.35));g.addColorStop(1,rgba(c,0));
      ctx.fillStyle=g;ctx.fillRect(x-r*3,y-r*3,r*6,r*6);
    }
  });
}
function windowGlass(m) {
  const g=group('janela',2.17,2.18,-2.54);
  const width=4.07,height=4.15;
  const material=new T.ShaderMaterial({
    uniforms:{uCity:{value:cityTexture()},uTime:{value:0},uRain:{value:.48},uOpen:{value:.36}},
    vertexShader:`varying vec2 uvGlass;
      void main(){uvGlass=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 uvGlass;
      uniform sampler2D uCity;uniform float uTime,uRain,uOpen;
      float hash(vec2 n){return fract(sin(dot(n,vec2(127.1,311.7)))*43758.5453);}
      vec3 drops(vec2 uv,float size,float speed){
        vec2 s=uv*vec2(size,size*.76);vec2 ix=floor(s);float phase=hash(vec2(ix.x,ix.y)*.82+.2);
        vec2 p=fract(s)-.5;
        float x=(phase-.5)*.67;
        float y=.46-fract(phase+uTime*speed)*.94;
        vec2 d=(p-vec2(x,y))*vec2(1.,.68);
        float grain=hash(ix+8.);
        float r=.046+.064*grain;
        float bead=1.-smoothstep(r*.65,r,length(d));
        float tail=(1.-smoothstep(.009,.034,abs(d.x)))*smoothstep(0.,.034,d.y)*(1.-smoothstep(.064,.398,d.y))*.59;
        float spec=(1.-smoothstep(r*.06,r*.51,length(d+vec2(.018,-.025))))*.24;
        return vec3(d*(bead+tail),spec+tail*.104+bead*.054);
      }
      void main(){
        vec2 uv=uvGlass;
        vec3 a=drops(uv,43.,.14), b=drops(uv+vec2(.195,.013),83.,0.045), c=drops(uv+vec2(.305,.272),21.,.068);
        vec2 off=(a.xy*.038+b.xy*.013+c.xy*.047)*(0.43+uRain*.72);
        vec3 city=texture2D(uCity,clamp(uv-off,0.,1.)).rgb;
        float reflection=.023*exp(-40.*pow(uv.x-.84+.036*uv.y,2.));
        city=city*.86+vec3(.02,.033,.046)+vec3(.83,.65,.44)*reflection;
        city+=vec3(.62,.75,.85)*(a.z*.73+b.z*.42+c.z*.39)*(.39+uRain*.87+uOpen*.19);
        gl_FragColor=vec4(city,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  g.add(mesh(new T.PlaneGeometry(width,height),material,0,0,-.004));
  for(const x of [-width/2,-.14,width/2])g.add(block(.095,height+.12,.14,m.frame,x,0,.06,.012));
  for(const y of [-height/2,height/2])g.add(block(width+.16,.11,.21,m.walnutDark,0,y,.082,.01));
  for(const x of [-width/2+.074,-.14+.062,width/2-.071]){
    const gasket=block(.015,height-.04,.012,m.bronze,x,0,.141,.006);
    g.add(gasket);
  }
  g.add(block(.038,.29,.07,m.bronze,-.27,-.08,.183,.013));
  return { group:g,material };
}
function curtains(m){
  const root=group('cortina',4.00,0,-2.23);
  const geo=new T.PlaneGeometry(1.17,4.33,86,24);
  const pos=geo.getAttribute('position');
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),y=pos.getY(i);
    const u=(x+.585)/1.17;
    const folds=Math.sin(u*36.+y*.36)*.116 + Math.cos(u*63.-y*.68)*.029;
    pos.setXYZ(i,x+.038*Math.sin(y*1.9+u*12.),y+.025*Math.sin(u*67.)*(1-(y+2.165)/4.33),folds*(1.02-.07*y));
  }
  geo.computeVertexNormals();
  const mat=m.textile.clone();mat.side=T.DoubleSide;
  const fabric=mesh(geo,mat,0,2.178,0);
  root.add(fabric);
  return {root,fabric,mat};
}
function carpet(m) {
  const g=group('tapete',.59,.018,.44);
  const rug=block(6.55,.069,3.20,m.rug,0,.012,0,.032);
  rug.receiveShadow=true;
  g.add(rug);
  const tex=canvasTexture(768,384,ctx=>{
    const rand=rng(39);
    ctx.fillStyle='#887057';ctx.fillRect(0,0,768,384);
    for(let i=0;i<39000;i++){
      const x=rand()*768,y=rand()*384,l=1+rand()*3,n=34+rand()*28;
      ctx.strokeStyle='hsl('+(29+rand()*10)+' 22% '+n+'%)';
      ctx.lineWidth=.4+rand();
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+l,y+(rand()-.5)*3.1);ctx.stroke();
    }
  });
  m.rug.map=tex;m.rug.bumpMap=tex;m.rug.bumpScale=.032;
  const fringes=[];
  for(let i=0;i<150;i++){
    const random=rng(i+40);
    for(const side of [-1,1])fringes.push({p:[(i-74.5)*.043,.012,side*(1.617+random()*.033)],
      s:[.012,.013,.075+random()*.051],r:[0,(random()-.5)*.56,0],c:new T.Color(.62+random()*.19,.53,.40)});
  }
  const tassels=instanced(new T.BoxGeometry(1,1,1),m.rug,fringes,'franja');tassels.castShadow=false;g.add(tassels);
  return g;
}

function fireMat() {
  return new T.ShaderMaterial({
    uniforms:{uTime:{value:0},uPower:{value:.51},uSeed:{value:0}},
    transparent:true, depthWrite:false, side:T.DoubleSide, blending:T.AdditiveBlending,
    vertexShader:`varying vec2 fUv;void main(){fUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 fUv;uniform float uTime,uPower,uSeed;
      float hash(vec2 p){return fract(sin(dot(p,vec2(145.5,37.12)))*7532.2);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
      void main(){
        vec2 p=fUv;float t=uTime;float y=p.y;
        float n=noise(vec2(p.x*6.+uSeed,y*5.-t*2.1))*.58+noise(vec2(p.x*12.-uSeed,y*10.-t*4.1))*.32;
        float wave=(sin(y*13.-t*2.7+uSeed)*.069+sin(y*21.+t*1.6)*.038)*y;
        float width=(.16+.13*n)*pow(1.-y,.52);
        float tongue=abs(p.x-.5+wave+(n-.48)*y*.40);
        float edge=1.-smoothstep(width*.53,width,tongue);
        float top=1.-smoothstep(.58+.37*n,.84+.22*n,y);
        float folds=.55+.70*noise(vec2(p.x*9.+uSeed,y*8.-t*3.6));
        float alpha=edge*top*smoothstep(0.,.12,y)*(.41+.59*folds)*uPower;
        vec3 orange=vec3(1.65,.28,.027), yellow=vec3(2.45,1.26,.27), white=vec3(2.24,1.85,.96);
        vec3 c=mix(yellow,orange,smoothstep(.32,.9,y+n*.28));
        c=mix(c,white,(1.-smoothstep(.04,.58,y))*edge*.7);
        gl_FragColor=vec4(c,alpha);
      }`,
  });
}
function fireplace(m){
  const g=group('lareira',-3.51,0,-1.81);
  g.rotation.y=-.06;
  const structure=group('corpo_lareira'), rand=rng(13);
  structure.add(
    block(2.76,.15,1.19,m.mortar,0,.081,.18,.021),
    block(.56,1.82,.62,m.mortar,-1.04,1.0,.02,.022),
    block(.55,1.82,.62,m.mortar,1.04,1.0,.02,.022),
    block(2.59,.57,.65,m.mortar,0,1.53,0,.03),
    block(1.95,1.36,.16,m.ash,0,.765,-.44,.026),
    block(2.84,.125,.82,m.walnutDark,0,1.88,.025,.016),
    block(2.72,.055,.71,m.walnut,0,1.977,.022,.018),
    block(1.70,.06,.65,m.brick,0,.162,.08,.019),
  );
  batch(structure);g.add(structure);
  const bricks=[];
  function pattern(rows,cols,left,bottom,z,stepX,stepY,depth){
    for(let row=0;row<rows;row++){
      for(let col=0;col<cols;col++){
        const offset=row%2?.5:0;
        const raw=(col+offset)*stepX;
        const width=col===cols-1&&offset?stepX*.47:stepX*.94;
        const r=rand();
        bricks.push({p:[left+raw+width/2,bottom+row*stepY,z+(rand()-.5)*.010],s:[width,stepY*.88,depth],
          r:[0,0,(rand()-.5)*.025],c:new T.Color(.52+r*.28,.34+r*.26,.31+r*.23)});
        if(col===0&&offset)bricks.push({p:[left+stepX*.23,bottom+row*stepY,z],s:[stepX*.43,stepY*.88,depth],
          c:new T.Color(.57,.48,.43)});
      }
    }
  }
  pattern(12,2,-1.35,.205,.34,.300,.125,.132);
  pattern(12,2,.75,.205,.34,.300,.125,.132);
  pattern(3,8,-1.34,1.53,.35,.333,.123,.148);
  pattern(10,7,-.84,.248,-.29,.24,.121,.093);
  pattern(1,11,-1.44,.22,.65,.261,.085,.17);
  const brickMesh=instanced(rbox(1,1,1,.072,2),m.brick,bricks,'tijolos');g.add(brickMesh);
  for(const x of [-.73,.73]){
    const lin=instanced(rbox(1,1,1,.055,1),m.brick,Array.from({length:50},(_,i)=>{
      const level=Math.floor(i/5), column=i%5;
      return {p:[x,.26+level*.121,-.22+column*.119],s:[.135,.102,.116],c:new T.Color(.63,.45,.33)};
    }),'revestimento_interno');g.add(lin);
  }
  const grate=group('grelha');
  for(let i=0;i<9;i++){
    const x=(i-4)*.143;
    grate.add(mesh(taperedTube([v(x,.19,-.12),v(x,.22,.32),v(x,.34,.46)],()=>.014,{radial:6,segments:8}),m.frame));
  }
  const end=plain('#6e4931');
  for(let i=0;i<6;i++){
    const a=v(-.50+rand()*.27,.21+i*.036,-.13+rand()*.32);
    const b=v(.47-rand()*.24,.26+i*.037,.02+rand()*.33);
    const radius=.051+rand()*.028;
    grate.add(cylinderBetween(a,b,radius,m.bark,12));
    const cap=mesh(new T.CircleGeometry(radius*.79,14),end,b.x,b.y,b.z);
    cap.quaternion.setFromUnitVectors(v(0,0,1),b.clone().sub(a).normalize());
    grate.add(cap);
  }
  batch(grate);g.add(grate);
  const flames=[];
  for(let i=0;i<7;i++){
    const h=.54+rand()*.53;
    const mat=fireMat();
    mat.uniforms.uSeed.value=i*4.771;
    const f=mesh(new T.PlaneGeometry(.31+rand()*.20,h),mat,-.54+i*.18,.30+h*.5,.25+rand()*.15);
    f.rotation.y=(rand()-.5)*.75;
    flames.push(f);g.add(f);
  }
  const embers=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:'#ff923c',size:.021,
    transparent:true,opacity:.74,depthWrite:false,blending:T.AdditiveBlending}));
  const emberPos=new Float32Array(49*3), emberSeed=Array.from({length:49},()=>[rand(),rand(),rand()]);
  embers.geometry.setAttribute('position',new T.BufferAttribute(emberPos,3));
  embers.frustumCulled=false;g.add(embers);
  const light=new T.PointLight('#ff943e',9.3,3.35,2);light.position.set(0,.66,.55);g.add(light);
  const glowMap=canvasTexture(128,128,ctx=>{
    const gradient=ctx.createRadialGradient(64,64,3,64,64,64);
    gradient.addColorStop(0,'#f6913d80');gradient.addColorStop(.32,'#eb7d2945');gradient.addColorStop(1,'#e5732300');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  });
  const glow=new T.Sprite(new T.SpriteMaterial({map:glowMap,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
  glow.position.set(0,.55,.44);glow.scale.set(1.90,1.26,1);g.add(glow);
  return {group:g,flames,light,embers,emberPos,emberSeed};
}

function cushion(w,h,d,material,x,y,z,curve=.78) {
  const geo=new T.SphereGeometry(1,56,28);
  const pos=geo.getAttribute('position'), signed=(n,p)=>Math.sign(n)*Math.pow(Math.abs(n),p);
  for(let i=0;i<pos.count;i++){
    const a=pos.getX(i),b=pos.getY(i),c=pos.getZ(i);
    const crease=1+.012*Math.cos(c*16+b*3)+.009*Math.sin(a*18+c*7);
    pos.setXYZ(i,w*.5*signed(a,curve*.62)*crease,h*.5*signed(b,curve*.58)*crease,d*.5*signed(c,curve*.65)*crease);
  }
  geo.computeVertexNormals();
  return mesh(geo,material,x,y,z);
}
function welt(w,h,z,m){
  const points=[];
  for(let i=0;i<=56;i++){
    const a=i/56*Math.PI*2,x=Math.cos(a),y=Math.sin(a);
    points.push(v(Math.sign(x)*Math.sqrt(Math.abs(x))*w*.5,Math.sign(y)*Math.sqrt(Math.abs(y))*h*.5,z));
  }
  return mesh(taperedTube(points,()=>.008,{segments:64,radial:5}),m);
}
function armchair(m){
  const chair=group('poltrona',2.17,0,-.56);chair.rotation.y=-.171;
  const body=group('estrutura');
  body.add(cushion(1.87,.46,1.53,m.upholstery,0,.53,0,.93));
  const back=cushion(1.70,1.54,.44,m.upholstery,0,1.35,-.49);
  back.rotation.x=-.15;body.add(back);
  const backPipe=welt(1.52,1.34,-.315,m.seam);
  backPipe.position.y=1.36;backPipe.rotation.x=-.15;body.add(backPipe);
  body.add(cushion(1.46,.26,1.24,m.upholstery,0,.80,.16));
  const trim=welt(1.30,.19,.724,m.seam);trim.position.y=.788;body.add(trim);
  for(const sign of [-1,1]){
    const arm=cushion(.34,.88,1.59,m.upholstery,sign*.80,.84,.036,.91);arm.rotation.x=-.062;body.add(arm);
    const cap=cushion(.35,.195,1.55,m.upholstery,sign*.82,1.213,.074,.81);cap.rotation.x=-.053;body.add(cap);
    const pipe=welt(.266,.67,.811,m.seam);pipe.position.set(sign*.809,.854,0);body.add(pipe);
  }
  for(const x of [-.68,.68])for(const z of [-.55,.57]){
    const leg=cylinderBetween(v(x*.95,.39,z*.94),v(x*1.13,.026,z*1.14),.051,m.walnutDark,8);
    body.add(leg);
  }
  batch(body);chair.add(body);
  return chair;
}

function cabinet(m){
  const g=group('aparador',-1.10,0,-1.82);
  g.rotation.y=-.065;
  g.add(
    block(1.95,1.02,.71,m.walnutDark,0,.711,0,.018),
    block(2.05,.105,.80,m.walnut,0,1.243,.019,.021),
    block(1.99,.038,.75,m.walnut,0,1.307,.019,.011),
    block(2.01,.078,.73,m.walnut,0,.191,.024,.018),
  );
  for(const x of [-.48,.48]){
    g.add(block(.94,.923,.102,m.walnut,x,.713,.379,.017));
    g.add(block(.82,.787,.018,m.walnut,x,.737,.438,.009));
    g.add(block(.021,.35,.044,m.bronze,x+(x<0?-.31:.31),.735,.481,.010));
  }
  for(const x of [-.78,.78])for(const z of [-.23,.24]){
    g.add(cylinderBetween(v(x,.255,z),v(x*1.07,.002,z*1.12),.047,m.walnutDark,7));
  }
  for(let i=0;i<3;i++){
    const cover=plain(['#54413c','#3f4943','#7b6351'][i]);
    const item=block(.48,.037,.31,cover,-.64+i*.025,1.335+i*.031,.16,.005);
    item.rotation.y=i*.11;g.add(item,block(.446,.027,.286,m.face,item.position.x,item.position.y,.17,.006));
  }
  batch(g);
  return g;
}
function turntable(m){
  const g=group('vitrola',-.81,1.32,-1.73);
  g.rotation.y=-.13;
  const deck=group('base');
  const black=plain('#292528',.57), cover=m.walnut;
  deck.add(block(1.00,.129,.641,cover,0,.093,0,.024),block(.962,.026,.612,black,0,.164,0,.014));
  for(const x of [-.406,.408])for(const z of [-.259,.25])deck.add(mesh(new T.CylinderGeometry(.040,.041,.041,16),m.frame,x,.025,z));
  for(let i=0;i<3;i++)deck.add(mesh(new T.CylinderGeometry(.018+i*.002,.018+i*.002,.023,14),m.brass,-.385+i*.071,.181,.243));
  deck.add(mesh(new T.CylinderGeometry(.071,.085,.085,28),m.bronze,.353,.202,-.175));
  batch(deck);g.add(deck);
  const platter=group('prato',-.109,.189,-.029);
  platter.add(mesh(new T.CylinderGeometry(.251,.263,.03,60),m.bronze));
  const vinyl=canvasTexture(512,512,ctx=>{
    const rand=rng(25);
    ctx.fillStyle='#1c1920';ctx.fillRect(0,0,512,512);
    for(let i=87;i<252;i+=1.2){
      ctx.beginPath();ctx.arc(256,256,i,0,Math.PI*2);ctx.strokeStyle=i%4<1?'#595056':'#383139';
      ctx.lineWidth=rand()*.55+.4;ctx.stroke();
    }
    ctx.fillStyle='#9a7950';ctx.beginPath();ctx.arc(256,256,63,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#e0bd81';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(256,256,55,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#282227';ctx.fillRect(243,254,26,3);
  });
  const surface=mesh(new T.CircleGeometry(.245,72),new T.MeshStandardMaterial({map:vinyl,roughness:.42,metalness:.21}),0,.018,0);surface.rotation.x=-Math.PI/2;
  platter.add(surface,mesh(new T.CylinderGeometry(.013,.013,.038,18),m.brass,0,.032,0));g.add(platter);
  const pivot=group('pivo_do_braco',.352,.252,-.172);
  const length=taperedTube([v(0,0,0),v(-.035,.008,.155),v(-.095,.006,.266),v(-.18,-.034,.307)],()=>.012,{radial:8,segments:20});
  pivot.add(mesh(length,m.brass));
  pivot.add(block(.074,.034,.058,black,-.188,-.037,.319,.008));
  pivot.add(mesh(new T.SphereGeometry(.032,16,10),m.bronze,.022,.008,-.065));
  g.add(pivot);
  const hinge=group('tampa',0,.182,-.318);
  hinge.rotation.x=-1.96;
  const coverMat=new T.MeshPhysicalMaterial({color:'#7b6654',roughness:.34,metalness:.45,opacity:.26,
    transparent:true,depthWrite:false,side:T.DoubleSide});
  hinge.add(block(.979,.016,.61,coverMat,0,0,.302,.011));
  for(const x of [-.487,.487])hinge.add(block(.014,.036,.60,m.bronze,x,0,.303,.007));
  hinge.add(block(.976,.036,.02,m.bronze,0,0,.597,.008));
  g.add(hinge);
  return {g,platter,pivot};
}

function clock(m){
  const g=group('relogio',-.39,3.55,-2.475);
  const mat=plain('#888071',.76);
  const profile=[[0,0],[.264,0],[.283,.011],[.298,.031],[.298,.065],[.278,.091],[.253,.091],[.246,.070],[0,.070]];
  const frame=mesh(lathe(profile,64),m.bronze);frame.rotation.x=Math.PI/2;
  g.add(frame);
  const face=canvasTexture(512,512,ctx=>{
    ctx.fillStyle='#ac9680';ctx.fillRect(0,0,512,512);
    ctx.save();ctx.translate(256,256);
    for(let i=0;i<60;i++){
      ctx.rotate(Math.PI/30);
      ctx.strokeStyle=i%5===0?'#5b4839':'#736358';ctx.lineWidth=i%5===0?5:1.5;
      ctx.beginPath();ctx.moveTo(0,-232);ctx.lineTo(0,-232+(i%5===0?18:9));ctx.stroke();
    }
    ctx.restore();
  });
  g.add(mesh(new T.CircleGeometry(.249,64),new T.MeshStandardMaterial({map:face,roughness:.93}),0,0,.077));
  const hand=(len,width,z)=>{
    const p=group('ponteiro',0,0,z);
    p.add(block(width,len,.015,m.frame,0,len*.43,0,.004));g.add(p);return p;
  };
  const hour=hand(.116,.019,.092);hour.rotation.z=1.017;
  const minute=hand(.167,.013,.098);minute.rotation.z=-.90;
  const second=hand(.186,.004,.105);second.rotation.z=.39;
  g.add(mesh(new T.CircleGeometry(.029,20),mat,0,0,.115));
  return {g,second};
}

function lamp(m){
  const g=group('luminaria',3.52,0,-1.27);
  const rod=mesh(lathe([[0,0],[.229,0],[.237,.024],[.214,.043],[.057,.049],[.046,.07],[.023,.078],[.022,2.84],[.05,2.844]],42),m.brass);
  g.add(rod);
  const shade=mesh(lathe([[.54,0],[.537,.018],[.49,.65],[.479,.667],[.468,.659],[.516,.023],[.515,0],[.54,0]],56),m.linen,0,2.66,0);
  g.add(shade);
  const inside=mesh(new T.CircleGeometry(.505,48),new T.MeshBasicMaterial({color:'#fff0be'}),0,2.677,0);inside.rotation.x=Math.PI/2;g.add(inside);
  const rim=mesh(new T.TorusGeometry(.531,.012,9,60),m.brass,0,2.675,0);rim.rotation.x=Math.PI/2;g.add(rim);
  const light=new T.PointLight('#ffca86',8.6,4.5,2);light.position.set(-.01,2.52,.13);g.add(light);
  return {g,light,inside,shade};
}
function leafGeometry() {
  const outline=new T.Shape();
  outline.moveTo(0,0);
  outline.bezierCurveTo(-.10,.079,-.30,.035,-.316,-.126);
  outline.bezierCurveTo(-.334,-.279,-.269,-.32,-.216,-.403);
  outline.bezierCurveTo(-.151,-.487,-.038,-.55,0,-.673);
  outline.bezierCurveTo(.056,-.555,.177,-.473,.232,-.397);
  outline.bezierCurveTo(.311,-.284,.340,-.187,.302,-.081);
  outline.bezierCurveTo(.246,.07,.097,.094,0,0);
  for(const side of [-1,1]){
    for(let i=0;i<4;i++){
      const y=-.094-i*.095,inner=.094-i*.007,outer=.294-i*.026;
      const hole=new T.Path();
      hole.moveTo(side*inner,y-.046);
      hole.bezierCurveTo(side*.116,y-.005,side*(outer-.026),y+.055,side*outer,y+.025);
      hole.bezierCurveTo(side*(outer+.014),y-.004,side*.155,y-.073,side*inner,y-.046);
      outline.holes.push(hole);
    }
  }
  const geo=new T.ShapeGeometry(outline,24);
  const pos=geo.getAttribute('position');
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),y=pos.getY(i);
    pos.setZ(i,-Math.abs(x)*.59+.063*Math.cos(y*6.)+Math.sin(y*43)*Math.abs(x)*.11);
  }
  geo.computeVertexNormals();
  return geo;
}
function plant(m){
  const g=group('plantas',3.29,.005,.30);
  const pot=group('vaso');
  const set=makeTexSet({size:256,aniso:2,sample:plasterSampler('#88705a',24,2.5)});
  const clay=pbrMaterial(set,{roughness:.95});
  pot.add(mesh(lathe([[0,0],[.222,0],[.242,.043],[.264,.12],[.327,.428],[.339,.495],[.334,.521],[.301,.529],
    [.284,.502],[.29,.475],[.251,.10],[0,.10]],48),clay));
  pot.add(mesh(new T.CylinderGeometry(.290,.252,.055,36),m.ash,0,.451,0));
  batch(pot);g.add(pot);
  const foliage=group('folhagem');
  const stems=plain('#556137'), veins=plain('#77834b',.77);
  const colors=['#35492c','#405233','#485337','#30482b'];
  const leafMats=colors.map(color=>new T.MeshPhysicalMaterial({color,roughness:.77,sheen:.55,sheenColor:new T.Color('#90976a'),
    side:T.DoubleSide,clearcoat:.14,clearcoatRoughness:.63}));
  const geo=leafGeometry(), rnd=rng(416);
  for(let n=0;n<11;n++){
    const a=n*2.39996,r=.37+rnd()*.45;
    const xx=Math.cos(a)*r,zz=Math.sin(a)*r*.6;
    const yy=1.16+rnd()*.75;
    const p=v(xx,yy,zz);
    foliage.add(mesh(taperedTube([v(0,.45,0),v(xx*.31,.87,zz*.22),v(xx*.58,yy-.18,zz*.56),p],t=>.013-.006*t,{segments:18,radial:6}),stems));
    const spray=group('folha',p.x,p.y,p.z);
    spray.rotation.set(.33+(rnd()-.5)*1.09,(rnd()-.5)*1.7,-xx*1.12+(rnd()-.5)*.42);
    const scale=(.56+rnd()*.47);
    spray.scale.setScalar(scale);
    spray.add(mesh(geo,leafMats[n%leafMats.length]));
    spray.add(mesh(taperedTube([v(0,.025,.066),v(0,-.23,.017),v(0,-.43,-.051),v(0,-.655,-.04)],t=>.009-.005*t,{segments:14,radial:5}),veins));
    foliage.add(spray);
  }
  batch(foliage);g.add(foliage);
  return {g,foliage};
}

function contact(m, x, z, w, d, opacity, y=.052) {
  const plane=mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:m,transparent:true,opacity,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),x,y,z);
  plane.rotation.x=-Math.PI*.5;
  return plane;
}
export function buildRoom(scene,brand) {
  const m=makeMaterials();
  const architectureGroup=architecture(m), window=windowGlass(m), curtain=curtains(m);
  const hearth=fireplace(m), record=turntable(m), watch=clock(m), standing=lamp(m), greens=plant(m);
  const seat=armchair(m), rug=carpet(m), sideboard=cabinet(m);
  scene.add(architectureGroup,window.group,curtain.root,hearth.group,record.g,watch.g,standing.g,greens.g,seat,rug,sideboard);
  const shadow=canvasTexture(128,128,ctx=>{
    const gradient=ctx.createRadialGradient(64,64,2,64,64,64);
    gradient.addColorStop(0,'#1a120cdb');gradient.addColorStop(.49,'#1e1811a1');gradient.addColorStop(1,'#1e181100');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  });
  scene.add(contact(shadow,2.16,-.55,2.6,2.8,.77,.078),contact(shadow,3.59,.40,1.3,1.1,.76,.078),
    contact(shadow,-3.40,-1.71,3.45,1.75,.81,.013),contact(shadow,-1.10,-1.68,2.37,1.4,.65,.012));
  const specs={
    chuva:{node:window.group,p:[1.85,2.62,-2.27],s:[3.76,2.87,.17],material:'vidro com gotas e cidade ao fundo',funcao:'mistura a chuva'},
    lareira:{node:hearth.group,p:[-3.47,.83,-1.23],s:[2.09,1.41,.54],material:'tijolo, lenha e latão',funcao:'ativa o crepitar'},
    vitrola:{node:record.g,p:[-.81,1.69,-1.53],s:[1.45,.81,.71],material:'nogueira, latão e vinil',funcao:'move o braço e toca acordes'},
    relogio:{node:watch.g,p:[-.39,3.55,-2.31],s:[.77,.76,.17],material:'bronze e papel',funcao:'ativa o tique-taque'},
    plantas:{node:greens.g,p:[3.35,1.20,.57],s:[1.00,1.86,.53],material:'cerâmica, folhas e hastes',funcao:'ativa o vento nas folhas'},
    cortina:{node:curtain.root,p:[4.06,1.87,-2.10],s:[.78,3.14,.26],material:'linho',funcao:'abre a janela e intensifica a chuva'},
    luminaria:{node:standing.g,p:[3.52,2.98,-1.03],s:[1.15,.76,.57],material:'linho e latão',funcao:'acompanha a pausa guiada'},
    poltrona:{node:seat,material:'veludo e madeira',funcao:'assento'},
    aparador:{node:sideboard,material:'madeira',funcao:'sustenta a vitrola'},
    tapete:{node:rug,material:'lã',funcao:'tapete trançado'},
  };
  for(const [id,item] of Object.entries(specs)){
    console.assert(scene.getObjectByName(item.node.name)===item.node,'Peça ausente',id);
  }
  function setBrand(newBrand){
    m.upholstery.color.set(newBrand.cores.tecido).lerp(new T.Color('white'),.30);
    m.upholstery.sheenColor.set(newBrand.cores.tecido).lerp(new T.Color('#e6cf93'),.44);
    m.walnut.color.set(newBrand.cores.verniz).lerp(new T.Color('white'),.48);
    m.linen.emissive.set(newBrand.cores.luz);
    standing.light.color.set(newBrand.cores.luz);
    standing.inside.material.color.set(newBrand.cores.luz).lerp(gold,.18);
  }
  setBrand(brand);
  return {m,window,curtain,hearth,record,watch,standing,greens,specs,setBrand};
}

