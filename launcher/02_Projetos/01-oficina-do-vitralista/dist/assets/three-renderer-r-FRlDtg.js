import{U as yt,c as Or,N as Yt,S as Fr,C as Ke,M as Bt,R as Br,e as tt,w as Ye,V as wt,l as wi,F as Gr,a as za,W as Li,b as Tt,d as rt,L as tn,H as bt,D as Vt,B as Lt,f as Sn,g as be,p as Hr,h as oi,i as $t,j as Vn,k as Vr,m as Fn,n as En,o as Ui,q as zr,r as kr,A as zt,O as Wr,s as Xr,t as Yr,u as Kr,v as qr,x as Zr,y as jr,z as $r,E as si,G as li,I as Qr,J as Jr,K as eo,P as to,Z as _n,Q as no,T as ci,X as Mn,Y as Kn,_ as It,$ as Pn,a0 as io,a1 as Wt,a2 as ao,a3 as ro,a4 as ka,a5 as oo,a6 as Wa,a7 as so,a8 as Xa,a9 as lo,aa as co,ab as fo,ac as _t,ad as Oe,ae as zn,af as Ya,ag as yn,ah as uo,ai as At,aj as gn,ak as cn,al as fn,am as Zt,an as xn,ao as Ka,ap as an,aq as Bn,ar as ho,as as qa,at as jt,au as rn,av as Je,aw as po,ax as qn,ay as mo,az as Zn,aA as Xt,aB as _o,aC as mi,aD as Za,aE as go,aF as on,aG as Ge,aH as ja,aI as $a,aJ as Qa,aK as Ja,aL as Gn,aM as er,aN as tr,aO as vo,aP as So,aQ as Eo,aR as Mo,aS as xo,aT as To,aU as Ro,aV as Ao,aW as Ni,aX as bo,aY as In,aZ as nr,a_ as yi,a$ as Ii,b0 as fi,b1 as kt,b2 as Oi,b3 as Po,b4 as ui,b5 as ir,b6 as ar,b7 as rr,b8 as or,b9 as Co,ba as Do,bb as wo,bc as Lo,bd as sr,be as Uo,bf as No,bg as yo,bh as jn,bi as $n,bj as Qn,bk as Jn,bl as Fi,bm as Bi,bn as Gi,bo as Hi,bp as Vi,bq as zi,br as ki,bs as Wi,bt as Xi,bu as di,bv as Yi,bw as Ki,bx as qi,by as Zi,bz as ji,bA as $i,bB as Qi,bC as Ji,bD as ea,bE as ta,bF as na,bG as ia,bH as aa,bI as ra,bJ as oa,bK as sa,bL as la,bM as ca,bN as fa,bO as ua,bP as hi,bQ as da,bR as lr,bS as ha,bT as cr,bU as Io,bV as Oo,bW as pa,bX as Dt,bY as Fo,bZ as fr,b_ as ur,b$ as dr,c0 as hr,c1 as pr,c2 as mr,c3 as _r,c4 as ei,c5 as ti,c6 as Bo,c7 as Go,c8 as Ho,c9 as Vo,ca as zo,cb as ko,cc as Wo,cd as Xo,ce as Yo,cf as Ko,cg as ln,ch as sn,ci as ma,cj as _a,ck as qo,cl as Zo,cm as jo,cn as $o,co as Qo}from"./three-core-C5FkYRX2.js";function gr(){let e=null,t=!1,n=null,i=null;function r(a,o){i=e.requestAnimationFrame(r),n(a,o)}return{start:function(){t!==!0&&n!==null&&e!==null&&(i=e.requestAnimationFrame(r),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){n=a},setContext:function(a){e=a}}}function Jo(e){const t=new WeakMap;function n(d,R){const m=d.array,b=d.usage,C=m.byteLength,S=e.createBuffer();e.bindBuffer(R,S),e.bufferData(R,m,b),d.onUploadCallback();let g;if(m instanceof Float32Array)g=e.FLOAT;else if(typeof Float16Array<"u"&&m instanceof Float16Array)g=e.HALF_FLOAT;else if(m instanceof Uint16Array)d.isFloat16BufferAttribute?g=e.HALF_FLOAT:g=e.UNSIGNED_SHORT;else if(m instanceof Int16Array)g=e.SHORT;else if(m instanceof Uint32Array)g=e.UNSIGNED_INT;else if(m instanceof Int32Array)g=e.INT;else if(m instanceof Int8Array)g=e.BYTE;else if(m instanceof Uint8Array)g=e.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)g=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:S,type:g,bytesPerElement:m.BYTES_PER_ELEMENT,version:d.version,size:C}}function i(d,R,m){const b=R.array,C=R.updateRanges;if(e.bindBuffer(m,d),C.length===0)e.bufferSubData(m,0,b);else{C.sort((g,x)=>g.start-x.start);let S=0;for(let g=1;g<C.length;g++){const x=C[S],U=C[g];U.start<=x.start+x.count+1?x.count=Math.max(x.count,U.start+U.count-x.start):(++S,C[S]=U)}C.length=S+1;for(let g=0,x=C.length;g<x;g++){const U=C[g];e.bufferSubData(m,U.start*b.BYTES_PER_ELEMENT,b,U.start,U.count)}R.clearUpdateRanges()}R.onUploadCallback()}function r(d){return d.isInterleavedBufferAttribute&&(d=d.data),t.get(d)}function a(d){d.isInterleavedBufferAttribute&&(d=d.data);const R=t.get(d);R&&(e.deleteBuffer(R.buffer),t.delete(d))}function o(d,R){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const b=t.get(d);(!b||b.version<d.version)&&t.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const m=t.get(d);if(m===void 0)t.set(d,n(d,R));else if(m.version<d.version){if(m.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(m.buffer,d,R),m.version=d.version}}return{get:r,remove:a,update:o}}var es=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ts=`#ifdef USE_ALPHAHASH
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
#endif`,ns=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,is=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,as=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rs=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,os=`#ifdef USE_AOMAP
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
#endif`,ss=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ls=`#ifdef USE_BATCHING
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
#endif`,cs=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fs=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,us=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ds=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hs=`#ifdef USE_IRIDESCENCE
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
#endif`,ps=`#ifdef USE_BUMPMAP
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
#endif`,ms=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,_s=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gs=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vs=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ss=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Es=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ms=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,xs=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Ts=`#define PI 3.141592653589793
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
} // validated`,Rs=`vec3 transformedNormal = objectNormal;
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
#endif`,As=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,bs=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ps=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cs=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ds="gl_FragColor = linearToOutputTexel( gl_FragColor );",ws=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ls=`#ifdef USE_ENVMAP
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
#endif`,Us=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Ns=`#ifdef USE_ENVMAP
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
#endif`,ys=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Is=`#ifdef USE_ENVMAP
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
#endif`,Os=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fs=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bs=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gs=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hs=`#ifdef USE_GRADIENTMAP
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
}`,Vs=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zs=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ks=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ws=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Xs=`#ifdef USE_ENVMAP
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
#endif`,Ys=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ks=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qs=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zs=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,js=`PhysicalMaterial material;
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
#endif`,$s=`uniform sampler2D dfgLUT;
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
}`,Qs=`
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
#endif`,Js=`#if defined( RE_IndirectDiffuse )
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
#endif`,el=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tl=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,nl=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,il=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,al=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rl=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ol=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sl=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ll=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cl=`#if defined( USE_POINTS_UV )
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
#endif`,fl=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ul=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dl=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hl=`#if defined( USE_MORPHCOLORS )
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
#endif`,pl=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ml=`#ifdef USE_MORPHTARGETS
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
#endif`,_l=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gl=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vl=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,El=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ml=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,xl=`#ifdef USE_NORMALMAP
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
#endif`,Tl=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Al=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bl=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Cl=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Dl=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ll=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ul=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yl=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Il=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ol=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fl=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Bl=`float getShadowMask() {
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
}`,Gl=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hl=`#ifdef USE_SKINNING
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
#endif`,Vl=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zl=`#ifdef USE_SKINNING
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
#endif`,kl=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wl=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yl=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kl=`#ifdef USE_TRANSMISSION
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
#endif`,ql=`#ifdef USE_TRANSMISSION
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
#endif`,Zl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$l=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ql=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ec=`uniform sampler2D t2D;
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
}`,tc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nc=`uniform float backgroundBlurriness;
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
}`,ic=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ac=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rc=`#include <common>
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
}`,oc=`#if DEPTH_PACKING == 3200
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
}`,sc=`#define DISTANCE
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
}`,lc=`#define DISTANCE
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
}`,cc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fc=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uc=`uniform float scale;
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
}`,dc=`uniform vec3 diffuse;
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
}`,hc=`#include <common>
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
}`,pc=`uniform vec3 diffuse;
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
}`,mc=`#define LAMBERT
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
}`,_c=`#define LAMBERT
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
}`,gc=`#define MATCAP
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
}`,vc=`#define MATCAP
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
}`,Sc=`#define NORMAL
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
}`,Ec=`#define NORMAL
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
}`,Mc=`#define PHONG
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
}`,xc=`#define PHONG
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
}`,Tc=`#define STANDARD
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
}`,Rc=`#define STANDARD
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
}`,Ac=`#define TOON
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
}`,bc=`#define TOON
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
}`,Pc=`uniform float size;
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
}`,Cc=`uniform vec3 diffuse;
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
}`,Dc=`#include <common>
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
}`,wc=`uniform vec3 color;
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
}`,Lc=`uniform float rotation;
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
}`,Uc=`uniform vec3 diffuse;
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
}`,Ie={alphahash_fragment:es,alphahash_pars_fragment:ts,alphamap_fragment:ns,alphamap_pars_fragment:is,alphatest_fragment:as,alphatest_pars_fragment:rs,aomap_fragment:os,aomap_pars_fragment:ss,batching_pars_vertex:ls,batching_vertex:cs,begin_vertex:fs,beginnormal_vertex:us,bsdfs:ds,iridescence_fragment:hs,bumpmap_pars_fragment:ps,clipping_planes_fragment:ms,clipping_planes_pars_fragment:_s,clipping_planes_pars_vertex:gs,clipping_planes_vertex:vs,color_fragment:Ss,color_pars_fragment:Es,color_pars_vertex:Ms,color_vertex:xs,common:Ts,defaultnormal_vertex:Rs,displacementmap_pars_vertex:As,displacementmap_vertex:bs,emissivemap_fragment:Ps,emissivemap_pars_fragment:Cs,colorspace_fragment:Ds,colorspace_pars_fragment:ws,envmap_fragment:Ls,envmap_common_pars_fragment:Us,envmap_pars_fragment:Ns,envmap_pars_vertex:ys,envmap_physical_pars_fragment:Xs,envmap_vertex:Is,fog_vertex:Os,fog_pars_vertex:Fs,fog_fragment:Bs,fog_pars_fragment:Gs,gradientmap_pars_fragment:Hs,lightmap_pars_fragment:Vs,lights_lambert_fragment:zs,lights_lambert_pars_fragment:ks,lights_pars_begin:Ws,lights_toon_fragment:Ys,lights_toon_pars_fragment:Ks,lights_phong_fragment:qs,lights_phong_pars_fragment:Zs,lights_physical_fragment:js,lights_physical_pars_fragment:$s,lights_fragment_begin:Qs,lights_fragment_maps:Js,lights_fragment_end:el,lightprobes_pars_fragment:tl,logdepthbuf_fragment:nl,logdepthbuf_pars_fragment:il,logdepthbuf_pars_vertex:al,logdepthbuf_vertex:rl,map_fragment:ol,map_pars_fragment:sl,map_particle_fragment:ll,map_particle_pars_fragment:cl,metalnessmap_fragment:fl,metalnessmap_pars_fragment:ul,morphinstance_vertex:dl,morphcolor_vertex:hl,morphnormal_vertex:pl,morphtarget_pars_vertex:ml,morphtarget_vertex:_l,normal_fragment_begin:gl,normal_fragment_maps:vl,normal_pars_fragment:Sl,normal_pars_vertex:El,normal_vertex:Ml,normalmap_pars_fragment:xl,clearcoat_normal_fragment_begin:Tl,clearcoat_normal_fragment_maps:Rl,clearcoat_pars_fragment:Al,iridescence_pars_fragment:bl,opaque_fragment:Pl,packing:Cl,premultiplied_alpha_fragment:Dl,project_vertex:wl,dithering_fragment:Ll,dithering_pars_fragment:Ul,roughnessmap_fragment:Nl,roughnessmap_pars_fragment:yl,shadowmap_pars_fragment:Il,shadowmap_pars_vertex:Ol,shadowmap_vertex:Fl,shadowmask_pars_fragment:Bl,skinbase_vertex:Gl,skinning_pars_vertex:Hl,skinning_vertex:Vl,skinnormal_vertex:zl,specularmap_fragment:kl,specularmap_pars_fragment:Wl,tonemapping_fragment:Xl,tonemapping_pars_fragment:Yl,transmission_fragment:Kl,transmission_pars_fragment:ql,uv_pars_fragment:Zl,uv_pars_vertex:jl,uv_vertex:$l,worldpos_vertex:Ql,background_vert:Jl,background_frag:ec,backgroundCube_vert:tc,backgroundCube_frag:nc,cube_vert:ic,cube_frag:ac,depth_vert:rc,depth_frag:oc,distance_vert:sc,distance_frag:lc,equirect_vert:cc,equirect_frag:fc,linedashed_vert:uc,linedashed_frag:dc,meshbasic_vert:hc,meshbasic_frag:pc,meshlambert_vert:mc,meshlambert_frag:_c,meshmatcap_vert:gc,meshmatcap_frag:vc,meshnormal_vert:Sc,meshnormal_frag:Ec,meshphong_vert:Mc,meshphong_frag:xc,meshphysical_vert:Tc,meshphysical_frag:Rc,meshtoon_vert:Ac,meshtoon_frag:bc,points_vert:Pc,points_frag:Cc,shadow_vert:Dc,shadow_frag:wc,sprite_vert:Lc,sprite_frag:Uc},he={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},Ft={basic:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Ie.meshbasic_vert,fragmentShader:Ie.meshbasic_frag},lambert:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ke(0)},envMapIntensity:{value:1}}]),vertexShader:Ie.meshlambert_vert,fragmentShader:Ie.meshlambert_frag},phong:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ie.meshphong_vert,fragmentShader:Ie.meshphong_frag},standard:{uniforms:Dt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag},toon:{uniforms:Dt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ie.meshtoon_vert,fragmentShader:Ie.meshtoon_frag},matcap:{uniforms:Dt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Ie.meshmatcap_vert,fragmentShader:Ie.meshmatcap_frag},points:{uniforms:Dt([he.points,he.fog]),vertexShader:Ie.points_vert,fragmentShader:Ie.points_frag},dashed:{uniforms:Dt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ie.linedashed_vert,fragmentShader:Ie.linedashed_frag},depth:{uniforms:Dt([he.common,he.displacementmap]),vertexShader:Ie.depth_vert,fragmentShader:Ie.depth_frag},normal:{uniforms:Dt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Ie.meshnormal_vert,fragmentShader:Ie.meshnormal_frag},sprite:{uniforms:Dt([he.sprite,he.fog]),vertexShader:Ie.sprite_vert,fragmentShader:Ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ie.background_vert,fragmentShader:Ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Ie.backgroundCube_vert,fragmentShader:Ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ie.cube_vert,fragmentShader:Ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ie.equirect_vert,fragmentShader:Ie.equirect_frag},distance:{uniforms:Dt([he.common,he.displacementmap,{referencePosition:{value:new be},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ie.distance_vert,fragmentShader:Ie.distance_frag},shadow:{uniforms:Dt([he.lights,he.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Ie.shadow_vert,fragmentShader:Ie.shadow_frag}};Ft.physical={uniforms:Dt([Ft.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ge},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag};const Cn={r:0,b:0,g:0},Nc=new Bt,vr=new Ge;vr.set(-1,0,0,0,1,0,0,0,1);function yc(e,t,n,i,r,a){const o=new Ke(0);let d=r===!0?0:1,R,m,b=null,C=0,S=null;function g(_){let L=_.isScene===!0?_.background:null;if(L&&L.isTexture){const E=_.backgroundBlurriness>0;L=t.get(L,E)}return L}function x(_){let L=!1;const E=g(_);E===null?u(o,d):E&&E.isColor&&(u(E,1),L=!0);const D=e.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||L)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function U(_,L){const E=g(L);E&&E.isCubeTexture?(m===void 0&&(m=new $t(new Vn(1,1,1),new _t({name:"BackgroundCubeMaterial",uniforms:ui(Ft.backgroundCube.uniforms),vertexShader:Ft.backgroundCube.vertexShader,fragmentShader:Ft.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(D,T,l){this.matrixWorld.copyPosition(l.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(m)),m.material.uniforms.envMap.value=E,m.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(Nc.makeRotationFromEuler(L.backgroundRotation)).transpose(),E.isRenderTargetTexture===!1&&m.material.uniforms.backgroundRotation.value.premultiply(vr),m.material.toneMapped=rt.getTransfer(E.colorSpace)!==Je,(b!==E||C!==E.version||S!==e.toneMapping)&&(m.material.needsUpdate=!0,b=E,C=E.version,S=e.toneMapping),m.layers.enableAll(),_.unshift(m,m.geometry,m.material,0,0,null)):E&&E.isTexture&&(R===void 0&&(R=new $t(new ir(2,2),new _t({name:"BackgroundMaterial",uniforms:ui(Ft.background.uniforms),vertexShader:Ft.background.vertexShader,fragmentShader:Ft.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),R.geometry.deleteAttribute("normal"),Object.defineProperty(R.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(R)),R.material.uniforms.t2D.value=E,R.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,R.material.toneMapped=rt.getTransfer(E.colorSpace)!==Je,E.matrixAutoUpdate===!0&&E.updateMatrix(),R.material.uniforms.uvTransform.value.copy(E.matrix),(b!==E||C!==E.version||S!==e.toneMapping)&&(R.material.needsUpdate=!0,b=E,C=E.version,S=e.toneMapping),R.layers.enableAll(),_.unshift(R,R.geometry,R.material,0,0,null))}function u(_,L){_.getRGB(Cn,ar(e)),n.buffers.color.setClear(Cn.r,Cn.g,Cn.b,L,a)}function f(){m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0),R!==void 0&&(R.geometry.dispose(),R.material.dispose(),R=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,L=1){o.set(_),d=L,u(o,d)},getClearAlpha:function(){return d},setClearAlpha:function(_){d=_,u(o,d)},render:x,addToRenderList:U,dispose:f}}function Ic(e,t){const n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},r=S(null);let a=r,o=!1;function d(I,B,q,P,j){let Z=!1;const z=C(I,P,q,B);a!==z&&(a=z,m(a.object)),Z=g(I,P,q,j),Z&&x(I,P,q,j),j!==null&&t.update(j,e.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,E(I,B,q,P),j!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(j).buffer))}function R(){return e.createVertexArray()}function m(I){return e.bindVertexArray(I)}function b(I){return e.deleteVertexArray(I)}function C(I,B,q,P){const j=P.wireframe===!0;let Z=i[B.id];Z===void 0&&(Z={},i[B.id]=Z);const z=I.isInstancedMesh===!0?I.id:0;let se=Z[z];se===void 0&&(se={},Z[z]=se);let W=se[q.id];W===void 0&&(W={},se[q.id]=W);let $=W[j];return $===void 0&&($=S(R()),W[j]=$),$}function S(I){const B=[],q=[],P=[];for(let j=0;j<n;j++)B[j]=0,q[j]=0,P[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:q,attributeDivisors:P,object:I,attributes:{},index:null}}function g(I,B,q,P){const j=a.attributes,Z=B.attributes;let z=0;const se=q.getAttributes();for(const W in se)if(se[W].location>=0){const ee=j[W];let Me=Z[W];if(Me===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(Me=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(Me=I.instanceColor)),ee===void 0||ee.attribute!==Me||Me&&ee.data!==Me.data)return!0;z++}return a.attributesNum!==z||a.index!==P}function x(I,B,q,P){const j={},Z=B.attributes;let z=0;const se=q.getAttributes();for(const W in se)if(se[W].location>=0){let ee=Z[W];ee===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(ee=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(ee=I.instanceColor));const Me={};Me.attribute=ee,ee&&ee.data&&(Me.data=ee.data),j[W]=Me,z++}a.attributes=j,a.attributesNum=z,a.index=P}function U(){const I=a.newAttributes;for(let B=0,q=I.length;B<q;B++)I[B]=0}function u(I){f(I,0)}function f(I,B){const q=a.newAttributes,P=a.enabledAttributes,j=a.attributeDivisors;q[I]=1,P[I]===0&&(e.enableVertexAttribArray(I),P[I]=1),j[I]!==B&&(e.vertexAttribDivisor(I,B),j[I]=B)}function _(){const I=a.newAttributes,B=a.enabledAttributes;for(let q=0,P=B.length;q<P;q++)B[q]!==I[q]&&(e.disableVertexAttribArray(q),B[q]=0)}function L(I,B,q,P,j,Z,z){z===!0?e.vertexAttribIPointer(I,B,q,j,Z):e.vertexAttribPointer(I,B,q,P,j,Z)}function E(I,B,q,P){U();const j=P.attributes,Z=q.getAttributes(),z=B.defaultAttributeValues;for(const se in Z){const W=Z[se];if(W.location>=0){let $=j[se];if($===void 0&&(se==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),se==="instanceColor"&&I.instanceColor&&($=I.instanceColor)),$!==void 0){const ee=$.normalized,Me=$.itemSize,Le=t.get($);if(Le===void 0)continue;const X=Le.buffer,pe=Le.type,_e=Le.bytesPerElement,xe=pe===e.INT||pe===e.UNSIGNED_INT||$.gpuType===sr;if($.isInterleavedBufferAttribute){const ue=$.data,De=ue.isInterleavedBuffer===!0?ue.stride:ue.itemSize,nt=$.offset;if(ue.isInstancedInterleavedBuffer||ue.isInstancedBufferAttribute){for(let Ce=0;Ce<W.locationSize;Ce++)f(W.location+Ce,ue.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let Ce=0;Ce<W.locationSize;Ce++)u(W.location+Ce);e.bindBuffer(e.ARRAY_BUFFER,X);for(let Ce=0;Ce<W.locationSize;Ce++)L(W.location+Ce,Me/W.locationSize,pe,ee,De*_e,(nt+Me/W.locationSize*Ce)*_e,xe)}else{if($.isInstancedBufferAttribute){for(let ue=0;ue<W.locationSize;ue++)f(W.location+ue,$.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ue=0;ue<W.locationSize;ue++)u(W.location+ue);e.bindBuffer(e.ARRAY_BUFFER,X);for(let ue=0;ue<W.locationSize;ue++)L(W.location+ue,Me/W.locationSize,pe,ee,Me*_e,Me/W.locationSize*ue*_e,xe)}}else if(z!==void 0){const ee=z[se];if(ee!==void 0)switch(ee.length){case 2:e.vertexAttrib2fv(W.location,ee);break;case 3:e.vertexAttrib3fv(W.location,ee);break;case 4:e.vertexAttrib4fv(W.location,ee);break;default:e.vertexAttrib1fv(W.location,ee)}}}}_()}function D(){k();for(const I in i){const B=i[I];for(const q in B){const P=B[q];for(const j in P){const Z=P[j];for(const z in Z)b(Z[z].object),delete Z[z];delete P[j]}}delete i[I]}}function T(I){if(i[I.id]===void 0)return;const B=i[I.id];for(const q in B){const P=B[q];for(const j in P){const Z=P[j];for(const z in Z)b(Z[z].object),delete Z[z];delete P[j]}}delete i[I.id]}function l(I){for(const B in i){const q=i[B];for(const P in q){const j=q[P];if(j[I.id]===void 0)continue;const Z=j[I.id];for(const z in Z)b(Z[z].object),delete Z[z];delete j[I.id]}}}function p(I){for(const B in i){const q=i[B],P=I.isInstancedMesh===!0?I.id:0,j=q[P];if(j!==void 0){for(const Z in j){const z=j[Z];for(const se in z)b(z[se].object),delete z[se];delete j[Z]}delete q[P],Object.keys(q).length===0&&delete i[B]}}}function k(){w(),o=!0,a!==r&&(a=r,m(a.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:d,reset:k,resetDefaultState:w,dispose:D,releaseStatesOfGeometry:T,releaseStatesOfObject:p,releaseStatesOfProgram:l,initAttributes:U,enableAttribute:u,disableUnusedAttributes:_}}function Oc(e,t,n){let i;function r(R){i=R}function a(R,m){e.drawArrays(i,R,m),n.update(m,i,1)}function o(R,m,b){b!==0&&(e.drawArraysInstanced(i,R,m,b),n.update(m,i,b))}function d(R,m,b){if(b===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,R,0,m,0,b);let S=0;for(let g=0;g<b;g++)S+=m[g];n.update(S,i,1)}this.setMode=r,this.render=a,this.renderInstances=o,this.renderMultiDraw=d}function Fc(e,t,n,i){let r;function a(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const l=t.get("EXT_texture_filter_anisotropic");r=e.getParameter(l.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(l){return!(l!==Xt&&i.convert(l)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(l){const p=l===bt&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(l!==yt&&l!==Zt&&!p&&i.convert(l)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function R(l){if(l==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";l="mediump"}return l==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=n.precision!==void 0?n.precision:"highp";const b=R(m);b!==m&&(Ye("WebGLRenderer:",m,"not supported, using",b,"instead."),m=b);const C=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),S=n.logarithmicDepthBuffer===!0&&C===!1;n.reversedDepthBuffer===!0&&C===!1&&Ye("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),n.logarithmicDepthBuffer===!0&&C===!0&&Ye("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const g=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),x=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),U=e.getParameter(e.MAX_TEXTURE_SIZE),u=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),f=e.getParameter(e.MAX_VERTEX_ATTRIBS),_=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),L=e.getParameter(e.MAX_VARYING_VECTORS),E=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),D=e.getParameter(e.MAX_SAMPLES),T=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:R,textureFormatReadable:o,textureTypeReadable:d,precision:m,logarithmicDepthBuffer:S,reversedDepthBuffer:C,maxTextures:g,maxVertexTextures:x,maxTextureSize:U,maxCubemapSize:u,maxAttributes:f,maxVertexUniforms:_,maxVaryings:L,maxFragmentUniforms:E,maxSamples:D,samples:T}}function Bc(e){const t=this;let n=null,i=0,r=!1,a=!1;const o=new ja,d=new Ge,R={value:null,needsUpdate:!1};this.uniform=R,this.numPlanes=0,this.numIntersection=0,this.init=function(C,S){const g=C.length!==0||S||i!==0||r;return r=S,i=C.length,g},this.beginShadows=function(){a=!0,b(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(C,S){n=b(C,S,0)},this.setState=function(C,S,g){const x=C.clippingPlanes,U=C.clipIntersection,u=C.clipShadows,f=e.get(C);if(!r||x===null||x.length===0||a&&!u)a?b(null):m();else{const _=a?0:i,L=_*4;let E=f.clippingState||null;R.value=E,E=b(x,S,L,g);for(let D=0;D!==L;++D)E[D]=n[D];f.clippingState=E,this.numIntersection=U?this.numPlanes:0,this.numPlanes+=_}};function m(){R.value!==n&&(R.value=n,R.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function b(C,S,g,x){const U=C!==null?C.length:0;let u=null;if(U!==0){if(u=R.value,x!==!0||u===null){const f=g+U*4,_=S.matrixWorldInverse;d.getNormalMatrix(_),(u===null||u.length<f)&&(u=new Float32Array(f));for(let L=0,E=g;L!==U;++L,E+=4)o.copy(C[L]).applyMatrix4(_,d),o.normal.toArray(u,E),u[E+3]=o.constant}R.value=u,R.needsUpdate=!0}return t.numPlanes=U,t.numIntersection=0,u}}class _i extends Tt{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new rr(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Vn(5,5,5),a=new _t({name:"CubemapFromEquirect",uniforms:ui(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Lt,blending:At});a.uniforms.tEquirect.value=n;const o=new $t(r,a),d=n.minFilter;return n.minFilter===tn&&(n.minFilter=It),new oi(1,10,this).update(t,o),n.minFilter=d,o.geometry.dispose(),o.material.dispose(),this}clear(t,n=!0,i=!0,r=!0){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(n,i,r);t.setRenderTarget(a)}}const ga=256,Gc=3,Hc=20,Sr=256,Er=16,Vc=3,zc=new be,kc=new Ke;class Hn{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new oi(1,10,null),this._boxMesh=new $t(new Vn(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,n=0,i=.1,r=100,a={}){const{size:o=256,position:d=zc}=a,R=this._renderer;this._setSize(o);const m=this._allocateTarget(),b=this._getSourceTarget(!0);n>0&&(b.texture.mipmapsAutoUpdate=!1);const C=R.autoClear,S=R.autoClearColor,g=R.autoClearDepth,x=R.autoClearStencil,U=t.background;R.autoClear=!0,R.autoClearColor=!0,R.autoClearDepth=!0,R.autoClearStencil=!0,U===null&&(t.background=R.getClearColor(kc));const u=new oi(i,r,b);return u.position.copy(d),u.update(R,t),R.autoClear=C,R.autoClearColor=S,R.autoClearDepth=g,R.autoClearStencil=x,t.background=U,n>0&&(b.texture.mipmapsAutoUpdate=!0,this._blur(m,n)),this._applyPMREM(m),m}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ea(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,n){return n>0?1-Math.sqrt(1-t/n):0}_setSize(t){this._cubeSize=Math.max(ga,Vr(t))}_fromTexture(t,n){t.mapping===Fn||t.mapping===En?this._setSize(t.image.length===0?ga:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const i=n||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(i),i}_allocateTarget(){const t=this._cubeSize,n=va(t,!1,!1),i=Math.log2(t)-Gc;for(let r=0;r<=i;r++)n.texture.mipmaps.push({width:t>>r,height:t>>r});return n.texture.name="PMREM",n.texture.isPMREMTexture=!0,n}_getSourceTarget(t=!1){const n=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==n||t&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=va(n,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,n,i){const r=this._boxMesh,a=this._cubeCamera;r.material=i,a.renderTarget=t,a.activeMipmapLevel=n;const o=t.width>>n;t.viewport.set(0,0,o,o),a.update(this._renderer,r),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let n;t.mapping===Fn||t.mapping===En?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ea()),n=this._cubemapMaterial,n.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Sa()),n=this._equirectMaterial),n.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,n)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Wc(),this._integrationMaterial=Xc());const n=this._cubeSize,i=t.texture.mipmaps.length-1,r=this._ggxMaterial.uniforms;r.envMap.value=this._sourceTarget.texture;const a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Er);for(let o=0;o<=i;o++){const d=Hn.lodToRoughness(o,i);if(o>i-Vc)a.roughness.value=d,this._renderCube(t,o,this._integrationMaterial);else{const R=d>0?Math.log2(n)+.5*Math.log2(6/(Sr*Math.pow(d,4)))+.5:0;r.roughness.value=d,r.lodBias.value=R,this._renderCube(t,o,this._ggxMaterial)}}}_blur(t,n){this._blurMaterial===null&&(this._blurMaterial=Yc());const i=this._blurMaterial,r=i.uniforms,a=this._sourceTarget;r.sigma.value=Math.min(n,Math.PI)/Math.SQRT2,r.envMap.value=a.texture,this._renderCube(t,0,i),r.envMap.value=t.texture,this._renderCube(a,0,i)}}function va(e,t,n){return new _i(e,{minFilter:tn,generateMipmaps:t,type:bt,colorSpace:Za,depthBuffer:n})}function Rn(e,t,n){return new _t({name:e,uniforms:t,vertexShader:Ie.cube_vert,fragmentShader:n,side:Lt,blending:At,depthTest:!1,depthWrite:!1})}function Wc(){return Rn("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Sr}u

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
	`)}function Xc(){return Rn("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Er}},`

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
	`)}function Yc(){return Rn("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Hc}
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
	`)}function Sa(){return Rn("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Ea(){return Rn("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Kc(e){let t=new WeakMap,n=new WeakMap,i=null;function r(S,g=!1){return S==null?null:g?o(S):a(S)}function a(S){if(S&&S.isTexture){const g=S.mapping;if(g===ei||g===ti)if(t.has(S)){const x=t.get(S).texture;return d(x,S.mapping)}else{const x=S.image;if(x&&x.height>0){const U=new _i(x.height);return U.fromEquirectangularTexture(e,S),t.set(S,U),S.addEventListener("dispose",m),d(U.texture,S.mapping)}else return null}}return S}function o(S){if(S&&S.isTexture&&S.isPMREMTexture!==!0){const g=S.mapping,x=g===ei||g===ti,U=g===Fn||g===En;if(x||U){let u=n.get(S);const f=u!==void 0?u.texture.pmremVersion:0;if(S.isRenderTargetTexture&&S.pmremVersion!==f)return i===null&&(i=new Hn(e)),u=x?i.fromEquirectangular(S,u):i.fromCubemap(S,u),u.texture.pmremVersion=S.pmremVersion,n.set(S,u),u.texture;if(u!==void 0)return u.texture;{const _=S.image;return x&&_&&_.height>0||U&&_&&R(_)?(i===null&&(i=new Hn(e)),u=x?i.fromEquirectangular(S):i.fromCubemap(S),u.texture.pmremVersion=S.pmremVersion,n.set(S,u),S.addEventListener("dispose",b),u.texture):null}}}return S}function d(S,g){return g===ei?S.mapping=Fn:g===ti&&(S.mapping=En),S}function R(S){let g=0;const x=6;for(let U=0;U<x;U++)S[U]!==void 0&&g++;return g===x}function m(S){const g=S.target;g.removeEventListener("dispose",m);const x=t.get(g);x!==void 0&&(t.delete(g),x.dispose())}function b(S){const g=S.target;g.removeEventListener("dispose",b);const x=n.get(g);x!==void 0&&(n.delete(g),x.dispose())}function C(){t=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:C}}function qc(e){const t={};function n(i){if(t[i]!==void 0)return t[i];const r=e.getExtension(i);return t[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&go("WebGLRenderer: "+i+" extension not supported."),r}}}function Zc(e,t,n,i){const r={},a=new WeakMap,o=new FinalizationRegistry(x=>delete r[x]);function d(x){R(x.target)}function R(x){x.index!==null&&t.remove(x.index);for(const u in x.attributes)t.remove(x.attributes[u]);x.removeEventListener("dispose",d),delete r[x.id],o.unregister(x);const U=a.get(x);U&&(t.remove(U),a.delete(x)),i.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,n.memory.geometries--}function m(x,U){return r[U.id]!==void 0||(U.addEventListener("dispose",d),r[U.id]=new WeakRef(U),o.register(U,U.id,U),n.memory.geometries++),U}function b(x){const U=x.attributes;for(const u in U)t.update(U[u],e.ARRAY_BUFFER)}function C(x){const U=x.index,u=x.attributes.position;let f=0;if(u===void 0)return;const _=U!==null?U.array.length:u.array.length/3-1,L=u.count>=65535?Io:Oo,E=new L(Math.ceil(_/3)*6,1),D=E.array;if(U!==null){const l=U.array;f=U.version;for(let p=0,k=0;p<_;p+=3){const w=l[p+0],I=l[p+1],B=l[p+2];D[k++]=w,D[k++]=I,D[k++]=I,D[k++]=B,D[k++]=B,D[k++]=w}}else{f=u.version;for(let l=0,p=0;l<_;l+=3){const k=l+0,w=l+1,I=l+2;D[p++]=k,D[p++]=w,D[p++]=w,D[p++]=I,D[p++]=I,D[p++]=k}}E.version=f;const T=a.get(x);T&&t.remove(T),a.set(x,E)}function S(x){const U=a.get(x);if(U){const u=x.index;u!==null&&U.version<u.version&&C(x)}else C(x);return a.get(x)}function g(){for(const x in r){const U=r[x].deref();U!==void 0&&R(U)}}return{get:m,update:b,getWireframeAttribute:S,dispose:g}}function jc(e,t,n){let i;function r(C){i=C}let a,o;function d(C){a=C.type,o=C.bytesPerElement}function R(C,S){e.drawElements(i,S,a,C*o),n.update(S,i,1)}function m(C,S,g){g!==0&&(e.drawElementsInstanced(i,S,a,C*o,g),n.update(S,i,g))}function b(C,S,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,S,0,a,C,0,g);let U=0;for(let u=0;u<g;u++)U+=S[u];n.update(U,i,1)}this.setMode=r,this.setIndex=d,this.render=R,this.renderInstances=m,this.renderMultiDraw=b}function $c(e){const t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,d){switch(n.calls++,o){case e.TRIANGLES:n.triangles+=d*(a/3);break;case e.LINES:n.lines+=d*(a/2);break;case e.LINE_STRIP:n.lines+=d*(a-1);break;case e.LINE_LOOP:n.lines+=d*a;break;case e.POINTS:n.points+=d*a;break;default:tt("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Qc(e,t,n){const i=new WeakMap,r=new wt;function a(o,d,R){const m=o.morphTargetInfluences,b=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,C=b!==void 0?b.length:0;let S=i.get(d);if(S===void 0||S.count!==C){let k=function(){l.dispose(),i.delete(d),d.removeEventListener("dispose",k)};S!==void 0&&S.texture.dispose();const g=d.morphAttributes.position!==void 0,x=d.morphAttributes.normal!==void 0,U=d.morphAttributes.color!==void 0,u=d.morphAttributes.position||[],f=d.morphAttributes.normal||[],_=d.morphAttributes.color||[];let L=0;g===!0&&(L=1),x===!0&&(L=2),U===!0&&(L=3);let E=d.attributes.position.count*L,D=1;E>t.maxTextureSize&&(D=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const T=new Float32Array(E*D*4*C),l=new lr(T,E,D,C);l.type=Zt,l.needsUpdate=!0;const p=L*4;for(let w=0;w<C;w++){const I=u[w],B=f[w],q=_[w],P=E*D*4*w;for(let j=0;j<I.count;j++){const Z=j*p;g===!0&&(r.fromBufferAttribute(I,j),T[P+Z+0]=r.x,T[P+Z+1]=r.y,T[P+Z+2]=r.z,T[P+Z+3]=0),x===!0&&(r.fromBufferAttribute(B,j),T[P+Z+4]=r.x,T[P+Z+5]=r.y,T[P+Z+6]=r.z,T[P+Z+7]=0),U===!0&&(r.fromBufferAttribute(q,j),T[P+Z+8]=r.x,T[P+Z+9]=r.y,T[P+Z+10]=r.z,T[P+Z+11]=q.itemSize===4?r.w:1)}}S={count:C,texture:l,size:new Oe(E,D)},i.set(d,S),d.addEventListener("dispose",k)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)R.getUniforms().setValue(e,"morphTexture",o.morphTexture,n);else{let g=0;for(let U=0;U<m.length;U++)g+=m[U];const x=d.morphTargetsRelative?1:1-g;R.getUniforms().setValue(e,"morphTargetBaseInfluence",x),R.getUniforms().setValue(e,"morphTargetInfluences",m)}R.getUniforms().setValue(e,"morphTargetsTexture",S.texture,n),R.getUniforms().setValue(e,"morphTargetsTextureSize",S.size)}return{update:a}}function Jc(e,t,n,i,r){let a=new WeakMap;function o(m){const b=r.render.frame,C=m.geometry,S=t.get(m,C);if(a.get(S)!==b&&(t.update(S),a.set(S,b)),m.isInstancedMesh&&(m.hasEventListener("dispose",R)===!1&&m.addEventListener("dispose",R),a.get(m)!==b&&(n.update(m.instanceMatrix,e.ARRAY_BUFFER),m.instanceColor!==null&&n.update(m.instanceColor,e.ARRAY_BUFFER),a.set(m,b))),m.isSkinnedMesh){const g=m.skeleton;a.get(g)!==b&&(g.update(),a.set(g,b))}return S}function d(){a=new WeakMap}function R(m){const b=m.target;b.removeEventListener("dispose",R),i.releaseStatesOfObject(b),n.remove(b.instanceMatrix),b.instanceColor!==null&&n.remove(b.instanceColor)}return{update:o,dispose:d}}const ef={[_r]:"LINEAR_TONE_MAPPING",[mr]:"REINHARD_TONE_MAPPING",[pr]:"CINEON_TONE_MAPPING",[hr]:"ACES_FILMIC_TONE_MAPPING",[dr]:"AGX_TONE_MAPPING",[ur]:"NEUTRAL_TONE_MAPPING",[fr]:"CUSTOM_TONE_MAPPING"};function tf(e,t,n,i,r,a){const o=new Tt(t,n,{type:e,depthBuffer:r,stencilBuffer:a,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let d=null,R=null,m=null;const b=new zn;b.setAttribute("position",new Bn([-1,3,0,-1,-1,0,3,-1,0],3)),b.setAttribute("uv",new Bn([0,2,0,0,2,0],2));const C=new ho({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),S=new $t(b,C),g=new qa(-1,1,1,-1,0,1);let x=null,U=null,u=!1,f,_=null,L=[],E=!1;this.setSize=function(D,T){o.setSize(D,T),d!==null&&d.setSize(D,T),R!==null&&R.setSize(D,T);for(let l=0;l<L.length;l++){const p=L[l];p.setSize&&p.setSize(D,T)}},this.setEffects=function(D){L=D,E=L.length>0&&L[0].isRenderPass===!0;const T=o.width,l=o.height;L.length>0&&d===null&&(d=new Tt(T,l,{type:bt,depthBuffer:!1,stencilBuffer:!1}),R=new Tt(T,l,{type:bt,depthBuffer:!1,stencilBuffer:!1}));const p=r===!0&&L.some(k=>k.needsDepthTexture===!0);p!==(o.depthTexture!==null)&&(p===!0&&m===null&&(m=new fn(T,l),a===!0&&(m.format=jt,m.type=rn)),o.dispose(),o.depthTexture=p?m:null,o.resolveDepthBuffer=p,o.storeMultisampledDepthBuffer=p);for(let k=0;k<L.length;k++){const w=L[k];w.setSize&&w.setSize(T,l),p&&w.needsDepthTexture===!0&&w.setDepthTexture&&w.setDepthTexture(m)}},this.begin=function(D,T){if(u||D.toneMapping===Yt&&L.length===0)return!1;if(_=T,T!==null){const l=T.width,p=T.height;(o.width!==l||o.height!==p)&&this.setSize(l,p)}return E===!1&&D.setRenderTarget(o),f=D.toneMapping,D.toneMapping=Yt,!0},this.hasRenderPass=function(){return E},this.end=function(D,T){D.toneMapping=f,u=!0;let l=o,p=d;for(let k=0;k<L.length;k++){const w=L[k];w.enabled!==!1&&(w.render(D,p,l,T),w.needsSwap!==!1&&(l=p,p=p===d?R:d))}if(x!==D.outputColorSpace||U!==D.toneMapping){x=D.outputColorSpace,U=D.toneMapping,C.defines={},rt.getTransfer(x)===Je&&(C.defines.SRGB_TRANSFER="");const k=ef[U];k&&(C.defines[k]=""),C.needsUpdate=!0}C.uniforms.tDiffuse.value=l.texture,D.setRenderTarget(_),D.render(S,g),_=null,u=!1},this.isCompositing=function(){return u},this.dispose=function(){o.dispose(),d!==null&&d.dispose(),R!==null&&R.dispose(),b.dispose(),C.dispose()}}const Mr=new ko,xr=new fn(1,1),Tr=new Ka(1),Rr=new lr,Ar=new zo,br=new rr,Ma=[],xa=[],Ta=new Float32Array(16),Ra=new Float32Array(9),Aa=new Float32Array(4);function un(e,t,n){const i=e[0];if(i<=0||i>0)return e;const r=t*n;let a=Ma[r];if(a===void 0&&(a=new Float32Array(r),Ma[r]=a),t!==0){i.toArray(a,0);for(let o=1,d=0;o!==t;++o)d+=n,e[o].toArray(a,d)}return a}function ft(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function ut(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function kn(e,t){let n=xa[t];n===void 0&&(n=new Int32Array(t),xa[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function nf(e,t){const n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function af(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ft(n,t))return;e.uniform2fv(this.addr,t),ut(n,t)}}function rf(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(ft(n,t))return;e.uniform3fv(this.addr,t),ut(n,t)}}function of(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ft(n,t))return;e.uniform4fv(this.addr,t),ut(n,t)}}function sf(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(ft(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),ut(n,t)}else{if(ft(n,i))return;Aa.set(i),e.uniformMatrix2fv(this.addr,!1,Aa),ut(n,i)}}function lf(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(ft(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),ut(n,t)}else{if(ft(n,i))return;Ra.set(i),e.uniformMatrix3fv(this.addr,!1,Ra),ut(n,i)}}function cf(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(ft(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),ut(n,t)}else{if(ft(n,i))return;Ta.set(i),e.uniformMatrix4fv(this.addr,!1,Ta),ut(n,i)}}function ff(e,t){const n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function uf(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ft(n,t))return;e.uniform2iv(this.addr,t),ut(n,t)}}function df(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ft(n,t))return;e.uniform3iv(this.addr,t),ut(n,t)}}function hf(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ft(n,t))return;e.uniform4iv(this.addr,t),ut(n,t)}}function pf(e,t){const n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function mf(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ft(n,t))return;e.uniform2uiv(this.addr,t),ut(n,t)}}function _f(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ft(n,t))return;e.uniform3uiv(this.addr,t),ut(n,t)}}function gf(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ft(n,t))return;e.uniform4uiv(this.addr,t),ut(n,t)}}function Wn(e){return e.version===0&&(e.compareFunction=Xa,e.needsUpdate=!0),e}function vf(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r);let a;this.type===e.SAMPLER_2D_SHADOW?a=Wn(xr):a=Mr,n.setTexture2D(t||a,r)}function Sf(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(t||Ar,r)}function Ef(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r);let a;this.type===e.SAMPLER_CUBE_SHADOW?a=Wn(Tr):a=br,n.setTextureCube(t||a,r)}function Mf(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(t||Rr,r)}function xf(e){switch(e){case 5126:return nf;case 35664:return af;case 35665:return rf;case 35666:return of;case 35674:return sf;case 35675:return lf;case 35676:return cf;case 5124:case 35670:return ff;case 35667:case 35671:return uf;case 35668:case 35672:return df;case 35669:case 35673:return hf;case 5125:return pf;case 36294:return mf;case 36295:return _f;case 36296:return gf;case 35678:case 36198:case 36298:case 36306:case 35682:return vf;case 35679:case 36299:case 36307:return Sf;case 35680:case 36300:case 36308:case 36293:return Ef;case 36289:case 36303:case 36311:case 36292:return Mf}}function Tf(e,t){e.uniform1fv(this.addr,t)}function Rf(e,t){const n=un(t,this.size,2);e.uniform2fv(this.addr,n)}function Af(e,t){const n=un(t,this.size,3);e.uniform3fv(this.addr,n)}function bf(e,t){const n=un(t,this.size,4);e.uniform4fv(this.addr,n)}function Pf(e,t){const n=un(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Cf(e,t){const n=un(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Df(e,t){const n=un(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function wf(e,t){e.uniform1iv(this.addr,t)}function Lf(e,t){e.uniform2iv(this.addr,t)}function Uf(e,t){e.uniform3iv(this.addr,t)}function Nf(e,t){e.uniform4iv(this.addr,t)}function yf(e,t){e.uniform1uiv(this.addr,t)}function If(e,t){e.uniform2uiv(this.addr,t)}function Of(e,t){e.uniform3uiv(this.addr,t)}function Ff(e,t){e.uniform4uiv(this.addr,t)}function Bf(e,t,n){const i=this.cache,r=t.length,a=kn(n,r);ft(i,a)||(e.uniform1iv(this.addr,a),ut(i,a));let o;this.type===e.SAMPLER_2D_SHADOW?o=Wn(xr):o=Mr;for(let d=0;d!==r;++d)n.setTexture2D(t[d]||o,a[d])}function Gf(e,t,n){const i=this.cache,r=t.length,a=kn(n,r);ft(i,a)||(e.uniform1iv(this.addr,a),ut(i,a));for(let o=0;o!==r;++o)n.setTexture3D(t[o]||Ar,a[o])}function Hf(e,t,n){const i=this.cache,r=t.length,a=kn(n,r);ft(i,a)||(e.uniform1iv(this.addr,a),ut(i,a));let o;this.type===e.SAMPLER_CUBE_SHADOW?o=Wn(Tr):o=br;for(let d=0;d!==r;++d)n.setTextureCube(t[d]||o,a[d])}function Vf(e,t,n){const i=this.cache,r=t.length,a=kn(n,r);ft(i,a)||(e.uniform1iv(this.addr,a),ut(i,a));for(let o=0;o!==r;++o)n.setTexture2DArray(t[o]||Rr,a[o])}function zf(e){switch(e){case 5126:return Tf;case 35664:return Rf;case 35665:return Af;case 35666:return bf;case 35674:return Pf;case 35675:return Cf;case 35676:return Df;case 5124:case 35670:return wf;case 35667:case 35671:return Lf;case 35668:case 35672:return Uf;case 35669:case 35673:return Nf;case 5125:return yf;case 36294:return If;case 36295:return Of;case 36296:return Ff;case 35678:case 36198:case 36298:case 36306:case 35682:return Bf;case 35679:case 36299:case 36307:return Gf;case 35680:case 36300:case 36308:case 36293:return Hf;case 36289:case 36303:case 36311:case 36292:return Vf}}class kf{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=xf(n.type)}}class Wf{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=zf(n.type)}}class Xf{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){const r=this.seq;for(let a=0,o=r.length;a!==o;++a){const d=r[a];d.setValue(t,n[d.id],i)}}}const ni=/(\w+)(\])?(\[|\.)?/g;function ba(e,t){e.seq.push(t),e.map[t.id]=t}function Yf(e,t,n){const i=e.name,r=i.length;for(ni.lastIndex=0;;){const a=ni.exec(i),o=ni.lastIndex;let d=a[1];const R=a[2]==="]",m=a[3];if(R&&(d=d|0),m===void 0||m==="["&&o+2===r){ba(n,m===void 0?new kf(d,e,t):new Wf(d,e,t));break}else{let C=n.map[d];C===void 0&&(C=new Xf(d),ba(n,C)),n=C}}}class On{constructor(t,n){this.seq=[],this.map={};const i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const d=t.getActiveUniform(n,o),R=t.getUniformLocation(n,d.name);Yf(d,R,this)}const r=[],a=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?r.push(o):a.push(o);r.length>0&&(this.seq=r.concat(a))}setValue(t,n,i,r){const a=this.map[n];a!==void 0&&a.setValue(t,i,r)}setOptional(t,n,i){const r=n[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,n,i,r){for(let a=0,o=n.length;a!==o;++a){const d=n[a],R=i[d.id];R.needsUpdate!==!1&&d.setValue(t,R.value,r)}}static seqWithValue(t,n){const i=[];for(let r=0,a=t.length;r!==a;++r){const o=t[r];o.id in n&&i.push(o)}return i}}function Pa(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}const Kf=37297;let qf=0;function Zf(e,t){const n=e.split(`
`),i=[],r=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let o=r;o<a;o++){const d=o+1;i.push(`${d===t?">":" "} ${d}: ${n[o]}`)}return i.join(`
`)}const Ca=new Ge;function jf(e){rt._getMatrix(Ca,rt.workingColorSpace,e);const t=`mat3( ${Ca.elements.map(n=>n.toFixed(4))} )`;switch(rt.getTransfer(e)){case cr:return[t,"LinearTransferOETF"];case Je:return[t,"sRGBTransferOETF"];default:return Ye("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Da(e,t,n){const i=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(i&&a==="")return"";const o=/ERROR: 0:(\d+)/.exec(a);if(o){const d=parseInt(o[1]);return n.toUpperCase()+`

`+a+`

`+Zf(e.getShaderSource(t),d)}else return a}function $f(e,t){const n=jf(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Qf={[_r]:"Linear",[mr]:"Reinhard",[pr]:"Cineon",[hr]:"ACESFilmic",[dr]:"AgX",[ur]:"Neutral",[fr]:"Custom"};function Jf(e,t){const n=Qf[t];return n===void 0?(Ye("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Dn=new be;function eu(){rt.getLuminanceCoefficients(Dn);const e=Dn.x.toFixed(4),t=Dn.y.toFixed(4),n=Dn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function tu(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vn).join(`
`)}function nu(e){const t=[];for(const n in e){const i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function iu(e,t){const n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const a=e.getActiveAttrib(t,r),o=a.name;let d=1;a.type===e.FLOAT_MAT2&&(d=2),a.type===e.FLOAT_MAT3&&(d=3),a.type===e.FLOAT_MAT4&&(d=4),n[o]={type:a.type,location:e.getAttribLocation(t,o),locationSize:d}}return n}function vn(e){return e!==""}function wa(e,t){const n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function La(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const au=/^[ \t]*#include +<([\w\d./]+)>/gm;function pi(e){return e.replace(au,ru)}function ru(e,t){const n=Ie[t];if(n===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return pi(n)}const ou=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ua(e){return e.replace(ou,su)}function su(e,t,n,i){let r="";for(let a=parseInt(t);a<parseInt(n);a++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function Na(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const lu={[yn]:"SHADOWMAP_TYPE_PCF",[gn]:"SHADOWMAP_TYPE_VSM"};function cu(e){return lu[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const fu={[En]:"ENVMAP_MODE_REFRACTION"};function uu(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":fu[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const du={[Vo]:"ENVMAP_BLENDING_MULTIPLY",[Ho]:"ENVMAP_BLENDING_MIX",[Go]:"ENVMAP_BLENDING_ADD"};function hu(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":du[e.combine]||"ENVMAP_BLENDING_NONE"}function pu(e,t,n,i){const r=e.getContext(),a=n.defines;let o=n.vertexShader,d=n.fragmentShader;const R=cu(n),m=n.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",b=uu(n),C=hu(n),S=tu(n),g=nu(a),x=r.createProgram();let U,u,f=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(U=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(vn).join(`
`),U.length>0&&(U+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(vn).join(`
`),u.length>0&&(u+=`
`)):(U=[Na(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+b:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+n.diffuseRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+R:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vn).join(`
`),u=[Na(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+m:"",n.envMap?"#define "+b:"",n.envMap?"#define "+C:"",n.envMapPMREM?"#define ENVMAP_MAX_LOD "+n.envMapMaxLod+".0":"",n.envMapPMREM?"#define ENVMAP_SIZE "+n.envMapSize+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+R:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Yt?"#define TONE_MAPPING":"",n.toneMapping!==Yt?Ie.tonemapping_pars_fragment:"",n.toneMapping!==Yt?Jf("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ie.colorspace_pars_fragment,$f("linearToOutputTexel",n.outputColorSpace),eu(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(vn).join(`
`)),o=pi(o),o=wa(o,n),o=La(o,n),d=pi(d),d=wa(d,n),d=La(d,n),o=Ua(o),d=Ua(d),n.isRawShaderMaterial!==!0&&(f=`#version 300 es
`,U=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+U,u=["#define varying in",n.glslVersion===pa?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===pa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const _=f+U+o,L=f+u+d,E=Pa(r,r.VERTEX_SHADER,_),D=Pa(r,r.FRAGMENT_SHADER,L);r.attachShader(x,E),r.attachShader(x,D),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function T(w){if(e.debug.checkShaderErrors){const I=r.getProgramInfoLog(x)||"",B=r.getShaderInfoLog(E)||"",q=r.getShaderInfoLog(D)||"",P=I.trim(),j=B.trim(),Z=q.trim();let z=!0,se=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(z=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(r,x,E,D);else{const W=Da(r,E,"vertex"),$=Da(r,D,"fragment");tt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+P+`
`+W+`
`+$)}else P!==""?Ye("WebGLProgram: Program Info Log:",P):(j===""||Z==="")&&(se=!1);se&&(w.diagnostics={runnable:z,programLog:P,vertexShader:{log:j,prefix:U},fragmentShader:{log:Z,prefix:u}})}r.deleteShader(E),r.deleteShader(D),l=new On(r,x),p=iu(r,x)}let l;this.getUniforms=function(){return l===void 0&&T(this),l};let p;this.getAttributes=function(){return p===void 0&&T(this),p};let k=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return k===!1&&(k=r.getProgramParameter(x,Kf)),k},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=qf++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=D,this}let mu=0;class _u{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,n,i){const r=this._getShaderCacheForMaterial(t);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(t){const n=this.materialCache.get(t);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const n=this.materialCache;let i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){const n=this.shaderCache;let i=n.get(t);return i===void 0&&(i=new gu(t),n.set(t,i)),i}}class gu{constructor(t){this.id=mu++,this.code=t,this.usedTimes=0}}function vu(e){return e===cn||e===di||e===hi}function Su(e,t,n,i,r,a){const o=new Fo,d=new _u,R=new Set,m=[],b=new Map,C=i.logarithmicDepthBuffer,S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(l){return R.add(l),l===0?"uv":`uv${l}`}function x(l,p,k,w,I,B){const q=w.fog,P=I.geometry,j=l.isMeshStandardMaterial||l.isMeshLambertMaterial||l.isMeshPhongMaterial?w.environment:null,Z=l.isMeshStandardMaterial||l.isMeshLambertMaterial&&!l.envMap||l.isMeshPhongMaterial&&!l.envMap,z=t.get(l.envMap||j,Z),se=S[l.type];let W=i.precision;l.precision!==null&&(W=i.getMaxPrecision(l.precision),W!==l.precision&&Ye("WebGLProgram.getParameters:",l.precision,"not supported, using",W,"instead."));const $=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,ee=$!==void 0?$.length:0;let Me=0;P.morphAttributes.position!==void 0&&(Me=1),P.morphAttributes.normal!==void 0&&(Me=2),P.morphAttributes.color!==void 0&&(Me=3);let Le,X,pe,_e;if(se){const de=Ft[se];Le=de.vertexShader,X=de.fragmentShader}else{Le=l.vertexShader,X=l.fragmentShader;const de=d.getVertexShaderStage(l),Xe=d.getFragmentShaderStage(l);d.update(l,de,Xe),pe=de.id,_e=Xe.id}const xe=e.getRenderTarget(),ue=e.state.buffers.depth.getReversed(),De=I.isInstancedMesh===!0,nt=I.isBatchedMesh===!0,Ce=!!l.map,We=!!l.matcap,Ve=!!z,Ne=Ve&&z.isPMREMTexture===!0,st=!!l.aoMap,it=!!l.lightMap,dt=!!l.bumpMap&&l.wireframe===!1,je=!!l.normalMap,Pt=!!l.displacementMap,ot=!!l.emissiveMap,gt=!!l.metalnessMap,vt=!!l.roughnessMap,St=l.anisotropy>0,A=l.clearcoat>0,Et=l.diffuseRoughness>0,qe=l.dispersion>0,Ze=l.retroreflectivity>0,re=l.iridescence>0,et=l.sheen>0,Te=l.transmission>0,Pe=St&&!!l.anisotropyMap,h=A&&!!l.clearcoatMap,s=A&&!!l.clearcoatNormalMap,N=A&&!!l.clearcoatRoughnessMap,Q=Et&&!!l.diffuseRoughnessMap,K=re&&!!l.iridescenceMap,te=re&&!!l.iridescenceThicknessMap,ae=et&&!!l.sheenColorMap,G=et&&!!l.sheenRoughnessMap,V=!!l.specularMap,ne=!!l.specularColorMap,v=!!l.specularIntensityMap,Y=Te&&!!l.transmissionMap,H=Te&&!!l.thicknessMap,le=!!l.gradientMap,ie=!!l.alphaMap,oe=l.alphaTest>0,Re=!!l.alphaHash,ye=!!l.extensions;let J=Yt;l.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(J=e.toneMapping);const Ae=Ne?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,Ue={shaderID:se,shaderType:l.type,shaderName:l.name,vertexShader:Le,fragmentShader:X,defines:l.defines,customVertexShaderID:pe,customFragmentShaderID:_e,isRawShaderMaterial:l.isRawShaderMaterial===!0,glslVersion:l.glslVersion,precision:W,batching:nt,batchingColor:nt&&I._colorsTexture!==null,instancing:De,instancingColor:De&&I.instanceColor!==null,instancingMorph:De&&I.morphTexture!==null,outputColorSpace:xe===null?e.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!l.alphaToCoverage,map:Ce,matcap:We,envMap:Ve,envMapMode:Ve&&z.mapping,envMapPMREM:Ne,envMapMaxLod:Ne?Ae.length-1:null,envMapSize:Ne?Ae[0].width:null,aoMap:st,lightMap:it,bumpMap:dt,normalMap:je,displacementMap:Pt,emissiveMap:ot,normalMapObjectSpace:je&&l.normalMapType===Po,normalMapTangentSpace:je&&l.normalMapType===Oi,packedNormalMap:je&&l.normalMapType===Oi&&vu(l.normalMap.format),metalnessMap:gt,roughnessMap:vt,anisotropy:St,anisotropyMap:Pe,clearcoat:A,clearcoatMap:h,clearcoatNormalMap:s,clearcoatRoughnessMap:N,diffuseRoughness:Et,diffuseRoughnessMap:Q,dispersion:qe,retroreflection:Ze,iridescence:re,iridescenceMap:K,iridescenceThicknessMap:te,sheen:et,sheenColorMap:ae,sheenRoughnessMap:G,specularMap:V,specularColorMap:ne,specularIntensityMap:v,transmission:Te,transmissionMap:Y,thicknessMap:H,gradientMap:le,opaque:l.transparent===!1&&l.blending===In&&l.alphaToCoverage===!1,alphaMap:ie,alphaTest:oe,alphaHash:Re,combine:l.combine,mapUv:Ce&&g(l.map.channel),aoMapUv:st&&g(l.aoMap.channel),lightMapUv:it&&g(l.lightMap.channel),bumpMapUv:dt&&g(l.bumpMap.channel),normalMapUv:je&&g(l.normalMap.channel),displacementMapUv:Pt&&g(l.displacementMap.channel),emissiveMapUv:ot&&g(l.emissiveMap.channel),metalnessMapUv:gt&&g(l.metalnessMap.channel),roughnessMapUv:vt&&g(l.roughnessMap.channel),anisotropyMapUv:Pe&&g(l.anisotropyMap.channel),clearcoatMapUv:h&&g(l.clearcoatMap.channel),clearcoatNormalMapUv:s&&g(l.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:N&&g(l.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:Q&&g(l.diffuseRoughnessMap.channel),iridescenceMapUv:K&&g(l.iridescenceMap.channel),iridescenceThicknessMapUv:te&&g(l.iridescenceThicknessMap.channel),sheenColorMapUv:ae&&g(l.sheenColorMap.channel),sheenRoughnessMapUv:G&&g(l.sheenRoughnessMap.channel),specularMapUv:V&&g(l.specularMap.channel),specularColorMapUv:ne&&g(l.specularColorMap.channel),specularIntensityMapUv:v&&g(l.specularIntensityMap.channel),transmissionMapUv:Y&&g(l.transmissionMap.channel),thicknessMapUv:H&&g(l.thicknessMap.channel),alphaMapUv:ie&&g(l.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(je||St),vertexNormals:!!P.attributes.normal,vertexColors:l.vertexColors,vertexAlphas:l.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!P.attributes.uv&&(Ce||ie),fog:!!q,useFog:l.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:l.wireframe===!1&&(l.flatShading===!0||P.attributes.normal===void 0&&je===!1&&(l.isMeshLambertMaterial||l.isMeshPhongMaterial||l.isMeshStandardMaterial||l.isMeshPhysicalMaterial)),sizeAttenuation:l.sizeAttenuation===!0,logarithmicDepthBuffer:C,reversedDepthBuffer:ue,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:Me,numSunLights:p.sun.length,numDirLights:p.directional.length,numPointLights:p.point.length,numSpotLights:p.spot.length,numSpotLightMaps:p.spotLightMap.length,numRectAreaLights:p.rectArea.length,numHemiLights:p.hemi.length,numSunLightShadows:p.sunShadowMap.length,numDirLightShadows:p.directionalShadowMap.length,numPointLightShadows:p.pointShadowMap.length,numSpotLightShadows:p.spotShadowMap.length,numSpotLightShadowsWithMaps:p.numSpotLightShadowsWithMaps,numLightProbes:p.numLightProbes,numLightProbeGrids:B.filter(de=>de.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:l.dithering,shadowMapEnabled:e.shadowMap.enabled&&k.length>0,shadowMapType:e.shadowMap.type,toneMapping:J,decodeVideoTexture:Ce&&l.map.isVideoTexture===!0&&rt.getTransfer(l.map.colorSpace)===Je,decodeVideoTextureEmissive:ot&&l.emissiveMap.isVideoTexture===!0&&rt.getTransfer(l.emissiveMap.colorSpace)===Je,premultipliedAlpha:l.premultipliedAlpha,doubleSided:l.side===Vt,flipSided:l.side===Lt,useDepthPacking:l.depthPacking>=0,depthPacking:l.depthPacking||0,index0AttributeName:l.index0AttributeName,extensionClipCullDistance:ye&&l.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ye&&l.extensions.multiDraw===!0||nt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:l.customProgramCacheKey()};return Ue.vertexUv1s=R.has(1),Ue.vertexUv2s=R.has(2),Ue.vertexUv3s=R.has(3),R.clear(),Ue}function U(l){const p=[];if(l.shaderID?p.push(l.shaderID):(p.push(l.customVertexShaderID),p.push(l.customFragmentShaderID)),l.defines!==void 0)for(const k in l.defines)p.push(k),p.push(l.defines[k]);return l.isRawShaderMaterial===!1&&(u(p,l),f(p,l),p.push(e.outputColorSpace)),p.push(l.customProgramCacheKey),p.join()}function u(l,p){l.push(p.precision),l.push(p.outputColorSpace),l.push(p.envMapMode),l.push(p.envMapPMREM),l.push(p.envMapMaxLod),l.push(p.envMapSize),l.push(p.mapUv),l.push(p.alphaMapUv),l.push(p.lightMapUv),l.push(p.aoMapUv),l.push(p.bumpMapUv),l.push(p.normalMapUv),l.push(p.displacementMapUv),l.push(p.emissiveMapUv),l.push(p.metalnessMapUv),l.push(p.roughnessMapUv),l.push(p.anisotropyMapUv),l.push(p.clearcoatMapUv),l.push(p.clearcoatNormalMapUv),l.push(p.clearcoatRoughnessMapUv),l.push(p.diffuseRoughnessMapUv),l.push(p.iridescenceMapUv),l.push(p.iridescenceThicknessMapUv),l.push(p.sheenColorMapUv),l.push(p.sheenRoughnessMapUv),l.push(p.specularMapUv),l.push(p.specularColorMapUv),l.push(p.specularIntensityMapUv),l.push(p.transmissionMapUv),l.push(p.thicknessMapUv),l.push(p.combine),l.push(p.fogExp2),l.push(p.sizeAttenuation),l.push(p.morphTargetsCount),l.push(p.numSunLights),l.push(p.numDirLights),l.push(p.numPointLights),l.push(p.numSpotLights),l.push(p.numSpotLightMaps),l.push(p.numHemiLights),l.push(p.numRectAreaLights),l.push(p.numSunLightShadows),l.push(p.numDirLightShadows),l.push(p.numPointLightShadows),l.push(p.numSpotLightShadows),l.push(p.numSpotLightShadowsWithMaps),l.push(p.numLightProbes),l.push(p.numLightProbeGrids),l.push(p.shadowMapType),l.push(p.toneMapping),l.push(p.numClippingPlanes),l.push(p.numClipIntersection),l.push(p.depthPacking)}function f(l,p){o.disableAll(),p.instancing&&o.enable(0),p.instancingColor&&o.enable(1),p.instancingMorph&&o.enable(2),p.matcap&&o.enable(3),p.envMap&&o.enable(4),p.normalMapObjectSpace&&o.enable(5),p.normalMapTangentSpace&&o.enable(6),p.clearcoat&&o.enable(7),p.iridescence&&o.enable(8),p.alphaTest&&o.enable(9),p.vertexColors&&o.enable(10),p.vertexAlphas&&o.enable(11),p.vertexUv1s&&o.enable(12),p.vertexUv2s&&o.enable(13),p.vertexUv3s&&o.enable(14),p.vertexTangents&&o.enable(15),p.anisotropy&&o.enable(16),p.alphaHash&&o.enable(17),p.batching&&o.enable(18),p.dispersion&&o.enable(19),p.retroreflection&&o.enable(24),p.diffuseRoughness&&o.enable(25),p.batchingColor&&o.enable(20),p.gradientMap&&o.enable(21),p.packedNormalMap&&o.enable(22),p.vertexNormals&&o.enable(23),l.push(o.mask),o.disableAll(),p.fog&&o.enable(0),p.useFog&&o.enable(1),p.flatShading&&o.enable(2),p.logarithmicDepthBuffer&&o.enable(3),p.reversedDepthBuffer&&o.enable(4),p.skinning&&o.enable(5),p.morphTargets&&o.enable(6),p.morphNormals&&o.enable(7),p.morphColors&&o.enable(8),p.premultipliedAlpha&&o.enable(9),p.shadowMapEnabled&&o.enable(10),p.doubleSided&&o.enable(11),p.flipSided&&o.enable(12),p.useDepthPacking&&o.enable(13),p.dithering&&o.enable(14),p.transmission&&o.enable(15),p.sheen&&o.enable(16),p.opaque&&o.enable(17),p.pointsUvs&&o.enable(18),p.decodeVideoTexture&&o.enable(19),p.decodeVideoTextureEmissive&&o.enable(20),p.alphaToCoverage&&o.enable(21),p.numLightProbeGrids>0&&o.enable(22),p.hasPositionAttribute&&o.enable(23),l.push(o.mask)}function _(l){const p=S[l.type];let k;if(p){const w=Ft[p];k=kt.clone(w.uniforms)}else k=l.uniforms;return k}function L(l,p){let k=b.get(p);return k!==void 0?++k.usedTimes:(k=new pu(e,p,l,r),m.push(k),b.set(p,k)),k}function E(l){if(--l.usedTimes===0){const p=m.indexOf(l);m[p]=m[m.length-1],m.pop(),b.delete(l.cacheKey),l.destroy()}}function D(l){d.remove(l)}function T(){d.dispose()}return{getParameters:x,getProgramCacheKey:U,getUniforms:_,acquireProgram:L,releaseProgram:E,releaseShaderCache:D,programs:m,dispose:T}}function Eu(){let e=new WeakMap;function t(o){return e.has(o)}function n(o){let d=e.get(o);return d===void 0&&(d={},e.set(o,d)),d}function i(o){e.delete(o)}function r(o,d,R){e.get(o)[d]=R}function a(){e=new WeakMap}return{has:t,get:n,remove:i,update:r,dispose:a}}function Mu(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function ya(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Ia(){const e=[];let t=0;const n=[],i=[],r=[];function a(){t=0,n.length=0,i.length=0,r.length=0}function o(S){let g=0;return S.isInstancedMesh&&(g+=2),S.isSkinnedMesh&&(g+=1),g}function d(S,g,x,U,u,f){let _=e[t];return _===void 0?(_={id:S.id,object:S,geometry:g,material:x,materialVariant:o(S),groupOrder:U,renderOrder:S.renderOrder,z:u,group:f},e[t]=_):(_.id=S.id,_.object=S,_.geometry=g,_.material=x,_.materialVariant=o(S),_.groupOrder=U,_.renderOrder=S.renderOrder,_.z=u,_.group=f),t++,_}function R(S,g,x,U,u,f,_){_.reversedDepth===!0&&(u=-u);const L=d(S,g,x,U,u,f);x.transmission>0?i.push(L):x.transparent===!0?r.push(L):n.push(L)}function m(S,g,x,U,u,f){const _=d(S,g,x,U,u,f);x.transmission>0?i.unshift(_):x.transparent===!0?r.unshift(_):n.unshift(_)}function b(S,g){n.length>1&&n.sort(S||Mu),i.length>1&&i.sort(g||ya),r.length>1&&r.sort(g||ya)}function C(){for(let S=t,g=e.length;S<g;S++){const x=e[S];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:n,transmissive:i,transparent:r,init:a,push:R,unshift:m,finish:C,sort:b}}function xu(){let e=new WeakMap;function t(i,r){const a=e.get(i);let o;return a===void 0?(o=new Ia,e.set(i,[o])):r>=a.length?(o=new Ia,a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function Tu(){const e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new be,color:new Ke};break;case"SpotLight":n={position:new be,direction:new be,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new be,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":n={direction:new be,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":n={color:new Ke,position:new be,halfWidth:new be,halfHeight:new be};break}return e[t.id]=n,n}}}function Ru(){const e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}let Au=0;function bu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function Pu(e){const t=new Tu,n=Ru(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)i.probe.push(new be);const r=new be,a=new Bt,o=new Bt;function d(m){let b=0,C=0,S=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let g=0,x=0,U=0,u=0,f=0,_=0,L=0,E=0,D=0,T=0,l=0,p=0,k=0,w=0;m.sort(bu);for(let B=0,q=m.length;B<q;B++){const P=m[B],j=P.color,Z=P.intensity,z=P.distance;let se=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===cn?se=P.shadow.map.texture:se=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)b+=j.r*Z,C+=j.g*Z,S+=j.b*Z;else if(P.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(P.sh.coefficients[W],Z);w++}else if(P.isSunLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,ee=n.get(P);ee.shadowIntensity=$.intensity,ee.shadowBias=$.bias,ee.shadowNormalBias=$.normalBias,ee.shadowRadius=$.radius,ee.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),i.sunShadow[x]=ee,i.sunShadowMap[x]=se;const Me=$.getViewportCount();for(let Le=0;Le<Me;Le++)i.sunShadowMatrix[U+Le]=$.getMatrix(Le),i.sunShadowCascade[U+Le]=$._cascadeData[Le];U+=Me,x++}i.sun[g]=W,g++}else if(P.isDirectionalLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,ee=n.get(P);ee.shadowIntensity=$.intensity,ee.shadowBias=$.bias,ee.shadowNormalBias=$.normalBias,ee.shadowRadius=$.radius,ee.shadowMapSize=$.mapSize,i.directionalShadow[u]=ee,i.directionalShadowMap[u]=se,i.directionalShadowMatrix[u]=P.shadow.matrix,D++}i.directional[u]=W,u++}else if(P.isSpotLight){const W=t.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(j).multiplyScalar(Z),W.distance=z,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,i.spot[_]=W;const $=P.shadow;if(P.map&&(i.spotLightMap[p]=P.map,p++,$.updateMatrices(P),P.castShadow&&k++),i.spotLightMatrix[_]=$.matrix,P.castShadow){const ee=n.get(P);ee.shadowIntensity=$.intensity,ee.shadowBias=$.bias,ee.shadowNormalBias=$.normalBias,ee.shadowRadius=$.radius,ee.shadowMapSize=$.mapSize,i.spotShadow[_]=ee,i.spotShadowMap[_]=se,l++}_++}else if(P.isRectAreaLight){const W=t.get(P);W.color.copy(j).multiplyScalar(Z),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),i.rectArea[L]=W,L++}else if(P.isPointLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const $=P.shadow,ee=n.get(P);ee.shadowIntensity=$.intensity,ee.shadowBias=$.bias,ee.shadowNormalBias=$.normalBias,ee.shadowRadius=$.radius,ee.shadowMapSize=$.mapSize,ee.shadowCameraNear=$.camera.near,ee.shadowCameraFar=$.camera.far,i.pointShadow[f]=ee,i.pointShadowMap[f]=se,i.pointShadowMatrix[f]=P.shadow.matrix,T++}i.point[f]=W,f++}else if(P.isHemisphereLight){const W=t.get(P);W.skyColor.copy(P.color).multiplyScalar(Z),W.groundColor.copy(P.groundColor).multiplyScalar(Z),i.hemi[E]=W,E++}}L>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=b,i.ambient[1]=C,i.ambient[2]=S;const I=i.hash;(I.sunLength!==g||I.directionalLength!==u||I.pointLength!==f||I.spotLength!==_||I.rectAreaLength!==L||I.hemiLength!==E||I.numSunShadows!==x||I.numDirectionalShadows!==D||I.numPointShadows!==T||I.numSpotShadows!==l||I.numSpotMaps!==p||I.numLightProbes!==w)&&(i.sun.length=g,i.directional.length=u,i.spot.length=_,i.rectArea.length=L,i.point.length=f,i.hemi.length=E,i.sunShadow.length=x,i.sunShadowMap.length=x,i.sunShadowMatrix.length=U,i.sunShadowCascade.length=U,i.directionalShadow.length=D,i.directionalShadowMap.length=D,i.directionalShadowMatrix.length=D,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=l,i.spotShadowMap.length=l,i.spotLightMatrix.length=l+p-k,i.spotLightMap.length=p,i.numSpotLightShadowsWithMaps=k,i.numLightProbes=w,I.sunLength=g,I.directionalLength=u,I.pointLength=f,I.spotLength=_,I.rectAreaLength=L,I.hemiLength=E,I.numSunShadows=x,I.numDirectionalShadows=D,I.numPointShadows=T,I.numSpotShadows=l,I.numSpotMaps=p,I.numLightProbes=w,i.version=Au++)}function R(m,b){let C=0,S=0,g=0,x=0,U=0,u=0;const f=b.matrixWorldInverse;for(let _=0,L=m.length;_<L;_++){const E=m[_];if(E.isSunLight){const D=i.sun[C];D.direction.setFromMatrixPosition(E.matrixWorld),D.direction.transformDirection(f),C++}else if(E.isDirectionalLight){const D=i.directional[S];D.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),D.direction.sub(r),D.direction.transformDirection(f),S++}else if(E.isSpotLight){const D=i.spot[x];D.position.setFromMatrixPosition(E.matrixWorld),D.position.applyMatrix4(f),D.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),D.direction.sub(r),D.direction.transformDirection(f),x++}else if(E.isRectAreaLight){const D=i.rectArea[U];D.position.setFromMatrixPosition(E.matrixWorld),D.position.applyMatrix4(f),o.identity(),a.copy(E.matrixWorld),a.premultiply(f),o.extractRotation(a),D.halfWidth.set(E.width*.5,0,0),D.halfHeight.set(0,E.height*.5,0),D.halfWidth.applyMatrix4(o),D.halfHeight.applyMatrix4(o),U++}else if(E.isPointLight){const D=i.point[g];D.position.setFromMatrixPosition(E.matrixWorld),D.position.applyMatrix4(f),g++}else if(E.isHemisphereLight){const D=i.hemi[u];D.direction.setFromMatrixPosition(E.matrixWorld),D.direction.transformDirection(f),u++}}}return{setup:d,setupView:R,state:i}}function Oa(e){const t=new Pu(e),n=[],i=[],r=[];function a(C){b.camera=C,n.length=0,i.length=0,r.length=0}function o(C){C.isLightProbeGrid?r.push(C):n.push(C)}function d(C){i.push(C)}function R(){t.setup(n),r.sort((C,S)=>C.priority-S.priority||C.id-S.id)}function m(C){t.setupView(n,C)}const b={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:b,setupLights:R,setupLightsView:m,pushLight:o,pushShadow:d}}function Cu(e){let t=new WeakMap;function n(r,a=0){const o=t.get(r);let d;return o===void 0?(d=new Oa(e),t.set(r,[d])):a>=o.length?(d=new Oa(e),o.push(d)):d=o[a],d}function i(){t=new WeakMap}return{get:n,dispose:i}}const Du=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wu=`uniform sampler2D shadow_pass;
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
}`,Lu=[new be(1,0,0),new be(-1,0,0),new be(0,1,0),new be(0,-1,0),new be(0,0,1),new be(0,0,-1)],Uu=[new be(0,-1,0),new be(0,-1,0),new be(0,0,1),new be(0,0,-1),new be(0,-1,0),new be(0,-1,0)],Fa=new Bt,pn=new be,ii=new be;function Nu(e,t,n){let i=new za;const r=new Oe,a=new Oe,o=new wt,d=new co,R=new fo,m={},b=n.maxTextureSize,C={[Sn]:Lt,[Lt]:Sn,[Vt]:Vt},S=new _t({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Du,fragmentShader:wu}),g=S.clone();g.defines.HORIZONTAL_PASS=1;const x=new zn;x.setAttribute("position",new Ya(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const U=new $t(x,S),u=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yn;let f=this.type;this.render=function(T,l,p){if(u.enabled===!1||u.autoUpdate===!1&&u.needsUpdate===!1||T.length===0)return;this.type===uo&&(Ye("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=yn);const k=e.getRenderTarget(),w=e.getActiveCubeFace(),I=e.getActiveMipmapLevel(),B=e.state;B.setBlending(At),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const q=f!==this.type;q&&l.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(j=>j.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,j=T.length;P<j;P++){const Z=T[P],z=Z.shadow;if(z===void 0){Ye("WebGLShadowMap:",Z,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const se=z.getFrameExtents();r.multiply(se),a.copy(z.mapSize),(r.x>b||r.y>b)&&(r.x>b&&(a.x=Math.floor(b/se.x),r.x=a.x*se.x,z.mapSize.x=a.x),r.y>b&&(a.y=Math.floor(b/se.y),r.y=a.y*se.y,z.mapSize.y=a.y));const W=e.state.buffers.depth.getReversed();if(z.camera._reversedDepth=W,z.map===null||q===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===gn){if(Z.isPointLight){Ye("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Tt(r.x,r.y,{format:cn,type:bt,minFilter:It,magFilter:It,generateMipmaps:!1}),z.map.texture.name=Z.name+".shadowMap",z.map.depthTexture=new fn(r.x,r.y,Zt),z.map.depthTexture.name=Z.name+".shadowMapDepth",z.map.depthTexture.format=xn,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Wt,z.map.depthTexture.magFilter=Wt}else Z.isPointLight?(z.map=new _i(r.x),z.map.depthTexture=new Ka(r.x,an)):(z.map=new Tt(r.x,r.y),z.map.depthTexture=new fn(r.x,r.y,an)),z.map.depthTexture.name=Z.name+".shadowMap",z.map.depthTexture.format=xn,this.type===yn?(z.map.depthTexture.compareFunction=W?ka:Wa,z.map.depthTexture.minFilter=It,z.map.depthTexture.magFilter=It):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Wt,z.map.depthTexture.magFilter=Wt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==r.x||z.map.height!==r.y)&&z.map.setSize(r.x,r.y);const $=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();Z.isPointLight!==!0&&z.updateMatrices(Z,p);const ee=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:p.layers;for(let Me=0;Me<$;Me++){const Le=z.getCamera(Me);if(Z.isPointLight){const X=z.camera,pe=z.matrix,_e=Z.distance||X.far;_e!==X.far&&(X.far=_e,X.updateProjectionMatrix()),pn.setFromMatrixPosition(Z.matrixWorld),X.position.copy(pn),ii.copy(X.position),ii.add(Lu[Me]),X.up.copy(Uu[Me]),X.lookAt(ii),X.updateMatrixWorld(),pe.makeTranslation(-pn.x,-pn.y,-pn.z),Fa.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Fa,X.coordinateSystem,X.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)e.setRenderTarget(z.map,Me),e.clear();else{Me===0&&(e.setRenderTarget(z.map),e.clear());const X=z.getViewport(Me);o.set(a.x*X.x,a.y*X.y,a.x*X.z,a.y*X.w),B.viewport(o)}i=z.getFrustum(Me),E(l,p,Le,Z,ee,this.type)}z.isPointLightShadow!==!0&&this.type===gn&&_(z,p),z.needsUpdate=!1}f=this.type,u.needsUpdate=!1,e.setRenderTarget(k,w,I)};function _(T,l){const p=t.update(U);S.defines.VSM_SAMPLES!==T.blurSamples&&(S.defines.VSM_SAMPLES=T.blurSamples,g.defines.VSM_SAMPLES=T.blurSamples,S.needsUpdate=!0,g.needsUpdate=!0),T.mapPass===null?T.mapPass=new Tt(r.x,r.y,{format:cn,type:bt}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),S.uniforms.shadow_pass.value=T.map.depthTexture,S.uniforms.resolution.value.set(T.map.width,T.map.height),S.uniforms.radius.value=T.radius,e.setRenderTarget(T.mapPass),e.clear(),e.renderBufferDirect(l,null,p,S,U,null),g.uniforms.shadow_pass.value=T.mapPass.texture,g.uniforms.resolution.value.set(T.map.width,T.map.height),g.uniforms.radius.value=T.radius,e.setRenderTarget(T.map),e.clear(),e.renderBufferDirect(l,null,p,g,U,null)}function L(T,l,p,k){let w=null;const I=p.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)w=I;else if(w=p.isPointLight===!0?R:d,e.localClippingEnabled&&l.clipShadows===!0&&Array.isArray(l.clippingPlanes)&&l.clippingPlanes.length!==0||l.displacementMap&&l.displacementScale!==0||l.alphaMap&&l.alphaTest>0||l.map&&l.alphaTest>0||l.alphaToCoverage===!0){const B=w.uuid,q=l.uuid;let P=m[B];P===void 0&&(P={},m[B]=P);let j=P[q];j===void 0&&(j=w.clone(),P[q]=j,l.addEventListener("dispose",D)),w=j}if(w.visible=l.visible,w.wireframe=l.wireframe,k===gn?w.side=l.shadowSide!==null?l.shadowSide:l.side:w.side=l.shadowSide!==null?l.shadowSide:C[l.side],w.alphaMap=l.alphaMap,w.alphaTest=l.alphaToCoverage===!0?.5:l.alphaTest,w.map=l.map,w.clipShadows=l.clipShadows,w.clippingPlanes=l.clippingPlanes,w.clipIntersection=l.clipIntersection,w.displacementMap=l.displacementMap,w.displacementScale=l.displacementScale,w.displacementBias=l.displacementBias,w.wireframeLinewidth=l.wireframeLinewidth,w.linewidth=l.linewidth,p.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const B=e.properties.get(w);B.light=p}return w}function E(T,l,p,k,w,I){if(T.visible===!1)return;if(T.layers.test(w)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===gn)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(p.matrixWorldInverse,T.matrixWorld);const P=t.update(T),j=T.material;if(Array.isArray(j)){const Z=P.groups;for(let z=0,se=Z.length;z<se;z++){const W=Z[z],$=j[W.materialIndex];if($&&$.visible){const ee=L(T,$,k,I);T.onBeforeShadow(e,T,l,p,P,ee,W),e.renderBufferDirect(p,null,P,ee,T,W),T.onAfterShadow(e,T,l,p,P,ee,W)}}}else if(j.visible){const Z=L(T,j,k,I);T.onBeforeShadow(e,T,l,p,P,Z,null),e.renderBufferDirect(p,null,P,Z,T,null),T.onAfterShadow(e,T,l,p,P,Z,null)}}const q=T.children;for(let P=0,j=q.length;P<j;P++)E(q[P],l,p,k,w,I)}function D(T){T.target.removeEventListener("dispose",D);for(const p in m){const k=m[p],w=T.target.uuid;w in k&&(k[w].dispose(),delete k[w])}}}function yu(e,t){function n(){let v=!1;const Y=new wt;let H=null;const le=new wt(0,0,0,0);return{setMask:function(ie){H!==ie&&!v&&(e.colorMask(ie,ie,ie,ie),H=ie)},setLocked:function(ie){v=ie},setClear:function(ie,oe,Re,ye,J){J===!0&&(ie*=ye,oe*=ye,Re*=ye),Y.set(ie,oe,Re,ye),le.equals(Y)===!1&&(e.clearColor(ie,oe,Re,ye),le.copy(Y))},reset:function(){v=!1,H=null,le.set(-1,0,0,0)}}}function i(){let v=!1,Y=!1,H=null,le=null,ie=null;return{setReversed:function(oe){if(Y!==oe){const Re=t.get("EXT_clip_control");oe?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),Y=oe;const ye=ie;ie=null,this.setClear(ye)}},getReversed:function(){return Y},setTest:function(oe){oe?ue(e.DEPTH_TEST):De(e.DEPTH_TEST)},setMask:function(oe){H!==oe&&!v&&(e.depthMask(oe),H=oe)},setFunc:function(oe){if(Y&&(oe=Wo[oe]),le!==oe){switch(oe){case Ro:e.depthFunc(e.NEVER);break;case To:e.depthFunc(e.ALWAYS);break;case xo:e.depthFunc(e.LESS);break;case Ui:e.depthFunc(e.LEQUAL);break;case Mo:e.depthFunc(e.EQUAL);break;case Eo:e.depthFunc(e.GEQUAL);break;case So:e.depthFunc(e.GREATER);break;case vo:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}le=oe}},setLocked:function(oe){v=oe},setClear:function(oe){ie!==oe&&(ie=oe,Y&&(oe=1-oe),e.clearDepth(oe))},reset:function(){v=!1,H=null,le=null,ie=null,Y=!1}}}function r(){let v=!1,Y=null,H=null,le=null,ie=null,oe=null,Re=null,ye=null,J=null;return{setTest:function(Ae){v||(Ae?ue(e.STENCIL_TEST):De(e.STENCIL_TEST))},setMask:function(Ae){Y!==Ae&&!v&&(e.stencilMask(Ae),Y=Ae)},setFunc:function(Ae,Ue,de){(H!==Ae||le!==Ue||ie!==de)&&(e.stencilFunc(Ae,Ue,de),H=Ae,le=Ue,ie=de)},setOp:function(Ae,Ue,de){(oe!==Ae||Re!==Ue||ye!==de)&&(e.stencilOp(Ae,Ue,de),oe=Ae,Re=Ue,ye=de)},setLocked:function(Ae){v=Ae},setClear:function(Ae){J!==Ae&&(e.clearStencil(Ae),J=Ae)},reset:function(){v=!1,Y=null,H=null,le=null,ie=null,oe=null,Re=null,ye=null,J=null}}}const a=new n,o=new i,d=new r;let R={};const m=new WeakMap;let b={},C={},S={},g=new WeakMap,x=[],U=null,u=!1,f=null,_=null,L=null,E=null,D=null,T=null,l=null,p=new Ke(0,0,0),k=0,w=!1,I=null,B=null,q=null,P=null,j=null;const Z=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,se=0;const W=e.getParameter(e.VERSION);W.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=se>=1):W.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=se>=2);let $=null,ee={};const Me=e.getParameter(e.SCISSOR_BOX),Le=e.getParameter(e.VIEWPORT),X=new wt().fromArray(Me),pe=new wt().fromArray(Le);function _e(v,Y,H,le){const ie=new Uint8Array(4),oe=e.createTexture();e.bindTexture(v,oe),e.texParameteri(v,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(v,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Re=0;Re<H;Re++)v===e.TEXTURE_3D||v===e.TEXTURE_2D_ARRAY?e.texImage3D(Y,0,e.RGBA,1,1,le,0,e.RGBA,e.UNSIGNED_BYTE,ie):e.texImage2D(Y+Re,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ie);return oe}const xe={};xe[e.TEXTURE_2D]=_e(e.TEXTURE_2D,e.TEXTURE_2D,1),xe[e.TEXTURE_CUBE_MAP]=_e(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[e.TEXTURE_2D_ARRAY]=_e(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),xe[e.TEXTURE_3D]=_e(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),d.setClear(0),ue(e.DEPTH_TEST),o.setFunc(Ui),dt(!1),je(Ni),ue(e.CULL_FACE),st(At);function ue(v){b[v]!==!0&&(e.enable(v),b[v]=!0)}function De(v){b[v]!==!1&&(e.disable(v),b[v]=!1)}function nt(v,Y){return S[v]!==Y?(e.bindFramebuffer(v,Y),S[v]=Y,v===e.DRAW_FRAMEBUFFER&&(S[e.FRAMEBUFFER]=Y),v===e.FRAMEBUFFER&&(S[e.DRAW_FRAMEBUFFER]=Y),!0):!1}function Ce(v,Y){let H=x,le=!1;if(v){H=g.get(Y),H===void 0&&(H=[],g.set(Y,H));const ie=v.textures;if(H.length!==ie.length||H[0]!==e.COLOR_ATTACHMENT0){for(let oe=0,Re=ie.length;oe<Re;oe++)H[oe]=e.COLOR_ATTACHMENT0+oe;H.length=ie.length,le=!0}}else H[0]!==e.BACK&&(H[0]=e.BACK,le=!0);le&&e.drawBuffers(H)}function We(v){return U!==v?(e.useProgram(v),U=v,!0):!1}const Ve={[zt]:e.FUNC_ADD,[kr]:e.FUNC_SUBTRACT,[zr]:e.FUNC_REVERSE_SUBTRACT};Ve[Xo]=e.MIN,Ve[Yo]=e.MAX;const Ne={[_n]:e.ZERO,[to]:e.ONE,[eo]:e.SRC_COLOR,[Jr]:e.SRC_ALPHA,[Qr]:e.SRC_ALPHA_SATURATE,[li]:e.DST_COLOR,[si]:e.DST_ALPHA,[$r]:e.ONE_MINUS_SRC_COLOR,[jr]:e.ONE_MINUS_SRC_ALPHA,[Zr]:e.ONE_MINUS_DST_COLOR,[qr]:e.ONE_MINUS_DST_ALPHA,[Kr]:e.CONSTANT_COLOR,[Yr]:e.ONE_MINUS_CONSTANT_COLOR,[Xr]:e.CONSTANT_ALPHA,[Wr]:e.ONE_MINUS_CONSTANT_ALPHA};function st(v,Y,H,le,ie,oe,Re,ye,J,Ae){if(v===At){u===!0&&(De(e.BLEND),u=!1);return}if(u===!1&&(ue(e.BLEND),u=!0),v!==nr){if(v!==f||Ae!==w){if((_!==zt||D!==zt)&&(e.blendEquation(e.FUNC_ADD),_=zt,D=zt),Ae)switch(v){case In:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case fi:e.blendFunc(e.ONE,e.ONE);break;case Ii:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case yi:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:tt("WebGLState: Invalid blending: ",v);break}else switch(v){case In:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case fi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Ii:tt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yi:tt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:tt("WebGLState: Invalid blending: ",v);break}L=null,E=null,T=null,l=null,p.set(0,0,0),k=0,f=v,w=Ae}return}ie=ie||Y,oe=oe||H,Re=Re||le,(Y!==_||ie!==D)&&(e.blendEquationSeparate(Ve[Y],Ve[ie]),_=Y,D=ie),(H!==L||le!==E||oe!==T||Re!==l)&&(e.blendFuncSeparate(Ne[H],Ne[le],Ne[oe],Ne[Re]),L=H,E=le,T=oe,l=Re),(ye.equals(p)===!1||J!==k)&&(e.blendColor(ye.r,ye.g,ye.b,J),p.copy(ye),k=J),f=v,w=!1}function it(v,Y){v.side===Vt?De(e.CULL_FACE):ue(e.CULL_FACE);let H=v.side===Lt;Y&&(H=!H),dt(H),v.blending===In&&v.transparent===!1?st(At):st(v.blending,v.blendEquation,v.blendSrc,v.blendDst,v.blendEquationAlpha,v.blendSrcAlpha,v.blendDstAlpha,v.blendColor,v.blendAlpha,v.premultipliedAlpha),o.setFunc(v.depthFunc),o.setTest(v.depthTest),o.setMask(v.depthWrite),a.setMask(v.colorWrite);const le=v.stencilWrite;d.setTest(le),le&&(d.setMask(v.stencilWriteMask),d.setFunc(v.stencilFunc,v.stencilRef,v.stencilFuncMask),d.setOp(v.stencilFail,v.stencilZFail,v.stencilZPass)),ot(v.polygonOffset,v.polygonOffsetFactor,v.polygonOffsetUnits),v.alphaToCoverage===!0?ue(e.SAMPLE_ALPHA_TO_COVERAGE):De(e.SAMPLE_ALPHA_TO_COVERAGE)}function dt(v){I!==v&&(v?e.frontFace(e.CW):e.frontFace(e.CCW),I=v)}function je(v){v!==Ao?(ue(e.CULL_FACE),v!==B&&(v===Ni?e.cullFace(e.BACK):v===bo?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):De(e.CULL_FACE),B=v}function Pt(v){v!==q&&(z&&e.lineWidth(v),q=v)}function ot(v,Y,H){v?(ue(e.POLYGON_OFFSET_FILL),(P!==Y||j!==H)&&(P=Y,j=H,o.getReversed()&&(Y=-Y,H=-H),e.polygonOffset(Y,H))):De(e.POLYGON_OFFSET_FILL)}function gt(v){v?ue(e.SCISSOR_TEST):De(e.SCISSOR_TEST)}function vt(v){v===void 0&&(v=e.TEXTURE0+Z-1),$!==v&&(e.activeTexture(v),$=v)}function St(v,Y,H){H===void 0&&($===null?H=e.TEXTURE0+Z-1:H=$);let le=ee[H];le===void 0&&(le={type:void 0,texture:void 0},ee[H]=le),(le.type!==v||le.texture!==Y)&&($!==H&&(e.activeTexture(H),$=H),e.bindTexture(v,Y||xe[v]),le.type=v,le.texture=Y)}function A(){const v=ee[$];v!==void 0&&v.type!==void 0&&(e.bindTexture(v.type,null),v.type=void 0,v.texture=void 0)}function Et(){try{e.compressedTexImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function qe(){try{e.compressedTexImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function Ze(){try{e.texSubImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function re(){try{e.texSubImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function et(){try{e.compressedTexSubImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function Te(){try{e.compressedTexSubImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function Pe(){try{e.texStorage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function h(){try{e.texStorage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function s(){try{e.texImage2D(...arguments)}catch(v){tt("WebGLState:",v)}}function N(){try{e.texImage3D(...arguments)}catch(v){tt("WebGLState:",v)}}function Q(v){return C[v]!==void 0?C[v]:e.getParameter(v)}function K(v,Y){C[v]!==Y&&(e.pixelStorei(v,Y),C[v]=Y)}function te(v){X.equals(v)===!1&&(e.scissor(v.x,v.y,v.z,v.w),X.copy(v))}function ae(v){pe.equals(v)===!1&&(e.viewport(v.x,v.y,v.z,v.w),pe.copy(v))}function G(v,Y){let H=m.get(Y);H===void 0&&(H=new WeakMap,m.set(Y,H));let le=H.get(v);le===void 0&&(le=e.getUniformBlockIndex(Y,v.name),e.uniformBlockBinding(Y,le,le),H.set(v,le))}function V(v,Y,H){const ie=m.get(Y).get(v);R[ie]!==H&&(e.bindBufferBase(e.UNIFORM_BUFFER,ie,H),R[ie]=H)}function ne(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),b={},C={},$=null,ee={},S={},R={},g=new WeakMap,x=[],U=null,u=!1,f=null,_=null,L=null,E=null,D=null,T=null,l=null,p=new Ke(0,0,0),k=0,w=!1,I=null,B=null,q=null,P=null,j=null,X.set(0,0,e.canvas.width,e.canvas.height),pe.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),d.reset()}return{buffers:{color:a,depth:o,stencil:d},enable:ue,disable:De,bindFramebuffer:nt,drawBuffers:Ce,useProgram:We,setBlending:st,setMaterial:it,setFlipSided:dt,setCullFace:je,setLineWidth:Pt,setPolygonOffset:ot,setScissorTest:gt,activeTexture:vt,bindTexture:St,unbindTexture:A,compressedTexImage2D:Et,compressedTexImage3D:qe,texImage2D:s,texImage3D:N,pixelStorei:K,getParameter:Q,updateUBOMapping:G,uniformBlockBinding:V,texStorage2D:Pe,texStorage3D:h,texSubImage2D:Ze,texSubImage3D:re,compressedTexSubImage2D:et,compressedTexSubImage3D:Te,scissor:te,viewport:ae,reset:ne}}function Iu(e,t,n,i,r,a,o){const d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,R=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new Oe,b=new WeakMap,C=new Set;let S;const g=new WeakMap,x=new Set,U=new FinalizationRegistry(h=>x.delete(h));let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function f(h,s){return u?new OffscreenCanvas(h,s):Bo("canvas")}function _(h,s,N){let Q=1;const K=Pe(h);if((K.width>N||K.height>N)&&(Q=N/Math.max(K.width,K.height)),Q<1)if(typeof HTMLImageElement<"u"&&h instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&h instanceof ImageBitmap||typeof VideoFrame<"u"&&h instanceof VideoFrame){const te=Math.floor(Q*K.width),ae=Math.floor(Q*K.height);S===void 0&&(S=f(te,ae));const G=s?f(te,ae):S;return G.width=te,G.height=ae,G.getContext("2d").drawImage(h,0,0,te,ae),Ye("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+te+"x"+ae+")."),G}else return"data"in h&&Ye("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),h;return h}function L(h){return h.generateMipmaps}function E(h){e.generateMipmap(h)}function D(h){return h.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:h.isWebGL3DRenderTarget?e.TEXTURE_3D:h.isWebGLArrayRenderTarget||h.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function T(h,s,N,Q,K,te=!1){if(h!==null){if(e[h]!==void 0)return e[h];Ye("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+h+"'")}let ae;Q&&(ae=t.get("EXT_texture_norm16"),ae||Ye("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let G=s;if(s===e.RED&&(N===e.FLOAT&&(G=e.R32F),N===e.HALF_FLOAT&&(G=e.R16F),N===e.UNSIGNED_BYTE&&(G=e.R8),N===e.UNSIGNED_SHORT&&ae&&(G=ae.R16_EXT),N===e.SHORT&&ae&&(G=ae.R16_SNORM_EXT)),s===e.RED_INTEGER&&(N===e.UNSIGNED_BYTE&&(G=e.R8UI),N===e.UNSIGNED_SHORT&&(G=e.R16UI),N===e.UNSIGNED_INT&&(G=e.R32UI),N===e.BYTE&&(G=e.R8I),N===e.SHORT&&(G=e.R16I),N===e.INT&&(G=e.R32I)),s===e.RG&&(N===e.FLOAT&&(G=e.RG32F),N===e.HALF_FLOAT&&(G=e.RG16F),N===e.UNSIGNED_BYTE&&(G=e.RG8),N===e.UNSIGNED_SHORT&&ae&&(G=ae.RG16_EXT),N===e.SHORT&&ae&&(G=ae.RG16_SNORM_EXT)),s===e.RG_INTEGER&&(N===e.UNSIGNED_BYTE&&(G=e.RG8UI),N===e.UNSIGNED_SHORT&&(G=e.RG16UI),N===e.UNSIGNED_INT&&(G=e.RG32UI),N===e.BYTE&&(G=e.RG8I),N===e.SHORT&&(G=e.RG16I),N===e.INT&&(G=e.RG32I)),s===e.RGB_INTEGER&&(N===e.UNSIGNED_BYTE&&(G=e.RGB8UI),N===e.UNSIGNED_SHORT&&(G=e.RGB16UI),N===e.UNSIGNED_INT&&(G=e.RGB32UI),N===e.BYTE&&(G=e.RGB8I),N===e.SHORT&&(G=e.RGB16I),N===e.INT&&(G=e.RGB32I)),s===e.RGBA_INTEGER&&(N===e.UNSIGNED_BYTE&&(G=e.RGBA8UI),N===e.UNSIGNED_SHORT&&(G=e.RGBA16UI),N===e.UNSIGNED_INT&&(G=e.RGBA32UI),N===e.BYTE&&(G=e.RGBA8I),N===e.SHORT&&(G=e.RGBA16I),N===e.INT&&(G=e.RGBA32I)),s===e.RGB&&(N===e.UNSIGNED_SHORT&&ae&&(G=ae.RGB16_EXT),N===e.SHORT&&ae&&(G=ae.RGB16_SNORM_EXT),N===e.UNSIGNED_INT_5_9_9_9_REV&&(G=e.RGB9_E5),N===e.UNSIGNED_INT_10F_11F_11F_REV&&(G=e.R11F_G11F_B10F)),s===e.RGBA){const V=te?cr:rt.getTransfer(K);N===e.FLOAT&&(G=e.RGBA32F),N===e.HALF_FLOAT&&(G=e.RGBA16F),N===e.UNSIGNED_BYTE&&(G=V===Je?e.SRGB8_ALPHA8:e.RGBA8),N===e.UNSIGNED_SHORT&&ae&&(G=ae.RGBA16_EXT),N===e.SHORT&&ae&&(G=ae.RGBA16_SNORM_EXT),N===e.UNSIGNED_SHORT_4_4_4_4&&(G=e.RGBA4),N===e.UNSIGNED_SHORT_5_5_5_1&&(G=e.RGB5_A1)}return(G===e.R16F||G===e.R32F||G===e.RG16F||G===e.RG32F||G===e.RGBA16F||G===e.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function l(h,s){let N;return h?s===null||s===an||s===rn?N=e.DEPTH24_STENCIL8:s===Zt?N=e.DEPTH32F_STENCIL8:s===Gn&&(N=e.DEPTH24_STENCIL8,Ye("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):s===null||s===an||s===rn?N=e.DEPTH_COMPONENT24:s===Zt?N=e.DEPTH_COMPONENT32F:s===Gn&&(N=e.DEPTH_COMPONENT16),N}function p(h,s){return L(h)===!0||h.isFramebufferTexture&&h.minFilter!==Wt&&h.minFilter!==It?Math.log2(Math.max(s.width,s.height))+1:h.mipmaps.length>0?h.mipmaps.length:h.isCompressedTexture&&Array.isArray(h.image)?s.mipmaps.length:1}function k(h){const s=new WeakRef(h);i.get(h).__ref=s,x.add(s),U.register(h,s,s)}function w(h){const s=i.get(h).__ref;s!==void 0&&(x.delete(s),U.unregister(s))}function I(h){q(h.target)}function B(h){P(h.target)}function q(h){h.removeEventListener("dispose",I),w(h),Z(h),h.isVideoTexture&&b.delete(h),h.isHTMLTexture&&C.delete(h)}function P(h){h.removeEventListener("dispose",B),w(h),se(h)}function j(){for(const h of x){const s=h.deref();s!==void 0&&(s.isRenderTarget===!0?P(s):q(s))}x.clear(),C.clear()}function Z(h){const s=i.get(h);if(s.__webglInit===void 0)return;const N=h.source,Q=g.get(N);if(Q){const K=Q[s.__cacheKey];K.usedTimes--,K.usedTimes===0&&z(h),Object.keys(Q).length===0&&g.delete(N)}i.remove(h)}function z(h){const s=i.get(h);e.deleteTexture(s.__webglTexture);const N=h.source,Q=g.get(N);delete Q[s.__cacheKey],o.memory.textures--}function se(h){const s=i.get(h);s.__depthDisposeCallback&&s.__depthDisposeCallback();const N=h.depthTexture;if(N&&N.renderTarget===h&&q(N),h.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(s.__webglFramebuffer[K]))for(let te=0;te<s.__webglFramebuffer[K].length;te++)e.deleteFramebuffer(s.__webglFramebuffer[K][te]);else e.deleteFramebuffer(s.__webglFramebuffer[K]);s.__webglDepthbuffer&&e.deleteRenderbuffer(s.__webglDepthbuffer[K])}else{if(Array.isArray(s.__webglFramebuffer))for(let K=0;K<s.__webglFramebuffer.length;K++)e.deleteFramebuffer(s.__webglFramebuffer[K]);else e.deleteFramebuffer(s.__webglFramebuffer);if(s.__webglDepthbuffer&&e.deleteRenderbuffer(s.__webglDepthbuffer),s.__webglMultisampledFramebuffer&&e.deleteFramebuffer(s.__webglMultisampledFramebuffer),s.__webglColorRenderbuffer)for(let K=0;K<s.__webglColorRenderbuffer.length;K++)s.__webglColorRenderbuffer[K]&&e.deleteRenderbuffer(s.__webglColorRenderbuffer[K]);s.__webglDepthRenderbuffer&&e.deleteRenderbuffer(s.__webglDepthRenderbuffer)}const Q=h.textures;for(let K=0,te=Q.length;K<te;K++){const ae=i.get(Q[K]);ae.__webglTexture&&(e.deleteTexture(ae.__webglTexture),o.memory.textures--),i.remove(Q[K])}i.remove(h)}let W=0;function $(){W=0}function ee(){return W}function Me(h){W=h}function Le(){const h=W;return h>=r.maxTextures&&Ye("WebGLTextures: Trying to use "+(h+1)+" texture units while this GPU supports only "+r.maxTextures),W+=1,h}function X(h){const s=[];return s.push(h.wrapS),s.push(h.wrapT),s.push(h.wrapR||0),s.push(h.magFilter),s.push(h.minFilter),s.push(h.anisotropy),s.push(h.internalFormat),s.push(h.format),s.push(h.type),s.push(h.generateMipmaps),s.push(h.mipmapsAutoUpdate),s.push(h.premultiplyAlpha),s.push(h.flipY),s.push(h.unpackAlignment),s.push(h.colorSpace),s.join()}function pe(h,s){const N=i.get(h);if(h.isVideoTexture&&et(h),h.isRenderTargetTexture===!1&&h.isExternalTexture!==!0&&h.version>0&&N.__version!==h.version){const Q=h.image;if(Q===null)Ye("WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)Ye("WebGLRenderer: Texture marked for update but image is incomplete");else{it(N,h,s);return}}else h.isExternalTexture&&(N.__webglTexture=h.sourceTexture?h.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,N.__webglTexture,e.TEXTURE0+s)}function _e(h,s){const N=i.get(h);if(h.isRenderTargetTexture===!1&&h.version>0&&N.__version!==h.version){it(N,h,s);return}else h.isExternalTexture&&(N.__webglTexture=h.sourceTexture?h.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,N.__webglTexture,e.TEXTURE0+s)}function xe(h,s){const N=i.get(h);if(h.isRenderTargetTexture===!1&&h.version>0&&N.__version!==h.version){it(N,h,s);return}n.bindTexture(e.TEXTURE_3D,N.__webglTexture,e.TEXTURE0+s)}function ue(h,s){const N=i.get(h);if(h.version>0&&N.__version!==h.version){dt(N,h,s);return}n.bindTexture(e.TEXTURE_CUBE_MAP,N.__webglTexture,e.TEXTURE0+s)}const De={[Mn]:e.REPEAT,[ci]:e.CLAMP_TO_EDGE,[no]:e.MIRRORED_REPEAT},nt={[Wt]:e.NEAREST,[io]:e.NEAREST_MIPMAP_NEAREST,[Pn]:e.NEAREST_MIPMAP_LINEAR,[It]:e.LINEAR,[Kn]:e.LINEAR_MIPMAP_NEAREST,[tn]:e.LINEAR_MIPMAP_LINEAR},Ce={[lo]:e.NEVER,[Xa]:e.ALWAYS,[so]:e.LESS,[Wa]:e.LEQUAL,[oo]:e.EQUAL,[ka]:e.GEQUAL,[ro]:e.GREATER,[ao]:e.NOTEQUAL};function We(h,s){if(s.type===Zt&&t.has("OES_texture_float_linear")===!1&&(s.magFilter===It||s.magFilter===Kn||s.magFilter===Pn||s.magFilter===tn||s.minFilter===It||s.minFilter===Kn||s.minFilter===Pn||s.minFilter===tn)&&Ye("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(h,e.TEXTURE_WRAP_S,De[s.wrapS]),e.texParameteri(h,e.TEXTURE_WRAP_T,De[s.wrapT]),(h===e.TEXTURE_3D||h===e.TEXTURE_2D_ARRAY)&&e.texParameteri(h,e.TEXTURE_WRAP_R,De[s.wrapR]),e.texParameteri(h,e.TEXTURE_MAG_FILTER,nt[s.magFilter]),e.texParameteri(h,e.TEXTURE_MIN_FILTER,nt[s.minFilter]),s.compareFunction&&(e.texParameteri(h,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(h,e.TEXTURE_COMPARE_FUNC,Ce[s.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(s.magFilter===Wt||s.minFilter!==Pn&&s.minFilter!==tn||s.type===Zt&&t.has("OES_texture_float_linear")===!1)return;if(s.anisotropy>1||i.get(s).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");e.texParameterf(h,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(s.anisotropy,r.getMaxAnisotropy())),i.get(s).__currentAnisotropy=s.anisotropy}}}function Ve(h,s){let N=!1;h.__webglInit===void 0&&(h.__webglInit=!0,s.addEventListener("dispose",I),k(s));const Q=s.source;let K=g.get(Q);K===void 0&&(K={},g.set(Q,K));const te=X(s);if(te!==h.__cacheKey){K[te]===void 0&&(K[te]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,N=!0),K[te].usedTimes++;const ae=K[h.__cacheKey];ae!==void 0&&(K[h.__cacheKey].usedTimes--,ae.usedTimes===0&&z(s)),h.__cacheKey=te,h.__webglTexture=K[te].texture}return N}function Ne(h,s,N){return Math.floor(Math.floor(h/N)/s)}function st(h,s,N,Q){const te=h.updateRanges;if(te.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,s.width,s.height,N,Q,s.data);else{te.sort((v,Y)=>v.start-Y.start);let ae=0;for(let v=1;v<te.length;v++){const Y=te[ae],H=te[v],le=Y.start+Y.count,ie=Ne(H.start,s.width,4),oe=Ne(Y.start,s.width,4);H.start<=le+1&&ie===oe&&Ne(H.start+H.count-1,s.width,4)===ie?Y.count=Math.max(Y.count,H.start+H.count-Y.start):(++ae,te[ae]=H)}te.length=ae+1;const G=n.getParameter(e.UNPACK_ROW_LENGTH),V=n.getParameter(e.UNPACK_SKIP_PIXELS),ne=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,s.width);for(let v=0,Y=te.length;v<Y;v++){const H=te[v],le=Math.floor(H.start/4),ie=Math.ceil(H.count/4),oe=le%s.width,Re=Math.floor(le/s.width),ye=ie,J=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,oe),n.pixelStorei(e.UNPACK_SKIP_ROWS,Re),n.texSubImage2D(e.TEXTURE_2D,0,oe,Re,ye,J,N,Q,s.data)}h.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,G),n.pixelStorei(e.UNPACK_SKIP_PIXELS,V),n.pixelStorei(e.UNPACK_SKIP_ROWS,ne)}}function it(h,s,N){let Q=e.TEXTURE_2D;(s.isDataArrayTexture||s.isCompressedArrayTexture)&&(Q=e.TEXTURE_2D_ARRAY),s.isData3DTexture&&(Q=e.TEXTURE_3D);const K=Ve(h,s),te=s.source;n.bindTexture(Q,h.__webglTexture,e.TEXTURE0+N);const ae=i.get(te);if(te.version!==ae.__version||K===!0){if(n.activeTexture(e.TEXTURE0+N),(typeof ImageBitmap<"u"&&s.image instanceof ImageBitmap)===!1){const J=rt.getPrimaries(rt.workingColorSpace),Ae=s.colorSpace===on?null:rt.getPrimaries(s.colorSpace),Ue=s.colorSpace===on||J===Ae?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,s.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,s.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue)}n.pixelStorei(e.UNPACK_ALIGNMENT,s.unpackAlignment);let V=_(s.image,!1,r.maxTextureSize);V=Te(s,V);const ne=a.convert(s.format,s.colorSpace),v=a.convert(s.type);let Y=T(s.internalFormat,ne,v,s.normalized,s.colorSpace,s.isVideoTexture);We(Q,s);let H;const le=s.mipmaps,ie=s.isVideoTexture!==!0,oe=ae.__version===void 0||K===!0,Re=te.dataReady,ye=p(s,V);if(s.isDepthTexture)Y=l(s.format===jt,s.type),oe&&(ie?n.texStorage2D(e.TEXTURE_2D,1,Y,V.width,V.height):n.texImage2D(e.TEXTURE_2D,0,Y,V.width,V.height,0,ne,v,null));else if(s.isDataTexture)if(le.length>0){ie&&oe&&n.texStorage2D(e.TEXTURE_2D,ye,Y,le[0].width,le[0].height);for(let J=0,Ae=le.length;J<Ae;J++)H=le[J],ie?Re&&n.texSubImage2D(e.TEXTURE_2D,J,0,0,H.width,H.height,ne,v,H.data):n.texImage2D(e.TEXTURE_2D,J,Y,H.width,H.height,0,ne,v,H.data);s.generateMipmaps=!1}else ie?(oe&&n.texStorage2D(e.TEXTURE_2D,ye,Y,V.width,V.height),Re&&st(s,V,ne,v)):n.texImage2D(e.TEXTURE_2D,0,Y,V.width,V.height,0,ne,v,V.data);else if(s.isCompressedTexture)if(s.isCompressedArrayTexture){ie&&oe&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ye,Y,le[0].width,le[0].height,V.depth);for(let J=0,Ae=le.length;J<Ae;J++)if(H=le[J],s.format!==Xt)if(ne!==null)if(ie){if(Re)if(s.layerUpdates.size>0){const Ue=ha(H.width,H.height,s.format,s.type);for(const de of s.layerUpdates){const Xe=H.data.subarray(de*Ue/H.data.BYTES_PER_ELEMENT,(de+1)*Ue/H.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,de,H.width,H.height,1,ne,Xe)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,H.width,H.height,V.depth,ne,H.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,J,Y,H.width,H.height,V.depth,0,H.data,0,0);else Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ie?Re&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,H.width,H.height,V.depth,ne,v,H.data):n.texImage3D(e.TEXTURE_2D_ARRAY,J,Y,H.width,H.height,V.depth,0,ne,v,H.data);s.layerUpdates.size>0&&s.clearLayerUpdates()}else{ie&&oe&&n.texStorage2D(e.TEXTURE_2D,ye,Y,le[0].width,le[0].height);for(let J=0,Ae=le.length;J<Ae;J++)H=le[J],s.format!==Xt?ne!==null?ie?Re&&n.compressedTexSubImage2D(e.TEXTURE_2D,J,0,0,H.width,H.height,ne,H.data):n.compressedTexImage2D(e.TEXTURE_2D,J,Y,H.width,H.height,0,H.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?Re&&n.texSubImage2D(e.TEXTURE_2D,J,0,0,H.width,H.height,ne,v,H.data):n.texImage2D(e.TEXTURE_2D,J,Y,H.width,H.height,0,ne,v,H.data)}else if(s.isDataArrayTexture)if(ie){if(oe&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ye,Y,V.width,V.height,V.depth),Re)if(s.layerUpdates.size>0){const J=ha(V.width,V.height,s.format,s.type);for(const Ae of s.layerUpdates){const Ue=V.data.subarray(Ae*J/V.data.BYTES_PER_ELEMENT,(Ae+1)*J/V.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,Ae,V.width,V.height,1,ne,v,Ue)}s.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,V.width,V.height,V.depth,ne,v,V.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,Y,V.width,V.height,V.depth,0,ne,v,V.data);else if(s.isData3DTexture)ie?(oe&&n.texStorage3D(e.TEXTURE_3D,ye,Y,V.width,V.height,V.depth),Re&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,V.width,V.height,V.depth,ne,v,V.data)):n.texImage3D(e.TEXTURE_3D,0,Y,V.width,V.height,V.depth,0,ne,v,V.data);else if(s.isFramebufferTexture){if(oe)if(ie)n.texStorage2D(e.TEXTURE_2D,ye,Y,V.width,V.height);else{let J=V.width,Ae=V.height;for(let Ue=0;Ue<ye;Ue++)n.texImage2D(e.TEXTURE_2D,Ue,Y,J,Ae,0,ne,v,null),J>>=1,Ae>>=1}}else if(s.isHTMLTexture){if("texElementImage2D"in e){const J=e.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),V.parentNode!==J){J.appendChild(V),C.add(s),J.onpaint=Ae=>{const Ue=Ae.changedElements;for(const de of C)Ue.includes(de.image)&&(de.needsUpdate=!0)},J.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,V);else{const Ue=e.RGBA,de=e.RGBA,Xe=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,Ue,de,Xe,V)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(le.length>0){if(ie&&oe){const J=Pe(le[0]);n.texStorage2D(e.TEXTURE_2D,ye,Y,J.width,J.height)}for(let J=0,Ae=le.length;J<Ae;J++)H=le[J],ie?Re&&n.texSubImage2D(e.TEXTURE_2D,J,0,0,ne,v,H):n.texImage2D(e.TEXTURE_2D,J,Y,ne,v,H);s.generateMipmaps=!1}else if(ie){if(oe){const J=Pe(V);n.texStorage2D(e.TEXTURE_2D,ye,Y,J.width,J.height)}Re&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,ne,v,V)}else n.texImage2D(e.TEXTURE_2D,0,Y,ne,v,V);L(s)&&s.mipmapsAutoUpdate===!0&&E(Q),ae.__version=te.version,s.onUpdate&&s.onUpdate(s)}h.__version=s.version}function dt(h,s,N){if(s.image.length!==6)return;const Q=Ve(h,s),K=s.source;n.bindTexture(e.TEXTURE_CUBE_MAP,h.__webglTexture,e.TEXTURE0+N);const te=i.get(K);if(K.version!==te.__version||Q===!0){n.activeTexture(e.TEXTURE0+N);const ae=rt.getPrimaries(rt.workingColorSpace),G=s.colorSpace===on?null:rt.getPrimaries(s.colorSpace),V=s.colorSpace===on||ae===G?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,s.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,s.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,s.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,V);const ne=s.isCompressedTexture||s.image[0].isCompressedTexture,v=s.image[0]&&s.image[0].isDataTexture,Y=[];for(let de=0;de<6;de++)!ne&&!v?Y[de]=_(s.image[de],!0,r.maxCubemapSize):Y[de]=v?s.image[de].image:s.image[de],Y[de]=Te(s,Y[de]);const H=Y[0],le=a.convert(s.format,s.colorSpace),ie=a.convert(s.type);let oe=T(s.internalFormat,le,ie,s.normalized,s.colorSpace);const Re=s.isVideoTexture!==!0,ye=te.__version===void 0||Q===!0,J=K.dataReady;let Ae=p(s,H);We(e.TEXTURE_CUBE_MAP,s);let Ue;if(s.isDepthTexture){if(oe=l(s.format===jt,s.type),ye)if(Re)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,oe,H.width,H.height);else for(let de=0;de<6;de++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,oe,H.width,H.height,0,le,ie,null)}else if(ne){Re&&ye&&n.texStorage2D(e.TEXTURE_CUBE_MAP,Ae,oe,H.width,H.height);for(let de=0;de<6;de++){Ue=Y[de].mipmaps;for(let Xe=0;Xe<Ue.length;Xe++){const ht=Ue[Xe];s.format!==Xt?le!==null?Re?J&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe,0,0,ht.width,ht.height,le,ht.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe,oe,ht.width,ht.height,0,ht.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Re?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe,0,0,ht.width,ht.height,le,ie,ht.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe,oe,ht.width,ht.height,0,le,ie,ht.data)}}}else{if(Ue=s.mipmaps,Re&&ye){Ue.length>0&&Ae++;const de=Pe(Y[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,Ae,oe,de.width,de.height)}for(let de=0;de<6;de++)if(v){Re?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,0,0,Y[de].width,Y[de].height,le,ie,Y[de].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,oe,Y[de].width,Y[de].height,0,le,ie,Y[de].data);for(let Xe=0;Xe<Ue.length;Xe++){const Kt=Ue[Xe].image[de].image;Re?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe+1,0,0,Kt.width,Kt.height,le,ie,Kt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe+1,oe,Kt.width,Kt.height,0,le,ie,Kt.data)}}else{Re?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,0,0,le,ie,Y[de]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,oe,le,ie,Y[de]);for(let Xe=0;Xe<Ue.length;Xe++){const ht=Ue[Xe];Re?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe+1,0,0,le,ie,ht.image[de]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Xe+1,oe,le,ie,ht.image[de])}}}L(s)&&s.mipmapsAutoUpdate===!0&&E(e.TEXTURE_CUBE_MAP),te.__version=K.version,s.onUpdate&&s.onUpdate(s)}h.__version=s.version}function je(h,s,N,Q,K,te){const ae=a.convert(N.format,N.colorSpace),G=a.convert(N.type),V=T(N.internalFormat,ae,G,N.normalized,N.colorSpace),ne=i.get(s),v=i.get(N);if(v.__renderTarget=s,!ne.__hasExternalTextures){const Y=Math.max(1,s.width>>te),H=Math.max(1,s.height>>te);K===e.TEXTURE_3D||K===e.TEXTURE_2D_ARRAY?n.texImage3D(K,te,V,Y,H,s.depth,0,ae,G,null):n.texImage2D(K,te,V,Y,H,0,ae,G,null)}n.bindFramebuffer(e.FRAMEBUFFER,h),re(s)?d.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Q,K,v.__webglTexture,0,Ze(s)):(K===e.TEXTURE_2D||K>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,Q,K,v.__webglTexture,te),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Pt(h,s,N){if(e.bindRenderbuffer(e.RENDERBUFFER,h),s.depthBuffer){const Q=s.depthTexture,K=Q&&Q.isDepthTexture?Q.type:null,te=l(s.stencilBuffer,K),ae=s.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;re(s)?d.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ze(s),te,s.width,s.height):N?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ze(s),te,s.width,s.height):e.renderbufferStorage(e.RENDERBUFFER,te,s.width,s.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ae,e.RENDERBUFFER,h)}else{const Q=s.textures;for(let K=0;K<Q.length;K++){const te=Q[K],ae=a.convert(te.format,te.colorSpace),G=a.convert(te.type),V=T(te.internalFormat,ae,G,te.normalized,te.colorSpace);re(s)?d.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ze(s),V,s.width,s.height):N?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ze(s),V,s.width,s.height):e.renderbufferStorage(e.RENDERBUFFER,V,s.width,s.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ot(h,s,N){const Q=s.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,h),!(s.depthTexture&&s.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const K=i.get(s.depthTexture);K.__renderTarget=s;const te=Q?s.depthTexture.image[0]:s.depthTexture.image;(!K.__webglTexture||te.width!==s.width||te.height!==s.height)&&(te.width=s.width,te.height=s.height,s.depthTexture.needsUpdate=!0),Q?ue(s.depthTexture,0):pe(s.depthTexture,0);const ae=K.__webglTexture,G=Ze(s),V=Q?e.TEXTURE_CUBE_MAP_POSITIVE_X+N:e.TEXTURE_2D,ne=s.depthTexture.format===jt?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(s.depthTexture.format===xn)re(s)?d.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,ne,V,ae,0,G):e.framebufferTexture2D(e.FRAMEBUFFER,ne,V,ae,0);else if(s.depthTexture.format===jt)re(s)?d.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,ne,V,ae,0,G):e.framebufferTexture2D(e.FRAMEBUFFER,ne,V,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function gt(h){const s=i.get(h),N=h.isWebGLCubeRenderTarget===!0;if(s.__boundDepthTexture!==h.depthTexture){const Q=h.depthTexture;if(s.__depthDisposeCallback&&s.__depthDisposeCallback(),Q){const K=()=>{delete s.__boundDepthTexture,delete s.__depthDisposeCallback,Q.removeEventListener("dispose",K)};Q.addEventListener("dispose",K),s.__depthDisposeCallback=K}s.__boundDepthTexture=Q}if(h.depthTexture&&!s.__autoAllocateDepthBuffer)if(N)for(let Q=0;Q<6;Q++)ot(s.__webglFramebuffer[Q],h,Q);else h.texture.mipmaps.length>0?ot(s.__webglFramebuffer[0],h,0):ot(s.__webglFramebuffer,h,0);else if(N){s.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(n.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer[Q]),s.__webglDepthbuffer[Q]===void 0)s.__webglDepthbuffer[Q]=e.createRenderbuffer(),Pt(s.__webglDepthbuffer[Q],h,!1);else{const K=h.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=s.__webglDepthbuffer[Q];e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,te)}}else if(h.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),s.__webglDepthbuffer===void 0)s.__webglDepthbuffer=e.createRenderbuffer(),Pt(s.__webglDepthbuffer,h,!1);else{const K=h.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=s.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,te)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function vt(h,s,N){const Q=i.get(h);s!==void 0&&je(Q.__webglFramebuffer,h,h.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),N!==void 0&&gt(h)}function St(h){const s=h.texture,N=i.get(h),Q=i.get(s);h.addEventListener("dispose",B),k(h);const K=h.textures,te=h.isWebGLCubeRenderTarget===!0,ae=K.length>1;if(ae||(Q.__webglTexture===void 0&&(Q.__webglTexture=e.createTexture()),Q.__version=s.version,o.memory.textures++),te){N.__webglFramebuffer=[];for(let G=0;G<6;G++)if(s.mipmaps.length>0){N.__webglFramebuffer[G]=[];for(let V=0;V<s.mipmaps.length;V++)N.__webglFramebuffer[G][V]=e.createFramebuffer()}else N.__webglFramebuffer[G]=e.createFramebuffer()}else{if(s.mipmaps.length>0){N.__webglFramebuffer=[];for(let G=0;G<s.mipmaps.length;G++)N.__webglFramebuffer[G]=e.createFramebuffer()}else N.__webglFramebuffer=e.createFramebuffer();if(ae)for(let G=0,V=K.length;G<V;G++){const ne=i.get(K[G]);ne.__webglTexture===void 0&&(ne.__webglTexture=e.createTexture(),o.memory.textures++)}if(h.samples>0&&re(h)===!1){N.__webglMultisampledFramebuffer=e.createFramebuffer(),N.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let G=0;G<K.length;G++){const V=K[G];N.__webglColorRenderbuffer[G]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,N.__webglColorRenderbuffer[G]);const ne=a.convert(V.format,V.colorSpace),v=a.convert(V.type),Y=T(V.internalFormat,ne,v,V.normalized,V.colorSpace,h.isXRRenderTarget===!0),H=Ze(h);e.renderbufferStorageMultisample(e.RENDERBUFFER,H,Y,h.width,h.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+G,e.RENDERBUFFER,N.__webglColorRenderbuffer[G])}e.bindRenderbuffer(e.RENDERBUFFER,null),h.depthBuffer&&(N.__webglDepthRenderbuffer=e.createRenderbuffer(),Pt(N.__webglDepthRenderbuffer,h,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(te){n.bindTexture(e.TEXTURE_CUBE_MAP,Q.__webglTexture),We(e.TEXTURE_CUBE_MAP,s);for(let G=0;G<6;G++)if(s.mipmaps.length>0)for(let V=0;V<s.mipmaps.length;V++)je(N.__webglFramebuffer[G][V],h,s,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+G,V);else je(N.__webglFramebuffer[G],h,s,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+G,0);L(s)?E(e.TEXTURE_CUBE_MAP):s.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,s.mipmaps.length-1),n.unbindTexture()}else if(ae){for(let G=0,V=K.length;G<V;G++){const ne=K[G],v=i.get(ne);let Y=e.TEXTURE_2D;(h.isWebGL3DRenderTarget||h.isWebGLArrayRenderTarget)&&(Y=h.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(Y,v.__webglTexture),We(Y,ne),je(N.__webglFramebuffer,h,ne,e.COLOR_ATTACHMENT0+G,Y,0),L(ne)&&E(Y)}n.unbindTexture()}else{let G=e.TEXTURE_2D;if((h.isWebGL3DRenderTarget||h.isWebGLArrayRenderTarget)&&(G=h.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(G,Q.__webglTexture),We(G,s),s.mipmaps.length>0)for(let V=0;V<s.mipmaps.length;V++)je(N.__webglFramebuffer[V],h,s,e.COLOR_ATTACHMENT0,G,V);else je(N.__webglFramebuffer,h,s,e.COLOR_ATTACHMENT0,G,0);L(s)?E(G):s.mipmaps.length>0&&e.texParameteri(G,e.TEXTURE_MAX_LEVEL,s.mipmaps.length-1),n.unbindTexture()}h.depthBuffer&&gt(h)}function A(h){const s=h.textures;for(let N=0,Q=s.length;N<Q;N++){const K=s[N];if(L(K)&&K.mipmapsAutoUpdate===!0){const te=D(h),ae=i.get(K).__webglTexture;n.bindTexture(te,ae),E(te),n.unbindTexture()}}}const Et=[];function qe(h){if(h.samples>0){if(re(h)===!1){const s=h.textures,N=h.width,Q=h.height;let K=e.COLOR_BUFFER_BIT;const te=h.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=i.get(h),G=s.length>1;if(G)for(let ne=0;ne<s.length;ne++)n.bindFramebuffer(e.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,ae.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer),h.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ae.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let ne=0;ne<s.length;ne++){if(h.resolveDepthBuffer&&(h.depthBuffer&&(K|=e.DEPTH_BUFFER_BIT),h.stencilBuffer&&h.resolveStencilBuffer&&(K|=e.STENCIL_BUFFER_BIT)),G){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ae.__webglColorRenderbuffer[ne]);const v=i.get(s[ne]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,v,0)}e.blitFramebuffer(0,0,N,Q,0,0,N,Q,K,e.NEAREST),R===!0&&(Et.length=0,Et.push(e.COLOR_ATTACHMENT0+ne),h.depthBuffer&&h.storeMultisampledDepthBuffer===!1&&Et.push(te),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Et))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),G)for(let ne=0;ne<s.length;ne++){n.bindFramebuffer(e.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.RENDERBUFFER,ae.__webglColorRenderbuffer[ne]);const v=i.get(s[ne]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,ae.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.TEXTURE_2D,v,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}else if(h.depthBuffer&&h.storeMultisampledDepthBuffer===!1&&R){const s=h.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[s])}}}function Ze(h){return Math.min(r.maxSamples,h.samples)}function re(h){const s=i.get(h);return h.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&s.__useRenderToTexture!==!1}function et(h){const s=o.render.frame;b.get(h)!==s&&(b.set(h,s),h.update())}function Te(h,s){const N=h.colorSpace,Q=h.format,K=h.type;return h.isCompressedTexture===!0||h.isVideoTexture===!0||N!==Za&&N!==on&&(rt.getTransfer(N)===Je?(Q!==Xt||K!==yt)&&Ye("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):tt("WebGLTextures: Unsupported texture color space:",N)),s}function Pe(h){return typeof HTMLImageElement<"u"&&h instanceof HTMLImageElement?(m.width=h.naturalWidth||h.width,m.height=h.naturalHeight||h.height):typeof VideoFrame<"u"&&h instanceof VideoFrame?(m.width=h.displayWidth,m.height=h.displayHeight):(m.width=h.width,m.height=h.height),m}this.allocateTextureUnit=Le,this.resetTextureUnits=$,this.getTextureUnits=ee,this.setTextureUnits=Me,this.setTexture2D=pe,this.setTexture2DArray=_e,this.setTexture3D=xe,this.setTextureCube=ue,this.rebindTextures=vt,this.setupRenderTarget=St,this.updateRenderTargetMipmap=A,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=gt,this.setupFrameBufferTexture=je,this.useMultisampledRTT=re,this.dispose=j}function Ou(e,t){function n(i,r=on){let a;const o=rt.getTransfer(r);if(i===yt)return e.UNSIGNED_BYTE;if(i===er)return e.UNSIGNED_SHORT_4_4_4_4;if(i===tr)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Co)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Do)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===wo)return e.BYTE;if(i===Lo)return e.SHORT;if(i===Gn)return e.UNSIGNED_SHORT;if(i===sr)return e.INT;if(i===an)return e.UNSIGNED_INT;if(i===Zt)return e.FLOAT;if(i===bt)return e.HALF_FLOAT;if(i===Uo)return e.ALPHA;if(i===No)return e.RGB;if(i===Xt)return e.RGBA;if(i===xn)return e.DEPTH_COMPONENT;if(i===jt)return e.DEPTH_STENCIL;if(i===yo)return e.RED;if(i===Ja)return e.RED_INTEGER;if(i===cn)return e.RG;if(i===Qa)return e.RG_INTEGER;if(i===$a)return e.RGBA_INTEGER;if(i===jn||i===$n||i===Qn||i===Jn)if(o===Je)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===jn)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===$n)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Qn)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Jn)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===jn)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===$n)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Qn)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Jn)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Fi||i===Bi||i===Gi||i===Hi)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Fi)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Bi)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Gi)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Hi)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Vi||i===zi||i===ki||i===Wi||i===Xi||i===di||i===Yi)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Vi||i===zi)return o===Je?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===ki)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===Wi)return a.COMPRESSED_R11_EAC;if(i===Xi)return a.COMPRESSED_SIGNED_R11_EAC;if(i===di)return a.COMPRESSED_RG11_EAC;if(i===Yi)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ki||i===qi||i===Zi||i===ji||i===$i||i===Qi||i===Ji||i===ea||i===ta||i===na||i===ia||i===aa||i===ra||i===oa)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Ki)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===qi)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Zi)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ji)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$i)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qi)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ji)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ea)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ta)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===na)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ia)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===aa)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ra)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===oa)return o===Je?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===sa||i===la||i===ca)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===sa)return o===Je?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===la)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ca)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===fa||i===ua||i===hi||i===da)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===fa)return a.COMPRESSED_RED_RGTC1_EXT;if(i===ua)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===hi)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===da)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===rn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}const Fu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bu=`
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

}`;class Gu{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){const i=new or(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const n=t.cameras[0].viewport,i=new _t({vertexShader:Fu,fragmentShader:Bu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new $t(new ir(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hu extends po{constructor(t,n){super();const i=this;let r=null,a=1,o=null,d="local-floor",R=1,m=null,b=null,C=null,S=null,g=null,x=null;const U=typeof XRWebGLBinding<"u",u=new Gu,f={},_=n.getContextAttributes();let L=null,E=null;const D=[],T=[],l=new Oe;let p=null,k=null;const w=new qn;w.viewport=new wt;const I=new qn;I.viewport=new wt;const B=[w,I],q=new mo;let P=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let pe=D[X];return pe===void 0&&(pe=new Zn,D[X]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(X){let pe=D[X];return pe===void 0&&(pe=new Zn,D[X]=pe),pe.getGripSpace()},this.getHand=function(X){let pe=D[X];return pe===void 0&&(pe=new Zn,D[X]=pe),pe.getHandSpace()};function Z(X){const pe=T.indexOf(X.inputSource);if(pe===-1)return;const _e=D[pe];_e!==void 0&&(_e.update(X.inputSource,X.frame,m||o),_e.dispatchEvent({type:X.type,data:X.inputSource}))}function z(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",se);for(let X=0;X<D.length;X++){const pe=T[X];pe!==null&&(T[X]=null,D[X].disconnect(pe))}P=null,j=null,u.reset();for(const X in f)delete f[X];if(t.setRenderTarget(L),g=null,S=null,C=null,r=null,E=null,Le.stop(),i.isPresenting=!1,t.setPixelRatio(p),t.setSize(l.width,l.height,!1),k!==null){const X=k.camera;X.fov=k.fov,X.zoom=k.zoom,X.updateProjectionMatrix(),k=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){a=X,i.isPresenting===!0&&Ye("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){d=X,i.isPresenting===!0&&Ye("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||o},this.setReferenceSpace=function(X){m=X},this.getBaseLayer=function(){return S!==null?S:g},this.getBinding=function(){return C===null&&U&&(C=new XRWebGLBinding(r,n)),C},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(L=t.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",z),r.addEventListener("inputsourceschange",se),_.xrCompatible!==!0&&await n.makeXRCompatible(),p=t.getPixelRatio(),t.getSize(l),U&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,xe=null,ue=null;_.depth&&(ue=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,_e=_.stencil?jt:xn,xe=_.stencil?rn:an);const De={colorFormat:n.RGBA8,depthFormat:ue,scaleFactor:a};C=this.getBinding(),S=C.createProjectionLayer(De),r.updateRenderState({layers:[S]}),t.setPixelRatio(1),t.setSize(S.textureWidth,S.textureHeight,!1),E=new Tt(S.textureWidth,S.textureHeight,{format:Xt,type:yt,depthTexture:new fn(S.textureWidth,S.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1,storeMultisampledDepthBuffer:S.ignoreDepthValues===!1,storeMultisampledStencilBuffer:S.ignoreDepthValues===!1})}else{const _e={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:a};g=new XRWebGLLayer(r,n,_e),r.updateRenderState({baseLayer:g}),t.setPixelRatio(1),t.setSize(g.framebufferWidth,g.framebufferHeight,!1),E=new Tt(g.framebufferWidth,g.framebufferHeight,{format:Xt,type:yt,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(R),m=null,o=await r.requestReferenceSpace(d),Le.setContext(r),Le.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return u.getDepthTexture()};function se(X){for(let pe=0;pe<X.removed.length;pe++){const _e=X.removed[pe],xe=T.indexOf(_e);xe>=0&&(T[xe]=null,D[xe].disconnect(_e))}for(let pe=0;pe<X.added.length;pe++){const _e=X.added[pe];let xe=T.indexOf(_e);if(xe===-1){for(let De=0;De<D.length;De++)if(De>=T.length){T.push(_e),xe=De;break}else if(T[De]===null){T[De]=_e,xe=De;break}if(xe===-1)break}const ue=D[xe];ue&&ue.connect(_e)}}function W(X,pe){pe===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(pe.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let pe=X.near,_e=X.far;u.texture!==null&&(u.depthNear>0&&(pe=u.depthNear),u.depthFar>0&&(_e=u.depthFar)),q.near=I.near=w.near=pe,q.far=I.far=w.far=_e,(P!==q.near||j!==q.far)&&(r.updateRenderState({depthNear:q.near,depthFar:q.far}),P=q.near,j=q.far),q.layers.mask=X.layers.mask|6,w.layers.mask=q.layers.mask&-5,I.layers.mask=q.layers.mask&-3;const xe=X.parent,ue=q.cameras;W(q,xe);for(let De=0;De<ue.length;De++)W(ue[De],xe);q.projectionMatrix.copy(w.projectionMatrix),q.projectionMatrixInverse.copy(w.projectionMatrixInverse),k===null&&X.isPerspectiveCamera&&(k={camera:X,fov:X.fov,zoom:X.zoom}),$(X,q,xe)};function $(X,pe,_e){_e===null?X.matrix.copy(pe.matrixWorld):(X.matrix.copy(_e.matrixWorld),X.matrix.invert(),X.matrix.multiply(pe.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(pe.projectionMatrix),X.projectionMatrixInverse.copy(pe.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=_o*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(S===null&&g===null))return R},this.setFoveation=function(X){R=X,S!==null&&(S.fixedFoveation=X),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=X)},this.hasDepthSensing=function(){return u.texture!==null},this.getDepthSensingMesh=function(){return u.getMesh(q)},this.getCameraTexture=function(X){return f[X]};let ee=null;function Me(X,pe){if(b=pe.getViewerPose(m||o),x=pe,b!==null){const _e=b.views;g!==null&&(t.setRenderTargetFramebuffer(E,g.framebuffer),t.setRenderTarget(E));let xe=!1;_e.length!==q.cameras.length&&(q.cameras.length=0,xe=!0);for(let Ce=0;Ce<_e.length;Ce++){const We=_e[Ce];let Ve=null;if(g!==null)Ve=g.getViewport(We);else{const st=C.getViewSubImage(S,We);Ve=st.viewport,Ce===0&&(t.setRenderTargetTextures(E,st.colorTexture,st.depthStencilTexture),t.setRenderTarget(E))}let Ne=B[Ce];Ne===void 0&&(Ne=new qn,Ne.layers.enable(Ce),Ne.viewport=new wt,B[Ce]=Ne),Ne.matrix.fromArray(We.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(We.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Ve.x,Ve.y,Ve.width,Ve.height),Ce===0&&(q.matrix.copy(Ne.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),xe===!0&&q.cameras.push(Ne)}const ue=r.enabledFeatures;if(ue&&ue.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&U){C=i.getBinding();const Ce=C.getDepthInformation(_e[0]);Ce&&Ce.isValid&&Ce.texture&&u.init(Ce,r.renderState)}if(ue&&ue.includes("camera-access")&&U){t.state.unbindTexture(),C=i.getBinding();for(let Ce=0;Ce<_e.length;Ce++){const We=_e[Ce].camera;if(We){let Ve=f[We];Ve||(Ve=new or,f[We]=Ve);const Ne=C.getCameraImage(We);Ve.sourceTexture=Ne}}}}for(let _e=0;_e<D.length;_e++){const xe=T[_e],ue=D[_e];xe!==null&&ue!==void 0&&ue.update(xe,pe,m||o)}ee&&ee(X,pe),pe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:pe}),x=null}const Le=new gr;Le.setAnimationLoop(Me),this.setAnimationLoop=function(X){ee=X},this.dispose=function(){}}}const Vu=new Bt,Pr=new Ge;Pr.set(-1,0,0,0,1,0,0,0,1);function zu(e,t){function n(u,f){u.matrixAutoUpdate===!0&&u.updateMatrix(),f.value.copy(u.matrix)}function i(u,f){f.color.getRGB(u.fogColor.value,ar(e)),f.isFog?(u.fogNear.value=f.near,u.fogFar.value=f.far):f.isFogExp2&&(u.fogDensity.value=f.density)}function r(u,f,_,L,E){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?a(u,f):f.isMeshLambertMaterial?(a(u,f),f.envMap&&(u.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(a(u,f),C(u,f)):f.isMeshPhongMaterial?(a(u,f),b(u,f),f.envMap&&(u.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(a(u,f),S(u,f),f.isMeshPhysicalMaterial&&g(u,f,E)):f.isMeshMatcapMaterial?(a(u,f),x(u,f)):f.isMeshDepthMaterial?a(u,f):f.isMeshDistanceMaterial?(a(u,f),U(u,f)):f.isMeshNormalMaterial?a(u,f):f.isLineBasicMaterial?(o(u,f),f.isLineDashedMaterial&&d(u,f)):f.isPointsMaterial?R(u,f,_,L):f.isSpriteMaterial?m(u,f):f.isShadowMaterial?(u.color.value.copy(f.color),u.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(u,f){u.opacity.value=f.opacity,f.color&&u.diffuse.value.copy(f.color),f.emissive&&u.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(u.map.value=f.map,n(f.map,u.mapTransform)),f.alphaMap&&(u.alphaMap.value=f.alphaMap,n(f.alphaMap,u.alphaMapTransform)),f.bumpMap&&(u.bumpMap.value=f.bumpMap,n(f.bumpMap,u.bumpMapTransform),u.bumpScale.value=f.bumpScale,f.side===Lt&&(u.bumpScale.value*=-1)),f.normalMap&&(u.normalMap.value=f.normalMap,n(f.normalMap,u.normalMapTransform),u.normalScale.value.copy(f.normalScale),f.side===Lt&&u.normalScale.value.negate()),f.displacementMap&&(u.displacementMap.value=f.displacementMap,n(f.displacementMap,u.displacementMapTransform),u.displacementScale.value=f.displacementScale,u.displacementBias.value=f.displacementBias),f.emissiveMap&&(u.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,u.emissiveMapTransform)),f.specularMap&&(u.specularMap.value=f.specularMap,n(f.specularMap,u.specularMapTransform)),f.alphaTest>0&&(u.alphaTest.value=f.alphaTest);const _=t.get(f),L=_.envMap,E=_.envMapRotation;L&&(u.envMap.value=L,u.envMapRotation.value.setFromMatrix4(Vu.makeRotationFromEuler(E)).transpose(),L.isCubeTexture&&L.isRenderTargetTexture===!1&&u.envMapRotation.value.premultiply(Pr),u.reflectivity.value=f.reflectivity,u.ior.value=f.ior,u.refractionRatio.value=f.refractionRatio),f.lightMap&&(u.lightMap.value=f.lightMap,u.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,u.lightMapTransform)),f.aoMap&&(u.aoMap.value=f.aoMap,u.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,u.aoMapTransform))}function o(u,f){u.diffuse.value.copy(f.color),u.opacity.value=f.opacity,f.map&&(u.map.value=f.map,n(f.map,u.mapTransform))}function d(u,f){u.dashSize.value=f.dashSize,u.totalSize.value=f.dashSize+f.gapSize,u.scale.value=f.scale}function R(u,f,_,L){u.diffuse.value.copy(f.color),u.opacity.value=f.opacity,u.size.value=f.size*_,u.scale.value=L*.5,f.map&&(u.map.value=f.map,n(f.map,u.uvTransform)),f.alphaMap&&(u.alphaMap.value=f.alphaMap,n(f.alphaMap,u.alphaMapTransform)),f.alphaTest>0&&(u.alphaTest.value=f.alphaTest)}function m(u,f){u.diffuse.value.copy(f.color),u.opacity.value=f.opacity,u.rotation.value=f.rotation,f.map&&(u.map.value=f.map,n(f.map,u.mapTransform)),f.alphaMap&&(u.alphaMap.value=f.alphaMap,n(f.alphaMap,u.alphaMapTransform)),f.alphaTest>0&&(u.alphaTest.value=f.alphaTest)}function b(u,f){u.specular.value.copy(f.specular),u.shininess.value=Math.max(f.shininess,1e-4)}function C(u,f){f.gradientMap&&(u.gradientMap.value=f.gradientMap)}function S(u,f){u.metalness.value=f.metalness,f.metalnessMap&&(u.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,u.metalnessMapTransform)),u.roughness.value=f.roughness,f.roughnessMap&&(u.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,u.roughnessMapTransform)),f.envMap&&(u.envMapIntensity.value=f.envMapIntensity)}function g(u,f,_){u.ior.value=f.ior,f.diffuseRoughness>0&&(u.diffuseRoughness.value=f.diffuseRoughness,f.diffuseRoughnessMap&&(u.diffuseRoughnessMap.value=f.diffuseRoughnessMap,n(f.diffuseRoughnessMap,u.diffuseRoughnessMapTransform))),f.sheen>0&&(u.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),u.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(u.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,u.sheenColorMapTransform)),f.sheenRoughnessMap&&(u.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,u.sheenRoughnessMapTransform))),f.clearcoat>0&&(u.clearcoat.value=f.clearcoat,u.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(u.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,u.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(u.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,u.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(u.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,u.clearcoatNormalMapTransform),u.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Lt&&u.clearcoatNormalScale.value.negate())),f.dispersion>0&&(u.dispersion.value=f.dispersion),f.retroreflectivity>0&&(u.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(u.iridescence.value=f.iridescence,u.iridescenceIOR.value=f.iridescenceIOR,u.iridescenceThicknessMinimum.value=f.iridescenceThicknessMinimum,u.iridescenceThicknessMaximum.value=f.iridescenceThicknessMaximum,f.iridescenceMap&&(u.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,u.iridescenceMapTransform)),f.iridescenceThicknessMap&&(u.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,u.iridescenceThicknessMapTransform))),f.transmission>0&&(u.transmission.value=f.transmission,u.transmissionSamplerMap.value=_.texture,u.transmissionSamplerSize.value.set(_.width,_.height),f.transmissionMap&&(u.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,u.transmissionMapTransform)),u.thickness.value=f.thickness,f.thicknessMap&&(u.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,u.thicknessMapTransform)),u.attenuationDistance.value=f.attenuationDistance,u.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(u.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(u.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,u.anisotropyMapTransform))),u.specularIntensity.value=f.specularIntensity,u.specularColor.value.copy(f.specularColor),f.specularColorMap&&(u.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,u.specularColorMapTransform)),f.specularIntensityMap&&(u.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,u.specularIntensityMapTransform))}function x(u,f){f.matcap&&(u.matcap.value=f.matcap)}function U(u,f){const _=t.get(f).light;u.referencePosition.value.setFromMatrixPosition(_.matrixWorld),u.nearDistance.value=_.shadow.camera.near,u.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function ku(e,t,n,i){let r={},a={};function o(_,L){const E=L.program;i.uniformBlockBinding(_,E,r[_.id])}function d(_,L){let E=r[_.id];E===void 0&&(x(_),E=R(_),r[_.id]=E,_.addEventListener("dispose",u));const D=L.program;i.updateUBOMapping(_,D);const T=t.render.frame;a[_.id]!==T&&(m(_),a[_.id]=T)}function R(_){const L=e.createBuffer(),E=_.__size,D=_.usage;return e.bindBuffer(e.UNIFORM_BUFFER,L),e.bufferData(e.UNIFORM_BUFFER,E,D),e.bindBuffer(e.UNIFORM_BUFFER,null),L}function m(_){const L=r[_.id],E=_.uniforms,D=_.__cache;e.bindBuffer(e.UNIFORM_BUFFER,L);for(let T=0,l=E.length;T<l;T++){const p=E[T];if(Array.isArray(p))for(let k=0,w=p.length;k<w;k++)b(p[k],T,k,D);else b(p,T,0,D)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function b(_,L,E,D){if(S(_,L,E,D)===!0){const T=_.__offset,l=_.value;if(Array.isArray(l)){let p=0;for(let k=0;k<l.length;k++){const w=l[k],I=U(w,!0);C(w,_.__data,p),p+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else C(l,_.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,T,_.__data)}}function C(_,L,E){typeof _=="number"||typeof _=="boolean"?L[E]=_:_.isMatrix3?(L[E]=_.elements[0],L[E+1]=_.elements[1],L[E+2]=_.elements[2],L[E+3]=0,L[E+4]=_.elements[3],L[E+5]=_.elements[4],L[E+6]=_.elements[5],L[E+7]=0,L[E+8]=_.elements[6],L[E+9]=_.elements[7],L[E+10]=_.elements[8],L[E+11]=0):ArrayBuffer.isView(_)?L.set(_.subarray(0,L.length-E),E):_.toArray(L,E)}function S(_,L,E,D){const T=_.value,l=L+"_"+E;if(Array.isArray(T)){D[l]===void 0&&(D[l]=[]);const p=D[l];let k=!1;for(let w=0;w<T.length;w++)g(T[w],p,w)===!0&&(k=!0);return k}return g(T,D,l)}function g(_,L,E){if(L[E]===void 0)return typeof _=="number"||typeof _=="boolean"?L[E]=_:ArrayBuffer.isView(_)?L[E]=_.slice():L[E]=_.clone(),!0;{const D=L[E];if(typeof _=="number"||typeof _=="boolean"){if(D!==_)return L[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(D.equals(_)===!1)return D.copy(_),!0}}return!1}function x(_){const L=_.uniforms;let E=0;const D=16;for(let l=0,p=L.length;l<p;l++){const k=Array.isArray(L[l])?L[l]:[L[l]];for(let w=0,I=k.length;w<I;w++){const B=k[w],q=Array.isArray(B.value)?B.value:[B.value],P=Array.isArray(L[l])||Array.isArray(B.value);let j=E;for(let z=0,se=q.length;z<se;z++){const W=q[z],$=U(W,P),ee=E%D,Me=ee%$.boundary,Le=ee+Me;E+=Me,Le!==0&&D-Le<$.storage&&(E+=D-Le),z===0&&(j=E),E+=$.storage}const Z=B.type==="int"?Int32Array:B.type==="uint"?Uint32Array:Float32Array;B.__data=new Z((E-j)/Float32Array.BYTES_PER_ELEMENT),B.__offset=j}}const T=E%D;return T>0&&(E+=D-T),_.__size=E,_.__cache={},this}function U(_,L){const E={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(E.boundary=4,E.storage=4):_.isVector2?(E.boundary=8,E.storage=8):_.isVector3||_.isColor?(E.boundary=16,E.storage=12):_.isVector4?(E.boundary=16,E.storage=16):_.isMatrix3?(E.boundary=16,E.storage=48):_.isMatrix4?(E.boundary=16,E.storage=64):_.isTexture?Ye("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(E.boundary=16,E.storage=_.byteLength):Ye("WebGLRenderer: Unsupported uniform value type.",_),L===!0&&(E.boundary=16,E.storage=Math.ceil(E.storage/16)*16),E}function u(_){const L=_.target;L.removeEventListener("dispose",u),e.deleteBuffer(r[L.id]),delete r[L.id],delete a[L.id]}function f(){for(const _ in r)e.deleteBuffer(r[_]);r={},a={}}return{bind:o,update:d,dispose:f}}const Wu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ot=null;function Xu(){return Ot===null&&(Ot=new mi(Wu,16,16,cn,bt),Ot.name="DFG_LUT",Ot.minFilter=It,Ot.magFilter=It,Ot.wrapS=ci,Ot.wrapT=ci,Ot.generateMipmaps=!1,Ot.needsUpdate=!0),Ot}class _d{constructor(t={}){const{canvas:n=Or(),context:i=null,depth:r=!0,stencil:a=!1,alpha:o=!1,antialias:d=!1,premultipliedAlpha:R=!0,preserveDrawingBuffer:m=!1,powerPreference:b="default",failIfMajorPerformanceCaveat:C=!1,reversedDepthBuffer:S=!1,outputBufferType:g=yt}=t;this.isWebGLRenderer=!0;let x;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=i.getContextAttributes().alpha}else x=o;const U=g,u=new Set([$a,Qa,Ja]),f=new Set([yt,an,Gn,rn,er,tr]),_=new Uint32Array(4),L=new Int32Array(4),E={textures:[],min:[],max:[],resolution:[]};let D=null,T=null;const l=[],p=[];let k=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Yt,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let I=!1,B=null,q=null,P=null,j=null;this._outputColorSpace=Fr;let Z=0,z=0,se=null,W=-1,$=null;const ee=new wt,Me=new wt;let Le=null;const X=new Ke(0);let pe=0,_e=n.width,xe=n.height,ue=1,De=null,nt=null;const Ce=new wt(0,0,_e,xe),We=new wt(0,0,_e,xe);let Ve=!1;const Ne=new za,st=new Gr;let it=!1,dt=!1;const je=new Bt,Pt=new be,ot=new wt,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let vt=!1;function St(){return se===null?ue:1}let A=i;function Et(c,M){return n.getContext(c,M)}let qe,Ze,re,et,Te,Pe,h,s,N,Q,K,te,ae,G,V,ne,v,Y,H,le,ie,oe,Re;try{const c={alpha:!0,depth:r,stencil:a,antialias:d,premultipliedAlpha:R,preserveDrawingBuffer:m,powerPreference:b,failIfMajorPerformanceCaveat:C};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Br}`),n.addEventListener("webglcontextlost",Ae,!1),n.addEventListener("webglcontextrestored",Ue,!1),n.addEventListener("webglcontextcreationerror",de,!1),A===null){const M="webgl2";if(A=Et(M,c),A===null)throw Et(M)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ye()}catch(c){throw n.removeEventListener("webglcontextlost",Ae,!1),n.removeEventListener("webglcontextrestored",Ue,!1),n.removeEventListener("webglcontextcreationerror",de,!1),tt("WebGLRenderer: "+c.message),c}function ye(){qe=new qc(A),qe.init(),ie=new Ou(A,qe),Ze=new Fc(A,qe,t,ie),re=new yu(A,qe),Ze.reversedDepthBuffer&&S&&re.buffers.depth.setReversed(!0),q=A.createFramebuffer(),P=A.createFramebuffer(),j=A.createFramebuffer(),et=new $c(A),Te=new Eu,Pe=new Iu(A,qe,re,Te,Ze,ie,et),h=new Kc(w),s=new Jo(A),oe=new Ic(A,s),N=new Zc(A,s,et,oe),Q=new Jc(A,N,s,oe,et),Y=new Qc(A,Ze,Pe),V=new Bc(Te),K=new Su(w,h,qe,Ze,oe,V),te=new zu(w,Te),ae=new xu,G=new Cu(qe),v=new yc(w,h,re,Q,x,R),ne=new Nu(w,Q,Ze),Re=new ku(A,et,Ze,re),H=new Oc(A,qe,et),le=new jc(A,qe,et),et.programs=K.programs,w.capabilities=Ze,w.extensions=qe,w.properties=Te,w.renderLists=ae,w.shadowMap=ne,w.state=re,w.info=et}U!==yt&&(k=new tf(U,n.width,n.height,d,r,a));const J=new Hu(w,A);this.xr=J,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const c=qe.get("WEBGL_lose_context");c&&c.loseContext()},this.forceContextRestore=function(){const c=qe.get("WEBGL_lose_context");c&&c.restoreContext()},this.getPixelRatio=function(){return ue},this.setPixelRatio=function(c){c!==void 0&&(ue=c,this.setSize(_e,xe,!1))},this.getSize=function(c){return c.set(_e,xe)},this.setSize=function(c,M,F=!0){if(J.isPresenting){Ye("WebGLRenderer: Can't change size while VR device is presenting.");return}_e=c,xe=M,n.width=Math.floor(c*ue),n.height=Math.floor(M*ue),F===!0&&(n.style.width=c+"px",n.style.height=M+"px"),k!==null&&k.setSize(n.width,n.height),this.setViewport(0,0,c,M)},this.getDrawingBufferSize=function(c){return c.set(_e*ue,xe*ue).floor()},this.setDrawingBufferSize=function(c,M,F){_e=c,xe=M,ue=F,n.width=Math.floor(c*F),n.height=Math.floor(M*F),this.setViewport(0,0,c,M)},this.setEffects=function(c){if(U===yt){tt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(c){for(let M=0;M<c.length;M++)if(c[M].isOutputPass===!0){Ye("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}k.setEffects(c||[])},this.getCurrentViewport=function(c){return c.copy(ee)},this.getViewport=function(c){return c.copy(Ce)},this.setViewport=function(c,M,F,y){c.isVector4?Ce.set(c.x,c.y,c.z,c.w):Ce.set(c,M,F,y),re.viewport(ee.copy(Ce).multiplyScalar(St()).round())},this.getScissor=function(c){return c.copy(We)},this.setScissor=function(c,M,F,y){c.isVector4?We.set(c.x,c.y,c.z,c.w):We.set(c,M,F,y),re.scissor(Me.copy(We).multiplyScalar(St()).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(c){re.setScissorTest(Ve=c)},this.setOpaqueSort=function(c){De=c},this.setTransparentSort=function(c){nt=c},this.getClearColor=function(c){return c.copy(v.getClearColor())},this.setClearColor=function(){v.setClearColor(...arguments)},this.getClearAlpha=function(){return v.getClearAlpha()},this.setClearAlpha=function(){v.setClearAlpha(...arguments)},this.clear=function(c=!0,M=!0,F=!0){let y=0;if(c){let O=!1;if(se!==null){const fe=se.texture.format;O=u.has(fe)}if(O){const fe=se.texture.type,ge=f.has(fe),ce=v.getClearColor(),me=v.getClearAlpha(),Ee=ce.r,we=ce.g,Fe=ce.b;ge?(_[0]=Ee,_[1]=we,_[2]=Fe,_[3]=me,A.clearBufferuiv(A.COLOR,0,_)):(L[0]=Ee,L[1]=we,L[2]=Fe,L[3]=me,A.clearBufferiv(A.COLOR,0,L))}else y|=A.COLOR_BUFFER_BIT}M&&(y|=A.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),F&&(y|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),y!==0&&A.clear(y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(c){c.setRenderer(this),B=c},this.dispose=function(){n.removeEventListener("webglcontextlost",Ae,!1),n.removeEventListener("webglcontextrestored",Ue,!1),n.removeEventListener("webglcontextcreationerror",de,!1),v.dispose(),ae.dispose(),G.dispose(),Pe.dispose(),Te.dispose(),h.dispose(),Q.dispose(),N.dispose(),oe.dispose(),Re.dispose(),K.dispose(),J.dispose(),J.removeEventListener("sessionstart",Ei),J.removeEventListener("sessionend",Mi),Qt.stop()};function Ae(c){c.preventDefault(),wi("WebGLRenderer: Context Lost."),I=!0}function Ue(){wi("WebGLRenderer: Context Restored."),I=!1;const c=et.autoReset,M=ne.enabled,F=ne.autoUpdate,y=ne.needsUpdate,O=ne.type;ye(),et.autoReset=c,ne.enabled=M,ne.autoUpdate=F,ne.needsUpdate=y,ne.type=O}function de(c){tt("WebGLRenderer: A WebGL context could not be created. Reason: ",c.statusMessage)}function Xe(c){const M=c.target;M.removeEventListener("dispose",Xe),ht(M)}function ht(c){Kt(c),Te.remove(c)}function Kt(c){const M=Te.get(c).programs;M!==void 0&&(M.forEach(function(F){K.releaseProgram(F)}),c.isShaderMaterial&&K.releaseShaderCache(c))}this.renderBufferDirect=function(c,M,F,y,O,fe){M===null&&(M=gt);const ge=O.isMesh&&O.matrixWorld.determinantAffine()<0,ce=Nr(c,M,F,y,O);re.setMaterial(y,ge);let me=F.index,Ee=1;if(y.wireframe===!0){if(me=N.getWireframeAttribute(F),me===void 0)return;Ee=2}const we=F.drawRange,Fe=F.attributes.position;let ve=we.start*Ee,Be=(we.start+we.count)*Ee;fe!==null&&(ve=Math.max(ve,fe.start*Ee),Be=Math.min(Be,(fe.start+fe.count)*Ee)),me!==null?(ve=Math.max(ve,0),Be=Math.min(Be,me.count)):Fe!=null&&(ve=Math.max(ve,0),Be=Math.min(Be,Fe.count));const lt=Be-ve;if(lt<0||lt===1/0)return;oe.setup(O,y,ce,F,me);let Qe,$e=H;if(me!==null&&(Qe=s.get(me),$e=le,$e.setIndex(Qe)),O.isMesh)y.wireframe===!0?(re.setLineWidth(y.wireframeLinewidth*St()),$e.setMode(A.LINES)):$e.setMode(A.TRIANGLES);else if(O.isLine){let Mt=y.linewidth;Mt===void 0&&(Mt=1),re.setLineWidth(Mt*St()),O.isLineSegments?$e.setMode(A.LINES):O.isLineLoop?$e.setMode(A.LINE_LOOP):$e.setMode(A.LINE_STRIP)}else O.isPoints?$e.setMode(A.POINTS):O.isSprite&&$e.setMode(A.TRIANGLES);if(O.isBatchedMesh)if(qe.get("WEBGL_multi_draw"))$e.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Mt=O._multiDrawStarts,Se=O._multiDrawCounts,Rt=O._multiDrawCount,ze=me?s.get(me).bytesPerElement:1,Jt=Te.get(y).currentProgram.getUniforms();for(let xt=0;xt<Rt;xt++)Jt.setValue(A,"_gl_DrawID",xt),$e.render(Mt[xt]/ze,Se[xt])}else if(O.isInstancedMesh)$e.renderInstances(ve,lt,O.count);else if(F.isInstancedBufferGeometry){const Mt=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,Se=Math.min(F.instanceCount,Mt);$e.renderInstances(ve,lt,Se)}else $e.render(ve,lt)};function Si(c,M,F,y){B!==null&&c.isNodeMaterial&&B.setObject(y,c),it===!0&&V.setState(c,F,!1),c.transparent===!0&&c.side===Vt&&c.forceSinglePass===!1?(c.side=Lt,c.needsUpdate=!0,hn(c,M,y),c.side=Sn,c.needsUpdate=!0,hn(c,M,y),c.side=Vt):hn(c,M,y)}this.compile=function(c,M,F=null){F===null&&(F=c),B!==null&&B.renderStart(c,M,F),T=G.get(F),T.init(M),p.push(T),F.traverseVisible(function(O){O.isLight&&O.layers.test(M.layers)&&(T.pushLight(O),O.castShadow&&T.pushShadow(O))}),c!==F&&c.traverseVisible(function(O){O.isLight&&O.layers.test(M.layers)&&(T.pushLight(O),O.castShadow&&T.pushShadow(O))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),dt=this.localClippingEnabled,it=V.init(this.clippingPlanes,dt),it===!0&&V.setGlobalState(this.clippingPlanes,M),B!==null&&ne.render(T.state.shadowsArray,F,M);const y=new Set;return c.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const fe=O.material;if(fe)if(Array.isArray(fe))for(let ge=0;ge<fe.length;ge++){const ce=fe[ge];Si(ce,F,M,O),y.add(ce)}else Si(fe,F,M,O),y.add(fe)}),T=p.pop(),B!==null&&B.renderEnd(),y},this.compileAsync=function(c,M,F=null){const y=this.compile(c,M,F);return new Promise(O=>{function fe(){if(y.forEach(function(ge){const me=Te.get(ge).currentProgram;(me===void 0||me.isReady())&&y.delete(ge)}),y.size===0){O(c);return}setTimeout(fe,10)}qe.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Xn=null;function Lr(c){Xn&&Xn(c)}function Ei(){Qt.stop()}function Mi(){Qt.start()}const Qt=new gr;Qt.setAnimationLoop(Lr),typeof self<"u"&&Qt.setContext(self),this.setAnimationLoop=function(c){Xn=c,J.setAnimationLoop(c),c===null?Qt.stop():Qt.start()},J.addEventListener("sessionstart",Ei),J.addEventListener("sessionend",Mi),this.render=function(c,M){if(M!==void 0&&M.isCamera!==!0){tt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;B!==null&&B.renderStart(c,M);const F=J.enabled===!0&&J.isPresenting===!0,y=k!==null&&(se===null||F)&&k.begin(w,se);if(c.matrixWorldAutoUpdate===!0&&c.updateMatrixWorld(),M.parent===null&&M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(J.cameraAutoUpdate===!0&&J.updateCamera(M),M=J.getCamera()),c.isScene===!0&&c.onBeforeRender(w,c,M,se),T=G.get(c,p.length),T.init(M),T.state.textureUnits=Pe.getTextureUnits(),p.push(T),je.multiplyMatrices(M.projectionMatrix,M.matrixWorldInverse),M.isArrayCamera?st.setFromArrayCamera(M):Ne.setFromProjectionMatrix(je,Li,M.reversedDepth),dt=this.localClippingEnabled,it=V.init(this.clippingPlanes,dt),D=ae.get(c,l.length),D.init(),l.push(D),this.info.render.frame++,J.enabled===!0&&J.isPresenting===!0){const ge=w.xr.getDepthSensingMesh();ge!==null&&Yn(ge,M,-1/0,w.sortObjects)}Yn(c,M,0,w.sortObjects),D.finish(),B!==null&&B.updateLights(T.state.lightsArray),w.sortObjects===!0&&D.sort(De,nt),vt=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,vt&&v.addToRenderList(D,c),this.info.autoReset===!0&&this.info.reset(),it===!0&&V.beginShadows();const O=T.state.shadowsArray;if(ne.render(O,c,M),it===!0&&V.endShadows(),(y&&k.hasRenderPass())===!1){const ge=D.opaque,ce=D.transmissive;if(T.setupLights(),M.isArrayCamera){const me=M.cameras;if(ce.length>0)for(let Ee=0,we=me.length;Ee<we;Ee++){const Fe=me[Ee];Ti(ge,ce,c,Fe)}vt&&v.render(c);for(let Ee=0,we=me.length;Ee<we;Ee++){const Fe=me[Ee];xi(D,c,Fe,Fe.viewport)}}else ce.length>0&&Ti(ge,ce,c,M),vt&&v.render(c),xi(D,c,M)}se!==null&&z===0&&(Pe.updateMultisampleRenderTarget(se),Pe.updateRenderTargetMipmap(se)),y&&k.end(w),c.isScene===!0&&c.onAfterRender(w,c,M),oe.resetDefaultState(),W=-1,$=null,p.pop(),p.length>0?(T=p[p.length-1],Pe.setTextureUnits(T.state.textureUnits),it===!0&&V.setGlobalState(w.clippingPlanes,T.state.camera)):T=null,l.pop(),l.length>0?D=l[l.length-1]:D=null,B!==null&&B.renderEnd()};function Yn(c,M,F,y){if(c.visible===!1)return;if(c.layers.test(M.layers)){if(c.isGroup)F=c.renderOrder;else if(c.isLOD)c.autoUpdate===!0&&c.update(M);else if(c.isLight)T.pushLight(c),c.castShadow&&T.pushShadow(c);else if(c.isSprite){const ge=M.isArrayCamera?st:Ne;if(!c.frustumCulled||c.intersectsFrustum(ge)){y&&ot.setFromMatrixPosition(c.matrixWorld).applyMatrix4(je);const ce=Q.update(c),me=c.material;me.visible&&D.push(c,ce,me,F,ot.z,null,M)}}else if(c.isMesh||c.isLine||c.isPoints){const ge=M.isArrayCamera?st:Ne;if(!c.frustumCulled||c.intersectsFrustum(ge)){const ce=Q.update(c),me=c.material;if(y&&(c.boundingSphere!==void 0?(c.boundingSphere===null&&c.computeBoundingSphere(),ot.copy(c.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),ot.copy(ce.boundingSphere.center)),ot.applyMatrix4(c.matrixWorld).applyMatrix4(je)),Array.isArray(me)){const Ee=ce.groups;for(let we=0,Fe=Ee.length;we<Fe;we++){const ve=Ee[we],Be=me[ve.materialIndex];Be&&Be.visible&&D.push(c,ce,Be,F,ot.z,ve,M)}}else me.visible&&D.push(c,ce,me,F,ot.z,null,M)}}}const fe=c.children;for(let ge=0,ce=fe.length;ge<ce;ge++)Yn(fe[ge],M,F,y)}function xi(c,M,F,y){const{opaque:O,transmissive:fe,transparent:ge}=c;T.setupLightsView(F),it===!0&&V.setGlobalState(w.clippingPlanes,F),y&&re.viewport(ee.copy(y)),O.length>0&&An(O,M,F),fe.length>0&&An(fe,M,F),ge.length>0&&An(ge,M,F),re.buffers.depth.setTest(!0),re.buffers.depth.setMask(!0),re.buffers.color.setMask(!0),re.setPolygonOffset(!1)}function Ti(c,M,F,y){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[y.id]===void 0){const ve=qe.has("EXT_color_buffer_half_float")||qe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[y.id]=new Tt(1,1,{generateMipmaps:!0,type:ve?bt:yt,minFilter:tn,samples:Math.max(4,Ze.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}const fe=T.state.transmissionRenderTarget[y.id],ge=y.viewport||ee;fe.setSize(ge.z*w.transmissionResolutionScale,ge.w*w.transmissionResolutionScale);const ce=w.getRenderTarget(),me=w.getActiveCubeFace(),Ee=w.getActiveMipmapLevel();w.setRenderTarget(fe),w.getClearColor(X),pe=w.getClearAlpha(),pe<1&&w.setClearColor(16777215,.5),w.clear(),vt&&v.render(F);const we=w.toneMapping;w.toneMapping=Yt;const Fe=y.viewport;if(y.viewport!==void 0&&(y.viewport=void 0),T.setupLightsView(y),it===!0&&V.setGlobalState(w.clippingPlanes,y),An(c,F,y),Pe.updateMultisampleRenderTarget(fe),Pe.updateRenderTargetMipmap(fe),qe.has("WEBGL_multisampled_render_to_texture")===!1){let ve=!1;for(let Be=0,lt=M.length;Be<lt;Be++){const Qe=M[Be],{object:$e,geometry:Mt,material:Se,group:Rt}=Qe;if(Se.side===Vt&&$e.layers.test(y.layers)){const ze=Se.side;Se.side=Lt,Se.needsUpdate=!0,Ri($e,F,y,Mt,Se,Rt),Se.side=ze,Se.needsUpdate=!0,ve=!0}}ve===!0&&(Pe.updateMultisampleRenderTarget(fe),Pe.updateRenderTargetMipmap(fe))}w.setRenderTarget(ce,me,Ee),w.setClearColor(X,pe),Fe!==void 0&&(y.viewport=Fe),w.toneMapping=we}function An(c,M,F){const y=M.isScene===!0?M.overrideMaterial:null;for(let O=0,fe=c.length;O<fe;O++){const ge=c[O],{object:ce,geometry:me,group:Ee}=ge;let we=ge.material;we.allowOverride===!0&&y!==null&&(we=y),ce.layers.test(F.layers)&&Ri(ce,M,F,me,we,Ee)}}function Ri(c,M,F,y,O,fe){B!==null&&O.isNodeMaterial&&B.setObject(c,O),c.onBeforeRender(w,M,F,y,O,fe),c.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,c.matrixWorld),c.normalMatrix.getNormalMatrix(c.modelViewMatrix),O.onBeforeRender(w,M,F,y,c,fe),O.transparent===!0&&O.side===Vt&&O.forceSinglePass===!1?(O.side=Lt,O.needsUpdate=!0,w.renderBufferDirect(F,M,y,O,c,fe),O.side=Sn,O.needsUpdate=!0,w.renderBufferDirect(F,M,y,O,c,fe),O.side=Vt):w.renderBufferDirect(F,M,y,O,c,fe),c.onAfterRender(w,M,F,y,O,fe)}function Ai(c){let M=0;for(const F of c)F.texture!==null&&M++;return M}function hn(c,M,F){M.isScene!==!0&&(M=gt);const y=Te.get(c),O=T.state.lights,fe=T.state.shadowsArray,ge=O.state.version,ce=K.getParameters(c,O.state,fe,M,F,T.state.lightProbeGridArray),me=K.getProgramCacheKey(ce);let Ee=y.programs;y.environment=c.isMeshStandardMaterial||c.isMeshLambertMaterial||c.isMeshPhongMaterial?M.environment:null,y.fog=M.fog;const we=c.isMeshStandardMaterial||c.isMeshLambertMaterial&&!c.envMap||c.isMeshPhongMaterial&&!c.envMap;y.envMap=h.get(c.envMap||y.environment,we),y.envMapRotation=y.environment!==null&&c.envMap===null?M.environmentRotation:c.envMapRotation,Ee===void 0&&(c.addEventListener("dispose",Xe),Ee=new Map,y.programs=Ee,y.programVariants=new Map);let Fe=Ee.get(me);if(Fe!==void 0){if(y.currentProgram===Fe&&y.lightsStateVersion===ge)return Pi(c,ce),Fe}else ce.uniforms=K.getUniforms(c),B!==null&&c.isNodeMaterial&&B.build(c,F,ce),c.onBeforeCompile(ce,w),Fe=K.acquireProgram(ce,me),Ee.set(me,Fe),y.uniforms=ce.uniforms;const ve=y.uniforms;return(!c.isShaderMaterial&&!c.isRawShaderMaterial||c.clipping===!0)&&(ve.clippingPlanes=V.uniform),Pi(c,ce),y.needsLights=Ir(c),y.lightsStateVersion=ge,y.needsLights&&(ve.ambientLightColor.value=O.state.ambient,ve.lightProbe.value=O.state.probe,ve.sunLights.value=O.state.sun,ve.sunLightShadows.value=O.state.sunShadow,ve.directionalLights.value=O.state.directional,ve.directionalLightShadows.value=O.state.directionalShadow,ve.spotLights.value=O.state.spot,ve.spotLightShadows.value=O.state.spotShadow,ve.rectAreaLights.value=O.state.rectArea,ve.ltc_1.value=O.state.rectAreaLTC1,ve.ltc_2.value=O.state.rectAreaLTC2,ve.pointLights.value=O.state.point,ve.pointLightShadows.value=O.state.pointShadow,ve.hemisphereLights.value=O.state.hemi,ve.sunShadowMatrix.value=O.state.sunShadowMatrix,ve.sunShadowCascade.value=O.state.sunShadowCascade,ve.directionalShadowMatrix.value=O.state.directionalShadowMatrix,ve.spotLightMatrix.value=O.state.spotLightMatrix,ve.spotLightMap.value=O.state.spotLightMap,ve.pointShadowMatrix.value=O.state.pointShadowMatrix),y.numLightProbeGrids=Ai(T.state.lightProbeGridArray),y.currentProgram=Fe,y.uniformsList=null,Fe}function Ur(c,M,F,y,O){const fe=Te.get(c),ge=fe.currentProgram.id+","+y+","+O;let ce=fe.programVariants.get(ge);return ce===void 0?(ce=hn(c,M,F),fe.programVariants.set(ge,ce)):(fe.currentProgram=ce,fe.uniformsList=null,fe.outputColorSpace=y,fe.toneMapping=O),ce}function bi(c){if(c.uniformsList===null){const M=c.currentProgram.getUniforms();c.uniformsList=On.seqWithValue(M.seq,c.uniforms)}return c.uniformsList}function Pi(c,M){const F=Te.get(c);F.outputColorSpace=M.outputColorSpace,F.batching=M.batching,F.batchingColor=M.batchingColor,F.instancing=M.instancing,F.instancingColor=M.instancingColor,F.instancingMorph=M.instancingMorph,F.skinning=M.skinning,F.morphTargets=M.morphTargets,F.morphNormals=M.morphNormals,F.morphColors=M.morphColors,F.morphTargetsCount=M.morphTargetsCount,F.numClippingPlanes=M.numClippingPlanes,F.numIntersection=M.numClipIntersection,F.vertexAlphas=M.vertexAlphas,F.vertexTangents=M.vertexTangents,F.toneMapping=M.toneMapping}function Nr(c,M,F,y,O){M.isScene!==!0&&(M=gt),Pe.resetTextureUnits();const fe=M.fog,ge=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?M.environment:null,ce=se===null?w.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:rt.workingColorSpace,me=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,Ee=h.get(y.envMap||ge,me),we=y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Fe=!!F.attributes.tangent&&(!!y.normalMap||y.anisotropy>0),ve=!!F.morphAttributes.position,Be=!!F.morphAttributes.normal,lt=!!F.morphAttributes.color;let Qe=Yt;y.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(Qe=w.toneMapping);const $e=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Mt=$e!==void 0?$e.length:0,Se=Te.get(y),Rt=T.state.lights;if(it===!0&&(dt===!0||c!==$)){const at=c===$&&y.id===W;V.setState(y,c,at)}let ze=!1,Jt=!1;y.version===Se.__version?Se.needsLights&&Se.lightsStateVersion!==Rt.state.version||O.isBatchedMesh&&Se.batching===!1||!O.isBatchedMesh&&Se.batching===!0||O.isBatchedMesh&&Se.batchingColor===!0&&O._colorsTexture===null||O.isBatchedMesh&&Se.batchingColor===!1&&O._colorsTexture!==null||O.isInstancedMesh&&Se.instancing===!1||!O.isInstancedMesh&&Se.instancing===!0||O.isSkinnedMesh&&Se.skinning===!1||!O.isSkinnedMesh&&Se.skinning===!0||O.isInstancedMesh&&Se.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Se.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Se.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Se.instancingMorph===!1&&O.morphTexture!==null||Se.envMap!==Ee||y.fog===!0&&Se.fog!==fe||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==V.numPlanes||Se.numIntersection!==V.numIntersection)||Se.vertexAlphas!==we||Se.vertexTangents!==Fe||Se.morphTargets!==ve||Se.morphNormals!==Be||Se.morphColors!==lt||Se.morphTargetsCount!==Mt||Se.numLightProbeGrids!==Ai(T.state.lightProbeGridArray)?ze=!0:(Se.outputColorSpace!==ce||Se.toneMapping!==Qe)&&(Jt=!0):(ze=!0,Se.__version=y.version);let xt=Se.currentProgram;(ze===!0||Jt===!0)&&(xt=Jt===!0?Ur(y,M,O,ce,Qe):hn(y,M,O),B&&y.isNodeMaterial&&B.onUpdateProgram(y,xt,Se));let bn=!1,qt=!1,en=!1;const He=xt.getUniforms(),mt=Se.uniforms;if(re.useProgram(xt.program)&&(bn=!0,qt=!0,en=!0),y.id!==W&&(W=y.id,qt=!0),bn||$!==c){re.buffers.depth.getReversed()&&c.reversedDepth!==!0&&(c._reversedDepth=!0,c.updateProjectionMatrix()),He.setValue(A,"projectionMatrix",c.projectionMatrix),He.setValue(A,"viewMatrix",c.matrixWorldInverse);const pt=He.map.cameraPosition;pt!==void 0&&pt.setValue(A,Pt.setFromMatrixPosition(c.matrixWorld)),Ze.logarithmicDepthBuffer&&He.setValue(A,"logDepthBufFC",2/(Math.log(c.far+1)/Math.LN2)),(y.isMeshPhongMaterial||y.isMeshToonMaterial||y.isMeshLambertMaterial||y.isMeshBasicMaterial||y.isMeshStandardMaterial||y.isShaderMaterial)&&He.setValue(A,"isOrthographic",c.isOrthographicCamera===!0),$!==c&&($=c,qt=!0,en=!0)}if(Se.needsLights&&(Rt.state.sunShadowMap.length>0&&He.setValue(A,"sunShadowMap",Rt.state.sunShadowMap,Pe),Rt.state.directionalShadowMap.length>0&&He.setValue(A,"directionalShadowMap",Rt.state.directionalShadowMap,Pe),Rt.state.spotShadowMap.length>0&&He.setValue(A,"spotShadowMap",Rt.state.spotShadowMap,Pe),Rt.state.pointShadowMap.length>0&&He.setValue(A,"pointShadowMap",Rt.state.pointShadowMap,Pe)),O.isSkinnedMesh){He.setOptional(A,O,"bindMatrix"),He.setOptional(A,O,"bindMatrixInverse");const at=O.skeleton;at&&(at.boneTexture===null&&at.computeBoneTexture(),He.setValue(A,"boneTexture",at.boneTexture,Pe))}O.isBatchedMesh&&(He.setOptional(A,O,"batchingTexture"),He.setValue(A,"batchingTexture",O._matricesTexture,Pe),He.setOptional(A,O,"batchingIdTexture"),He.setValue(A,"batchingIdTexture",O._indirectTexture,Pe),He.setOptional(A,O,"batchingColorTexture"),O._colorsTexture!==null&&He.setValue(A,"batchingColorTexture",O._colorsTexture,Pe));const Nt=F.morphAttributes;if((Nt.position!==void 0||Nt.normal!==void 0||Nt.color!==void 0)&&Y.update(O,F,xt),(qt||Se.receiveShadow!==O.receiveShadow)&&(Se.receiveShadow=O.receiveShadow,He.setValue(A,"receiveShadow",O.receiveShadow)),(y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial)&&y.envMap===null&&M.environment!==null&&(mt.envMapIntensity.value=M.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=Xu()),qt){if(He.setValue(A,"toneMappingExposure",w.toneMappingExposure),Se.needsLights&&yr(mt,en),fe&&y.fog===!0&&te.refreshFogUniforms(mt,fe),te.refreshMaterialUniforms(mt,y,ue,xe,T.state.transmissionRenderTarget[c.id]),Se.needsLights&&Se.numLightProbeGrids>0){const at=E;let pt=0;for(const Gt of T.state.lightProbeGridArray)Gt.texture!==null&&(at.textures[pt]=Gt.texture,at.min[pt]=Gt.boundingBox.min,at.max[pt]=Gt.boundingBox.max,at.resolution[pt]=Gt.resolution,pt++);for(const Gt in at)at[Gt].length=pt;mt.probesSH.value=at.textures,mt.probesMin.value=at.min,mt.probesMax.value=at.max,mt.probesResolution.value=at.resolution}On.upload(A,bi(Se),mt,Pe)}if(y.isShaderMaterial&&y.uniformsNeedUpdate===!0&&(On.upload(A,bi(Se),mt,Pe),y.uniformsNeedUpdate=!1),y.isSpriteMaterial&&He.setValue(A,"center",O.center),He.setValue(A,"modelViewMatrix",O.modelViewMatrix),He.setValue(A,"normalMatrix",O.normalMatrix),He.setValue(A,"modelMatrix",O.matrixWorld),y.uniformsGroups!==void 0){const at=y.uniformsGroups;for(let pt=0,Gt=at.length;pt<Gt;pt++){const Di=at[pt];Re.update(Di,xt),Re.bind(Di,xt)}}return xt}function yr(c,M){c.ambientLightColor.needsUpdate=M,c.lightProbe.needsUpdate=M,c.sunLights.needsUpdate=M,c.sunLightShadows.needsUpdate=M,c.directionalLights.needsUpdate=M,c.directionalLightShadows.needsUpdate=M,c.pointLights.needsUpdate=M,c.pointLightShadows.needsUpdate=M,c.spotLights.needsUpdate=M,c.spotLightShadows.needsUpdate=M,c.rectAreaLights.needsUpdate=M,c.hemisphereLights.needsUpdate=M}function Ir(c){return c.isMeshLambertMaterial||c.isMeshToonMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isShadowMaterial||c.isShaderMaterial&&c.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return se},this.setRenderTargetTextures=function(c,M,F){const y=Te.get(c);y.__autoAllocateDepthBuffer=c.resolveDepthBuffer===!1,y.__autoAllocateDepthBuffer===!1&&(y.__useRenderToTexture=!1),Te.get(c.texture).__webglTexture=M,Te.get(c.depthTexture).__webglTexture=y.__autoAllocateDepthBuffer?void 0:F,y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(c,M){const F=Te.get(c);F.__webglFramebuffer=M,F.__useDefaultFramebuffer=M===void 0},this.setRenderTarget=function(c,M=0,F=0){se=c,Z=M,z=F;let y=null,O=!1,fe=!1;if(c){const ce=Te.get(c);if(ce.__useDefaultFramebuffer!==void 0){re.bindFramebuffer(A.FRAMEBUFFER,ce.__webglFramebuffer),ee.copy(c.viewport),Me.copy(c.scissor),Le=c.scissorTest,re.viewport(ee),re.scissor(Me),re.setScissorTest(Le),W=-1;return}else if(ce.__webglFramebuffer===void 0)Pe.setupRenderTarget(c);else if(ce.__hasExternalTextures)Pe.rebindTextures(c,Te.get(c.texture).__webglTexture,Te.get(c.depthTexture).__webglTexture);else if(c.depthBuffer){const we=c.depthTexture;if(ce.__boundDepthTexture!==we){if(we!==null&&Te.has(we)&&(c.width!==we.image.width||c.height!==we.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Pe.setupDepthRenderbuffer(c)}}const me=c.texture;(me.isData3DTexture||me.isDataArrayTexture||me.isCompressedArrayTexture)&&(fe=!0);const Ee=Te.get(c).__webglFramebuffer;c.isWebGLCubeRenderTarget?(Array.isArray(Ee[M])?y=Ee[M][F]:y=Ee[M],O=!0):c.samples>0&&Pe.useMultisampledRTT(c)===!1?y=Te.get(c).__webglMultisampledFramebuffer:Array.isArray(Ee)?y=Ee[F]:y=Ee,ee.copy(c.viewport),Me.copy(c.scissor),Le=c.scissorTest}else ee.copy(Ce).multiplyScalar(ue).floor(),Me.copy(We).multiplyScalar(ue).floor(),Le=Ve;if(F!==0&&(y=q),re.bindFramebuffer(A.FRAMEBUFFER,y)&&re.drawBuffers(c,y),re.viewport(ee),re.scissor(Me),re.setScissorTest(Le),O){const ce=Te.get(c.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+M,ce.__webglTexture,F)}else if(fe){const ce=M;for(let me=0;me<c.textures.length;me++){const Ee=Te.get(c.textures[me]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+me,Ee.__webglTexture,F,ce)}}else if(c!==null&&F!==0){const ce=Te.get(c.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,ce.__webglTexture,F)}W=-1};function Ci(c){const M=Te.get(c);return(M.__readFormat!==c.format||M.__readType!==c.type)&&(M.__readFormat=c.format,M.__readType=c.type,M.__formatReadable=Ze.textureFormatReadable(c.format),M.__typeReadable=Ze.textureTypeReadable(c.type)),M}this.readRenderTargetPixels=function(c,M,F,y,O,fe,ge,ce=0){if(!(c&&c.isWebGLRenderTarget)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=Te.get(c).__webglFramebuffer;if(c.isWebGLCubeRenderTarget&&ge!==void 0&&(me=me[ge],Array.isArray(me)&&(me=me[0])),me){re.bindFramebuffer(A.FRAMEBUFFER,me);try{const Ee=c.textures[ce],we=Ee.format,Fe=Ee.type;c.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+ce);const ve=Ci(Ee);if(ve.__formatReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ve.__typeReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}M>=0&&M<=c.width-y&&F>=0&&F<=c.height-O&&A.readPixels(M,F,y,O,ie.convert(we),ie.convert(Fe),fe)}finally{const Ee=se!==null?Te.get(se).__webglFramebuffer:null;re.bindFramebuffer(A.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(c,M,F,y,O,fe,ge,ce=0){if(!(c&&c.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=Te.get(c).__webglFramebuffer;if(c.isWebGLCubeRenderTarget&&ge!==void 0&&(me=me[ge],Array.isArray(me)&&(me=me[0])),me)if(M>=0&&M<=c.width-y&&F>=0&&F<=c.height-O){re.bindFramebuffer(A.FRAMEBUFFER,me);const Ee=c.textures[ce],we=Ee.format,Fe=Ee.type;c.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+ce);const ve=Ci(Ee);if(ve.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ve.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Be=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Be),A.bufferData(A.PIXEL_PACK_BUFFER,fe.byteLength,A.STREAM_READ),A.readPixels(M,F,y,O,ie.convert(we),ie.convert(Fe),0),A.bindBuffer(A.PIXEL_PACK_BUFFER,null);const lt=se!==null?Te.get(se).__webglFramebuffer:null;re.bindFramebuffer(A.FRAMEBUFFER,lt);const Qe=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Hr(A,Qe,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Be),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,fe),A.bindBuffer(A.PIXEL_PACK_BUFFER,null),A.deleteBuffer(Be),A.deleteSync(Qe),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(c,M=null,F=0){const y=Math.pow(2,-F),O=Math.floor(c.image.width*y),fe=Math.floor(c.image.height*y),ge=M!==null?M.x:0,ce=M!==null?M.y:0;Pe.setTexture2D(c,0),A.copyTexSubImage2D(A.TEXTURE_2D,F,0,0,ge,ce,O,fe),re.unbindTexture()},this.copyTextureToTexture=function(c,M,F=null,y=null,O=0,fe=0){let ge,ce,me,Ee,we,Fe,ve,Be,lt;const Qe=c.isCompressedTexture?c.mipmaps[fe]:c.image;if(F!==null)ge=F.max.x-F.min.x,ce=F.max.y-F.min.y,me=F.isBox3?F.max.z-F.min.z:1,Ee=F.min.x,we=F.min.y,Fe=F.isBox3?F.min.z:0;else{const He=Math.pow(2,-O);ge=Math.floor(Qe.width*He),ce=Math.floor(Qe.height*He),c.isDataArrayTexture?me=Qe.depth:c.isData3DTexture?me=Math.floor(Qe.depth*He):me=1,Ee=0,we=0,Fe=0}y!==null?(ve=y.x,Be=y.y,lt=y.z):(ve=0,Be=0,lt=0);const $e=ie.convert(M.format),Mt=ie.convert(M.type);let Se;M.isData3DTexture?(Pe.setTexture3D(M,0),Se=A.TEXTURE_3D):M.isDataArrayTexture||M.isCompressedArrayTexture?(Pe.setTexture2DArray(M,0),Se=A.TEXTURE_2D_ARRAY):(Pe.setTexture2D(M,0),Se=A.TEXTURE_2D),re.activeTexture(A.TEXTURE0),re.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,M.flipY),re.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),re.pixelStorei(A.UNPACK_ALIGNMENT,M.unpackAlignment);const Rt=re.getParameter(A.UNPACK_ROW_LENGTH),ze=re.getParameter(A.UNPACK_IMAGE_HEIGHT),Jt=re.getParameter(A.UNPACK_SKIP_PIXELS),xt=re.getParameter(A.UNPACK_SKIP_ROWS),bn=re.getParameter(A.UNPACK_SKIP_IMAGES);re.pixelStorei(A.UNPACK_ROW_LENGTH,Qe.width),re.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Qe.height),re.pixelStorei(A.UNPACK_SKIP_PIXELS,Ee),re.pixelStorei(A.UNPACK_SKIP_ROWS,we),re.pixelStorei(A.UNPACK_SKIP_IMAGES,Fe);const qt=c.isDataArrayTexture||c.isData3DTexture,en=M.isDataArrayTexture||M.isData3DTexture;if(c.isDepthTexture){const He=Te.get(c),mt=Te.get(M),Nt=Te.get(He.__renderTarget),at=Te.get(mt.__renderTarget);re.bindFramebuffer(A.READ_FRAMEBUFFER,Nt.__webglFramebuffer),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,at.__webglFramebuffer);for(let pt=0;pt<me;pt++)qt&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Te.get(c).__webglTexture,O,Fe+pt),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Te.get(M).__webglTexture,fe,lt+pt)),A.blitFramebuffer(Ee,we,Ee+ge,we+ce,ve,Be,ve+ge,Be+ce,A.DEPTH_BUFFER_BIT,A.NEAREST);re.bindFramebuffer(A.READ_FRAMEBUFFER,null),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(O!==0||c.isRenderTargetTexture||Te.has(c)){const He=Te.get(c),mt=Te.get(M);re.bindFramebuffer(A.READ_FRAMEBUFFER,P),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,j);for(let Nt=0;Nt<me;Nt++)qt?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,He.__webglTexture,O,Fe+Nt):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,He.__webglTexture,O),en?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,mt.__webglTexture,fe,lt+Nt):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,mt.__webglTexture,fe),O!==0?A.blitFramebuffer(Ee,we,Ee+ge,we+ce,ve,Be,ve+ge,Be+ce,A.COLOR_BUFFER_BIT,A.NEAREST):en?A.copyTexSubImage3D(Se,fe,ve,Be,lt+Nt,Ee,we,ge,ce):A.copyTexSubImage2D(Se,fe,ve,Be,Ee,we,ge,ce);re.bindFramebuffer(A.READ_FRAMEBUFFER,null),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else en?c.isDataTexture||c.isData3DTexture?A.texSubImage3D(Se,fe,ve,Be,lt,ge,ce,me,$e,Mt,Qe.data):M.isCompressedArrayTexture?A.compressedTexSubImage3D(Se,fe,ve,Be,lt,ge,ce,me,$e,Qe.data):A.texSubImage3D(Se,fe,ve,Be,lt,ge,ce,me,$e,Mt,Qe):c.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,fe,ve,Be,ge,ce,$e,Mt,Qe.data):c.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,fe,ve,Be,Qe.width,Qe.height,$e,Qe.data):A.texSubImage2D(A.TEXTURE_2D,fe,ve,Be,ge,ce,$e,Mt,Qe);re.pixelStorei(A.UNPACK_ROW_LENGTH,Rt),re.pixelStorei(A.UNPACK_IMAGE_HEIGHT,ze),re.pixelStorei(A.UNPACK_SKIP_PIXELS,Jt),re.pixelStorei(A.UNPACK_SKIP_ROWS,xt),re.pixelStorei(A.UNPACK_SKIP_IMAGES,bn),fe===0&&M.generateMipmaps===!0&&M.mipmapsAutoUpdate===!0&&A.generateMipmap(Se),re.unbindTexture()},this.initRenderTarget=function(c){Te.get(c).__webglFramebuffer===void 0&&Pe.setupRenderTarget(c)},this.initTexture=function(c){c.isCubeTexture?Pe.setTextureCube(c,0):c.isData3DTexture?Pe.setTexture3D(c,0):c.isDataArrayTexture||c.isCompressedArrayTexture?Pe.setTexture2DArray(c,0):Pe.setTexture2D(c,0),re.unbindTexture()},this.resetState=function(){Z=0,z=0,se=null,re.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Li}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const n=this.getContext();n.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(t),n.unpackColorSpace=rt._getUnpackColorSpace()}}function gd(e,t=!1){const n=e[0].index!==null,i=new Set(Object.keys(e[0].attributes)),r=new Set(Object.keys(e[0].morphAttributes)),a={},o={},d=e[0].morphTargetsRelative,R=new zn;R.morphTargetsRelative=d;let m=0;for(let b=0;b<e.length;++b){const C=e[b];let S=0,g=0;if(n!==(C.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const x in C.attributes){if(!i.has(x))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+'. All geometries must have compatible attributes; make sure "'+x+'" attribute exists among all geometries, or in none of them.'),null;a[x]===void 0&&(a[x]=[]),a[x].push(C.attributes[x]),S++}if(S!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+". Make sure all geometries have the same number of attributes."),null;if(d!==C.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const x in C.morphAttributes){if(!r.has(x))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+".  .morphAttributes must be consistent throughout all geometries."),null;if(C.morphAttributes[x].length!==e[0].morphAttributes[x].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+'. All geometries must have the same number of morph targets for the "'+x+'" morph attribute.'),null;o[x]===void 0&&(o[x]=[]),o[x].push(C.morphAttributes[x]),g++}if(g!==r.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+". Make sure all geometries have the same number of morph attributes."),null;if(t){let x;if(n)x=C.index.count;else if(C.attributes.position!==void 0)x=C.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+b+". The geometry must have either an index or a position attribute"),null;R.addGroup(m,x,b),m+=x}}if(n){let b=0;const C=[];for(let S=0;S<e.length;++S){const g=e[S].index;for(let x=0;x<g.count;++x)C.push(g.getX(x)+b);b+=e[S].attributes.position.count}R.setIndex(C)}for(const b in a){const C=Ba(a[b]);if(!C)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+b+" attribute."),null;R.setAttribute(b,C)}for(const b in o){const C=o[b][0].length;if(C!==0){R.morphAttributes=R.morphAttributes||{},R.morphAttributes[b]=[];for(let S=0;S<C;++S){const g=[];for(let U=0;U<o[b].length;++U)g.push(o[b][U][S]);const x=Ba(g);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+b+" morphAttribute."),null;R.morphAttributes[b].push(x)}}}return R}function Ba(e){let t,n,i,r=-1,a=0;for(let m=0;m<e.length;++m){const b=e[m];if(t===void 0&&(t=b.array.constructor),t!==b.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(n===void 0&&(n=b.itemSize),n!==b.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=b.normalized),i!==b.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=b.gpuType),r!==b.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=b.count*n}const o=new t(a),d=new Ya(o,n,i);let R=0;for(let m=0;m<e.length;++m){const b=e[m];if(b.isInterleavedBufferAttribute){const C=R/n;for(let S=0,g=b.count;S<g;S++)for(let x=0;x<n;x++){const U=b.getComponent(S,x);d.setComponent(S+C,x,U)}}else o.set(b.array,R);R+=b.count*n}return r!==void 0&&(d.gpuType=r),d}const mn=new be;function Ut(e,t,n,i,r,a){const o=2*Math.PI*r/4,d=Math.max(a-2*r,0),R=Math.PI/4;mn.copy(t),mn[i]=0,mn.normalize();const m=.5*o/(o+d),b=1-mn.angleTo(e)/R;return Math.sign(mn[n])===1?b*m:d/(o+d)+m+m*(1-b)}class Cr extends Vn{constructor(t=1,n=1,i=1,r=2,a=.1){const o=r*2+1;if(a=Math.min(t/2,n/2,i/2,a),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:n,depth:i,segments:r,radius:a},o===1)return;const d=this.toNonIndexed();this.index=null,this.attributes.position=d.attributes.position,this.attributes.normal=d.attributes.normal,this.attributes.uv=d.attributes.uv;const R=new be,m=new be,b=new be(t,n,i).divideScalar(2).subScalar(a),C=this.attributes.position.array,S=this.attributes.normal.array,g=this.attributes.uv.array,x=C.length/6,U=new be,u=.5/o;for(let f=0,_=0;f<C.length;f+=3,_+=2)switch(R.fromArray(C,f),m.copy(R),m.x-=Math.sign(m.x)*u,m.y-=Math.sign(m.y)*u,m.z-=Math.sign(m.z)*u,m.normalize(),C[f+0]=b.x*Math.sign(R.x)+m.x*a,C[f+1]=b.y*Math.sign(R.y)+m.y*a,C[f+2]=b.z*Math.sign(R.z)+m.z*a,S[f+0]=m.x,S[f+1]=m.y,S[f+2]=m.z,Math.floor(f/x)){case 0:U.set(1,0,0),g[_+0]=Ut(U,m,"z","y",a,i),g[_+1]=1-Ut(U,m,"y","z",a,n);break;case 1:U.set(-1,0,0),g[_+0]=1-Ut(U,m,"z","y",a,i),g[_+1]=1-Ut(U,m,"y","z",a,n);break;case 2:U.set(0,1,0),g[_+0]=1-Ut(U,m,"x","z",a,t),g[_+1]=Ut(U,m,"z","x",a,i);break;case 3:U.set(0,-1,0),g[_+0]=1-Ut(U,m,"x","z",a,t),g[_+1]=1-Ut(U,m,"z","x",a,i);break;case 4:U.set(0,0,1),g[_+0]=1-Ut(U,m,"x","y",a,t),g[_+1]=1-Ut(U,m,"y","x",a,n);break;case 5:U.set(0,0,-1),g[_+0]=Ut(U,m,"x","y",a,t),g[_+1]=1-Ut(U,m,"y","x",a,n);break}}static fromJSON(t){return new Cr(t.width,t.height,t.depth,t.segments,t.radius)}}const Ga={type:"change"},gi={type:"start"},Dr={type:"end"},wn=new qo,Ha=new ja,Yu=Math.cos(70*Zo.DEG2RAD),ct=new be,Ct=2*Math.PI,ke={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ai=1e-6;class vd extends Ko{constructor(t,n=null){super(t,n),this.state=ke.NONE,this.target=new be,this.cursor=new be,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ln.ROTATE,MIDDLE:ln.DOLLY,RIGHT:ln.PAN},this.touches={ONE:sn.ROTATE,TWO:sn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new be,this._lastQuaternion=new ma,this._lastTargetPosition=new be,this._quat=new ma().setFromUnitVectors(t.up,new be(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new _a,this._sphericalDelta=new _a,this._scale=1,this._panOffset=new be,this._rotateStart=new Oe,this._rotateEnd=new Oe,this._rotateDelta=new Oe,this._panStart=new Oe,this._panEnd=new Oe,this._panDelta=new Oe,this._dollyStart=new Oe,this._dollyEnd=new Oe,this._dollyDelta=new Oe,this._dollyDirection=new be,this._mouse=new Oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=qu.bind(this),this._onPointerDown=Ku.bind(this),this._onPointerUp=Zu.bind(this),this._onContextMenu=nd.bind(this),this._onMouseWheel=Qu.bind(this),this._onKeyDown=Ju.bind(this),this._onTouchStart=ed.bind(this),this._onTouchMove=td.bind(this),this._onMouseDown=ju.bind(this),this._onMouseMove=$u.bind(this),this._interceptControlDown=id.bind(this),this._interceptControlUp=ad.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=ke.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ga),this.update(),this.state=ke.NONE}pan(t,n){this._pan(t,n),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const n=this.object.position;ct.copy(n).sub(this.target),ct.applyQuaternion(this._quat),this._spherical.setFromVector3(ct),this.autoRotate&&this.state===ke.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Ct:i>Math.PI&&(i-=Ct),r<-Math.PI?r+=Ct:r>Math.PI&&(r-=Ct),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=o!=this._spherical.radius}if(ct.setFromSpherical(this._spherical),ct.applyQuaternion(this._quatInverse),n.copy(this.target).add(ct),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const d=ct.length();o=this._clampDistance(d*this._scale);const R=d-o;this.object.position.addScaledVector(this._dollyDirection,R),this.object.updateMatrixWorld(),a=!!R}else if(this.object.isOrthographicCamera){const d=new be(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const R=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=R!==this.object.zoom;const m=new be(this._mouse.x,this._mouse.y,0);m.unproject(this.object),this.object.position.sub(m).add(d),this.object.updateMatrixWorld(),o=ct.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(wn.origin.copy(this.object.position),wn.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(wn.direction))<Yu?this.object.lookAt(this.target):(Ha.setFromNormalAndCoplanarPoint(this.object.up,this.target),wn.intersectPlane(Ha,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>ai||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ai||this._lastTargetPosition.distanceToSquared(this.target)>ai?(this.dispatchEvent(Ga),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ct/60*this.autoRotateSpeed*t:Ct/60/60*this.autoRotateSpeed}_getZoomScale(t){const n=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,n){ct.setFromMatrixColumn(n,0),ct.multiplyScalar(-t),this._panOffset.add(ct)}_panUp(t,n){this.screenSpacePanning===!0?ct.setFromMatrixColumn(n,1):(ct.setFromMatrixColumn(n,0),ct.crossVectors(this.object.up,ct)),ct.multiplyScalar(t),this._panOffset.add(ct)}_pan(t,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;ct.copy(r).sub(this.target);let a=ct.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*a/i.clientHeight,this.object.matrix),this._panUp(2*n*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=t-i.left,a=n-i.top,o=i.width,d=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(a/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientY),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Ct*this._rotateDelta.x/n.clientHeight),this._rotateUp(Ct*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let n=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Ct*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Ct*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Ct*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Ct*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(t){const n=this._getSecondPointerPosition(t),i=t.pageX-n.x,r=t.pageY-n.y,a=Math.sqrt(i*i+r*r);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),r=.5*(t.pageX+i.x),a=.5*(t.pageY+i.y);this._rotateEnd.set(r,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Ct*this._rotateDelta.x/n.clientHeight),this._rotateUp(Ct*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const n=this._getSecondPointerPosition(t),i=t.pageX-n.x,r=t.pageY-n.y,a=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+n.x)*.5,d=(t.pageY+n.y)*.5;this._updateZoomParameters(o,d)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==t.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(t){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==t.pointerId)return!0;return!1}_trackPointer(t){let n=this._pointerPositions[t.pointerId];n===void 0&&(n=new Oe,this._pointerPositions[t.pointerId]=n),n.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const n=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(t){const n=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Ku(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType==="touch"?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function qu(e){this.enabled!==!1&&(e.pointerType==="touch"?this._onTouchMove(e):this._onMouseMove(e))}function Zu(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Dr),this.state=ke.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y});break}}function ju(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case ln.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=ke.DOLLY;break;case ln.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ke.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ke.ROTATE}break;case ln.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ke.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ke.PAN}break;default:this.state=ke.NONE}this.state!==ke.NONE&&this.dispatchEvent(gi)}function $u(e){switch(this.state){case ke.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case ke.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case ke.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e);break}}function Qu(e){this.enabled===!1||this.enableZoom===!1||this.state!==ke.NONE||(e.preventDefault(),this.dispatchEvent(gi),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(Dr))}function Ju(e){this.enabled!==!1&&this._handleKeyDown(e)}function ed(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case sn.ROTATE:if(this.enableRotate===!1){this.state=ke.NONE;break}this._handleTouchStartRotate(e),this.state=ke.TOUCH_ROTATE;break;case sn.PAN:if(this.enablePan===!1){this.state=ke.NONE;break}this._handleTouchStartPan(e),this.state=ke.TOUCH_PAN;break;default:this.state=ke.NONE}break;case 2:switch(this.touches.TWO){case sn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=ke.TOUCH_DOLLY_PAN;break;case sn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=ke.TOUCH_DOLLY_ROTATE;break;default:this.state=ke.NONE}break;default:this.state=ke.NONE}this.state!==ke.NONE&&this.dispatchEvent(gi)}function td(e){switch(this._trackPointer(e),this.state){case ke.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case ke.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case ke.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case ke.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=ke.NONE}}function nd(e){this.enabled!==!1&&e.preventDefault()}function id(e){e.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ad(e){e.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const nn={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class dn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const rd=new qa(-1,1,1,-1,0,1);class od extends zn{constructor(){super(),this.setAttribute("position",new Bn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Bn([0,2,0,0,2,0],2))}}const sd=new od;class vi{constructor(t){this._mesh=new $t(sd,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,rd)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class ld extends dn{constructor(t,n="tDiffuse"){super(),this.textureID=n,this.uniforms=null,this.material=null,t instanceof _t?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=kt.clone(t.uniforms),this.material=new _t({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new vi(this.material)}render(t,n,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Va extends dn{constructor(t,n){super(),this.scene=t,this.camera=n,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,n,i){const r=t.getContext(),a=t.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let o,d;this.inverse?(o=0,d=1):(o=1,d=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),a.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),a.buffers.stencil.setClear(d),a.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(r.EQUAL,1,4294967295),a.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),a.buffers.stencil.setLocked(!0)}}class cd extends dn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Sd{constructor(t,n){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),n===void 0){const i=t.getSize(new Oe);this._width=i.width,this._height=i.height,n=new Tt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:bt}),n.texture.name="EffectComposer.rt1"}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ld(nn),this.copyPass.material.blending=At,this.timer=new jo}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,n){this.passes.splice(n,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const n=this.passes.indexOf(t);n!==-1&&this.passes.splice(n,1)}isLastEnabledPass(t){for(let n=t+1;n<this.passes.length;n++)if(this.passes[n].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const n=this.renderer.getRenderTarget();let i=!1;for(let r=0,a=this.passes.length;r<a;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),o.needsSwap){if(i){const d=this.renderer.getContext(),R=this.renderer.state.buffers.stencil;R.setFunc(d.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),R.setFunc(d.EQUAL,1,4294967295)}this.swapBuffers()}Va!==void 0&&(o instanceof Va?i=!0:o instanceof cd&&(i=!1))}}this.renderer.setRenderTarget(n)}reset(t){if(t===void 0){const n=this.renderer.getSize(new Oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=n.width,this._height=n.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,n){this._width=t,this._height=n;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,r)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ed extends dn{constructor(t,n,i=null,r=null,a=null){super(),this.scene=t,this.camera=n,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ke}render(t,n,i){const r=t.autoClear;t.autoClear=!1;let a,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(a=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=r}}const Ln={defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new Oe},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Bt},cameraProjectionMatrixInverse:{value:new Bt},cameraWorldMatrix:{value:new Bt},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new be(-1,-1,-1)},sceneBoxMax:{value:new be(1,1,1)}},vertexShader:`

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
		}`},Un={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},ri={uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function fd(e=5){const t=Math.floor(e)%2===0?Math.floor(e)+1:Math.floor(e),n=ud(t),i=n.length,r=new Uint8Array(i*4);for(let o=0;o<i;++o){const d=n[o],R=2*Math.PI*d/i,m=new be(Math.cos(R),Math.sin(R),0).normalize();r[o*4]=(m.x*.5+.5)*255,r[o*4+1]=(m.y*.5+.5)*255,r[o*4+2]=127,r[o*4+3]=255}const a=new mi(r,t,t);return a.wrapS=Mn,a.wrapT=Mn,a.needsUpdate=!0,a}function ud(e){const t=Math.floor(e)%2===0?Math.floor(e)+1:Math.floor(e),n=t*t,i=Array(n).fill(0);let r=Math.floor(t/2),a=t-1;for(let o=1;o<=n;){if(r===-1&&a===t?(a=t-2,r=0):(a===t&&(a=0),r<0&&(r=t-1)),i[r*t+a]!==0){a-=2,r++;continue}else i[r*t+a]=o++;a++,r--}return i}const Nn={defines:{SAMPLES:16,SAMPLE_VECTORS:wr(16,2,1),NORMAL_VECTOR_TYPE:1},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new Oe},cameraProjectionMatrixInverse:{value:new Bt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function wr(e,t,n){const i=dd(e,t,n);let r="vec3[SAMPLES](";for(let a=0;a<e;a++){const o=i[a];r+=`vec3(${o.x}, ${o.y}, ${o.z})${a<e-1?",":")"}`}return r}function dd(e,t,n){const i=[];for(let r=0;r<e;r++){const a=2*Math.PI*t*r/e,o=Math.pow(r/(e-1),n);i.push(new be(Math.cos(a),Math.sin(a),o))}return i}class hd{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let n=0;n<256;n++)this.p[n]=Math.floor(t.random()*256);this.perm=[];for(let n=0;n<512;n++)this.perm[n]=this.p[n&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,n){let i,r,a;const o=.5*(Math.sqrt(3)-1),d=(t+n)*o,R=Math.floor(t+d),m=Math.floor(n+d),b=(3-Math.sqrt(3))/6,C=(R+m)*b,S=R-C,g=m-C,x=t-S,U=n-g;let u,f;x>U?(u=1,f=0):(u=0,f=1);const _=x-u+b,L=U-f+b,E=x-1+2*b,D=U-1+2*b,T=R&255,l=m&255,p=this.perm[T+this.perm[l]]%12,k=this.perm[T+u+this.perm[l+f]]%12,w=this.perm[T+1+this.perm[l+1]]%12;let I=.5-x*x-U*U;I<0?i=0:(I*=I,i=I*I*this._dot(this.grad3[p],x,U));let B=.5-_*_-L*L;B<0?r=0:(B*=B,r=B*B*this._dot(this.grad3[k],_,L));let q=.5-E*E-D*D;return q<0?a=0:(q*=q,a=q*q*this._dot(this.grad3[w],E,D)),70*(i+r+a)}noise3d(t,n,i){let r,a,o,d;const m=(t+n+i)*.3333333333333333,b=Math.floor(t+m),C=Math.floor(n+m),S=Math.floor(i+m),g=1/6,x=(b+C+S)*g,U=b-x,u=C-x,f=S-x,_=t-U,L=n-u,E=i-f;let D,T,l,p,k,w;_>=L?L>=E?(D=1,T=0,l=0,p=1,k=1,w=0):_>=E?(D=1,T=0,l=0,p=1,k=0,w=1):(D=0,T=0,l=1,p=1,k=0,w=1):L<E?(D=0,T=0,l=1,p=0,k=1,w=1):_<E?(D=0,T=1,l=0,p=0,k=1,w=1):(D=0,T=1,l=0,p=1,k=1,w=0);const I=_-D+g,B=L-T+g,q=E-l+g,P=_-p+2*g,j=L-k+2*g,Z=E-w+2*g,z=_-1+3*g,se=L-1+3*g,W=E-1+3*g,$=b&255,ee=C&255,Me=S&255,Le=this.perm[$+this.perm[ee+this.perm[Me]]]%12,X=this.perm[$+D+this.perm[ee+T+this.perm[Me+l]]]%12,pe=this.perm[$+p+this.perm[ee+k+this.perm[Me+w]]]%12,_e=this.perm[$+1+this.perm[ee+1+this.perm[Me+1]]]%12;let xe=.6-_*_-L*L-E*E;xe<0?r=0:(xe*=xe,r=xe*xe*this._dot3(this.grad3[Le],_,L,E));let ue=.6-I*I-B*B-q*q;ue<0?a=0:(ue*=ue,a=ue*ue*this._dot3(this.grad3[X],I,B,q));let De=.6-P*P-j*j-Z*Z;De<0?o=0:(De*=De,o=De*De*this._dot3(this.grad3[pe],P,j,Z));let nt=.6-z*z-se*se-W*W;return nt<0?d=0:(nt*=nt,d=nt*nt*this._dot3(this.grad3[_e],z,se,W)),32*(r+a+o+d)}noise4d(t,n,i,r){const a=this.grad4,o=this.simplex,d=this.perm,R=(Math.sqrt(5)-1)/4,m=(5-Math.sqrt(5))/20;let b,C,S,g,x;const U=(t+n+i+r)*R,u=Math.floor(t+U),f=Math.floor(n+U),_=Math.floor(i+U),L=Math.floor(r+U),E=(u+f+_+L)*m,D=u-E,T=f-E,l=_-E,p=L-E,k=t-D,w=n-T,I=i-l,B=r-p,q=k>w?32:0,P=k>I?16:0,j=w>I?8:0,Z=k>B?4:0,z=w>B?2:0,se=I>B?1:0,W=q+P+j+Z+z+se,$=o[W][0]>=3?1:0,ee=o[W][1]>=3?1:0,Me=o[W][2]>=3?1:0,Le=o[W][3]>=3?1:0,X=o[W][0]>=2?1:0,pe=o[W][1]>=2?1:0,_e=o[W][2]>=2?1:0,xe=o[W][3]>=2?1:0,ue=o[W][0]>=1?1:0,De=o[W][1]>=1?1:0,nt=o[W][2]>=1?1:0,Ce=o[W][3]>=1?1:0,We=k-$+m,Ve=w-ee+m,Ne=I-Me+m,st=B-Le+m,it=k-X+2*m,dt=w-pe+2*m,je=I-_e+2*m,Pt=B-xe+2*m,ot=k-ue+3*m,gt=w-De+3*m,vt=I-nt+3*m,St=B-Ce+3*m,A=k-1+4*m,Et=w-1+4*m,qe=I-1+4*m,Ze=B-1+4*m,re=u&255,et=f&255,Te=_&255,Pe=L&255,h=d[re+d[et+d[Te+d[Pe]]]]%32,s=d[re+$+d[et+ee+d[Te+Me+d[Pe+Le]]]]%32,N=d[re+X+d[et+pe+d[Te+_e+d[Pe+xe]]]]%32,Q=d[re+ue+d[et+De+d[Te+nt+d[Pe+Ce]]]]%32,K=d[re+1+d[et+1+d[Te+1+d[Pe+1]]]]%32;let te=.6-k*k-w*w-I*I-B*B;te<0?b=0:(te*=te,b=te*te*this._dot4(a[h],k,w,I,B));let ae=.6-We*We-Ve*Ve-Ne*Ne-st*st;ae<0?C=0:(ae*=ae,C=ae*ae*this._dot4(a[s],We,Ve,Ne,st));let G=.6-it*it-dt*dt-je*je-Pt*Pt;G<0?S=0:(G*=G,S=G*G*this._dot4(a[N],it,dt,je,Pt));let V=.6-ot*ot-gt*gt-vt*vt-St*St;V<0?g=0:(V*=V,g=V*V*this._dot4(a[Q],ot,gt,vt,St));let ne=.6-A*A-Et*Et-qe*qe-Ze*Ze;return ne<0?x=0:(ne*=ne,x=ne*ne*this._dot4(a[K],A,Et,qe,Ze)),27*(b+C+S+g+x)}_dot(t,n,i){return t[0]*n+t[1]*i}_dot3(t,n,i,r){return t[0]*n+t[1]*i+t[2]*r}_dot4(t,n,i,r,a){return t[0]*n+t[1]*i+t[2]*r+t[3]*a}}class Ht extends dn{constructor(t,n,i=512,r=512,a,o,d){super(),this.width=i,this.height=r,this.clear=!0,this.camera=n,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=fd(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Tt(this.width,this.height,{type:bt,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new _t({defines:Object.assign({},Ln.defines),uniforms:kt.clone(Ln.uniforms),vertexShader:Ln.vertexShader,fragmentShader:Ln.fragmentShader,blending:At,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new $o,this.normalMaterial.blending=At,this.pdMaterial=new _t({defines:Object.assign({},Nn.defines),uniforms:kt.clone(Nn.uniforms),vertexShader:Nn.vertexShader,fragmentShader:Nn.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new _t({defines:Object.assign({},Un.defines),uniforms:kt.clone(Un.uniforms),vertexShader:Un.vertexShader,fragmentShader:Un.fragmentShader,blending:At}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new _t({uniforms:kt.clone(nn.uniforms),vertexShader:nn.vertexShader,fragmentShader:nn.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:li,blendDst:_n,blendEquation:zt,blendSrcAlpha:si,blendDstAlpha:_n,blendEquationAlpha:zt}),this.blendMaterial=new _t({uniforms:kt.clone(ri.uniforms),vertexShader:ri.vertexShader,fragmentShader:ri.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:nr,blendSrc:li,blendDst:_n,blendEquation:zt,blendSrcAlpha:si,blendDstAlpha:_n,blendEquationAlpha:zt}),this._fsQuad=new vi(null),this._originalClearColor=new Ke,this.setGBuffer(a?a.depthTexture:void 0,a?a.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),d!==void 0&&this.updatePdMaterial(d)}setSize(t,n){this.width=t,this.height=n,this.gtaoRenderTarget.setSize(t,n),this.normalRenderTarget&&this.normalRenderTarget.setSize(t,n),this.pdRenderTarget.setSize(t,n),this.gtaoMaterial.uniforms.resolution.value.set(t,n),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,n),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget&&this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,n){if(t!==void 0)this.depthTexture=t,this.normalTexture=n,this._renderGBuffer=!1;else{if(this.normalRenderTarget===void 0){const r=new fn;r.format=jt,r.type=rn,this.normalRenderTarget=new Tt(this.width,this.height,{minFilter:Wt,magFilter:Wt,type:bt,depthTexture:r})}this.depthTexture=this.normalRenderTarget.depthTexture,this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0}const i=this.normalTexture?1:0;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.needsUpdate=!0,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.needsUpdate=!0,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let n=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,n=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,n=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,n=!0),n&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=wr(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,i){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case Ht.OUTPUT.Off:break;case Ht.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=At,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Ht.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=At,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Ht.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=At,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Ht.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case Ht.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalTexture||null,this.copyMaterial.blending=At,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Ht.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=At,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,n,i,r,a){t.getClearColor(this._originalClearColor);const o=t.getClearAlpha(),d=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,r!=null&&(t.setClearColor(r),t.setClearAlpha(a||0),t.clear()),this._fsQuad.material=n,this._fsQuad.render(t),t.autoClear=d,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,n,i,r,a){t.getClearColor(this._originalClearColor);const o=t.getClearAlpha(),d=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,r=n.clearColor||r,a=n.clearAlpha||a,r!=null&&(t.setClearColor(r),t.setClearAlpha(a||0),t.clear()),this.scene.overrideMaterial=n,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=d,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){const t=this.scene,n=this._visibilityCache;t.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,n.push(i))})}_restoreVisibility(){const t=this._visibilityCache;for(let n=0;n<t.length;n++)t[n].visible=!0;t.length=0}_generateNoise(t=64){const n=new hd,i=t*t*4,r=new Uint8Array(i);for(let o=0;o<t;o++)for(let d=0;d<t;d++){const R=o,m=d;r[(o*t+d)*4]=(n.noise(R,m)*.5+.5)*255,r[(o*t+d)*4+1]=(n.noise(R+t,m)*.5+.5)*255,r[(o*t+d)*4+2]=(n.noise(R,m+t)*.5+.5)*255,r[(o*t+d)*4+3]=(n.noise(R+t,m+t)*.5+.5)*255}const a=new mi(r,t,t,Xt,yt);return a.wrapS=Mn,a.wrapT=Mn,a.needsUpdate=!0,a}}Ht.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};const pd={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ke(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Tn extends dn{constructor(t,n=1,i,r){super(),this.strength=n,this.radius=i,this.threshold=r,this.resolution=t!==void 0?new Oe(t.x,t.y):new Oe(256,256),this.clearColor=new Ke(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Tt(a,o,{type:bt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let b=0;b<this.nMips;b++){const C=new Tt(a,o,{type:bt,depthBuffer:!1});C.texture.name="UnrealBloomPass.h"+b,C.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(C);const S=new Tt(a,o,{type:bt,depthBuffer:!1});S.texture.name="UnrealBloomPass.v"+b,S.texture.generateMipmaps=!1,this.renderTargetsVertical.push(S),a=Math.round(a/2),o=Math.round(o/2)}const d=pd;this.highPassUniforms=kt.clone(d.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new _t({uniforms:this.highPassUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader}),this.separableBlurMaterials=[];const R=[6,10,14,18,22];a=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let b=0;b<this.nMips;b++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(R[b])),this.separableBlurMaterials[b].uniforms.invSize.value=new Oe(1/a,1/o),a=Math.round(a/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;const m=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=m,this.bloomTintColors=[new be(1,1,1),new be(1,1,1),new be(1,1,1),new be(1,1,1),new be(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=kt.clone(nn.uniforms),this.blendMaterial=new _t({uniforms:this.copyUniforms,vertexShader:nn.vertexShader,fragmentShader:nn.fragmentShader,premultipliedAlpha:!0,blending:fi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ke,this._oldClearAlpha=1,this._basic=new Qo,this._fsQuad=new vi(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,n){let i=Math.round(t/2),r=Math.round(n/2);this.renderTargetBright.setSize(i,r);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,r),this.renderTargetsVertical[a].setSize(i,r),this.separableBlurMaterials[a].uniforms.invSize.value=new Oe(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(t,n,i,r,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let d=this.renderTargetBright;for(let R=0;R<this.nMips;R++)this._fsQuad.material=this.separableBlurMaterials[R],this.separableBlurMaterials[R].uniforms.colorTexture.value=d.texture,this.separableBlurMaterials[R].uniforms.direction.value=Tn.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[R]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[R].uniforms.colorTexture.value=this.renderTargetsHorizontal[R].texture,this.separableBlurMaterials[R].uniforms.direction.value=Tn.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[R]),t.clear(),this._fsQuad.render(t),d=this.renderTargetsVertical[R];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){const n=[],i=t/3;for(let o=0;o<t;o++)n.push(.39894*Math.exp(-.5*o*o/(i*i))/i);const r=[],a=[];for(let o=1;o<t;o+=2){const d=n[o],R=o+1<t?n[o+1]:0,m=d+R;r.push((o*d+(o+1)*R)/m),a.push(m)}return new _t({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new Oe(.5,.5)},direction:{value:new Oe(.5,.5)},centerWeight:{value:n[0]},gaussianOffsets:{value:r},gaussianWeights:{value:a}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new _t({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}Tn.BlurDirectionX=new Oe(1,0);Tn.BlurDirectionY=new Oe(0,1);export{Sd as E,vi as F,Ht as G,vd as O,Hn as P,Cr as R,Tn as U,_d as W,Ed as a,dn as b,gd as m};
