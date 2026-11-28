import assert from 'node:assert/strict';
import test from 'node:test';
import {ORGANISM_LIST, ORGANISMS, ORGANELLE_CATALOG} from '../js/organisms/organism-registry.js';
import {SAMPLE_LIST, SAMPLES} from '../js/sample-registry.js';
import {OPTIC_MODES} from '../js/optics/optical-shaders.js';

test('Catálogo possui pelo menos 20 organismos com anatomia e referências válidas', () => {
  assert.ok(ORGANISM_LIST.length >= 20, `Esperado >= 20 organismos, encontrado ${ORGANISM_LIST.length}`);
  for (const org of ORGANISM_LIST) {
    assert.ok(org.id && org.name && org.scientificName);
    assert.ok(org.worldSize > 0 && org.sizeUm[0] < org.sizeUm[1]);
    assert.ok(Array.isArray(org.anatomy) && org.anatomy.length >= 2);
    for (const partId of org.anatomy) {
      assert.ok(ORGANELLE_CATALOG[partId], `Organela desconhecida ${partId} em ${org.id}`);
    }
    assert.ok(org.references && org.references.length > 5);
  }
});

test('Catálogo de lâminas possui 10 ambientes coerentes', () => {
  assert.equal(SAMPLE_LIST.length, 10);
  for (const sample of SAMPLE_LIST) {
    assert.ok(sample.id && sample.name && sample.seed > 0);
    assert.ok(Array.isArray(sample.composition) && sample.composition.length >= 5);
    for (const entry of sample.composition) {
      assert.ok(ORGANISMS[entry.speciesId], `Espécie inválida ${entry.speciesId} na amostra ${sample.id}`);
    }
  }
  assert.equal(SAMPLES.experimental.isFictionalMixed, true);
});

test('Modalidades ópticas cobrem os 5 modos esperados', () => {
  const keys = Object.keys(OPTIC_MODES);
  assert.deepEqual(keys, ['darkfield', 'brightfield', 'phase', 'dic', 'fluorescence']);
});
