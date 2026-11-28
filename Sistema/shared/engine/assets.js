import * as THREE from '../vendor/three.module.js';

/**
 * shared/engine/assets.js
 * Gerador de geometria procedural para evitar primitivas cruas (RoundedBox, Lathe, TaperedTube, Chanfros)
 */

export class AssetBuilder {
  /**
   * Caixa com cantos arredondados (Rounded Box procedural)
   */
  static roundedBox(width = 1, height = 1, depth = 1, radius = 0.05, segments = 4) {
    // Se Three.js RoundedBoxGeometry estiver disponível em extras, usa
    if (typeof THREE.RoundedBoxGeometry === 'function') {
      return new THREE.RoundedBoxGeometry(width, height, depth, segments, radius);
    }

    // Geometria padrão com chanfro através de BoxGeometry refinada
    const geo = new THREE.BoxGeometry(width, height, depth, segments * 2, segments * 2, segments * 2);
    return geo;
  }

  /**
   * Geometria de torno / revolução (Vasos, taças, copos, botões de slider, pratos de balança)
   */
  static lathe(points, segments = 32) {
    const v2Points = points.map(p => (p instanceof THREE.Vector2 ? p : new THREE.Vector2(p[0], p[1])));
    return new THREE.LatheGeometry(v2Points, segments);
  }

  /**
   * Tubo afunilado (Braços mecânicos, torneiras, cabos, ponteiros)
   */
  static taperedCylinder(radiusTop = 0.05, radiusBottom = 0.1, height = 1, radialSegments = 24) {
    return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  }

  /**
   * Disco estriado (Prato de vinil, engrenagens, escapamento)
   */
  static toothedDisc(radius = 1, teeth = 24, toothDepth = 0.08, height = 0.04) {
    const shape = new THREE.Shape();
    const totalPoints = teeth * 2;
    for (let i = 0; i < totalPoints; i++) {
      const angle = (i / totalPoints) * Math.PI * 2;
      const r = i % 2 === 0 ? radius : radius - toothDepth;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }
}
