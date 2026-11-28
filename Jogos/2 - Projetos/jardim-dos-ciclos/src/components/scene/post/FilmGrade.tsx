import React, { forwardRef, useMemo } from 'react';
import { BlendFunction, Effect } from 'postprocessing';
import * as THREE from 'three';

/**
 * Gradação filmica estável: saneia NaN/Inf (amostras MSAA de borda),
 * aplica split-toning quente/frio, curva S suave, saturação e grão leve.
 * Todos os pow/sqrt recebem valores com clamp para evitar NaN.
 */
const fragment = /* glsl */ `
uniform float uTime;
uniform float uGrain;
uniform float uSat;
uniform float uContrast;
uniform vec3 uShadowTint;
uniform vec3 uHighTint;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb;
  // Saneia NaN e infinitos antes de qualquer operação
  if (any(notEqual(c, c))) c = vec3(0.0);
  c = clamp(c, 0.0, 1.0);

  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  // Split-toning: sombras levemente verde-azuladas, altas luzes douradas
  c += uShadowTint * (1.0 - smoothstep(0.0, 0.45, l)) * 0.05;
  // Levanta um pouco os pretos para não esmagar a terracota na sombra
  c = c * 0.965 + 0.022;
  c += uHighTint * smoothstep(0.55, 1.0, l) * 0.05;

  // Curva S suave em torno de 0.5
  vec3 s = clamp(c, 0.0, 1.0);
  c = mix(s, s * s * (3.0 - 2.0 * s), uContrast);

  // Saturação
  float l2 = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l2), c, uSat);

  // Grão de filme discreto, mais visível nas sombras
  float g = hash12(uv * vec2(1931.0, 1171.0) + fract(uTime) * 97.0) - 0.5;
  c += g * uGrain * (1.0 - l2 * 0.6);

  outputColor = vec4(clamp(c, 0.0, 1.0), inputColor.a);
}
`;

class FilmGradeImpl extends Effect {
  constructor() {
    super('FilmGrade', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, THREE.Uniform>([
        ['uTime', new THREE.Uniform(0)],
        ['uGrain', new THREE.Uniform(0.035)],
        ['uSat', new THREE.Uniform(1.1)],
        ['uContrast', new THREE.Uniform(0.16)],
        ['uShadowTint', new THREE.Uniform(new THREE.Vector3(-0.2, 0.15, 0.25))],
        ['uHighTint', new THREE.Uniform(new THREE.Vector3(0.3, 0.12, -0.2))],
      ]),
    });
  }

  update(_r: THREE.WebGLRenderer, _i: THREE.WebGLRenderTarget, dt?: number) {
    const u = this.uniforms.get('uTime');
    if (u) u.value = (u.value + (dt ?? 0.016)) % 1000;
  }
}

export const FilmGrade = forwardRef<FilmGradeImpl, { grain?: number }>(({ grain = 0.035 }, ref) => {
  const effect = useMemo(() => new FilmGradeImpl(), []);
  const u = effect.uniforms.get('uGrain');
  if (u) u.value = grain;
  return <primitive ref={ref} object={effect} dispose={null} />;
});
FilmGrade.displayName = 'FilmGrade';
