import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { before, after, test } from 'node:test';

const games = [
  ['oficina-das-bolhas', 'Oficina das Bolhas'],
  ['universo-de-uma-gota', 'Universo de uma Gota'],
  ['oficina-de-mosaicos', 'Oficina de Mosaicos'],
];
let launcher;
let base;

before(async () => {
  const probe = createServer().listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const { port } = probe.address();
  await new Promise((resolve) => probe.close(resolve));
  launcher = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild']);
  base = `http://127.0.0.1:${port}`;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Launcher indisponível')), 15_000);
    launcher.once('error', (error) => { clearTimeout(timeout); reject(error); });
    launcher.stdout.on('data', (chunk) => {
      if (String(chunk).includes(base)) { clearTimeout(timeout); resolve(); }
    });
  });
});

after(() => launcher?.kill());

for (const [slug, title] of games) {
  test(`${title} está disponível pelo launcher com seu título e recursos locais`, async () => {
    const apps = await (await fetch(`${base}/api/apps`)).json();
    const app = apps.find((item) => item.id.endsWith(`-${slug}-index-html`));
    assert.ok(app, `Entrada ausente para ${title}`);
    assert.equal(app.name, title);
    assert.equal(app.status, 'ready');
    const page = await fetch(new URL(app.url, base));
    assert.equal(page.status, 200);
    assert.match(await page.text(), new RegExp(`<title>${title}`));
    for (const resource of [app.thumb, '/Sistema/shared/sangi-workbench.js', '/Sistema/shared/vendor/three.module.js']) {
      assert.ok(resource, `Recurso ausente em ${title}`);
      const response = await fetch(new URL(resource, base));
      assert.equal(response.status, 200, resource);
      await response.body.cancel();
    }
  });
}
