(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const wl="187",Es={ROTATE:0,DOLLY:1,PAN:2},ys={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Td=0,fc=1,Ad=2,tr=1,Rd=2,Js=3,Qi=0,dn=1,_n=2,vn=0,nr=1,Rs=2,pc=3,mc=4,eu=5,si=100,Cd=101,Pd=102,Ld=103,Dd=104,Qs=200,Id=201,Nd=202,Ud=203,tu=204,nu=205,wo=206,Od=207,To=208,Fd=209,zd=210,Bd=211,kd=212,Hd=213,Vd=214,Ao=0,Ro=1,Co=2,cr=3,Po=4,Lo=5,Do=6,Io=7,iu=0,Gd=1,Wd=2,Ei=0,su=1,ru=2,au=3,Tl=4,ou=5,lu=6,cu=7,hu=300,Cs=301,hr=302,La=303,Da=304,Oi=1e3,ai=1001,No=1002,Wt=1003,Xd=1004,wr=1005,bn=1006,Ia=1007,Mi=1008,Sn=1009,uu=1010,du=1011,ur=1012,Al=1013,li=1014,$n=1015,Qt=1016,Rl=1017,Cl=1018,ji=1020,fu=35902,pu=35899,mu=1021,gu=1022,Yn=1023,Fi=1026,Si=1027,Pl=1028,Ll=1029,es=1030,Dl=1031,Il=1033,sa=33776,ra=33777,aa=33778,oa=33779,Uo=35840,Oo=35841,Fo=35842,zo=35843,Bo=36196,ko=37492,Ho=37496,Vo=37488,Go=37489,ua=37490,Wo=37491,Xo=37808,qo=37809,$o=37810,Yo=37811,Zo=37812,Ko=37813,Jo=37814,Qo=37815,jo=37816,el=37817,tl=37818,nl=37819,il=37820,sl=37821,rl=36492,al=36494,ol=36495,ll=36283,cl=36284,da=36285,hl=36286,qd=3200,$d=3201,fa=0,Yd=1,ri="",cn="srgb",dr="srgb-linear",pa="linear",St="srgb",Na=7680,Zd=519,Kd=512,Jd=513,Qd=514,vu=515,jd=516,ef=517,_u=518,xu=519,tf=35044,gc="300 es",Zn=2e3,fr=2001;function nf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ma(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function sf(){const i=ma("canvas");return i.style.display="block",i}const vc={};function _c(...i){const e="THREE."+i.shift();console.log(e,...i)}function Mu(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function qe(...i){i=Mu(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function pt(...i){i=Mu(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ws(...i){const e=i.join(" ");e in vc||(vc[e]=!0,qe(...i))}function rf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const af={[Ao]:Ao,[Co]:Do,[Po]:Po,[cr]:Lo,[Ro]:Ro,[Do]:Co,[Io]:Io,[Lo]:cr};class zi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let xc=1234567;const ir=Math.PI/180,Ps=180/Math.PI;function ss(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]+"-"+on[e&255]+on[e>>8&255]+"-"+on[e>>16&15|64]+on[e>>24&255]+"-"+on[t&63|128]+on[t>>8&255]+"-"+on[t>>16&255]+on[t>>24&255]+on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]).toLowerCase()}function et(i,e,t){return Math.max(e,Math.min(t,i))}function Nl(i,e){return(i%e+e)%e}function of(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function lf(i,e,t){return i!==e?(t-i)/(e-i):0}function sr(i,e,t){return(1-t)*i+t*e}function cf(i,e,t,n){return sr(i,e,1-Math.exp(-t*n))}function hf(i,e=1){return e-Math.abs(Nl(i,e*2)-e)}function uf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function df(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ff(i,e){return i+Math.floor(Math.random()*(e-i+1))}function pf(i,e){return i+Math.random()*(e-i)}function mf(i){return i*(.5-Math.random())}function gf(i){i!==void 0&&(xc=i);let e=xc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function vf(i){return i*ir}function _f(i){return i*Ps}function xf(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Mf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Su(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Sf(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ul(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function yu(i,e){if(e.constructor===Float32Array)return i;const t=Ul(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function bu(i,e){if(e.constructor===Float32Array)return i;const t=Ul(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}const tn={DEG2RAD:ir,RAD2DEG:Ps,generateUUID:ss,clamp:et,euclideanModulo:Nl,mapLinear:of,inverseLerp:lf,lerp:sr,damp:cf,pingpong:hf,smoothstep:uf,smootherstep:df,randInt:ff,randFloat:pf,randFloatSpread:mf,seededRandom:gf,degToRad:vf,radToDeg:_f,isPowerOfTwo:xf,ceilPowerOfTwo:Mf,floorPowerOfTwo:Su,setQuaternionFromProperEuler:Sf,normalize:bu,denormalize:yu};class te{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class nn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],g=r[a+2],M=r[a+3];if(u!==M||l!==d||c!==f||h!==g){let m=l*d+c*f+h*g+u*M;m<0&&(d=-d,f=-f,g=-g,M=-M,m=-m);let p=1-o;if(m<.9995){const _=Math.acos(m),E=Math.sin(_);p=Math.sin(p*_)/E,o=Math.sin(o*_)/E,l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+M*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+M*o;const _=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=_,c*=_,h*=_,u*=_}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ua.copy(this).projectOnVector(e),this.sub(Ua)}reflect(e){return this.sub(Ua.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ua=new A,Mc=new nn;class Je{static{this.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],M=s[0],m=s[3],p=s[6],_=s[1],E=s[4],x=s[7],T=s[2],y=s[5],v=s[8];return r[0]=a*M+o*_+l*T,r[3]=a*m+o*E+l*y,r[6]=a*p+o*x+l*v,r[1]=c*M+h*_+u*T,r[4]=c*m+h*E+u*y,r[7]=c*p+h*x+u*v,r[2]=d*M+f*_+g*T,r[5]=d*m+f*E+g*y,r[8]=d*p+f*x+g*v,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=u*M,e[1]=(s*c-h*n)*M,e[2]=(o*n-s*a)*M,e[3]=d*M,e[4]=(h*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=f*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ws("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Oa.makeScale(e,t)),this}rotate(e){return ws("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Oa.makeRotation(-e)),this}translate(e,t){return ws("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Oa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Oa=new Je,Sc=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yc=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yf(){const i={enabled:!0,workingColorSpace:dr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===St&&(s.r=wi(s.r),s.g=wi(s.g),s.b=wi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===St&&(s.r=Ts(s.r),s.g=Ts(s.g),s.b=Ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ri?pa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dr]:{primaries:e,whitePoint:n,transfer:pa,toXYZ:Sc,fromXYZ:yc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:cn},outputColorSpaceConfig:{drawingBufferColorSpace:cn}},[cn]:{primaries:e,whitePoint:n,transfer:St,toXYZ:Sc,fromXYZ:yc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:cn}}}),i}const ut=yf();function wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ls;class bf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ls===void 0&&(ls=ma("canvas")),ls.width=e.width,ls.height=e.height;const s=ls.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ls}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ma("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(wi(t[n]/255)*255):t[n]=wi(t[n]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ef=0;class Ol{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=ss(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Fa(s[a].image)):r.push(Fa(s[a]))}else r=Fa(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Fa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?bf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}let wf=0;const za=new A;class sn extends zi{constructor(e=sn.DEFAULT_IMAGE,t=sn.DEFAULT_MAPPING,n=ai,s=ai,r=bn,a=Mi,o=Yn,l=Sn,c=sn.DEFAULT_ANISOTROPY,h=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=ss(),this.name="",this.source=new Ol(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(za).x}get height(){return this.source.getSize(za).y}get depth(){return this.source.getSize(za).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){qe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==hu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Oi:e.x=e.x-Math.floor(e.x);break;case ai:e.x=e.x<0?0:1;break;case No:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Oi:e.y=e.y-Math.floor(e.y);break;case ai:e.y=e.y<0?0:1;break;case No:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=hu;sn.DEFAULT_ANISOTROPY=1;class Ct{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],M=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+M)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,x=(f+1)/2,T=(p+1)/2,y=(h+d)/4,v=(u+M)/4,S=(g+m)/4;return E>x&&E>T?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=y/n,r=v/n):x>T?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=y/s,r=S/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=v/r,s=S/r),this.set(n,s,r,t),this}let _=Math.sqrt((m-g)*(m-g)+(u-M)*(u-M)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-M)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tf extends zi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:bn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t),this.textures=[];const s=n.count;for(let r=0;r<s;r++)this.textures[r]=new sn({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:bn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ol(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jt extends Tf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Eu extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Af extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Qe{static{this.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,g,M,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,M,m)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,M,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=M,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/cs.setFromMatrixColumn(e,0).length(),r=1/cs.setFromMatrixColumn(e,1).length(),a=1/cs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,M=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-M*c,t[9]=-o*l,t[2]=M-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,M=c*u;t[0]=d+M*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=M+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,M=c*u;t[0]=d-M*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=M-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,M=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+M,t[1]=l*u,t[5]=M*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,M=o*c;t[0]=l*h,t[4]=M-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-M*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,M=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+M,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=M*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rf,e,Cf)}lookAt(e,t,n){const s=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),Ci.crossVectors(n,An),Ci.lengthSq()===0&&(Math.abs(n.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),Ci.crossVectors(n,An)),Ci.normalize(),Tr.crossVectors(An,Ci),s[0]=Ci.x,s[4]=Tr.x,s[8]=An.x,s[1]=Ci.y,s[5]=Tr.y,s[9]=An.y,s[2]=Ci.z,s[6]=Tr.z,s[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],M=n[6],m=n[10],p=n[14],_=n[3],E=n[7],x=n[11],T=n[15],y=s[0],v=s[4],S=s[8],L=s[12],R=s[1],P=s[5],D=s[9],B=s[13],I=s[2],F=s[6],X=s[10],z=s[14],ee=s[3],k=s[7],Z=s[11],Q=s[15];return r[0]=a*y+o*R+l*I+c*ee,r[4]=a*v+o*P+l*F+c*k,r[8]=a*S+o*D+l*X+c*Z,r[12]=a*L+o*B+l*z+c*Q,r[1]=h*y+u*R+d*I+f*ee,r[5]=h*v+u*P+d*F+f*k,r[9]=h*S+u*D+d*X+f*Z,r[13]=h*L+u*B+d*z+f*Q,r[2]=g*y+M*R+m*I+p*ee,r[6]=g*v+M*P+m*F+p*k,r[10]=g*S+M*D+m*X+p*Z,r[14]=g*L+M*B+m*z+p*Q,r[3]=_*y+E*R+x*I+T*ee,r[7]=_*v+E*P+x*F+T*k,r[11]=_*S+E*D+x*X+T*Z,r[15]=_*L+E*B+x*z+T*Q,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],M=e[7],m=e[11],p=e[15],_=l*f-c*d,E=o*f-c*u,x=o*d-l*u,T=a*f-c*h,y=a*d-l*h,v=a*u-o*h;return t*(M*_-m*E+p*x)-n*(g*_-m*T+p*y)+s*(g*E-M*T+p*v)-r*(g*x-M*y+m*v)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],M=e[13],m=e[14],p=e[15],_=t*o-n*a,E=t*l-s*a,x=t*c-r*a,T=n*l-s*o,y=n*c-r*o,v=s*c-r*l,S=h*M-u*g,L=h*m-d*g,R=h*p-f*g,P=u*m-d*M,D=u*p-f*M,B=d*p-f*m,I=_*B-E*D+x*P+T*R-y*L+v*S;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/I;return e[0]=(o*B-l*D+c*P)*F,e[1]=(s*D-n*B-r*P)*F,e[2]=(M*v-m*y+p*T)*F,e[3]=(d*y-u*v-f*T)*F,e[4]=(l*R-a*B-c*L)*F,e[5]=(t*B-s*R+r*L)*F,e[6]=(m*x-g*v-p*E)*F,e[7]=(h*v-d*x+f*E)*F,e[8]=(a*D-o*R+c*S)*F,e[9]=(n*R-t*D-r*S)*F,e[10]=(g*y-M*x+p*_)*F,e[11]=(u*x-h*y-f*_)*F,e[12]=(o*L-a*P-l*S)*F,e[13]=(t*P-n*L+s*S)*F,e[14]=(M*E-g*T-m*_)*F,e[15]=(h*T-u*E+d*_)*F,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,M=a*h,m=a*u,p=o*u,_=l*c,E=l*h,x=l*u,T=n.x,y=n.y,v=n.z;return s[0]=(1-(M+p))*T,s[1]=(f+x)*T,s[2]=(g-E)*T,s[3]=0,s[4]=(f-x)*y,s[5]=(1-(d+p))*y,s[6]=(m+_)*y,s[7]=0,s[8]=(g+E)*v,s[9]=(m-_)*v,s[10]=(1-(d+M))*v,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=cs.set(s[0],s[1],s[2]).length();const o=cs.set(s[4],s[5],s[6]).length(),l=cs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Vn.copy(this);const c=1/a,h=1/o,u=1/l;return Vn.elements[0]*=c,Vn.elements[1]*=c,Vn.elements[2]*=c,Vn.elements[4]*=h,Vn.elements[5]*=h,Vn.elements[6]*=h,Vn.elements[8]*=u,Vn.elements[9]*=u,Vn.elements[10]*=u,t.setFromRotationMatrix(Vn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Zn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s);let g,M;if(l)g=r/(a-r),M=a*r/(a-r);else if(o===Zn)g=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===fr)g=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Zn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s);let g,M;if(l)g=1/(a-r),M=a/(a-r);else if(o===Zn)g=-2/(a-r),M=-(a+r)/(a-r);else if(o===fr)g=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const cs=new A,Vn=new Qe,Rf=new A(0,0,0),Cf=new A(1,1,1),Ci=new A,Tr=new A,An=new A,bc=new Qe,Ec=new nn;class En{constructor(e=0,t=0,n=0,s=En.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-et(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ec.setFromEuler(this),this.setFromQuaternion(Ec,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class Fl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Pf=0;const wc=new A,hs=new nn,di=new Qe,Ar=new A,Hs=new A,Lf=new A,Df=new nn,Tc=new A(1,0,0),Ac=new A(0,1,0),Rc=new A(0,0,1),Cc={type:"added"},If={type:"removed"},us={type:"childadded",child:null},Ba={type:"childremoved",child:null};class Ft extends zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=ss(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new A,t=new En,n=new nn,s=new A(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qe},normalMatrix:{value:new Je}}),this.matrix=new Qe,this.matrixWorld=new Qe,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hs.setFromAxisAngle(e,t),this.quaternion.multiply(hs),this}rotateOnWorldAxis(e,t){return hs.setFromAxisAngle(e,t),this.quaternion.premultiply(hs),this}rotateX(e){return this.rotateOnAxis(Tc,e)}rotateY(e){return this.rotateOnAxis(Ac,e)}rotateZ(e){return this.rotateOnAxis(Rc,e)}translateOnAxis(e,t){return wc.copy(e).applyQuaternion(this.quaternion),this.position.add(wc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Tc,e)}translateY(e){return this.translateOnAxis(Ac,e)}translateZ(e){return this.translateOnAxis(Rc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ar.copy(e):Ar.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(Hs,Ar,this.up):di.lookAt(Ar,Hs,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),hs.setFromRotationMatrix(di),this.quaternion.premultiply(hs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(pt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cc),us.child=e,this.dispatchEvent(us),us.child=null):pt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(If),Ba.child=e,this.dispatchEvent(Ba),Ba.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cc),us.child=e,this.dispatchEvent(us),us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hs,e,Lf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hs,Df,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ft.DEFAULT_UP=new A(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class st extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nf={type:"move"};class ka{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new st,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new st,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new st,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const m=t.getJointPose(M,n),p=this._getHandJoint(c,M);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new st;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const wu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},Rr={h:0,s:0,l:0};function Ha(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ce{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=cn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,ut.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ut.workingColorSpace){if(e=Nl(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ha(a,r,e+1/3),this.g=Ha(a,r,e),this.b=Ha(a,r,e-1/3)}return ut.colorSpaceToWorking(this,s),this}setStyle(e,t=cn){function n(r){r!==void 0&&parseFloat(r)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=cn){const n=wu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wi(e.r),this.g=wi(e.g),this.b=wi(e.b),this}copyLinearToSRGB(e){return this.r=Ts(e.r),this.g=Ts(e.g),this.b=Ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=cn){return ut.workingToColorSpace(ln.copy(this),e),Math.round(et(ln.r*255,0,255))*65536+Math.round(et(ln.g*255,0,255))*256+Math.round(et(ln.b*255,0,255))}getHexString(e=cn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.workingToColorSpace(ln.copy(this),t);const n=ln.r,s=ln.g,r=ln.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ut.workingColorSpace){return ut.workingToColorSpace(ln.copy(this),t),e.r=ln.r,e.g=ln.g,e.b=ln.b,e}getStyle(e=cn){ut.workingToColorSpace(ln.copy(this),e);const t=ln.r,n=ln.g,s=ln.b;return e!==cn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(Rr);const n=sr(Pi.h,Rr.h,t),s=sr(Pi.s,Rr.s,t),r=sr(Pi.l,Rr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ln=new Ce;Ce.NAMES=wu;class zl{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ce(e),this.near=t,this.far=n}clone(){return new zl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ul extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Gn=new A,fi=new A,Va=new A,pi=new A,ds=new A,fs=new A,Pc=new A,Ga=new A,Wa=new A,Xa=new A,qa=new Ct,$a=new Ct,Ya=new Ct;class qn{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Gn.subVectors(e,t),s.cross(Gn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Gn.subVectors(s,t),fi.subVectors(n,t),Va.subVectors(e,t);const a=Gn.dot(Gn),o=Gn.dot(fi),l=Gn.dot(Va),c=fi.dot(fi),h=fi.dot(Va),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,pi.x),l.addScaledVector(a,pi.y),l.addScaledVector(o,pi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return qa.setScalar(0),$a.setScalar(0),Ya.setScalar(0),qa.fromBufferAttribute(e,t),$a.fromBufferAttribute(e,n),Ya.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(qa,r.x),a.addScaledVector($a,r.y),a.addScaledVector(Ya,r.z),a}static isFrontFacing(e,t,n,s){return Gn.subVectors(n,t),fi.subVectors(e,t),Gn.cross(fi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),Gn.cross(fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return qn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return qn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return qn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;ds.subVectors(s,n),fs.subVectors(r,n),Ga.subVectors(e,n);const l=ds.dot(Ga),c=fs.dot(Ga);if(l<=0&&c<=0)return t.copy(n);Wa.subVectors(e,s);const h=ds.dot(Wa),u=fs.dot(Wa);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(n).addScaledVector(ds,a);Xa.subVectors(e,r);const f=ds.dot(Xa),g=fs.dot(Xa);if(g>=0&&f<=g)return t.copy(r);const M=f*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(fs,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Pc.subVectors(r,s),o=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(Pc,o);const p=1/(m+M+d);return a=M*p,o=d*p,t.copy(n).addScaledVector(ds,a).addScaledVector(fs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ti{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Wn):Wn.fromBufferAttribute(r,a),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Cr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cr.copy(n.boundingBox)),Cr.applyMatrix4(e.matrixWorld),this.union(Cr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vs),Pr.subVectors(this.max,Vs),ps.subVectors(e.a,Vs),ms.subVectors(e.b,Vs),gs.subVectors(e.c,Vs),Li.subVectors(ms,ps),Di.subVectors(gs,ms),Gi.subVectors(ps,gs);let t=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-Gi.z,Gi.y,Li.z,0,-Li.x,Di.z,0,-Di.x,Gi.z,0,-Gi.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-Gi.y,Gi.x,0];return!Za(t,ps,ms,gs,Pr)||(t=[1,0,0,0,1,0,0,0,1],!Za(t,ps,ms,gs,Pr))?!1:(Lr.crossVectors(Li,Di),t=[Lr.x,Lr.y,Lr.z],Za(t,ps,ms,gs,Pr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const mi=[new A,new A,new A,new A,new A,new A,new A,new A],Wn=new A,Cr=new Ti,ps=new A,ms=new A,gs=new A,Li=new A,Di=new A,Gi=new A,Vs=new A,Pr=new A,Lr=new A,Wi=new A;function Za(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Wi.fromArray(i,r);const o=s.x*Math.abs(Wi.x)+s.y*Math.abs(Wi.y)+s.z*Math.abs(Wi.z),l=e.dot(Wi),c=t.dot(Wi),h=n.dot(Wi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Bt=new A,Dr=new te;let Uf=0;class zn extends zi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Uf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=tf,this.updateRanges=[],this.gpuType=$n,this.version=0,this._normalizationScale=e!==void 0?Ul(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Dr.fromBufferAttribute(this,t),Dr.applyMatrix3(e),this.setXY(t,Dr.x,Dr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix3(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):yu(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):bu(e,this.array)}}class Tu extends zn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Au extends zn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ye extends zn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Of=new Ti,Gs=new A,Ka=new A;class Fs{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Of.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gs.subVectors(e,this.center);const t=Gs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Gs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ka.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gs.copy(e.center).add(Ka)),this.expandByPoint(Gs.copy(e.center).sub(Ka))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ff=0;const Nn=new Qe,Ja=new Ft,vs=new A,Rn=new Ti,Ws=new Ti,Kt=new A;class Ut extends zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ff++}),this.uuid=ss(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(nf(e)?Au:Tu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,n){return Nn.makeTranslation(e,t,n),this.applyMatrix4(Nn),this}scale(e,t,n){return Nn.makeScale(e,t,n),this.applyMatrix4(Nn),this}lookAt(e){return Ja.lookAt(e),Ja.updateMatrix(),this.applyMatrix4(Ja.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vs).negate(),this.translate(vs.x,vs.y,vs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ye(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Kt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(Kt),Kt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(Kt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ws.setFromBufferAttribute(o),this.morphTargetsRelative?(Kt.addVectors(Rn.min,Ws.min),Rn.expandByPoint(Kt),Kt.addVectors(Rn.max,Ws.max),Rn.expandByPoint(Kt)):(Rn.expandByPoint(Ws.min),Rn.expandByPoint(Ws.max))}Rn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Kt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Kt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Kt.fromBufferAttribute(o,c),l&&(vs.fromBufferAttribute(e,c),Kt.add(vs)),s=Math.max(s,n.distanceToSquared(Kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&pt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){pt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new zn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(n.count);for(let L=0;L<n.count;L++)o[L]=new A,l[L]=new A;const h=new A,u=new A,d=new A,f=new te,g=new te,M=new te,m=new A,p=new A;function _(L,R,P){c[L]=c[R]=c[P]=1,h.fromBufferAttribute(n,L),u.fromBufferAttribute(n,R),d.fromBufferAttribute(n,P),f.fromBufferAttribute(r,L),g.fromBufferAttribute(r,R),M.fromBufferAttribute(r,P),u.sub(h),d.sub(h),g.sub(f),M.sub(f);const D=1/(g.x*M.y-M.x*g.y);isFinite(D)&&(m.copy(u).multiplyScalar(M.y).addScaledVector(d,-g.y).multiplyScalar(D),p.copy(d).multiplyScalar(g.x).addScaledVector(u,-M.x).multiplyScalar(D),o[L].add(m),o[R].add(m),o[P].add(m),l[L].add(p),l[R].add(p),l[P].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let L=0,R=E.length;L<R;++L){const P=E[L],D=P.start,B=P.count;for(let I=D,F=D+B;I<F;I+=3)_(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const x=new A,T=new A,y=new A,v=new A;function S(L){y.fromBufferAttribute(s,L),v.copy(y);const R=o[L];x.copy(R),x.sub(y.multiplyScalar(y.dot(R))).normalize(),T.crossVectors(v,R);const D=T.dot(l[L])<0?-1:1;a.setXYZW(L,x.x,x.y,x.z,D)}for(let L=0,R=n.count;L<R;++L)c[L]&&S(L);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new zn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new A,r=new A,a=new A,o=new A,l=new A,c=new A,h=new A,u=new A;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),M=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Kt.fromBufferAttribute(e,t),Kt.normalize(),e.setXYZ(t,Kt.x,Kt.y,Kt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let M=0,m=l.length;M<m;M++){o.isInterleavedBufferAttribute?f=l[M]*o.data.stride+o.offset:f=l[M]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new zn(d,h,u)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qa=new A,zf=new A,Bf=new Je;class ti{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Qa.subVectors(n,t).cross(zf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(Qa),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Bf.getNormalMatrix(e),s=this.coplanarPoint(Qa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let kf=0;class rs extends zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=ss(),this.name="",this.type="Material",this.blending=nr,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tu,this.blendDst=nu,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ce(0,0,0),this.blendAlpha=0,this.depthFunc=cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Na,this.stencilZFail=Na,this.stencilZPass=Na,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ce().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new ti().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new te().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new te().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const gi=new A,ja=new A,Ir=new A,Nr=new A;class _a{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gi.copy(this.origin).addScaledVector(this.direction,t),gi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ja.copy(e).add(t).multiplyScalar(.5),Ir.copy(t).sub(e).normalize(),Nr.copy(this.origin).sub(ja);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ir),o=Nr.dot(this.direction),l=-Nr.dot(Ir),c=Nr.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const M=1/h;u*=M,d*=M,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ja).addScaledVector(Ir,d),f}intersectSphere(e,t){if(e.radius<0)return null;gi.subVectors(e.center,this.origin);const n=gi.dot(this.direction),s=gi.dot(gi)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,gi)!==null}intersectTriangle(e,t,n,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,g=t.x-a.x,M=t.y-a.y,m=t.z-a.z,p=n.x-a.x,_=n.y-a.y,E=n.z-a.z,x=Math.abs(l),T=Math.abs(c),y=Math.abs(h);let v,S,L,R,P,D,B,I,F,X,z,ee;if(x>=T&&x>=y?(L=l,D=u,F=g,ee=p,l>=0?(v=c,S=h,R=d,P=f,B=M,I=m,X=_,z=E):(v=h,S=c,R=f,P=d,B=m,I=M,X=E,z=_)):T>=y?(L=c,D=d,F=M,ee=_,c>=0?(v=h,S=l,R=f,P=u,B=m,I=g,X=E,z=p):(v=l,S=h,R=u,P=f,B=g,I=m,X=p,z=E)):(L=h,D=f,F=m,ee=E,h>=0?(v=l,S=c,R=u,P=d,B=g,I=M,X=p,z=_):(v=c,S=l,R=d,P=u,B=M,I=g,X=_,z=p)),L===0)return null;const k=v/L,Z=S/L,Q=1/L,xe=R-k*D,re=P-Z*D,W=B-k*F,oe=I-Z*F,ye=X-k*ee,ie=z-Z*ee,se=ye*oe-ie*W,Re=xe*ie-re*ye,tt=W*re-oe*xe;if(s){if(se<0||Re<0||tt<0)return null}else if((se<0||Re<0||tt<0)&&(se>0||Re>0||tt>0))return null;const Pe=se+Re+tt;if(Pe===0)return null;const Fe=Q*(se*D+Re*F+tt*ee);return(Pe>0?Fe<0:Fe>0)?null:this.at(Fe/Pe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xn extends rs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=iu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Lc=new Qe,Xi=new _a,Ur=new Fs,Dc=new A,Or=new A,Fr=new A,zr=new A,eo=new A,Br=new A,Ic=new A,kr=new A;class Be extends Ft{constructor(e=new Ut,t=new Xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(eo.fromBufferAttribute(u,e),a?Br.addScaledVector(eo,h):Br.addScaledVector(eo.sub(t),h))}t.add(Br)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(r),Xi.copy(e.ray).recast(e.near),!(Ur.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(Ur,Dc)===null||Xi.origin.distanceToSquared(Dc)>(e.far-e.near)**2))&&(Lc.copy(r).invert(),Xi.copy(e.ray).applyMatrix4(Lc),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Xi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=d.length;g<M;g++){const m=d[g],p=a[m.materialIndex],_=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=_,T=E;x<T;x+=3){const y=o.getX(x),v=o.getX(x+1),S=o.getX(x+2);s=Hr(this,p,e,n,c,h,u,y,v,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),M=Math.min(o.count,f.start+f.count);for(let m=g,p=M;m<p;m+=3){const _=o.getX(m),E=o.getX(m+1),x=o.getX(m+2);s=Hr(this,a,e,n,c,h,u,_,E,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,M=d.length;g<M;g++){const m=d[g],p=a[m.materialIndex],_=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=_,T=E;x<T;x+=3){const y=x,v=x+1,S=x+2;s=Hr(this,p,e,n,c,h,u,y,v,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),M=Math.min(l.count,f.start+f.count);for(let m=g,p=M;m<p;m+=3){const _=m,E=m+1,x=m+2;s=Hr(this,a,e,n,c,h,u,_,E,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Hf(i,e,t,n,s,r,a,o){let l;if(e.side===dn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Qi,o),l===null)return null;kr.copy(o),kr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(kr);return c<t.near||c>t.far?null:{distance:c,point:kr.clone(),object:i}}function Hr(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Or),i.getVertexPosition(l,Fr),i.getVertexPosition(c,zr);const h=Hf(i,e,t,n,Or,Fr,zr,Ic);if(h){const u=new A;qn.getBarycoord(Ic,Or,Fr,zr,u),s&&(h.uv=qn.getInterpolatedAttribute(s,o,l,c,u,new te)),r&&(h.uv1=qn.getInterpolatedAttribute(r,o,l,c,u,new te)),a&&(h.normal=qn.getInterpolatedAttribute(a,o,l,c,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new A,materialIndex:0};qn.getNormal(Or,Fr,zr,d.normal),h.face=d,h.barycoord=u}return h}class xa extends sn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Wt,h=Wt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nc extends zn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const _s=new Qe,Uc=new Qe,Vr=[],Oc=new Ti,Vf=new Qe,Xs=new Be,qs=new Fs;class dl extends Be{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Nc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Vf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,_s),Oc.copy(e.boundingBox).applyMatrix4(_s),this.boundingBox.union(Oc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,_s),qs.copy(e.boundingSphere).applyMatrix4(_s),this.boundingSphere.union(qs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Xs.geometry=this.geometry,Xs.material=this.material,Xs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qs.copy(this.boundingSphere),qs.applyMatrix4(n),e.ray.intersectsSphere(qs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,_s),Uc.multiplyMatrices(n,_s),Xs.matrixWorld=Uc,Xs.raycast(e,Vr);for(let a=0,o=Vr.length;a<o;a++){const l=Vr[a];l.instanceId=r,l.object=this,t.push(l)}Vr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Nc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new xa(new Float32Array(s*this.count),s,this.count,Pl,$n));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const qi=new Fs,Gf=new te(.5,.5),Gr=new A;class pr{constructor(e=new ti,t=new ti,n=new ti,s=new ti,r=new ti,a=new ti){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Zn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],M=r[9],m=r[10],p=r[11],_=r[12],E=r[13],x=r[14],T=r[15];if(s[0].setComponents(c-a,f-h,p-g,T-_).normalize(),s[1].setComponents(c+a,f+h,p+g,T+_).normalize(),s[2].setComponents(c+o,f+u,p+M,T+E).normalize(),s[3].setComponents(c-o,f-u,p-M,T-E).normalize(),n)s[4].setComponents(l,d,m,x).normalize(),s[5].setComponents(c-l,f-d,p-m,T-x).normalize();else if(s[4].setComponents(c-l,f-d,p-m,T-x).normalize(),t===Zn)s[5].setComponents(c+l,f+d,p+m,T+x).normalize();else if(t===fr)s[5].setComponents(l,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(e){qi.center.set(0,0,0);const t=Gf.distanceTo(e.center);return qi.radius=.7071067811865476+t,qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Gr.x=s.normal.x>0?e.max.x:e.min.x,Gr.y=s.normal.y>0?e.max.y:e.min.y,Gr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Gr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Fc=new Qe;class Bl{constructor(){this.coordinateSystem=Zn,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];Fc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new pr),n[s].setFromProjectionMatrix(Fc,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new pr),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new Bl().copy(this)}}class Wf extends rs{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const zc=new Qe,fl=new _a,Wr=new Fs,Xr=new A;class Xf extends Ft{constructor(e=new Ut,t=new Wf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(s),Wr.radius+=r,e.ray.intersectsSphere(Wr)===!1)return;zc.copy(s).invert(),fl.copy(e.ray).applyMatrix4(zc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,M=f;g<M;g++){const m=c.getX(g);Xr.fromBufferAttribute(u,m),Bc(Xr,m,l,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,M=f;g<M;g++)Xr.fromBufferAttribute(u,g),Bc(Xr,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Bc(i,e,t,n,s,r,a){const o=fl.distanceSqToPoint(i);if(o<t){const l=new A;fl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Ru extends sn{constructor(e=[],t=Cs,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rr extends sn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ts extends sn{constructor(e,t,n=li,s,r,a,o=Wt,l=Wt,c,h=Fi,u=1){if(h!==Fi&&h!==Si)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ol(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Cu extends ts{constructor(e,t=li,n=Cs,s,r,a=Wt,o=Wt,l,c=Fi){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Pu extends sn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Dn extends Ut{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ye(c,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(u,2));function g(M,m,p,_,E,x,T,y,v,S,L){const R=x/v,P=T/S,D=x/2,B=T/2,I=y/2,F=v+1,X=S+1;let z=0,ee=0;const k=new A;for(let Z=0;Z<X;Z++){const Q=Z*P-B;for(let xe=0;xe<F;xe++){const re=xe*R-D;k[M]=re*_,k[m]=Q*E,k[p]=I,c.push(k.x,k.y,k.z),k[M]=0,k[m]=0,k[p]=y>0?1:-1,h.push(k.x,k.y,k.z),u.push(xe/v),u.push(1-Z/S),z+=1}}for(let Z=0;Z<S;Z++)for(let Q=0;Q<v;Q++){const xe=d+Q+F*Z,re=d+Q+F*(Z+1),W=d+(Q+1)+F*(Z+1),oe=d+(Q+1)+F*Z;l.push(xe,re,oe),l.push(re,W,oe),ee+=6}o.addGroup(f,ee,L),f+=ee,d+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ls extends Ut{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new A,h=new te;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ye(a,3)),this.setAttribute("normal",new Ye(o,3)),this.setAttribute("uv",new Ye(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ls(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class In extends Ut{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const M=[],m=n/2;let p=0;_(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Ye(u,3)),this.setAttribute("normal",new Ye(d,3)),this.setAttribute("uv",new Ye(f,2));function _(){const x=new A,T=new A;let y=0;const v=(t-e)/n;for(let S=0;S<=r;S++){const L=[],R=S/r,P=R*(t-e)+e;for(let D=0;D<=s;D++){const B=D/s,I=B*l+o,F=Math.sin(I),X=Math.cos(I);T.x=P*F,T.y=-R*n+m,T.z=P*X,u.push(T.x,T.y,T.z),x.set(F,v,X).normalize(),d.push(x.x,x.y,x.z),f.push(B,1-R),L.push(g++)}M.push(L)}for(let S=0;S<s;S++)for(let L=0;L<r;L++){const R=M[L][S],P=M[L+1][S],D=M[L+1][S+1],B=M[L][S+1];(e>0||L!==0)&&(h.push(R,P,B),y+=3),(t>0||L!==r-1)&&(h.push(P,D,B),y+=3)}c.addGroup(p,y,0),p+=y}function E(x){const T=g,y=new te,v=new A;let S=0;const L=x===!0?e:t,R=x===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,m*R,0),d.push(0,R,0),f.push(.5,.5),g++;const P=g;for(let D=0;D<=s;D++){const I=D/s*l+o,F=Math.cos(I),X=Math.sin(I);v.x=L*X,v.y=m*R,v.z=L*F,u.push(v.x,v.y,v.z),d.push(0,R,0),y.x=F*.5+.5,y.y=X*.5*R+.5,f.push(y.x,y.y),g++}for(let D=0;D<s;D++){const B=T+D,I=P+D;x===!0?h.push(I,I+1,B):h.push(I+1,I,B),S+=3}c.addGroup(p,S,x===!0?1:2),p+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new In(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class kl extends Ut{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new Ye(r,3)),this.setAttribute("normal",new Ye(r.slice(),3)),this.setAttribute("uv",new Ye(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const E=new A,x=new A,T=new A;for(let y=0;y<t.length;y+=3)f(t[y+0],E),f(t[y+1],x),f(t[y+2],T),l(E,x,T,_)}function l(_,E,x,T){const y=T+1,v=[];for(let S=0;S<=y;S++){v[S]=[];const L=_.clone().lerp(x,S/y),R=E.clone().lerp(x,S/y),P=y-S;for(let D=0;D<=P;D++)D===0&&S===y?v[S][D]=L:v[S][D]=L.clone().lerp(R,D/P)}for(let S=0;S<y;S++)for(let L=0;L<2*(y-S)-1;L++){const R=Math.floor(L/2);L%2===0?(d(v[S][R+1]),d(v[S+1][R]),d(v[S][R])):(d(v[S][R+1]),d(v[S+1][R+1]),d(v[S+1][R]))}}function c(_){const E=new A;for(let x=0;x<r.length;x+=3)E.x=r[x+0],E.y=r[x+1],E.z=r[x+2],E.normalize().multiplyScalar(_),r[x+0]=E.x,r[x+1]=E.y,r[x+2]=E.z}function h(){const _=new A;for(let E=0;E<r.length;E+=3){_.x=r[E+0],_.y=r[E+1],_.z=r[E+2];const x=m(_)/2/Math.PI+.5,T=p(_)/Math.PI+.5;a.push(x,1-T)}g(),u()}function u(){for(let _=0;_<a.length;_+=6){const E=a[_+0],x=a[_+2],T=a[_+4],y=Math.max(E,x,T),v=Math.min(E,x,T);y>.9&&v<.1&&(E<.2&&(a[_+0]+=1),x<.2&&(a[_+2]+=1),T<.2&&(a[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function f(_,E){const x=_*3;E.x=e[x+0],E.y=e[x+1],E.z=e[x+2]}function g(){const _=new A,E=new A,x=new A,T=new A,y=new te,v=new te,S=new te;for(let L=0,R=0;L<r.length;L+=9,R+=6){_.set(r[L+0],r[L+1],r[L+2]),E.set(r[L+3],r[L+4],r[L+5]),x.set(r[L+6],r[L+7],r[L+8]),y.set(a[R+0],a[R+1]),v.set(a[R+2],a[R+3]),S.set(a[R+4],a[R+5]),T.copy(_).add(E).add(x).divideScalar(3);const P=m(T);M(y,R+0,_,P),M(v,R+2,E,P),M(S,R+4,x,P)}}function M(_,E,x,T){T<0&&_.x===1&&(a[E]=_.x-1),x.x===0&&x.z===0&&(a[E]=T/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kl(e.vertices,e.indices,e.radius,e.detail)}}class hi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new te:new A);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new A,s=[],r=[],a=[],o=new A,l=new Qe;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new A)}r[0]=new A,a[0]=new A;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(et(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(et(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}}class Hl extends hi{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new te){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class qf extends Hl{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Vl(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const kc=new A,Hc=new A,to=new Vl,no=new Vl,io=new Vl;class Ma extends hi{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new A){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Hc.subVectors(s[0],s[1]).add(s[0]),c=Hc);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(kc.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=kc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),M=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);M<1e-4&&(M=1),g<1e-4&&(g=M),m<1e-4&&(m=M),to.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,M,m),no.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,M,m),io.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,M,m)}else this.curveType==="catmullrom"&&(to.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),no.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),io.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(to.calc(l),no.calc(l),io.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new A().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Vc(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function $f(i,e){const t=1-i;return t*t*e}function Yf(i,e){return 2*(1-i)*i*e}function Zf(i,e){return i*i*e}function ar(i,e,t,n){return $f(i,e)+Yf(i,t)+Zf(i,n)}function Kf(i,e){const t=1-i;return t*t*t*e}function Jf(i,e){const t=1-i;return 3*t*t*i*e}function Qf(i,e){return 3*(1-i)*i*i*e}function jf(i,e){return i*i*i*e}function or(i,e,t,n,s){return Kf(i,e)+Jf(i,t)+Qf(i,n)+jf(i,s)}class Lu extends hi{constructor(e=new te,t=new te,n=new te,s=new te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new te){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(or(e,s.x,r.x,a.x,o.x),or(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ep extends hi{constructor(e=new A,t=new A,n=new A,s=new A){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new A){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(or(e,s.x,r.x,a.x,o.x),or(e,s.y,r.y,a.y,o.y),or(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Du extends hi{constructor(e=new te,t=new te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class tp extends hi{constructor(e=new A,t=new A){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new A){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new A){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Iu extends hi{constructor(e=new te,t=new te,n=new te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new te){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ar(e,s.x,r.x,a.x),ar(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class np extends hi{constructor(e=new A,t=new A,n=new A){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new A){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ar(e,s.x,r.x,a.x),ar(e,s.y,r.y,a.y),ar(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Nu extends hi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new te){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Vc(o,l.x,c.x,h.x,u.x),Vc(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new te().fromArray(s))}return this}}var pl=Object.freeze({__proto__:null,ArcCurve:qf,CatmullRomCurve3:Ma,CubicBezierCurve:Lu,CubicBezierCurve3:ep,EllipseCurve:Hl,LineCurve:Du,LineCurve3:tp,QuadraticBezierCurve:Iu,QuadraticBezierCurve3:np,SplineCurve:Nu});class ip extends hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new pl[s.type]().fromJSON(s))}return this.cacheLengths=null,this}}class Gc extends ip{constructor(e){super(),this.type="Path",this.currentPoint=new te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Du(this.currentPoint.clone(),new te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Iu(this.currentPoint.clone(),new te(e,t),new te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Lu(this.currentPoint.clone(),new te(e,t),new te(n,s),new te(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Nu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new Hl(e,t,n,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Mr extends Gc{constructor(e){super(e),this.uuid=ss(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Gc().fromJSON(s))}return this}}function sp(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Uu(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=cp(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,u=l;for(let d=t;d<s;d+=t){const f=i[d],g=i[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return mr(r,a,t,o,l,c,0),a}function Uu(i,e,t,n,s){let r;if(s===Mp(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Wc(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Wc(a/n|0,i[a],i[a+1],r);return r&&Ds(r,r.next)&&(vr(r),r=r.next),r}function ns(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ds(t,t.next)||Nt(t.prev,t,t.next)===0)){if(vr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function mr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&pp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?ap(i,n,s,r):rp(i)){e.push(l.i,i.i,c.i),vr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=op(ns(i),e),mr(i,e,t,n,s,r,2)):a===2&&lp(i,e,t,n,s,r):mr(ns(i),e,t,n,s,r,1);break}}}function rp(i){const e=i.prev,t=i,n=i.next;if(Nt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&js(s,o,r,l,a,c,g.x,g.y)&&Nt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ap(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Nt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),M=Math.max(o,l,c),m=Math.max(h,u,d),p=ml(f,g,e,t,n),_=ml(M,m,e,t,n);let E=i.prevZ,x=i.nextZ;for(;E&&E.z>=p&&x&&x.z<=_;){if(E.x>=f&&E.x<=M&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&js(o,h,l,u,c,d,E.x,E.y)&&Nt(E.prev,E,E.next)>=0||(E=E.prevZ,x.x>=f&&x.x<=M&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&js(o,h,l,u,c,d,x.x,x.y)&&Nt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=M&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&js(o,h,l,u,c,d,E.x,E.y)&&Nt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;x&&x.z<=_;){if(x.x>=f&&x.x<=M&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&js(o,h,l,u,c,d,x.x,x.y)&&Nt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function op(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Ds(n,s)&&Fu(n,t,t.next,s)&&gr(n,s)&&gr(s,n)&&(e.push(n.i,t.i,s.i),vr(t),vr(t.next),t=i=s),t=t.next}while(t!==i);return ns(t)}function lp(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&vp(a,o)){let l=zu(a,o);a=ns(a,a.next),l=ns(l,l.next),mr(a,e,t,n,s,r,0),mr(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function cp(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Uu(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(gp(c))}s.sort(hp);for(let r=0;r<s.length;r++)t=up(s[r],t);return t}function hp(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function up(i,e){const t=dp(i,e);if(!t)return e;const n=zu(t,i);return ns(n,n.next),ns(t,t.next)}function dp(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Ds(i,t))return t;do{if(Ds(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Ou(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);gr(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&fp(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function fp(i,e){return Nt(i.prev,i,e.prev)<0&&Nt(e.next,i,i.next)<0}function pp(i,e,t,n){let s=i;do s.z===0&&(s.z=ml(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,mp(s)}function mp(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function ml(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function gp(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ou(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function js(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Ou(i,e,t,n,s,r,a,o)}function vp(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!_p(i,e)&&(gr(i,e)&&gr(e,i)&&xp(i,e)&&(Nt(i.prev,i,e.prev)||Nt(i,e.prev,e))||Ds(i,e)&&Nt(i.prev,i,i.next)>0&&Nt(e.prev,e,e.next)>0)}function Nt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ds(i,e){return i.x===e.x&&i.y===e.y}function Fu(i,e,t,n){const s=$r(Nt(i,e,t)),r=$r(Nt(i,e,n)),a=$r(Nt(t,n,i)),o=$r(Nt(t,n,e));return!!(s!==r&&a!==o||s===0&&qr(i,t,e)||r===0&&qr(i,n,e)||a===0&&qr(t,i,n)||o===0&&qr(t,e,n))}function qr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function $r(i){return i>0?1:i<0?-1:0}function _p(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Fu(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function gr(i,e){return Nt(i.prev,i,i.next)<0?Nt(i,e,i.next)>=0&&Nt(i,i.prev,e)>=0:Nt(i,e,i.prev)<0||Nt(i,i.next,e)<0}function xp(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function zu(i,e){const t=gl(i.i,i.x,i.y),n=gl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Wc(i,e,t,n){const s=gl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function vr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function gl(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mp(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Sp{static triangulate(e,t,n=2){return sp(e,t,n)}}class yi{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return yi.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Xc(e),qc(n,e);let a=e.length;t.forEach(Xc);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,qc(n,t[l]);const o=Sp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Xc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function qc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Sa extends Ut{constructor(e=new Mr([new te(.5,.5),new te(-.5,.5),new te(-.5,-.5),new te(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new Ye(s,3)),this.setAttribute("uv",new Ye(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,M=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:yp;let E,x=!1,T,y,v,S;if(p){E=p.getSpacedPoints(h),x=!0,d=!1;const J=p.isCatmullRomCurve3?p.closed:!1;T=p.computeFrenetFrames(h,J),y=new A,v=new A,S=new A}d||(m=0,f=0,g=0,M=0);const L=o.extractPoints(c);let R=L.shape;const P=L.holes;if(!yi.isClockWise(R)){R=R.reverse();for(let J=0,he=P.length;J<he;J++){const le=P[J];yi.isClockWise(le)&&(P[J]=le.reverse())}}function B(J){const le=10000000000000001e-36;let be=J[0];for(let de=1;de<=J.length;de++){const We=de%J.length,Ne=J[We],nt=Ne.x-be.x,rt=Ne.y-be.y,lt=nt*nt+rt*rt,O=Math.max(Math.abs(Ne.x),Math.abs(Ne.y),Math.abs(be.x),Math.abs(be.y)),Lt=le*O*O;if(lt<=Lt){J.splice(We,1),de--;continue}be=Ne}}B(R),P.forEach(B);const I=P.length,F=R;for(let J=0;J<I;J++){const he=P[J];R=R.concat(he)}function X(J,he,le){return he||pt("ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(he,le)}const z=R.length;function ee(J,he,le){let be,de,We;const Ne=J.x-he.x,nt=J.y-he.y,rt=le.x-J.x,lt=le.y-J.y,O=Ne*Ne+nt*nt,Lt=Ne*lt-nt*rt;if(Math.abs(Lt)>Number.EPSILON){const je=Math.sqrt(O),gt=Math.sqrt(rt*rt+lt*lt),me=he.x-nt/je,Et=he.y+Ne/je,Oe=le.x-lt/gt,He=le.y+rt/gt,C=((Oe-me)*lt-(He-Et)*rt)/(Ne*lt-nt*rt);be=me+Ne*C-J.x,de=Et+nt*C-J.y;const b=be*be+de*de;if(b<=2)return new te(be,de);We=Math.sqrt(b/2)}else{let je=!1;Ne>Number.EPSILON?rt>Number.EPSILON&&(je=!0):Ne<-Number.EPSILON?rt<-Number.EPSILON&&(je=!0):Math.sign(nt)===Math.sign(lt)&&(je=!0),je?(be=-nt,de=Ne,We=Math.sqrt(O)):(be=Ne,de=nt,We=Math.sqrt(O/2))}return new te(be/We,de/We)}const k=[];for(let J=0,he=F.length,le=he-1,be=J+1;J<he;J++,le++,be++)le===he&&(le=0),be===he&&(be=0),k[J]=ee(F[J],F[le],F[be]);const Z=[];let Q,xe=k.concat();for(let J=0,he=I;J<he;J++){const le=P[J];Q=[];for(let be=0,de=le.length,We=de-1,Ne=be+1;be<de;be++,We++,Ne++)We===de&&(We=0),Ne===de&&(Ne=0),Q[be]=ee(le[be],le[We],le[Ne]);Z.push(Q),xe=xe.concat(Q)}let re;if(m===0)re=yi.triangulateShape(F,P);else{const J=[],he=[];for(let le=0;le<m;le++){const be=le/m,de=f*Math.cos(be*Math.PI/2),We=g*Math.sin(be*Math.PI/2)+M;for(let Ne=0,nt=F.length;Ne<nt;Ne++){const rt=X(F[Ne],k[Ne],We);Re(rt.x,rt.y,-de),be===0&&J.push(rt)}for(let Ne=0,nt=I;Ne<nt;Ne++){const rt=P[Ne];Q=Z[Ne];const lt=[];for(let O=0,Lt=rt.length;O<Lt;O++){const je=X(rt[O],Q[O],We);Re(je.x,je.y,-de),be===0&&lt.push(je)}be===0&&he.push(lt)}}re=yi.triangulateShape(J,he)}const W=re.length,oe=g+M;for(let J=0;J<z;J++){const he=d?X(R[J],xe[J],oe):R[J];x?(v.copy(T.normals[0]).multiplyScalar(he.x),y.copy(T.binormals[0]).multiplyScalar(he.y),S.copy(E[0]).add(v).add(y),Re(S.x,S.y,S.z)):Re(he.x,he.y,0)}for(let J=1;J<=h;J++)for(let he=0;he<z;he++){const le=d?X(R[he],xe[he],oe):R[he];x?(v.copy(T.normals[J]).multiplyScalar(le.x),y.copy(T.binormals[J]).multiplyScalar(le.y),S.copy(E[J]).add(v).add(y),Re(S.x,S.y,S.z)):Re(le.x,le.y,u/h*J)}for(let J=m-1;J>=0;J--){const he=J/m,le=f*Math.cos(he*Math.PI/2),be=g*Math.sin(he*Math.PI/2)+M;for(let de=0,We=F.length;de<We;de++){const Ne=X(F[de],k[de],be);Re(Ne.x,Ne.y,u+le)}for(let de=0,We=P.length;de<We;de++){const Ne=P[de];Q=Z[de];for(let nt=0,rt=Ne.length;nt<rt;nt++){const lt=X(Ne[nt],Q[nt],be);x?Re(lt.x,lt.y+E[h-1].y,E[h-1].x+le):Re(lt.x,lt.y,u+le)}}}ye(),ie();function ye(){const J=s.length/3;if(d){let he=0,le=z*he;for(let be=0;be<W;be++){const de=re[be];tt(de[2]+le,de[1]+le,de[0]+le)}he=h+m*2,le=z*he;for(let be=0;be<W;be++){const de=re[be];tt(de[0]+le,de[1]+le,de[2]+le)}}else{for(let he=0;he<W;he++){const le=re[he];tt(le[2],le[1],le[0])}for(let he=0;he<W;he++){const le=re[he];tt(le[0]+z*h,le[1]+z*h,le[2]+z*h)}}n.addGroup(J,s.length/3-J,0)}function ie(){const J=s.length/3;let he=0;se(F,he),he+=F.length;for(let le=0,be=P.length;le<be;le++){const de=P[le];se(de,he),he+=de.length}n.addGroup(J,s.length/3-J,1)}function se(J,he){let le=J.length;for(;--le>=0;){const be=le;let de=le-1;de<0&&(de=J.length-1);for(let We=0,Ne=h+m*2;We<Ne;We++){const nt=z*We,rt=z*(We+1),lt=he+be+nt,O=he+de+nt,Lt=he+de+rt,je=he+be+rt;Pe(lt,O,Lt,je)}}}function Re(J,he,le){l.push(J),l.push(he),l.push(le)}function tt(J,he,le){Fe(J),Fe(he),Fe(le);const be=s.length/3,de=_.generateTopUV(n,s,be-3,be-2,be-1);Ge(de[0]),Ge(de[1]),Ge(de[2])}function Pe(J,he,le,be){Fe(J),Fe(he),Fe(be),Fe(he),Fe(le),Fe(be);const de=s.length/3,We=_.generateSideWallUV(n,s,de-6,de-3,de-2,de-1);Ge(We[0]),Ge(We[1]),Ge(We[3]),Ge(We[1]),Ge(We[2]),Ge(We[3])}function Fe(J){s.push(l[J*3+0]),s.push(l[J*3+1]),s.push(l[J*3+2])}function Ge(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return bp(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new pl[s.type]().fromJSON(s)),new Sa(n,e.options)}}const yp={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new te(r,a),new te(o,l),new te(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],M=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new te(a,1-l),new te(c,1-u),new te(d,1-g),new te(M,1-p)]:[new te(o,1-l),new te(h,1-u),new te(f,1-g),new te(m,1-p)]}};function bp(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gl extends kl{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Gl(e.radius,e.detail)}}class ya extends Ut{constructor(e=[new te(0,-.5),new te(.5,0),new te(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=et(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/t,u=new A,d=new te,f=new A,g=new A,M=new A;let m=0,p=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:m=e[_+1].x-e[_].x,p=e[_+1].y-e[_].y,f.x=p*1,f.y=-m,f.z=p*0,M.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:M.normalize(),l.push(M.x,M.y,M.z);break;default:m=e[_+1].x-e[_].x,p=e[_+1].y-e[_].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=M.x,f.y+=M.y,f.z+=M.z,f.normalize(),l.push(f.x,f.y,f.z),M.copy(g)}for(let _=0;_<=t;_++){const E=n+_*h*s,x=Math.sin(E),T=Math.cos(E);for(let y=0;y<=e.length-1;y++){u.x=e[y].x*x,u.y=e[y].y,u.z=e[y].x*T,a.push(u.x,u.y,u.z),d.x=_/t,d.y=y/(e.length-1),o.push(d.x,d.y);const v=l[3*y+0]*x,S=l[3*y+1],L=l[3*y+0]*T;c.push(v,S,L)}}for(let _=0;_<t;_++)for(let E=0;E<e.length-1;E++){const x=E+_*e.length,T=x,y=x+e.length,v=x+e.length+1,S=x+1;r.push(T,y,S),r.push(v,S,y)}this.setIndex(r),this.setAttribute("position",new Ye(a,3)),this.setAttribute("uv",new Ye(o,2)),this.setAttribute("normal",new Ye(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ya(e.points,e.segments,e.phiStart,e.phiLength)}}class wn extends Ut{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],M=[],m=[];for(let p=0;p<h;p++){const _=p*d-a;for(let E=0;E<c;E++){const x=E*u-r;g.push(x,-_,0),M.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<o;_++){const E=_+c*p,x=_+c*(p+1),T=_+1+c*(p+1),y=_+1+c*p;f.push(E,x,y),f.push(x,T,y)}this.setIndex(f),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(M,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Wl extends Ut{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/s,f=new A,g=new te;for(let M=0;M<=s;M++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let M=0;M<s;M++){const m=M*(n+1);for(let p=0;p<n;p++){const _=p+m,E=_,x=_+n+1,T=_+n+2,y=_+1;o.push(E,x,y),o.push(x,T,y)}}this.setIndex(o),this.setAttribute("position",new Ye(l,3)),this.setAttribute("normal",new Ye(c,3)),this.setAttribute("uv",new Ye(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Xl extends Ut{constructor(e=new Mr([new te(0,.5),new te(-.5,-.5),new te(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ye(s,3)),this.setAttribute("normal",new Ye(r,3)),this.setAttribute("uv",new Ye(a,2));function c(h){const u=s.length/3,d=h.extractPoints(t);let f=d.shape;const g=d.holes;yi.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const _=g[m];yi.isClockWise(_)===!0&&(g[m]=_.reverse())}const M=yi.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const _=g[m];f=f.concat(_)}for(let m=0,p=f.length;m<p;m++){const _=f[m];s.push(_.x,_.y,0),r.push(0,0,1),a.push(_.x,_.y)}for(let m=0,p=M.length;m<p;m++){const _=M[m],E=_[0]+u,x=_[1]+u,T=_[2]+u;n.push(E,x,T),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Ep(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new Xl(n,e.curveSegments)}}function Ep(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class as extends Ut{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new A,d=new A,f=[],g=[],M=[],m=[];for(let p=0;p<=n;p++){const _=[],E=p/n,x=a+E*o,T=e*Math.cos(x),y=Math.sqrt(e*e-T*T);let v=0;p===0&&a===0?v=.5/t:p===n&&l===Math.PI&&(v=-.5/t);for(let S=0;S<=t;S++){const L=S/t,R=s+L*r;u.x=-y*Math.cos(R),u.y=T,u.z=y*Math.sin(R),g.push(u.x,u.y,u.z),d.copy(u).normalize(),M.push(d.x,d.y,d.z),m.push(L+v,1-E),_.push(c++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<t;_++){const E=h[p][_+1],x=h[p][_],T=h[p+1][_],y=h[p+1][_+1];(p!==0||a>0)&&f.push(E,x,y),(p!==n-1||l<Math.PI)&&f.push(x,T,y)}this.setIndex(f),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(M,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new as(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class is extends Ut{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],u=[],d=new A,f=new A,g=new A;for(let M=0;M<=n;M++){const m=a+M/n*o;for(let p=0;p<=s;p++){const _=p/s*r;f.x=(e+t*Math.cos(m))*Math.cos(_),f.y=(e+t*Math.cos(m))*Math.sin(_),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),g.subVectors(f,d).normalize(),h.push(g.x,g.y,g.z),u.push(p/s),u.push(M/n)}}for(let M=1;M<=n;M++)for(let m=1;m<=s;m++){const p=(s+1)*M+m-1,_=(s+1)*(M-1)+m-1,E=(s+1)*(M-1)+m,x=(s+1)*M+m;l.push(p,_,x),l.push(_,E,x)}this.setIndex(l),this.setAttribute("position",new Ye(c,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new is(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function Is(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if($c(s))s.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if($c(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function mn(i){const e={};for(let t=0;t<i.length;t++){const n=Is(i[t]);for(const s in n)e[s]=n[s]}return e}function $c(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function wp(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Bu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}const _i={clone:Is,merge:mn};var Tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ap=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ot extends rs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tp,this.fragmentShader=Ap,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Is(e.uniforms),this.uniformsGroups=wp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ce().setHex(s.value);break;case"v2":this.uniforms[n].value=new te().fromArray(s.value);break;case"v3":this.uniforms[n].value=new A().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Ct().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Je().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Qe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ku extends Ot{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class yn extends rs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fa,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ql extends yn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new te(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ce(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ce(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ce(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return ws('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){ws('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Rp extends rs{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fa,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class Hu extends rs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=qd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Cp extends rs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class $l extends Ft{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ce(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Yc extends $l{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ce(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const so=new Qe,Zc=new A,Kc=new A;class Vu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.mapType=Sn,this.map=null,this.mapPass=null,this.matrix=new Qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new pr,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Zc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zc),Kc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Kc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){so.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(so,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===fr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(so)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Yr=new A,Zr=new nn,Kn=new A;class Gu extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qe,this.projectionMatrix=new Qe,this.projectionMatrixInverse=new Qe,this.coordinateSystem=Zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Yr,Zr,Kn),Kn.x===1&&Kn.y===1&&Kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yr,Zr,Kn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Yr,Zr,Kn),Kn.x===1&&Kn.y===1&&Kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yr,Zr,Kn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ii=new A,Jc=new te,Qc=new te;class Mn extends Gu{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ps*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z),Ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z)}getViewSize(e,t){return this.getViewBounds(e,Jc,Qc),t.subVectors(Qc,Jc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ir*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Pp extends Vu{constructor(){super(new Mn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Ps*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class Lp extends $l{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Pp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Yl extends Gu{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Dp extends Vu{constructor(){super(new Yl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jc extends $l{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new Dp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const xs=-90,Ms=1;class vl extends Ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Mn(xs,Ms,e,t);s.layers=this.layers,this.add(s);const r=new Mn(xs,Ms,e,t);r.layers=this.layers,this.add(r);const a=new Mn(xs,Ms,e,t);a.layers=this.layers,this.add(a);const o=new Mn(xs,Ms,e,t);o.layers=this.layers,this.add(o);const l=new Mn(xs,Ms,e,t);l.layers=this.layers,this.add(l);const c=new Mn(xs,Ms,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===fr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=M,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ip extends Mn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class Wu{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Np.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Np(){this._document.hidden===!1&&this.reset()}const eh=new Qe;class Up{constructor(e,t,n=0,s=1/0){this.ray=new _a(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Fl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):pt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return eh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(eh),this}intersectObject(e,t=!0,n=[]){return _l(e,this,n,t),n.sort(th),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)_l(e[s],this,n,t);return n.sort(th),n}}function th(i,e){return i.distance-e.distance}function _l(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)_l(r[a],e,t,!0)}}class nh{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=et(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(et(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Op extends zi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function ih(i,e,t,n){const s=Fp(n);switch(t){case mu:return i*e;case Pl:return i*e/s.components*s.byteLength;case Ll:return i*e/s.components*s.byteLength;case es:return i*e*2/s.components*s.byteLength;case Dl:return i*e*2/s.components*s.byteLength;case gu:return i*e*3/s.components*s.byteLength;case Yn:return i*e*4/s.components*s.byteLength;case Il:return i*e*4/s.components*s.byteLength;case sa:case ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case aa:case oa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Oo:case zo:return Math.max(i,16)*Math.max(e,8)/4;case Uo:case Fo:return Math.max(i,8)*Math.max(e,8)/2;case Bo:case ko:case Vo:case Go:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ho:case ua:case Wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case $o:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Yo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ko:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Jo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Qo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case jo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case tl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case nl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case il:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case rl:case al:case ol:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ll:case cl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case da:case hl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Fp(i){switch(i){case Sn:case uu:return{byteLength:1,components:1};case ur:case du:case Qt:return{byteLength:2,components:1};case Rl:case Cl:return{byteLength:2,components:4};case li:case Al:case $n:return{byteLength:4,components:1};case fu:case pu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wl}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wl);function Xu(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function zp(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],M=u[f];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++d,u[d]=M)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const M=u[f];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Bp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Hp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Vp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$p=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Yp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Kp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Qp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,jp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,em=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,im=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,am=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,om=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,lm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,hm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,um=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,dm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,pm="gl_FragColor = linearToOutputTexel( gl_FragColor );",mm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,gm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,vm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,_m=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,xm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ym=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Em=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Tm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Am=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Pm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Lm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Dm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Im=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Nm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Um=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Om=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Fm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,zm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,km=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Vm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Xm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$m=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ym=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Km=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qm=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,t0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,n0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,i0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,s0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,r0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,o0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,l0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,c0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,h0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,u0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,d0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,f0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,p0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,m0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,g0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,v0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,x0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,M0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,S0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,y0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,b0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,E0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,w0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,T0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,A0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,R0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,C0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,P0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,L0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,D0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,I0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,N0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,O0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,F0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const z0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,B0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H0=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,G0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,X0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,q0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Y0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Z0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,J0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,j0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ng=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ig=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,rg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ag=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,og=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ug=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,fg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:Bp,alphahash_pars_fragment:kp,alphamap_fragment:Hp,alphamap_pars_fragment:Vp,alphatest_fragment:Gp,alphatest_pars_fragment:Wp,aomap_fragment:Xp,aomap_pars_fragment:qp,batching_pars_vertex:$p,batching_vertex:Yp,begin_vertex:Zp,beginnormal_vertex:Kp,bsdfs:Jp,iridescence_fragment:Qp,bumpmap_pars_fragment:jp,clipping_planes_fragment:em,clipping_planes_pars_fragment:tm,clipping_planes_pars_vertex:nm,clipping_planes_vertex:im,color_fragment:sm,color_pars_fragment:rm,color_pars_vertex:am,color_vertex:om,common:lm,defaultnormal_vertex:cm,displacementmap_pars_vertex:hm,displacementmap_vertex:um,emissivemap_fragment:dm,emissivemap_pars_fragment:fm,colorspace_fragment:pm,colorspace_pars_fragment:mm,envmap_fragment:gm,envmap_common_pars_fragment:vm,envmap_pars_fragment:_m,envmap_pars_vertex:xm,envmap_physical_pars_fragment:Pm,envmap_vertex:Mm,fog_vertex:Sm,fog_pars_vertex:ym,fog_fragment:bm,fog_pars_fragment:Em,gradientmap_pars_fragment:wm,lightmap_pars_fragment:Tm,lights_lambert_fragment:Am,lights_lambert_pars_fragment:Rm,lights_pars_begin:Cm,lights_toon_fragment:Lm,lights_toon_pars_fragment:Dm,lights_phong_fragment:Im,lights_phong_pars_fragment:Nm,lights_physical_fragment:Um,lights_physical_pars_fragment:Om,lights_fragment_begin:Fm,lights_fragment_maps:zm,lights_fragment_end:Bm,lightprobes_pars_fragment:km,logdepthbuf_fragment:Hm,logdepthbuf_pars_fragment:Vm,logdepthbuf_pars_vertex:Gm,logdepthbuf_vertex:Wm,map_fragment:Xm,map_pars_fragment:qm,map_particle_fragment:$m,map_particle_pars_fragment:Ym,metalnessmap_fragment:Zm,metalnessmap_pars_fragment:Km,morphinstance_vertex:Jm,morphcolor_vertex:Qm,morphnormal_vertex:jm,morphtarget_pars_vertex:e0,morphtarget_vertex:t0,normal_fragment_begin:n0,normal_fragment_maps:i0,normal_pars_fragment:s0,normal_pars_vertex:r0,normal_vertex:a0,normalmap_pars_fragment:o0,clearcoat_normal_fragment_begin:l0,clearcoat_normal_fragment_maps:c0,clearcoat_pars_fragment:h0,iridescence_pars_fragment:u0,opaque_fragment:d0,packing:f0,premultiplied_alpha_fragment:p0,project_vertex:m0,dithering_fragment:g0,dithering_pars_fragment:v0,roughnessmap_fragment:_0,roughnessmap_pars_fragment:x0,shadowmap_pars_fragment:M0,shadowmap_pars_vertex:S0,shadowmap_vertex:y0,shadowmask_pars_fragment:b0,skinbase_vertex:E0,skinning_pars_vertex:w0,skinning_vertex:T0,skinnormal_vertex:A0,specularmap_fragment:R0,specularmap_pars_fragment:C0,tonemapping_fragment:P0,tonemapping_pars_fragment:L0,transmission_fragment:D0,transmission_pars_fragment:I0,uv_pars_fragment:N0,uv_pars_vertex:U0,uv_vertex:O0,worldpos_vertex:F0,background_vert:z0,background_frag:B0,backgroundCube_vert:k0,backgroundCube_frag:H0,cube_vert:V0,cube_frag:G0,depth_vert:W0,depth_frag:X0,distance_vert:q0,distance_frag:$0,equirect_vert:Y0,equirect_frag:Z0,linedashed_vert:K0,linedashed_frag:J0,meshbasic_vert:Q0,meshbasic_frag:j0,meshlambert_vert:eg,meshlambert_frag:tg,meshmatcap_vert:ng,meshmatcap_frag:ig,meshnormal_vert:sg,meshnormal_frag:rg,meshphong_vert:ag,meshphong_frag:og,meshphysical_vert:lg,meshphysical_frag:cg,meshtoon_vert:hg,meshtoon_frag:ug,points_vert:dg,points_frag:fg,shadow_vert:pg,shadow_frag:mg,sprite_vert:gg,sprite_frag:vg},we={common:{diffuse:{value:new Ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new Ce(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},ni={basic:{uniforms:mn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:mn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new Ce(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:mn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new Ce(0)},specular:{value:new Ce(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:mn([we.common,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.roughnessmap,we.metalnessmap,we.fog,we.lights,{emissive:{value:new Ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:mn([we.common,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.gradientmap,we.fog,we.lights,{emissive:{value:new Ce(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:mn([we.common,we.bumpmap,we.normalmap,we.displacementmap,we.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:mn([we.points,we.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:mn([we.common,we.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:mn([we.common,we.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:mn([we.common,we.bumpmap,we.normalmap,we.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:mn([we.sprite,we.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:mn([we.common,we.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:mn([we.lights,we.fog,{color:{value:new Ce(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};ni.physical={uniforms:mn([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new Ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new Ce(0)},specularColor:{value:new Ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const Kr={r:0,b:0,g:0},_g=new Qe,qu=new Je;qu.set(-1,0,0,0,1,0,0,0,1);function xg(i,e,t,n,s,r){const a=new Ce(0);let o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(_){let E=_.isScene===!0?_.background:null;if(E&&E.isTexture){const x=_.backgroundBlurriness>0;E=e.get(E,x)}return E}function g(_){let E=!1;const x=f(_);x===null?m(a,o):x&&x.isColor&&(m(x,1),E=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(_,E){const x=f(E);x&&x.isCubeTexture?(c===void 0&&(c=new Be(new Dn(1,1,1),new Ot({name:"BackgroundCubeMaterial",uniforms:Is(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,y,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(_g.makeRotationFromEuler(E.backgroundRotation)).transpose(),x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(qu),c.material.toneMapped=ut.getTransfer(x.colorSpace)!==St,(h!==x||u!==x.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,u=x.version,d=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Be(new wn(2,2),new Ot({name:"BackgroundMaterial",uniforms:Is(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=ut.getTransfer(x.colorSpace)!==St,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||u!==x.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,u=x.version,d=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function m(_,E){_.getRGB(Kr,Bu(i)),t.buffers.color.setClear(Kr.r,Kr.g,Kr.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(_,E=1){a.set(_),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(_){o=_,m(a,o)},render:g,addToRenderList:M,dispose:p}}function Mg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(P,D,B,I,F){let X=!1;const z=u(P,I,B,D);r!==z&&(r=z,c(r.object)),X=f(P,I,B,F),X&&g(P,I,B,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,x(P,D,B,I),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function u(P,D,B,I){const F=I.wireframe===!0;let X=n[D.id];X===void 0&&(X={},n[D.id]=X);const z=P.isInstancedMesh===!0?P.id:0;let ee=X[z];ee===void 0&&(ee={},X[z]=ee);let k=ee[B.id];k===void 0&&(k={},ee[B.id]=k);let Z=k[F];return Z===void 0&&(Z=d(l()),k[F]=Z),Z}function d(P){const D=[],B=[],I=[];for(let F=0;F<t;F++)D[F]=0,B[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:B,attributeDivisors:I,object:P,attributes:{},index:null}}function f(P,D,B,I){const F=r.attributes,X=D.attributes;let z=0;const ee=B.getAttributes();for(const k in ee)if(ee[k].location>=0){const Q=F[k];let xe=X[k];if(xe===void 0&&(k==="instanceMatrix"&&P.instanceMatrix&&(xe=P.instanceMatrix),k==="instanceColor"&&P.instanceColor&&(xe=P.instanceColor)),Q===void 0||Q.attribute!==xe||xe&&Q.data!==xe.data)return!0;z++}return r.attributesNum!==z||r.index!==I}function g(P,D,B,I){const F={},X=D.attributes;let z=0;const ee=B.getAttributes();for(const k in ee)if(ee[k].location>=0){let Q=X[k];Q===void 0&&(k==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),k==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor));const xe={};xe.attribute=Q,Q&&Q.data&&(xe.data=Q.data),F[k]=xe,z++}r.attributes=F,r.attributesNum=z,r.index=I}function M(){const P=r.newAttributes;for(let D=0,B=P.length;D<B;D++)P[D]=0}function m(P){p(P,0)}function p(P,D){const B=r.newAttributes,I=r.enabledAttributes,F=r.attributeDivisors;B[P]=1,I[P]===0&&(i.enableVertexAttribArray(P),I[P]=1),F[P]!==D&&(i.vertexAttribDivisor(P,D),F[P]=D)}function _(){const P=r.newAttributes,D=r.enabledAttributes;for(let B=0,I=D.length;B<I;B++)D[B]!==P[B]&&(i.disableVertexAttribArray(B),D[B]=0)}function E(P,D,B,I,F,X,z){z===!0?i.vertexAttribIPointer(P,D,B,F,X):i.vertexAttribPointer(P,D,B,I,F,X)}function x(P,D,B,I){M();const F=I.attributes,X=B.getAttributes(),z=D.defaultAttributeValues;for(const ee in X){const k=X[ee];if(k.location>=0){let Z=F[ee];if(Z===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(Z=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(Z=P.instanceColor)),Z!==void 0){const Q=Z.normalized,xe=Z.itemSize,re=e.get(Z);if(re===void 0)continue;const W=re.buffer,oe=re.type,ye=re.bytesPerElement,ie=oe===i.INT||oe===i.UNSIGNED_INT||Z.gpuType===Al;if(Z.isInterleavedBufferAttribute){const se=Z.data,Re=se.isInterleavedBuffer===!0?se.stride:se.itemSize,tt=Z.offset;if(se.isInstancedInterleavedBuffer||se.isInstancedBufferAttribute){for(let Pe=0;Pe<k.locationSize;Pe++)p(k.location+Pe,se.meshPerAttribute);P.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Pe=0;Pe<k.locationSize;Pe++)m(k.location+Pe);i.bindBuffer(i.ARRAY_BUFFER,W);for(let Pe=0;Pe<k.locationSize;Pe++)E(k.location+Pe,xe/k.locationSize,oe,Q,Re*ye,(tt+xe/k.locationSize*Pe)*ye,ie)}else{if(Z.isInstancedBufferAttribute){for(let se=0;se<k.locationSize;se++)p(k.location+se,Z.meshPerAttribute);P.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let se=0;se<k.locationSize;se++)m(k.location+se);i.bindBuffer(i.ARRAY_BUFFER,W);for(let se=0;se<k.locationSize;se++)E(k.location+se,xe/k.locationSize,oe,Q,xe*ye,xe/k.locationSize*se*ye,ie)}}else if(z!==void 0){const Q=z[ee];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(k.location,Q);break;case 3:i.vertexAttrib3fv(k.location,Q);break;case 4:i.vertexAttrib4fv(k.location,Q);break;default:i.vertexAttrib1fv(k.location,Q)}}}}_()}function T(){L();for(const P in n){const D=n[P];for(const B in D){const I=D[B];for(const F in I){const X=I[F];for(const z in X)h(X[z].object),delete X[z];delete I[F]}}delete n[P]}}function y(P){if(n[P.id]===void 0)return;const D=n[P.id];for(const B in D){const I=D[B];for(const F in I){const X=I[F];for(const z in X)h(X[z].object),delete X[z];delete I[F]}}delete n[P.id]}function v(P){for(const D in n){const B=n[D];for(const I in B){const F=B[I];if(F[P.id]===void 0)continue;const X=F[P.id];for(const z in X)h(X[z].object),delete X[z];delete F[P.id]}}}function S(P){for(const D in n){const B=n[D],I=P.isInstancedMesh===!0?P.id:0,F=B[I];if(F!==void 0){for(const X in F){const z=F[X];for(const ee in z)h(z[ee].object),delete z[ee];delete F[X]}delete B[I],Object.keys(B).length===0&&delete n[D]}}}function L(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:R,dispose:T,releaseStatesOfGeometry:y,releaseStatesOfObject:S,releaseStatesOfProgram:v,initAttributes:M,enableAttribute:m,disableUnusedAttributes:_}}function Sg(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function yg(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const v=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(v.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(v){return!(v!==Yn&&n.convert(v)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(v){const S=v===Qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(v!==Sn&&v!==$n&&!S&&n.convert(v)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(v){if(v==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";v="mediump"}return v==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(qe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&qe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&qe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),y=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:E,maxFragmentUniforms:x,maxSamples:T,samples:y}}function bg(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new ti,o=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,M=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,E=_*4;let x=p.clippingState||null;l.value=x,x=h(g,d,E,f);for(let T=0;T!==E;++T)x[T]=t[T];p.clippingState=x,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const M=u!==null?u.length:0;let m=null;if(M!==0){if(m=l.value,g!==!0||m===null){const p=f+M*4,_=d.matrixWorldInverse;o.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,x=f;E!==M;++E,x+=4)a.copy(u[E]).applyMatrix4(_,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,m}}class Zl extends jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ru(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Dn(5,5,5),r=new Ot({name:"CubemapFromEquirect",uniforms:Is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:vn});r.uniforms.tEquirect.value=t;const a=new Be(s,r),o=t.minFilter;return t.minFilter===Mi&&(t.minFilter=bn),new vl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const sh=256,Eg=3,wg=20,$u=256,Yu=16,Tg=3,Ag=new A,Rg=new Ce;class _r{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new vl(1,10,null),this._boxMesh=new Be(new Dn(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Ag}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,g=l.autoClearStencil,M=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,M===null&&(e.background=l.getClearColor(Rg));const m=new vl(n,s,h);return m.position.copy(o),m.update(l,e),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=g,e.background=M,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ah(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(sh,Su(e))}_fromTexture(e,t){e.mapping===Cs||e.mapping===hr?this._setSize(e.image.length===0?sh:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){const e=this._cubeSize,t=rh(e,!1,!1),n=Math.log2(e)-Eg;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=rh(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){const s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Cs||e.mapping===hr?(this._cubemapMaterial===null&&(this._cubemapMaterial=oh()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ah()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=Cg(),this._integrationMaterial=Pg());const t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Yu);for(let a=0;a<=n;a++){const o=_r.lodToRoughness(a,n);if(a>n-Tg)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/($u*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Lg());const n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}}function rh(i,e,t){return new Zl(i,{minFilter:Mi,generateMipmaps:e,type:Qt,colorSpace:dr,depthBuffer:t})}function Sr(i,e,t){return new Ot({name:i,uniforms:e,vertexShader:Ke.cube_vert,fragmentShader:t,side:dn,blending:vn,depthTest:!1,depthWrite:!1})}function Cg(){return Sr("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${$u}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Pg(){return Sr("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Yu}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Lg(){return Sr("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${wg}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function ah(){return Sr("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function oh(){return Sr("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Dg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===La||f===Da)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const M=new Zl(g.height);return M.fromEquirectangularTexture(i,d),e.set(d,M),d.addEventListener("dispose",c),o(M.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const f=d.mapping,g=f===La||f===Da,M=f===Cs||f===hr;if(g||M){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new _r(i)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const _=d.image;return g&&_&&_.height>0||M&&_&&l(_)?(n===null&&(n=new _r(i)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===La?d.mapping=Cs:f===Da&&(d.mapping=hr),d}function l(d){let f=0;const g=6;for(let M=0;M<g;M++)d[M]!==void 0&&f++;return f===g}function c(d){const f=d.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function Ig(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&ws("WebGLRenderer: "+n+" extension not supported."),s}}}function Ng(i,e,t,n){const s={},r=new WeakMap,a=new FinalizationRegistry(g=>delete s[g]);function o(g){l(g.target)}function l(g){g.index!==null&&e.remove(g.index);for(const m in g.attributes)e.remove(g.attributes[m]);g.removeEventListener("dispose",o),delete s[g.id],a.unregister(g);const M=r.get(g);M&&(e.remove(M),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function c(g,M){return s[M.id]!==void 0||(M.addEventListener("dispose",o),s[M.id]=new WeakRef(M),a.register(M,M.id,M),t.memory.geometries++),M}function h(g){const M=g.attributes;for(const m in M)e.update(M[m],i.ARRAY_BUFFER)}function u(g){const M=g.index,m=g.attributes.position;let p=0;if(m===void 0)return;const _=M!==null?M.array.length:m.array.length/3-1,E=m.count>=65535?Au:Tu,x=new E(Math.ceil(_/3)*6,1),T=x.array;if(M!==null){const v=M.array;p=M.version;for(let S=0,L=0;S<_;S+=3){const R=v[S+0],P=v[S+1],D=v[S+2];T[L++]=R,T[L++]=P,T[L++]=P,T[L++]=D,T[L++]=D,T[L++]=R}}else{p=m.version;for(let v=0,S=0;v<_;v+=3){const L=v+0,R=v+1,P=v+2;T[S++]=L,T[S++]=R,T[S++]=R,T[S++]=P,T[S++]=P,T[S++]=L}}x.version=p;const y=r.get(g);y&&e.remove(y),r.set(g,x)}function d(g){const M=r.get(g);if(M){const m=g.index;m!==null&&M.version<m.version&&u(g)}else u(g);return r.get(g)}function f(){for(const g in s){const M=s[g].deref();M!==void 0&&l(M)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function Ug(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let M=0;for(let m=0;m<f;m++)M+=d[m];t.update(M,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Og(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:pt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Fg(i,e,t){const n=new WeakMap,s=new Ct;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let R=function(){S.dispose(),n.delete(o),o.removeEventListener("dispose",R)};var f=R;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),M===!0&&(x=2),m===!0&&(x=3);let T=o.attributes.position.count*x,y=1;T>e.maxTextureSize&&(y=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const v=new Float32Array(T*y*4*u),S=new Eu(v,T,y,u);S.type=$n,S.needsUpdate=!0;const L=x*4;for(let P=0;P<u;P++){const D=p[P],B=_[P],I=E[P],F=T*y*4*P;for(let X=0;X<D.count;X++){const z=X*L;g===!0&&(s.fromBufferAttribute(D,X),v[F+z+0]=s.x,v[F+z+1]=s.y,v[F+z+2]=s.z,v[F+z+3]=0),M===!0&&(s.fromBufferAttribute(B,X),v[F+z+4]=s.x,v[F+z+5]=s.y,v[F+z+6]=s.z,v[F+z+7]=0),m===!0&&(s.fromBufferAttribute(I,X),v[F+z+8]=s.x,v[F+z+9]=s.y,v[F+z+10]=s.z,v[F+z+11]=I.itemSize===4?s.w:1)}}d={count:u,texture:S,size:new te(T,y)},n.set(o,d),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const M=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",M),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function zg(i,e,t,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Bg={[su]:"LINEAR_TONE_MAPPING",[ru]:"REINHARD_TONE_MAPPING",[au]:"CINEON_TONE_MAPPING",[Tl]:"ACES_FILMIC_TONE_MAPPING",[lu]:"AGX_TONE_MAPPING",[cu]:"NEUTRAL_TONE_MAPPING",[ou]:"CUSTOM_TONE_MAPPING"};function kg(i,e,t,n,s,r){const a=new jt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Ut;h.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Ye([0,2,0,0,2,0],2));const u=new ku({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Be(h,u),f=new Yl(-1,1,1,-1,0,1);let g=null,M=null,m=!1,p,_=null,E=[],x=!1;this.setSize=function(T,y){a.setSize(T,y),o!==null&&o.setSize(T,y),l!==null&&l.setSize(T,y);for(let v=0;v<E.length;v++){const S=E[v];S.setSize&&S.setSize(T,y)}},this.setEffects=function(T){E=T,x=E.length>0&&E[0].isRenderPass===!0;const y=a.width,v=a.height;E.length>0&&o===null&&(o=new jt(y,v,{type:Qt,depthBuffer:!1,stencilBuffer:!1}),l=new jt(y,v,{type:Qt,depthBuffer:!1,stencilBuffer:!1}));const S=s===!0&&E.some(L=>L.needsDepthTexture===!0);S!==(a.depthTexture!==null)&&(S===!0&&c===null&&(c=new ts(y,v),r===!0&&(c.format=Si,c.type=ji)),a.dispose(),a.depthTexture=S?c:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S);for(let L=0;L<E.length;L++){const R=E[L];R.setSize&&R.setSize(y,v),S&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(T,y){if(m||T.toneMapping===Ei&&E.length===0)return!1;if(_=y,y!==null){const v=y.width,S=y.height;(a.width!==v||a.height!==S)&&this.setSize(v,S)}return x===!1&&T.setRenderTarget(a),p=T.toneMapping,T.toneMapping=Ei,!0},this.hasRenderPass=function(){return x},this.end=function(T,y){T.toneMapping=p,m=!0;let v=a,S=o;for(let L=0;L<E.length;L++){const R=E[L];R.enabled!==!1&&(R.render(T,S,v,y),R.needsSwap!==!1&&(v=S,S=S===o?l:o))}if(g!==T.outputColorSpace||M!==T.toneMapping){g=T.outputColorSpace,M=T.toneMapping,u.defines={},ut.getTransfer(g)===St&&(u.defines.SRGB_TRANSFER="");const L=Bg[M];L&&(u.defines[L]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=v.texture,T.setRenderTarget(_),T.render(d,f),_=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}const Zu=new sn,Ku=new ts(1,1),Ju=new Cu(1),Qu=new Eu,ju=new Af,ed=new Ru,lh=[],ch=[],hh=new Float32Array(16),uh=new Float32Array(9),dh=new Float32Array(4);function zs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=lh[s];if(r===void 0&&(r=new Float32Array(s),lh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function $t(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ba(i,e){let t=ch[e];t===void 0&&(t=new Int32Array(e),ch[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Hg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),$t(t,e)}}function Gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),$t(t,e)}}function Wg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),$t(t,e)}}function Xg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),$t(t,e)}else{if(qt(t,n))return;dh.set(n),i.uniformMatrix2fv(this.addr,!1,dh),$t(t,n)}}function qg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),$t(t,e)}else{if(qt(t,n))return;uh.set(n),i.uniformMatrix3fv(this.addr,!1,uh),$t(t,n)}}function $g(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),$t(t,e)}else{if(qt(t,n))return;hh.set(n),i.uniformMatrix4fv(this.addr,!1,hh),$t(t,n)}}function Yg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Zg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),$t(t,e)}}function Kg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),$t(t,e)}}function Jg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),$t(t,e)}}function Qg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function jg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),$t(t,e)}}function ev(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),$t(t,e)}}function tv(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),$t(t,e)}}function Ea(i){return i.version===0&&(i.compareFunction=xu,i.needsUpdate=!0),i}function nv(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Ea(Ku):r=Zu,t.setTexture2D(e||r,s)}function iv(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ju,s)}function sv(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Ea(Ju):r=ed,t.setTextureCube(e||r,s)}function rv(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Qu,s)}function av(i){switch(i){case 5126:return Hg;case 35664:return Vg;case 35665:return Gg;case 35666:return Wg;case 35674:return Xg;case 35675:return qg;case 35676:return $g;case 5124:case 35670:return Yg;case 35667:case 35671:return Zg;case 35668:case 35672:return Kg;case 35669:case 35673:return Jg;case 5125:return Qg;case 36294:return jg;case 36295:return ev;case 36296:return tv;case 35678:case 36198:case 36298:case 36306:case 35682:return nv;case 35679:case 36299:case 36307:return iv;case 35680:case 36300:case 36308:case 36293:return sv;case 36289:case 36303:case 36311:case 36292:return rv}}function ov(i,e){i.uniform1fv(this.addr,e)}function lv(i,e){const t=zs(e,this.size,2);i.uniform2fv(this.addr,t)}function cv(i,e){const t=zs(e,this.size,3);i.uniform3fv(this.addr,t)}function hv(i,e){const t=zs(e,this.size,4);i.uniform4fv(this.addr,t)}function uv(i,e){const t=zs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dv(i,e){const t=zs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function fv(i,e){const t=zs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function pv(i,e){i.uniform1iv(this.addr,e)}function mv(i,e){i.uniform2iv(this.addr,e)}function gv(i,e){i.uniform3iv(this.addr,e)}function vv(i,e){i.uniform4iv(this.addr,e)}function _v(i,e){i.uniform1uiv(this.addr,e)}function xv(i,e){i.uniform2uiv(this.addr,e)}function Mv(i,e){i.uniform3uiv(this.addr,e)}function Sv(i,e){i.uniform4uiv(this.addr,e)}function yv(i,e,t){const n=this.cache,s=e.length,r=ba(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ea(Ku):a=Zu;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function bv(i,e,t){const n=this.cache,s=e.length,r=ba(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ju,r[a])}function Ev(i,e,t){const n=this.cache,s=e.length,r=ba(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));let a;this.type===i.SAMPLER_CUBE_SHADOW?a=Ea(Ju):a=ed;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function wv(i,e,t){const n=this.cache,s=e.length,r=ba(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Qu,r[a])}function Tv(i){switch(i){case 5126:return ov;case 35664:return lv;case 35665:return cv;case 35666:return hv;case 35674:return uv;case 35675:return dv;case 35676:return fv;case 5124:case 35670:return pv;case 35667:case 35671:return mv;case 35668:case 35672:return gv;case 35669:case 35673:return vv;case 5125:return _v;case 36294:return xv;case 36295:return Mv;case 36296:return Sv;case 35678:case 36198:case 36298:case 36306:case 35682:return yv;case 35679:case 36299:case 36307:return bv;case 35680:case 36300:case 36308:case 36293:return Ev;case 36289:case 36303:case 36311:case 36292:return wv}}class Av{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=av(t.type)}}class Rv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Tv(t.type)}}class Cv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const ro=/(\w+)(\])?(\[|\.)?/g;function fh(i,e){i.seq.push(e),i.map[e.id]=e}function Pv(i,e,t){const n=i.name,s=n.length;for(ro.lastIndex=0;;){const r=ro.exec(n),a=ro.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){fh(t,c===void 0?new Av(o,i,e):new Rv(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Cv(o),fh(t,u)),t=u}}}class la{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Pv(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function ph(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Lv=37297;let Dv=0;function Iv(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const mh=new Je;function Nv(i){ut._getMatrix(mh,ut.workingColorSpace,i);const e=`mat3( ${mh.elements.map(t=>t.toFixed(4))} )`;switch(ut.getTransfer(i)){case pa:return[e,"LinearTransferOETF"];case St:return[e,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function gh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Iv(i.getShaderSource(e),o)}else return r}function Uv(i,e){const t=Nv(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Ov={[su]:"Linear",[ru]:"Reinhard",[au]:"Cineon",[Tl]:"ACESFilmic",[lu]:"AgX",[cu]:"Neutral",[ou]:"Custom"};function Fv(i,e){const t=Ov[e];return t===void 0?(qe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Jr=new A;function zv(){ut.getLuminanceCoefficients(Jr);const i=Jr.x.toFixed(4),e=Jr.y.toFixed(4),t=Jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(er).join(`
`)}function kv(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Hv(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function er(i){return i!==""}function vh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function _h(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Vv=/^[ \t]*#include +<([\w\d./]+)>/gm;function xl(i){return i.replace(Vv,Gv)}function Gv(i,e){const t=Ke[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return xl(t)}const Wv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xh(i){return i.replace(Wv,Xv)}function Xv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Mh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const qv={[tr]:"SHADOWMAP_TYPE_PCF",[Js]:"SHADOWMAP_TYPE_VSM"};function $v(i){return qv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Yv={[hr]:"ENVMAP_MODE_REFRACTION"};function Zv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Yv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Kv={[iu]:"ENVMAP_BLENDING_MULTIPLY",[Gd]:"ENVMAP_BLENDING_MIX",[Wd]:"ENVMAP_BLENDING_ADD"};function Jv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Kv[i.combine]||"ENVMAP_BLENDING_NONE"}function Qv(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=$v(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Zv(t),u=Jv(t),d=Bv(t),f=kv(r),g=s.createProgram();let M,m,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(M=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(er).join(`
`),M.length>0&&(M+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(er).join(`
`),m.length>0&&(m+=`
`)):(M=[Mh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(er).join(`
`),m=[Mh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ei?"#define TONE_MAPPING":"",t.toneMapping!==Ei?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Ei?Fv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,Uv("linearToOutputTexel",t.outputColorSpace),zv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(er).join(`
`)),a=xl(a),a=vh(a,t),a=_h(a,t),o=xl(o),o=vh(o,t),o=_h(o,t),a=xh(a),o=xh(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,M=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,m=["#define varying in",t.glslVersion===gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=p+M+a,E=p+m+o,x=ph(s,s.VERTEX_SHADER,_),T=ph(s,s.FRAGMENT_SHADER,E);s.attachShader(g,x),s.attachShader(g,T),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function y(R){if(i.debug.checkShaderErrors){const P=s.getProgramInfoLog(g)||"",D=s.getShaderInfoLog(x)||"",B=s.getShaderInfoLog(T)||"",I=P.trim(),F=D.trim(),X=B.trim();let z=!0,ee=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,x,T);else{const k=gh(s,x,"vertex"),Z=gh(s,T,"fragment");pt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+k+`
`+Z)}else I!==""?qe("WebGLProgram: Program Info Log:",I):(F===""||X==="")&&(ee=!1);ee&&(R.diagnostics={runnable:z,programLog:I,vertexShader:{log:F,prefix:M},fragmentShader:{log:X,prefix:m}})}s.deleteShader(x),s.deleteShader(T),v=new la(s,g),S=Hv(s,g)}let v;this.getUniforms=function(){return v===void 0&&y(this),v};let S;this.getAttributes=function(){return S===void 0&&y(this),S};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(g,Lv)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Dv++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=x,this.fragmentShader=T,this}let jv=0;class e_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new t_(e),t.set(e,n)),n}}class t_{constructor(e){this.id=jv++,this.code=e,this.usedTimes=0}}function n_(i){return i===es||i===ua||i===da}function i_(i,e,t,n,s,r){const a=new Fl,o=new e_,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,S,L,R,P,D){const B=R.fog,I=P.geometry,F=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,X=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,z=e.get(v.envMap||F,X),ee=d[v.type];let k=n.precision;v.precision!==null&&(k=n.getMaxPrecision(v.precision),k!==v.precision&&qe("WebGLProgram.getParameters:",v.precision,"not supported, using",k,"instead."));const Z=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,Q=Z!==void 0?Z.length:0;let xe=0;I.morphAttributes.position!==void 0&&(xe=1),I.morphAttributes.normal!==void 0&&(xe=2),I.morphAttributes.color!==void 0&&(xe=3);let re,W,oe,ye;if(ee){const Ee=ni[ee];re=Ee.vertexShader,W=Ee.fragmentShader}else{re=v.vertexShader,W=v.fragmentShader;const Ee=o.getVertexShaderStage(v),Mt=o.getFragmentShaderStage(v);o.update(v,Ee,Mt),oe=Ee.id,ye=Mt.id}const ie=i.getRenderTarget(),se=i.state.buffers.depth.getReversed(),Re=P.isInstancedMesh===!0,tt=P.isBatchedMesh===!0,Pe=!!v.map,Fe=!!v.matcap,Ge=!!z,J=Ge&&z.isPMREMTexture===!0,he=!!v.aoMap,le=!!v.lightMap,be=!!v.bumpMap&&v.wireframe===!1,de=!!v.normalMap,We=!!v.displacementMap,Ne=!!v.emissiveMap,nt=!!v.metalnessMap,rt=!!v.roughnessMap,lt=v.anisotropy>0,O=v.clearcoat>0,Lt=v.diffuseRoughness>0,je=v.dispersion>0,gt=v.retroreflectivity>0,me=v.iridescence>0,Et=v.sheen>0,Oe=v.transmission>0,He=lt&&!!v.anisotropyMap,C=O&&!!v.clearcoatMap,b=O&&!!v.clearcoatNormalMap,H=O&&!!v.clearcoatRoughnessMap,ae=Lt&&!!v.diffuseRoughnessMap,ne=me&&!!v.iridescenceMap,ue=me&&!!v.iridescenceThicknessMap,ge=Et&&!!v.sheenColorMap,$=Et&&!!v.sheenRoughnessMap,K=!!v.specularMap,fe=!!v.specularColorMap,N=!!v.specularIntensityMap,j=Oe&&!!v.transmissionMap,Y=Oe&&!!v.thicknessMap,_e=!!v.gradientMap,pe=!!v.alphaMap,ve=v.alphaTest>0,ze=!!v.alphaHash,at=!!v.extensions;let ce=Ei;v.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ce=i.toneMapping);const ke=J?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,it={shaderID:ee,shaderType:v.type,shaderName:v.name,vertexShader:re,fragmentShader:W,defines:v.defines,customVertexShaderID:oe,customFragmentShaderID:ye,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:k,batching:tt,batchingColor:tt&&P._colorsTexture!==null,instancing:Re,instancingColor:Re&&P.instanceColor!==null,instancingMorph:Re&&P.morphTexture!==null,outputColorSpace:ie===null?i.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:ut.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Pe,matcap:Fe,envMap:Ge,envMapMode:Ge&&z.mapping,envMapPMREM:J,envMapMaxLod:J?ke.length-1:null,envMapSize:J?ke[0].width:null,aoMap:he,lightMap:le,bumpMap:be,normalMap:de,displacementMap:We,emissiveMap:Ne,normalMapObjectSpace:de&&v.normalMapType===Yd,normalMapTangentSpace:de&&v.normalMapType===fa,packedNormalMap:de&&v.normalMapType===fa&&n_(v.normalMap.format),metalnessMap:nt,roughnessMap:rt,anisotropy:lt,anisotropyMap:He,clearcoat:O,clearcoatMap:C,clearcoatNormalMap:b,clearcoatRoughnessMap:H,diffuseRoughness:Lt,diffuseRoughnessMap:ae,dispersion:je,retroreflection:gt,iridescence:me,iridescenceMap:ne,iridescenceThicknessMap:ue,sheen:Et,sheenColorMap:ge,sheenRoughnessMap:$,specularMap:K,specularColorMap:fe,specularIntensityMap:N,transmission:Oe,transmissionMap:j,thicknessMap:Y,gradientMap:_e,opaque:v.transparent===!1&&v.blending===nr&&v.alphaToCoverage===!1,alphaMap:pe,alphaTest:ve,alphaHash:ze,combine:v.combine,mapUv:Pe&&f(v.map.channel),aoMapUv:he&&f(v.aoMap.channel),lightMapUv:le&&f(v.lightMap.channel),bumpMapUv:be&&f(v.bumpMap.channel),normalMapUv:de&&f(v.normalMap.channel),displacementMapUv:We&&f(v.displacementMap.channel),emissiveMapUv:Ne&&f(v.emissiveMap.channel),metalnessMapUv:nt&&f(v.metalnessMap.channel),roughnessMapUv:rt&&f(v.roughnessMap.channel),anisotropyMapUv:He&&f(v.anisotropyMap.channel),clearcoatMapUv:C&&f(v.clearcoatMap.channel),clearcoatNormalMapUv:b&&f(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&f(v.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ae&&f(v.diffuseRoughnessMap.channel),iridescenceMapUv:ne&&f(v.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&f(v.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&f(v.sheenColorMap.channel),sheenRoughnessMapUv:$&&f(v.sheenRoughnessMap.channel),specularMapUv:K&&f(v.specularMap.channel),specularColorMapUv:fe&&f(v.specularColorMap.channel),specularIntensityMapUv:N&&f(v.specularIntensityMap.channel),transmissionMapUv:j&&f(v.transmissionMap.channel),thicknessMapUv:Y&&f(v.thicknessMap.channel),alphaMapUv:pe&&f(v.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(de||lt),vertexNormals:!!I.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!I.attributes.uv&&(Pe||pe),fog:!!B,useFog:v.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||I.attributes.normal===void 0&&de===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:se,skinning:P.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:xe,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:D.filter(Ee=>Ee.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:ce,decodeVideoTexture:Pe&&v.map.isVideoTexture===!0&&ut.getTransfer(v.map.colorSpace)===St,decodeVideoTextureEmissive:Ne&&v.emissiveMap.isVideoTexture===!0&&ut.getTransfer(v.emissiveMap.colorSpace)===St,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===_n,flipSided:v.side===dn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:at&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(at&&v.extensions.multiDraw===!0||tt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return it.vertexUv1s=l.has(1),it.vertexUv2s=l.has(2),it.vertexUv3s=l.has(3),l.clear(),it}function M(v){const S=[];if(v.shaderID?S.push(v.shaderID):(S.push(v.customVertexShaderID),S.push(v.customFragmentShaderID)),v.defines!==void 0)for(const L in v.defines)S.push(L),S.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(m(S,v),p(S,v),S.push(i.outputColorSpace)),S.push(v.customProgramCacheKey),S.join()}function m(v,S){v.push(S.precision),v.push(S.outputColorSpace),v.push(S.envMapMode),v.push(S.envMapPMREM),v.push(S.envMapMaxLod),v.push(S.envMapSize),v.push(S.mapUv),v.push(S.alphaMapUv),v.push(S.lightMapUv),v.push(S.aoMapUv),v.push(S.bumpMapUv),v.push(S.normalMapUv),v.push(S.displacementMapUv),v.push(S.emissiveMapUv),v.push(S.metalnessMapUv),v.push(S.roughnessMapUv),v.push(S.anisotropyMapUv),v.push(S.clearcoatMapUv),v.push(S.clearcoatNormalMapUv),v.push(S.clearcoatRoughnessMapUv),v.push(S.diffuseRoughnessMapUv),v.push(S.iridescenceMapUv),v.push(S.iridescenceThicknessMapUv),v.push(S.sheenColorMapUv),v.push(S.sheenRoughnessMapUv),v.push(S.specularMapUv),v.push(S.specularColorMapUv),v.push(S.specularIntensityMapUv),v.push(S.transmissionMapUv),v.push(S.thicknessMapUv),v.push(S.combine),v.push(S.fogExp2),v.push(S.sizeAttenuation),v.push(S.morphTargetsCount),v.push(S.numSunLights),v.push(S.numDirLights),v.push(S.numPointLights),v.push(S.numSpotLights),v.push(S.numSpotLightMaps),v.push(S.numHemiLights),v.push(S.numRectAreaLights),v.push(S.numSunLightShadows),v.push(S.numDirLightShadows),v.push(S.numPointLightShadows),v.push(S.numSpotLightShadows),v.push(S.numSpotLightShadowsWithMaps),v.push(S.numLightProbes),v.push(S.numLightProbeGrids),v.push(S.shadowMapType),v.push(S.toneMapping),v.push(S.numClippingPlanes),v.push(S.numClipIntersection),v.push(S.depthPacking)}function p(v,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.retroreflection&&a.enable(24),S.diffuseRoughness&&a.enable(25),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function _(v){const S=d[v.type];let L;if(S){const R=ni[S];L=_i.clone(R.uniforms)}else L=v.uniforms;return L}function E(v,S){let L=h.get(S);return L!==void 0?++L.usedTimes:(L=new Qv(i,S,v,s),c.push(L),h.set(S,L)),L}function x(v){if(--v.usedTimes===0){const S=c.indexOf(v);c[S]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function T(v){o.remove(v)}function y(){o.dispose()}return{getParameters:g,getProgramCacheKey:M,getUniforms:_,acquireProgram:E,releaseProgram:x,releaseShaderCache:T,programs:c,dispose:y}}function s_(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function r_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Sh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function yh(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,M,m,p){let _=i[e];return _===void 0?(_={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:M,renderOrder:d.renderOrder,z:m,group:p},i[e]=_):(_.id=d.id,_.object=d,_.geometry=f,_.material=g,_.materialVariant=a(d),_.groupOrder=M,_.renderOrder=d.renderOrder,_.z=m,_.group=p),e++,_}function l(d,f,g,M,m,p,_){_.reversedDepth===!0&&(m=-m);const E=o(d,f,g,M,m,p);g.transmission>0?n.push(E):g.transparent===!0?s.push(E):t.push(E)}function c(d,f,g,M,m,p){const _=o(d,f,g,M,m,p);g.transmission>0?n.unshift(_):g.transparent===!0?s.unshift(_):t.unshift(_)}function h(d,f){t.length>1&&t.sort(d||r_),n.length>1&&n.sort(f||Sh),s.length>1&&s.sort(f||Sh)}function u(){for(let d=e,f=i.length;d<f;d++){const g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function a_(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new yh,i.set(n,[a])):s>=r.length?(a=new yh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function o_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new A,color:new Ce};break;case"SpotLight":t={position:new A,direction:new A,color:new Ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new Ce,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new Ce,groundColor:new Ce};break;case"RectAreaLight":t={color:new Ce,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function l_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let c_=0;function h_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function u_(i){const e=new o_,t=l_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new A);const s=new A,r=new Qe,a=new Qe;function o(c){let h=0,u=0,d=0;for(let D=0;D<9;D++)n.probe[D].set(0,0,0);let f=0,g=0,M=0,m=0,p=0,_=0,E=0,x=0,T=0,y=0,v=0,S=0,L=0,R=0;c.sort(h_);for(let D=0,B=c.length;D<B;D++){const I=c[D],F=I.color,X=I.intensity,z=I.distance;let ee=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===es?ee=I.shadow.map.texture:ee=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=F.r*X,u+=F.g*X,d+=F.b*X;else if(I.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(I.sh.coefficients[k],X);R++}else if(I.isSunLight){const k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const Z=I.shadow,Q=t.get(I);Q.shadowIntensity=Z.intensity,Q.shadowBias=Z.bias,Q.shadowNormalBias=Z.normalBias,Q.shadowRadius=Z.radius,Q.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),n.sunShadow[g]=Q,n.sunShadowMap[g]=ee;const xe=Z.getViewportCount();for(let re=0;re<xe;re++)n.sunShadowMatrix[M+re]=Z.getMatrix(re),n.sunShadowCascade[M+re]=Z._cascadeData[re];M+=xe,g++}n.sun[f]=k,f++}else if(I.isDirectionalLight){const k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const Z=I.shadow,Q=t.get(I);Q.shadowIntensity=Z.intensity,Q.shadowBias=Z.bias,Q.shadowNormalBias=Z.normalBias,Q.shadowRadius=Z.radius,Q.shadowMapSize=Z.mapSize,n.directionalShadow[m]=Q,n.directionalShadowMap[m]=ee,n.directionalShadowMatrix[m]=I.shadow.matrix,T++}n.directional[m]=k,m++}else if(I.isSpotLight){const k=e.get(I);k.position.setFromMatrixPosition(I.matrixWorld),k.color.copy(F).multiplyScalar(X),k.distance=z,k.coneCos=Math.cos(I.angle),k.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),k.decay=I.decay,n.spot[_]=k;const Z=I.shadow;if(I.map&&(n.spotLightMap[S]=I.map,S++,Z.updateMatrices(I),I.castShadow&&L++),n.spotLightMatrix[_]=Z.matrix,I.castShadow){const Q=t.get(I);Q.shadowIntensity=Z.intensity,Q.shadowBias=Z.bias,Q.shadowNormalBias=Z.normalBias,Q.shadowRadius=Z.radius,Q.shadowMapSize=Z.mapSize,n.spotShadow[_]=Q,n.spotShadowMap[_]=ee,v++}_++}else if(I.isRectAreaLight){const k=e.get(I);k.color.copy(F).multiplyScalar(X),k.halfWidth.set(I.width*.5,0,0),k.halfHeight.set(0,I.height*.5,0),n.rectArea[E]=k,E++}else if(I.isPointLight){const k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),k.distance=I.distance,k.decay=I.decay,I.castShadow){const Z=I.shadow,Q=t.get(I);Q.shadowIntensity=Z.intensity,Q.shadowBias=Z.bias,Q.shadowNormalBias=Z.normalBias,Q.shadowRadius=Z.radius,Q.shadowMapSize=Z.mapSize,Q.shadowCameraNear=Z.camera.near,Q.shadowCameraFar=Z.camera.far,n.pointShadow[p]=Q,n.pointShadowMap[p]=ee,n.pointShadowMatrix[p]=I.shadow.matrix,y++}n.point[p]=k,p++}else if(I.isHemisphereLight){const k=e.get(I);k.skyColor.copy(I.color).multiplyScalar(X),k.groundColor.copy(I.groundColor).multiplyScalar(X),n.hemi[x]=k,x++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=we.LTC_FLOAT_1,n.rectAreaLTC2=we.LTC_FLOAT_2):(n.rectAreaLTC1=we.LTC_HALF_1,n.rectAreaLTC2=we.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const P=n.hash;(P.sunLength!==f||P.directionalLength!==m||P.pointLength!==p||P.spotLength!==_||P.rectAreaLength!==E||P.hemiLength!==x||P.numSunShadows!==g||P.numDirectionalShadows!==T||P.numPointShadows!==y||P.numSpotShadows!==v||P.numSpotMaps!==S||P.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=m,n.spot.length=_,n.rectArea.length=E,n.point.length=p,n.hemi.length=x,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=y,n.pointShadowMap.length=y,n.pointShadowMatrix.length=y,n.spotShadow.length=v,n.spotShadowMap.length=v,n.spotLightMatrix.length=v+S-L,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=R,P.sunLength=f,P.directionalLength=m,P.pointLength=p,P.spotLength=_,P.rectAreaLength=E,P.hemiLength=x,P.numSunShadows=g,P.numDirectionalShadows=T,P.numPointShadows=y,P.numSpotShadows=v,P.numSpotMaps=S,P.numLightProbes=R,n.version=c_++)}function l(c,h){let u=0,d=0,f=0,g=0,M=0,m=0;const p=h.matrixWorldInverse;for(let _=0,E=c.length;_<E;_++){const x=c[_];if(x.isSunLight){const T=n.sun[u];T.direction.setFromMatrixPosition(x.matrixWorld),T.direction.transformDirection(p),u++}else if(x.isDirectionalLight){const T=n.directional[d];T.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),d++}else if(x.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),g++}else if(x.isRectAreaLight){const T=n.rectArea[M];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(x.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(x.width*.5,0,0),T.halfHeight.set(0,x.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),M++}else if(x.isPointLight){const T=n.point[f];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){const T=n.hemi[m];T.direction.setFromMatrixPosition(x.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function bh(i){const e=new u_(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):t.push(u)}function o(u){n.push(u)}function l(){e.setup(t),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function d_(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new bh(i),e.set(s,[o])):r>=a.length?(o=new bh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const f_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,p_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,m_=[new A(1,0,0),new A(-1,0,0),new A(0,1,0),new A(0,-1,0),new A(0,0,1),new A(0,0,-1)],g_=[new A(0,-1,0),new A(0,-1,0),new A(0,0,1),new A(0,0,-1),new A(0,-1,0),new A(0,-1,0)],Eh=new Qe,$s=new A,ao=new A;function v_(i,e,t){let n=new pr;const s=new te,r=new te,a=new Ct,o=new Hu,l=new Cp,c={},h=t.maxTextureSize,u={[Qi]:dn,[dn]:Qi,[_n]:_n},d=new Ot({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4}},vertexShader:f_,fragmentShader:p_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ut;g.setAttribute("position",new zn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Be(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tr;let p=this.type;this.render=function(y,v,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;this.type===Rd&&(qe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=tr);const L=i.getRenderTarget(),R=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),D=i.state;D.setBlending(vn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const B=p!==this.type;B&&v.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(F=>F.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,F=y.length;I<F;I++){const X=y[I],z=X.shadow;if(z===void 0){qe("WebGLShadowMap:",X,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const ee=z.getFrameExtents();s.multiply(ee),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ee.x),s.x=r.x*ee.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ee.y),s.y=r.y*ee.y,z.mapSize.y=r.y));const k=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=k,z.map===null||B===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Js){if(X.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new jt(s.x,s.y,{format:es,type:Qt,minFilter:bn,magFilter:bn,generateMipmaps:!1}),z.map.texture.name=X.name+".shadowMap",z.map.depthTexture=new ts(s.x,s.y,$n),z.map.depthTexture.name=X.name+".shadowMapDepth",z.map.depthTexture.format=Fi,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Wt,z.map.depthTexture.magFilter=Wt}else X.isPointLight?(z.map=new Zl(s.x),z.map.depthTexture=new Cu(s.x,li)):(z.map=new jt(s.x,s.y),z.map.depthTexture=new ts(s.x,s.y,li)),z.map.depthTexture.name=X.name+".shadowMap",z.map.depthTexture.format=Fi,this.type===tr?(z.map.depthTexture.compareFunction=k?_u:vu,z.map.depthTexture.minFilter=bn,z.map.depthTexture.magFilter=bn):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Wt,z.map.depthTexture.magFilter=Wt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);const Z=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();X.isPointLight!==!0&&z.updateMatrices(X,S);const Q=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:S.layers;for(let xe=0;xe<Z;xe++){const re=z.getCamera(xe);if(X.isPointLight){const W=z.camera,oe=z.matrix,ye=X.distance||W.far;ye!==W.far&&(W.far=ye,W.updateProjectionMatrix()),$s.setFromMatrixPosition(X.matrixWorld),W.position.copy($s),ao.copy(W.position),ao.add(m_[xe]),W.up.copy(g_[xe]),W.lookAt(ao),W.updateMatrixWorld(),oe.makeTranslation(-$s.x,-$s.y,-$s.z),Eh.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Eh,W.coordinateSystem,W.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,xe),i.clear();else{xe===0&&(i.setRenderTarget(z.map),i.clear());const W=z.getViewport(xe);a.set(r.x*W.x,r.y*W.y,r.x*W.z,r.y*W.w),D.viewport(a)}n=z.getFrustum(xe),x(v,S,re,X,Q,this.type)}z.isPointLightShadow!==!0&&this.type===Js&&_(z,S),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(L,R,P)};function _(y,v){const S=e.update(M);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null?y.mapPass=new jt(s.x,s.y,{format:es,type:Qt}):(y.mapPass.width!==y.map.width||y.mapPass.height!==y.map.height)&&y.mapPass.setSize(y.map.width,y.map.height),d.uniforms.shadow_pass.value=y.map.depthTexture,d.uniforms.resolution.value.set(y.map.width,y.map.height),d.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(v,null,S,d,M,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value.set(y.map.width,y.map.height),f.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(v,null,S,f,M,null)}function E(y,v,S,L){let R=null;const P=S.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(P!==void 0)R=P;else if(R=S.isPointLight===!0?l:o,i.localClippingEnabled&&v.clipShadows===!0&&Array.isArray(v.clippingPlanes)&&v.clippingPlanes.length!==0||v.displacementMap&&v.displacementScale!==0||v.alphaMap&&v.alphaTest>0||v.map&&v.alphaTest>0||v.alphaToCoverage===!0){const D=R.uuid,B=v.uuid;let I=c[D];I===void 0&&(I={},c[D]=I);let F=I[B];F===void 0&&(F=R.clone(),I[B]=F,v.addEventListener("dispose",T)),R=F}if(R.visible=v.visible,R.wireframe=v.wireframe,L===Js?R.side=v.shadowSide!==null?v.shadowSide:v.side:R.side=v.shadowSide!==null?v.shadowSide:u[v.side],R.alphaMap=v.alphaMap,R.alphaTest=v.alphaToCoverage===!0?.5:v.alphaTest,R.map=v.map,R.clipShadows=v.clipShadows,R.clippingPlanes=v.clippingPlanes,R.clipIntersection=v.clipIntersection,R.displacementMap=v.displacementMap,R.displacementScale=v.displacementScale,R.displacementBias=v.displacementBias,R.wireframeLinewidth=v.wireframeLinewidth,R.linewidth=v.linewidth,S.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const D=i.properties.get(R);D.light=S}return R}function x(y,v,S,L,R,P){if(y.visible===!1)return;if(y.layers.test(R)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&P===Js)&&(!y.frustumCulled||y.intersectsFrustum(n))){y.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,y.matrixWorld);const I=e.update(y),F=y.material;if(Array.isArray(F)){const X=I.groups;for(let z=0,ee=X.length;z<ee;z++){const k=X[z],Z=F[k.materialIndex];if(Z&&Z.visible){const Q=E(y,Z,L,P);y.onBeforeShadow(i,y,v,S,I,Q,k),i.renderBufferDirect(S,null,I,Q,y,k),y.onAfterShadow(i,y,v,S,I,Q,k)}}}else if(F.visible){const X=E(y,F,L,P);y.onBeforeShadow(i,y,v,S,I,X,null),i.renderBufferDirect(S,null,I,X,y,null),y.onAfterShadow(i,y,v,S,I,X,null)}}const B=y.children;for(let I=0,F=B.length;I<F;I++)x(B[I],v,S,L,R,P)}function T(y){y.target.removeEventListener("dispose",T);for(const S in c){const L=c[S],R=y.target.uuid;R in L&&(L[R].dispose(),delete L[R])}}}function __(i,e){function t(){let N=!1;const j=new Ct;let Y=null;const _e=new Ct(0,0,0,0);return{setMask:function(pe){Y!==pe&&!N&&(i.colorMask(pe,pe,pe,pe),Y=pe)},setLocked:function(pe){N=pe},setClear:function(pe,ve,ze,at,ce){ce===!0&&(pe*=at,ve*=at,ze*=at),j.set(pe,ve,ze,at),_e.equals(j)===!1&&(i.clearColor(pe,ve,ze,at),_e.copy(j))},reset:function(){N=!1,Y=null,_e.set(-1,0,0,0)}}}function n(){let N=!1,j=!1,Y=null,_e=null,pe=null;return{setReversed:function(ve){if(j!==ve){const ze=e.get("EXT_clip_control");ve?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT),j=ve;const at=pe;pe=null,this.setClear(at)}},getReversed:function(){return j},setTest:function(ve){ve?se(i.DEPTH_TEST):Re(i.DEPTH_TEST)},setMask:function(ve){Y!==ve&&!N&&(i.depthMask(ve),Y=ve)},setFunc:function(ve){if(j&&(ve=af[ve]),_e!==ve){switch(ve){case Ao:i.depthFunc(i.NEVER);break;case Ro:i.depthFunc(i.ALWAYS);break;case Co:i.depthFunc(i.LESS);break;case cr:i.depthFunc(i.LEQUAL);break;case Po:i.depthFunc(i.EQUAL);break;case Lo:i.depthFunc(i.GEQUAL);break;case Do:i.depthFunc(i.GREATER);break;case Io:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}_e=ve}},setLocked:function(ve){N=ve},setClear:function(ve){pe!==ve&&(pe=ve,j&&(ve=1-ve),i.clearDepth(ve))},reset:function(){N=!1,Y=null,_e=null,pe=null,j=!1}}}function s(){let N=!1,j=null,Y=null,_e=null,pe=null,ve=null,ze=null,at=null,ce=null;return{setTest:function(ke){N||(ke?se(i.STENCIL_TEST):Re(i.STENCIL_TEST))},setMask:function(ke){j!==ke&&!N&&(i.stencilMask(ke),j=ke)},setFunc:function(ke,it,Ee){(Y!==ke||_e!==it||pe!==Ee)&&(i.stencilFunc(ke,it,Ee),Y=ke,_e=it,pe=Ee)},setOp:function(ke,it,Ee){(ve!==ke||ze!==it||at!==Ee)&&(i.stencilOp(ke,it,Ee),ve=ke,ze=it,at=Ee)},setLocked:function(ke){N=ke},setClear:function(ke){ce!==ke&&(i.clearStencil(ke),ce=ke)},reset:function(){N=!1,j=null,Y=null,_e=null,pe=null,ve=null,ze=null,at=null,ce=null}}}const r=new t,a=new n,o=new s;let l={};const c=new WeakMap;let h={},u={},d={},f=new WeakMap,g=[],M=null,m=!1,p=null,_=null,E=null,x=null,T=null,y=null,v=null,S=new Ce(0,0,0),L=0,R=!1,P=null,D=null,B=null,I=null,F=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,ee=0;const k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(k)[1]),z=ee>=1):k.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),z=ee>=2);let Z=null,Q={};const xe=i.getParameter(i.SCISSOR_BOX),re=i.getParameter(i.VIEWPORT),W=new Ct().fromArray(xe),oe=new Ct().fromArray(re);function ye(N,j,Y,_e){const pe=new Uint8Array(4),ve=i.createTexture();i.bindTexture(N,ve),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ze=0;ze<Y;ze++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(j,0,i.RGBA,1,1,_e,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(j+ze,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return ve}const ie={};ie[i.TEXTURE_2D]=ye(i.TEXTURE_2D,i.TEXTURE_2D,1),ie[i.TEXTURE_CUBE_MAP]=ye(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[i.TEXTURE_2D_ARRAY]=ye(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ie[i.TEXTURE_3D]=ye(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(i.DEPTH_TEST),a.setFunc(cr),be(!1),de(fc),se(i.CULL_FACE),he(vn);function se(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Re(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function tt(N,j){return d[N]!==j?(i.bindFramebuffer(N,j),d[N]=j,N===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=j),N===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=j),!0):!1}function Pe(N,j){let Y=g,_e=!1;if(N){Y=f.get(j),Y===void 0&&(Y=[],f.set(j,Y));const pe=N.textures;if(Y.length!==pe.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let ve=0,ze=pe.length;ve<ze;ve++)Y[ve]=i.COLOR_ATTACHMENT0+ve;Y.length=pe.length,_e=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,_e=!0);_e&&i.drawBuffers(Y)}function Fe(N){return M!==N?(i.useProgram(N),M=N,!0):!1}const Ge={[si]:i.FUNC_ADD,[Cd]:i.FUNC_SUBTRACT,[Pd]:i.FUNC_REVERSE_SUBTRACT};Ge[Ld]=i.MIN,Ge[Dd]=i.MAX;const J={[Qs]:i.ZERO,[Id]:i.ONE,[Nd]:i.SRC_COLOR,[tu]:i.SRC_ALPHA,[zd]:i.SRC_ALPHA_SATURATE,[To]:i.DST_COLOR,[wo]:i.DST_ALPHA,[Ud]:i.ONE_MINUS_SRC_COLOR,[nu]:i.ONE_MINUS_SRC_ALPHA,[Fd]:i.ONE_MINUS_DST_COLOR,[Od]:i.ONE_MINUS_DST_ALPHA,[Bd]:i.CONSTANT_COLOR,[kd]:i.ONE_MINUS_CONSTANT_COLOR,[Hd]:i.CONSTANT_ALPHA,[Vd]:i.ONE_MINUS_CONSTANT_ALPHA};function he(N,j,Y,_e,pe,ve,ze,at,ce,ke){if(N===vn){m===!0&&(Re(i.BLEND),m=!1);return}if(m===!1&&(se(i.BLEND),m=!0),N!==eu){if(N!==p||ke!==R){if((_!==si||T!==si)&&(i.blendEquation(i.FUNC_ADD),_=si,T=si),ke)switch(N){case nr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rs:i.blendFunc(i.ONE,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:pt("WebGLState: Invalid blending: ",N);break}else switch(N){case nr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case pc:pt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case mc:pt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:pt("WebGLState: Invalid blending: ",N);break}E=null,x=null,y=null,v=null,S.set(0,0,0),L=0,p=N,R=ke}return}pe=pe||j,ve=ve||Y,ze=ze||_e,(j!==_||pe!==T)&&(i.blendEquationSeparate(Ge[j],Ge[pe]),_=j,T=pe),(Y!==E||_e!==x||ve!==y||ze!==v)&&(i.blendFuncSeparate(J[Y],J[_e],J[ve],J[ze]),E=Y,x=_e,y=ve,v=ze),(at.equals(S)===!1||ce!==L)&&(i.blendColor(at.r,at.g,at.b,ce),S.copy(at),L=ce),p=N,R=!1}function le(N,j){N.side===_n?Re(i.CULL_FACE):se(i.CULL_FACE);let Y=N.side===dn;j&&(Y=!Y),be(Y),N.blending===nr&&N.transparent===!1?he(vn):he(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const _e=N.stencilWrite;o.setTest(_e),_e&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ne(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):Re(i.SAMPLE_ALPHA_TO_COVERAGE)}function be(N){P!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),P=N)}function de(N){N!==Td?(se(i.CULL_FACE),N!==D&&(N===fc?i.cullFace(i.BACK):N===Ad?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Re(i.CULL_FACE),D=N}function We(N){N!==B&&(z&&i.lineWidth(N),B=N)}function Ne(N,j,Y){N?(se(i.POLYGON_OFFSET_FILL),(I!==j||F!==Y)&&(I=j,F=Y,a.getReversed()&&(j=-j,Y=-Y),i.polygonOffset(j,Y))):Re(i.POLYGON_OFFSET_FILL)}function nt(N){N?se(i.SCISSOR_TEST):Re(i.SCISSOR_TEST)}function rt(N){N===void 0&&(N=i.TEXTURE0+X-1),Z!==N&&(i.activeTexture(N),Z=N)}function lt(N,j,Y){Y===void 0&&(Z===null?Y=i.TEXTURE0+X-1:Y=Z);let _e=Q[Y];_e===void 0&&(_e={type:void 0,texture:void 0},Q[Y]=_e),(_e.type!==N||_e.texture!==j)&&(Z!==Y&&(i.activeTexture(Y),Z=Y),i.bindTexture(N,j||ie[N]),_e.type=N,_e.texture=j)}function O(){const N=Q[Z];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Lt(){try{i.compressedTexImage2D(...arguments)}catch(N){pt("WebGLState:",N)}}function je(){try{i.compressedTexImage3D(...arguments)}catch(N){pt("WebGLState:",N)}}function gt(){try{i.texSubImage2D(...arguments)}catch(N){pt("WebGLState:",N)}}function me(){try{i.texSubImage3D(...arguments)}catch(N){pt("WebGLState:",N)}}function Et(){try{i.compressedTexSubImage2D(...arguments)}catch(N){pt("WebGLState:",N)}}function Oe(){try{i.compressedTexSubImage3D(...arguments)}catch(N){pt("WebGLState:",N)}}function He(){try{i.texStorage2D(...arguments)}catch(N){pt("WebGLState:",N)}}function C(){try{i.texStorage3D(...arguments)}catch(N){pt("WebGLState:",N)}}function b(){try{i.texImage2D(...arguments)}catch(N){pt("WebGLState:",N)}}function H(){try{i.texImage3D(...arguments)}catch(N){pt("WebGLState:",N)}}function ae(N){return u[N]!==void 0?u[N]:i.getParameter(N)}function ne(N,j){u[N]!==j&&(i.pixelStorei(N,j),u[N]=j)}function ue(N){W.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),W.copy(N))}function ge(N){oe.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),oe.copy(N))}function $(N,j){let Y=c.get(j);Y===void 0&&(Y=new WeakMap,c.set(j,Y));let _e=Y.get(N);_e===void 0&&(_e=i.getUniformBlockIndex(j,N.name),i.uniformBlockBinding(j,_e,_e),Y.set(N,_e))}function K(N,j,Y){const pe=c.get(j).get(N);l[pe]!==Y&&(i.bindBufferBase(i.UNIFORM_BUFFER,pe,Y),l[pe]=Y)}function fe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},Z=null,Q={},d={},l={},f=new WeakMap,g=[],M=null,m=!1,p=null,_=null,E=null,x=null,T=null,y=null,v=null,S=new Ce(0,0,0),L=0,R=!1,P=null,D=null,B=null,I=null,F=null,W.set(0,0,i.canvas.width,i.canvas.height),oe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:se,disable:Re,bindFramebuffer:tt,drawBuffers:Pe,useProgram:Fe,setBlending:he,setMaterial:le,setFlipSided:be,setCullFace:de,setLineWidth:We,setPolygonOffset:Ne,setScissorTest:nt,activeTexture:rt,bindTexture:lt,unbindTexture:O,compressedTexImage2D:Lt,compressedTexImage3D:je,texImage2D:b,texImage3D:H,pixelStorei:ne,getParameter:ae,updateUBOMapping:$,uniformBlockBinding:K,texStorage2D:He,texStorage3D:C,texSubImage2D:gt,texSubImage3D:me,compressedTexSubImage2D:Et,compressedTexSubImage3D:Oe,scissor:ue,viewport:ge,reset:fe}}function x_(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new te,h=new WeakMap,u=new Set;let d;const f=new WeakMap,g=new Set,M=new FinalizationRegistry(C=>g.delete(C));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(C,b){return m?new OffscreenCanvas(C,b):ma("canvas")}function _(C,b,H){let ae=1;const ne=He(C);if((ne.width>H||ne.height>H)&&(ae=H/Math.max(ne.width,ne.height)),ae<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ue=Math.floor(ae*ne.width),ge=Math.floor(ae*ne.height);d===void 0&&(d=p(ue,ge));const $=b?p(ue,ge):d;return $.width=ue,$.height=ge,$.getContext("2d").drawImage(C,0,0,ue,ge),qe("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ue+"x"+ge+")."),$}else return"data"in C&&qe("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),C;return C}function E(C){return C.generateMipmaps}function x(C){i.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,b,H,ae,ne,ue=!1){if(C!==null){if(i[C]!==void 0)return i[C];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ge;ae&&(ge=e.get("EXT_texture_norm16"),ge||qe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=b;if(b===i.RED&&(H===i.FLOAT&&($=i.R32F),H===i.HALF_FLOAT&&($=i.R16F),H===i.UNSIGNED_BYTE&&($=i.R8),H===i.UNSIGNED_SHORT&&ge&&($=ge.R16_EXT),H===i.SHORT&&ge&&($=ge.R16_SNORM_EXT)),b===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.R8UI),H===i.UNSIGNED_SHORT&&($=i.R16UI),H===i.UNSIGNED_INT&&($=i.R32UI),H===i.BYTE&&($=i.R8I),H===i.SHORT&&($=i.R16I),H===i.INT&&($=i.R32I)),b===i.RG&&(H===i.FLOAT&&($=i.RG32F),H===i.HALF_FLOAT&&($=i.RG16F),H===i.UNSIGNED_BYTE&&($=i.RG8),H===i.UNSIGNED_SHORT&&ge&&($=ge.RG16_EXT),H===i.SHORT&&ge&&($=ge.RG16_SNORM_EXT)),b===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RG8UI),H===i.UNSIGNED_SHORT&&($=i.RG16UI),H===i.UNSIGNED_INT&&($=i.RG32UI),H===i.BYTE&&($=i.RG8I),H===i.SHORT&&($=i.RG16I),H===i.INT&&($=i.RG32I)),b===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGB8UI),H===i.UNSIGNED_SHORT&&($=i.RGB16UI),H===i.UNSIGNED_INT&&($=i.RGB32UI),H===i.BYTE&&($=i.RGB8I),H===i.SHORT&&($=i.RGB16I),H===i.INT&&($=i.RGB32I)),b===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGBA8UI),H===i.UNSIGNED_SHORT&&($=i.RGBA16UI),H===i.UNSIGNED_INT&&($=i.RGBA32UI),H===i.BYTE&&($=i.RGBA8I),H===i.SHORT&&($=i.RGBA16I),H===i.INT&&($=i.RGBA32I)),b===i.RGB&&(H===i.UNSIGNED_SHORT&&ge&&($=ge.RGB16_EXT),H===i.SHORT&&ge&&($=ge.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),b===i.RGBA){const K=ue?pa:ut.getTransfer(ne);H===i.FLOAT&&($=i.RGBA32F),H===i.HALF_FLOAT&&($=i.RGBA16F),H===i.UNSIGNED_BYTE&&($=K===St?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&ge&&($=ge.RGBA16_EXT),H===i.SHORT&&ge&&($=ge.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(C,b){let H;return C?b===null||b===li||b===ji?H=i.DEPTH24_STENCIL8:b===$n?H=i.DEPTH32F_STENCIL8:b===ur&&(H=i.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===li||b===ji?H=i.DEPTH_COMPONENT24:b===$n?H=i.DEPTH_COMPONENT32F:b===ur&&(H=i.DEPTH_COMPONENT16),H}function S(C,b){return E(C)===!0||C.isFramebufferTexture&&C.minFilter!==Wt&&C.minFilter!==bn?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function L(C){const b=new WeakRef(C);n.get(C).__ref=b,g.add(b),M.register(C,b,b)}function R(C){const b=n.get(C).__ref;b!==void 0&&(g.delete(b),M.unregister(b))}function P(C){B(C.target)}function D(C){I(C.target)}function B(C){C.removeEventListener("dispose",P),R(C),X(C),C.isVideoTexture&&h.delete(C),C.isHTMLTexture&&u.delete(C)}function I(C){C.removeEventListener("dispose",D),R(C),ee(C)}function F(){for(const C of g){const b=C.deref();b!==void 0&&(b.isRenderTarget===!0?I(b):B(b))}g.clear(),u.clear()}function X(C){const b=n.get(C);if(b.__webglInit===void 0)return;const H=C.source,ae=f.get(H);if(ae){const ne=ae[b.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&z(C),Object.keys(ae).length===0&&f.delete(H)}n.remove(C)}function z(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const H=C.source,ae=f.get(H);delete ae[b.__cacheKey],a.memory.textures--}function ee(C){const b=n.get(C);b.__depthDisposeCallback&&b.__depthDisposeCallback();const H=C.depthTexture;if(H&&H.renderTarget===C&&B(H),C.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(b.__webglFramebuffer[ne]))for(let ue=0;ue<b.__webglFramebuffer[ne].length;ue++)i.deleteFramebuffer(b.__webglFramebuffer[ne][ue]);else i.deleteFramebuffer(b.__webglFramebuffer[ne]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[ne])}else{if(Array.isArray(b.__webglFramebuffer))for(let ne=0;ne<b.__webglFramebuffer.length;ne++)i.deleteFramebuffer(b.__webglFramebuffer[ne]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ne=0;ne<b.__webglColorRenderbuffer.length;ne++)b.__webglColorRenderbuffer[ne]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[ne]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const ae=C.textures;for(let ne=0,ue=ae.length;ne<ue;ne++){const ge=n.get(ae[ne]);ge.__webglTexture&&(i.deleteTexture(ge.__webglTexture),a.memory.textures--),n.remove(ae[ne])}n.remove(C)}let k=0;function Z(){k=0}function Q(){return k}function xe(C){k=C}function re(){const C=k;return C>=s.maxTextures&&qe("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),k+=1,C}function W(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.mipmapsAutoUpdate),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function oe(C,b){const H=n.get(C);if(C.isVideoTexture&&Et(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){const ae=C.image;if(ae===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{le(H,C,b);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+b)}function ye(C,b){const H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){le(H,C,b);return}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+b)}function ie(C,b){const H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){le(H,C,b);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+b)}function se(C,b){const H=n.get(C);if(C.version>0&&H.__version!==C.version){be(H,C,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+b)}const Re={[Oi]:i.REPEAT,[ai]:i.CLAMP_TO_EDGE,[No]:i.MIRRORED_REPEAT},tt={[Wt]:i.NEAREST,[Xd]:i.NEAREST_MIPMAP_NEAREST,[wr]:i.NEAREST_MIPMAP_LINEAR,[bn]:i.LINEAR,[Ia]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},Pe={[Kd]:i.NEVER,[xu]:i.ALWAYS,[Jd]:i.LESS,[vu]:i.LEQUAL,[Qd]:i.EQUAL,[_u]:i.GEQUAL,[jd]:i.GREATER,[ef]:i.NOTEQUAL};function Fe(C,b){if(b.type===$n&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===bn||b.magFilter===Ia||b.magFilter===wr||b.magFilter===Mi||b.minFilter===bn||b.minFilter===Ia||b.minFilter===wr||b.minFilter===Mi)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Re[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Re[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Re[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,tt[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,tt[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Pe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Wt||b.minFilter!==wr&&b.minFilter!==Mi||b.type===$n&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Ge(C,b){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",P),L(b));const ae=b.source;let ne=f.get(ae);ne===void 0&&(ne={},f.set(ae,ne));const ue=W(b);if(ue!==C.__cacheKey){ne[ue]===void 0&&(ne[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),ne[ue].usedTimes++;const ge=ne[C.__cacheKey];ge!==void 0&&(ne[C.__cacheKey].usedTimes--,ge.usedTimes===0&&z(b)),C.__cacheKey=ue,C.__webglTexture=ne[ue].texture}return H}function J(C,b,H){return Math.floor(Math.floor(C/H)/b)}function he(C,b,H,ae){const ue=C.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,H,ae,b.data);else{ue.sort((N,j)=>N.start-j.start);let ge=0;for(let N=1;N<ue.length;N++){const j=ue[ge],Y=ue[N],_e=j.start+j.count,pe=J(Y.start,b.width,4),ve=J(j.start,b.width,4);Y.start<=_e+1&&pe===ve&&J(Y.start+Y.count-1,b.width,4)===pe?j.count=Math.max(j.count,Y.start+Y.count-j.start):(++ge,ue[ge]=Y)}ue.length=ge+1;const $=t.getParameter(i.UNPACK_ROW_LENGTH),K=t.getParameter(i.UNPACK_SKIP_PIXELS),fe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let N=0,j=ue.length;N<j;N++){const Y=ue[N],_e=Math.floor(Y.start/4),pe=Math.ceil(Y.count/4),ve=_e%b.width,ze=Math.floor(_e/b.width),at=pe,ce=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ve),t.pixelStorei(i.UNPACK_SKIP_ROWS,ze),t.texSubImage2D(i.TEXTURE_2D,0,ve,ze,at,ce,H,ae,b.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,$),t.pixelStorei(i.UNPACK_SKIP_PIXELS,K),t.pixelStorei(i.UNPACK_SKIP_ROWS,fe)}}function le(C,b,H){let ae=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(ae=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(ae=i.TEXTURE_3D);const ne=Ge(C,b),ue=b.source;t.bindTexture(ae,C.__webglTexture,i.TEXTURE0+H);const ge=n.get(ue);if(ue.version!==ge.__version||ne===!0){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const ce=ut.getPrimaries(ut.workingColorSpace),ke=b.colorSpace===ri?null:ut.getPrimaries(b.colorSpace),it=b.colorSpace===ri||ce===ke?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,it)}t.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment);let K=_(b.image,!1,s.maxTextureSize);K=Oe(b,K);const fe=r.convert(b.format,b.colorSpace),N=r.convert(b.type);let j=y(b.internalFormat,fe,N,b.normalized,b.colorSpace,b.isVideoTexture);Fe(ae,b);let Y;const _e=b.mipmaps,pe=b.isVideoTexture!==!0,ve=ge.__version===void 0||ne===!0,ze=ue.dataReady,at=S(b,K);if(b.isDepthTexture)j=v(b.format===Si,b.type),ve&&(pe?t.texStorage2D(i.TEXTURE_2D,1,j,K.width,K.height):t.texImage2D(i.TEXTURE_2D,0,j,K.width,K.height,0,fe,N,null));else if(b.isDataTexture)if(_e.length>0){pe&&ve&&t.texStorage2D(i.TEXTURE_2D,at,j,_e[0].width,_e[0].height);for(let ce=0,ke=_e.length;ce<ke;ce++)Y=_e[ce],pe?ze&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,Y.width,Y.height,fe,N,Y.data):t.texImage2D(i.TEXTURE_2D,ce,j,Y.width,Y.height,0,fe,N,Y.data);b.generateMipmaps=!1}else pe?(ve&&t.texStorage2D(i.TEXTURE_2D,at,j,K.width,K.height),ze&&he(b,K,fe,N)):t.texImage2D(i.TEXTURE_2D,0,j,K.width,K.height,0,fe,N,K.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){pe&&ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,at,j,_e[0].width,_e[0].height,K.depth);for(let ce=0,ke=_e.length;ce<ke;ce++)if(Y=_e[ce],b.format!==Yn)if(fe!==null)if(pe){if(ze)if(b.layerUpdates.size>0){const it=ih(Y.width,Y.height,b.format,b.type);for(const Ee of b.layerUpdates){const Mt=Y.data.subarray(Ee*it/Y.data.BYTES_PER_ELEMENT,(Ee+1)*it/Y.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,Ee,Y.width,Y.height,1,fe,Mt)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,Y.width,Y.height,K.depth,fe,Y.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ce,j,Y.width,Y.height,K.depth,0,Y.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else pe?ze&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,Y.width,Y.height,K.depth,fe,N,Y.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ce,j,Y.width,Y.height,K.depth,0,fe,N,Y.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{pe&&ve&&t.texStorage2D(i.TEXTURE_2D,at,j,_e[0].width,_e[0].height);for(let ce=0,ke=_e.length;ce<ke;ce++)Y=_e[ce],b.format!==Yn?fe!==null?pe?ze&&t.compressedTexSubImage2D(i.TEXTURE_2D,ce,0,0,Y.width,Y.height,fe,Y.data):t.compressedTexImage2D(i.TEXTURE_2D,ce,j,Y.width,Y.height,0,Y.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pe?ze&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,Y.width,Y.height,fe,N,Y.data):t.texImage2D(i.TEXTURE_2D,ce,j,Y.width,Y.height,0,fe,N,Y.data)}else if(b.isDataArrayTexture)if(pe){if(ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,at,j,K.width,K.height,K.depth),ze)if(b.layerUpdates.size>0){const ce=ih(K.width,K.height,b.format,b.type);for(const ke of b.layerUpdates){const it=K.data.subarray(ke*ce/K.data.BYTES_PER_ELEMENT,(ke+1)*ce/K.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ke,K.width,K.height,1,fe,N,it)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,fe,N,K.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,j,K.width,K.height,K.depth,0,fe,N,K.data);else if(b.isData3DTexture)pe?(ve&&t.texStorage3D(i.TEXTURE_3D,at,j,K.width,K.height,K.depth),ze&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,fe,N,K.data)):t.texImage3D(i.TEXTURE_3D,0,j,K.width,K.height,K.depth,0,fe,N,K.data);else if(b.isFramebufferTexture){if(ve)if(pe)t.texStorage2D(i.TEXTURE_2D,at,j,K.width,K.height);else{let ce=K.width,ke=K.height;for(let it=0;it<at;it++)t.texImage2D(i.TEXTURE_2D,it,j,ce,ke,0,fe,N,null),ce>>=1,ke>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in i){const ce=i.canvas;if(ce.hasAttribute("layoutsubtree")||ce.setAttribute("layoutsubtree","true"),K.parentNode!==ce){ce.appendChild(K),u.add(b),ce.onpaint=ke=>{const it=ke.changedElements;for(const Ee of u)it.includes(Ee.image)&&(Ee.needsUpdate=!0)},ce.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,K);else{const it=i.RGBA,Ee=i.RGBA,Mt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,it,Ee,Mt,K)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(_e.length>0){if(pe&&ve){const ce=He(_e[0]);t.texStorage2D(i.TEXTURE_2D,at,j,ce.width,ce.height)}for(let ce=0,ke=_e.length;ce<ke;ce++)Y=_e[ce],pe?ze&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,fe,N,Y):t.texImage2D(i.TEXTURE_2D,ce,j,fe,N,Y);b.generateMipmaps=!1}else if(pe){if(ve){const ce=He(K);t.texStorage2D(i.TEXTURE_2D,at,j,ce.width,ce.height)}ze&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,N,K)}else t.texImage2D(i.TEXTURE_2D,0,j,fe,N,K);E(b)&&b.mipmapsAutoUpdate===!0&&x(ae),ge.__version=ue.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function be(C,b,H){if(b.image.length!==6)return;const ae=Ge(C,b),ne=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+H);const ue=n.get(ne);if(ne.version!==ue.__version||ae===!0){t.activeTexture(i.TEXTURE0+H);const ge=ut.getPrimaries(ut.workingColorSpace),$=b.colorSpace===ri?null:ut.getPrimaries(b.colorSpace),K=b.colorSpace===ri||ge===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);const fe=b.isCompressedTexture||b.image[0].isCompressedTexture,N=b.image[0]&&b.image[0].isDataTexture,j=[];for(let Ee=0;Ee<6;Ee++)!fe&&!N?j[Ee]=_(b.image[Ee],!0,s.maxCubemapSize):j[Ee]=N?b.image[Ee].image:b.image[Ee],j[Ee]=Oe(b,j[Ee]);const Y=j[0],_e=r.convert(b.format,b.colorSpace),pe=r.convert(b.type);let ve=y(b.internalFormat,_e,pe,b.normalized,b.colorSpace);const ze=b.isVideoTexture!==!0,at=ue.__version===void 0||ae===!0,ce=ne.dataReady;let ke=S(b,Y);Fe(i.TEXTURE_CUBE_MAP,b);let it;if(b.isDepthTexture){if(ve=v(b.format===Si,b.type),at)if(ze)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,ve,Y.width,Y.height);else for(let Ee=0;Ee<6;Ee++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,ve,Y.width,Y.height,0,_e,pe,null)}else if(fe){ze&&at&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ke,ve,Y.width,Y.height);for(let Ee=0;Ee<6;Ee++){it=j[Ee].mipmaps;for(let Mt=0;Mt<it.length;Mt++){const Yt=it[Mt];b.format!==Yn?_e!==null?ze?ce&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt,0,0,Yt.width,Yt.height,_e,Yt.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt,ve,Yt.width,Yt.height,0,Yt.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ze?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt,0,0,Yt.width,Yt.height,_e,pe,Yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt,ve,Yt.width,Yt.height,0,_e,pe,Yt.data)}}}else{if(it=b.mipmaps,ze&&at){it.length>0&&ke++;const Ee=He(j[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ke,ve,Ee.width,Ee.height)}for(let Ee=0;Ee<6;Ee++)if(N){ze?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,j[Ee].width,j[Ee].height,_e,pe,j[Ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,ve,j[Ee].width,j[Ee].height,0,_e,pe,j[Ee].data);for(let Mt=0;Mt<it.length;Mt++){const Ai=it[Mt].image[Ee].image;ze?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt+1,0,0,Ai.width,Ai.height,_e,pe,Ai.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt+1,ve,Ai.width,Ai.height,0,_e,pe,Ai.data)}}else{ze?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,_e,pe,j[Ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,ve,_e,pe,j[Ee]);for(let Mt=0;Mt<it.length;Mt++){const Yt=it[Mt];ze?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt+1,0,0,_e,pe,Yt.image[Ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Mt+1,ve,_e,pe,Yt.image[Ee])}}}E(b)&&b.mipmapsAutoUpdate===!0&&x(i.TEXTURE_CUBE_MAP),ue.__version=ne.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function de(C,b,H,ae,ne,ue){const ge=r.convert(H.format,H.colorSpace),$=r.convert(H.type),K=y(H.internalFormat,ge,$,H.normalized,H.colorSpace),fe=n.get(b),N=n.get(H);if(N.__renderTarget=b,!fe.__hasExternalTextures){const j=Math.max(1,b.width>>ue),Y=Math.max(1,b.height>>ue);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,ue,K,j,Y,b.depth,0,ge,$,null):t.texImage2D(ne,ue,K,j,Y,0,ge,$,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),me(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ae,ne,N.__webglTexture,0,gt(b)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ae,ne,N.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function We(C,b,H){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){const ae=b.depthTexture,ne=ae&&ae.isDepthTexture?ae.type:null,ue=v(b.stencilBuffer,ne),ge=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;me(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(b),ue,b.width,b.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(b),ue,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ue,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,C)}else{const ae=b.textures;for(let ne=0;ne<ae.length;ne++){const ue=ae[ne],ge=r.convert(ue.format,ue.colorSpace),$=r.convert(ue.type),K=y(ue.internalFormat,ge,$,ue.normalized,ue.colorSpace);me(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(b),K,b.width,b.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(b),K,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,K,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ne(C,b,H){const ae=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ne=n.get(b.depthTexture);ne.__renderTarget=b;const ue=ae?b.depthTexture.image[0]:b.depthTexture.image;(!ne.__webglTexture||ue.width!==b.width||ue.height!==b.height)&&(ue.width=b.width,ue.height=b.height,b.depthTexture.needsUpdate=!0),ae?se(b.depthTexture,0):oe(b.depthTexture,0);const ge=ne.__webglTexture,$=gt(b),K=ae?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,fe=b.depthTexture.format===Si?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(b.depthTexture.format===Fi)me(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,fe,K,ge,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,fe,K,ge,0);else if(b.depthTexture.format===Si)me(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,fe,K,ge,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,fe,K,ge,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function nt(C){const b=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){const ae=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),ae){const ne=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,ae.removeEventListener("dispose",ne)};ae.addEventListener("dispose",ne),b.__depthDisposeCallback=ne}b.__boundDepthTexture=ae}if(C.depthTexture&&!b.__autoAllocateDepthBuffer)if(H)for(let ae=0;ae<6;ae++)Ne(b.__webglFramebuffer[ae],C,ae);else C.texture.mipmaps.length>0?Ne(b.__webglFramebuffer[0],C,0):Ne(b.__webglFramebuffer,C,0);else if(H){b.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[ae]),b.__webglDepthbuffer[ae]===void 0)b.__webglDepthbuffer[ae]=i.createRenderbuffer(),We(b.__webglDepthbuffer[ae],C,!1);else{const ne=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=b.__webglDepthbuffer[ae];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,ue)}}else if(C.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),We(b.__webglDepthbuffer,C,!1);else{const ne=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,ue)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function rt(C,b,H){const ae=n.get(C);b!==void 0&&de(ae.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&nt(C)}function lt(C){const b=C.texture,H=n.get(C),ae=n.get(b);C.addEventListener("dispose",D),L(C);const ne=C.textures,ue=C.isWebGLCubeRenderTarget===!0,ge=ne.length>1;if(ge||(ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture()),ae.__version=b.version,a.memory.textures++),ue){H.__webglFramebuffer=[];for(let $=0;$<6;$++)if(b.mipmaps.length>0){H.__webglFramebuffer[$]=[];for(let K=0;K<b.mipmaps.length;K++)H.__webglFramebuffer[$][K]=i.createFramebuffer()}else H.__webglFramebuffer[$]=i.createFramebuffer()}else{if(b.mipmaps.length>0){H.__webglFramebuffer=[];for(let $=0;$<b.mipmaps.length;$++)H.__webglFramebuffer[$]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(ge)for(let $=0,K=ne.length;$<K;$++){const fe=n.get(ne[$]);fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&me(C)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let $=0;$<ne.length;$++){const K=ne[$];H.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[$]);const fe=r.convert(K.format,K.colorSpace),N=r.convert(K.type),j=y(K.internalFormat,fe,N,K.normalized,K.colorSpace,C.isXRRenderTarget===!0),Y=gt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Y,j,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,H.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),We(H.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,ae.__webglTexture),Fe(i.TEXTURE_CUBE_MAP,b);for(let $=0;$<6;$++)if(b.mipmaps.length>0)for(let K=0;K<b.mipmaps.length;K++)de(H.__webglFramebuffer[$][K],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,K);else de(H.__webglFramebuffer[$],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);E(b)?x(i.TEXTURE_CUBE_MAP):b.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,b.mipmaps.length-1),t.unbindTexture()}else if(ge){for(let $=0,K=ne.length;$<K;$++){const fe=ne[$],N=n.get(fe);let j=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(j=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(j,N.__webglTexture),Fe(j,fe),de(H.__webglFramebuffer,C,fe,i.COLOR_ATTACHMENT0+$,j,0),E(fe)&&x(j)}t.unbindTexture()}else{let $=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&($=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,ae.__webglTexture),Fe($,b),b.mipmaps.length>0)for(let K=0;K<b.mipmaps.length;K++)de(H.__webglFramebuffer[K],C,b,i.COLOR_ATTACHMENT0,$,K);else de(H.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,$,0);E(b)?x($):b.mipmaps.length>0&&i.texParameteri($,i.TEXTURE_MAX_LEVEL,b.mipmaps.length-1),t.unbindTexture()}C.depthBuffer&&nt(C)}function O(C){const b=C.textures;for(let H=0,ae=b.length;H<ae;H++){const ne=b[H];if(E(ne)&&ne.mipmapsAutoUpdate===!0){const ue=T(C),ge=n.get(ne).__webglTexture;t.bindTexture(ue,ge),x(ue),t.unbindTexture()}}}const Lt=[];function je(C){if(C.samples>0){if(me(C)===!1){const b=C.textures,H=C.width,ae=C.height;let ne=i.COLOR_BUFFER_BIT;const ue=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=n.get(C),$=b.length>1;if($)for(let fe=0;fe<b.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let fe=0;fe<b.length;fe++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ge.__webglColorRenderbuffer[fe]);const N=n.get(b[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,N,0)}i.blitFramebuffer(0,0,H,ae,0,0,H,ae,ne,i.NEAREST),l===!0&&(Lt.length=0,Lt.push(i.COLOR_ATTACHMENT0+fe),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&Lt.push(ue),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Lt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let fe=0;fe<b.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,ge.__webglColorRenderbuffer[fe]);const N=n.get(b[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,N,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){const b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function gt(C){return Math.min(s.maxSamples,C.samples)}function me(C){const b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Et(C){const b=a.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function Oe(C,b){const H=C.colorSpace,ae=C.format,ne=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==dr&&H!==ri&&(ut.getTransfer(H)===St?(ae!==Yn||ne!==Sn)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):pt("WebGLTextures: Unsupported texture color space:",H)),b}function He(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=re,this.resetTextureUnits=Z,this.getTextureUnits=Q,this.setTextureUnits=xe,this.setTexture2D=oe,this.setTexture2DArray=ye,this.setTexture3D=ie,this.setTextureCube=se,this.rebindTextures=rt,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=de,this.useMultisampledRTT=me,this.dispose=F}function M_(i,e){function t(n,s=ri){let r;const a=ut.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===Rl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Cl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===fu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===pu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===uu)return i.BYTE;if(n===du)return i.SHORT;if(n===ur)return i.UNSIGNED_SHORT;if(n===Al)return i.INT;if(n===li)return i.UNSIGNED_INT;if(n===$n)return i.FLOAT;if(n===Qt)return i.HALF_FLOAT;if(n===mu)return i.ALPHA;if(n===gu)return i.RGB;if(n===Yn)return i.RGBA;if(n===Fi)return i.DEPTH_COMPONENT;if(n===Si)return i.DEPTH_STENCIL;if(n===Pl)return i.RED;if(n===Ll)return i.RED_INTEGER;if(n===es)return i.RG;if(n===Dl)return i.RG_INTEGER;if(n===Il)return i.RGBA_INTEGER;if(n===sa||n===ra||n===aa||n===oa)if(a===St)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===sa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===sa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ra)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===aa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===oa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Uo||n===Oo||n===Fo||n===zo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Uo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Oo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===zo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Bo||n===ko||n===Ho||n===Vo||n===Go||n===ua||n===Wo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Bo||n===ko)return a===St?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ho)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Vo)return r.COMPRESSED_R11_EAC;if(n===Go)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ua)return r.COMPRESSED_RG11_EAC;if(n===Wo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Xo||n===qo||n===$o||n===Yo||n===Zo||n===Ko||n===Jo||n===Qo||n===jo||n===el||n===tl||n===nl||n===il||n===sl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$o)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Yo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Zo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ko)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Jo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jo)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===tl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===il)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rl||n===al||n===ol)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===rl)return a===St?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ll||n===cl||n===da||n===hl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ll)return r.COMPRESSED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===da)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===hl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ji?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const S_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,y_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class b_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Pu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ot({vertexShader:S_,fragmentShader:y_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Be(new wn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class E_ extends zi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const M=typeof XRWebGLBinding<"u",m=new b_,p={},_=t.getContextAttributes();let E=null,x=null;const T=[],y=[],v=new te;let S=null,L=null;const R=new Mn;R.viewport=new Ct;const P=new Mn;P.viewport=new Ct;const D=[R,P],B=new Ip;let I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let oe=T[W];return oe===void 0&&(oe=new ka,T[W]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(W){let oe=T[W];return oe===void 0&&(oe=new ka,T[W]=oe),oe.getGripSpace()},this.getHand=function(W){let oe=T[W];return oe===void 0&&(oe=new ka,T[W]=oe),oe.getHandSpace()};function X(W){const oe=y.indexOf(W.inputSource);if(oe===-1)return;const ye=T[oe];ye!==void 0&&(ye.update(W.inputSource,W.frame,c||a),ye.dispatchEvent({type:W.type,data:W.inputSource}))}function z(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",ee);for(let W=0;W<T.length;W++){const oe=y[W];oe!==null&&(y[W]=null,T[W].disconnect(oe))}I=null,F=null,m.reset();for(const W in p)delete p[W];if(e.setRenderTarget(E),f=null,d=null,u=null,s=null,x=null,re.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(v.width,v.height,!1),L!==null){const W=L.camera;W.fov=L.fov,W.zoom=L.zoom,W.updateProjectionMatrix(),L=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",z),s.addEventListener("inputsourceschange",ee),_.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(v),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,ie=null,se=null;_.depth&&(se=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=_.stencil?Si:Fi,ie=_.stencil?ji:li);const Re={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Re),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new jt(d.textureWidth,d.textureHeight,{format:Yn,type:Sn,depthTexture:new ts(d.textureWidth,d.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const ye={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ye),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new jt(f.framebufferWidth,f.framebufferHeight,{format:Yn,type:Sn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),re.setContext(s),re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(W){for(let oe=0;oe<W.removed.length;oe++){const ye=W.removed[oe],ie=y.indexOf(ye);ie>=0&&(y[ie]=null,T[ie].disconnect(ye))}for(let oe=0;oe<W.added.length;oe++){const ye=W.added[oe];let ie=y.indexOf(ye);if(ie===-1){for(let Re=0;Re<T.length;Re++)if(Re>=y.length){y.push(ye),ie=Re;break}else if(y[Re]===null){y[Re]=ye,ie=Re;break}if(ie===-1)break}const se=T[ie];se&&se.connect(ye)}}function k(W,oe){oe===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(oe.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let oe=W.near,ye=W.far;m.texture!==null&&(m.depthNear>0&&(oe=m.depthNear),m.depthFar>0&&(ye=m.depthFar)),B.near=P.near=R.near=oe,B.far=P.far=R.far=ye,(I!==B.near||F!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),I=B.near,F=B.far),B.layers.mask=W.layers.mask|6,R.layers.mask=B.layers.mask&-5,P.layers.mask=B.layers.mask&-3;const ie=W.parent,se=B.cameras;k(B,ie);for(let Re=0;Re<se.length;Re++)k(se[Re],ie);B.projectionMatrix.copy(R.projectionMatrix),B.projectionMatrixInverse.copy(R.projectionMatrixInverse),L===null&&W.isPerspectiveCamera&&(L={camera:W,fov:W.fov,zoom:W.zoom}),Z(W,B,ie)};function Z(W,oe,ye){ye===null?W.matrix.copy(oe.matrixWorld):(W.matrix.copy(ye.matrixWorld),W.matrix.invert(),W.matrix.multiply(oe.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(oe.projectionMatrix),W.projectionMatrixInverse.copy(oe.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Ps*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(W){l=W,d!==null&&(d.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(W){return p[W]};let Q=null;function xe(W,oe){if(h=oe.getViewerPose(c||a),g=oe,h!==null){const ye=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let ie=!1;ye.length!==B.cameras.length&&(B.cameras.length=0,ie=!0);for(let Pe=0;Pe<ye.length;Pe++){const Fe=ye[Pe];let Ge=null;if(f!==null)Ge=f.getViewport(Fe);else{const he=u.getViewSubImage(d,Fe);Ge=he.viewport,Pe===0&&(e.setRenderTargetTextures(x,he.colorTexture,he.depthStencilTexture),e.setRenderTarget(x))}let J=D[Pe];J===void 0&&(J=new Mn,J.layers.enable(Pe),J.viewport=new Ct,D[Pe]=J),J.matrix.fromArray(Fe.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Fe.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Ge.x,Ge.y,Ge.width,Ge.height),Pe===0&&(B.matrix.copy(J.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),ie===!0&&B.cameras.push(J)}const se=s.enabledFeatures;if(se&&se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const Pe=u.getDepthInformation(ye[0]);Pe&&Pe.isValid&&Pe.texture&&m.init(Pe,s.renderState)}if(se&&se.includes("camera-access")&&M){e.state.unbindTexture(),u=n.getBinding();for(let Pe=0;Pe<ye.length;Pe++){const Fe=ye[Pe].camera;if(Fe){let Ge=p[Fe];Ge||(Ge=new Pu,p[Fe]=Ge);const J=u.getCameraImage(Fe);Ge.sourceTexture=J}}}}for(let ye=0;ye<T.length;ye++){const ie=y[ye],se=T[ye];ie!==null&&se!==void 0&&se.update(ie,oe,c||a)}Q&&Q(W,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),g=null}const re=new Xu;re.setAnimationLoop(xe),this.setAnimationLoop=function(W){Q=W},this.dispose=function(){}}}const w_=new Qe,td=new Je;td.set(-1,0,0,0,1,0,0,0,1);function T_(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Bu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,E,x){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),M(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,_,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===dn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===dn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=e.get(p),E=_.envMap,x=_.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(w_.makeRotationFromEuler(x)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(td),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,_,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,_){m.ior.value=p.ior,p.diffuseRoughness>0&&(m.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===dn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function M(m,p){const _=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function A_(i,e,t,n){let s={},r={};function a(_,E){const x=E.program;n.uniformBlockBinding(_,x,s[_.id])}function o(_,E){let x=s[_.id];x===void 0&&(g(_),x=l(_),s[_.id]=x,_.addEventListener("dispose",m));const T=E.program;n.updateUBOMapping(_,T);const y=e.render.frame;r[_.id]!==y&&(c(_),r[_.id]=y)}function l(_){const E=i.createBuffer(),x=_.__size,T=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,x,T),i.bindBuffer(i.UNIFORM_BUFFER,null),E}function c(_){const E=s[_.id],x=_.uniforms,T=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let y=0,v=x.length;y<v;y++){const S=x[y];if(Array.isArray(S))for(let L=0,R=S.length;L<R;L++)h(S[L],y,L,T);else h(S,y,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(_,E,x,T){if(d(_,E,x,T)===!0){const y=_.__offset,v=_.value;if(Array.isArray(v)){let S=0;for(let L=0;L<v.length;L++){const R=v[L],P=M(R,!0);u(R,_.__data,S),S+=P.storage/Float32Array.BYTES_PER_ELEMENT}}else u(v,_.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,_.__data)}}function u(_,E,x){typeof _=="number"||typeof _=="boolean"?E[x]=_:_.isMatrix3?(E[x]=_.elements[0],E[x+1]=_.elements[1],E[x+2]=_.elements[2],E[x+3]=0,E[x+4]=_.elements[3],E[x+5]=_.elements[4],E[x+6]=_.elements[5],E[x+7]=0,E[x+8]=_.elements[6],E[x+9]=_.elements[7],E[x+10]=_.elements[8],E[x+11]=0):ArrayBuffer.isView(_)?E.set(_.subarray(0,E.length-x),x):_.toArray(E,x)}function d(_,E,x,T){const y=_.value,v=E+"_"+x;if(Array.isArray(y)){T[v]===void 0&&(T[v]=[]);const S=T[v];let L=!1;for(let R=0;R<y.length;R++)f(y[R],S,R)===!0&&(L=!0);return L}return f(y,T,v)}function f(_,E,x){if(E[x]===void 0)return typeof _=="number"||typeof _=="boolean"?E[x]=_:ArrayBuffer.isView(_)?E[x]=_.slice():E[x]=_.clone(),!0;{const T=E[x];if(typeof _=="number"||typeof _=="boolean"){if(T!==_)return E[x]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(T.equals(_)===!1)return T.copy(_),!0}}return!1}function g(_){const E=_.uniforms;let x=0;const T=16;for(let v=0,S=E.length;v<S;v++){const L=Array.isArray(E[v])?E[v]:[E[v]];for(let R=0,P=L.length;R<P;R++){const D=L[R],B=Array.isArray(D.value)?D.value:[D.value],I=Array.isArray(E[v])||Array.isArray(D.value);let F=x;for(let z=0,ee=B.length;z<ee;z++){const k=B[z],Z=M(k,I),Q=x%T,xe=Q%Z.boundary,re=Q+xe;x+=xe,re!==0&&T-re<Z.storage&&(x+=T-re),z===0&&(F=x),x+=Z.storage}const X=D.type==="int"?Int32Array:D.type==="uint"?Uint32Array:Float32Array;D.__data=new X((x-F)/Float32Array.BYTES_PER_ELEMENT),D.__offset=F}}const y=x%T;return y>0&&(x+=T-y),_.__size=x,_.__cache={},this}function M(_,E){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=16,x.storage=48):_.isMatrix4?(x.boundary=16,x.storage=64):_.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(x.boundary=16,x.storage=_.byteLength):qe("WebGLRenderer: Unsupported uniform value type.",_),E===!0&&(x.boundary=16,x.storage=Math.ceil(x.storage/16)*16),x}function m(_){const E=_.target;E.removeEventListener("dispose",m),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);s={},r={}}return{bind:a,update:o,dispose:p}}const R_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Jn=null;function C_(){return Jn===null&&(Jn=new xa(R_,16,16,es,Qt),Jn.name="DFG_LUT",Jn.minFilter=bn,Jn.magFilter=bn,Jn.wrapS=ai,Jn.wrapT=ai,Jn.generateMipmaps=!1,Jn.needsUpdate=!0),Jn}class P_{constructor(e={}){const{canvas:t=sf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Sn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const M=f,m=new Set([Il,Dl,Ll]),p=new Set([Sn,li,ur,ji,Rl,Cl]),_=new Uint32Array(4),E=new Int32Array(4),x={textures:[],min:[],max:[],resolution:[]};let T=null,y=null;const v=[],S=[];let L=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let P=!1,D=null,B=null,I=null,F=null;this._outputColorSpace=cn;let X=0,z=0,ee=null,k=-1,Z=null;const Q=new Ct,xe=new Ct;let re=null;const W=new Ce(0);let oe=0,ye=t.width,ie=t.height,se=1,Re=null,tt=null;const Pe=new Ct(0,0,ye,ie),Fe=new Ct(0,0,ye,ie);let Ge=!1;const J=new pr,he=new Bl;let le=!1,be=!1;const de=new Qe,We=new A,Ne=new Ct,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let rt=!1;function lt(){return ee===null?se:1}let O=n;function Lt(w,U){return t.getContext(w,U)}let je,gt,me,Et,Oe,He,C,b,H,ae,ne,ue,ge,$,K,fe,N,j,Y,_e,pe,ve,ze;try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${wl}`),t.addEventListener("webglcontextlost",ke,!1),t.addEventListener("webglcontextrestored",it,!1),t.addEventListener("webglcontextcreationerror",Ee,!1),O===null){const U="webgl2";if(O=Lt(U,w),O===null)throw Lt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}at()}catch(w){throw t.removeEventListener("webglcontextlost",ke,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Ee,!1),pt("WebGLRenderer: "+w.message),w}function at(){je=new Ig(O),je.init(),pe=new M_(O,je),gt=new yg(O,je,e,pe),me=new __(O,je),gt.reversedDepthBuffer&&d&&me.buffers.depth.setReversed(!0),B=O.createFramebuffer(),I=O.createFramebuffer(),F=O.createFramebuffer(),Et=new Og(O),Oe=new s_,He=new x_(O,je,me,Oe,gt,pe,Et),C=new Dg(R),b=new zp(O),ve=new Mg(O,b),H=new Ng(O,b,Et,ve),ae=new zg(O,H,b,ve,Et),j=new Fg(O,gt,He),K=new bg(Oe),ne=new i_(R,C,je,gt,ve,K),ue=new T_(R,Oe),ge=new a_,$=new d_(je),N=new xg(R,C,me,ae,g,l),fe=new v_(R,ae,gt),ze=new A_(O,Et,gt,me),Y=new Sg(O,je,Et),_e=new Ug(O,je,Et),Et.programs=ne.programs,R.capabilities=gt,R.extensions=je,R.properties=Oe,R.renderLists=ge,R.shadowMap=fe,R.state=me,R.info=Et}M!==Sn&&(L=new kg(M,t.width,t.height,o,s,r));const ce=new E_(R,O);this.xr=ce,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const w=je.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=je.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(w){w!==void 0&&(se=w,this.setSize(ye,ie,!1))},this.getSize=function(w){return w.set(ye,ie)},this.setSize=function(w,U,q=!0){if(ce.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}ye=w,ie=U,t.width=Math.floor(w*se),t.height=Math.floor(U*se),q===!0&&(t.style.width=w+"px",t.style.height=U+"px"),L!==null&&L.setSize(t.width,t.height),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(ye*se,ie*se).floor()},this.setDrawingBufferSize=function(w,U,q){ye=w,ie=U,se=q,t.width=Math.floor(w*q),t.height=Math.floor(U*q),this.setViewport(0,0,w,U)},this.setEffects=function(w){if(M===Sn){pt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let U=0;U<w.length;U++)if(w[U].isOutputPass===!0){qe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(Q)},this.getViewport=function(w){return w.copy(Pe)},this.setViewport=function(w,U,q,V){w.isVector4?Pe.set(w.x,w.y,w.z,w.w):Pe.set(w,U,q,V),me.viewport(Q.copy(Pe).multiplyScalar(lt()).round())},this.getScissor=function(w){return w.copy(Fe)},this.setScissor=function(w,U,q,V){w.isVector4?Fe.set(w.x,w.y,w.z,w.w):Fe.set(w,U,q,V),me.scissor(xe.copy(Fe).multiplyScalar(lt()).round())},this.getScissorTest=function(){return Ge},this.setScissorTest=function(w){me.setScissorTest(Ge=w)},this.setOpaqueSort=function(w){Re=w},this.setTransparentSort=function(w){tt=w},this.getClearColor=function(w){return w.copy(N.getClearColor())},this.setClearColor=function(){N.setClearColor(...arguments)},this.getClearAlpha=function(){return N.getClearAlpha()},this.setClearAlpha=function(){N.setClearAlpha(...arguments)},this.clear=function(w=!0,U=!0,q=!0){let V=0;if(w){let G=!1;if(ee!==null){const Se=ee.texture.format;G=m.has(Se)}if(G){const Se=ee.texture.type,Le=p.has(Se),Me=N.getClearColor(),Te=N.getClearAlpha(),Ue=Me.r,Ze=Me.g,ct=Me.b;Le?(_[0]=Ue,_[1]=Ze,_[2]=ct,_[3]=Te,O.clearBufferuiv(O.COLOR,0,_)):(E[0]=Ue,E[1]=Ze,E[2]=ct,E[3]=Te,O.clearBufferiv(O.COLOR,0,E))}else V|=O.COLOR_BUFFER_BIT}U&&(V|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(V|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&O.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),D=w},this.dispose=function(){t.removeEventListener("webglcontextlost",ke,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Ee,!1),N.dispose(),ge.dispose(),$.dispose(),He.dispose(),Oe.dispose(),C.dispose(),ae.dispose(),H.dispose(),ve.dispose(),ze.dispose(),ne.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",ic),ce.removeEventListener("sessionend",sc),ki.stop()};function ke(w){w.preventDefault(),_c("WebGLRenderer: Context Lost."),P=!0}function it(){_c("WebGLRenderer: Context Restored."),P=!1;const w=Et.autoReset,U=fe.enabled,q=fe.autoUpdate,V=fe.needsUpdate,G=fe.type;at(),Et.autoReset=w,fe.enabled=U,fe.autoUpdate=q,fe.needsUpdate=V,fe.type=G}function Ee(w){pt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Mt(w){const U=w.target;U.removeEventListener("dispose",Mt),Yt(U)}function Yt(w){Ai(w),Oe.remove(w)}function Ai(w){const U=Oe.get(w).programs;U!==void 0&&(U.forEach(function(q){ne.releaseProgram(q)}),w.isShaderMaterial&&ne.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,q,V,G,Se){U===null&&(U=nt);const Le=G.isMesh&&G.matrixWorld.determinantAffine()<0,Me=bd(w,U,q,V,G);me.setMaterial(V,Le);let Te=q.index,Ue=1;if(V.wireframe===!0){if(Te=H.getWireframeAttribute(q),Te===void 0)return;Ue=2}const Ze=q.drawRange,ct=q.attributes.position;let De=Ze.start*Ue,ht=(Ze.start+Ze.count)*Ue;Se!==null&&(De=Math.max(De,Se.start*Ue),ht=Math.min(ht,(Se.start+Se.count)*Ue)),Te!==null?(De=Math.max(De,0),ht=Math.min(ht,Te.count)):ct!=null&&(De=Math.max(De,0),ht=Math.min(ht,ct.count));const zt=ht-De;if(zt<0||zt===1/0)return;ve.setup(G,V,Me,q,Te);let Tt,wt=Y;if(Te!==null&&(Tt=b.get(Te),wt=_e,wt.setIndex(Tt)),G.isMesh)V.wireframe===!0?(me.setLineWidth(V.wireframeLinewidth*lt()),wt.setMode(O.LINES)):wt.setMode(O.TRIANGLES);else if(G.isLine){let rn=V.linewidth;rn===void 0&&(rn=1),me.setLineWidth(rn*lt()),G.isLineSegments?wt.setMode(O.LINES):G.isLineLoop?wt.setMode(O.LINE_LOOP):wt.setMode(O.LINE_STRIP)}else G.isPoints?wt.setMode(O.POINTS):G.isSprite&&wt.setMode(O.TRIANGLES);if(G.isBatchedMesh)if(je.get("WEBGL_multi_draw"))wt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const rn=G._multiDrawStarts,Ie=G._multiDrawCounts,fn=G._multiDrawCount,vt=Te?b.get(Te).bytesPerElement:1,Hi=Oe.get(V).currentProgram.getUniforms();for(let an=0;an<fn;an++)Hi.setValue(O,"_gl_DrawID",an),wt.render(rn[an]/vt,Ie[an])}else if(G.isInstancedMesh)wt.renderInstances(De,zt,G.count);else if(q.isInstancedBufferGeometry){const rn=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Ie=Math.min(q.instanceCount,rn);wt.renderInstances(De,zt,Ie)}else wt.render(De,zt)};function nc(w,U,q,V){D!==null&&w.isNodeMaterial&&D.setObject(V,w),le===!0&&K.setState(w,q,!1),w.transparent===!0&&w.side===_n&&w.forceSinglePass===!1?(w.side=dn,w.needsUpdate=!0,ks(w,U,V),w.side=Qi,w.needsUpdate=!0,ks(w,U,V),w.side=_n):ks(w,U,V)}this.compile=function(w,U,q=null){q===null&&(q=w),D!==null&&D.renderStart(w,U,q),y=$.get(q),y.init(U),S.push(y),q.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(y.pushLight(G),G.castShadow&&y.pushShadow(G))}),w!==q&&w.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(y.pushLight(G),G.castShadow&&y.pushShadow(G))}),y.setupLights(),D!==null&&D.updateLights(y.state.lightsArray),be=this.localClippingEnabled,le=K.init(this.clippingPlanes,be),le===!0&&K.setGlobalState(this.clippingPlanes,U),D!==null&&fe.render(y.state.shadowsArray,q,U);const V=new Set;return w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const Se=G.material;if(Se)if(Array.isArray(Se))for(let Le=0;Le<Se.length;Le++){const Me=Se[Le];nc(Me,q,U,G),V.add(Me)}else nc(Se,q,U,G),V.add(Se)}),y=S.pop(),D!==null&&D.renderEnd(),V},this.compileAsync=function(w,U,q=null){const V=this.compile(w,U,q);return new Promise(G=>{function Se(){if(V.forEach(function(Le){const Te=Oe.get(Le).currentProgram;(Te===void 0||Te.isReady())&&V.delete(Le)}),V.size===0){G(w);return}setTimeout(Se,10)}je.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Ca=null;function Sd(w){Ca&&Ca(w)}function ic(){ki.stop()}function sc(){ki.start()}const ki=new Xu;ki.setAnimationLoop(Sd),typeof self<"u"&&ki.setContext(self),this.setAnimationLoop=function(w){Ca=w,ce.setAnimationLoop(w),w===null?ki.stop():ki.start()},ce.addEventListener("sessionstart",ic),ce.addEventListener("sessionend",sc),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){pt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(w,U);const q=ce.enabled===!0&&ce.isPresenting===!0,V=L!==null&&(ee===null||q)&&L.begin(R,ee);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(U),U=ce.getCamera()),w.isScene===!0&&w.onBeforeRender(R,w,U,ee),y=$.get(w,S.length),y.init(U),y.state.textureUnits=He.getTextureUnits(),S.push(y),de.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?he.setFromArrayCamera(U):J.setFromProjectionMatrix(de,Zn,U.reversedDepth),be=this.localClippingEnabled,le=K.init(this.clippingPlanes,be),T=ge.get(w,v.length),T.init(),v.push(T),this.info.render.frame++,ce.enabled===!0&&ce.isPresenting===!0){const Le=R.xr.getDepthSensingMesh();Le!==null&&Pa(Le,U,-1/0,R.sortObjects)}Pa(w,U,0,R.sortObjects),T.finish(),D!==null&&D.updateLights(y.state.lightsArray),R.sortObjects===!0&&T.sort(Re,tt),rt=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,rt&&N.addToRenderList(T,w),this.info.autoReset===!0&&this.info.reset(),le===!0&&K.beginShadows();const G=y.state.shadowsArray;if(fe.render(G,w,U),le===!0&&K.endShadows(),(V&&L.hasRenderPass())===!1){const Le=T.opaque,Me=T.transmissive;if(y.setupLights(),U.isArrayCamera){const Te=U.cameras;if(Me.length>0)for(let Ue=0,Ze=Te.length;Ue<Ze;Ue++){const ct=Te[Ue];ac(Le,Me,w,ct)}rt&&N.render(w);for(let Ue=0,Ze=Te.length;Ue<Ze;Ue++){const ct=Te[Ue];rc(T,w,ct,ct.viewport)}}else Me.length>0&&ac(Le,Me,w,U),rt&&N.render(w),rc(T,w,U)}ee!==null&&z===0&&(He.updateMultisampleRenderTarget(ee),He.updateRenderTargetMipmap(ee)),V&&L.end(R),w.isScene===!0&&w.onAfterRender(R,w,U),ve.resetDefaultState(),k=-1,Z=null,S.pop(),S.length>0?(y=S[S.length-1],He.setTextureUnits(y.state.textureUnits),le===!0&&K.setGlobalState(R.clippingPlanes,y.state.camera)):y=null,v.pop(),v.length>0?T=v[v.length-1]:T=null,D!==null&&D.renderEnd()};function Pa(w,U,q,V){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)y.pushLight(w),w.castShadow&&y.pushShadow(w);else if(w.isSprite){const Le=U.isArrayCamera?he:J;if(!w.frustumCulled||w.intersectsFrustum(Le)){V&&Ne.setFromMatrixPosition(w.matrixWorld).applyMatrix4(de);const Me=ae.update(w),Te=w.material;Te.visible&&T.push(w,Me,Te,q,Ne.z,null,U)}}else if(w.isMesh||w.isLine||w.isPoints){const Le=U.isArrayCamera?he:J;if(!w.frustumCulled||w.intersectsFrustum(Le)){const Me=ae.update(w),Te=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ne.copy(w.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Ne.copy(Me.boundingSphere.center)),Ne.applyMatrix4(w.matrixWorld).applyMatrix4(de)),Array.isArray(Te)){const Ue=Me.groups;for(let Ze=0,ct=Ue.length;Ze<ct;Ze++){const De=Ue[Ze],ht=Te[De.materialIndex];ht&&ht.visible&&T.push(w,Me,ht,q,Ne.z,De,U)}}else Te.visible&&T.push(w,Me,Te,q,Ne.z,null,U)}}}const Se=w.children;for(let Le=0,Me=Se.length;Le<Me;Le++)Pa(Se[Le],U,q,V)}function rc(w,U,q,V){const{opaque:G,transmissive:Se,transparent:Le}=w;y.setupLightsView(q),le===!0&&K.setGlobalState(R.clippingPlanes,q),V&&me.viewport(Q.copy(V)),G.length>0&&br(G,U,q),Se.length>0&&br(Se,U,q),Le.length>0&&br(Le,U,q),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function ac(w,U,q,V){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[V.id]===void 0){const De=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[V.id]=new jt(1,1,{generateMipmaps:!0,type:De?Qt:Sn,minFilter:Mi,samples:Math.max(4,gt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ut.workingColorSpace})}const Se=y.state.transmissionRenderTarget[V.id],Le=V.viewport||Q;Se.setSize(Le.z*R.transmissionResolutionScale,Le.w*R.transmissionResolutionScale);const Me=R.getRenderTarget(),Te=R.getActiveCubeFace(),Ue=R.getActiveMipmapLevel();R.setRenderTarget(Se),R.getClearColor(W),oe=R.getClearAlpha(),oe<1&&R.setClearColor(16777215,.5),R.clear(),rt&&N.render(q);const Ze=R.toneMapping;R.toneMapping=Ei;const ct=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),y.setupLightsView(V),le===!0&&K.setGlobalState(R.clippingPlanes,V),br(w,q,V),He.updateMultisampleRenderTarget(Se),He.updateRenderTargetMipmap(Se),je.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let ht=0,zt=U.length;ht<zt;ht++){const Tt=U[ht],{object:wt,geometry:rn,material:Ie,group:fn}=Tt;if(Ie.side===_n&&wt.layers.test(V.layers)){const vt=Ie.side;Ie.side=dn,Ie.needsUpdate=!0,oc(wt,q,V,rn,Ie,fn),Ie.side=vt,Ie.needsUpdate=!0,De=!0}}De===!0&&(He.updateMultisampleRenderTarget(Se),He.updateRenderTargetMipmap(Se))}R.setRenderTarget(Me,Te,Ue),R.setClearColor(W,oe),ct!==void 0&&(V.viewport=ct),R.toneMapping=Ze}function br(w,U,q){const V=U.isScene===!0?U.overrideMaterial:null;for(let G=0,Se=w.length;G<Se;G++){const Le=w[G],{object:Me,geometry:Te,group:Ue}=Le;let Ze=Le.material;Ze.allowOverride===!0&&V!==null&&(Ze=V),Me.layers.test(q.layers)&&oc(Me,U,q,Te,Ze,Ue)}}function oc(w,U,q,V,G,Se){D!==null&&G.isNodeMaterial&&D.setObject(w,G),w.onBeforeRender(R,U,q,V,G,Se),w.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(R,U,q,V,w,Se),G.transparent===!0&&G.side===_n&&G.forceSinglePass===!1?(G.side=dn,G.needsUpdate=!0,R.renderBufferDirect(q,U,V,G,w,Se),G.side=Qi,G.needsUpdate=!0,R.renderBufferDirect(q,U,V,G,w,Se),G.side=_n):R.renderBufferDirect(q,U,V,G,w,Se),w.onAfterRender(R,U,q,V,G,Se)}function lc(w){let U=0;for(const q of w)q.texture!==null&&U++;return U}function ks(w,U,q){U.isScene!==!0&&(U=nt);const V=Oe.get(w),G=y.state.lights,Se=y.state.shadowsArray,Le=G.state.version,Me=ne.getParameters(w,G.state,Se,U,q,y.state.lightProbeGridArray),Te=ne.getProgramCacheKey(Me);let Ue=V.programs;V.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?U.environment:null,V.fog=U.fog;const Ze=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;V.envMap=C.get(w.envMap||V.environment,Ze),V.envMapRotation=V.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Ue===void 0&&(w.addEventListener("dispose",Mt),Ue=new Map,V.programs=Ue,V.programVariants=new Map);let ct=Ue.get(Te);if(ct!==void 0){if(V.currentProgram===ct&&V.lightsStateVersion===Le)return hc(w,Me),ct}else Me.uniforms=ne.getUniforms(w),D!==null&&w.isNodeMaterial&&D.build(w,q,Me),w.onBeforeCompile(Me,R),ct=ne.acquireProgram(Me,Te),Ue.set(Te,ct),V.uniforms=Me.uniforms;const De=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(De.clippingPlanes=K.uniform),hc(w,Me),V.needsLights=wd(w),V.lightsStateVersion=Le,V.needsLights&&(De.ambientLightColor.value=G.state.ambient,De.lightProbe.value=G.state.probe,De.sunLights.value=G.state.sun,De.sunLightShadows.value=G.state.sunShadow,De.directionalLights.value=G.state.directional,De.directionalLightShadows.value=G.state.directionalShadow,De.spotLights.value=G.state.spot,De.spotLightShadows.value=G.state.spotShadow,De.rectAreaLights.value=G.state.rectArea,De.ltc_1.value=G.state.rectAreaLTC1,De.ltc_2.value=G.state.rectAreaLTC2,De.pointLights.value=G.state.point,De.pointLightShadows.value=G.state.pointShadow,De.hemisphereLights.value=G.state.hemi,De.sunShadowMatrix.value=G.state.sunShadowMatrix,De.sunShadowCascade.value=G.state.sunShadowCascade,De.directionalShadowMatrix.value=G.state.directionalShadowMatrix,De.spotLightMatrix.value=G.state.spotLightMatrix,De.spotLightMap.value=G.state.spotLightMap,De.pointShadowMatrix.value=G.state.pointShadowMatrix),V.numLightProbeGrids=lc(y.state.lightProbeGridArray),V.currentProgram=ct,V.uniformsList=null,ct}function yd(w,U,q,V,G){const Se=Oe.get(w),Le=Se.currentProgram.id+","+V+","+G;let Me=Se.programVariants.get(Le);return Me===void 0?(Me=ks(w,U,q),Se.programVariants.set(Le,Me)):(Se.currentProgram=Me,Se.uniformsList=null,Se.outputColorSpace=V,Se.toneMapping=G),Me}function cc(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=la.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function hc(w,U){const q=Oe.get(w);q.outputColorSpace=U.outputColorSpace,q.batching=U.batching,q.batchingColor=U.batchingColor,q.instancing=U.instancing,q.instancingColor=U.instancingColor,q.instancingMorph=U.instancingMorph,q.skinning=U.skinning,q.morphTargets=U.morphTargets,q.morphNormals=U.morphNormals,q.morphColors=U.morphColors,q.morphTargetsCount=U.morphTargetsCount,q.numClippingPlanes=U.numClippingPlanes,q.numIntersection=U.numClipIntersection,q.vertexAlphas=U.vertexAlphas,q.vertexTangents=U.vertexTangents,q.toneMapping=U.toneMapping}function bd(w,U,q,V,G){U.isScene!==!0&&(U=nt),He.resetTextureUnits();const Se=U.fog,Le=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?U.environment:null,Me=ee===null?R.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:ut.workingColorSpace,Te=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ue=C.get(V.envMap||Le,Te),Ze=V.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,ct=!!q.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),De=!!q.morphAttributes.position,ht=!!q.morphAttributes.normal,zt=!!q.morphAttributes.color;let Tt=Ei;V.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Tt=R.toneMapping);const wt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,rn=wt!==void 0?wt.length:0,Ie=Oe.get(V),fn=y.state.lights;if(le===!0&&(be===!0||w!==Z)){const It=w===Z&&V.id===k;K.setState(V,w,It)}let vt=!1,Hi=!1;V.version===Ie.__version?Ie.needsLights&&Ie.lightsStateVersion!==fn.state.version||G.isBatchedMesh&&Ie.batching===!1||!G.isBatchedMesh&&Ie.batching===!0||G.isBatchedMesh&&Ie.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Ie.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Ie.instancing===!1||!G.isInstancedMesh&&Ie.instancing===!0||G.isSkinnedMesh&&Ie.skinning===!1||!G.isSkinnedMesh&&Ie.skinning===!0||G.isInstancedMesh&&Ie.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ie.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ie.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ie.instancingMorph===!1&&G.morphTexture!==null||Ie.envMap!==Ue||V.fog===!0&&Ie.fog!==Se||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==K.numPlanes||Ie.numIntersection!==K.numIntersection)||Ie.vertexAlphas!==Ze||Ie.vertexTangents!==ct||Ie.morphTargets!==De||Ie.morphNormals!==ht||Ie.morphColors!==zt||Ie.morphTargetsCount!==rn||Ie.numLightProbeGrids!==lc(y.state.lightProbeGridArray)?vt=!0:(Ie.outputColorSpace!==Me||Ie.toneMapping!==Tt)&&(Hi=!0):(vt=!0,Ie.__version=V.version);let an=Ie.currentProgram;(vt===!0||Hi===!0)&&(an=Hi===!0?yd(V,U,G,Me,Tt):ks(V,U,G),D&&V.isNodeMaterial&&D.onUpdateProgram(V,an,Ie));let Er=!1,Ri=!1,Vi=!1;const ft=an.getUniforms(),en=Ie.uniforms;if(me.useProgram(an.program)&&(Er=!0,Ri=!0,Vi=!0),V.id!==k&&(k=V.id,Ri=!0),Er||Z!==w){me.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),ft.setValue(O,"projectionMatrix",w.projectionMatrix),ft.setValue(O,"viewMatrix",w.matrixWorldInverse);const Zt=ft.map.cameraPosition;Zt!==void 0&&Zt.setValue(O,We.setFromMatrixPosition(w.matrixWorld)),gt.logarithmicDepthBuffer&&ft.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ft.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),Z!==w&&(Z=w,Ri=!0,Vi=!0)}if(Ie.needsLights&&(fn.state.sunShadowMap.length>0&&ft.setValue(O,"sunShadowMap",fn.state.sunShadowMap,He),fn.state.directionalShadowMap.length>0&&ft.setValue(O,"directionalShadowMap",fn.state.directionalShadowMap,He),fn.state.spotShadowMap.length>0&&ft.setValue(O,"spotShadowMap",fn.state.spotShadowMap,He),fn.state.pointShadowMap.length>0&&ft.setValue(O,"pointShadowMap",fn.state.pointShadowMap,He)),G.isSkinnedMesh){ft.setOptional(O,G,"bindMatrix"),ft.setOptional(O,G,"bindMatrixInverse");const It=G.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),ft.setValue(O,"boneTexture",It.boneTexture,He))}G.isBatchedMesh&&(ft.setOptional(O,G,"batchingTexture"),ft.setValue(O,"batchingTexture",G._matricesTexture,He),ft.setOptional(O,G,"batchingIdTexture"),ft.setValue(O,"batchingIdTexture",G._indirectTexture,He),ft.setOptional(O,G,"batchingColorTexture"),G._colorsTexture!==null&&ft.setValue(O,"batchingColorTexture",G._colorsTexture,He));const Hn=q.morphAttributes;if((Hn.position!==void 0||Hn.normal!==void 0||Hn.color!==void 0)&&j.update(G,q,an),(Ri||Ie.receiveShadow!==G.receiveShadow)&&(Ie.receiveShadow=G.receiveShadow,ft.setValue(O,"receiveShadow",G.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&U.environment!==null&&(en.envMapIntensity.value=U.environmentIntensity),en.dfgLUT!==void 0&&(en.dfgLUT.value=C_()),Ri){if(ft.setValue(O,"toneMappingExposure",R.toneMappingExposure),Ie.needsLights&&Ed(en,Vi),Se&&V.fog===!0&&ue.refreshFogUniforms(en,Se),ue.refreshMaterialUniforms(en,V,se,ie,y.state.transmissionRenderTarget[w.id]),Ie.needsLights&&Ie.numLightProbeGrids>0){const It=x;let Zt=0;for(const ui of y.state.lightProbeGridArray)ui.texture!==null&&(It.textures[Zt]=ui.texture,It.min[Zt]=ui.boundingBox.min,It.max[Zt]=ui.boundingBox.max,It.resolution[Zt]=ui.resolution,Zt++);for(const ui in It)It[ui].length=Zt;en.probesSH.value=It.textures,en.probesMin.value=It.min,en.probesMax.value=It.max,en.probesResolution.value=It.resolution}la.upload(O,cc(Ie),en,He)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(la.upload(O,cc(Ie),en,He),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ft.setValue(O,"center",G.center),ft.setValue(O,"modelViewMatrix",G.modelViewMatrix),ft.setValue(O,"normalMatrix",G.normalMatrix),ft.setValue(O,"modelMatrix",G.matrixWorld),V.uniformsGroups!==void 0){const It=V.uniformsGroups;for(let Zt=0,ui=It.length;Zt<ui;Zt++){const dc=It[Zt];ze.update(dc,an),ze.bind(dc,an)}}return an}function Ed(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.sunLights.needsUpdate=U,w.sunLightShadows.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function wd(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return ee},this.setRenderTargetTextures=function(w,U,q){const V=Oe.get(w);V.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),Oe.get(w.texture).__webglTexture=U,Oe.get(w.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:q,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,U){const q=Oe.get(w);q.__webglFramebuffer=U,q.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,q=0){ee=w,X=U,z=q;let V=null,G=!1,Se=!1;if(w){const Me=Oe.get(w);if(Me.__useDefaultFramebuffer!==void 0){me.bindFramebuffer(O.FRAMEBUFFER,Me.__webglFramebuffer),Q.copy(w.viewport),xe.copy(w.scissor),re=w.scissorTest,me.viewport(Q),me.scissor(xe),me.setScissorTest(re),k=-1;return}else if(Me.__webglFramebuffer===void 0)He.setupRenderTarget(w);else if(Me.__hasExternalTextures)He.rebindTextures(w,Oe.get(w.texture).__webglTexture,Oe.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ze=w.depthTexture;if(Me.__boundDepthTexture!==Ze){if(Ze!==null&&Oe.has(Ze)&&(w.width!==Ze.image.width||w.height!==Ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");He.setupDepthRenderbuffer(w)}}const Te=w.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(Se=!0);const Ue=Oe.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ue[U])?V=Ue[U][q]:V=Ue[U],G=!0):w.samples>0&&He.useMultisampledRTT(w)===!1?V=Oe.get(w).__webglMultisampledFramebuffer:Array.isArray(Ue)?V=Ue[q]:V=Ue,Q.copy(w.viewport),xe.copy(w.scissor),re=w.scissorTest}else Q.copy(Pe).multiplyScalar(se).floor(),xe.copy(Fe).multiplyScalar(se).floor(),re=Ge;if(q!==0&&(V=B),me.bindFramebuffer(O.FRAMEBUFFER,V)&&me.drawBuffers(w,V),me.viewport(Q),me.scissor(xe),me.setScissorTest(re),G){const Me=Oe.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,Me.__webglTexture,q)}else if(Se){const Me=U;for(let Te=0;Te<w.textures.length;Te++){const Ue=Oe.get(w.textures[Te]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Te,Ue.__webglTexture,q,Me)}}else if(w!==null&&q!==0){const Me=Oe.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Me.__webglTexture,q)}k=-1};function uc(w){const U=Oe.get(w);return(U.__readFormat!==w.format||U.__readType!==w.type)&&(U.__readFormat=w.format,U.__readType=w.type,U.__formatReadable=gt.textureFormatReadable(w.format),U.__typeReadable=gt.textureTypeReadable(w.type)),U}this.readRenderTargetPixels=function(w,U,q,V,G,Se,Le,Me=0){if(!(w&&w.isWebGLRenderTarget)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Oe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Le!==void 0&&(Te=Te[Le],Array.isArray(Te)&&(Te=Te[0])),Te){me.bindFramebuffer(O.FRAMEBUFFER,Te);try{const Ue=w.textures[Me],Ze=Ue.format,ct=Ue.type;w.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Me);const De=uc(Ue);if(De.__formatReadable===!1){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(De.__typeReadable===!1){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-V&&q>=0&&q<=w.height-G&&O.readPixels(U,q,V,G,pe.convert(Ze),pe.convert(ct),Se)}finally{const Ue=ee!==null?Oe.get(ee).__webglFramebuffer:null;me.bindFramebuffer(O.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(w,U,q,V,G,Se,Le,Me=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=Oe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Le!==void 0&&(Te=Te[Le],Array.isArray(Te)&&(Te=Te[0])),Te)if(U>=0&&U<=w.width-V&&q>=0&&q<=w.height-G){me.bindFramebuffer(O.FRAMEBUFFER,Te);const Ue=w.textures[Me],Ze=Ue.format,ct=Ue.type;w.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Me);const De=uc(Ue);if(De.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(De.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ht=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,ht),O.bufferData(O.PIXEL_PACK_BUFFER,Se.byteLength,O.STREAM_READ),O.readPixels(U,q,V,G,pe.convert(Ze),pe.convert(ct),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const zt=ee!==null?Oe.get(ee).__webglFramebuffer:null;me.bindFramebuffer(O.FRAMEBUFFER,zt);const Tt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await rf(O,Tt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,ht),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Se),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(ht),O.deleteSync(Tt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,U=null,q=0){const V=Math.pow(2,-q),G=Math.floor(w.image.width*V),Se=Math.floor(w.image.height*V),Le=U!==null?U.x:0,Me=U!==null?U.y:0;He.setTexture2D(w,0),O.copyTexSubImage2D(O.TEXTURE_2D,q,0,0,Le,Me,G,Se),me.unbindTexture()},this.copyTextureToTexture=function(w,U,q=null,V=null,G=0,Se=0){let Le,Me,Te,Ue,Ze,ct,De,ht,zt;const Tt=w.isCompressedTexture?w.mipmaps[Se]:w.image;if(q!==null)Le=q.max.x-q.min.x,Me=q.max.y-q.min.y,Te=q.isBox3?q.max.z-q.min.z:1,Ue=q.min.x,Ze=q.min.y,ct=q.isBox3?q.min.z:0;else{const ft=Math.pow(2,-G);Le=Math.floor(Tt.width*ft),Me=Math.floor(Tt.height*ft),w.isDataArrayTexture?Te=Tt.depth:w.isData3DTexture?Te=Math.floor(Tt.depth*ft):Te=1,Ue=0,Ze=0,ct=0}V!==null?(De=V.x,ht=V.y,zt=V.z):(De=0,ht=0,zt=0);const wt=pe.convert(U.format),rn=pe.convert(U.type);let Ie;U.isData3DTexture?(He.setTexture3D(U,0),Ie=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(He.setTexture2DArray(U,0),Ie=O.TEXTURE_2D_ARRAY):(He.setTexture2D(U,0),Ie=O.TEXTURE_2D),me.activeTexture(O.TEXTURE0),me.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),me.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),me.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const fn=me.getParameter(O.UNPACK_ROW_LENGTH),vt=me.getParameter(O.UNPACK_IMAGE_HEIGHT),Hi=me.getParameter(O.UNPACK_SKIP_PIXELS),an=me.getParameter(O.UNPACK_SKIP_ROWS),Er=me.getParameter(O.UNPACK_SKIP_IMAGES);me.pixelStorei(O.UNPACK_ROW_LENGTH,Tt.width),me.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Tt.height),me.pixelStorei(O.UNPACK_SKIP_PIXELS,Ue),me.pixelStorei(O.UNPACK_SKIP_ROWS,Ze),me.pixelStorei(O.UNPACK_SKIP_IMAGES,ct);const Ri=w.isDataArrayTexture||w.isData3DTexture,Vi=U.isDataArrayTexture||U.isData3DTexture;if(w.isDepthTexture){const ft=Oe.get(w),en=Oe.get(U),Hn=Oe.get(ft.__renderTarget),It=Oe.get(en.__renderTarget);me.bindFramebuffer(O.READ_FRAMEBUFFER,Hn.__webglFramebuffer),me.bindFramebuffer(O.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let Zt=0;Zt<Te;Zt++)Ri&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Oe.get(w).__webglTexture,G,ct+Zt),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Oe.get(U).__webglTexture,Se,zt+Zt)),O.blitFramebuffer(Ue,Ze,Ue+Le,Ze+Me,De,ht,De+Le,ht+Me,O.DEPTH_BUFFER_BIT,O.NEAREST);me.bindFramebuffer(O.READ_FRAMEBUFFER,null),me.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(G!==0||w.isRenderTargetTexture||Oe.has(w)){const ft=Oe.get(w),en=Oe.get(U);me.bindFramebuffer(O.READ_FRAMEBUFFER,I),me.bindFramebuffer(O.DRAW_FRAMEBUFFER,F);for(let Hn=0;Hn<Te;Hn++)Ri?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ft.__webglTexture,G,ct+Hn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ft.__webglTexture,G),Vi?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,en.__webglTexture,Se,zt+Hn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,en.__webglTexture,Se),G!==0?O.blitFramebuffer(Ue,Ze,Ue+Le,Ze+Me,De,ht,De+Le,ht+Me,O.COLOR_BUFFER_BIT,O.NEAREST):Vi?O.copyTexSubImage3D(Ie,Se,De,ht,zt+Hn,Ue,Ze,Le,Me):O.copyTexSubImage2D(Ie,Se,De,ht,Ue,Ze,Le,Me);me.bindFramebuffer(O.READ_FRAMEBUFFER,null),me.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Vi?w.isDataTexture||w.isData3DTexture?O.texSubImage3D(Ie,Se,De,ht,zt,Le,Me,Te,wt,rn,Tt.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Ie,Se,De,ht,zt,Le,Me,Te,wt,Tt.data):O.texSubImage3D(Ie,Se,De,ht,zt,Le,Me,Te,wt,rn,Tt):w.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Se,De,ht,Le,Me,wt,rn,Tt.data):w.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Se,De,ht,Tt.width,Tt.height,wt,Tt.data):O.texSubImage2D(O.TEXTURE_2D,Se,De,ht,Le,Me,wt,rn,Tt);me.pixelStorei(O.UNPACK_ROW_LENGTH,fn),me.pixelStorei(O.UNPACK_IMAGE_HEIGHT,vt),me.pixelStorei(O.UNPACK_SKIP_PIXELS,Hi),me.pixelStorei(O.UNPACK_SKIP_ROWS,an),me.pixelStorei(O.UNPACK_SKIP_IMAGES,Er),Se===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&O.generateMipmap(Ie),me.unbindTexture()},this.initRenderTarget=function(w){Oe.get(w).__webglFramebuffer===void 0&&He.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?He.setTextureCube(w,0):w.isData3DTexture?He.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?He.setTexture2DArray(w,0):He.setTexture2D(w,0),me.unbindTexture()},this.resetState=function(){X=0,z=0,ee=null,me.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ut._getDrawingBufferColorSpace(e),t.unpackColorSpace=ut._getUnpackColorSpace()}}const wh={type:"change"},Kl={type:"start"},nd={type:"end"},Qr=new _a,Th=new ti,L_=Math.cos(70*tn.DEG2RAD),Vt=new A,xn=2*Math.PI,_t={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},oo=1e-6;class D_ extends Op{constructor(e,t=null){super(e,t),this.state=_t.NONE,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Es.ROTATE,MIDDLE:Es.DOLLY,RIGHT:Es.PAN},this.touches={ONE:ys.ROTATE,TWO:ys.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new nn,this._lastTargetPosition=new A,this._quat=new nn().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new nh,this._sphericalDelta=new nh,this._scale=1,this._panOffset=new A,this._rotateStart=new te,this._rotateEnd=new te,this._rotateDelta=new te,this._panStart=new te,this._panEnd=new te,this._panDelta=new te,this._dollyStart=new te,this._dollyEnd=new te,this._dollyDelta=new te,this._dollyDirection=new A,this._mouse=new te,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=N_.bind(this),this._onPointerDown=I_.bind(this),this._onPointerUp=U_.bind(this),this._onContextMenu=V_.bind(this),this._onMouseWheel=z_.bind(this),this._onKeyDown=B_.bind(this),this._onTouchStart=k_.bind(this),this._onTouchMove=H_.bind(this),this._onMouseDown=O_.bind(this),this._onMouseMove=F_.bind(this),this._interceptControlDown=G_.bind(this),this._interceptControlUp=W_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=_t.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(wh),this.update(),this.state=_t.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Vt.copy(t).sub(this.target),Vt.applyQuaternion(this._quat),this._spherical.setFromVector3(Vt),this.autoRotate&&this.state===_t.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=xn:n>Math.PI&&(n-=xn),s<-Math.PI?s+=xn:s>Math.PI&&(s-=xn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Vt.setFromSpherical(this._spherical),Vt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Vt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Vt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new A(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new A(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Vt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Qr.origin.copy(this.object.position),Qr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Qr.direction))<L_?this.object.lookAt(this.target):(Th.setFromNormalAndCoplanarPoint(this.object.up,this.target),Qr.intersectPlane(Th,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>oo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>oo||this._lastTargetPosition.distanceToSquared(this.target)>oo?(this.dispatchEvent(wh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?xn/60*this.autoRotateSpeed*e:xn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Vt.setFromMatrixColumn(t,0),Vt.multiplyScalar(-e),this._panOffset.add(Vt)}_panUp(e,t){this.screenSpacePanning===!0?Vt.setFromMatrixColumn(t,1):(Vt.setFromMatrixColumn(t,0),Vt.crossVectors(this.object.up,Vt)),Vt.multiplyScalar(e),this._panOffset.add(Vt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Vt.copy(s).sub(this.target);let r=Vt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new te,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function I_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function N_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function U_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(nd),this.state=_t.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function O_(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Es.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=_t.DOLLY;break;case Es.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=_t.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=_t.ROTATE}break;case Es.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=_t.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=_t.PAN}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(Kl)}function F_(i){switch(this.state){case _t.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case _t.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case _t.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function z_(i){this.enabled===!1||this.enableZoom===!1||this.state!==_t.NONE||(i.preventDefault(),this.dispatchEvent(Kl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(nd))}function B_(i){this.enabled!==!1&&this._handleKeyDown(i)}function k_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ys.ROTATE:if(this.enableRotate===!1){this.state=_t.NONE;break}this._handleTouchStartRotate(i),this.state=_t.TOUCH_ROTATE;break;case ys.PAN:if(this.enablePan===!1){this.state=_t.NONE;break}this._handleTouchStartPan(i),this.state=_t.TOUCH_PAN;break;default:this.state=_t.NONE}break;case 2:switch(this.touches.TWO){case ys.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=_t.TOUCH_DOLLY_PAN;break;case ys.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=_t.TOUCH_DOLLY_ROTATE;break;default:this.state=_t.NONE}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(Kl)}function H_(i){switch(this._trackPointer(i),this.state){case _t.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case _t.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case _t.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case _t.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=_t.NONE}}function V_(i){this.enabled!==!1&&i.preventDefault()}function G_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function W_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Zi={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class os{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const X_=new Yl(-1,1,1,-1,0,1);class q_ extends Ut{constructor(){super(),this.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ye([0,2,0,0,2,0],2))}}const $_=new q_;class wa{constructor(e){this._mesh=new Be($_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,X_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Y_ extends os{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ot?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=_i.clone(e.uniforms),this.material=new Ot({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new wa(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Ah extends os{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Z_ extends os{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class K_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new te);this._width=n.width,this._height=n.height,t=new jt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Y_(Zi),this.copyPass.material.blending=vn,this.timer=new Wu}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Ah!==void 0&&(a instanceof Ah?n=!0:a instanceof Z_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class J_ extends os{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ce}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const jr={defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new te},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Qe},cameraProjectionMatrixInverse:{value:new Qe},cameraWorldMatrix:{value:new Qe},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new A(-1,-1,-1)},sceneBoxMax:{value:new A(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				#if PERSPECTIVE_CAMERA == 1
					vec3 viewDir = normalize(-viewPos.xyz);
				#else
					vec3 viewDir = vec3(0., 0., 1.);
				#endif
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},ea={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},lo={uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function Q_(i=5){const e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=j_(e),n=t.length,s=new Uint8Array(n*4);for(let a=0;a<n;++a){const o=t[a],l=2*Math.PI*o/n,c=new A(Math.cos(l),Math.sin(l),0).normalize();s[a*4]=(c.x*.5+.5)*255,s[a*4+1]=(c.y*.5+.5)*255,s[a*4+2]=127,s[a*4+3]=255}const r=new xa(s,e,e);return r.wrapS=Oi,r.wrapT=Oi,r.needsUpdate=!0,r}function j_(i){const e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0);let s=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=a++;r++,s--}return n}const ta={defines:{SAMPLES:16,SAMPLE_VECTORS:id(16,2,1),NORMAL_VECTOR_TYPE:1},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new te},cameraProjectionMatrixInverse:{value:new Qe},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function id(i,e,t){const n=ex(i,e,t);let s="vec3[SAMPLES](";for(let r=0;r<i;r++){const a=n[r];s+=`vec3(${a.x}, ${a.y}, ${a.z})${r<i-1?",":")"}`}return s}function ex(i,e,t){const n=[];for(let s=0;s<i;s++){const r=2*Math.PI*e*s/i,a=Math.pow(s/(i-1),t);n.push(new A(Math.cos(r),Math.sin(r),a))}return n}class tx{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,g=e-d,M=t-f;let m,p;g>M?(m=1,p=0):(m=0,p=1);const _=g-m+h,E=M-p+h,x=g-1+2*h,T=M-1+2*h,y=l&255,v=c&255,S=this.perm[y+this.perm[v]]%12,L=this.perm[y+m+this.perm[v+p]]%12,R=this.perm[y+1+this.perm[v+1]]%12;let P=.5-g*g-M*M;P<0?n=0:(P*=P,n=P*P*this._dot(this.grad3[S],g,M));let D=.5-_*_-E*E;D<0?s=0:(D*=D,s=D*D*this._dot(this.grad3[L],_,E));let B=.5-x*x-T*T;return B<0?r=0:(B*=B,r=B*B*this._dot(this.grad3[R],x,T)),70*(n+s+r)}noise3d(e,t,n){let s,r,a,o;const c=(e+t+n)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),d=Math.floor(n+c),f=1/6,g=(h+u+d)*f,M=h-g,m=u-g,p=d-g,_=e-M,E=t-m,x=n-p;let T,y,v,S,L,R;_>=E?E>=x?(T=1,y=0,v=0,S=1,L=1,R=0):_>=x?(T=1,y=0,v=0,S=1,L=0,R=1):(T=0,y=0,v=1,S=1,L=0,R=1):E<x?(T=0,y=0,v=1,S=0,L=1,R=1):_<x?(T=0,y=1,v=0,S=0,L=1,R=1):(T=0,y=1,v=0,S=1,L=1,R=0);const P=_-T+f,D=E-y+f,B=x-v+f,I=_-S+2*f,F=E-L+2*f,X=x-R+2*f,z=_-1+3*f,ee=E-1+3*f,k=x-1+3*f,Z=h&255,Q=u&255,xe=d&255,re=this.perm[Z+this.perm[Q+this.perm[xe]]]%12,W=this.perm[Z+T+this.perm[Q+y+this.perm[xe+v]]]%12,oe=this.perm[Z+S+this.perm[Q+L+this.perm[xe+R]]]%12,ye=this.perm[Z+1+this.perm[Q+1+this.perm[xe+1]]]%12;let ie=.6-_*_-E*E-x*x;ie<0?s=0:(ie*=ie,s=ie*ie*this._dot3(this.grad3[re],_,E,x));let se=.6-P*P-D*D-B*B;se<0?r=0:(se*=se,r=se*se*this._dot3(this.grad3[W],P,D,B));let Re=.6-I*I-F*F-X*X;Re<0?a=0:(Re*=Re,a=Re*Re*this._dot3(this.grad3[oe],I,F,X));let tt=.6-z*z-ee*ee-k*k;return tt<0?o=0:(tt*=tt,o=tt*tt*this._dot3(this.grad3[ye],z,ee,k)),32*(s+r+a+o)}noise4d(e,t,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,u,d,f,g;const M=(e+t+n+s)*l,m=Math.floor(e+M),p=Math.floor(t+M),_=Math.floor(n+M),E=Math.floor(s+M),x=(m+p+_+E)*c,T=m-x,y=p-x,v=_-x,S=E-x,L=e-T,R=t-y,P=n-v,D=s-S,B=L>R?32:0,I=L>P?16:0,F=R>P?8:0,X=L>D?4:0,z=R>D?2:0,ee=P>D?1:0,k=B+I+F+X+z+ee,Z=a[k][0]>=3?1:0,Q=a[k][1]>=3?1:0,xe=a[k][2]>=3?1:0,re=a[k][3]>=3?1:0,W=a[k][0]>=2?1:0,oe=a[k][1]>=2?1:0,ye=a[k][2]>=2?1:0,ie=a[k][3]>=2?1:0,se=a[k][0]>=1?1:0,Re=a[k][1]>=1?1:0,tt=a[k][2]>=1?1:0,Pe=a[k][3]>=1?1:0,Fe=L-Z+c,Ge=R-Q+c,J=P-xe+c,he=D-re+c,le=L-W+2*c,be=R-oe+2*c,de=P-ye+2*c,We=D-ie+2*c,Ne=L-se+3*c,nt=R-Re+3*c,rt=P-tt+3*c,lt=D-Pe+3*c,O=L-1+4*c,Lt=R-1+4*c,je=P-1+4*c,gt=D-1+4*c,me=m&255,Et=p&255,Oe=_&255,He=E&255,C=o[me+o[Et+o[Oe+o[He]]]]%32,b=o[me+Z+o[Et+Q+o[Oe+xe+o[He+re]]]]%32,H=o[me+W+o[Et+oe+o[Oe+ye+o[He+ie]]]]%32,ae=o[me+se+o[Et+Re+o[Oe+tt+o[He+Pe]]]]%32,ne=o[me+1+o[Et+1+o[Oe+1+o[He+1]]]]%32;let ue=.6-L*L-R*R-P*P-D*D;ue<0?h=0:(ue*=ue,h=ue*ue*this._dot4(r[C],L,R,P,D));let ge=.6-Fe*Fe-Ge*Ge-J*J-he*he;ge<0?u=0:(ge*=ge,u=ge*ge*this._dot4(r[b],Fe,Ge,J,he));let $=.6-le*le-be*be-de*de-We*We;$<0?d=0:($*=$,d=$*$*this._dot4(r[H],le,be,de,We));let K=.6-Ne*Ne-nt*nt-rt*rt-lt*lt;K<0?f=0:(K*=K,f=K*K*this._dot4(r[ae],Ne,nt,rt,lt));let fe=.6-O*O-Lt*Lt-je*je-gt*gt;return fe<0?g=0:(fe*=fe,g=fe*fe*this._dot4(r[ne],O,Lt,je,gt)),27*(h+u+d+f+g)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}_dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}}class jn extends os{constructor(e,t,n=512,s=512,r,a,o){super(),this.width=n,this.height=s,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Q_(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new jt(this.width,this.height,{type:Qt,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Ot({defines:Object.assign({},jr.defines),uniforms:_i.clone(jr.uniforms),vertexShader:jr.vertexShader,fragmentShader:jr.fragmentShader,blending:vn,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Rp,this.normalMaterial.blending=vn,this.pdMaterial=new Ot({defines:Object.assign({},ta.defines),uniforms:_i.clone(ta.uniforms),vertexShader:ta.vertexShader,fragmentShader:ta.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Ot({defines:Object.assign({},ea.defines),uniforms:_i.clone(ea.uniforms),vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader,blending:vn}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Ot({uniforms:_i.clone(Zi.uniforms),vertexShader:Zi.vertexShader,fragmentShader:Zi.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:To,blendDst:Qs,blendEquation:si,blendSrcAlpha:wo,blendDstAlpha:Qs,blendEquationAlpha:si}),this.blendMaterial=new Ot({uniforms:_i.clone(lo.uniforms),vertexShader:lo.vertexShader,fragmentShader:lo.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:eu,blendSrc:To,blendDst:Qs,blendEquation:si,blendSrcAlpha:wo,blendDstAlpha:Qs,blendEquationAlpha:si}),this._fsQuad=new wa(null),this._originalClearColor=new Ce,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget&&this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget&&this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){if(e!==void 0)this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1;else{if(this.normalRenderTarget===void 0){const s=new ts;s.format=Si,s.type=ji,this.normalRenderTarget=new jt(this.width,this.height,{minFilter:Wt,magFilter:Wt,type:Qt,depthTexture:s})}this.depthTexture=this.normalRenderTarget.depthTexture,this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0}const n=this.normalTexture?1:0;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.needsUpdate=!0,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.needsUpdate=!0,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=id(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case jn.OUTPUT.Off:break;case jn.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=vn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case jn.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=vn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case jn.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=vn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case jn.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case jn.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalTexture||null,this.copyMaterial.blending=vn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case jn.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=vn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,n,s,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,s,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,t.push(n))})}_restoreVisibility(){const e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){const t=new tx,n=e*e*4,s=new Uint8Array(n);for(let a=0;a<e;a++)for(let o=0;o<e;o++){const l=a,c=o;s[(a*e+o)*4]=(t.noise(l,c)*.5+.5)*255,s[(a*e+o)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(a*e+o)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(a*e+o)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}const r=new xa(s,e,e,Yn,Sn);return r.wrapS=Oi,r.wrapT=Oi,r.needsUpdate=!0,r}}jn.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};const nx={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ce(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ns extends os{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new te(e.x,e.y):new te(256,256),this.clearColor=new Ce(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new jt(r,a,{type:Qt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new jt(r,a,{type:Qt,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new jt(r,a,{type:Qt,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}const o=nx;this.highPassUniforms=_i.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ot({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new te(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new A(1,1,1),new A(1,1,1),new A(1,1,1),new A(1,1,1),new A(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=_i.clone(Zi.uniforms),this.blendMaterial=new Ot({uniforms:this.copyUniforms,vertexShader:Zi.vertexShader,fragmentShader:Zi.fragmentShader,premultipliedAlpha:!0,blending:Rs,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ce,this._oldClearAlpha=1,this._basic=new Xn,this._fsQuad=new wa(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ns.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ns.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);const s=[],r=[];for(let a=1;a<e;a+=2){const o=t[a],l=a+1<e?t[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new Ot({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new te(.5,.5)},direction:{value:new te(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Ot({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}Ns.BlurDirectionX=new te(1,0);Ns.BlurDirectionY=new te(0,1);const Rh="gl_FragColor = vec4( outgoingLight, diffuseColor.a );";Ke.opaque_fragment.includes(Rh)&&(Ke.opaque_fragment=Ke.opaque_fragment.replace(Rh,["vec3 safeLight = clamp( outgoingLight, vec3( 0.0 ), vec3( 256.0 ) );","if ( any( isnan( outgoingLight ) ) || any( isinf( outgoingLight ) ) ) safeLight = vec3( 0.0 );","gl_FragColor = vec4( safeLight, diffuseColor.a );"].join(`
`)));function ix(){try{const i=document.createElement("canvas"),e=i.getContext("webgl2")||i.getContext("webgl");if(!e)return"baixa";const t=e.getExtension("WEBGL_debug_renderer_info"),n=String(e.getParameter(t?t.UNMASKED_RENDERER_WEBGL:e.RENDERER)||"");return e.getExtension("WEBGL_lose_context")?.loseContext(),/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(n)?"baixa":/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||Math.min(screen.width,screen.height)<700||/Intel|UHD|Iris|Mali|Adreno|PowerVR|Apple GPU/i.test(n)&&!/Arc/i.test(n)?"media":"alta"}catch{return"media"}}class sx extends jn{setSize(e,t){super.setSize(Math.max(1,Math.round(e/2)),Math.max(1,Math.round(t/2)))}_overrideVisibility(){const e=this,t=e._visibilityCache;e.scene.traverse(n=>{const s=n;n.visible&&(s.isPoints||s.isLine||n.userData.noAO)&&(n.visible=!1,t.push(n))})}}class rx extends os{uniforms={tDiffuse:{value:null},toneMappingExposure:{value:1},uTime:{value:0},uRes:{value:new te(1,1)},uVignette:{value:.38},uGrain:{value:.03},uCA:{value:.0022},uSat:{value:1.05},uContrast:{value:1.04},uLift:{value:new A(0,0,0)},uGain:{value:new A(1,1,1)}};material;quad;constructor(e){super(),this.material=new ku({uniforms:this.uniforms,defines:e?{USE_CA:""}:{},vertexShader:`
        precision highp float;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        attribute vec3 position; attribute vec2 uv; varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,fragmentShader:`
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform float uTime, uVignette, uGrain, uCA, uSat, uContrast;
        uniform vec2 uRes;
        uniform vec3 uLift, uGain;
        varying vec2 vUv;
        #include <tonemapping_pars_fragment>
        #include <colorspace_pars_fragment>
        float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
        void main(){
          vec2 d = vUv - 0.5;
          #ifdef USE_CA
            vec2 off = d * uCA * (0.4 + dot(d, d) * 3.0);
            vec3 hdr = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
          #else
            vec3 hdr = texture2D(tDiffuse, vUv).rgb;
          #endif
          if (any(isnan(hdr)) || any(isinf(hdr))) hdr = vec3(0.0);
          vec3 col = ACESFilmicToneMapping(hdr);
          col = sRGBTransferOETF(vec4(col, 1.0)).rgb;
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          col = mix(vec3(l), col, uSat);
          col = (col - 0.5) * uContrast + 0.5;
          col = col * uGain + uLift * (1.0 - col);
          float vig = smoothstep(0.95, 0.25, length(d * vec2(1.0, 0.85)) * 1.25);
          col *= mix(1.0, vig, uVignette);
          float g = rand(vUv * uRes + fract(uTime * 7.31) * 91.7) - 0.5;
          col += g * uGrain * (1.0 - l * 0.6);
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }
      `}),this.quad=new wa(this.material)}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,e.setRenderTarget(this.renderToScreen?null:t),this.quad.render(e)}dispose(){this.material.dispose(),this.quad.dispose()}}const ax={alta:36e5,media:115e4,baixa:55e4};class ox{renderer;scene=new ul;camera;controls;composer;bloom;grade;gtao=null;quality;aniso;texSize;dynamicShadows;container;updates=[];frame=0;clock=new Wu;elapsed=0;running=!1;visible=!0;io;ro;pixelRatio=1;resScale=1;frameAvg=1/60;settle=0;tween=null;raycaster=new Up;ndc=new te;resizeHooks=[];onContextLost=null;onContextRestored=null;onLost=e=>{e.preventDefault(),this.contextLost=!0,this.onContextLost?.()};onRestored=()=>{this.contextLost=!1,this.renderer.shadowMap.needsUpdate=!0,this.onContextRestored?.()};contextLost=!1;paused=!1;tweenDuration=.6;onVis=()=>{document.hidden||this.clock.update()};constructor(e,t){this.container=e,this.quality=t.quality,this.dynamicShadows=!1;const n=Math.max(1,e.clientWidth),s=Math.max(1,e.clientHeight);this.renderer=new P_({antialias:!1,powerPreference:"high-performance",stencil:!1}),this.pixelRatio=this.targetPixelRatio(n,s),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(n,s),this.renderer.outputColorSpace=cn,this.renderer.toneMapping=Tl,this.renderer.toneMappingExposure=t.exposure??1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=tr,this.renderer.shadowMap.autoUpdate=this.dynamicShadows,this.renderer.shadowMap.needsUpdate=!0,this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.touchAction="none",e.appendChild(this.renderer.domElement),this.renderer.domElement.addEventListener("webglcontextlost",this.onLost),this.renderer.domElement.addEventListener("webglcontextrestored",this.onRestored),this.aniso=Math.min(this.renderer.capabilities.getMaxAnisotropy(),t.quality==="baixa"?2:t.quality==="media"?4:8),this.texSize=t.quality==="alta"?1024:512,this.camera=new Mn(t.fov??45,n/s,t.near??.05,t.far??200),this.controls=new D_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.06,this.controls.rotateSpeed=.55,this.controls.zoomSpeed=.7,this.controls.addEventListener("start",()=>{this.tween=null});const r=new jt(n*this.pixelRatio,s*this.pixelRatio,{type:Qt,samples:t.quality==="alta"?4:t.quality==="media"?2:0});if(this.composer=new K_(this.renderer,r),this.composer.setPixelRatio(this.pixelRatio),this.composer.setSize(n,s),this.composer.addPass(new J_(this.scene,this.camera)),t.quality==="alta"&&t.ao){const l=new sx(this.scene,this.camera,n,s);l.updateGtaoMaterial({radius:t.ao.radius,distanceExponent:1.4,thickness:1,scale:1,samples:16,distanceFallOff:1,screenSpaceRadius:!1}),l.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:16}),l.blendIntensity=t.ao.intensity??1,this.composer.addPass(l),this.gtao=l}const a=t.bloom??{strength:.6,radius:.6,threshold:.85};this.bloom=new Ns(new te(n,s),a.strength,a.radius,a.threshold);const o=this.bloom.materialHighPassFilter;o.fragmentShader=o.fragmentShader.replace("vec4 texel = texture2D( tDiffuse, vUv );",["vec4 texel = texture2D( tDiffuse, vUv );","if ( any( isnan( texel ) ) || any( isinf( texel ) ) ) texel = vec4( 0.0 );"].join(`
`)),o.needsUpdate=!0,this.composer.addPass(this.bloom),this.grade=new rx(t.quality==="alta"),this.composer.addPass(this.grade),t.quality==="baixa"&&(this.grade.uniforms.uGrain.value=.02),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.io=new IntersectionObserver(l=>{this.visible=l.some(c=>c.isIntersecting)}),this.io.observe(e),document.addEventListener("visibilitychange",this.onVis),this.resize()}targetPixelRatio(e,t){const n=Math.min(window.devicePixelRatio||1,this.quality==="alta"?2:1.25),s=Math.sqrt(ax[this.quality]/Math.max(1,e*t));return tn.clamp(Math.min(n,s)*this.resScale,.5,n)}configureShadow(e,t,n=3){e.castShadow=!0;const s=this.quality==="alta"?t:this.quality==="media"?Math.min(t,2048):Math.min(t,1024);e.shadow.mapSize.set(s,s),e.shadow.radius=n}refreshShadows(){this.renderer.shadowMap.needsUpdate=!0}envFrom(e,t=.04){const n=new _r(this.renderer),s=n.fromScene(e,t).texture;return n.dispose(),s}onUpdate(e){return this.updates.push(e),()=>{this.updates=this.updates.filter(t=>t!==e)}}onResize(e){return this.resizeHooks.push(e),()=>{this.resizeHooks=this.resizeHooks.filter(t=>t!==e)}}get resolutionScale(){return this.resScale}get currentPixelRatio(){return this.pixelRatio}bench(e=60){const t=this.renderer.getContext(),n=new Uint8Array(4);this.composer.render(0),t.readPixels(0,0,1,1,t.RGBA,t.UNSIGNED_BYTE,n);const s=performance.now();for(let c=0;c<e;c++){for(const h of this.updates)h(1/60,this.elapsed);this.composer.render(1/60)}t.readPixels(0,0,1,1,t.RGBA,t.UNSIGNED_BYTE,n);const r=(performance.now()-s)/e,a=this.renderer.info;a.autoReset=!1,a.reset(),this.composer.render(1/60);const o=a.render.calls,l=a.render.triangles;return a.autoReset=!0,{msPerFrame:Math.round(r*100)/100,calls:o,triangles:l,pixelRatio:this.pixelRatio,quality:this.quality,resScale:this.resScale}}setView(e,t=!0){const n=new A(...e.position),s=new A(...e.target);if(!t){this.camera.position.copy(n),this.controls.target.copy(s),this.controls.update(),this.tween=null;return}this.tween={fromP:this.camera.position.clone(),toP:n,fromT:this.controls.target.clone(),toT:s,t:0,dur:this.tweenDuration}}pick(e,t,n,s=!0){return this.ray(e,t),this.raycaster.intersectObjects(n,s)}ray(e,t){const n=this.renderer.domElement.getBoundingClientRect();return this.ndc.set((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1),this.raycaster.setFromCamera(this.ndc,this.camera),this.raycaster.ray}async start(){try{await this.renderer.compileAsync(this.scene,this.camera)}catch{}this.running=!0,this.clock.update(),this.settle=45;const e=()=>{if(!this.running)return;if(this.frame=requestAnimationFrame(e),!this.visible||document.hidden||this.paused||this.contextLost){this.clock.update();return}this.clock.update();const t=Math.min(this.clock.getDelta(),.1);if(this.elapsed+=t,this.adapt(t),this.tween){const n=this.tween;n.t=Math.min(1,n.t+t/n.dur);const s=n.t<.5?4*n.t*n.t*n.t:1-Math.pow(-2*n.t+2,3)/2;this.camera.position.lerpVectors(n.fromP,n.toP,s),this.controls.target.lerpVectors(n.fromT,n.toT,s),n.t>=1&&(this.tween=null)}this.controls.update();for(const n of this.updates)n(t,this.elapsed);this.grade.uniforms.uTime.value=this.elapsed,this.composer.render(t)};e()}adapt(e){if(this.settle>0){this.settle--;return}this.frameAvg+=(e-this.frameAvg)*.05;let t=this.resScale;this.frameAvg>.024?t=Math.max(.55,this.resScale*.9):this.frameAvg<.017&&this.resScale<1&&(t=Math.min(1,this.resScale*1.04)),Math.abs(t-this.resScale)>.001&&(this.resScale=t,this.settle=40,this.frameAvg=1/50,this.resize())}resize(){const e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight),n=this.targetPixelRatio(e,t);Math.abs(n-this.pixelRatio)>.01&&(this.pixelRatio=n,this.renderer.setPixelRatio(n),this.composer.setPixelRatio(n)),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t,!1),this.composer.setSize(e,t),this.grade.uniforms.uRes.value.set(e*this.pixelRatio,t*this.pixelRatio);for(const s of this.resizeHooks)s(e,t)}exportImage(e){this.composer.render(0);const t=document.createElement("a");t.download=`${e}.png`,t.href=this.renderer.domElement.toDataURL("image/png"),t.click()}dispose(){this.running=!1,cancelAnimationFrame(this.frame),this.ro.disconnect(),this.io.disconnect(),document.removeEventListener("visibilitychange",this.onVis),this.renderer.domElement.removeEventListener("webglcontextlost",this.onLost),this.renderer.domElement.removeEventListener("webglcontextrestored",this.onRestored),this.resizeHooks=[],this.updates=[],this.controls.dispose();const e=new Set,t=n=>{n instanceof sn&&e.add(n)};this.scene.traverse(n=>{const s=n;s.geometry&&s.geometry.dispose();const r=s.material?Array.isArray(s.material)?s.material:[s.material]:[];for(const a of r){Object.values(a).forEach(t);const o=a.uniforms;o&&Object.values(o).forEach(l=>t(l?.value)),a.dispose()}}),e.forEach(n=>n.dispose()),this.scene.environment&&this.scene.environment.dispose(),this.composer.dispose(),this.renderer.dispose(),this.renderer.domElement.remove()}}const lx=()=>new Promise(i=>{let e=!1;const t=()=>{e||(e=!0,i())};requestAnimationFrame(t),setTimeout(t,60)});function On(i,e,t=0){let n=Math.imul(i|0,374761393)+Math.imul(e|0,668265263)+Math.imul(t|0,982451653)|0;return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967295}const bs=(i,e)=>(i%e+e)%e,Ch=i=>i*i*i*(i*(i*6-15)+10);function Tn(i,e,t,n=0){const s=Math.floor(i),r=Math.floor(e),a=Ch(i-s),o=Ch(e-r),l=bs(s,t),c=bs(r,t),h=bs(s+1,t),u=bs(r+1,t),d=On(l,c,n),f=On(h,c,n),g=On(l,u,n),M=On(h,u,n);return d+(f-d)*a+(g-d)*o+(d-f-g+M)*a*o}function mt(i,e,t,n=5,s=0,r=.5){let a=0,o=.5,l=0,c=1;for(let h=0;h<n;h++)a+=o*Tn(i*c,e*c,t*c,s+h*17),l+=o,o*=r,c*=2;return a/l}function Us(i,e,t,n=4,s=0){let r=0,a=.5,o=0,l=1;for(let c=0;c<n;c++){const h=1-Math.abs(Tn(i*l,e*l,t*l,s+c*31)*2-1);r+=a*h*h,o+=a,a*=.5,l*=2}return r/o}function ci(i,e,t,n=0,s={f1:0,f2:0,id:0}){const r=Math.floor(i),a=Math.floor(e);let o=9,l=9,c=0;for(let h=-1;h<=1;h++)for(let u=-1;u<=1;u++){const d=r+u,f=a+h,g=bs(d,t),M=bs(f,t),m=d+On(g,M,n),p=f+On(g,M,n+7),_=m-i,E=p-e,x=Math.sqrt(_*_+E*E);x<o?(l=o,o=x,c=On(g,M,n+13)):x<l&&(l=x)}return s.f1=o,s.f2=l,s.id=c,s}const oi=i=>i<0?0:i>1?1:i,Ki=(i,e,t)=>i+(e-i)*t,bt=(i,e,t)=>{const n=oi((t-i)/(e-i));return n*n*(3-2*n)};function Bs(i){let e=i>>>0;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function co(i){const e=document.createElement("canvas");return e.width=i,e.height=i,e}function ho(i,e,t,n){return i.wrapS=i.wrapT=Oi,i.repeat.set(t[0],t[1]),i.anisotropy=e,i.colorSpace=n?cn:ri,i.generateMipmaps=!0,i.minFilter=Mi,i.needsUpdate=!0,i}function Jt(i){const e=i.size,t=new Float32Array(e*e),n=co(e),s=co(e),r=co(e),a=n.getContext("2d"),o=s.getContext("2d"),l=r.getContext("2d"),c=a.createImageData(e,e),h=o.createImageData(e,e),u=l.createImageData(e,e),d={h:0,r:0,g:0,b:0,rough:0};for(let _=0;_<e;_++){const E=1-_/e;for(let x=0;x<e;x++){const T=x/e;i.sample(T,E,d);const y=_*e+x;t[y]=d.h;const v=y*4;c.data[v]=oi(d.r)*255,c.data[v+1]=oi(d.g)*255,c.data[v+2]=oi(d.b)*255,c.data[v+3]=255;const S=oi(d.rough)*255;u.data[v]=S,u.data[v+1]=S,u.data[v+2]=S,u.data[v+3]=255}}const f=(i.normalStrength??2)*(e/512);for(let _=0;_<e;_++){const E=(_-1+e)%e*e,x=(_+1)%e*e,T=_*e;for(let y=0;y<e;y++){const v=(y-1+e)%e,S=(y+1)%e,L=(t[T+S]-t[T+v])*f,R=(t[x+y]-t[E+y])*f,P=1/Math.sqrt(L*L+R*R+1),D=(T+y)*4;h.data[D]=(-L*P*.5+.5)*255,h.data[D+1]=(R*P*.5+.5)*255,h.data[D+2]=(P*.5+.5)*255,h.data[D+3]=255}}a.putImageData(c,0,0),o.putImageData(h,0,0),l.putImageData(u,0,0);const g=i.repeat??[1,1],M=ho(new rr(n),i.aniso,g,!0),m=ho(new rr(s),i.aniso,g,!1),p=ho(new rr(r),i.aniso,g,!1);return{map:M,normalMap:m,roughnessMap:p,dispose(){M.dispose(),m.dispose(),p.dispose()}}}function Ml(i){const e=parseInt(i.replace("#",""),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}const uo=(i,e,t)=>[Ki(i[0],e[0],t),Ki(i[1],e[1],t),Ki(i[2],e[2],t)];function ca(i){const e=Ml(i.light),t=Ml(i.dark),n=i.planks??0,s=i.seed??3,r=i.grainScale??1,a=i.gloss??.3,o=i.weathered??0,l={f1:0,f2:0,id:0};return(c,h,u)=>{let d=h,f=0,g=0,M=c;if(n>0){const S=Math.floor(h*n);d=h*n-S;const L=On(S,1,s)*.9,R=2,P=c*R+L,D=Math.floor(P);M=P-D,f=On(S,D,s);const B=Math.min(d,1-d),I=Math.min(M,1-M)/R*6;g=1-bt(0,.035,Math.min(B,I))}const m=mt(c*4*r,h*16*r,4*r,4,s+5),p=(h*(n||1)*7+m*3.2+f*5)*5*r,_=Math.pow(Math.abs(Math.sin(p*Math.PI)),.6),E=mt(c*64*r,h*512*r,64*r,3,s+9);ci(c*6,h*6*Math.max(1,n/2),6,s+21,l);const x=l.id>.86?bt(.28,0,l.f1):0;let T=_*.55+E*.35+x*.8+(f-.5)*.35;T=oi(T);let y=uo(e,t,T);const v=.86+f*.28;if(y=[y[0]*v,y[1]*v,y[2]*v],o>0){const S=mt(c*8,h*8,8,4,s+40);y=uo(y,[.52,.5,.47],o*bt(.35,.8,S)*.6)}y=uo(y,[y[0]*.25,y[1]*.22,y[2]*.2],g),u.r=y[0],u.g=y[1],u.b=y[2],u.h=(1-g)*.6+E*.18-_*.07-x*.1+o*mt(c*32,h*128,32,3,s)*.15,u.rough=oi(Ki(.78,.32,a)+E*.12+g*.3+o*.25+x*.05)}}function cx(i,e=8,t=160){const n=Ml(i);return(s,r,a)=>{const o=Math.sin(s*Math.PI*t),l=Math.sin(r*Math.PI*t),c=(Math.floor(s*t)+Math.floor(r*t))%2===0?1:0,h=Math.abs(c?o:l),u=mt(s*32,r*4,32,3,e),d=mt(s*6,r*6,6,4,e+5),f=.82+h*.16+(u-.5)*.12+(d-.5)*.1;a.r=n[0]*f,a.g=n[1]*f,a.b=n[2]*f,a.h=h*.7+u*.2,a.rough=.92}}function gn(i,e={},t=1){return new yn({map:i.map,normalMap:i.normalMap,roughnessMap:i.roughnessMap,normalScale:new te(t,t),roughness:1,...e})}function Ta(i,e={},t=1){return new ql({map:i.map,normalMap:i.normalMap,roughnessMap:i.roughnessMap,normalScale:new te(t,t),roughness:1,...e})}function hx(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ut;l.morphTargetsRelative=o;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0,f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const g in u.attributes){if(!n.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+g+'" attribute exists among all geometries, or in none of them.'),null;r[g]===void 0&&(r[g]=[]),r[g].push(u.attributes[g]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const g in u.morphAttributes){if(!s.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[g].length!==i[0].morphAttributes[g].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+g+'" morph attribute.'),null;a[g]===void 0&&(a[g]=[]),a[g].push(u.morphAttributes[g]),f++}if(f!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(e){let g;if(t)g=u.index.count;else if(u.attributes.position!==void 0)g=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,g,h),c+=g}}if(t){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Ph(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let M=0;M<a[h].length;++M)f.push(a[h][M][d]);const g=Ph(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function Ph(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new zn(a,t,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<t;g++){const M=h.getComponent(d,g);o.setComponent(d+u,g,M)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}const Ys=new A;function Un(i,e,t,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Ys.copy(e),Ys[n]=0,Ys.normalize();const c=.5*a/(a+o),h=1-Ys.angleTo(i)/l;return Math.sign(Ys[t])===1?h*c:o/(a+o)+c+c*(1-h)}class Aa extends Dn{constructor(e=1,t=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new A,c=new A,h=new A(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=u.length/6,M=new A,m=.5/a;for(let p=0,_=0;p<u.length;p+=3,_+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/g)){case 0:M.set(1,0,0),f[_+0]=Un(M,c,"z","y",r,n),f[_+1]=1-Un(M,c,"y","z",r,t);break;case 1:M.set(-1,0,0),f[_+0]=1-Un(M,c,"z","y",r,n),f[_+1]=1-Un(M,c,"y","z",r,t);break;case 2:M.set(0,1,0),f[_+0]=1-Un(M,c,"x","z",r,e),f[_+1]=Un(M,c,"z","x",r,n);break;case 3:M.set(0,-1,0),f[_+0]=1-Un(M,c,"x","z",r,e),f[_+1]=1-Un(M,c,"z","x",r,n);break;case 4:M.set(0,0,1),f[_+0]=1-Un(M,c,"x","y",r,e),f[_+1]=1-Un(M,c,"y","x",r,t);break;case 5:M.set(0,0,-1),f[_+0]=Un(M,c,"x","y",r,e),f[_+1]=1-Un(M,c,"y","x",r,t);break}}static fromJSON(e){return new Aa(e.width,e.height,e.depth,e.segments,e.radius)}}function dt(i,e,t=0,n=0,s=0){const r=new Be(i,e);return r.position.set(t,n,s),r.castShadow=!0,r.receiveShadow=!0,r}function un(i,e,t,n=.01,s=3){return new Aa(i,e,t,s,Math.min(n,i/2-1e-4,e/2-1e-4,t/2-1e-4))}function ux(i,e,t,n=1){const s=new Dn(i,e,t),r=s.attributes.uv,a=[[t,e],[t,e],[i,t],[i,t],[i,e],[i,e]];for(let o=0;o<6;o++)for(let l=0;l<4;l++){const c=o*4+l;r.setXY(c,r.getX(c)*a[o][0]/n,r.getY(c)*a[o][1]/n)}return s}function Ui(i,e=48){const t=new ya(i.map(([n,s])=>new te(Math.max(1e-5,n),s)),e);return t.computeVertexNormals(),t}function Os(i,e,t={}){const n=new Ma(i,!1,"centripetal"),s=t.segments??Math.max(8,i.length*8),r=t.radial??12,a=n.computeFrenetFrames(s,!1),o=n.getLength(),l=Bs(t.seed??1),c=Array.from({length:6},()=>[l()*6.28,1+Math.floor(l()*4),l()]),h=[],u=[],d=[],f=[],g=new A,M=new A;for(let p=0;p<=s;p++){const _=p/s;n.getPointAt(_,g);const E=e(_),x=a.normals[p],T=a.binormals[p];for(let y=0;y<=r;y++){const v=y/r*Math.PI*2;let S=1;if(t.noise)for(const[D,B,I]of c)S+=Math.sin(v*B+D+_*9*I)*t.noise*.25*I;const L=Math.sin(v),R=-Math.cos(v);M.set(R*x.x+L*T.x,R*x.y+L*T.y,R*x.z+L*T.z).normalize(),h.push(g.x+M.x*E*S,g.y+M.y*E*S,g.z+M.z*E*S),u.push(M.x,M.y,M.z);const P=Math.max(.05,2*Math.PI*e(0));d.push(y/r,_*o/P*(t.uvScale??1))}}for(let p=0;p<s;p++)for(let _=0;_<r;_++){const E=p*(r+1)+_,x=(p+1)*(r+1)+_;f.push(E,x,E+1,x,x+1,E+1)}const m=new Ut;return m.setAttribute("position",new Ye(h,3)),m.setAttribute("normal",new Ye(u,3)),m.setAttribute("uv",new Ye(d,2)),m.setIndex(f),t.noise&&m.computeVertexNormals(),m}function dx(i,e,t){const n=t.clone().sub(e),s=n.length();return i.position.copy(e).add(t).multiplyScalar(.5),i.quaternion.setFromUnitVectors(new A(0,1,0),n.normalize()),s}function Lh(i,e,t,n,s=10){const r=new Be(new In(t,t,i.distanceTo(e),s),n);return dx(r,i,e),r.castShadow=r.receiveShadow=!0,r}function fx(i,e=1,t=4,n=.7){const s=new Gl(i,t),r=s.attributes.position,a=Bs(e),o=Array.from({length:7},()=>[new A(a()-.5,a()-.5,a()-.5).normalize(),1+a()*4,a()*6]),l=new A;for(let c=0;c<r.count;c++){l.fromBufferAttribute(r,c);const h=l.clone().normalize();let u=1;for(const[d,f,g]of o)u+=Math.sin(h.dot(d)*f*3+g)*.06;l.multiplyScalar(u),l.y*=l.y<0?n*.6:n,r.setXYZ(c,l.x,l.y,l.z)}return s.computeVertexNormals(),s}function px(i,e=!0,t=!0){i.updateMatrixWorld(!0);const n=new Qe().copy(i.matrixWorld).invert(),s=new Map,r=[];i.traverse(o=>{const l=o;if(!l.isMesh||l.isInstancedMesh||o.userData.keep){l.isMesh&&r.push(o);return}if(Array.isArray(l.material)){r.push(o);return}let c=l.geometry.index?l.geometry.toNonIndexed():l.geometry.clone();for(const u of Object.keys(c.attributes))["position","normal","uv"].includes(u)||c.deleteAttribute(u);c.attributes.uv||c.setAttribute("uv",new Ye(new Float32Array(c.attributes.position.count*2),2)),c.attributes.normal||c.computeVertexNormals(),c.applyMatrix4(new Qe().multiplyMatrices(n,l.matrixWorld));const h=s.get(l.material)??[];h.push(c),s.set(l.material,h)});const a=new st;return s.forEach((o,l)=>{const c=hx(o,!1);if(o.forEach(u=>u.dispose()),!c)return;const h=new Be(c,l);h.castShadow=e,h.receiveShadow=t,a.add(h)}),r.forEach(o=>{o.updateMatrixWorld(!0);const l=o,c=new Qe().multiplyMatrices(n,l.matrixWorld);l.removeFromParent(),c.decompose(l.position,l.quaternion,l.scale),a.add(l)}),a}function yr(i,e,t,n=!0){const s=document.createElement("canvas");s.width=i,s.height=e,t(s.getContext("2d"));const r=new rr(s);return r.colorSpace=n?cn:ri,r.anisotropy=8,r}function mx(i){return i.userData.noAO=!0,i.castShadow=!1,i.receiveShadow=!1,i}function gx(i){const e=Bs(i.seed??7),t=new Float32Array(i.count*3),n=new Float32Array(i.count);for(let h=0;h<i.count;h++)t[h*3]=i.min.x+e()*(i.max.x-i.min.x),t[h*3+1]=i.min.y+e()*(i.max.y-i.min.y),t[h*3+2]=i.min.z+e()*(i.max.z-i.min.z),n[h]=e();const s=new Ut;s.setAttribute("position",new zn(t,3)),s.setAttribute("aRand",new zn(n,1));const r=(i.beams??[]).slice(0,4),a=Array.from({length:4},(h,u)=>r[u]?new Ct(r[u].origin.x,r[u].origin.y,r[u].origin.z,r[u].radius):new Ct),o=Array.from({length:4},(h,u)=>r[u]?new Ct(r[u].dir.x,r[u].dir.y,r[u].dir.z,r[u].length):new Ct),l=new Ot({transparent:!0,depthWrite:!1,blending:Rs,uniforms:{uTime:{value:0},uSize:{value:i.size??9},uPR:{value:Math.min(window.devicePixelRatio,2)},uMin:{value:i.min},uMax:{value:i.max},uColor:{value:new Ce(i.color??"#ffe2b8")},uBase:{value:i.base??(r.length?.06:.6)},uOpacity:{value:1},uBeamA:{value:a},uBeamB:{value:o},uBeamCount:{value:r.length}},vertexShader:`
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
    `}),c=mx(new Xf(s,l));return c.frustumCulled=!1,{object:c,material:l,setBeams(h){h.slice(0,4).forEach((u,d)=>{a[d].set(u.origin.x,u.origin.y,u.origin.z,u.radius),o[d].set(u.dir.x,u.dir.y,u.dir.z,u.length)})},update(h){l.uniforms.uTime.value=h}}}(()=>{const i=new as(1,20,16),e=i.attributes.position;for(let t=0;t<e.count;t++){const n=e.getY(t),s=n>0?1-Math.pow(n,1.5)*.92:1-Math.pow(-n,2)*.35;e.setXYZ(t,e.getX(t)*s,n*(n>0?2.6:.9),e.getZ(t)*s)}return i.computeVertexNormals(),i})();function vx(i){const e=i.size??512,t=document.createElement("canvas");t.width=t.height=e;const n=t.getContext("2d");((a,o,l,c,h)=>{n.save(),n.translate(a,o),n.rotate(c);const u=l*i.aspect,d=n.createLinearGradient(-u,0,u,0);d.addColorStop(0,h),d.addColorStop(.5,fo(h,1.18)),d.addColorStop(1,fo(h,.82)),n.fillStyle=d,n.beginPath(),n.moveTo(0,0),n.bezierCurveTo(u,-l*.25,u*.8,-l*.75,0,-l),n.bezierCurveTo(-u*.8,-l*.75,-u,-l*.25,0,0),n.fill(),n.strokeStyle=fo(h,.7),n.lineWidth=Math.max(1,l*.025),n.beginPath(),n.moveTo(0,0),n.lineTo(0,-l*.95),n.stroke(),n.lineWidth=Math.max(.6,l*.012);for(let f=1;f<6;f++){const g=-l*f*.15;n.beginPath(),n.moveTo(0,g),n.lineTo(u*.6,g-l*.1),n.moveTo(0,g),n.lineTo(-u*.6,g-l*.1),n.stroke()}n.restore()})(e/2,e*.95,e*.9,0,i.palette[0]);const r=new rr(t);return r.colorSpace=cn,r.anisotropy=4,r}function fo(i,e){const t=new Ce(i);return t.r=Math.min(1,t.r*e),t.g=Math.min(1,t.g*e),t.b=Math.min(1,t.b*e),"#"+t.getHexString()}function Dh(i,e){return i.onBeforeCompile=t=>{t.uniforms.uWind=e.strength,t.uniforms.uWTime=e.time,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
uniform float uWind; uniform float uWTime;`).replace("#include <begin_vertex>",e.mode==="grass"?`#include <begin_vertex>
             {
               vec4 wp = vec4(transformed, 1.0);
               #ifdef USE_INSTANCING
                 wp = instanceMatrix * wp;
               #endif
               wp = modelMatrix * wp;
               float h = clamp(position.y * ${(e.heightScale??1).toFixed(3)}, 0.0, 1.0);
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
             }`)},i.customProgramCacheKey=()=>`wind-${e.mode}`,i}const ii=["cork","wool","slate","linen","leaf","smooth_wood","ceramic","sandstone"],At={cork:{id:"cork",name:"Cortiça",detail:"Pedaço irregular de casca de sobreiro, em blocos com fendas e poros.",question:"Onde a luz para e onde ela entra nas fendas?"},wool:{id:"wool",name:"Lã",detail:"Mecha de lã crua com cachos e fibras soltas.",question:"Como as fibras mudam quando a luz passa rente a elas?"},slate:{id:"slate",name:"Ardósia",detail:"Placa escura de pedra em camadas finas, com bordas lascadas.",question:"O que aparece na superfície escura quando a luz desce?"},linen:{id:"linen",name:"Linho cru",detail:"Quadrado de tecido de trama aberta, com franja desfiada.",question:"Você percebe a trama antes ou depois de aproximar?"},leaf:{id:"leaf",name:"Folha",detail:"Folha verde com nervuras salientes e borda levemente serrilhada.",question:"O que muda nas nervuras quando a luz vem por trás?"},smooth_wood:{id:"smooth_wood",name:"Madeira lisa",detail:"Bloco de madeira lixada e encerada, com veios aparentes.",question:"Os veios aparecem como cor, como relevo ou como brilho?"},ceramic:{id:"ceramic",name:"Cerâmica",detail:"Caco curvo de tigela esmaltada, com craquelado fino.",question:"Como o brilho do esmalte acompanha a curva do caco?"},sandstone:{id:"sandstone",name:"Arenito",detail:"Seixo de arenito com grãos visíveis e faixas de sedimento.",question:"Os grãos parecem soltos ou presos uns aos outros?"}},Pn=[{id:"escolher",title:"Escolher amostras",invite:"Escolha duas superfícies da bancada. Qual delas chama seu olhar primeiro?",hints:["Toque em uma bandeja ou use a lista. Cada amostra pode entrar e sair da escolha.","Duas amostras bastam para comparar depois. Você pode trocar a qualquer momento."]},{id:"observar",title:"Observar à luz difusa",invite:"Com a luz espalhada da sala, gire a amostra e aproxime. O que você percebe primeiro?",hints:["Arraste sobre a amostra com a ferramenta Mão, ou use os botões de girar.","Use “Aproximar” para chegar perto da superfície. Repare nas bordas."]},{id:"rasante",title:"Luz rasante",invite:"Desça a luz e gire a luminária. O que aparece quando a luz passa rente?",hints:["Toque em “Girar a luz” para um giro lento, ou ajuste ângulo e altura com os botões.","Altura baixa deixa sombras longas. Compare 15° com 60°.","Abra a lupa e passe sobre a superfície para ver os detalhes ampliados."]},{id:"comparar",title:"Comparar lado a lado",invite:"As duas amostras estão sob a mesma luz e na mesma escala. Como cada uma recebe essa luz?",hints:["Os descritores são opcionais. Escolha nenhum, um ou vários.","“Não sei” também é uma observação possível."]},{id:"guardar",title:"Guardar no atlas",invite:"Guarde as amostras no atlas. Se quiser, deixe um cartão de preferência.",hints:["O cartão de preferência é opcional. Você pode guardar sem marcar nada."]},{id:"revisar",title:"Revisar a coleção",invite:"Folheie o atlas. O que se repete nas superfícies que você guardou?",hints:["Você pode retirar uma entrada ou experimentar outras amostras."]}],Jl=["liso","rugoso","fibroso","granulado","outro","nao_sei"],po={liso:"liso",rugoso:"rugoso",fibroso:"fibroso",granulado:"granulado",outro:"outro",nao_sei:"não sei"},sd=["gostei","indiferente","evitar"],mo={gostei:"gostei",indiferente:"indiferente",evitar:"prefiro evitar"},rd=["livre","guiado","acompanhado"],go={livre:{name:"Livre",text:"Explore todas as amostras e troque quando quiser, sem roteiro."},guiado:{name:"Guiado",text:"Pistas graduais aparecem quando você pedir."},acompanhado:{name:"Acompanhado",text:"Um adulto escolhe de 2 a 4 amostras antes de começar."}},Ql=["sala","tarde","noite"],_x={sala:"Manhã na sala",tarde:"Fim de tarde",noite:"Noite com luminária"},na=["O que muda quando a luz desce?","Como é aproximar até a superfície ocupar o olhar?","Qual detalhe só apareceu na comparação?","O que você percebe agora que não percebia no começo?"],Ih="Apenas descrição. O significado é de quem cria.",Nh="A tela mostra luz e relevo; ela não reproduz o toque. O que você anota é o que vê.",vo=["Lixando a bancada de carvalho…","Esticando o feltro na bandeja…","Abrindo os poros da cortiça…","Cardando a lã…","Lascando a ardósia em camadas…","Desfiando a franja do linho…","Desenhando as nervuras da folha…","Polindo o latão da luminária…","Organizando as gavetas de amostras…"];function Pt(i){const e=parseInt(i.replace("#",""),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}const Xt=(i,e,t)=>[Ki(i[0],e[0],t),Ki(i[1],e[1],t),Ki(i[2],e[2],t)],Bn=(i,e)=>[i[0]*e,i[1]*e,i[2]*e];function kn(i,e,t,n){i.r=e[0],i.g=e[1],i.b=e[2],i.h=t,i.rough=n}function xx(i=41){const e=Pt("#c98a52"),t=Pt("#a5683a"),n=Pt("#5e3319"),s={f1:0,f2:0,id:0},r={f1:0,f2:0,id:0};return(a,o,l)=>{const c=mt(a*5,o*5,5,4,i);ci(a*46,o*46,46,i+3,s);const h=bt(.32,.08,s.f1)*(s.id>.35?1:.35);ci(a*10,o*34,10,i+9,r);const u=bt(.22,.05,r.f1)*(r.id>.72?1:0),d=Tn(a*260,o*260,260,i+5),f=Tn(a*520,o*520,520,i+6);let g=Xt(t,e,bt(.25,.8,c+(d-.5)*.35));g=Xt(g,Bn(n,1.1),h*.85),g=Xt(g,n,u*.9),g=Bn(g,.9+f*.18);const M=.55+(d-.5)*.35+(f-.5)*.2-h*.55-u*.7+c*.15;kn(l,g,M,.86+h*.1-d*.06)}}function Mx(i,e=17){const t=Pt(i);return(n,s,r)=>{const a=Us(n*64+.3,s*64,64,3,e),o=Us(s*64+.7,n*64,64,3,e+4),l=Tn(n*384,s*384,384,e+2),c=mt(n*6,s*6,6,4,e+8),h=.82+(a*.5+o*.5-.4)*.22+(l-.5)*.12+(c-.5)*.14;kn(r,Bn(t,h),a*.4+o*.4+l*.25,.97)}}function Sx(i=23){const e=Pt("#efe4cf"),t=Pt("#cdbb98");return(n,s,r)=>{const a=Math.sin((s*18+mt(n*6,s*2,6,3,i)*3)*Math.PI*2)*.012,o=Us((n+a)*90,s*6,90,3,i+2),l=Tn((n+a)*400,s*30,400,i+3),c=mt(n*4,s*4,4,4,i+5);let h=Xt(t,e,oi(o*.8+l*.3));h=Xt(h,Bn(t,.8),bt(.55,.8,c)*.35),kn(r,h,o*.7+l*.3,.9-o*.08)}}function yx(i=29){const e=Pt("#5b6064"),t=Pt("#2b2e31"),n={f1:0,f2:0,id:0};return(s,r,a)=>{const o=mt(s*3,r*3,3,4,i)*.4,l=Us(s*2+o,r*40+o*6,2,4,i+1),c=mt(s*7,r*7,7,5,i+2);ci(s*9,r*9,9,i+4,n);const h=bt(.05,0,n.f2-n.f1),u=On(Math.floor(s*900),Math.floor(r*900),i+7)>.985?1:0,d=bt(.985,1,Math.sin((s*.8+r*3.1+mt(s*2,r*2,2,2,i+9)*.6)*Math.PI*14)*.5+.5)*.4;let f=Xt(t,e,oi(c*.9+l*.25-.2));f=Xt(f,Pt("#8a8f92"),d),f=Xt(f,Bn(f,.6),h),f=Xt(f,[.75,.76,.78],u*.6),kn(a,f,l*.45+c*.3-h*.35,.62-u*.3+c*.12)}}function bx(i=31,e=36){const t=Pt("#dccfb2"),n=Pt("#7f725b");return(s,r,a)=>{const o=mt(s*8,r*.5+.2,8,3,i)-.5,l=mt(r*8,s*.5+.7,8,3,i+3)-.5,c=s*e+l*.25,h=r*e+o*.25,u=Math.floor(c),d=Math.floor(h),f=c-u,g=h-d,M=Math.max(0,1-Math.abs(f-.5)*2.6),m=Math.max(0,1-Math.abs(g-.5)*2.6),p=(u+d)%2===0,_=Math.sqrt(M)*(p?1:.55),E=Math.sqrt(m)*(p?.55:1),x=Math.max(_,E),T=x<.05?1:0,y=Tn(s*512,r*512,512,i+5),v=.88+(mt(s*5,r*5,5,4,i+9)-.5)*.18+On(u,1,i)*.06+(y-.5)*.08,S=T?n:Bn(t,v*(.78+x*.25));kn(a,S,x*.9+y*.08,.93)}}function ad(i,e){const t=(i-.5)*2,n=Math.abs(t),s=bt(.045,0,n)*(1-e*.6),r=(e-n*.42)*9,a=bt(.1,0,Math.abs(r-Math.round(r))-0)*bt(.98,.15,n)*(.55+.45*(1-e));return{mid:s,sec:a}}function Ex(i=37){const e=Pt("#5f8a3c"),t=Pt("#3f6a2a"),n=Pt("#a7b96a"),s={f1:0,f2:0,id:0};return(r,a,o)=>{const{mid:l,sec:c}=ad(r,a);ci(r*40,a*70,40,i,s);const h=bt(.06,0,s.f2-s.f1),u=mt(r*4,a*4,4,4,i+2);let d=Xt(t,e,u);d=Xt(d,n,Math.max(l,c*.65)*.75+h*.12);const f=bt(.82,1,Math.abs(r-.5)*2);d=Xt(d,Bn(t,.8),f*.4),kn(o,d,l*.9+c*.55+h*.12-u*.05,.55+u*.15-l*.1)}}function wx(i=43){const e=Pt("#9fbfae"),t=Pt("#6f9a88"),n={f1:0,f2:0,id:0},s={f1:0,f2:0,id:0};return(r,a,o)=>{ci(r*26,a*26,26,i,n),ci(r*7,a*7,7,i+2,s);const l=Math.max(bt(.035,0,n.f2-n.f1)*.7,bt(.03,0,s.f2-s.f1)),c=mt(r*3,a*3,3,4,i+4),h=On(Math.floor(r*700),Math.floor(a*700),i+6)>.993?1:0;let u=Xt(e,t,bt(.35,.75,c));u=Xt(u,Pt("#4b5f55"),l*.55),u=Xt(u,Bn(u,.7),h),kn(o,u,-l*.25-h*.3+c*.05,.12+l*.2+h*.4)}}function Tx(i=47){const e=Pt("#b86a45"),t=Pt("#8a4a2e");return(n,s,r)=>{const a=mt(n*10,s*10,10,4,i),o=Tn(n*300,s*300,300,i+1);kn(r,Xt(t,e,a*.8+o*.2),a*.5+o*.5,.92)}}function Ax(i=53){const e=Pt("#d7b689"),t=Pt("#b98d5e"),n=Pt("#9c6a44"),s={f1:0,f2:0,id:0};return(r,a,o)=>{ci(r*160,a*160,160,i,s);const l=bt(.55,.15,s.f1),c=Math.sin((a*7+mt(r*3,a*3,3,4,i+2)*1.4)*Math.PI*2)*.5+.5,h=mt(r*6,a*6,6,4,i+3),u=s.id>.9?1:0;let d=Xt(t,e,oi(c*.55+h*.45));d=Xt(d,n,bt(.7,.9,c)*.35),d=Bn(d,.86+s.id*.24),d=Xt(d,[.93,.91,.86],u*.45),kn(o,d,l*.7+c*.12+h*.1,.9-u*.25)}}function Uh(i,e=59){const t=Pt(i);return(n,s,r)=>{const a=Tn(n*2,s*700,2,e),o=Tn(n*4,s*1400,4,e+1),l=mt(n*5,s*5,5,4,e+2),c=.88+(a-.5)*.08+(o-.5)*.05+(l-.5)*.08;kn(r,Bn(t,c),a*.5+o*.3,.3+(a-.5)*.1+l*.12)}}function Rx(i,e=61){const t=Pt(i),n={f1:0,f2:0,id:0};return(s,r,a)=>{ci(s*6,r*6,6,e,n);const o=bt(0,.5,n.f1)*.5+n.id*.5,l=Tn(s*300,r*300,300,e+1),c=mt(s*2,r*2,2,4,e+2),h=.9+(o-.5)*.08+(l-.5)*.04+(c-.5)*.1;kn(a,Bn(t,h),o*.5+l*.15,.9)}}function Cx(i=67){const e=Pt("#f2e6cc");return(t,n,s)=>{const r=Us(t*22,n*5,22,3,i)*Us(n*18,t*6,18,3,i+1),a=mt(t*5,n*5,5,4,i+2);kn(s,Bn(e,.92+a*.08-r*.05),r*.3+a*.1,.95)}}function od(i){const e=i.sx??1,t=i.sz??1,n=[],s=[],r=[];n.push(0,i.height(0,0,0,0),0),s.push(0,0);for(let o=1;o<=i.rings;o++){const l=o/i.rings,c=1-Math.pow(1-l,1.55);for(let h=0;h<i.segs;h++){const u=h/i.segs*Math.PI*2,d=c*i.R(u),f=Math.cos(u)*d*e,g=Math.sin(u)*d*t,M=o===i.rings?0:i.height(f,g,c,u);n.push(f,M,g),s.push(f/i.uvTile,g/i.uvTile)}}for(let o=0;o<i.segs;o++)r.push(0,1+(o+1)%i.segs,1+o);for(let o=1;o<i.rings;o++){const l=1+(o-1)*i.segs,c=1+o*i.segs;for(let h=0;h<i.segs;h++){const u=(h+1)%i.segs;r.push(l+h,l+u,c+h,l+u,c+u,c+h)}}const a=new Ut;return a.setAttribute("position",new Ye(n,3)),a.setAttribute("uv",new Ye(s,2)),a.setIndex(r),a.computeVertexNormals(),a}function Bi(i,e,t,n){e.traverse(a=>{a.isMesh&&(a.castShadow=!0,a.receiveShadow=!0)});const s=new Ti().setFromObject(e),r=Math.max(s.max.x-s.min.x,s.max.z-s.min.z);return e.name=`sample_${i}`,{id:i,object:e,height:s.max.y,size:r,textures:t,update:n}}const $i={f1:0,f2:0,id:0};function Px(i){const e=Jt({size:i.heroSize,aniso:i.aniso,normalStrength:3.2,sample:xx()}),t=l=>.118*(1+.14*Math.sin(2*l+.6)+.07*Math.sin(3*l+2.1)+(mt(l*1.6,.5,10,4,7)-.5)*.34),n=.05,r=od({R:t,sx:1.28,sz:.94,rings:110,segs:280,height:(l,c,h,u)=>{const d=(Tn(u*9,.3,57,11)-.5)*.06,f=bt(1,.86,h+d);ci(l*30+50,c*30+50,1e3,13,$i);const g=.66+$i.id*.42,M=(Math.cos($i.id*40)*l+Math.sin($i.id*40)*c)*1.2,m=bt(.42,.85,$i.f1)*.14,p=bt(.075,0,$i.f2-$i.f1),_=1-h*h*.3,E=(mt(l*90+9,c*90+9,1e3,3,19)-.5)*.08,x=n*f*_*(g+M-m+E)-n*p*.42*f;return Math.max(.0015*f,x)},uvTile:.07}),a=gn(e,{roughness:1,color:16777215},1.4),o=new st;return o.add(new Be(r,a)),Bi("cork",o,[e])}function Lx(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:2.4,sample:Sx()}),t=Ta(e,{sheen:1,sheenRoughness:.55,sheenColor:new Ce("#fff4de"),roughness:1},1.2),n=new st,s=new as(1,48,24),r=s.attributes.position;for(let l=0;l<r.count;l++){const c=r.getX(l),h=r.getY(l),u=r.getZ(l),d=1+(mt(c*2+3,u*2+h+3,1e3,4,5)-.5)*.35;r.setXYZ(l,c*.095*d,Math.max(-.05,h)*.032*d+.018,u*.07*d)}s.computeVertexNormals(),n.add(new Be(s,t));const a=Bs(77),o=[];for(let l=0;l<64;l++){const c=a()*Math.PI*2,h=Math.sqrt(a()),u=new A(Math.cos(c)*h*.085,.03+(1-h)*.02,Math.sin(c)*h*.062),d=new A(Math.cos(c+(a()-.5)*1.2),.25+a()*.5,Math.sin(c+(a()-.5)*1.2)).normalize(),f=new A().crossVectors(d,new A(0,1,0)).normalize(),g=new A().crossVectors(f,d).normalize(),M=.03+a()*.035,m=2+a()*2.2,p=.004+a()*.004,_=[];for(let x=0;x<=22;x++){const T=x/22,y=T*m*Math.PI*2+a()*.2;_.push(u.clone().addScaledVector(d,T*M).addScaledVector(f,Math.cos(y)*p*(1-T*.4)).addScaledVector(g,Math.sin(y)*p*(1-T*.4)-T*T*.01))}const E=.0028+a()*.0016;o.push(Os(_,x=>E*(1-x*.75),{radial:7,segments:44,uvScale:.25,noise:.15,seed:l}))}for(let l=0;l<26;l++){const c=a()*Math.PI*2,h=new A(Math.cos(c)*.07,.025+a()*.02,Math.sin(c)*.05),u=[0,1,2,3].map(d=>h.clone().add(new A(Math.cos(c)*d*.012+(a()-.5)*.006,(a()-.6)*.006*d,Math.sin(c)*d*.012+(a()-.5)*.006)));u.forEach(d=>d.y=Math.max(.001,d.y)),o.push(Os(u,d=>6e-4*(1-d*.6),{radial:4,segments:14,uvScale:.25}))}for(const l of o)n.add(new Be(l,t));return Bi("wool",n,[e])}function Dx(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:2.6,sample:yx()}),t=5,n=u=>1/Math.pow(Math.pow(Math.abs(Math.cos(u)),t)+Math.pow(Math.abs(Math.sin(u)),t),1/t),s=(u,d)=>Math.pow(Tn(u*7,.5,44,d),2.2),r=u=>.1*n(u)*(1-s(u,3)*.12),a=[{h:.009,edge:u=>.97-s(u,5)*.06},{h:.006,edge:u=>.9-s(u,8)*.22},{h:.0045,edge:u=>.74-s(u,12)*.32}],l=od({R:r,sx:1.5,sz:1.08,rings:90,segs:240,height:(u,d,f,g)=>{let M=0;for(const p of a)M+=p.h*bt(p.edge(g)+.012,p.edge(g)-.012,f);const m=(mt(u*20+2,d*5+2,1e3,4,31)-.5)*.0016;return Math.max(0,M+m*bt(1,.9,f))},uvTile:.16}),c=gn(e,{roughness:1},1.1),h=new st;return h.add(new Be(l,c)),Bi("slate",h,[e])}function Ix(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:3.4,sample:bx()}),t=.19,n=64,s=new wn(t,t,n,n);s.rotateX(-Math.PI/2);const r=s.attributes.position,a=s.attributes.uv;for(let p=0;p<r.count;p++){const _=r.getX(p),E=r.getZ(p),x=Math.max(0,Math.sin((_*.6+E)*30+1))*.0022*bt(.1,0,Math.abs(E-.02)),T=(mt(_*14+4,E*14+4,1e3,3,9)-.5)*.004,y=bt(.03,-.01,-_-E*.2+.07)*.012;r.setY(p,.0018+Math.max(0,T+.0012)+x+y),a.setXY(p,a.getX(p)*(t/.05),a.getY(p)*(t/.05))}s.computeVertexNormals();const o=gn(e,{roughness:1,side:_n},1.6),l=new st;l.add(new Be(s,o));const c=new In(55e-5,4e-4,1,5,1);c.translate(0,.5,0),c.rotateX(Math.PI/2);const h=60,u=new dl(c,o,h*4),d=Bs(5),f=new Qe,g=new nn,M=new En;let m=0;for(let p=0;p<4;p++)for(let _=0;_<h;_++){const E=(_+.5)/h-.5,x=.008+d()*.011,T=p*(Math.PI/2)+(d()-.5)*.35,y=new A(E*t,.0016,t/2-.001).applyAxisAngle(new A(0,1,0),p*(Math.PI/2));M.set(-.05+(d()-.5)*.12,T,0),g.setFromEuler(M),f.compose(y,g,new A(1,1,x)),u.setMatrixAt(m++,f)}return u.instanceMatrix.needsUpdate=!0,l.add(u),Bi("linen",l,[e])}function Nx(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:2.8,sample:Ex()}),t=36,n=120,s=.2,r=.062,a=[],o=[],l=[];for(let M=0;M<=n;M++){const m=M/n;let p=r*Math.pow(Math.sin(Math.PI*Math.pow(m,.82)),.85);const _=1+.035*(1-Math.abs(m*34%1*2-1))*bt(.05,.2,m);p*=_;for(let E=0;E<=t;E++){const x=E/t,T=x*2-1,y=T*p,v=m*s-s*.48,{mid:S,sec:L}=ad(x,m),R=.004+Math.pow(Math.abs(T),1.6)*.012+Math.sin(Math.PI*m)*.008-m*m*.006+S*.0016+L*7e-4;a.push(y,R,-v),o.push(x,m)}}for(let M=0;M<n;M++)for(let m=0;m<t;m++){const p=M*(t+1)+m,_=p+t+1;l.push(p,p+1,_,_,p+1,_+1)}const c=new Ut;c.setAttribute("position",new Ye(a,3)),c.setAttribute("uv",new Ye(o,2)),c.setIndex(l),c.computeVertexNormals(),e.map.wrapS=e.map.wrapT=ai;const h=gn(e,{side:_n,roughness:1,emissive:new Ce("#9fca5a"),emissiveMap:e.map,emissiveIntensity:0},1.2),u=new st;u.add(new Be(c,h));const d=new yn({color:"#6d8a3e",roughness:.6}),f=Os([new A(0,.005,s*.48),new A(.003,.004,s*.48+.02),new A(.01,.002,s*.48+.045)],M=>.0024*(1-M*.45),{radial:8,segments:16});return u.add(new Be(f,d)),Bi("leaf",u,[e],M=>{const m=Math.max(0,-M.toLight.dot(M.toCamera)+.15),p=1-Math.abs(M.toLight.y);h.emissiveIntensity=(m*.55+p*.12)*M.lampLevel})}function Ux(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:1.2,sample:ca({light:"#d9a46b",dark:"#8c5732",grainScale:1.4,gloss:.8,seed:71})}),t=Ta(e,{roughness:1,clearcoat:.55,clearcoatRoughness:.28},.35),n=new st,s=new Be(un(.17,.042,.105,.013,5),t);return s.position.y=.021,n.add(s),Bi("smooth_wood",n,[e])}function Ox(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:1.6,repeat:[3,2],sample:wx()}),t=Jt({size:Math.min(256,i.size),aniso:i.aniso,normalStrength:2,sample:Tx()}),n=Ta(e,{roughness:1,clearcoat:1,clearcoatRoughness:.12,side:_n},.6),s=gn(t,{roughness:1,side:_n},1),r=[[.05,0],[.068,.008],[.082,.022],[.091,.04],[.095,.058],[.094,.064],[.089,.065],[.087,.058],[.084,.041],[.076,.024],[.063,.012],[.047,.006],[.05,0]],a=1.35,o=r.map(([m,p])=>new te(m,p)),l=new ya(o,36,0,a),c=l.attributes.position;for(let m=0;m<c.count;m++){const p=c.getX(m),_=c.getZ(m),E=Math.atan2(p,_),x=Math.min(E,a-E),T=bt(.12,0,x)*(Tn(c.getY(m)*220,E*10,1e3,4)-.5)*.008,y=Math.hypot(p,_);c.setXYZ(m,p/y*(y+T*.2),c.getY(m),_/y*(y+T*.2))}l.computeVertexNormals();const h=new st,u=new st;u.add(new Be(l,n));const d=new Mr(r.slice(0,-1).map(([m,p])=>new te(m,p)));for(const m of[0,a]){const p=new Be(new Xl(d),s);p.rotation.y=m-Math.PI/2,u.add(p)}u.rotation.y=-a/2;const f=new st;f.add(u),f.rotation.x=-1.05,h.add(f);const g=new Ti().setFromObject(h),M=g.getCenter(new A);return f.position.set(-M.x,-g.min.y,-M.z),Bi("ceramic",h,[e,t])}function Fx(i){const e=Jt({size:i.size,aniso:i.aniso,normalStrength:2.8,sample:Ax()}),t=fx(.075,9,5,.62);t.scale(1.35,.72,1);const n=t.attributes.position;for(let c=0;c<n.count;c++){const h=n.getY(c),u=n.getX(c),d=n.getZ(c),f=Math.hypot(u,d),g=Math.sin(h*260+mt(u*20+1,d*20+1,1e3,3,3)*2)*.0012;f>1e-5&&n.setXYZ(c,u*(1+g/f),h,d*(1+g/f))}t.computeBoundingBox();const s=t.boundingBox.min.y;t.translate(0,-s-.004,0);const r=new Float32Array(n.count*2);for(let c=0;c<n.count;c++)r[c*2]=n.getX(c)/.09,r[c*2+1]=(n.getZ(c)+n.getY(c)*.6)/.09;t.setAttribute("uv",new zn(r,2)),t.computeVertexNormals();const a=gn(e,{roughness:1},1.4),o=new st,l=new Be(t,a);return o.add(l),Bi("sandstone",o,[e])}const zx={cork:Px,wool:Lx,slate:Dx,linen:Ix,leaf:Nx,smooth_wood:Ux,ceramic:Ox,sandstone:Fx};function Bx(i,e){return zx[i](e)}const Qn=.3,vi=.29,_o=.085,xo=.055;function kx(i){const e=new st;e.name="lamp_arm";const t=i.steel,n=new Be(Ui([[0,0],[.082,0],[.086,.004],[.087,.012],[.083,.019],[.07,.024],[.03,.028],[.018,.034],[0,.034]],64),t);e.add(n);const s=new Be(new Ls(.08,48),i.dark);s.rotation.x=Math.PI/2,s.position.y=5e-4,e.add(s);const r=new st;r.name="lamp_yaw",e.add(r),r.add(Lh(new A(0,.03,0),new A(0,_o,0),.009,t,20));const a=(re,W)=>{const oe=new st,ye=new Be(new In(re,re,W,24),t);ye.rotation.x=Math.PI/2,oe.add(ye);for(const ie of[-1,1]){const se=new Be(Ui([[0,0],[re*1.25,0],[re*1.3,.003],[re*1.2,.007],[0,.008]],24),i.dark);se.rotation.x=ie*Math.PI/2,se.position.z=ie*W/2,oe.add(se)}return oe},o=new st;o.position.y=_o,r.add(o),o.add(a(.011,.03));const l=new In(.0042,.0042,1,14);l.translate(0,.5,0);const c=new st;o.add(c);for(const re of[-.011,.011]){const W=new Be(l,t);W.scale.y=Qn,W.position.z=re,c.add(W)}const h=[];for(let re=0;re<=160;re++){const W=re/160,oe=W*Math.PI*2*26;h.push(new A(Math.cos(oe)*.0045-.012,.05+W*.16,Math.sin(oe)*.0045))}const u=new Be(Os(h,()=>8e-4,{radial:5,segments:640}),t);c.add(u);const d=new st;d.position.y=Qn,c.add(d),d.add(a(.01,.034));const f=new st;d.add(f);for(const re of[-.009,.009]){const W=new Be(l,t);W.scale.y=vi,W.position.z=re,f.add(W)}const g=new st;g.position.y=vi,f.add(g),g.add(a(.0085,.026));const M=new st;M.name="lamp_head",e.add(M);const p=Ui([[.014,-.012],[.016,0],[.032,.008],[.048,.02],[.06,.038],[.067,.06],[.07,.082],[.071,.09]],64);p.rotateX(Math.PI/2);const _=new Be(p,t);M.add(_);const E=new yn({color:"#efe6d6",roughness:.55,metalness:.2,side:dn,emissive:new Ce("#ffd9a0"),emissiveIntensity:0}),x=new Be(p,E);x.scale.setScalar(.985),x.castShadow=!1,M.add(x);const T=new Be(new is(.071,.0022,10,72),t);T.position.z=.09,M.add(T);const y=Lh(new A(0,0,-xo),new A(0,0,-.01),.0065,t,16);M.add(y);const v=new Be(new In(.013,.016,.022,24),i.dark);v.rotation.x=Math.PI/2,v.position.z=.014,M.add(v);const S=new yn({color:"#fff6e6",emissive:new Ce("#ffe2b0"),emissiveIntensity:0,roughness:.3}),L=new Be(new as(.019,24,16),S);L.position.z=.043,L.castShadow=!1,L.userData.noAO=!0,M.add(L);const R=new Lp("#ffe0b2",0,3,.62,.72,2);R.position.set(0,0,.05),R.castShadow=!0,R.shadow.mapSize.set(i.shadowSize,i.shadowSize),R.shadow.radius=i.quality==="baixa"?1:3,R.shadow.bias=-2e-4,R.shadow.normalBias=.0012,R.shadow.camera.near=.04,R.shadow.camera.far=1.4,R.shadow.camera.updateProjectionMatrix(),M.add(R);const P=new Ft;e.add(P),R.target=P;const D=.5,B=new In(.03,Math.tan(.62)*D*.72,D,40,1,!0);B.translate(0,-D/2,0),B.rotateX(-Math.PI/2);const I=new Ot({transparent:!0,depthWrite:!1,blending:Rs,side:_n,uniforms:{uColor:{value:new Ce("#ffd9a0")},uIntensity:{value:0},uLen:{value:D}},vertexShader:`
      varying vec3 vW; varying vec3 vN; varying float vAlong;
      void main(){
        vAlong = clamp(position.z / ${D.toFixed(3)}, 0.0, 1.0);
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform vec3 uColor; uniform float uIntensity;
      varying vec3 vW; varying vec3 vN; varying float vAlong;
      void main(){
        vec3 v = normalize(cameraPosition - vW);
        float edge = pow(abs(dot(normalize(vN), v)), 2.0);
        // amostras MSAA na borda extrapolam o varying: sem clamp, pow(negativo) vira NaN
        float al = clamp(vAlong, 0.0, 1.0);
        float fade = pow(1.0 - al, 1.8) * smoothstep(0.0, 0.12, al);
        float near = smoothstep(0.08, 0.35, distance(cameraPosition, vW));
        float a = edge * fade * near * uIntensity;
        gl_FragColor = vec4(uColor * a, a);
      }`}),F=new Be(B,I);F.position.z=.05,F.userData.noAO=!0,F.renderOrder=6,F.castShadow=!1,F.receiveShadow=!1,F.raycast=()=>{},M.add(F),e.traverse(re=>{re.isMesh&&!re.userData.noAO&&re!==F&&re!==x&&(re.castShadow=!0,re.receiveShadow=!0)}),_.castShadow=!0;const X=new A,z=new A,ee=new Qe;function k(re,W){e.updateMatrixWorld(!0);const oe=z.copy(W).sub(re).normalize(),ye=re.clone().addScaledVector(oe,-xo);ee.copy(e.matrixWorld).invert();const ie=ye.clone().applyMatrix4(ee);r.rotation.y=Math.atan2(-ie.z,ie.x);const Re=Math.hypot(ie.x,ie.z),tt=ie.y-_o;let Pe=Math.hypot(Re,tt);Pe=tn.clamp(Pe,Math.abs(Qn-vi)+.12,Qn+vi-.002);const Fe=Math.atan2(tt,Re),Ge=tn.clamp((Qn*Qn+Pe*Pe-vi*vi)/(2*Qn*Pe),-1,1),J=Fe+Math.acos(Ge),he=tn.clamp((Qn*Qn+vi*vi-Pe*Pe)/(2*Qn*vi),-1,1),le=Math.acos(he);c.rotation.z=J-Math.PI/2,f.rotation.z=-(Math.PI-le),e.updateMatrixWorld(!0);const be=g.getWorldPosition(X).addScaledVector(oe,xo);M.position.copy(be.applyMatrix4(ee)),M.lookAt(W),M.updateMatrixWorld(!0),P.position.copy(W.clone().applyMatrix4(ee)),P.updateMatrixWorld(!0)}function Z(re){return L.getWorldPosition(re)}function Q(re){return M.updateMatrixWorld(!0),re.set(0,0,1).transformDirection(M.matrixWorld)}function xe(re,W){S.emissiveIntensity=re*7,S.emissive.copy(W),E.emissiveIntensity=re*.5,R.intensity=re*2.6,R.color.copy(W),R.visible=re>.002,I.uniforms.uIntensity.value=re*.07,I.uniforms.uColor.value.copy(W),F.visible=re>.01}return{root:e,yaw:r,head:M,spot:R,bulbMat:S,innerMat:E,cone:F,coneMat:I,pose:k,bulbWorld:Z,aimWorld:Q,setLevel:xe,picks:[_,n]}}const Ni=.05;function Hx(i){const e=new st;e.name="magnifier",e.add(dt(Ui([[0,0],[.058,0],[.061,.004],[.06,.011],[.045,.016],[.012,.019],[0,.019]],48),i.steel)),e.add(dt(new In(.0055,.0065,.13,20),i.steel,0,.083,0));const t=dt(new In(.009,.009,.014,20),i.dark,0,.15,0);e.add(t);for(const f of[-1,1])e.add(dt(new Dn(.004,.04,.006),i.steel,f*(Ni+.008),.175,0));e.add(dt(new Dn((Ni+.008)*2+.004,.005,.006),i.steel,0,.157,0));const n=new st;n.name="magnifier_lens";const s=dt(new is(Ni+.003,.0045,16,72),i.steel);n.add(s);const r=dt(new is(Ni+5e-4,.0018,8,72),i.dark);r.position.z=-.0015,n.add(r);for(const f of[-1,1]){const g=dt(new In(.003,.003,.01,12),i.dark,f*(Ni+.009),0,0);g.rotation.z=Math.PI/2,n.add(g)}const a=new jt(i.rtSize,i.rtSize,{type:Qt,samples:i.samples});a.texture.colorSpace=dr;const o=new Ot({transparent:!0,uniforms:{tView:{value:a.texture},uOn:{value:0},uTint:{value:new Ce("#2a3a3a")}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform sampler2D tView; uniform float uOn; uniform vec3 uTint; varying vec2 vUv;
      void main(){
        vec2 d = vUv - 0.5;
        float r = length(d) * 2.0;
        // leve distorção de barril na borda, como uma lente simples
        vec2 uv = 0.5 + d * (1.0 - 0.08 * r * r);
        vec3 view = texture2D(tView, uv).rgb;
        float rim = smoothstep(0.78, 1.0, r);
        vec3 glass = uTint * 0.06;
        vec3 col = mix(glass, view, uOn) * (1.0 - rim * 0.55);
        gl_FragColor = vec4(col, mix(0.16 + rim * 0.3, 1.0, uOn));
      }`}),l=new Be(new Ls(Ni,64),o);l.castShadow=!1,l.userData.noAO=!0,n.add(l);const c=new Be(new Ls(Ni,48),new ql({color:"#ffffff",transparent:!0,opacity:.1,roughness:.04,metalness:0,clearcoat:1,depthWrite:!1}));c.position.z=8e-4,c.userData.noAO=!0,c.castShadow=!1,c.raycast=()=>{},n.add(c),n.traverse(f=>{f.isMesh&&f!==l&&f!==c&&(f.castShadow=!0)});const h=new A(0,.2,0),u=new nn().setFromEuler(new En(-.25,0,0)),d=new Mn(10,1,.01,6);return{stand:e,lens:n,lensMesh:l,rt:a,cam:d,restPos:h,restQuat:u,picks:[s,l,t],dispose(){a.dispose(),o.dispose()}}}function Oh(i,e,t,n,s){const r=new st;r.name=s;const a=.016,o=.02,l=.008;r.add(dt(un(i,l,e,.004,2),t.trayWood,0,l/2,0));const c=(h,u,d,f)=>{const g=dt(f==="x"?un(h,o,a,.006,3):un(a,o,h,.006,3),t.trayWood,u,o/2,d);r.add(g)};if(c(i,0,e/2-a/2,"x"),c(i,0,-e/2+a/2,"x"),c(e-a*2+.002,i/2-a/2,0,"z"),c(e-a*2+.002,-i/2+a/2,0,"z"),n){const h=new Be(new wn(i-a*2,e-a*2),t.felt),u=h.geometry.attributes.uv;for(let d=0;d<u.count;d++)u.setXY(d,u.getX(d)*(i-a*2)/.12,u.getY(d)*(e-a*2)/.12);h.rotation.x=-Math.PI/2,h.position.y=l+.0012,h.receiveShadow=!0,h.userData.keep=!0,r.add(h)}return{group:r,surfaceY:n?l+.0015:l}}function Vx(i){const e=new st;e.name="workbench";const t=new Be(ux(2.8,.045,1.5,.9),i.oak);t.position.set(0,-.0225,-.05),t.receiveShadow=!0,t.castShadow=!1,t.userData.keep=!0,e.add(t);const n=dt(new In(.0225,.0225,2.8,16),i.oak,0,-.0225,.7);n.rotation.z=Math.PI/2,e.add(n);const s=new Be(new wn(3.2,1.8),i.plaster),r=s.geometry.attributes.uv;for(let a=0;a<r.count;a++)r.setXY(a,r.getX(a)*3.2,r.getY(a)*1.8);return s.position.set(0,.85,-.66),s.receiveShadow=!0,s.userData.keep=!0,e.add(s),e.add(dt(un(2.8,.05,.02,.005),i.darkWood,0,.025,-.65)),e}function Gx(i,e,t){const n=new st;n.name="shelf_props";const s=new st,r=(P,D,B)=>{n.add(dt(un(B,.022,.17,.005,3),i.darkWood,P,D,-.575));for(const I of[P-B/2+.06,P+B/2-.06]){const F=new Mr;F.moveTo(0,0),F.lineTo(.09,0),F.quadraticCurveTo(.02,-.01,0,-.09),F.closePath();const X=new Sa(F,{depth:.014,bevelEnabled:!0,bevelSize:.002,bevelThickness:.002,bevelSegments:2}),z=dt(X,i.darkWood,I-.007,D-.011,-.66);z.rotation.y=-Math.PI/2,z.position.x=I+.007,n.add(z)}};r(-.55,.26,.9),r(-.2,.6,.62);const a=Bs(12),o=["#6e3b2a","#2f4a3c","#8a5a2b","#3c4a5e","#a5432f","#5b4636","#c19a5b","#2d3b33","#7b6a4e","#4a2f2a"],l=new Aa(1,1,1,2,.06),c=[],h=[];let u=-.97;for(;u<-.18;){const P=.018+a()*.022,D=.15+a()*.07,B=.12+a()*.03,I=u>-.3?0:a()<.08?.18:(a()-.5)*.03,F=new Qe().compose(new A(u+P/2,.271+D/2-Math.abs(I)*.01,-.57+(a()-.5)*.01),new nn().setFromEuler(new En(0,(a()-.5)*.04,I)),new A(P,D,B));c.push(F),h.push(new Ce(o[Math.floor(a()*o.length)]).multiplyScalar(.85+a()*.3)),u+=P+.0015+(I>.1?.03:0),a()<.06&&(u+=.05)}for(let P=0;P<4;P++){const D=.022+a()*.012;c.push(new Qe().compose(new A(0+(a()-.5)*.01,.611+D/2+P*(D+.001)+P*.004,-.57),new nn().setFromEuler(new En(0,(a()-.5)*.25,0)),new A(.17-P*.012,D,.12))),h.push(new Ce(o[Math.floor(a()*o.length)]))}const d=new dl(l,i.cloth,c.length);c.forEach((P,D)=>{d.setMatrixAt(D,P),d.setColorAt(D,h[D])}),d.castShadow=!0,d.receiveShadow=!0,n.add(d);const f=dt(Ui([[0,0],[.034,0],[.037,.006],[.038,.05],[.036,.095],[.039,.1],[.035,.102],[.032,.03],[0,.03]],40),i.ceramic,-.37,.611,-.56);n.add(f);const g=new yn({color:"#7a4a2a",roughness:.45}),M=new yn({color:"#3a2a1e",roughness:.8});for(let P=0;P<6;P++){const D=P/6*Math.PI*2,B=.12+a()*.15,I=new A(-.37+Math.cos(D)*.012,.64,-.56+Math.sin(D)*.012),F=new A(Math.cos(D)*B,1,Math.sin(D)*B).normalize(),X=.16+a()*.06,z=I.clone().addScaledVector(F,X);n.add(new Be(Os([I,I.clone().addScaledVector(F,X*.5),z],Z=>.0042*(1-Z*.35),{radial:10,segments:10}),g));const ee=dt(new In(.0034,.0036,.02,14),i.brass);ee.position.copy(z.clone().addScaledVector(F,.01)),ee.quaternion.setFromUnitVectors(new A(0,1,0),F),n.add(ee);const k=dt(Ui([[.0033,0],[.0042,.008],[.003,.02],[0,.028]],12),M);k.position.copy(z.clone().addScaledVector(F,.02)),k.quaternion.setFromUnitVectors(new A(0,1,0),F),n.add(k)}const m=dt(Ui([[0,0],[.04,0],[.048,.07],[.052,.075],[.047,.076],[.04,.012],[0,.012]],40),i.ceramic,-.17,.611,-.54);n.add(m);const p=dt(new Ls(.044,24),new yn({color:"#3b2a1e",roughness:1}),-.17,.676,-.54);p.rotation.x=-Math.PI/2,n.add(p);const _=new yn({color:"#4c6b2c",roughness:.7}),E=vx({size:Math.min(256,t),palette:["#4f7d32"],aspect:.62}),x=new yn({map:E,alphaTest:.45,side:_n,roughness:.55});Dh(x,{strength:e.strength,time:e.time,mode:"leaves"});const T=new Hu({depthPacking:$d,map:E,alphaTest:.45});Dh(T,{strength:e.strength,time:e.time,mode:"leaves"});const y=new wn(1,1,3,3),v=y.attributes.position;for(let P=0;P<v.count;P++)v.setZ(P,Math.abs(v.getX(P))*.25-v.getY(P)*.1);y.translate(0,.5,0),y.computeVertexNormals();const S=[],L=[{dx:0,fall:.55,out:.12},{dx:.05,fall:.42,out:.1},{dx:-.05,fall:.48,out:.15},{dx:.09,fall:.3,out:.08},{dx:-.1,fall:.25,out:.06}];for(const[P,D]of L.entries()){const B=[],I=-.17+D.dx*.4;for(let z=0;z<=8;z++){const ee=z/8,k=Math.min(1,ee*3);B.push(new A(I+D.dx*ee*1.4+Math.sin(ee*5+P)*.02,.69-Math.max(0,ee-.25)*D.fall+Math.sin(k*Math.PI)*.015,-.54+k*D.out))}const F=new Ma(B);n.add(new Be(Os(B,z=>.0022*(1-z*.5),{radial:6,segments:40}),_));const X=14+P*2;for(let z=1;z<X;z++){const ee=z/X,k=F.getPointAt(ee),Z=F.getTangentAt(ee),Q=z%2?1:-1,xe=.028+(1-ee)*.018+a()*.01,re=new nn().setFromEuler(new En(-.3+a()*.5,Math.atan2(Z.x,Z.z)+Q*1.2,Q*(.5+a()*.6)));S.push(new Qe().compose(k,re,new A(xe*.75,xe,xe)))}}for(let P=0;P<10;P++){const D=P/10*Math.PI*2,B=new A(-.17+Math.cos(D)*.025,.68,-.54+Math.sin(D)*.025),I=new nn().setFromEuler(new En(-.4+a()*.3,D+Math.PI/2,.3));S.push(new Qe().compose(B,I,new A(.04,.05,.05)))}const R=new dl(y,x,S.length);return S.forEach((P,D)=>R.setMatrixAt(D,P)),R.customDepthMaterial=T,R.castShadow=!0,R.receiveShadow=!0,s.add(R),{group:n,animated:s}}function Wx(i){return yr(i,Math.round(i*1.3),e=>{const t=i,n=Math.round(i*1.3);e.fillStyle="#f1e5c9",e.fillRect(0,0,t,n);for(let o=0;o<900;o++){e.strokeStyle=`rgba(150,120,80,${.03+Math.random()*.04})`,e.lineWidth=.6;const l=Math.random()*t,c=Math.random()*n;e.beginPath(),e.moveTo(l,c),e.lineTo(l+(Math.random()-.5)*14,c+(Math.random()-.5)*6),e.stroke()}e.save(),e.translate(t/2,n*.86),e.rotate(-.12);const s=n*.7,r=t*.3,a=e.createLinearGradient(-r,0,r,0);a.addColorStop(0,"#5e8a4a"),a.addColorStop(.5,"#7aa05c"),a.addColorStop(1,"#4d763c"),e.fillStyle=a,e.beginPath(),e.moveTo(0,0),e.bezierCurveTo(r*1.3,-s*.3,r*.9,-s*.8,0,-s),e.bezierCurveTo(-r*.9,-s*.8,-r*1.3,-s*.3,0,0),e.fill(),e.strokeStyle="#e9e2c4",e.lineWidth=t*.012,e.beginPath(),e.moveTo(0,n*.05),e.lineTo(0,-s*.96),e.stroke(),e.lineWidth=t*.006;for(let o=1;o<9;o++){const l=-s*o*.1,c=Math.sin(o/9*Math.PI);e.beginPath(),e.moveTo(0,l),e.quadraticCurveTo(r*.5*c,l-s*.04,r*.95*c,l-s*.12),e.moveTo(0,l),e.quadraticCurveTo(-r*.5*c,l-s*.04,-r*.95*c,l-s*.12),e.stroke()}e.restore(),e.fillStyle="rgba(60,50,35,0.7)",e.font=`italic ${Math.round(t*.045)}px Georgia, serif`,e.textAlign="center",e.fillText("Folium · estudo de nervuras",t/2,n*.95)})}function Xx(i){return yr(i*2,i,e=>{const t=i*2,n=i,s=e.createImageData(t,n);for(let r=0;r<n;r++)for(let a=0;a<t;a++){const o=a/t,l=r/n,h=mt(o*6,l*3,6,5,77)>.53,u=(r*t+a)*4,d=.9+mt(o*30,l*15,30,3,5)*.15,f=h?[196,160,104]:[120,150,140];s.data[u]=f[0]*d,s.data[u+1]=f[1]*d,s.data[u+2]=f[2]*d,s.data[u+3]=255}e.putImageData(s,0,0),e.strokeStyle="rgba(70,55,35,0.35)",e.lineWidth=1;for(let r=1;r<12;r++)e.beginPath(),e.moveTo(r/12*t,0),e.lineTo(r/12*t,n),e.stroke();for(let r=1;r<6;r++)e.beginPath(),e.moveTo(0,r/6*n),e.lineTo(t,r/6*n),e.stroke()})}function qx(i,e){const t=new st,n=.26,s=.33,r=new st,a=.022;r.add(dt(un(n,a,.018,.004),i.trayWood,0,s/2-a/2,0)),r.add(dt(un(n,a,.018,.004),i.trayWood,0,-s/2+a/2,0)),r.add(dt(un(a,s,.018,.004),i.trayWood,n/2-a/2,0,0)),r.add(dt(un(a,s,.018,.004),i.trayWood,-n/2+a/2,0,0));const o=new Be(new wn(n-a*2,s-a*2),new yn({map:Wx(Math.min(512,e)),roughness:.92}));o.position.z=-.002,o.receiveShadow=!0,r.add(o),r.position.set(.3,.62,-.645),t.add(r);const l=new Mr;l.moveTo(-.035,0),l.lineTo(.035,0),l.lineTo(.035,.05),l.lineTo(0,.08),l.lineTo(-.035,.05),l.closePath();const c=dt(new Sa(l,{depth:.05,bevelEnabled:!0,bevelSize:.003,bevelThickness:.003,bevelSegments:3}),i.trayWood,.08,.611,-.6);t.add(c);for(const[h,u]of[[-.012,.03],[.012,.03],[0,.058]])t.add(dt(un(.009,.012,.004,.001),i.darkWood,.08+h,.611+u,-.546));return t}function $x(i,e){const t=new st;t.name="sample_drawer";const n=.36,s=.3,r=.24;t.add(dt(un(n,s,r,.008,3),i.trayWood,0,s/2,0)),t.add(dt(un(n+.02,.016,r+.02,.005,3),i.trayWood,0,s+.008,0));const a=3,o=2,l=(n-.03)/o,c=(s-.04)/a,h=yr(128,48,m=>{m.fillStyle="#efe3c6",m.fillRect(0,0,128,48),m.fillStyle="rgba(60,45,30,0.75)",m.font="italic 22px Georgia, serif",m.textAlign="center",m.fillText("amostras",64,32)}),u=new yn({map:h,roughness:.9});let d=null;for(let m=0;m<a;m++)for(let p=0;p<o;p++){const _=new st,E=-n/2+.015+l*(p+.5),x=.02+c*(m+.5);_.position.set(E,x,r/2),_.add(dt(un(l-.008,c-.008,.016,.004,2),i.trayWood,0,0,.004)),_.add(dt(un(l-.02,c-.02,r-.04,.002,1),i.darkWood,0,-.002,-.19999999999999998/2));const T=dt(un(.05,.022,.003,.001),i.brass,0,.012,.0135);_.add(T);const y=new Be(new wn(.042,.015),u);y.position.set(0,.012,.0152),_.add(y);const v=dt(new is(.009,.0018,8,20,Math.PI),i.brass,0,-.014,.0145);v.rotation.z=Math.PI,_.add(v),m===a-1&&p===0&&(d=_,_.userData.keep=!0,_.traverse(S=>S.userData.keep=!0)),t.add(_)}const f=new st;f.add(dt(Ui([[0,0],[.045,0],[.047,.006],[.03,.014],[.008,.02],[.006,.05],[0,.05]],32),i.darkWood));const g=dt(new as(.075,48,32),new ql({map:Xx(Math.min(256,e)),roughness:.5,clearcoat:.6,clearcoatRoughness:.3}),0,.13,0);g.rotation.z=.4,f.add(g);const M=dt(new is(.082,.0026,10,64,Math.PI*1.25),i.brass,0,.13,0);return M.rotation.set(0,Math.PI/2,.4-.4),f.add(M),f.position.set(.06,s+.016,0),t.add(f),{group:t,drawer:d,drawerFront:new A(-n/2+.015+l*.5,.02+c*(a-.5),r/2)}}const Cn=new A(0,0,.05),ia=.52,Mo=.37,Yx={wool:[-.47,-.36,.05],slate:[-.17,-.4,0],linen:[.14,-.39,-.03],sandstone:[.42,-.36,-.08],leaf:[-.53,.3,.1],ceramic:[.62,-.06,-.3],smooth_wood:[.58,.3,-.18],cork:[.32,.4,.12]},Zs=.23,Ks=.18,Zx=new A(-.47,0,-.02),So=new A(.36,0,.12),Fh=new A(.66,0,-.5),yo=.31,zh={sala:()=>({sunColor:new Ce("#fff0dc"),sunInt:3.2,sunPos:new A(-1.1,1.9,1.3),sky:new Ce("#e9eef3"),ground:new Ce("#8b6a48"),hemiInt:.62,exposure:.95,lampColor:new Ce("#ffe6c4"),gain:new A(1,.995,.975),lift:new A(.012,.01,.008),sat:1.04,envInt:.55}),tarde:()=>({sunColor:new Ce("#ffbe82"),sunInt:3,sunPos:new A(-1.7,1.05,.7),sky:new Ce("#f1d3b3"),ground:new Ce("#6d4a2e"),hemiInt:.5,exposure:1,lampColor:new Ce("#ffd9a8"),gain:new A(1.04,.985,.92),lift:new A(.018,.01,0),sat:1.06,envInt:.5}),noite:()=>({sunColor:new Ce("#9fb2d6"),sunInt:.35,sunPos:new A(-.8,1.7,1.1),sky:new Ce("#3b4762"),ground:new Ce("#2b2019"),hemiInt:.22,exposure:1.18,lampColor:new Ce("#ffd49a"),gain:new A(1.02,.98,.94),lift:new A(.01,.008,.012),sat:1,envInt:.28})};function Bh(i,e,t,n){return n.sunColor.lerpColors(i.sunColor,e.sunColor,t),n.sunInt=tn.lerp(i.sunInt,e.sunInt,t),n.sunPos.lerpVectors(i.sunPos,e.sunPos,t),n.sky.lerpColors(i.sky,e.sky,t),n.ground.lerpColors(i.ground,e.ground,t),n.hemiInt=tn.lerp(i.hemiInt,e.hemiInt,t),n.exposure=tn.lerp(i.exposure,e.exposure,t),n.lampColor.lerpColors(i.lampColor,e.lampColor,t),n.gain.lerpVectors(i.gain,e.gain,t),n.lift.lerpVectors(i.lift,e.lift,t),n.sat=tn.lerp(i.sat,e.sat,t),n.envInt=tn.lerp(i.envInt,e.envInt,t),n}const bo=i=>({...i,sunColor:i.sunColor.clone(),sunPos:i.sunPos.clone(),sky:i.sky.clone(),ground:i.ground.clone(),lampColor:i.lampColor.clone(),gain:i.gain.clone(),lift:i.lift.clone()});function Kx(){return yr(128,128,i=>{const e=i.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(0,0,0,1)"),e.addColorStop(.55,"rgba(0,0,0,0.55)"),e.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=e,i.fillRect(0,0,128,128)},!1)}function kh(i,e){return yr(256,72,t=>{t.fillStyle=e?"#f6edd8":"#efe3c6",t.fillRect(0,0,256,72),t.strokeStyle="rgba(120,95,60,0.35)",t.lineWidth=2,t.strokeRect(5,5,246,62),t.fillStyle="#2b3a2e",t.font='600 30px Georgia, "Times New Roman", serif',t.textAlign="center",t.textBaseline="middle",t.fillText(i,e?140:128,38),e&&(t.fillStyle="#254533",t.beginPath(),t.arc(30,36,13,0,Math.PI*2),t.fill(),t.strokeStyle="#f6edd8",t.lineWidth=4,t.beginPath(),t.moveTo(23,36),t.lineTo(28,42),t.lineTo(38,30),t.stroke())})}const Jx=(i,e)=>((e-i)%360+540)%360-180;class Qx{engine;samples=new Map;textures=[];lamp;mag;sun;hemi;envScene;envMats=null;dust;wind={strength:{value:.5},time:{value:0}};heroRoot=new st;slots=[new st,new st];slotContent=[null,null];slotPop=[1,1];minis=new Map;trays=new Map;tags=new Map;colliders=[];heroColliders=[];contact=[];ring;ringTarget=null;drawer;drawerFront=new A;drawerOpen=0;drawerWant=0;input=null;rot=0;az=-35;el=28;lampLevel=1;roomMode=1;magT=0;sweepPhase=0;presetFrom;presetTo;presetCur;presetT=1;presetName="tarde";envDirty=!1;shadowDirty=!0;viewName="bancada";insets={right:0,bottom:0};saving=null;hiddenForView=[];tmpV=new A;tmpV2=new A;plane=new ti(new A(0,1,0),0);reducedMotion=!1;sweepAngle=0;constructor(e){this.engine=e}async build(e){const t=this.engine,n=t.quality,s=n==="baixa"?256:512,r=n==="alta"?1024:512,a=t.aniso;let o=0;const l=22,c=async()=>{o++,e(Math.min(1,o/l),vo[Math.min(vo.length-1,Math.floor(o/l*vo.length))]),await lx()},h=ie=>(this.textures.push(ie),ie),u=h(Jt({size:r,aniso:a,normalStrength:1.6,sample:ca({light:"#e0a868",dark:"#a76c3d",planks:4,grainScale:.9,gloss:.45,seed:5})}));await c();const d=h(Jt({size:s,aniso:a,normalStrength:1.4,sample:ca({light:"#e2b27a",dark:"#a8713f",grainScale:1.3,gloss:.5,seed:9})}));await c();const f=h(Jt({size:s,aniso:a,normalStrength:1.4,sample:ca({light:"#9a6438",dark:"#5a3418",grainScale:1.1,gloss:.35,seed:13})}));await c();const g=h(Jt({size:s,aniso:a,normalStrength:2.2,sample:Mx("#566f36")}));await c();const M=h(Jt({size:s,aniso:a,normalStrength:1.8,sample:Rx("#dcc7a8")}));await c();const m=h(Jt({size:s,aniso:a,normalStrength:.6,sample:Uh("#d2d0cc")}));await c();const p=h(Jt({size:Math.min(256,s),aniso:a,normalStrength:.6,sample:Uh("#caa064",61)})),_=h(Jt({size:Math.min(256,s),aniso:a,normalStrength:1,sample:Cx()})),E=h(Jt({size:Math.min(256,s),aniso:a,normalStrength:1.6,sample:cx("#ffffff",3,96)}));await c();const x={oak:gn(u,{roughness:1},.8),trayWood:gn(d,{roughness:1},.7),darkWood:gn(f,{roughness:1},.7),felt:gn(g,{roughness:1},1.2),plaster:gn(M,{roughness:1},1),steel:gn(m,{metalness:1,roughness:1,color:"#e4e2de"},.4),brass:gn(p,{metalness:1,roughness:1},.4),paper:gn(_,{roughness:1}),ceramic:Ta(_,{color:"#f0e6d4",roughness:.45,clearcoat:.5,clearcoatRoughness:.35},.2),cloth:gn(E,{roughness:1},.8)};x.plaster.map.repeat.set(1/.7,1/.7),x.plaster.normalMap.repeat.set(1/.7,1/.7),x.plaster.roughnessMap.repeat.set(1/.7,1/.7);for(const ie of[x.trayWood,x.darkWood])for(const se of[ie.map,ie.normalMap,ie.roughnessMap])se.repeat.set(4,4);const T=new yn({color:"#2e2a27",roughness:.45,metalness:.6});for(const ie of ii){const se=Bx(ie,{size:s,heroSize:ie==="cork"?r:s,aniso:a});se.textures.forEach(h),this.samples.set(ie,se),await c()}const y=t.scene;y.background=new Ce("#2a211b"),y.fog=new zl("#2a211b",2.6,6);const v=new st;v.add(Vx(x));const S=Gx(x,this.wind,s);v.add(S.group),v.add(qx(x,s));const L=$x(x,s);L.group.position.copy(Fh),L.group.rotation.y=-.38,this.drawer=L.drawer,L.group.remove(L.drawer),v.add(L.group),await c();const R=Oh(ia,Mo,x,!0,"tray_felt");R.group.position.copy(Cn),v.add(R.group),this.heroRoot.position.set(Cn.x,R.surfaceY,Cn.z);for(const ie of this.slots)this.heroRoot.add(ie);y.add(this.heroRoot);for(const ie of ii){const[se,Re,tt]=Yx[ie],Fe=Oh(Zs,Ks,x,ie==="cork"||ie==="sandstone"||ie==="ceramic",`tray_${ie}`),Ge=new st;Ge.position.set(se,0,Re),Ge.rotation.y=tt,Ge.add(Fe.group);const J=this.samples.get(ie).object.clone(!0),he=Math.min(.62,(Zs-.05)/this.samples.get(ie).size);J.scale.setScalar(he),J.position.y=Fe.surfaceY,Ge.add(J),this.minis.set(ie,J);const le=kh(At[ie].name,!1),be=kh(At[ie].name,!0),de=new Be(new wn(.075,.021),new yn({map:le,roughness:.9}));de.rotation.x=-Math.PI/2,de.position.set(0,.0012,Ks/2+.022),de.receiveShadow=!0,Ge.add(de),this.tags.set(ie,{mesh:de,normal:le,chosen:be});const We=new Be(new Dn(Zs,.09,Ks+.05),new Xn({visible:!1}));We.position.set(0,.045,.02),We.userData.pick={kind:"tray",id:ie},Ge.add(We),this.colliders.push(We),this.trays.set(ie,Ge),y.add(Ge)}const P=px(v);P.name="statics",y.add(P),y.add(S.animated);const D=new st;D.position.copy(Fh),D.rotation.y=-.38,D.add(this.drawer),y.add(D),D.updateMatrixWorld(!0),this.drawerFront.copy(L.drawerFront).applyMatrix4(D.matrixWorld);const B=new Be(new Dn(.36,.3,.25),new Xn({visible:!1}));B.position.set(0,.15,0),B.userData.pick={kind:"drawer"},D.add(B),this.colliders.push(B),await c(),this.lamp=kx({steel:x.steel,dark:T,shadowSize:n==="alta"?2048:1024,quality:n}),this.lamp.root.position.copy(Zx),y.add(this.lamp.root);for(const ie of this.lamp.picks)ie.userData.pick={kind:"lamp"};this.colliders.push(...this.lamp.picks),this.mag=Hx({steel:x.steel,dark:T,rtSize:n==="baixa"?256:512,samples:n==="baixa"?0:4}),this.mag.stand.position.copy(So),this.mag.stand.rotation.y=-.5,y.add(this.mag.stand),y.add(this.mag.lens);for(const ie of this.mag.picks)ie.userData.pick={kind:"magnifier"};this.colliders.push(...this.mag.picks),this.mag.stand.updateMatrixWorld(!0),this.mag.restPos.applyMatrix4(this.mag.stand.matrixWorld),this.mag.restQuat.premultiply(new nn().setFromEuler(this.mag.stand.rotation)),this.mag.lens.position.copy(this.mag.restPos),this.mag.lens.quaternion.copy(this.mag.restQuat),await c();for(let ie=0;ie<2;ie++){const se=new Be(new Dn(1,1,1),new Xn({visible:!1}));se.userData.pick={kind:"hero"},this.slots[ie].add(se),this.heroColliders.push(se),this.colliders.push(se)}const I=Kx(),F=new Xn({map:I,transparent:!0,depthWrite:!1,opacity:.4,color:"#000000"}),X=(ie,se,Re,tt=8e-4,Pe=.4)=>{const Fe=new Be(new wn(se,Re),Pe===.4?F:F.clone());return Fe.material.opacity=Pe,Fe.rotation.x=-Math.PI/2,Fe.position.y=tt,Fe.userData.noAO=!0,Fe.renderOrder=1,Fe.raycast=()=>{},ie.add(Fe),Fe};for(const ie of this.slots)this.contact.push(X(ie,.3,.24,6e-4,.32));X(this.lamp.root,.24,.24,4e-4,.5),X(y,.17,.17,4e-4,.45).position.set(So.x,4e-4,So.z),X(y,ia+.1,Mo+.1,3e-4,.35).position.set(Cn.x,3e-4,Cn.z);for(const ie of ii)X(this.trays.get(ie),Zs+.07,Ks+.07,3e-4,.3);this.ring=new Be(new Wl(.5,.53,96),new Xn({color:"#fff2d2",transparent:!0,opacity:0,depthWrite:!1,blending:Rs})),this.ring.rotation.x=-Math.PI/2,this.ring.userData.noAO=!0,this.ring.raycast=()=>{},this.ring.renderOrder=7,y.add(this.ring),this.sun=new jc("#fff0dc",3),this.engine.configureShadow(this.sun,n==="alta"?2048:1024,4);const k=this.sun.shadow.camera;k.left=-1.05,k.right=1.05,k.top=.95,k.bottom=-.95,k.near=.2,k.far=5,k.updateProjectionMatrix(),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.003,this.sun.target.position.set(0,0,-.15),y.add(this.sun,this.sun.target),this.hemi=new Yc("#e9eef3","#8b6a48",.6),y.add(this.hemi),this.dust=gx({count:n==="baixa"?160:n==="media"?320:520,min:new A(-.6,.02,-.4),max:new A(.35,.55,.45),size:.55,base:0,color:"#ffe0b4",beams:[{origin:new A,dir:new A(1,-1,0).normalize(),length:.5,radius:.11}]}),y.add(this.dust.object),await c(),this.envScene=new ul;const Z=new Xn({color:"#7d6550",side:dn}),Q=new Be(new Dn(6,3,6),Z);Q.position.y=1.2,this.envScene.add(Q);const xe=new Xn({color:"#ffe8c8"}),re=new Be(new wn(1.6,1.2),xe);re.position.set(-2.95,1.4,.6),re.rotation.y=Math.PI/2,this.envScene.add(re);const W=new Xn({color:"#ffd9a0"}),oe=new Be(new as(.25,16,12),W);oe.position.set(-.8,1,.2),this.envScene.add(oe);const ye=new Be(new wn(6,6),new Xn({color:"#a26b3d"}));ye.rotation.x=-Math.PI/2,ye.position.y=-.2,this.envScene.add(ye),this.envMats={wall:Z,window:xe,glow:W},this.presetCur=zh[this.presetName](),this.presetFrom=bo(this.presetCur),this.presetTo=bo(this.presetCur),this.applyPreset(this.presetCur),this.regenEnv(),this.engine.controls.enablePan=!1,this.engine.controls.minDistance=.16,this.engine.controls.maxDistance=1.7,this.engine.controls.minPolarAngle=.2,this.engine.controls.maxPolarAngle=1.45,this.engine.controls.minAzimuthAngle=-1.15,this.engine.controls.maxAzimuthAngle=1.15,this.engine.onResize(()=>this.applyFraming()),this.setView("bancada",!1),this.engine.onUpdate((ie,se)=>this.update(ie,se)),this.built=!0,this.pending&&this.apply(this.pending),await c()}applyPreset(e){const t=this.lampLevel,n=tn.lerp(1,.42,this.roomMode*t),s=1-this.roomMode;this.sun.color.copy(e.sunColor),this.sun.intensity=e.sunInt*n*(1-s*.25),this.sun.position.copy(e.sunPos),this.sun.shadow.radius=4+s*6,this.hemi.color.copy(e.sky),this.hemi.groundColor.copy(e.ground),this.hemi.intensity=e.hemiInt*(.75+n*.25)*(1+s*.7),this.engine.renderer.toneMappingExposure=e.exposure;const r=this.engine.grade.uniforms;r.uGain.value.copy(e.gain),r.uLift.value.copy(e.lift),r.uSat.value=e.sat,r.uContrast.value=1.05,r.uVignette.value=.42,this.engine.scene.environmentIntensity=e.envInt*(.7+n*.3),this.lamp.setLevel(this.lampLevel,e.lampColor)}regenEnv(){if(!this.envMats)return;const e=this.presetCur;this.envMats.wall.color.copy(e.ground).lerp(new Ce("#a08870"),.5).multiplyScalar(.6+e.hemiInt*.5),this.envMats.window.color.copy(e.sunColor).multiplyScalar(.6+e.sunInt*.4),this.envMats.glow.color.copy(e.lampColor).multiplyScalar(1+this.lampLevel*2);const t=this.engine.scene.environment;this.engine.scene.environment=this.engine.envFrom(this.envScene,.06),t?.dispose()}setPreset(e,t=!1){e===this.presetName&&this.presetT>=1||(this.presetName=e,this.presetFrom=bo(this.presetCur),this.presetTo=zh[e](),this.presetT=t?1:0,t&&(Bh(this.presetFrom,this.presetTo,1,this.presetCur),this.envDirty=!0))}built=!1;pending=null;apply(e){if(!this.built){this.pending=e;return}const t=this.input;this.input=e,(!t||t.preset!==e.preset)&&this.setPreset(e.preset,!t),t||(this.rot=e.rotation,this.az=e.lampAngle,this.el=e.lampElevation,this.lampLevel=e.lampOn?1:0,this.roomMode=e.lampOn?1:0),e.lampSweep&&(!t||!t.lampSweep)&&(this.sweepPhase=Math.asin(tn.clamp(this.az/70,-1,1)));const n=e.compare?[e.compare[0],e.compare[1]]:[e.sampleId,null];for(let s=0;s<2;s++)n[s]!==this.slotContent[s]&&this.fillSlot(s,n[s]);this.layoutSlots();for(const s of ii){const r=n.includes(s),a=this.minis.get(s);a.visible=!r;const o=this.tags.get(s),l=e.chosen.includes(s),c=o.mesh.material,h=l?o.chosen:o.normal;c.map!==h&&(c.map=h,c.needsUpdate=!0);const u=this.trays.get(s),d=e.allowed.includes(s);u.visible=!0,u.position.y=l&&e.stepId==="escolher"?.004:0,a.traverse(f=>{f.isMesh&&(f.visible=d||r)})}this.shadowDirty=!0}fillSlot(e,t){const n=this.slots[e],s=this.slotContent[e];if(s){const r=this.samples.get(s).object;r.parent===n&&n.remove(r)}if(this.slotContent[e]=t,t){const r=this.samples.get(t).object;r.removeFromParent(),this.slotContent[1-e]===t&&(this.slotContent[1-e]=null),n.add(r),this.slotPop[e]=this.reducedMotion?1:0}n.visible=!!t}layoutSlots(){const e=!!(this.input&&this.input.compare);let t=1;if(e){const n=this.slotContent[0]?this.samples.get(this.slotContent[0]).size:.2,s=this.slotContent[1]?this.samples.get(this.slotContent[1]).size:.2;t=Math.min(1,.215/Math.max(n,s))}for(let n=0;n<2;n++){const s=this.slotContent[n],r=this.slots[n];if(r.position.set(e?n===0?-.118:.118:0,0,0),r.visible=!!s,!s)continue;const a=this.samples.get(s),o=e?t:Math.min(1,(ia-.09)/a.size);a.object.scale.setScalar(o),r.userData.scale=o;const l=this.heroColliders[n];l.scale.set(a.size*o,Math.max(.03,a.height*o),a.size*o*.8),l.position.y=a.height*o/2,this.contact[n].scale.set(a.size*o/.26,a.size*o/.3,1)}}viewFor(e){const n=this.engine.camera.aspect<.85,s=this.heroCenter(this.tmpV);let r;switch(e){case"geral":r={label:"Vista geral",position:[.06,.78,1.08],target:[.02,.04,-.14]};break;case"perto":r={label:"Perto",position:[s.x+.02,s.y+.2,s.z+.23],target:[s.x,s.y,s.z]};break;case"rente":r={label:"Rente à mesa",position:[s.x+.3,.075,s.z+.34],target:[s.x-.02,s.y*.6,s.z-.02]};break;case"luz":{const a=this.lamp.bulbWorld(new A),o=this.lamp.aimWorld(new A),l=a.clone().addScaledVector(o,.03),c=l.clone().addScaledVector(o,.3);r={label:"Do lugar da luz",position:[l.x,l.y,l.z],target:[c.x,c.y,c.z]};break}default:r={label:"Bancada",position:[.04,.44,.76],target:[0,.05,-.04]}}if(n&&e!=="luz"){const a=new A(...r.position),o=new A(...r.target),l=e==="perto"?1.45:e==="rente"?1.5:1.95,c=a.clone().sub(o);e==="bancada"&&(o.x-=.1,c.y*=1.25),a.copy(o).addScaledVector(c,l),r={...r,position:[a.x,a.y,a.z],target:[o.x,o.y,o.z]}}return r}get currentView(){return this.viewName}setView(e,t=!this.reducedMotion){const n=this.engine.camera;this.viewName==="luz"&&e!=="luz"&&(this.hiddenForView.forEach(s=>s.visible=!0),this.hiddenForView=[],n.near=.05,n.updateProjectionMatrix(),this.engine.controls.enabled=!0),this.viewName=e,e==="luz"&&(this.hiddenForView=[this.lamp.head],this.lamp.head.visible=!1,n.near=.004,n.updateProjectionMatrix(),this.engine.controls.enabled=!1,this.shadowDirty=!0),this.engine.setView(this.viewFor(e),t)}refreshView(e=!1){this.setView(this.viewName,e)}setInsets(e,t){this.insets={right:e,bottom:t},this.applyFraming()}applyFraming(){const e=this.engine.camera,t=this.engine.renderer.domElement.getBoundingClientRect(),n=Math.max(1,t.width),s=Math.max(1,t.height),r=Math.min(this.insets.right*.5,n*.22),a=Math.min(this.insets.bottom*.5,s*.3);r<1&&a<1?e.clearViewOffset():e.setViewOffset(n,s,r,a,n,s),e.updateProjectionMatrix()}heroCenter(e){let t=.04;const n=this.slotContent[0];return n&&(t=this.samples.get(n).height*(this.slots[0].userData.scale??1)),e.set(Cn.x,this.heroRoot.position.y+t*.5,Cn.z)}pick(e,t){const n=this.engine.pick(e,t,this.colliders,!1);for(const s of n){let r=s.object;for(;r&&!r.userData.pick;)r=r.parent;if(!r||!r.visible||r.parent&&!r.parent.visible)continue;const a=r.userData.pick;if(a.kind==="hero"){const o=this.heroColliders.indexOf(r),l=this.slotContent[o];if(!l)continue;return{kind:"hero",id:l,point:s.point.clone()}}return{kind:a.kind,id:a.id,point:s.point.clone()}}return null}trayPoint(e,t){const n=this.engine.ray(e,t);this.plane.constant=-(this.heroRoot.position.y+.02);const s=n.intersectPlane(this.plane,this.tmpV2);return s?[s.x-Cn.x,s.z-Cn.z]:null}highlight(e){let t=null;if(e?.kind==="tray"&&e.id?t=this.trays.get(e.id):e?.kind==="hero"?t=this.heroRoot:e?.kind==="lamp"?t=this.lamp.root:e?.kind==="magnifier"&&(t=this.mag.stand),this.ringTarget=t,!t)return;const n=t.getWorldPosition(this.tmpV);this.ring.position.set(n.x,.002,n.z),e?.kind==="tray"?this.ring.scale.set((Zs+.04)/1,(Ks+.06)/1,1).multiplyScalar(1.02):e?.kind==="hero"?this.ring.scale.set(ia+.04,Mo+.04,1):this.ring.scale.set(.2,.2,1),this.ring.rotation.z=t===this.trays.get(e?.id)?-t.rotation.y:0}screenOf(e){const t=e.point.clone().project(this.engine.camera),n=this.engine.renderer.domElement.getBoundingClientRect();return{x:n.left+(t.x+1)/2*n.width,y:n.top+(1-t.y)/2*n.height}}playSave(e){const t=this.samples.get(e),n=this.slotContent.indexOf(e),s=new A;let r=.6;n>=0?(this.slots[n].getWorldPosition(s),r=this.slots[n].userData.scale??1):this.trays.get(e).getWorldPosition(s);const a=t.object.clone(!0);a.scale.setScalar(r),a.position.copy(s),a.rotation.y=tn.degToRad(this.rot),this.engine.scene.add(a);const l=this.drawerFront.clone().clone().add(new A(Math.sin(-.38)*.12,.02,Math.cos(-.38)*.12)),c=new Ma([s.clone(),s.clone().lerp(l,.3).add(new A(0,.22,0)),l.clone().add(new A(0,.12,0)),l.clone().add(new A(0,.01,-.04))]);return this.drawerWant=1,new Promise(h=>{if(this.reducedMotion){a.removeFromParent(),this.drawerWant=1,window.setTimeout(()=>{this.drawerWant=0,h()},350);return}this.saving={obj:a,curve:c,t:0,dur:1.25,s0:r,resolve:h}})}renderThumbs(e=224,t=!1){const n=this.engine.renderer,s=new ul;s.environment=this.engine.scene.environment,s.environmentIntensity=.7,s.background=new Ce("#e9dcc2");const r=new jc("#ffe9cc",3.2);r.position.set(-.6,.35,.3),s.add(r,new Yc("#f4ead8","#6d5440",.9));const a=new Mn(t?16:30,1,.01,5),o={},l=document.createElement("canvas");l.width=l.height=e;const c=l.getContext("2d"),h=n.getRenderTarget(),u=n.getScissorTest(),d=n.domElement,f=n.getPixelRatio(),g=Math.round(e/f),M=n.autoClear;n.autoClear=!0;for(const p of ii){const _=this.samples.get(p),E=_.object.clone(!0);E.scale.setScalar(1),E.rotation.y=0,E.position.set(0,0,0),s.add(E);const x=new A(0,_.height*.45,0),T=t?_.size*.9:_.size*2.1+.02;a.position.set(x.x+T*.05,x.y+T*.75,x.z+T*.7),a.lookAt(x),n.setRenderTarget(null),n.setScissorTest(!0),n.setViewport(0,0,g,g),n.setScissor(0,0,g,g),n.render(s,a),c.clearRect(0,0,e,e),c.drawImage(d,0,d.height-g*f,g*f,g*f,0,0,e,e),o[p]=l.toDataURL("image/jpeg",.86),s.remove(E)}n.setScissorTest(u),n.setRenderTarget(h),n.autoClear=M;const m=n.getSize(new te);return n.setViewport(0,0,m.x,m.y),r.dispose(),o}lampHead(e,t,n){const s=tn.degToRad(e),r=tn.degToRad(t),a=this.lampTarget(this.tmpV);return n.set(a.x-Math.cos(r)*Math.cos(s)*yo,a.y+Math.sin(r)*yo,a.z+Math.cos(r)*Math.sin(s)*yo)}lampTarget(e){return e.set(Cn.x,this.heroRoot.position.y+.018,Cn.z)}lastPose={az:1e9,el:1e9};update(e,t){const n=this.input;if(!n)return;const s=x=>this.reducedMotion?1:1-Math.exp(-e*x);if(this.presetT<1){this.presetT=Math.min(1,this.presetT+e/(this.reducedMotion?.3:3.5));const x=this.presetT*this.presetT*(3-2*this.presetT);Bh(this.presetFrom,this.presetTo,x,this.presetCur),this.shadowDirty=!0,this.presetT>=1&&(this.envDirty=!0)}let r=n.lampAngle;n.lampSweep&&(this.sweepPhase+=e*(this.reducedMotion?0:.32),r=Math.sin(this.sweepPhase)*70,this.sweepAngle=r),this.az+=(r-this.az)*(n.lampSweep?1:s(7)),this.el+=(n.lampElevation-this.el)*s(7);const a=n.lampOn?1:0,o=this.lampLevel;if(this.lampLevel+=(a-this.lampLevel)*s(4),this.roomMode+=(a-this.roomMode)*s(2.2),Math.abs(o-this.lampLevel)>1e-4&&(this.shadowDirty=!0),this.applyPreset(this.presetCur),this.envDirty&&(this.envDirty=!1,this.regenEnv()),Math.abs(this.az-this.lastPose.az)>.01||Math.abs(this.el-this.lastPose.el)>.01){const x=this.lampHead(this.az,this.el,this.tmpV2);this.lamp.pose(x.clone(),this.lampTarget(new A)),this.lastPose.az=this.az,this.lastPose.el=this.el,this.shadowDirty=!0;const T=this.lamp.bulbWorld(new A),y=this.lamp.aimWorld(new A);this.dust.setBeams([{origin:T,dir:y,length:.48,radius:.1}]),this.viewName==="luz"&&this.engine.setView(this.viewFor("luz"),!1)}this.dust.material.uniforms.uOpacity.value=this.lampLevel*(this.reducedMotion?.4:1),this.dust.update(this.reducedMotion?0:t);const l=Jx(this.rot,n.rotation);Math.abs(l)>.01&&(this.rot+=l*s(9),this.shadowDirty=!0);const c=tn.degToRad(this.rot);for(let x=0;x<2;x++){const T=this.slotContent[x];if(!T)continue;const y=this.samples.get(T).object;if(y.rotation.y=c,this.slotPop[x]<1){this.slotPop[x]=Math.min(1,this.slotPop[x]+e/.28);const v=this.slotPop[x],S=1-Math.pow(1-v,3);y.position.y=(1-S)*.012,y.scale.setScalar((this.slots[x].userData.scale??1)*(.9+.1*S)),this.shadowDirty=!0}else y.position.y=0}const h=n.magnifierOn?1:0,u=this.magT;this.magT+=(h-this.magT)*s(6),Math.abs(this.magT-h)<.002&&(this.magT=h);const d=this.engine.camera,f=this.heroTop(),g=new A(Cn.x+n.magnifierPos[0],f,Cn.z+n.magnifierPos[1]);if(this.magT>.001||u>.001){const x=d.position.clone().sub(g).normalize(),T=g.clone().addScaledVector(x,.1),y=new nn().setFromRotationMatrix(new Qe().lookAt(T,d.position,new A(0,1,0)));y.multiply(new nn().setFromAxisAngle(new A(0,1,0),Math.PI));const v=this.magT,S=Math.sin(v*Math.PI)*.08;this.mag.lens.position.lerpVectors(this.mag.restPos,T,v).y+=S,this.mag.lens.quaternion.slerpQuaternions(this.mag.restQuat,y,v),Math.abs(u-this.magT)>1e-4&&(this.shadowDirty=!0)}const M=this.mag.lensMesh.material;if(M.uniforms.uOn.value=this.magT,this.magT>.05&&this.renderLens(g,n.zoom),this.drawerOpen+=(this.drawerWant-this.drawerOpen)*s(8),this.drawer.position.z=.12+this.drawerOpen*.13,this.saving){const x=this.saving;x.t=Math.min(1,x.t+e/x.dur);const T=x.t<.5?2*x.t*x.t:1-Math.pow(-2*x.t+2,2)/2;x.curve.getPointAt(T,x.obj.position),x.obj.scale.setScalar(x.s0*(1-T*.55)),x.obj.rotation.y+=e*.8,this.shadowDirty=!0,x.t>=1&&(x.obj.removeFromParent(),this.saving=null,this.drawerWant=0,window.setTimeout(x.resolve,250))}this.wind.time.value=this.reducedMotion?0:t;const m=this.ring.material,p=this.ringTarget?.35+(this.reducedMotion?0:Math.sin(t*3)*.08):0;m.opacity+=(p-m.opacity)*s(10),this.ring.visible=m.opacity>.01;const _=this.lamp.bulbWorld(new A).sub(g).normalize(),E=d.position.clone().sub(g).normalize();for(const x of ii)this.samples.get(x).update?.({time:t,toLight:_,toCamera:E,lampLevel:this.lampLevel});this.shadowDirty&&(this.engine.refreshShadows(),this.shadowDirty=!1)}heroTop(){let e=.03;for(let t=0;t<2;t++){const n=this.slotContent[t];n&&(e=Math.max(e,this.samples.get(n).height*(this.slots[t].userData.scale??1)))}return this.heroRoot.position.y+e*.85}renderLens(e,t){const n=this.engine.renderer,s=this.engine.camera,r=this.mag.lens,a=this.mag.cam,o=s.position.distanceTo(r.position),l=2*Math.atan(Ni/Math.max(.05,o));a.fov=tn.radToDeg(l/(1+t*.9)),a.position.copy(s.position),a.up.set(0,1,0),a.lookAt(e),a.near=.01,a.updateProjectionMatrix();const c=n.getRenderTarget();r.visible=!1,this.lamp.cone.visible=!1,n.setRenderTarget(this.mag.rt),n.render(this.engine.scene,a),n.setRenderTarget(c),r.visible=!0,this.lamp.cone.visible=this.lampLevel>.01}debug(){return{az:this.az,el:this.el,rot:this.rot,lampLevel:this.lampLevel,magT:this.magT,slots:[...this.slotContent],view:this.viewName,spotPos:this.lamp.spot.getWorldPosition(new A).toArray()}}dispose(){this.textures.forEach(e=>e.dispose()),this.mag?.dispose(),this.tags.forEach(e=>{e.normal.dispose(),e.chosen.dispose()}),this.envScene?.traverse(e=>{const t=e;t.geometry?.dispose(),t.material?.dispose?.()})}}const jx=6;function eM(i,e,t){const n=e.engine.controls;let s=null,r=0,a=null;const o=u=>{if(t.blocked()||u.pointerType==="mouse"&&u.button!==0||s)return;const d=e.pick(u.clientX,u.clientY),f=t.tool();let g="orbit";t.lensOn()&&f==="lupa"&&(d?.kind==="hero"||e.trayPoint(u.clientX,u.clientY))?g="lens":d?.kind==="lamp"||f==="luz"&&d?.kind!=="tray"&&d?.kind!=="drawer"&&d?.kind!=="magnifier"?g="light":d?.kind==="hero"&&f==="mao"&&(g="rotate"),g!=="orbit"&&(n.enabled=!1,i.setPointerCapture(u.pointerId)),s={id:u.pointerId,x:u.clientX,y:u.clientY,lx:u.clientX,ly:u.clientY,hit:d,g,moved:!1}},l=u=>{if(s&&u.pointerId===s.id){const d=Math.hypot(u.clientX-s.x,u.clientY-s.y);!s.moved&&d>jx&&(s.moved=!0,s.g!=="orbit"&&t.onDragStart(s.g)),s.moved&&s.g!=="orbit"&&(t.onDrag(s.g,u.clientX-s.lx,u.clientY-s.ly,u.clientX,u.clientY),u.preventDefault()),s.lx=u.clientX,s.ly=u.clientY;return}u.pointerType==="mouse"&&(a=u,r||(r=requestAnimationFrame(()=>{if(r=0,!a||t.blocked())return;const d=e.pick(a.clientX,a.clientY);t.onHover(d,a.clientX,a.clientY),i.style.cursor=d?d.kind==="hero"||d.kind==="lamp"&&!t.lensOn()?"grab":"pointer":"default"})))},c=u=>{if(!s||u.pointerId!==s.id)return;const d=s;if(s=null,i.hasPointerCapture(u.pointerId)&&i.releasePointerCapture(u.pointerId),e.currentView!=="luz"&&(n.enabled=!0),d.moved){d.g!=="orbit"&&t.onDragEnd(d.g);return}u.type==="pointerup"&&t.onTap(d.hit)},h=()=>t.onHover(null,0,0);return i.addEventListener("pointerdown",o,!0),i.addEventListener("pointermove",l),i.addEventListener("pointerup",c),i.addEventListener("pointercancel",c),i.addEventListener("pointerleave",h),()=>{i.removeEventListener("pointerdown",o,!0),i.removeEventListener("pointermove",l),i.removeEventListener("pointerup",c),i.removeEventListener("pointercancel",c),i.removeEventListener("pointerleave",h),cancelAnimationFrame(r)}}function tM(i){const e=t=>{const n=t.target,s=n&&(n.tagName==="INPUT"||n.tagName==="TEXTAREA"||n.tagName==="SELECT"||n.isContentEditable);if(t.ctrlKey||t.metaKey||t.altKey)return;if(t.key==="Escape"){i.escape();return}if(s||!i.enabled())return;const r=n&&(n.tagName==="BUTTON"||n.tagName==="A");switch(t.key){case"Enter":r||(t.preventDefault(),i.enter());break;case"ArrowLeft":t.preventDefault(),i.arrow(-1,0);break;case"ArrowRight":t.preventDefault(),i.arrow(1,0);break;case"ArrowUp":t.preventDefault(),i.arrow(0,1);break;case"ArrowDown":t.preventDefault(),i.arrow(0,-1);break;case"l":case"L":i.lens();break;case"+":case"=":i.zoom(.5);break;case"-":i.zoom(-.5);break}};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)}const Hh=.55;class nM{ctx=null;master=null;noise=null;room=null;_enabled=!1;volume=.6;lastTick=0;get enabled(){return this._enabled}ensure(){if(this.ctx)return this.ctx;const e=window.AudioContext||window.webkitAudioContext,t=new e;this.ctx=t,this.master=t.createGain(),this.master.gain.value=0;const n=t.createDynamicsCompressor();n.threshold.value=-20,n.ratio.value=4,this.master.connect(n).connect(t.destination);const s=t.sampleRate*2,r=t.createBuffer(1,s,t.sampleRate),a=r.getChannelData(0);let o=0;for(let l=0;l<s;l++){const c=Math.random()*2-1;o=.96*o+.04*c,a[l]=c*.45+o*2}return this.noise=r,t}setEnabled(e){if(this._enabled=e,e){const t=this.ensure();t.resume(),this.master.gain.setTargetAtTime(this.volume*Hh,t.currentTime,.15),this.startRoom()}else this.ctx&&this.master&&this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.08)}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.ctx&&this.master&&this._enabled&&this.master.gain.setTargetAtTime(this.volume*Hh,this.ctx.currentTime,.1)}suspend(e){this.ctx&&(e?this.ctx.suspend():this._enabled&&this.ctx.resume())}startRoom(){if(this.room||!this.ctx)return;const e=this.ctx,t=e.createBufferSource();t.buffer=this.noise,t.loop=!0;const n=e.createBiquadFilter();n.type="lowpass",n.frequency.value=220;const s=e.createGain();s.gain.value=0,s.gain.setTargetAtTime(.05,e.currentTime,1.5),t.connect(n).connect(s).connect(this.master),t.start(),this.room={src:t,gain:s}}burst(e){if(!this._enabled)return;const t=this.ensure(),n=t.currentTime+.005+(e.delay??0),s=t.createBufferSource();s.buffer=this.noise;const r=t.createBiquadFilter();r.type=e.type??"bandpass",r.frequency.setValueAtTime(e.freq,n),e.sweepTo&&r.frequency.exponentialRampToValueAtTime(e.sweepTo,n+e.dur),r.Q.value=e.q;const a=t.createGain();a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(e.level,n+Math.min(.01,e.dur*.2)),a.gain.exponentialRampToValueAtTime(1e-4,n+e.dur),s.connect(r).connect(a).connect(this.master),s.start(n,Math.random()*1.5),s.stop(n+e.dur+.02)}tone(e,t,n,s="sine",r=0){if(!this._enabled)return;const a=this.ensure(),o=a.currentTime+.005+r,l=a.createOscillator();l.type=s,l.frequency.value=e;const c=a.createGain();c.gain.setValueAtTime(1e-4,o),c.gain.exponentialRampToValueAtTime(n,o+.004),c.gain.exponentialRampToValueAtTime(1e-4,o+t),l.connect(c).connect(this.master),l.start(o),l.stop(o+t+.02)}tap(e="wood"){switch(e){case"stone":this.burst({freq:2400,q:4,dur:.06,level:.35}),this.tone(1900,.05,.05,"triangle");break;case"ceramic":this.tone(2600,.35,.06),this.tone(4130,.22,.03),this.burst({freq:3200,q:3,dur:.04,level:.2});break;case"soft":this.burst({freq:600,q:.8,dur:.12,level:.18,type:"lowpass"});break;case"metal":this.tone(1320,.18,.04,"triangle"),this.burst({freq:4200,q:6,dur:.03,level:.15});break;default:this.burst({freq:900,q:3.5,dur:.09,level:.4}),this.tone(420,.07,.05,"triangle")}}drawer(e){this.burst({freq:e?380:520,q:1.2,dur:.38,level:.16,sweepTo:e?620:300}),this.burst({freq:180,q:2,dur:.12,level:.35,type:"lowpass",delay:.36})}paper(){this.burst({freq:3800,q:.7,dur:.16,level:.1,type:"highpass"}),this.burst({freq:5200,q:.9,dur:.1,level:.07,type:"highpass",delay:.07})}click(){this.burst({freq:3e3,q:8,dur:.025,level:.3}),this.tone(2200,.03,.03,"square")}creak(){const e=performance.now();e-this.lastTick<120||(this.lastTick=e,this.burst({freq:1500+Math.random()*500,q:9,dur:.035,level:.05}))}dispose(){try{this.room?.src.stop()}catch{}this.room=null,this.ctx?.close(),this.ctx=null}}const Vh={cork:"soft",wool:"soft",slate:"stone",linen:"soft",leaf:"soft",smooth_wood:"wood",ceramic:"ceramic",sandstone:"stone"},Dt={lampAngle:{min:-75,max:75},lampElevation:{min:15,max:65},zoom:{min:1,max:3},magnifier:{x:.17,z:.12},companionMin:2,companionMax:4,chooseCount:2},xr=(i,e,t)=>i<e?e:i>t?t:i,Gh=i=>xr(i,Dt.lampAngle.min,Dt.lampAngle.max),Wh=i=>xr(i,Dt.lampElevation.min,Dt.lampElevation.max),iM=i=>xr(i,Dt.zoom.min,Dt.zoom.max);function sM(i,e){return[xr(i,-.17,Dt.magnifier.x),xr(e,-.12,Dt.magnifier.z)]}const Xh=i=>(i%360+360)%360,ha=i=>typeof i=="string"&&ii.includes(i);function ld(i){const e=new Set(i.filter(ha));return e.size===i.length&&e.size>=Dt.companionMin&&e.size<=Dt.companionMax}function rM(i,e){return i==="acompanhado"&&ld(e)?[...e]:[...ii]}function qh(i,e,t,n){return t.includes(e)?i.includes(e)?i.filter(s=>s!==e):i.length<Dt.chooseCount?[...i,e]:n==="livre"?[...i.slice(1),e]:[...i]:[...i]}function cd(i){let e=i>>>0;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function aM(i,e,t){const n=[...i],s=e.filter(a=>!n.includes(a)),r=cd(t);for(;n.length<Dt.chooseCount&&s.length;)n.push(s.splice(Math.floor(r()*s.length),1)[0]);return n}function oM(i,e,t){const n=cd(e*31+t*977),s=[...i],r=s[Math.floor(n()*s.length)],a=s.filter(l=>l!==r),o=[r];for(;o.length<Math.min(3,i.length)&&a.length;)o.push(a.splice(Math.floor(n()*a.length),1)[0]);for(let l=o.length-1;l>0;l--){const c=Math.floor(n()*(l+1));[o[l],o[c]]=[o[c],o[l]]}return{target:r,options:o}}const lM=1,cM=()=>({rotations:0,lampMoves:0,magnifierUses:0,hints:0,pauses:0,skips:0,backs:0,saves:0,removals:0,swaps:0,challenges:0,challengeMatches:0});function Sl(i=1,e="sala"){return{version:lM,seed:i>>>0,phase:"entrada",mode:"livre",companion:[],allowed:[...ii],step:0,paused:!1,chosen:[],sampleId:"cork",rotation:0,lampOn:!0,lampAngle:-35,lampElevation:28,lampSweep:!1,magnifierOn:!1,magnifierPos:[0,0],zoom:2,tool:"mao",compareSwap:!1,descriptors:{},preferences:{},collection:[],hintLevel:0,lightPreset:e,visited:[],counters:cM(),saveSerial:0}}const Fn=i=>Pn[i.step].id,Eo=Pn.length-1;function Ss(i,e){const t=Pn[e].id;let n=i.chosen;e>0&&n.length<Dt.chooseCount&&(n=aM(n,i.allowed,i.seed+e));const s=t==="escolher"?i.sampleId:Pn[i.step].id==="escolher"||!n.includes(i.sampleId)?n[0]??i.sampleId:i.sampleId;return{...i,step:e,chosen:n,sampleId:s,hintLevel:0,lampSweep:!1,magnifierOn:t==="rasante"?i.magnifierOn:!1,lampOn:t==="observar"?!1:t==="escolher"?i.lampOn:!0,tool:t==="rasante"?"luz":"mao",visited:i.visited.includes(t)?i.visited:[...i.visited,t]}}const pn=(i,e,t=1)=>({...i.counters,[e]:i.counters[e]+t});function lr(i,e){if(i.paused&&e.type!=="resume"&&e.type!=="reset"&&e.type!=="finish")return i;switch(e.type){case"start":{const t=e.mode==="acompanhado"&&e.companion&&ld(e.companion)?[...e.companion]:[];if(e.mode==="acompanhado"&&!t.length)return i;const n=rM(e.mode,t),s={...Sl(i.seed,i.lightPreset),phase:"jogo",mode:e.mode,companion:t,allowed:n,sampleId:n.includes("cork")?"cork":n[0]};return Ss(s,0)}case"choose":{if(Fn(i)!=="escolher"&&i.mode!=="livre")return i;const t=qh(i.chosen,e.id,i.allowed,i.mode),n=t.includes(e.id)?e.id:t[t.length-1]??i.sampleId;return{...i,chosen:t,sampleId:n}}case"setActive":{if(!i.allowed.includes(e.id))return i;if(Fn(i)!=="escolher"&&!i.chosen.includes(e.id)){if(i.mode!=="livre")return i;const t=qh(i.chosen,e.id,i.allowed,"livre");return{...i,chosen:t,sampleId:e.id}}return{...i,sampleId:e.id}}case"rotate":return e.delta?{...i,rotation:Xh(i.rotation+e.delta),counters:pn(i,"rotations")}:i;case"setRotation":return{...i,rotation:Xh(e.deg),counters:e.count?pn(i,"rotations"):i.counters};case"setLamp":{const t=e.angle===void 0?i.lampAngle:Gh(e.angle),n=e.elevation===void 0?i.lampElevation:Wh(e.elevation);return t===i.lampAngle&&n===i.lampElevation&&!e.count?i:{...i,lampAngle:t,lampElevation:n,counters:e.count?pn(i,"lampMoves"):i.counters}}case"nudgeLamp":{const t=Gh(i.lampAngle+(e.dAngle??0)),n=Wh(i.lampElevation+(e.dElevation??0));return t===i.lampAngle&&n===i.lampElevation?i:{...i,lampAngle:t,lampElevation:n,lampOn:!0,counters:pn(i,"lampMoves")}}case"setLampOn":return{...i,lampOn:e.on,lampSweep:e.on?i.lampSweep:!1};case"setSweep":return{...i,lampSweep:e.on,lampOn:e.on?!0:i.lampOn,counters:e.on?pn(i,"lampMoves"):i.counters};case"toggleMagnifier":{const t=e.on??!i.magnifierOn;return t===i.magnifierOn?i:{...i,magnifierOn:t,tool:t?"lupa":i.tool==="lupa"?"mao":i.tool,counters:t?pn(i,"magnifierUses"):i.counters}}case"moveMagnifier":{const t=sM(e.x,e.z);return{...i,magnifierPos:t}}case"setZoom":return{...i,zoom:iM(e.zoom)};case"setTool":return e.tool==="lupa"?lr(i,{type:"toggleMagnifier",on:!0}):{...i,tool:e.tool};case"toggleDescriptor":{if(!Jl.includes(e.descriptor)||!i.chosen.includes(e.id))return i;const t=i.descriptors[e.id]??[],n=t.includes(e.descriptor)?t.filter(s=>s!==e.descriptor):[...t,e.descriptor];return{...i,descriptors:{...i.descriptors,[e.id]:n}}}case"setPreference":{if(!i.chosen.includes(e.id)&&!i.collection.some(s=>s.sampleId===e.id))return i;const t={...i.preferences,[e.id]:e.preference},n=i.collection.map(s=>s.sampleId===e.id?{...s,preference:e.preference}:s);return{...i,preferences:t,collection:n}}case"save":{if(!i.chosen.includes(e.id)&&!i.collection.some(r=>r.sampleId===e.id))return i;const t=i.collection.find(r=>r.sampleId===e.id),n={sampleId:e.id,descriptors:[...i.descriptors[e.id]??[]],preference:i.preferences[e.id]??null,lampAngle:i.lampAngle,lampElevation:i.lampElevation,order:t?t.order:i.saveSerial+1},s=t?i.collection.map(r=>r.sampleId===e.id?n:r):[...i.collection,n];return{...i,collection:s,saveSerial:t?i.saveSerial:i.saveSerial+1,counters:t?i.counters:pn(i,"saves")}}case"remove":return i.collection.some(t=>t.sampleId===e.id)?{...i,collection:i.collection.filter(t=>t.sampleId!==e.id),counters:pn(i,"removals")}:i;case"swapCompare":return{...i,compareSwap:!i.compareSwap,counters:pn(i,"swaps")};case"next":return i.phase!=="jogo"?i:i.step>=Eo?lr(i,{type:"finish"}):Fn(i)==="escolher"&&i.chosen.length<Dt.chooseCount?i:Ss(i,i.step+1);case"skip":return i.phase!=="jogo"?i:i.step>=Eo?lr({...i,counters:pn(i,"skips")},{type:"finish"}):Ss({...i,counters:pn(i,"skips")},i.step+1);case"back":return i.phase!=="jogo"||i.step===0?i:Ss({...i,counters:pn(i,"backs")},i.step-1);case"goto":return i.phase!=="jogo"||e.step<0||e.step>Eo||!i.visited.includes(Pn[e.step].id)&&e.step!==i.step+1||e.step>0&&i.chosen.length<Dt.chooseCount&&Fn(i)==="escolher"?i:Ss(i,e.step);case"pause":return i.phase!=="jogo"||i.paused?i:{...i,paused:!0,lampSweep:!1,counters:pn(i,"pauses")};case"resume":return i.paused?{...i,paused:!1}:i;case"hint":{const t=Pn[i.step].hints.length;return i.hintLevel>=t?i:{...i,hintLevel:i.hintLevel+1,counters:pn(i,"hints")}}case"setPreset":return{...i,lightPreset:e.preset};case"challenge":return{...i,counters:{...pn(i,"challenges"),challengeMatches:i.counters.challengeMatches+(e.match?1:0)}};case"tryAnother":return i.phase!=="jogo"?i:Ss({...i,chosen:[],compareSwap:!1},0);case"finish":return i.phase!=="jogo"?i:{...i,phase:"resumo",paused:!1,lampSweep:!1};case"reset":return{...Sl(i.seed+1,i.lightPreset)};default:return i}}function hd(i){if(i.chosen.length<2)return null;const[e,t]=i.chosen;return i.compareSwap?[t,e]:[e,t]}function ud(i,e){const{pauses:t,hints:n,...s}=i.counters;return{app:"atlas-das-texturas",version:i.version,seed:i.seed,mode:i.mode,companionSet:[...i.companion],stepsVisited:[...i.visited],activeSeconds:Math.round(e/1e3),pauses:t,hintsUsed:n,chosen:[...i.chosen],collection:i.collection.map(r=>({...r,descriptors:[...r.descriptors]})),interactions:s,lightPreset:i.lightPreset,note:"Registro descritivo. Não contém interpretação nem diagnóstico."}}const $h={back:'<path d="M15 18l-6-6 6-6"/>',hide:'<path d="M18 15l-6-6-6 6"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',full:'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',steps:'<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>',hand:'<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L3.4 16.8a2 2 0 0 1 2.8-2.8L8 15.8"/>',bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/><path d="M12 2V1M4.2 5.2l-.7-.7M19.8 5.2l.7-.7M2 12H1M23 12h-1"/>',inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z"/>',lens:'<circle cx="10" cy="10" r="7"/><path d="M21 21l-6-6"/><path d="M7 10a3 3 0 0 1 3-3"/>',rotl:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',rotr:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="M7 4l13 8-13 8z"/>',sound:'<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',mute:'<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/>',reset:'<path d="M3 2v6h6"/><path d="M3.5 13a9 9 0 1 0 2.1-9.4L3 8"/>',close:'<path d="M18 6L6 18M6 6l12 12"/>',check:'<path d="M20 6L9 17l-5-5"/>',next:'<path d="M9 18l6-6-6-6"/>',prev:'<path d="M15 18l-6-6 6-6"/>',skip:'<path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/>',help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',overview:'<path d="M3 21l9-18 9 18"/><path d="M7.5 12h9"/>',near:'<circle cx="11" cy="11" r="8"/><path d="M11 8v6M8 11h6M21 21l-4.3-4.3"/>',low:'<path d="M2 18h20"/><path d="M4 14c4-3 12-3 16 0"/>',swap:'<path d="M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',puzzle:'<path d="M4 7h3a2 2 0 1 1 4 0h3v3a2 2 0 1 1 0 4v3h-3a2 2 0 1 0-4 0H4v-3a2 2 0 1 0 0-4z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'};function Ln(i,e=""){return`<svg class="ico ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${$h[i]??$h.sliders}</svg>`}const dd="ambientes:controles-recolhidos";function Gt(i,e,t){const n=document.createElement(i);return e&&(n.className=e),t!=null&&(n.innerHTML=t),n}function hM(){try{return localStorage.getItem(dd)==="1"}catch{return!1}}function uM(i){try{localStorage.setItem(dd,i?"1":"0")}catch{}}function fd(){return location.protocol==="file:"?"../index.html":"/"}class dM{top;bottom;actions;reveal;status;tools;subtitleEl;panels=[];cfg;root=document.documentElement;statusTimer=0;onKey=e=>{const t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable)||e.ctrlKey||e.metaKey||e.altKey||(e.key==="h"||e.key==="H")&&this.setCollapsed(!this.collapsed)};constructor(e){this.cfg=e;const t=this.root;t.classList.add("imv-root"),e.theme==="light"&&t.classList.add("imv-light");const n=Gt("div","imv-top imv-glass");n.setAttribute("role","toolbar"),n.setAttribute("aria-label","Controles do ambiente");const s=Gt("a","imv-back",Ln("back")+'<span class="imv-label">Ambientes</span>');s.href=e.backHref??fd(),s.target="_top",s.title="Voltar ao Launcher de ambientes",s.dataset.action="exit";const r=Gt("div","imv-title");r.appendChild(Gt("strong","",e.title)),this.subtitleEl=Gt("span","",e.subtitle??""),r.appendChild(this.subtitleEl),this.actions=Gt("div","imv-actions"),this.tools=Gt("div","imv-actions"),this.tools.style.overflow="visible",n.append(s,r,Gt("div","imv-spacer"),this.actions,this.tools);const a=Gt("div","imv-bottom imv-glass");a.setAttribute("role","toolbar"),a.setAttribute("aria-label","Ferramentas e pontos de vista");const o=Gt("button","imv-reveal",Ln("eye")+'<span class="imv-label">Mostrar controles</span>');o.type="button",o.title="Mostrar controles (H)",o.addEventListener("click",()=>this.setCollapsed(!1));const l=Gt("div","imv-status");l.setAttribute("role","status"),l.setAttribute("aria-live","polite"),document.body.append(n,a,o,l),this.top=n,this.bottom=a,this.reveal=o,this.status=l,window.addEventListener("keydown",this.onKey,!0)}get collapsed(){return this.root.classList.contains("imv-collapsed")}finishTools(){this.tools.appendChild(Gt("span","imv-sep"));const e=Gt("button","imv-btn imv-icon",Ln("full"));e.type="button",e.title="Tela cheia",e.setAttribute("aria-label","Tela cheia"),e.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.().catch(()=>{})});const t=Gt("button","imv-btn",Ln("hide")+'<span class="imv-label">Recolher</span>');t.type="button",t.title="Recolher controles (H)",t.addEventListener("click",()=>this.setCollapsed(!0)),this.tools.append(e,t),hM()&&this.setCollapsed(!0)}setSubtitle(e){this.subtitleEl.textContent=e}setCollapsed(e){this.root.classList.toggle("imv-collapsed",e),uM(e),this.cfg.onCollapse?.(e),e||this.top.querySelector(".imv-back")?.focus({preventScroll:!0})}addAction(e){e.classList.add("imv-moved"),this.actions.appendChild(e)}addPanel(e){const t=Gt("section",`imv-panel imv-glass ${e.side==="left"?"is-left":"is-right"}`);t.hidden=!0,t.id=`painel-${e.id}`,e.width&&(t.style.width=`min(${e.width}px, calc(100% - 20px))`),t.setAttribute("aria-label",e.label),t.setAttribute("role","region");const n=Gt("div","imv-panel-head",`<span class="imv-grip" aria-hidden="true"></span><span>${e.label}</span>`),s=Gt("button","imv-btn imv-icon",Ln("close"));s.type="button",s.title="Fechar painel",s.setAttribute("aria-label",`Fechar ${e.label}`),n.appendChild(s);const r=Gt("div","imv-panel-body");t.append(n,r),document.body.appendChild(t);const a=Gt("button","imv-btn",Ln(e.icon)+`<span class="imv-label">${e.label}</span>`);a.type="button",a.setAttribute("aria-expanded","false"),a.setAttribute("aria-controls",t.id),a.title=e.label,this.tools.appendChild(a);const o={el:t,body:r,btn:a,id:e.id,isOpen:()=>!t.hidden,toggle:l=>{const c=typeof l=="boolean"?l:t.hidden;this.panels.forEach(h=>{h!==o&&(h.el.hidden=!0,h.btn.setAttribute("aria-expanded","false"))}),t.hidden=!c,a.setAttribute("aria-expanded",c?"true":"false"),this.cfg.onPanelChange?.(c?o:this.openPanel())}};return a.addEventListener("click",()=>o.toggle()),s.addEventListener("click",()=>{o.toggle(!1),a.focus({preventScroll:!0})}),this.panels.push(o),o}openPanel(){return this.panels.find(e=>e.isOpen())??null}closePanels(){const e=this.openPanel();return e&&e.toggle(!1),!!e}say(e,t=4200){window.clearTimeout(this.statusTimer),this.status.textContent=e,this.status.classList.add("is-on"),this.statusTimer=window.setTimeout(()=>this.status.classList.remove("is-on"),t)}dispose(){window.removeEventListener("keydown",this.onKey,!0),[this.top,this.bottom,this.reveal,this.status,...this.panels.map(e=>e.el)].forEach(e=>e.remove())}}const Yh={alta:"Cinema",media:"Equilibrada",baixa:"Leve"},ot=i=>i.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]);function Xe(i,e,t={}){const n=['type="button"',`data-cmd="${i}"`,t.arg!==void 0?`data-arg="${ot(t.arg)}"`:"",t.pressed!==void 0?`aria-pressed="${t.pressed}"`:"",t.disabled?"disabled":"",t.title?`title="${ot(t.title)}"`:"",t.iconOnly?`aria-label="${ot(e)}"`:""].filter(Boolean).join(" "),s=(t.ico?Ln(t.ico):"")+(t.iconOnly?"":`<span>${ot(e)}</span>`);return`<button class="${t.cls??"b-sec"}" ${n}>${s}</button>`}function Zh(i){const e=Math.round(i/1e3),t=Math.floor(e/60);return t?`${t} min ${String(e%60).padStart(2,"0")} s`:`${e} s`}class fM{bar;cmd;panels={};thumbs={};overlay;hover;actionsEl={};companionDraft=[];draftMode="livre";lastOverlayKey="";onInsets=null;constructor(e){this.cmd=e,this.bar=new dM({title:"Atlas das Texturas",subtitle:"Ateliê de observação de superfícies",theme:"light",onPanelChange:()=>this.reportInsets(),onCollapse:()=>this.reportInsets()});const t=(s,r,a)=>{const o=document.createElement("button");return o.type="button",o.className="imv-btn",o.dataset.cmd=s,o.innerHTML=Ln(a)+`<span class="imv-label">${r}</span>`,o.title=r,o.setAttribute("aria-label",r),this.bar.addAction(o),this.actionsEl[s]=o,o};t("pause","Pausar","pause"),t("sound","Som","mute"),t("restart","Recomeçar","reset"),this.panels.etapa=this.bar.addPanel({id:"etapa",label:"Etapa",icon:"steps",width:372}),this.panels.atlas=this.bar.addPanel({id:"atlas",label:"Atlas",icon:"book",width:372}),this.panels.registro=this.bar.addPanel({id:"registro",label:"Registro",icon:"list",width:372}),this.panels.ajustes=this.bar.addPanel({id:"ajustes",label:"Ajustes",icon:"sliders",width:340}),this.bar.finishTools(),this.overlay=document.createElement("div"),this.overlay.className="ov",this.overlay.hidden=!0,document.body.appendChild(this.overlay),this.hover=document.createElement("div"),this.hover.className="hover-label",this.hover.setAttribute("aria-hidden","true"),document.body.appendChild(this.hover),document.addEventListener("click",s=>{const r=s.target.closest("[data-cmd]");if(!(!r||r.disabled)){if(r.tagName==="A"&&r.dataset.cmd==="exit"){this.cmd("exit","link");return}s.preventDefault(),this.cmd(r.dataset.cmd,r.dataset.arg)}}),document.addEventListener("input",s=>{const r=s.target;r.dataset.input&&this.cmd(r.dataset.input,r.value)});const n=new ResizeObserver(()=>this.reportInsets());Object.values(this.panels).forEach(s=>n.observe(s.el)),window.addEventListener("resize",()=>this.reportInsets())}setThumbs(e){this.thumbs=e}openPanel(e,t=!0){this.panels[e]?.toggle(t)}isPanelOpen(){return!!this.bar.openPanel()}reportInsets(){const e=this.bar.openPanel(),t=window.innerWidth<=720;let n=0,s=0;if(e&&!this.bar.collapsed){const r=e.el.getBoundingClientRect();t?s=Math.max(0,window.innerHeight-r.top):n=r.width+10}this.onInsets?.(n,s)}showHover(e,t=0,n=0){if(!e){this.hover.classList.remove("is-on");return}this.hover.textContent=e,this.hover.style.transform=`translate(${Math.round(t)}px, ${Math.round(n-34)}px) translateX(-50%)`,this.hover.classList.add("is-on")}say(e,t){this.bar.say(e,t)}render(e,t,n){Fn(e);const s=Pn[e.step];this.bar.setSubtitle(e.phase==="jogo"?`Etapa ${e.step+1} de ${Pn.length} · ${s.title}`:"Ateliê de observação de superfícies");const r=this.actionsEl;r.pause.innerHTML=Ln(e.paused?"play":"pause")+`<span class="imv-label">${e.paused?"Retomar":"Pausar"}</span>`,r.pause.setAttribute("aria-label",e.paused?"Retomar":"Pausar"),r.pause.disabled=e.phase!=="jogo",r.sound.innerHTML=Ln(t.sound?"sound":"mute")+`<span class="imv-label">${t.sound?"Som ligado":"Som desligado"}</span>`,r.sound.setAttribute("aria-label",t.sound?"Desligar som":"Ligar som"),r.sound.setAttribute("aria-pressed",String(t.sound)),r.restart.disabled=e.phase==="entrada",this.patch(this.panels.etapa.body,e.phase==="jogo"?this.stepHtml(e,n):this.idleHtml()),this.patch(this.panels.atlas.body,this.atlasHtml(e)),this.patch(this.panels.registro.body,this.registroHtml(e,n)),this.patch(this.panels.ajustes.body,this.ajustesHtml(e,t,n)),this.patch(this.bar.bottom,e.phase==="jogo"?this.bottomHtml(e,n):""),this.renderOverlay(e,n)}patch(e,t){if(e._html===t)return;const n=document.activeElement,s=n&&e.contains(n)&&n.dataset.cmd?`[data-cmd="${n.dataset.cmd}"]${n.dataset.arg!==void 0?`[data-arg="${CSS.escape(n.dataset.arg)}"]`:""}`:null;n&&e.contains(n)&&n.dataset.input&&`[data-input="${n.dataset.input}"]`||(e.innerHTML=t,e._html=t,s&&e.querySelector(s)?.focus({preventScroll:!0}))}dots(e){return`<div class="dots" aria-hidden="true">${Pn.map((t,n)=>`<span class="${n===e.step?"on":e.visited.includes(t.id)?"seen":""}"></span>`).join("")}</div>`}thumb(e,t=""){const n=this.thumbs[e];return n?`<img class="thumb ${t}" src="${n}" alt="" width="56" height="56" />`:`<span class="thumb ${t} thumb-txt" aria-hidden="true">${At[e].name.slice(0,2)}</span>`}idleHtml(){return'<p class="muted">Escolha um modo na entrada para começar.</p>'}stepHtml(e,t){const n=Pn[e.step],s=n.id,r=`<div class="step-head"><span class="step-label">Etapa ${e.step+1} de ${Pn.length}</span>${this.dots(e)}</div>
      <h2 class="step-title">${ot(n.title)}</h2><p class="invite">${ot(n.invite)}</p>`,a=e.mode==="guiado"?`<div class="hints">${n.hints.slice(0,e.hintLevel).map(f=>`<p class="hint">${Ln("help")}<span>${ot(f)}</span></p>`).join("")}${e.hintLevel<n.hints.length?Xe("hint",e.hintLevel?"Outra pista":"Pedir uma pista",{ico:"help",cls:"b-ghost"}):""}</div>`:"",o=s!=="escolher"||e.chosen.length>=Dt.chooseCount,l=`<div class="nav">${Xe("back","Voltar",{ico:"prev",cls:"b-ghost",disabled:e.step===0})}${Xe("skip","Pular",{ico:"skip",cls:"b-ghost"})}${s==="revisar"?Xe("finish","Concluir",{ico:"check",cls:"b-cta"}):Xe("next","Continuar",{ico:"next",cls:"b-cta",disabled:!o})}</div>`,c=e.chosen.length>1&&(s==="observar"||s==="rasante")?`<div class="chips" role="group" aria-label="Amostra na bandeja">${e.chosen.map(f=>`<button type="button" class="chip-s" data-cmd="active" data-arg="${f}" aria-pressed="${f===e.sampleId}">${this.thumb(f,"sm")}<span>${ot(At[f].name)}</span></button>`).join("")}</div>`:"",h=e.sampleId?At[e.sampleId]:null,u=h&&(s==="observar"||s==="rasante")?`<p class="detail"><strong>${ot(h.name)}.</strong> ${ot(h.detail)}</p><p class="question">${ot(h.question)}</p>`:"";let d="";switch(s){case"escolher":d=`<p class="count" aria-live="polite">${e.chosen.length} de ${Dt.chooseCount} escolhidas${e.mode==="livre"?" · troca livre":""}</p>
        <div class="grid" role="group" aria-label="Amostras">${e.allowed.map(f=>`<button type="button" class="card-s" data-cmd="choose" data-arg="${f}" aria-pressed="${e.chosen.includes(f)}">${this.thumb(f)}<span class="nm">${ot(At[f].name)}</span>${e.chosen.includes(f)?`<span class="badge">${e.chosen.indexOf(f)===0?"A":"B"}</span>`:""}</button>`).join("")}</div>`;break;case"observar":d=`${c}${u}
        <div class="row">${Xe("view",t.view==="perto"?"Afastar":"Aproximar",{arg:t.view==="perto"?"bancada":"perto",ico:"near",cls:"b-cta"})}</div>
        <div class="ctl"><span>Girar a amostra</span><div class="pair">${Xe("rot","Girar para a esquerda",{arg:"-15",ico:"rotl",iconOnly:!0})}${Xe("rot","Girar para a direita",{arg:"15",ico:"rotr",iconOnly:!0})}</div></div>
        <p class="muted small">${ot(Nh)}</p>`;break;case"rasante":d=`${c}
        <div class="stack">${Xe("sweep",e.lampSweep?"Parar o giro":"Girar a luz",{ico:"bulb",cls:"b-cta big",pressed:e.lampSweep})}
        ${Xe("save","Guardar",{arg:e.sampleId??"",ico:"inbox",cls:"b-sec big",disabled:t.busy})}
        <div class="row center">${Xe("tool",e.tool==="mao"?"Mão: girar a amostra (ativa)":"Mão: girar a amostra",{arg:"mao",ico:"hand",cls:"b-round",iconOnly:!0,pressed:e.tool==="mao"})}
        ${Xe("lens",e.magnifierOn?"Guardar a lupa":"Usar a lupa",{ico:"lens",cls:"b-round",iconOnly:!0,pressed:e.magnifierOn})}</div></div>
        ${u}
        <div class="ctl"><span>Ângulo <b>${Math.round(e.lampAngle)}°</b></span><div class="pair">${Xe("lamp-az","Girar a luz para trás",{arg:"-10",ico:"minus",iconOnly:!0,disabled:e.lampAngle<=Dt.lampAngle.min})}${Xe("lamp-az","Girar a luz para a frente",{arg:"10",ico:"plus",iconOnly:!0,disabled:e.lampAngle>=Dt.lampAngle.max})}</div></div>
        <div class="ctl"><span>Altura <b>${Math.round(e.lampElevation)}°</b></span><div class="pair">${Xe("lamp-el","Baixar a luz",{arg:"-5",ico:"minus",iconOnly:!0,disabled:e.lampElevation<=Dt.lampElevation.min})}${Xe("lamp-el","Subir a luz",{arg:"5",ico:"plus",iconOnly:!0,disabled:e.lampElevation>=Dt.lampElevation.max})}</div></div>
        ${e.magnifierOn?`<div class="ctl"><span>Lupa <b>${e.zoom.toFixed(1).replace(".",",")}×</b></span><div class="pair">${Xe("zoom","Menos zoom",{arg:"-0.5",ico:"minus",iconOnly:!0,disabled:e.zoom<=Dt.zoom.min})}${Xe("zoom","Mais zoom",{arg:"0.5",ico:"plus",iconOnly:!0,disabled:e.zoom>=Dt.zoom.max})}</div></div>`:""}`;break;case"comparar":{const f=hd(e);d=f?`<p class="muted small">Mesma luz (${Math.round(e.lampAngle)}°, altura ${Math.round(e.lampElevation)}°), mesma escala e mesmo giro.</p>
          <div class="cmp">${f.map((g,M)=>`<div class="cmp-col"><div class="cmp-h">${this.thumb(g,"sm")}<span>${M===0?"Esquerda":"Direita"}: <b>${ot(At[g].name)}</b></span></div>
            <div class="chips wrap" role="group" aria-label="Descritores para ${ot(At[g].name)}">${Jl.map(m=>`<button type="button" class="chip" data-cmd="desc" data-arg="${g}|${m}" aria-pressed="${(e.descriptors[g]??[]).includes(m)}">${ot(po[m])}</button>`).join("")}</div></div>`).join("")}</div>
          <div class="row">${Xe("swap","Trocar lados",{ico:"swap"})}${Xe("view","Rente à mesa",{arg:"rente",ico:"low"})}</div>
          <p class="question">${ot(na[2])}</p>`:'<p class="muted">Escolha duas amostras para comparar.</p>';break}case"guardar":d=e.chosen.map(f=>{const g=e.collection.some(m=>m.sampleId===f),M=e.preferences[f]??null;return`<div class="save-card">${this.thumb(f,"sm")}<div class="sc-body"><b>${ot(At[f].name)}</b>
            <div class="chips wrap" role="radiogroup" aria-label="Cartão de preferência para ${ot(At[f].name)}">${sd.map(m=>`<button type="button" class="chip" role="radio" data-cmd="pref" data-arg="${f}|${m}" aria-checked="${M===m}">${ot(mo[m])}</button>`).join("")}<button type="button" class="chip" role="radio" data-cmd="pref" data-arg="${f}|" aria-checked="${M===null}">omitir</button></div>
            ${Xe("save",g?"Atualizar no atlas":"Guardar no atlas",{arg:f,ico:"inbox",cls:g?"b-sec":"b-cta",disabled:t.busy})}
            ${g?`<span class="ok">${Ln("check")} no atlas</span>`:""}</div></div>`}).join("");break;case"revisar":d=`<p class="count">${e.collection.length} ${e.collection.length===1?"entrada":"entradas"} no atlas</p>
        <div class="row wrap">${Xe("panel","Abrir o atlas",{arg:"atlas",ico:"book",cls:"b-cta"})}${Xe("another","Experimentar outras",{ico:"reset"})}${Xe("challenge","Desafio de correspondência",{ico:"puzzle"})}</div>
        ${this.challengeHtml(t)}
        <p class="question">${ot(na[3])}</p>`;break}return`${r}${d}${a}${l}`}challengeHtml(e){const t=e.challenge;if(!t)return"";const n=t.answer?`<p class="hint" role="status">${Ln("check")}<span>${t.answer===t.target?`É a ${ot(At[t.target].name)}.`:`Esta imagem é da ${ot(At[t.target].name)}; você marcou ${ot(At[t.answer].name)}.`} O que na imagem ajudou a decidir?</span></p>${Xe("challenge","Outra imagem",{ico:"puzzle",cls:"b-ghost"})}`:"";return`<div class="challenge"><img src="${t.image}" alt="Detalhe ampliado de uma das amostras" width="200" height="200"/>
      <p class="small">De qual amostra é este detalhe? Não há pontuação.</p>
      <div class="chips wrap">${t.options.map(s=>`<button type="button" class="chip" data-cmd="challenge-answer" data-arg="${s}" aria-pressed="${t.answer===s}" ${t.answer?"disabled":""}>${ot(At[s].name)}</button>`).join("")}</div>${n}</div>`}atlasHtml(e){return e.collection.length?`<ol class="atlas">${[...e.collection].sort((n,s)=>n.order-s.order).map(n=>`<li class="entry">${this.thumb(n.sampleId)}<div><b>${ot(At[n.sampleId].name)}</b>
      <p class="small">${n.descriptors.length?n.descriptors.map(s=>po[s]).join(", "):"sem descritor"} · ${n.preference?mo[n.preference]:"preferência omitida"}</p>
      <p class="small muted">Luz a ${Math.round(n.lampAngle)}°, altura ${Math.round(n.lampElevation)}°</p>
      ${Xe("remove","Retirar",{arg:n.sampleId,ico:"trash",cls:"b-ghost"})}</div></li>`).join("")}</ol>`:'<p class="muted">O atlas ainda está vazio. Guarde uma amostra na etapa de luz rasante ou em “Guardar no atlas”.</p>'}registroHtml(e,t){const n=e.counters;return`<dl class="reg">${[["Tempo ativo",Zh(t.activeMs)],["Modo",go[e.mode].name],["Etapas visitadas",`${e.visited.length} de ${Pn.length}`],["Amostras escolhidas",e.chosen.map(r=>At[r].name).join(", ")||"—"],["Giros da amostra",String(n.rotations)],["Ajustes de luz",String(n.lampMoves)],["Usos da lupa",String(n.magnifierUses)],["Entradas no atlas",String(e.collection.length)],["Pistas pedidas",String(n.hints)],["Pausas",String(n.pauses)],["Desafios vistos",String(n.challenges)]].map(([r,a])=>`<dt>${r}</dt><dd>${ot(a)}</dd>`).join("")}</dl>
      <p class="question">${ot(na[0])}</p>
      <p class="disclaimer">${ot(Ih)}</p>
      <div class="stack">${Xe("export","Exportar resumo (JSON)",{ico:"download"})}
      ${Xe("save-local",t.savedLocal?"Atualizar no aparelho":"Salvar neste aparelho",{ico:"save"})}
      ${t.savedLocal?Xe("clear-local","Apagar dados salvos",{ico:"trash",cls:"b-ghost"}):""}</div>
      <p class="small muted">Salvar fica só neste navegador. Em aparelho compartilhado, apague ao terminar.</p>`}ajustesHtml(e,t,n){const s=["auto","alta","media","baixa"].map(a=>`<button type="button" class="chip" role="radio" data-cmd="quality" data-arg="${a}" aria-checked="${t.quality===a}">${a==="auto"?`Automática (${Yh[t.detected]})`:Yh[a]}</button>`).join("");return`<h3 class="h3">Luz da sala</h3><div class="chips wrap" role="radiogroup" aria-label="Luz da sala">${Ql.map(a=>`<button type="button" class="chip" role="radio" data-cmd="preset" data-arg="${a}" aria-checked="${e.lightPreset===a}">${ot(_x[a])}</button>`).join("")}</div>
      <p class="small muted">O que muda nas superfícies quando a luz da sala muda?</p>
      <h3 class="h3">Som</h3>
      <div class="row">${Xe("sound",t.sound?"Desligar som":"Ligar som",{ico:t.sound?"sound":"mute",pressed:t.sound})}</div>
      <label class="range"><span>Volume</span><input type="range" min="0" max="1" step="0.05" value="${t.volume}" data-input="volume" aria-label="Volume" /></label>
      <h3 class="h3">Movimento</h3>
      <div class="row">${Xe("reduced",t.reduced?"Movimento reduzido: ligado":"Movimento reduzido: desligado",{ico:"eye",pressed:t.reduced})}</div>
      <h3 class="h3">Qualidade gráfica</h3><div class="chips wrap" role="radiogroup" aria-label="Qualidade gráfica">${s}</div>
      <p class="small muted">${n.webgl?"Trocar a qualidade recarrega a cena e mantém esta sessão.":"Cena 3D indisponível: modo descritivo ativo."}</p>
      <h3 class="h3">Atalhos</h3>
      <p class="small">Setas giram a amostra (ou a luz, com a ferramenta Luz). Enter continua. Esc fecha painéis ou pausa. H recolhe os controles. L abre a lupa.</p>`}bottomHtml(e,t){const n=`${Xe("tool","Mão",{arg:"mao",ico:"hand",cls:"imv-btn",pressed:e.tool==="mao",title:"Arrastar gira a amostra"})}
      ${Xe("tool","Luz",{arg:"luz",ico:"bulb",cls:"imv-btn",pressed:e.tool==="luz",title:"Arrastar move a luminária"})}
      ${Xe("lens","Lupa",{ico:"lens",cls:"imv-btn",pressed:e.magnifierOn,title:"Lupa (L)"})}
      ${e.magnifierOn?Xe("zoom","Menos zoom",{arg:"-0.5",ico:"minus",cls:"imv-btn imv-icon",iconOnly:!0})+Xe("zoom","Mais zoom",{arg:"0.5",ico:"plus",cls:"imv-btn imv-icon",iconOnly:!0}):""}`,s=[["bancada","Bancada","camera"],["geral","Geral","overview"],["perto","Perto","near"],["rente","Rente","low"],["luz","Da luz","sun"]].map(([o,l,c])=>Xe("view",l,{arg:o,ico:c,cls:"imv-btn",pressed:t.view===o,title:o==="luz"?"Ver do lugar da luminária":`Ponto de vista: ${l}`})).join(""),r=t.view==="luz"?Xe("view","Voltar",{arg:"bancada",ico:"prev",cls:"imv-btn is-active"}):"",a=Xe("lamp-toggle",e.lampOn?"Apagar luminária":"Acender luminária",{ico:"bulb",cls:"imv-btn",pressed:e.lampOn});return`${r}${n}<span class="imv-sep"></span>${a}<span class="imv-sep"></span>${s}`}renderOverlay(e,t){let n="",s="";e.phase==="entrada"?(s=`entrada:${this.draftMode}:${this.companionDraft.join(",")}:${t.savedLocal}`,n=this.entradaHtml(t.savedLocal)):e.phase==="resumo"?(s=`resumo:${e.collection.length}:${t.savedLocal}`,n=this.resumoHtml(e,t)):e.paused&&(s="pausa",n=`<div class="card" role="dialog" aria-modal="true" aria-labelledby="t-pausa"><h2 id="t-pausa" class="serif">Pausa</h2>
        <p>Tudo fica como está. Quando quiser, retome de onde parou.</p>
        <div class="row">${Xe("resume","Retomar",{ico:"play",cls:"b-cta"})}${Xe("restart","Recomeçar",{ico:"reset"})}${Xe("finish","Ver resumo",{ico:"list",cls:"b-ghost"})}</div></div>`),this.overlay.hidden=!n,document.documentElement.classList.toggle("has-overlay",!!n),s!==this.lastOverlayKey&&(this.lastOverlayKey=s,this.overlay.innerHTML=n,this.overlay.querySelector(".b-cta, button")?.focus({preventScroll:!0}))}setDraftMode(e){this.draftMode=e}get draft(){return{mode:this.draftMode,companion:[...this.companionDraft]}}toggleCompanion(e){const t=this.companionDraft.indexOf(e);t>=0?this.companionDraft.splice(t,1):this.companionDraft.length<Dt.companionMax&&this.companionDraft.push(e)}entradaHtml(e){const t=rd.map(r=>`<button type="button" class="mode" role="radio" data-cmd="mode" data-arg="${r}" aria-checked="${this.draftMode===r}"><b>${go[r].name}</b><span>${ot(go[r].text)}</span></button>`).join(""),n=this.draftMode==="acompanhado"?`<fieldset class="comp"><legend>Amostras desta sessão (${this.companionDraft.length} de 2 a 4)</legend><div class="grid">${ii.map(r=>`<button type="button" class="card-s" data-cmd="companion" data-arg="${r}" aria-pressed="${this.companionDraft.includes(r)}">${this.thumb(r)}<span class="nm">${ot(At[r].name)}</span></button>`).join("")}</div></fieldset>`:"",s=this.draftMode!=="acompanhado"||this.companionDraft.length>=2&&this.companionDraft.length<=4;return`<div class="card intro" role="dialog" aria-modal="true" aria-labelledby="t-intro">
      <p class="kicker">Ateliê de observação</p>
      <h1 id="t-intro" class="serif">Atlas das Texturas</h1>
      <p class="lead">Observe superfícies sob luzes diferentes e anote, se quiser, o que você percebe.</p>
      <div class="modes" role="radiogroup" aria-label="Modo">${t}</div>${n}
      <div class="row">${Xe("start","Começar",{ico:"next",cls:"b-cta big",disabled:!s})}${Xe("demo","Ver demonstração",{ico:"eye"})}${e?Xe("restore-local","Retomar sessão salva",{ico:"save",cls:"b-ghost"}):""}</div>
      <p class="small muted">${ot(Nh)} Sem cadastro: nada sai deste aparelho.</p></div>`}resumoHtml(e,t){const n=[...e.collection].sort((s,r)=>s.order-r.order);return`<div class="card wide" role="dialog" aria-modal="true" aria-labelledby="t-res">
      <h2 id="t-res" class="serif">Revisão da sessão</h2>
      <p class="small">${Zh(t.activeMs)} de tempo ativo · ${e.visited.length} etapas · ${e.counters.lampMoves} ajustes de luz · ${e.counters.magnifierUses} usos da lupa · ${e.counters.pauses} pausas</p>
      ${n.length?`<ol class="atlas cols">${n.map(s=>`<li class="entry">${this.thumb(s.sampleId)}<div><b>${ot(At[s.sampleId].name)}</b><p class="small">${s.descriptors.length?s.descriptors.map(r=>po[r]).join(", "):"sem descritor"} · ${s.preference?mo[s.preference]:"preferência omitida"}</p></div></li>`).join("")}</ol>`:'<p class="muted">Nenhuma amostra foi guardada nesta sessão.</p>'}
      <ul class="qs">${na.slice(0,3).map(s=>`<li>${ot(s)}</li>`).join("")}</ul>
      <p class="disclaimer">${ot(Ih)}</p>
      <div class="row wrap">${Xe("export","Exportar JSON",{ico:"download"})}${Xe("save-local",t.savedLocal?"Atualizar no aparelho":"Salvar neste aparelho",{ico:"save"})}${Xe("new","Nova sessão",{ico:"reset",cls:"b-cta"})}${Xe("exit","Sair",{ico:"back",cls:"b-ghost"})}</div></div>`}confirm(e,t){return new Promise(n=>{const s=document.createElement("div");s.className="ov confirm",s.innerHTML=`<div class="card" role="alertdialog" aria-modal="true" aria-labelledby="t-cf"><p id="t-cf">${ot(e)}</p><div class="row"><button type="button" class="b-sec" data-c="0">Cancelar</button><button type="button" class="b-cta" data-c="1">${ot(t)}</button></div></div>`,document.body.appendChild(s);const r=document.activeElement;s.querySelector('[data-c="0"]').focus();const a=l=>{s.remove(),window.removeEventListener("keydown",o,!0),r?.focus?.({preventScroll:!0}),n(l)},o=l=>{l.key==="Escape"&&(l.stopImmediatePropagation(),l.preventDefault(),a(!1))};window.addEventListener("keydown",o,!0),s.addEventListener("click",l=>{const c=l.target.closest("[data-c]");c&&(l.stopPropagation(),a(c.dataset.c==="1"))})})}}const pd="atlas-das-texturas:v1:prefs",ga="atlas-das-texturas:v1:sessao",va="atlas-das-texturas:v1:recarga";function pM(){const i={v:1,quality:"auto",sound:!1,volume:.6,reduced:window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,preset:"tarde"};try{const e=JSON.parse(localStorage.getItem(pd)??"null");if(e&&e.v===1)return{...i,quality:["auto","alta","media","baixa"].includes(e.quality)?e.quality:i.quality,sound:!!e.sound,volume:typeof e.volume=="number"?Math.min(1,Math.max(0,e.volume)):i.volume,reduced:typeof e.reduced=="boolean"?e.reduced:i.reduced,preset:Ql.includes(e.preset)?e.preset:i.preset}}catch{}return i}const yt=pM();function Yi(){try{localStorage.setItem(pd,JSON.stringify(yt))}catch{}}function mM(){try{return!!localStorage.getItem(ga)}catch{return!1}}let Ae=Sl((Date.now()^Math.floor(Math.random()*1e9))>>>0,yt.preset);try{const i=sessionStorage.getItem(va);if(i){sessionStorage.removeItem(va);const e=JSON.parse(i);e&&e.version===Ae.version&&(Ae={...e,paused:!1})}}catch{}function As(i,e){if(window.parent!==window)try{window.parent.postMessage({source:"atlas-das-texturas",v:1,type:i,data:e},"*"),i==="ready"&&window.parent.postMessage({type:"SANGI_APP_READY",id:"atlas-das-texturas",capabilities:{webgl2:!0,pbr:!0,touch:!0,audio:!0}},"*")}catch{}}window.addEventListener("message",i=>{!i.data||typeof i.data!="object"||(i.data.type==="SANGI_APP_PAUSE"?Ve({type:"pause"}):i.data.type==="SANGI_APP_RESUME"?Ve({type:"resume"}):i.data.type==="SANGI_APP_MUTE"?(yt.sound=!i.data.muted,Rt.setEnabled(yt.sound),Yi()):i.data.type==="SANGI_APP_DISPOSE"&&(xt?.dispose(),kt?.dispose(),Rt.dispose()))});let bi=0,Kh=performance.now();function md(){const i=performance.now(),e=Math.min(i-Kh,2e3);Kh=i,Ae.phase==="jogo"&&!Ae.paused&&!document.hidden&&(bi+=e)}const Rt=new nM,$e=new fM((i,e)=>{Md(i,e)}),gd=document.getElementById("cena"),xi=document.getElementById("carregando");let kt=null,xt=null,jl=!0,Ji=!1,yl=mM(),ei=null,gM=0,vd={},hn=null,bl="media";function ec(){return{activeMs:bi,savedLocal:yl,view:xt?.currentView??"bancada",challenge:ei,webgl:jl,busy:Ji}}function tc(){return{quality:yt.quality,detected:bl,sound:yt.sound,volume:yt.volume,reduced:yt.reduced}}function _d(i){const e={stepId:Fn(i),sampleId:i.phase==="entrada"?"cork":i.sampleId,chosen:i.chosen,allowed:i.allowed,compare:Fn(i)==="comparar"&&i.phase==="jogo"?hd(i):null,rotation:i.rotation,lampOn:i.phase==="entrada"?!0:i.lampOn,lampAngle:i.lampAngle,lampElevation:i.lampElevation,lampSweep:i.lampSweep&&!i.paused,magnifierOn:i.magnifierOn,magnifierPos:i.magnifierPos,zoom:i.zoom,preset:i.lightPreset};return hn?{...e,...hn.input}:e}function Ht(){$e.render(Ae,tc(),ec()),xt?.apply(_d(Ae))}let Jh=0;function Ve(i){const e=Ae;Ae=lr(Ae,i),Ae!==e&&(xd(e,Ae,i),Ht())}function xd(i,e,t){if(i.step!==e.step||i.phase!==e.phase){if(e.phase==="jogo"){const s=Fn(e),r=s==="escolher"||s==="revisar"?"geral":"bancada";xt?.setView(r),$e.openPanel("etapa",!0),$e.say(Pn[e.step].invite),ei=null}e.phase==="resumo"&&(As("complete"),As("summary",ud(e,bi)))}switch(i.phase==="entrada"&&e.phase==="jogo"&&xt?.setView("geral"),i.paused!==e.paused&&(As(e.paused?"pause":"resume"),Rt.suspend(e.paused),kt&&(kt.paused=e.paused)),t.type){case"choose":{const s=e.chosen.includes(t.id);Rt.tap(Vh[t.id]),$e.say(s?`${At[t.id].name} escolhida (${e.chosen.indexOf(t.id)===0?"A":"B"}).`:`${At[t.id].name} voltou para a bandeja.`);break}case"setActive":Rt.tap(Vh[t.id]),$e.say(`${At[t.id].name} na bandeja principal.`);break;case"setLampOn":Rt.click(),$e.say(t.on?"Luminária acesa.":"Luminária apagada: luz difusa da sala.");break;case"setSweep":Rt.click(),$e.say(t.on?"A luz gira devagar. O que aparece e some?":`Luz parada em ${Math.round(e.lampAngle)}°.`);break;case"toggleMagnifier":Rt.tap("metal"),$e.say(e.magnifierOn?"Lupa sobre a amostra. Arraste para passear pela superfície.":"Lupa de volta ao suporte.");break;case"nudgeLamp":Rt.creak(),$e.say(`Luz a ${Math.round(e.lampAngle)}°, altura ${Math.round(e.lampElevation)}°.`);break;case"toggleDescriptor":case"setPreference":Rt.paper();break;case"remove":Rt.paper(),$e.say(`${At[t.id].name} saiu do atlas.`);break;case"swapCompare":Rt.tap("wood");break;case"hint":Rt.paper();break;case"setPreset":$e.say("A luz da sala muda devagar.");break}const n=performance.now();(t.type==="setLamp"||t.type==="setRotation")&&n-Jh>600&&(Jh=n,t.type==="setLamp"&&$e.say(`Luz a ${Math.round(e.lampAngle)}°, altura ${Math.round(e.lampElevation)}°.`))}async function Md(i,e){if(yt.sound&&!Rt.enabled&&Rt.setEnabled(!0),hn&&i!=="demo-stop")return;const t=e&&ha(e)?e:null;switch(i){case"mode":rd.includes(e??"")&&$e.setDraftMode(e),Ht();break;case"companion":t&&$e.toggleCompanion(t),Ht();break;case"start":{const n=$e.draft;bi=0,Ve({type:"start",mode:n.mode,companion:n.companion});break}case"restore-local":MM();break;case"demo":SM();break;case"demo-stop":Ra();break;case"choose":t&&Ve({type:"choose",id:t});break;case"active":t&&Ve({type:"setActive",id:t});break;case"rot":Ve({type:"rotate",delta:Number(e)||0}),Rt.tap("wood");break;case"lamp-az":Ve({type:"nudgeLamp",dAngle:Number(e)||0});break;case"lamp-el":Ve({type:"nudgeLamp",dElevation:Number(e)||0});break;case"sweep":Ve({type:"setSweep",on:!Ae.lampSweep});break;case"lamp-toggle":Ve({type:"setLampOn",on:!Ae.lampOn});break;case"lens":Ve({type:"toggleMagnifier"});break;case"zoom":Ve({type:"setZoom",zoom:Ae.zoom+(Number(e)||0)});break;case"tool":(e==="mao"||e==="luz"||e==="lupa")&&(Ve({type:"setTool",tool:e}),$e.say(e==="mao"?"Mão: arraste sobre a amostra para girá-la.":e==="luz"?"Luz: arraste na cena para mover a luminária.":"Lupa: arraste para mover a área ampliada."));break;case"desc":{const[n,s]=(e??"").split("|");ha(n)&&Jl.includes(s)&&Ve({type:"toggleDescriptor",id:n,descriptor:s});break}case"pref":{const[n,s]=(e??"").split("|");ha(n)&&Ve({type:"setPreference",id:n,preference:sd.includes(s)?s:null});break}case"save":t&&await vM(t);break;case"remove":t&&Ve({type:"remove",id:t});break;case"swap":Ve({type:"swapCompare"});break;case"next":Ji||Ve({type:"next"});break;case"back":Ji||Ve({type:"back"});break;case"skip":Ji||Ve({type:"skip"});break;case"hint":Ve({type:"hint"});break;case"pause":Ve({type:Ae.paused?"resume":"pause"});break;case"resume":Ve({type:"resume"});break;case"finish":Ve({type:"finish"});break;case"another":Ve({type:"tryAnother"});break;case"restart":await $e.confirm("Recomeçar apaga as escolhas e o atlas desta sessão. Continuar?","Recomeçar")&&(bi=0,ei=null,Ve({type:"reset"}),xt?.setView("bancada"));break;case"new":bi=0,ei=null,Ve({type:"reset"}),xt?.setView("bancada");break;case"view":e&&["bancada","geral","perto","rente","luz"].includes(e)&&xt&&(xt.setView(e),e==="luz"&&$e.say("Do lugar da luz: o que a luminária “vê”? Use Voltar para sair."),Ht());break;case"panel":e&&$e.openPanel(e,!0);break;case"preset":e&&Ql.includes(e)&&(yt.preset=e,Yi(),Ve({type:"setPreset",preset:e}));break;case"sound":yt.sound=!yt.sound,Rt.setEnabled(yt.sound),Yi(),$e.say(yt.sound?"Som ligado: madeira, gaveta e papel.":"Som desligado. Tudo segue igual sem áudio."),Ht(),yt.sound&&Rt.tap("wood");break;case"volume":yt.volume=Number(e),Rt.setVolume(yt.volume),Yi();break;case"reduced":yt.reduced=!yt.reduced,xt&&(xt.reducedMotion=yt.reduced),kt&&(kt.tweenDuration=yt.reduced?.001:.6),Yi(),Ht();break;case"quality":if(e&&["auto","alta","media","baixa"].includes(e)&&e!==yt.quality&&await $e.confirm("A cena será recarregada com a nova qualidade. Esta sessão continua de onde está.","Recarregar")){yt.quality=e,Yi();try{sessionStorage.setItem(va,JSON.stringify(Ae))}catch{}location.reload()}break;case"export":xM();break;case"save-local":if(await $e.confirm("Salvar guarda o resumo e o atlas só neste navegador. Em aparelho compartilhado, apague ao terminar.","Salvar")){try{localStorage.setItem(ga,JSON.stringify({v:1,state:Ae,activeMs:bi})),yl=!0,$e.say("Sessão salva neste aparelho.")}catch{$e.say("Não foi possível salvar neste navegador.")}Ht()}break;case"clear-local":if(await $e.confirm("Apagar a sessão salva neste aparelho? Isso não pode ser desfeito.","Apagar")){try{localStorage.removeItem(ga)}catch{}yl=!1,$e.say("Dados salvos apagados."),Ht()}break;case"challenge":_M();break;case"challenge-answer":t&&ei&&!ei.answer&&(ei={...ei,answer:t},Ve({type:"challenge",match:t===ei.target}),Ht());break;case"exit":As("exit"),e!=="link"&&window.open(fd(),"_top");break}}async function vM(i){if(Ji||Ae.paused||Ae.phase!=="jogo"||!Ae.chosen.includes(i)&&!Ae.collection.some(t=>t.sampleId===i))return;Ji=!0,Ht();const e=Ae.collection.some(t=>t.sampleId===i);Rt.drawer(!0);try{xt&&await xt.playSave(i)}finally{Ji=!1}Ve({type:"save",id:i}),Rt.paper(),$e.say(e?`Entrada da ${At[i].name} atualizada no atlas.`:`${At[i].name} guardada no atlas.`),Ht()}function _M(){const i=Ae.allowed,e=oM(i,Ae.seed,gM++),t=vd[e.target];if(!t){$e.say("O desafio precisa da cena 3D para gerar a imagem ampliada.");return}ei={target:e.target,options:e.options,answer:null,image:t},Rt.paper(),Ht()}function xM(){const i=JSON.stringify(ud(Ae,bi),null,2),e=new Blob([i],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download="atlas-das-texturas-resumo.json",t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),1e3),$e.say("Resumo exportado como arquivo JSON.")}function MM(){try{const i=JSON.parse(localStorage.getItem(ga)??"null");if(i&&i.v===1&&i.state?.version===Ae.version){const e=Ae;Ae={...i.state,paused:!1},bi=i.activeMs??0,xd(e,Ae,{type:"resume"}),Ht(),$e.say("Sessão salva retomada.")}}catch{$e.say("Não foi possível ler a sessão salva.")}}const Qh=[{say:"Oito amostras esperam nas bandejas da bancada.",view:"geral",input:{lampOn:!1}},{say:"Luz difusa: a sala ilumina tudo por igual.",view:"bancada",input:{lampOn:!1}},{say:"Luz rasante: a luminária desce e gira devagar.",view:"bancada",input:{lampOn:!0,lampElevation:18,lampSweep:!0}},{say:"A lupa amplia o detalhe real da superfície.",view:"bancada",input:{lampOn:!0,lampElevation:22,magnifierOn:!0,zoom:2.5,magnifierPos:[.03,0]}}];function SM(){if(!xt)return;document.documentElement.classList.add("is-demo");const i=document.getElementById("demo-pill");i.hidden=!1,i.querySelector("button").focus(),hn={i:-1,timer:0,input:{}};const e=()=>{if(!hn)return;if(hn.i++,hn.i>=Qh.length){Ra();return}const t=Qh[hn.i];hn.input=t.input,xt.setView(t.view),$e.say(t.say,3600),Ht(),hn.timer=window.setTimeout(e,yt.reduced?2600:3800)};e()}function Ra(){hn&&(window.clearTimeout(hn.timer),hn=null,document.documentElement.classList.remove("is-demo"),document.getElementById("demo-pill").hidden=!0,xt?.setView("bancada"),Ht())}let jh=0;function yM(i){eM(gd,i,{tool:()=>Ae.tool,lensOn:()=>Ae.magnifierOn,blocked:()=>Ae.phase!=="jogo"||Ae.paused||!!hn,onHover:(e,t,n)=>{if(i.highlight(e),!e)return $e.showHover(null);const s=e.kind==="tray"&&e.id?`${At[e.id].name}${Fn(Ae)==="escolher"?Ae.chosen.includes(e.id)?" · tocar para devolver":" · tocar para escolher":""}`:e.kind==="hero"&&e.id?`${At[e.id].name} · arraste para girar`:e.kind==="lamp"?"Luminária · arraste para mover a luz":e.kind==="magnifier"?"Lupa · tocar para usar":"Gaveteiro de amostras · abrir o atlas";$e.showHover(s,t,n)},onTap:e=>{if(e)if(e.kind==="tray"&&e.id){if(!Ae.allowed.includes(e.id)){$e.say("Esta amostra não faz parte do conjunto desta sessão.");return}Fn(Ae)==="escolher"?Ve({type:"choose",id:e.id}):Ae.chosen.includes(e.id)||Ae.mode==="livre"?Ve({type:"setActive",id:e.id}):$e.say("Para trocar as amostras, volte à etapa de escolha.")}else e.kind==="magnifier"?Ve({type:"toggleMagnifier"}):e.kind==="lamp"?(Ae.lampOn?Ve({type:"setTool",tool:"luz"}):Ve({type:"setLampOn",on:!0}),$e.say("Arraste na cena para mover a luminária.")):e.kind==="drawer"&&(Rt.drawer(!0),$e.openPanel("atlas",!0))},onDragStart:e=>{jh=Ae.rotation,e==="light"&&!Ae.lampOn&&Ve({type:"setLampOn",on:!0}),e==="light"&&Ae.lampSweep&&Ve({type:"setSweep",on:!1}),i.highlight(null),$e.showHover(null)},onDrag:(e,t,n,s,r)=>{if(e==="rotate")Ve({type:"setRotation",deg:Ae.rotation+t*.6});else if(e==="light")Ve({type:"setLamp",angle:Ae.lampAngle+t*.3,elevation:Ae.lampElevation-n*.22}),Rt.creak();else if(e==="lens"){const a=i.trayPoint(s,r);a&&Ve({type:"moveMagnifier",x:a[0],z:a[1]})}},onDragEnd:e=>{e==="rotate"&&Math.abs(Ae.rotation-jh)>.5&&Ve({type:"setRotation",deg:Ae.rotation,count:!0}),e==="light"&&Ve({type:"setLamp",count:!0})}})}tM({enabled:()=>Ae.phase==="jogo"&&!Ae.paused&&!hn,escape:()=>{if(hn)return Ra();if(!document.querySelector(".ov.confirm")){if($e.isPanelOpen()){$e.bar.closePanels();return}if(xt?.currentView==="luz"){xt.setView("bancada"),Ht();return}Ae.phase==="jogo"&&Ve({type:Ae.paused?"resume":"pause"})}},enter:()=>{Fn(Ae)==="revisar"?Ve({type:"finish"}):Ve({type:"next"})},arrow:(i,e)=>{Ae.tool==="luz"||Fn(Ae)==="rasante"?(i&&Ve({type:"nudgeLamp",dAngle:i*5}),e&&!Ae.magnifierOn?Ve({type:"nudgeLamp",dElevation:e*5}):e&&Ve({type:"setZoom",zoom:Ae.zoom+e*.5})):(i&&Ve({type:"rotate",delta:i*15}),e&&Ae.magnifierOn&&Ve({type:"setZoom",zoom:Ae.zoom+e*.5}))},lens:()=>Ve({type:"toggleMagnifier"}),zoom:i=>Ve({type:"setZoom",zoom:Ae.zoom+i})});document.addEventListener("visibilitychange",()=>{md(),Rt.suspend(document.hidden||Ae.paused)});window.setInterval(()=>{if(md(),xt&&Ae.lampSweep&&!Ae.paused){const i=Math.round(xt.sweepAngle);i!==Math.round(Ae.lampAngle)&&(Ae=lr(Ae,{type:"setLamp",angle:i}),$e.render(Ae,tc(),ec()))}},200);window.setInterval(()=>{document.getElementById("painel-registro")?.hidden===!1&&$e.render(Ae,tc(),ec())},1e3);function bM(i,e){const t=xi.querySelector(".bar > i");t.style.width=`${Math.round(i*100)}%`,xi.querySelector(".line").textContent=e,xi.querySelector(".bar").setAttribute("aria-valuenow",String(Math.round(i*100)))}function El(i){const e=document.getElementById("contexto");e.hidden=!i,i&&e.querySelector("button").focus()}function EM(){try{const i=document.createElement("canvas");return!!(i.getContext("webgl2")||i.getContext("webgl"))}catch{return!1}}async function wM(){if($e.onInsets=(e,t)=>xt?.setInsets(e,t),Ht(),!EM()){jl=!1,xi.hidden=!0,document.getElementById("sem-webgl").hidden=!1,document.documentElement.classList.add("no-webgl"),Ht(),As("ready");return}bl=ix();const i=yt.quality==="auto"?bl:yt.quality;try{kt=new ox(gd,{quality:i,fov:40,near:.05,far:12,exposure:1,bloom:{strength:.3,radius:.5,threshold:.9},ao:{radius:.05,intensity:.9}}),kt.tweenDuration=yt.reduced?.001:.6,kt.onContextLost=()=>El(!0),kt.onContextRestored=()=>El(!1),xt=new Qx(kt),xt.reducedMotion=yt.reduced,await xt.build(bM),xt.apply(_d(Ae)),$e.setThumbs(xt.renderThumbs(160,!1)),vd=xt.renderThumbs(200,!0),yM(xt),await kt.start(),xi.classList.add("done"),window.setTimeout(()=>xi.hidden=!0,500),Ae.phase==="jogo"&&$e.openPanel("etapa",!0),Ht(),$e.reportInsets(),As("ready")}catch{console.warn("Falha ao montar a cena 3D."),xi.classList.add("error"),xi.querySelector(".line").textContent="A cena não carregou. Você pode tentar de novo ou seguir no modo descritivo."}}document.getElementById("tentar")?.addEventListener("click",()=>location.reload());document.getElementById("descritivo")?.addEventListener("click",()=>{xi.hidden=!0,jl=!1,document.documentElement.classList.add("no-webgl"),Ht()});document.getElementById("ctx-leve")?.addEventListener("click",()=>{yt.quality="baixa",Yi();try{sessionStorage.setItem(va,JSON.stringify(Ae))}catch{}location.reload()});document.getElementById("ctx-seguir")?.addEventListener("click",()=>El(!1));document.getElementById("demo-stop")?.addEventListener("click",()=>Ra());window.addEventListener("pagehide",()=>{xt?.dispose(),kt?.dispose(),Rt.dispose()});window.__atlas={get state(){return Ae},dispatch:Ve,command:Md,scene:()=>xt?.debug(),bench:(i=60)=>kt?.bench(i),info:()=>kt&&{calls:kt.renderer.info.render.calls,triangles:kt.renderer.info.render.triangles,programs:kt.renderer.info.programs?.length,textures:kt.renderer.info.memory.textures,geometries:kt.renderer.info.memory.geometries},engine:()=>kt};wM();
