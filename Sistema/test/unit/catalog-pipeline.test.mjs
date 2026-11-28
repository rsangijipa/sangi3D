import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const TMP_BASE = path.join(ROOT, '.tmp', 'unit-catalog-pipeline');
const createdDirs = [];

function makeTempWorkspace(name) {
  const dir = path.join(TMP_BASE, `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  fs.mkdirSync(dir, { recursive: true });
  createdDirs.push(dir);
  return dir;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

afterEach(() => {
  while (createdDirs.length) fs.rmSync(createdDirs.pop(), { recursive: true, force: true });
  if (fs.existsSync(TMP_BASE) && fs.readdirSync(TMP_BASE).length === 0) fs.rmSync(TMP_BASE, { recursive: true, force: true });
});

describe('Catalog & Build Pipeline (catalog.mjs, verify-catalog, prepare-online-build)', () => {
  it('scanCatalog lê só Jogos/, detecta capas .png/.webp, aplica overrides e estabiliza mtime por contentHash', async () => {
    const ws = makeTempWorkspace('scan');
    const capas = path.join(ws, 'Sistema', 'launcher', 'capas');
    write(path.join(ws, 'Sistema', 'launcher', 'index.html'), '<title>Ambientes</title>');
    write(path.join(ws, 'Jogos', '4 - Kit 17 Jogos', '04-observatorio-da-luz', 'index.html'), '<title>Observatório da Luz</title>');
    write(path.join(ws, 'Jogos', '1 - Jogos HTML', 'observatorio-da-luz', 'index.html'), '<title>Observatório da Luz</title>');
    write(path.join(ws, 'Jogos', '1 - Jogos HTML', 'oficina-do-ritmo', 'oficina-do-ritmo.html'), '<title>Oficina do Ritmo Compartilhado</title>');
    write(path.join(capas, '4-kit-17-jogos-04-observatorio-da-luz.webp'), 'fake-webp');
    write(path.join(capas, '1-jogos-html-observatorio-da-luz-index-html.png'), 'fake-png');

    const { scanCatalog } = await import('../../scripts/lib/catalog.mjs');
    const first = await scanCatalog({ rootDir: ws, coverDir: capas, staticMode: true });

    assert.equal(first.apps.length, 3, 'Somente os jogos de Jogos/ entram no catálogo');
    const obsCanon = first.apps.find((a) => a.id === '4-kit-17-jogos-04-observatorio-da-luz');
    const obsVar = first.apps.find((a) => a.id === '1-jogos-html-observatorio-da-luz-index-html');
    const ritmo = first.apps.find((a) => a.id === '1-jogos-html-oficina-do-ritmo-oficina-do-ritmo-html');

    assert.equal(obsCanon.name, 'Observatório da Luz');
    assert.equal(obsCanon.kind, 'html');
    assert.equal(obsCanon.isConcept, false);
    assert.equal(obsCanon.canonicalRole, 'canonical');
    assert.equal(obsCanon.collection, 'Kit 17 jogos 3D');

    assert.equal(obsVar.name, 'Observatório da Luz (HTML)');
    assert.equal(obsVar.canonicalRole, 'variant');
    assert.equal(obsVar.collection, 'Ambientes avulsos');
    assert.equal(obsVar.thumb, '/launcher/capas/1-jogos-html-observatorio-da-luz-index-html.png');

    assert.equal(ritmo.gateBlocker, 'T19');

    const obsFile = path.join(ws, 'Jogos', '4 - Kit 17 Jogos', '04-observatorio-da-luz', 'index.html');
    const future = new Date(Date.now() + 60000);
    fs.utimesSync(obsFile, future, future);
    const second = await scanCatalog({ rootDir: ws, coverDir: capas, staticMode: true, existingCatalog: first.apps });
    assert.equal(second.apps.find((a) => a.id === obsCanon.id).mtime, obsCanon.mtime, 'mtime estável quando o conteúdo não muda');
  });

  it('mantém a Agência Postal como variante com identidade própria sem depender da data dos arquivos', async () => {
    const ws = makeTempWorkspace('correios');
    const games = path.join(ws, 'Jogos', '1 - Jogos HTML');
    const title = '<title>Correio das Palavras Não Ditas</title>';
    const active = path.join(games, 'correio-das-palavras-nao-ditas', 'correio_das_palavras_n_o_ditas_3d_jardins_do_sentir.html');
    const agency = path.join(games, 'correio-das-palavras-nao-ditas-agencia-postal', 'correio_das_palavras_n_o_ditas_ag_ncia_postal_3d_fotorrealista.html');
    const legacy = path.join(ws, 'Jogos', '9 - Arquivados', 'correio-das-palavras-nao-ditas.html');
    write(active, title);
    write(agency, title);
    write(legacy, title);
    const { scanCatalog } = await import('../../scripts/lib/catalog.mjs');

    for (const [staticMode, newest] of [[false, legacy], [true, agency]]) {
      const future = new Date(Date.now() + 60000);
      fs.utimesSync(newest, future, future);
      const { apps } = await scanCatalog({ rootDir: ws, staticMode });
      assert.equal(apps.length, 3);
      const original = apps.find((app) => app.name === 'Correio das Palavras Não Ditas' && app.collection !== 'Legado arquivado');
      const variant = apps.find((app) => app.name === 'Correio das Palavras Não Ditas — Agência Postal');
      assert.ok(original && variant);
      assert.equal(variant.variantOf, original.id);
      assert.equal(variant.canonicalRole, 'variant');
      assert.match(decodeURIComponent(variant.url), /\/correio-das-palavras-nao-ditas-agencia-postal\//);
    }
  });

  it('verifyCatalog aponta conceito+pronto, capa ausente, nome duplicado, arquivo ausente e cópia de shared desatualizada', async () => {
    const ws = makeTempWorkspace('verify');
    write(path.join(ws, 'Jogos', '1 - Jogos HTML', 'app1', 'index.html'), '<html>app1</html>');
    write(path.join(ws, 'Jogos', '1 - Jogos HTML', 'shared', 'imersivo.js'), '// cópia antiga');
    write(path.join(ws, 'Sistema', 'shared', 'imersivo.js'), '// original');
    const catalog = [
      { id: 'app1', name: 'App Um', collection: 'Ambientes avulsos', kind: 'concept', isConcept: true, status: 'ready',
        url: '/Jogos/1%20-%20Jogos%20HTML/app1/index.html', path: 'Jogos\\1 - Jogos HTML\\app1\\index.html', thumb: null },
      { id: 'p1', name: 'App Um', collection: 'Projetos 3D', kind: 'project', status: 'ready',
        url: '/Jogos/2%20-%20Projetos/p1/dist/index.html', path: 'Jogos\\2 - Projetos\\p1', thumb: '/launcher/capas/missing.webp' },
    ];
    write(path.join(ws, 'Sistema', 'api', 'apps.json'), JSON.stringify(catalog, null, 2));

    const { verifyCatalog } = await import('../../scripts/verify-catalog.mjs');
    const { errors } = verifyCatalog({ rootDir: ws, quiet: true });
    assert.ok(errors.some((e) => /concept/i.test(e)), errors.join(' | '));
    assert.ok(errors.some((e) => /capa/i.test(e)), errors.join(' | '));
    assert.ok(errors.some((e) => /duplicado/i.test(e)), errors.join(' | '));
    assert.ok(errors.some((e) => /dist\/index\.html ausente/i.test(e)), errors.join(' | '));
    assert.ok(errors.some((e) => /Cópia desatualizada/i.test(e)), errors.join(' | '));
  });

  it('prepareOnlineBuild monta Publicacao_Online com launcher, Jogos e Sistema/shared, remove sobras e grava o catálogo', async () => {
    const ws = makeTempWorkspace('prepare');
    const out = path.join(ws, 'Publicacao_Online');
    const vercel = '{"rewrites":[{"source":"/api/apps","destination":"/api/apps.json"}]}';
    write(path.join(ws, 'Sistema', 'launcher', 'index.html'), '<html>launcher-ui</html>');
    write(path.join(ws, 'Sistema', 'launcher', 'vercel.json'), vercel);
    write(path.join(ws, 'Sistema', 'launcher', 'capas', '1-jogos-html-demo-index-html.png'), 'png');
    write(path.join(ws, 'Sistema', 'shared', 'imersivo.js'), '// original imersivo');
    write(path.join(ws, 'Sistema', 'shared', 'sangi-bridge.js'), '// original bridge');
    write(path.join(ws, 'Sistema', 'shared', 'engine', 'renderer.js'), '// renderer');
    write(path.join(ws, 'Jogos', '1 - Jogos HTML', 'demo', 'index.html'), '<title>Demo</title>');
    write(path.join(ws, 'Jogos', '9 - Arquivados', 'shared', 'imersivo.js'), '// velho');
    write(path.join(out, 'sobra.txt'), 'stale');
    write(path.join(out, 'Jogos', 'pasta-antiga', 'old.html'), 'stale');

    const { prepareOnlineBuild } = await import('../../scripts/prepare-online-build.mjs');
    await prepareOnlineBuild({ rootDir: ws, noBuild: true, quiet: true });

    assert.equal(fs.existsSync(path.join(out, 'sobra.txt')), false, 'Arquivo que sobrou deve sair');
    assert.equal(fs.existsSync(path.join(out, 'Jogos', 'pasta-antiga')), false, 'Pasta que sobrou deve sair');
    assert.equal(fs.readFileSync(path.join(out, 'vercel.json'), 'utf8'), vercel);
    assert.equal(fs.readFileSync(path.join(out, 'index.html'), 'utf8'), '<html>launcher-ui</html>');
    assert.ok(fs.existsSync(path.join(out, 'capas', '1-jogos-html-demo-index-html.png')));
    assert.ok(fs.existsSync(path.join(out, 'Jogos', '1 - Jogos HTML', 'demo', 'index.html')));
    assert.equal(fs.readFileSync(path.join(out, 'Sistema', 'shared', 'engine', 'renderer.js'), 'utf8'), '// renderer');
    assert.equal(fs.readFileSync(path.join(ws, 'Jogos', '1 - Jogos HTML', 'shared', 'sangi-bridge.js'), 'utf8'), '// original bridge');
    assert.equal(fs.readFileSync(path.join(ws, 'Jogos', '9 - Arquivados', 'shared', 'imersivo.js'), 'utf8'), '// original imersivo');
    assert.equal(
      fs.readFileSync(path.join(ws, 'Sistema', 'api', 'apps.json'), 'utf8'),
      fs.readFileSync(path.join(out, 'api', 'apps.json'), 'utf8'),
    );
  });
});
