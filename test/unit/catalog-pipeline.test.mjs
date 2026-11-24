import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TMP_BASE = path.join(ROOT, '.tmp', 'unit-catalog-pipeline');
const createdDirs = [];

function makeTempWorkspace(name) {
  const dir = path.join(TMP_BASE, `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  fs.mkdirSync(dir, { recursive: true });
  createdDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (createdDirs.length) {
    const dir = createdDirs.pop();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (fs.existsSync(TMP_BASE) && fs.readdirSync(TMP_BASE).length === 0) {
    fs.rmSync(TMP_BASE, { recursive: true, force: true });
  }
});

describe('Catalog & Build Pipeline (scripts/lib/catalog.mjs, verify-catalog, prepare-online-build)', () => {
  it('scanCatalog detects .png/.webp covers, applies canonical overrides, and stabilizes mtime by contentHash', async () => {
    const ws = makeTempWorkspace('scan');
    fs.mkdirSync(path.join(ws, 'launcher', 'capas'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'Kit_17_jogos_3D_mockups_e_prompts', '04-observatorio-da-luz'), { recursive: true });
    fs.mkdirSync(path.join(ws, '01_Jogos_HTML', 'observatorio-da-luz'), { recursive: true });
    fs.mkdirSync(path.join(ws, '01_Jogos_HTML', 'oficina-do-ritmo'), { recursive: true });

    fs.writeFileSync(path.join(ws, 'index.html'), '<title>Ambientes</title>');
    fs.writeFileSync(
      path.join(ws, 'Kit_17_jogos_3D_mockups_e_prompts', '04-observatorio-da-luz', 'index.html'),
      '<title>Observatório da Luz</title>'
    );
    fs.writeFileSync(
      path.join(ws, '01_Jogos_HTML', 'observatorio-da-luz', 'index.html'),
      '<title>Observatório da Luz</title>'
    );
    fs.writeFileSync(
      path.join(ws, '01_Jogos_HTML', 'oficina-do-ritmo', 'oficina-do-ritmo.html'),
      '<title>Oficina do Ritmo Compartilhado</title>'
    );
    fs.writeFileSync(
      path.join(ws, 'launcher', 'capas', 'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz.webp'),
      'fake-webp'
    );
    fs.writeFileSync(
      path.join(ws, 'launcher', 'capas', '01_jogos_html-observatorio-da-luz-index-html.png'),
      'fake-png'
    );

    const { scanCatalog } = await import('../../scripts/lib/catalog.mjs');
    const first = await scanCatalog({
      rootDir: ws,
      coverDir: path.join(ws, 'launcher', 'capas'),
      staticMode: true
    });

    assert.equal(first.apps.some((a) => a.name === 'Ambientes' || a.url === '/index.html'), false);
    const obsCanon = first.apps.find((a) => a.id === 'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz');
    const obsVar = first.apps.find((a) => a.id === '01_jogos_html-observatorio-da-luz-index-html');
    const ritmo = first.apps.find((a) => a.id === '01_jogos_html-oficina-do-ritmo-oficina-do-ritmo-html');

    assert.equal(obsCanon.name, 'Observatório da Luz');
    assert.equal(obsCanon.kind, 'html');
    assert.equal(obsCanon.isConcept, false);
    assert.equal(obsCanon.canonicalRole, 'canonical');

    assert.equal(obsVar.name, 'Observatório da Luz (HTML)');
    assert.equal(obsVar.canonicalRole, 'variant');
    assert.equal(obsVar.thumb, '/launcher/capas/01_jogos_html-observatorio-da-luz-index-html.png');

    assert.equal(ritmo.gateBlocker, 'T19');

    // Touch mtime on disk without changing content -> mtime stays stabilized when existingCatalog is passed
    const obsFile = path.join(ws, 'Kit_17_jogos_3D_mockups_e_prompts', '04-observatorio-da-luz', 'index.html');
    const future = new Date(Date.now() + 60000);
    fs.utimesSync(obsFile, future, future);

    const second = await scanCatalog({
      rootDir: ws,
      coverDir: path.join(ws, 'launcher', 'capas'),
      staticMode: true,
      existingCatalog: first.apps
    });
    const obsCanon2 = second.apps.find((a) => a.id === obsCanon.id);
    assert.equal(obsCanon2.mtime, obsCanon.mtime, 'mtime must stay stabilized when contentHash matches');
  });

  it('verifyCatalog reports errors on drift, concept+ready contradiction, missing thumb, and orphaned launcher assets', async () => {
    const ws = makeTempWorkspace('verify');
    fs.mkdirSync(path.join(ws, 'api'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', 'api'), { recursive: true });
    fs.mkdirSync(path.join(ws, '01_Jogos_HTML', 'app1'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', '01_Jogos_HTML', 'app1'), { recursive: true });
    fs.mkdirSync(path.join(ws, '02_Projetos', 'p1', 'dist', 'assets'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', '02_Projetos', 'p1', 'dist', 'assets'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', 'capas'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', 'launcher', 'capas'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'shared'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', 'shared'), { recursive: true });
    fs.writeFileSync(path.join(ws, 'index.html'), '<html>root</html>');
    fs.writeFileSync(path.join(ws, 'launcher', 'index.html'), '<html>root</html>');
    fs.writeFileSync(path.join(ws, '01_Jogos_HTML', 'app1', 'index.html'), '<html>app1</html>');
    fs.writeFileSync(path.join(ws, 'launcher', '01_Jogos_HTML', 'app1', 'index.html'), '<html>app1</html>');
    fs.writeFileSync(path.join(ws, '02_Projetos', 'p1', 'dist', 'index.html'), '<html>p1</html>');
    fs.writeFileSync(path.join(ws, 'launcher', '02_Projetos', 'p1', 'dist', 'index.html'), '<html>p1</html>');
    fs.writeFileSync(path.join(ws, 'launcher', '02_Projetos', 'p1', 'dist', 'assets', 'orphan.js'), 'stale');

    const badCatalog = [
      {
        id: 'app1',
        name: 'App Um',
        collection: 'Ambientes avulsos',
        kind: 'concept',
        isConcept: true,
        status: 'ready',
        url: '/01_Jogos_HTML/app1/index.html',
        path: '01_Jogos_HTML\\app1\\index.html',
        thumb: null
      },
      {
        id: 'p1',
        name: 'App Um',
        collection: 'Projetos 3D',
        kind: 'project',
        status: 'ready',
        url: '/02_Projetos/p1/dist/index.html',
        path: '02_Projetos\\p1',
        thumb: '/launcher/capas/missing.webp'
      }
    ];

    fs.writeFileSync(path.join(ws, 'api', 'apps.json'), JSON.stringify(badCatalog, null, 2));
    fs.writeFileSync(path.join(ws, 'launcher', 'api', 'apps.json'), JSON.stringify(badCatalog.slice(0, 1), null, 2));

    const { verifyCatalog } = await import('../../scripts/verify-catalog.mjs');
    const result = verifyCatalog({ rootDir: ws, quiet: true });
    assert.ok(result.errors.length >= 5, `Expected >= 5 errors, got ${result.errors.length}: ${result.errors.join(' | ')}`);
    assert.ok(result.errors.some((e) => /divergem|idêntic|parity|paridade/i.test(e)));
    assert.ok(result.errors.some((e) => /concept/i.test(e)));
    assert.ok(result.errors.some((e) => /thumb|capa/i.test(e)));
    assert.ok(result.errors.some((e) => /duplicado|duplicate/i.test(e)));
    assert.ok(result.errors.some((e) => /órfão|orphan/i.test(e)));
  });

  it('prepareOnlineBuild mirrors 01_Jogos_HTML & shared/*.js, prunes stale launcher files, preserves launcher/vercel.json, and writes identical catalogs', async () => {
    const ws = makeTempWorkspace('prepare');
    fs.mkdirSync(path.join(ws, 'shared', 'engine'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'shared', 'vendor'), { recursive: true });
    fs.mkdirSync(path.join(ws, '01_Jogos_HTML', 'demo'), { recursive: true });
    fs.mkdirSync(path.join(ws, '01_Jogos_HTML', 'Legado_Arquivado', 'ambientes-html', 'shared'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', 'capas'), { recursive: true });
    fs.mkdirSync(path.join(ws, 'launcher', '01_Jogos_HTML', 'stale-dir'), { recursive: true });

    fs.writeFileSync(path.join(ws, 'index.html'), '<html>launcher-ui</html>');
    fs.writeFileSync(path.join(ws, 'launcher', 'vercel.json'), '{"rewrites":[{"source":"/api/apps","destination":"/api/apps.json"}]}');
    fs.writeFileSync(path.join(ws, 'shared', 'imersivo.js'), '// canonical imersivo');
    fs.writeFileSync(path.join(ws, 'shared', 'sangi-bridge.js'), '// canonical bridge');
    fs.writeFileSync(path.join(ws, 'shared', 'ambientes-kit.js'), '// canonical kit');
    fs.writeFileSync(path.join(ws, 'shared', 'engine', 'renderer.js'), '// renderer');
    fs.writeFileSync(path.join(ws, 'shared', 'vendor', 'three.module.js'), '// three');
    fs.writeFileSync(path.join(ws, '01_Jogos_HTML', 'demo', 'index.html'), '<title>Demo</title>');
    fs.writeFileSync(path.join(ws, 'launcher', 'capas', '01_jogos_html-demo-index-html.png'), 'png');
    fs.writeFileSync(path.join(ws, 'launcher', '01_Jogos_HTML', 'stale-dir', 'old.html'), 'stale');

    const { prepareOnlineBuild } = await import('../../scripts/prepare-online-build.mjs');
    await prepareOnlineBuild({ rootDir: ws, noBuild: true, quiet: true });

    assert.equal(fs.existsSync(path.join(ws, 'launcher', '01_Jogos_HTML', 'stale-dir')), false, 'Stale dir in launcher must be pruned');
    assert.equal(fs.readFileSync(path.join(ws, 'launcher', 'vercel.json'), 'utf8'), '{"rewrites":[{"source":"/api/apps","destination":"/api/apps.json"}]}');
    assert.equal(fs.readFileSync(path.join(ws, 'launcher', 'shared', 'ambientes-kit.js'), 'utf8'), '// canonical kit');
    assert.equal(fs.readFileSync(path.join(ws, '01_Jogos_HTML', 'shared', 'sangi-bridge.js'), 'utf8'), '// canonical bridge');
    assert.equal(fs.readFileSync(path.join(ws, 'launcher', '01_Jogos_HTML', 'shared', 'imersivo.js'), 'utf8'), '// canonical imersivo');
    assert.equal(fs.readFileSync(path.join(ws, '01_Jogos_HTML', 'Legado_Arquivado', 'ambientes-html', 'shared', 'imersivo.js'), 'utf8'), '// canonical imersivo');
    assert.equal(
      fs.readFileSync(path.join(ws, 'api', 'apps.json'), 'utf8'),
      fs.readFileSync(path.join(ws, 'launcher', 'api', 'apps.json'), 'utf8'),
      'api/apps.json and launcher/api/apps.json must be byte-identical'
    );
  });
});
