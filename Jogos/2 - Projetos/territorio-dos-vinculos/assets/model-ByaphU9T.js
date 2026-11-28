import{$ as e,B as t,D as n,H as r,L as i,N as a,O as o,P as s,R as c,U as l,W as u,Y as d,Z as f,a as p,c as m,ct as h,h as g,j as _,k as v,l as y,lt as b,nt as x,o as S,p as C,s as w,st as T,u as ee,w as E,x as D,y as te}from"./index-pumisJkU.js";function O(e,t,n=0){let r=Math.imul(e|0,374761393)+Math.imul(t|0,668265263)+Math.imul(n|0,982451653)|0;return r=Math.imul(r^r>>>13,1274126177),r^=r>>>16,(r>>>0)/4294967295}var k=(e,t)=>(e%t+t)%t,A=e=>e*e*e*(e*(e*6-15)+10);function j(e,t,n,r=0){let i=Math.floor(e),a=Math.floor(t),o=A(e-i),s=A(t-a),c=k(i,n),l=k(a,n),u=k(i+1,n),d=k(a+1,n),f=O(c,l,r),p=O(u,l,r),m=O(c,d,r),h=O(u,d,r);return f+(p-f)*o+(m-f)*s+(f-p-m+h)*o*s}function M(e,t,n,r=5,i=0,a=.5){let o=0,s=.5,c=0,l=1;for(let u=0;u<r;u++)o+=s*j(e*l,t*l,n*l,i+u*17),c+=s,s*=a,l*=2;return o/c}function N(e,t,n,r=4,i=0){let a=0,o=.5,s=0,c=1;for(let l=0;l<r;l++){let r=1-Math.abs(j(e*c,t*c,n*c,i+l*31)*2-1);a+=o*r*r,s+=o,o*=.5,c*=2}return a/s}function P(e,t,n,r=0,i={f1:0,f2:0,id:0}){let a=Math.floor(e),o=Math.floor(t),s=9,c=9,l=0;for(let i=-1;i<=1;i++)for(let u=-1;u<=1;u++){let d=a+u,f=o+i,p=k(d,n),m=k(f,n),h=d+O(p,m,r),g=f+O(p,m,r+7),_=h-e,v=g-t,y=Math.sqrt(_*_+v*v);y<s?(c=s,s=y,l=O(p,m,r+13)):y<c&&(c=y)}return i.f1=s,i.f2=c,i.id=l,i}var F=e=>e<0?0:e>1?1:e,I=(e,t,n)=>e+(t-e)*n,L=(e,t,n)=>{let r=F((n-e)/(t-e));return r*r*(3-2*r)};function R(e){let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function z(e){let t=document.createElement(`canvas`);return t.width=e,t.height=e,t}function B(e,t,n,r){return e.wrapS=e.wrapT=d,e.repeat.set(n[0],n[1]),e.anisotropy=t,e.colorSpace=r?f:``,e.generateMipmaps=!0,e.minFilter=_,e.needsUpdate=!0,e}function ne(e){let t=e.size,n=new Float32Array(t*t),r=z(t),i=z(t),a=z(t),o=r.getContext(`2d`),s=i.getContext(`2d`),c=a.getContext(`2d`),l=o.createImageData(t,t),u=s.createImageData(t,t),d=c.createImageData(t,t),f={h:0,r:0,g:0,b:0,rough:0};for(let r=0;r<t;r++){let i=1-r/t;for(let a=0;a<t;a++){let o=a/t;e.sample(o,i,f);let s=r*t+a;n[s]=f.h;let c=s*4;l.data[c]=F(f.r)*255,l.data[c+1]=F(f.g)*255,l.data[c+2]=F(f.b)*255,l.data[c+3]=255;let u=F(f.rough)*255;d.data[c]=u,d.data[c+1]=u,d.data[c+2]=u,d.data[c+3]=255}}let p=(e.normalStrength??2)*(t/512);for(let e=0;e<t;e++){let r=(e-1+t)%t*t,i=(e+1)%t*t,a=e*t;for(let e=0;e<t;e++){let o=(e-1+t)%t,s=(n[a+(e+1)%t]-n[a+o])*p,c=(n[i+e]-n[r+e])*p,l=1/Math.sqrt(s*s+c*c+1),d=(a+e)*4;u.data[d]=(-s*l*.5+.5)*255,u.data[d+1]=(c*l*.5+.5)*255,u.data[d+2]=(l*.5+.5)*255,u.data[d+3]=255}}o.putImageData(l,0,0),s.putImageData(u,0,0),c.putImageData(d,0,0);let h=e.repeat??[1,1],g=B(new m(r),e.aniso,h,!0),_=B(new m(i),e.aniso,h,!1),v=B(new m(a),e.aniso,h,!1);return{map:g,normalMap:_,roughnessMap:v,dispose(){g.dispose(),_.dispose(),v.dispose()}}}function V(e){let t=parseInt(e.replace(`#`,``),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}var H=(e,t,n)=>[I(e[0],t[0],n),I(e[1],t[1],n),I(e[2],t[2],n)];function re(e){let t=V(e.light),n=V(e.dark),r=e.planks??0,i=e.seed??3,a=e.grainScale??1,o=e.gloss??.3,s=e.weathered??0,c={f1:0,f2:0,id:0};return(e,l,u)=>{let d=l,f=0,p=0,m=e;if(r>0){let t=Math.floor(l*r);d=l*r-t;let n=O(t,1,i)*.9,a=e*2+n,o=Math.floor(a);m=a-o,f=O(t,o,i);let s=Math.min(d,1-d),c=Math.min(m,1-m)/2*6;p=1-L(0,.035,Math.min(s,c))}let h=M(e*4*a,l*16*a,4*a,4,i+5),g=(l*(r||1)*7+h*3.2+f*5)*5*a,_=Math.abs(Math.sin(g*Math.PI))**.6,v=M(e*64*a,l*512*a,64*a,3,i+9);P(e*6,l*6*Math.max(1,r/2),6,i+21,c);let y=c.id>.86?L(.28,0,c.f1):0,b=_*.55+v*.35+y*.8+(f-.5)*.35;b=F(b);let x=H(t,n,b),S=.86+f*.28;if(x=[x[0]*S,x[1]*S,x[2]*S],s>0){let t=M(e*8,l*8,8,4,i+40);x=H(x,[.52,.5,.47],s*L(.35,.8,t)*.6)}x=H(x,[x[0]*.25,x[1]*.22,x[2]*.2],p),u.r=x[0],u.g=x[1],u.b=x[2],u.h=(1-p)*.6+v*.18-_*.07-y*.1+s*M(e*32,l*128,32,3,i)*.15,u.rough=F(I(.78,.32,o)+v*.12+p*.3+s*.25+y*.05)}}function ie(e,t=11,n=1){let r=V(e);return(e,i,a)=>{let o=M(e*3,i*3,3,4,t),s=M(e*18,i*18,18,4,t+3),c=j(e*256,i*256,256,t+9),l=.92+(o-.5)*.12+(s-.5)*.06+(c-.5)*.03;a.r=r[0]*l,a.g=r[1]*l,a.b=r[2]*l,a.h=(s*.6+c*.25+o*.4)*n,a.rough=.88+(c-.5)*.1}}function ae(e=4){let t=V(`#b8a86a`),n=V(`#8f8547`);return(r,i,a)=>{let o=i*96,s=Math.floor(o),c=o-s,l=Math.sin(c*Math.PI),u=Math.abs(Math.sin(r*Math.PI*24)),d=O(s,3,e),f=M(r*128,i*8,128,3,e),p=F(.35+d*.4+f*.3-u*.08),m=H(t,n,p),h=L(.92,1,u)*.4;a.r=m[0]*(1-h*.4),a.g=m[1]*(1-h*.4),a.b=m[2]*(1-h*.4),a.h=l*.6-h*.5+f*.1,a.rough=.7+f*.15}}function oe(e,t=8,n=160){let r=V(e);return(e,i,a)=>{let o=Math.sin(e*Math.PI*n),s=Math.sin(i*Math.PI*n),c=+((Math.floor(e*n)+Math.floor(i*n))%2==0)?Math.abs(o):Math.abs(s),l=M(e*32,i*4,32,3,t),u=M(e*6,i*6,6,4,t+5),d=.82+c*.16+(l-.5)*.12+(u-.5)*.1;a.r=r[0]*d,a.g=r[1]*d,a.b=r[2]*d,a.h=c*.7+l*.2,a.rough=.92}}function se(e,t,n=12,r=0){let i=V(e),a=V(t),o=V(`#7d8a4a`),s={f1:0,f2:0,id:0};return(e,t,c)=>{let l=M(e*6,t*6,6,5,n);P(e*5,t*5,5,n+2,s);let u=L(.06,0,s.f2-s.f1),d=j(e*300,t*300,300,n+4),f=H(i,a,F(l*.9+s.id*.25-.1));if(f=H(f,[f[0]*.92+d*.12,f[1]*.92+d*.12,f[2]*.92+d*.12],.5),r>0){let i=M(e*10,t*10,10,4,n+9);f=H(f,o,L(.62,.78,i)*r)}f=H(f,[f[0]*.35,f[1]*.35,f[2]*.35],u),c.r=f[0],c.g=f[1],c.b=f[2],c.h=l*.8-u*.6+d*.08,c.rough=.72+l*.2}}function ce(e=6){let t=V(`#7a6450`),n=V(`#2e241c`),r=V(`#4f6a2e`);return(i,a,o)=>{let s=M(i*4,a*2,4,3,e)*.6,c=N(i*10+s*3,a*2.5,10,4,e+3),l=M(i*14,a*5,14,4,e+8),u=j(i*200,a*120,200,e+2),d=F(c*.75+l*.35),f=H(n,t,d),p=L(.55,.25,d)*L(.45,.7,M(i*6,a*3,6,4,e+15));f=H(f,r,p*.75),o.r=f[0]*(.92+u*.12),o.g=f[1]*(.92+u*.12),o.b=f[2]*(.92+u*.12),o.h=d+u*.05,o.rough=.9-p*.1}}function le(e=2){let t=V(`#6b4b36`),n=V(`#3a2a20`);return(r,i,a)=>{let o=i*10,s=Math.floor(o),c=o-s,l=r*8+s%2*.5,u=Math.floor(l),d=l-u,f=O((u%8+8)%8,s,e),p=M(r*16,i*80,16,3,e+1),m=L(0,.05,Math.min(d,1-d)),h=L(0,.12,c),g=F(.3+f*.5+p*.3),_=H(t,n,g),v=(.55+.45*c)*(.5+.5*m);_=[_[0]*v,_[1]*v,_[2]*v];let y=L(.62,.8,M(r*5,i*5,5,4,e+9));_=H(_,V(`#566b33`),y*.5),a.r=_[0],a.g=_[1],a.b=_[2],a.h=c*.7*m*h+p*.12,a.rough=.85}}function U(e,t=5){let n=V(e);return(e,r,i)=>{let a=j(e*420,r*420,420,t),o=j(e*900,r*900,900,t+1),s=M(e*5,r*5,5,4,t+2),c=O(Math.floor(e*700),Math.floor(r*700),t+3)>.94?.6:1,l=O(Math.floor(e*650),Math.floor(r*650),t+5)>.95?1.25:1,u=(.88+(s-.5)*.14+(a-.5)*.12)*c*l;i.r=n[0]*u,i.g=n[1]*u,i.b=n[2]*u,i.h=a*.55+o*.35+s*.2,i.rough=.92+(o-.5)*.06}}function W(e=9){let t=V(`#4d6b2b`),n=V(`#6f8a3a`),r=V(`#5b4632`),i={f1:0,f2:0,id:0};return(a,o,s)=>{let c=M(a*8,o*8,8,5,e),l=j(a*220,o*220,220,e+1);P(a*30,o*30,30,e+4,i);let u=L(.25,.1,i.f1)*+(i.id>.8),d=L(.55,.75,c),f=H(t,n,l);f=H(f,r,d*.85),f=H(f,V(`#8a7f70`),u),s.r=f[0],s.g=f[1],s.b=f[2],s.h=l*.4+u*.6+c*.3,s.rough=.95}}function ue(e,t=14){let n=V(e),r={f1:0,f2:0,id:0};return(e,i,a)=>{P(e*22,i*22,22,t,r);let o=r.f1*r.f1,s=M(e*6,i*6,6,4,t+1),c=.9+(s-.5)*.2+r.id*.06;a.r=n[0]*c,a.g=n[1]*c,a.b=n[2]*c,a.h=o,a.rough=.22+s*.18}}function de(e=21){let t=V(`#8a6431`),n=V(`#4f6b58`);return(r,i,a)=>{let o=M(r*6,i*6,6,5,e),s=L(.58,.82,o),c=H(t,n,s*.7);a.r=c[0],a.g=c[1],a.b=c[2],a.h=o*.3+s*.2,a.rough=.3+s*.45}}function fe(e,t=33){let n=V(e);return(e,r,i)=>{let a=N(e*18,r*3,18,3,t),o=N(r*14+.3,e*4,14,3,t+1),s=M(e*6,r*6,6,4,t+2),c=.9+s*.08-a*o*.06;i.r=n[0]*c,i.g=n[1]*c,i.b=n[2]*c,i.h=a*.3+s*.2,i.rough=.95}}function pe(e,t={},n=1){return new c({map:e.map,normalMap:e.normalMap,roughnessMap:e.roughnessMap,normalScale:new T(n,n),roughness:1,...t})}function me(e,t={},n=1){return new i({map:e.map,normalMap:e.normalMap,roughnessMap:e.roughnessMap,normalScale:new T(n,n),roughness:1,...t})}var G=`
  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash12(i), hash12(i+vec2(1,0)), u.x), mix(hash12(i+vec2(0,1)), hash12(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p){ float s = 0.0; float a = 0.5; for(int i=0;i<5;i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= 0.5; } return s; }
`;function K(e){return e.userData.noAO=!0,e.castShadow=!1,e.receiveShadow=!1,e}function he(t){let n=R(t.seed??7),r=new Float32Array(t.count*3),i=new Float32Array(t.count);for(let e=0;e<t.count;e++)r[e*3]=t.min.x+n()*(t.max.x-t.min.x),r[e*3+1]=t.min.y+n()*(t.max.y-t.min.y),r[e*3+2]=t.min.z+n()*(t.max.z-t.min.z),i[e]=n();let a=new w;a.setAttribute(`position`,new S(r,3)),a.setAttribute(`aRand`,new S(i,1));let o=(t.beams??[]).slice(0,4),s=Array.from({length:4},(e,t)=>o[t]?new b(o[t].origin.x,o[t].origin.y,o[t].origin.z,o[t].radius):new b),c=Array.from({length:4},(e,t)=>o[t]?new b(o[t].dir.x,o[t].dir.y,o[t].dir.z,o[t].length):new b),l=new e({transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uSize:{value:t.size??9},uPR:{value:Math.min(window.devicePixelRatio,2)},uMin:{value:t.min},uMax:{value:t.max},uColor:{value:new C(t.color??`#ffe2b8`)},uBase:{value:t.base??(o.length?.06:.6)},uOpacity:{value:1},uBeamA:{value:s},uBeamB:{value:c},uBeamCount:{value:o.length}},vertexShader:`
      uniform float uTime, uSize, uPR, uBase, uBeamCount;
      uniform vec3 uMin, uMax;
      uniform vec4 uBeamA[4];
      uniform vec4 uBeamB[4];
      attribute float aRand;
      varying float vAlpha;
      void main(){
        vec3 p = position;
        vec3 size = uMax - uMin;
        p += vec3(sin(uTime*0.11 + aRand*40.0)*0.35 + uTime*0.012,
                  sin(uTime*0.07 + aRand*13.0)*0.2 + uTime*0.008*(aRand-0.3),
                  cos(uTime*0.09 + aRand*23.0)*0.35);
        p = uMin + mod(p - uMin, size);
        float beam = 0.0;
        for (int i = 0; i < 4; i++) {
          if (float(i) >= uBeamCount) break;
          vec3 a = uBeamA[i].xyz; vec3 d = uBeamB[i].xyz;
          float t = dot(p - a, d);
          float dist = length((p - a) - d * t);
          float inside = smoothstep(uBeamA[i].w, uBeamA[i].w * 0.35, dist) * step(0.0, t) * step(t, uBeamB[i].w);
          beam = max(beam, inside * (1.0 - t / uBeamB[i].w * 0.6));
        }
        if (uBeamCount < 0.5) beam = 1.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uSize * uPR * (0.35 + aRand) / max(0.1, -mv.z);
        float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aRand * 2.0) + aRand * 30.0);
        vAlpha = mix(uBase, 1.0, beam) * tw;
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform vec3 uColor; uniform float uOpacity; varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d); a *= a;
        gl_FragColor = vec4(uColor * 1.6, a * vAlpha * uOpacity);
      }
    `}),d=K(new u(a,l));return d.frustumCulled=!1,{object:d,material:l,setBeams(e){e.slice(0,4).forEach((e,t)=>{s[t].set(e.origin.x,e.origin.y,e.origin.z,e.radius),c[t].set(e.dir.x,e.dir.y,e.dir.z,e.length)})},update(e){l.uniforms.uTime.value=e}}}function ge(t){let n=t.spread??1.08,r=new h;t.corners.forEach(e=>r.add(e)),r.multiplyScalar(.25);let i=[];for(let e=0;e<4;e++)i.push(e,0,e+1,0,e+1,1,e,0,e+1,1,e,1);let a=new w;a.setAttribute(`position`,new D(new Float32Array(72),3)),a.setAttribute(`uv`,new D(i,2));let o=(e,i)=>{let o=t.corners.map(t=>t.clone().sub(r).multiplyScalar(n).add(r).addScaledVector(e,i)),s=a.attributes.position,c=0,l=e=>s.setXYZ(c++,e.x,e.y,e.z);for(let e=0;e<4;e++){let n=t.corners[e],r=t.corners[(e+1)%4],i=o[(e+1)%4],a=o[e];l(n),l(r),l(i),l(n),l(i),l(a)}s.needsUpdate=!0,a.computeVertexNormals(),a.computeBoundingSphere()};o(t.dir,t.length);let c=new e({transparent:!0,depthWrite:!1,side:2,blending:2,uniforms:{uTime:{value:0},uColor:{value:new C(t.color??`#ffd29a`)},uIntensity:{value:t.intensity??.35}},vertexShader:`
      varying vec2 vUv; varying vec3 vN; varying vec3 vView; varying vec3 vW;
      void main(){
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,fragmentShader:`
      uniform float uTime, uIntensity; uniform vec3 uColor;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView; varying vec3 vW;
      ${G}
      void main(){
        float along = vUv.y;
        float fade = pow(clamp(1.0 - along, 0.0, 1.0), 1.6) * smoothstep(0.0, 0.08, along);
        float edge = pow(abs(dot(normalize(vN), normalize(vView))), 1.4);
        float side = fract(vUv.x);
        float soft = smoothstep(0.0, 0.18, side) * smoothstep(1.0, 0.82, side);
        float streak = 0.65 + 0.35 * fbm(vec2(vUv.x * 6.0 + vW.y * 0.3, along * 2.0 - uTime * 0.04));
        float near = smoothstep(0.4, 2.2, distance(cameraPosition, vW));
        float a = fade * edge * mix(0.55, 1.0, soft) * streak * uIntensity * near;
        gl_FragColor = vec4(uColor * a, a);
      }
    `}),l=K(new s(a,c));return l.renderOrder=5,{object:l,material:c,setDir:o,update(e){c.uniforms.uTime.value=e}}}var _e=(()=>{let e=new x(1,20,16),t=e.attributes.position;for(let e=0;e<t.count;e++){let n=t.getY(e),r=n>0?1-n**1.5*.92:1-(-n)**2*.35;t.setXYZ(e,t.getX(e)*r,n*(n>0?2.6:.9),t.getZ(e)*r)}return e.computeVertexNormals(),e})();function ve(t){let n=t.size??.012,r=t.seed??Math.random()*100,i=new E,a=new e({transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uSeed:{value:r},uLit:{value:1}},vertexShader:`
      uniform float uTime, uSeed, uLit;
      varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 p = position;
        float h = clamp(p.y / 2.6, 0.0, 1.0);
        p.x += sin(uTime * 9.0 + uSeed + p.y * 2.0) * 0.12 * h * h + sin(uTime * 23.0 + uSeed * 3.0) * 0.04 * h;
        p.z += cos(uTime * 7.0 + uSeed * 2.0 + p.y * 1.5) * 0.1 * h * h;
        p.y *= 0.92 + 0.12 * sin(uTime * 13.0 + uSeed);
        p *= uLit;
        vY = position.y;
        vec4 w = modelMatrix * vec4(p, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,fragmentShader:`
      uniform float uLit;
      varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){
        float h = clamp((vY + 0.9) / 3.5, 0.0, 1.0);
        float rim = pow(abs(dot(normalize(vN), normalize(vV))), 1.2);
        vec3 blue = vec3(0.15, 0.25, 1.0) * 1.2;
        vec3 core = vec3(4.2, 3.2, 1.8);
        vec3 edge = vec3(3.0, 1.1, 0.25);
        vec3 col = mix(blue, core, smoothstep(0.08, 0.3, h));
        col = mix(col, edge, smoothstep(0.45, 1.0, h) * (1.0 - rim * 0.5));
        col = mix(edge * 0.8, col, rim);
        float a = rim * (1.0 - smoothstep(0.7, 1.0, h)) * uLit;
        gl_FragColor = vec4(col * a, a);
      }
    `}),o=K(new s(_e,a));o.scale.setScalar(n),o.position.y=n*.9,i.add(o);let c=null,u=t.lightIntensity??.6;t.light!==!1&&(c=new l(`#ffae5c`,u,t.distance??3,2),c.position.y=n*2.5,i.add(c));let d=1,f=1;return{object:i,light:c,setLit(e){f=+!!e},get lit(){return f>.5},update(e,t){if(d+=(f-d)*Math.min(1,t*4),a.uniforms.uTime.value=e,a.uniforms.uLit.value=d,o.visible=d>.01,c){let t=.82+.1*Math.sin(e*11+r)+.06*Math.sin(e*27.3+r*2)+.04*Math.sin(e*3.1);c.intensity=u*t*d,c.position.x=Math.sin(e*9+r)*n*.4}}}}function ye(t){let n=t.count??320,r=R(91),i=new Float32Array(n*3);for(let e=0;e<n;e++)i[e*3]=r(),i[e*3+1]=r(),i[e*3+2]=r();let a=new w;a.setAttribute(`position`,new S(new Float32Array(n*3),3)),a.setAttribute(`aSeed`,new S(i,3));let o=new e({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uOrigin:{value:t.origin.clone()},uH:{value:t.height??1.1},uPR:{value:Math.min(window.devicePixelRatio,2)},uColor:{value:new C(t.color??`#d9d4cc`)},uOn:{value:1}},vertexShader:`
      uniform float uTime, uH, uPR, uOn;
      uniform vec3 uOrigin;
      attribute vec3 aSeed;
      varying float vA; varying float vSeed; varying float vLife;
      void main(){
        float life = fract(uTime * 0.09 * (0.75 + aSeed.x * 0.5) + aSeed.y);
        float h = life * uH;
        float t = uTime;
        vec3 off = vec3(
          sin(h * 4.1 - t * 0.9) * 0.035 * h + sin(h * 9.3 - t * 1.7 + 1.3) * 0.05 * h * h,
          h,
          cos(h * 3.3 - t * 0.7) * 0.035 * h + sin(h * 7.7 - t * 1.3) * 0.04 * h * h);
        float spread = 0.004 + h * h * 0.12;
        off.x += (aSeed.z - 0.5) * spread;
        off.z += (fract(aSeed.z * 7.13) - 0.5) * spread;
        vec4 mv = modelViewMatrix * vec4(uOrigin + off, 1.0);
        gl_PointSize = (0.012 + life * life * 0.32) * 260.0 * uPR / max(0.05, -mv.z);
        vA = smoothstep(0.0, 0.05, life) * pow(clamp(1.0 - life, 0.0, 1.0), 1.8) * uOn;
        vSeed = aSeed.x; vLife = life;
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform vec3 uColor; uniform float uTime;
      varying float vA; varying float vSeed; varying float vLife;
      ${G}
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float n = fbm(c * 3.0 + vSeed * 13.0 + uTime * 0.05);
        float a = smoothstep(0.5, 0.05, d) * (0.45 + 0.75 * n);
        a *= vA * mix(0.55, 0.18, vLife);
        gl_FragColor = vec4(uColor, a);
      }
    `}),s=K(new u(a,o));s.frustumCulled=!1,s.renderOrder=6;let c=1,l=1;return{object:s,material:o,setOn(e){l=+!!e},get on(){return l>.5},update(e,t){c+=(l-c)*Math.min(1,t*.8),o.uniforms.uTime.value=e,o.uniforms.uOn.value=c,s.visible=c>.01}}}function be(t){let n=R(55),r=new Float32Array(t.count*3),i=new Float32Array(t.count);for(let e=0;e<t.count;e++){let a=n()*Math.PI*2,o=Math.sqrt(n())*t.radius;r[e*3]=t.center.x+Math.cos(a)*o,r[e*3+1]=t.height[0]+n()*(t.height[1]-t.height[0]),r[e*3+2]=t.center.z+Math.sin(a)*o,i[e]=n()}let a=new w;a.setAttribute(`position`,new S(r,3)),a.setAttribute(`aSeed`,new S(i,1));let o=new e({transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uColor:{value:new C(t.color??`#d8ff6a`)},uPR:{value:Math.min(window.devicePixelRatio,2)},uSize:{value:t.size??40},uOn:{value:0}},vertexShader:`
      uniform float uTime, uPR, uSize, uOn; attribute float aSeed; varying float vB;
      void main(){
        vec3 p = position;
        float t = uTime * 0.25 + aSeed * 50.0;
        p += vec3(sin(t * 1.3) * 0.9 + sin(t * 3.1) * 0.25, sin(t * 0.9) * 0.45, cos(t * 1.1) * 0.9 + cos(t * 2.7) * 0.25);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float blink = pow(max(0.0, sin(uTime * (0.7 + aSeed) + aSeed * 40.0)), 6.0);
        vB = (0.15 + blink) * uOn;
        gl_PointSize = uSize * uPR * (0.6 + blink * 0.6) / max(0.1, -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform vec3 uColor; varying float vB;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.12, 0.0, d);
        float glow = smoothstep(0.5, 0.0, d) * 0.35;
        float a = (core + glow) * vB;
        gl_FragColor = vec4(uColor * (2.5 * core + glow) * vB, a);
      }
    `}),s=K(new u(a,o));return s.frustumCulled=!1,{object:s,material:o,update:e=>o.uniforms.uTime.value=e}}function xe(t){let n=R(23),r=new Float32Array(t.count*3),i=new Float32Array(t.count);for(let e=0;e<t.count;e++){let a=n()*Math.PI*2,o=Math.sqrt(n())*t.radius;r[e*3]=t.center.x+Math.cos(a)*o,r[e*3+1]=0,r[e*3+2]=t.center.z+Math.sin(a)*o,i[e]=n()}let a=new w;a.setAttribute(`position`,new S(r,3)),a.setAttribute(`aSeed`,new S(i,1));let o=new e({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uTop:{value:t.top},uBottom:{value:t.bottom},uPR:{value:Math.min(window.devicePixelRatio,2)},uAmount:{value:0},uWind:{value:.15},uColor:{value:new C(`#c9d6e6`)}},vertexShader:`
      uniform float uTime, uTop, uBottom, uPR, uAmount, uWind; attribute float aSeed; varying float vA;
      void main(){
        float H = uTop - uBottom;
        float fall = mod(uTime * (9.0 + aSeed * 3.0) + aSeed * H * 7.0, H);
        vec3 p = position;
        p.y = uTop - fall;
        p.x += uWind * fall;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = 22.0 * uPR / max(0.2, -mv.z) * 6.0;
        vA = step(aSeed, uAmount) * 0.4;
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform vec3 uColor; varying float vA;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float a = smoothstep(0.035, 0.0, abs(c.x + c.y * 0.15)) * smoothstep(0.5, 0.1, abs(c.y));
        if (a * vA < 0.003) discard;
        gl_FragColor = vec4(uColor, a * vA);
      }
    `}),s=K(new u(a,o));return s.frustumCulled=!1,{object:s,material:o,update:e=>o.uniforms.uTime.value=e}}function Se(e){let t=e.size??512,n=document.createElement(`canvas`);n.width=n.height=t;let r=n.getContext(`2d`),i=R(e.seed??3),a=(t,n,i,a,o)=>{r.save(),r.translate(t,n),r.rotate(a);let s=i*(e.aspect??.42),c=r.createLinearGradient(-s,0,s,0);c.addColorStop(0,o),c.addColorStop(.5,q(o,1.18)),c.addColorStop(1,q(o,.82)),r.fillStyle=c,r.beginPath(),r.moveTo(0,0),r.bezierCurveTo(s,-i*.25,s*.8,-i*.75,0,-i),r.bezierCurveTo(-s*.8,-i*.75,-s,-i*.25,0,0),r.fill(),r.strokeStyle=q(o,.7),r.lineWidth=Math.max(1,i*.025),r.beginPath(),r.moveTo(0,0),r.lineTo(0,-i*.95),r.stroke(),r.lineWidth=Math.max(.6,i*.012);for(let e=1;e<6;e++){let t=-i*e*.15;r.beginPath(),r.moveTo(0,t),r.lineTo(s*.6,t-i*.1),r.moveTo(0,t),r.lineTo(-s*.6,t-i*.1),r.stroke()}r.restore()};if(e.single)a(t/2,t*.95,t*.9,0,e.palette[0]);else{let n=e.leaves??26;for(let r=0;r<n;r++){let n=i()*Math.PI*2,r=Math.sqrt(i())*t*(e.spread??.32),o=t/2+Math.cos(n)*r,s=t/2+Math.sin(n)*r,c=e.palette[Math.floor(i()*e.palette.length)];a(o,s+t*.08,t*(.16+i()*.1),n+Math.PI/2+(i()-.5)*.9,c)}}let o=new m(n);return o.colorSpace=f,o.anisotropy=4,o}function q(e,t){let n=new C(e);return n.r=Math.min(1,n.r*t),n.g=Math.min(1,n.g*t),n.b=Math.min(1,n.b*t),`#`+n.getHexString()}function Ce(e){let n=new r(.16,.16),i=new c({map:e.texture,alphaTest:.5,side:2,roughness:.8}),a=new o(n,i,e.count);a.castShadow=!1,a.userData.noAO=!0;let s=R(77),l=Array.from({length:e.count},()=>({p:new h(e.center.x+(s()-.5)*e.radius*2,s()*e.top,e.center.z+(s()-.5)*e.radius*2),rot:new te(s()*6,s()*6,s()*6),spin:new h((s()-.5)*3,(s()-.5)*3,(s()-.5)*3),speed:.35+s()*.4,phase:s()*10})),u=new C;l.forEach((t,n)=>a.setColorAt(n,u.set(e.colors[n%e.colors.length])));let d=new t,f=0,p=.3;return{object:a,setAmount(e){f=e},setWind(e){p=e},update(t,n){let r=Math.floor(e.count*f);a.count=r,a.visible=r>0;for(let i=0;i<r;i++){let r=l[i];r.p.y-=r.speed*n,r.p.x+=(Math.sin(t*1.3+r.phase)*.35+p)*n,r.p.z+=Math.cos(t*1.1+r.phase)*.3*n,r.rot.x+=r.spin.x*n,r.rot.y+=r.spin.y*n,r.rot.z+=r.spin.z*n,(r.p.y<.02||Math.abs(r.p.x-e.center.x)>e.radius*1.5)&&r.p.set(e.center.x+(Math.random()-.5)*e.radius*2,e.top*(.6+Math.random()*.4),e.center.z+(Math.random()-.5)*e.radius*2),d.position.copy(r.p),d.rotation.copy(r.rot),d.updateMatrix(),a.setMatrixAt(i,d.matrix)}a.instanceMatrix.needsUpdate=!0}}}function we(e){return{top:new C(e.top),horizon:new C(e.horizon),bottom:new C(e.bottom),sunColor:new C(e.sun),sunDir:new h(...e.sunDir).normalize(),sunSize:e.sunSize??.03,cloudCover:e.clouds??.3,cloudColor:new C(e.cloudColor??`#ffffff`),stars:e.stars??0}}function Te(t=400){let n=new e({side:1,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new C},uHorizon:{value:new C},uBottom:{value:new C},uSunColor:{value:new C},uSunDir:{value:new h(0,1,0)},uSunSize:{value:.03},uCloud:{value:.3},uCloudColor:{value:new C},uStars:{value:0},uTime:{value:0}},vertexShader:`
      varying vec3 vDir;
      void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }
    `,fragmentShader:`
      uniform vec3 uTop, uHorizon, uBottom, uSunColor, uSunDir, uCloudColor;
      uniform float uSunSize, uCloud, uStars, uTime;
      varying vec3 vDir;
      ${G}
      void main(){
        vec3 d = normalize(vDir);
        float y = d.y;
        vec3 col = y > 0.0 ? mix(uHorizon, uTop, pow(max(y, 0.0), 0.8)) : mix(uHorizon, uBottom, pow(max(-y, 0.0), 0.4));
        col += uSunColor * pow(clamp(1.0 - abs(y), 0.0, 1.0), 10.0) * 0.18;
        float sd = dot(d, normalize(uSunDir));
        float disc = smoothstep(cos(uSunSize), cos(uSunSize * 0.7), sd);
        float glow = pow(max(sd, 0.0), 6.0) * 0.45 + pow(max(sd, 0.0), 64.0) * 0.8;
        col += uSunColor * glow;
        // estrelas
        if (uStars > 0.0 && y > 0.0) {
          vec2 sp = d.xz / (y + 0.2) * 90.0;
          float s = hash12(floor(sp));
          float tw = 0.6 + 0.4 * sin(uTime * 2.0 + s * 60.0);
          col += vec3(1.0) * step(0.9965, s) * smoothstep(0.35, 0.0, length(fract(sp) - 0.5)) * uStars * tw * smoothstep(0.0, 0.3, y) * 2.0;
        }
        // nuvens planas projetadas
        if (y > 0.0 && uCloud > 0.0) {
          vec2 uv = d.xz / (y + 0.12) * 1.4 + vec2(uTime * 0.006, uTime * 0.002);
          float n = fbm(uv * 1.3);
          float n2 = fbm(uv * 3.1 + 4.0);
          float c = smoothstep(1.0 - uCloud, 1.0 - uCloud + 0.35, n * 0.75 + n2 * 0.35);
          c *= smoothstep(0.0, 0.18, y);
          float lit = 0.6 + 0.4 * pow(max(sd, 0.0), 3.0);
          vec3 cc = uCloudColor * lit + uSunColor * pow(max(sd, 0.0), 12.0) * 0.6;
          col = mix(col, cc, c * 0.92);
          disc *= 1.0 - c;
        }
        col += uSunColor * disc * 14.0;
        gl_FragColor = vec4(col, 1.0);
      }
    `}),r=new s(new x(t,64,32),n);return r.frustumCulled=!1,r.renderOrder=-10,K(r),{object:r,material:n,set:e=>{let t=n.uniforms;t.uTop.value.copy(e.top),t.uHorizon.value.copy(e.horizon),t.uBottom.value.copy(e.bottom),t.uSunColor.value.copy(e.sunColor),t.uSunDir.value.copy(e.sunDir),t.uSunSize.value=e.sunSize,t.uCloud.value=e.cloudCover,t.uCloudColor.value.copy(e.cloudColor),t.uStars.value=e.stars},update:e=>n.uniforms.uTime.value=e}}function Ee(e,t,n,r){return r.top.copy(e.top).lerp(t.top,n),r.horizon.copy(e.horizon).lerp(t.horizon,n),r.bottom.copy(e.bottom).lerp(t.bottom,n),r.sunColor.copy(e.sunColor).lerp(t.sunColor,n),r.sunDir.copy(e.sunDir).lerp(t.sunDir,n).normalize(),r.sunSize=e.sunSize+(t.sunSize-e.sunSize)*n,r.cloudCover=e.cloudCover+(t.cloudCover-e.cloudCover)*n,r.cloudColor.copy(e.cloudColor).lerp(t.cloudColor,n),r.stars=e.stars+(t.stars-e.stars)*n,r}function De(e){return{top:e.top.clone(),horizon:e.horizon.clone(),bottom:e.bottom.clone(),sunColor:e.sunColor.clone(),sunDir:e.sunDir.clone(),sunSize:e.sunSize,cloudCover:e.cloudCover,cloudColor:e.cloudColor.clone(),stars:e.stars}}function Oe(e,t){return e.onBeforeCompile=e=>{e.uniforms.uWind=t.strength,e.uniforms.uWTime=t.time,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uWind; uniform float uWTime;`).replace(`#include <begin_vertex>`,t.mode===`grass`?`#include <begin_vertex>
             {
               vec4 wp = vec4(transformed, 1.0);
               #ifdef USE_INSTANCING
                 wp = instanceMatrix * wp;
               #endif
               wp = modelMatrix * wp;
               float h = clamp(position.y * ${(t.heightScale??1).toFixed(3)}, 0.0, 1.0);
               float w = sin(uWTime * 1.6 + wp.x * 0.35 + wp.z * 0.25) * 0.6 + sin(uWTime * 3.7 + wp.x * 1.3) * 0.25 + 0.35;
               transformed.x += w * uWind * h * h * 0.35;
               transformed.z += sin(uWTime * 2.1 + wp.z * 0.7) * uWind * h * h * 0.12;
             }`:`#include <begin_vertex>
             {
               vec4 wp = vec4(0.0, 0.0, 0.0, 1.0);
               #ifdef USE_INSTANCING
                 wp = instanceMatrix * wp;
               #endif
               wp = modelMatrix * wp;
               float ph = wp.x * 0.37 + wp.y * 0.21 + wp.z * 0.29;
               float sway = sin(uWTime * 1.7 + ph) * 0.6 + sin(uWTime * 4.3 + ph * 2.3) * 0.3;
               transformed.x += sway * uWind * 0.06;
               transformed.y += sin(uWTime * 2.9 + ph * 1.7) * uWind * 0.03;
               transformed.z += cos(uWTime * 1.9 + ph) * uWind * 0.05;
             }`)},e.customProgramCacheKey=()=>`wind-${t.mode}`,e}function ke(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new w;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=J(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=J(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function J(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new S(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var Y=new h;function X(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;Y.copy(t),Y[r]=0,Y.normalize();let l=.5*o/(o+s),u=1-Y.angleTo(e)/c;return Math.sign(Y[n])===1?u*l:s/(o+s)+l+l*(1-u)}var Ae=class e extends p{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new h,c=new h,l=new h(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new h,g=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=X(m,c,`z`,`y`,i,n),f[a+1]=1-X(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-X(m,c,`z`,`y`,i,n),f[a+1]=1-X(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-X(m,c,`x`,`z`,i,e),f[a+1]=X(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-X(m,c,`x`,`z`,i,e),f[a+1]=1-X(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-X(m,c,`x`,`y`,i,e),f[a+1]=1-X(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=X(m,c,`x`,`y`,i,e),f[a+1]=1-X(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};function je(e,t,n=0,r=0,i=0){let a=new s(e,t);return a.position.set(n,r,i),a.castShadow=!0,a.receiveShadow=!0,a}function Me(e,t,n,r=.01,i=3){return new Ae(e,t,n,i,Math.min(r,e/2-1e-4,t/2-1e-4,n/2-1e-4))}function Ne(e,t,n,r=1){let i=new p(e,t,n),a=i.attributes.uv,o=[[n,t],[n,t],[e,n],[e,n],[e,t],[e,t]];for(let e=0;e<6;e++)for(let t=0;t<4;t++){let n=e*4+t;a.setXY(n,a.getX(n)*o[e][0]/r,a.getY(n)*o[e][1]/r)}return i}function Pe(e,t,n=1,i=1,a=1){let o=new r(e,t,i,a),s=o.attributes.uv;for(let r=0;r<s.count;r++)s.setXY(r,s.getX(r)*e/n,s.getY(r)*t/n);return o}function Fe(e,t=48){let n=new v(e.map(([e,t])=>new T(Math.max(1e-5,e),t)),t);return n.computeVertexNormals(),n}function Ie(e,t){let n=e.attributes.position;for(let e=0;e<n.count;e++){let r=n.getX(e),i=n.getZ(e),a=n.getY(e),o=Math.hypot(r,i);if(o<1e-5)continue;let s=t(Math.atan2(i,r),a,o);n.setXYZ(e,r/o*(o+s),a,i/o*(o+s))}return e.computeVertexNormals(),e}function Z(e,t,n={}){let r=new ee(e,!1,`centripetal`),i=n.segments??Math.max(8,e.length*8),a=n.radial??12,o=r.computeFrenetFrames(i,!1),s=r.getLength(),c=R(n.seed??1),l=Array.from({length:6},()=>[c()*6.28,1+Math.floor(c()*4),c()]),u=[],d=[],f=[],p=[],m=new h,g=new h;for(let e=0;e<=i;e++){let c=e/i;r.getPointAt(c,m);let p=t(c),h=o.normals[e],_=o.binormals[e];for(let e=0;e<=a;e++){let r=e/a*Math.PI*2,i=1;if(n.noise)for(let[e,t,a]of l)i+=Math.sin(r*t+e+c*9*a)*n.noise*.25*a;let o=Math.sin(r),v=-Math.cos(r);g.set(v*h.x+o*_.x,v*h.y+o*_.y,v*h.z+o*_.z).normalize(),u.push(m.x+g.x*p*i,m.y+g.y*p*i,m.z+g.z*p*i),d.push(g.x,g.y,g.z);let y=Math.max(.05,2*Math.PI*t(0));f.push(e/a,c*s/y*(n.uvScale??1))}}for(let e=0;e<i;e++)for(let t=0;t<a;t++){let n=e*(a+1)+t,r=(e+1)*(a+1)+t;p.push(n,r,n+1,r,r+1,n+1)}let _=new w;return _.setAttribute(`position`,new D(u,3)),_.setAttribute(`normal`,new D(d,3)),_.setAttribute(`uv`,new D(f,2)),_.setIndex(p),n.noise&&_.computeVertexNormals(),_}function Q(e,t,n){let r=n.clone().sub(t),i=r.length();return e.position.copy(t).add(n).multiplyScalar(.5),e.quaternion.setFromUnitVectors(new h(0,1,0),r.normalize()),i}function Le(e,t,n,r){let i=new s(new y(n,Math.max(1e-4,e.distanceTo(t)),6,16),r);return Q(i,e,t),i.castShadow=i.receiveShadow=!0,i}function Re(e,t,n,r,i=10){let a=new s(new g(n,n,e.distanceTo(t),i),r);return Q(a,e,t),a.castShadow=a.receiveShadow=!0,a}function ze(e,t,n,r,i=32){let a=new s(new x(1,i,Math.round(i*.75)),r);return a.scale.set(e,t,n),a.castShadow=a.receiveShadow=!0,a}function Be(e,t=1,r=4,i=.7){let a=new n(e,r),o=a.attributes.position,s=R(t),c=Array.from({length:7},()=>[new h(s()-.5,s()-.5,s()-.5).normalize(),1+s()*4,s()*6]),l=new h;for(let e=0;e<o.count;e++){l.fromBufferAttribute(o,e);let t=l.clone().normalize(),n=1;for(let[e,r,i]of c)n+=Math.sin(t.dot(e)*r*3+i)*.06;l.multiplyScalar(n),l.y*=l.y<0?i*.6:i,o.setXYZ(e,l.x,l.y,l.z)}return a.computeVertexNormals(),a}function Ve(e,t=!0,n=!0){e.updateMatrixWorld(!0);let r=new a().copy(e.matrixWorld).invert(),i=new Map,o=[];e.traverse(e=>{let t=e;if(!t.isMesh||t.isInstancedMesh||e.userData.keep){t.isMesh&&o.push(e);return}if(Array.isArray(t.material)){o.push(e);return}let n=t.geometry.index?t.geometry.toNonIndexed():t.geometry.clone();for(let e of Object.keys(n.attributes))[`position`,`normal`,`uv`].includes(e)||n.deleteAttribute(e);n.attributes.uv||n.setAttribute(`uv`,new D(new Float32Array(n.attributes.position.count*2),2)),n.attributes.normal||n.computeVertexNormals(),n.applyMatrix4(new a().multiplyMatrices(r,t.matrixWorld));let s=i.get(t.material)??[];s.push(n),i.set(t.material,s)});let c=new E;return i.forEach((e,r)=>{let i=ke(e,!1);if(e.forEach(e=>e.dispose()),!i)return;let a=new s(i,r);a.castShadow=t,a.receiveShadow=n,c.add(a)}),o.forEach(e=>{e.updateMatrixWorld(!0);let t=e,n=new a().multiplyMatrices(r,t.matrixWorld);t.removeFromParent(),n.decompose(t.position,t.quaternion,t.scale),c.add(t)}),c}function He(e){let t=[],n=Math.PI*(3-Math.sqrt(5));for(let r=0;r<e;r++){let i=1-r/(e-1)*2,a=Math.sqrt(1-i*i);t.push(new h(Math.cos(n*r)*a,i,Math.sin(n*r)*a))}return t}function $(e,t,n,r=!0){let i=document.createElement(`canvas`);i.width=e,i.height=t,n(i.getContext(`2d`));let a=new m(i);return a.colorSpace=r?f:``,a.anisotropy=8,a}function Ue(e){return $(4,128,t=>{let n=t.createLinearGradient(0,128,0,0);e.forEach(([e,t])=>n.addColorStop(e,t)),t.fillStyle=n,t.fillRect(0,0,4,128)})}function We(e,t){return $(128,512,n=>{n.clearRect(0,0,128,512),n.strokeStyle=`#d8cbb5`,n.lineWidth=3,n.beginPath(),n.moveTo(64,510),n.lineTo(64,20),n.stroke();for(let r=40;r<470;r+=3){let i=r/512,a=Math.sin(i*Math.PI)*52+6,o=n.createLinearGradient(64,0,64+a,0);o.addColorStop(0,e),o.addColorStop(1,t),n.strokeStyle=o,n.lineWidth=1.4;let s=Math.random()>.94?6:0;n.beginPath(),n.moveTo(64,r),n.quadraticCurveTo(64+a*.5,r-10,64+a-s,r-26),n.moveTo(64,r),n.quadraticCurveTo(64-a*.5,r-10,64-a+s,r-26),n.stroke()}})}export{ce as A,U as B,ge as C,Se as D,ye as E,ne as F,M as G,se as H,fe as I,j as J,O as K,pe as L,oe as M,W as N,Ee as O,ue as P,me as R,ve as S,Te as T,ae as U,le as V,re as W,Oe as _,Ie as a,Ce as b,He as c,je as d,Pe as f,Ue as g,Z as h,Re as i,de as j,we as k,Fe as l,Be as m,$ as n,ze as o,Me as p,R as q,Le as r,We as s,Ne as t,Ve as u,De as v,xe as w,be as x,he as y,ie as z};