#!/usr/bin/env node
// test/v2-qa-runner.mjs
// Harness automatizado de baseline e QA para o Sangi3D Production v2.
import fs from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/playwright-resolver.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const VIEWPORTS = {
  'desktop-1920': { name: 'desktop-1920', width: 1920, height: 1080, isMobile: false, hasTouch: false },
  'desktop-1366': { name: 'desktop-1366', width: 1366, height: 768, isMobile: false, hasTouch: false },
  'mobile-360': { name: 'mobile-360', width: 360, height: 640, isMobile: true, hasTouch: true },
  'mobile-390': { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  'tablet-768': { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
};

function parseCliArgs(argv) {
  const opts = {
    ids: [],
    url: null,
    collection: null,
    all: false,
    out: path.join(ROOT, '.tmp', 'v2-qa'),
    viewports: null,
    gpu: 'auto',
    duration: 2500,
    port: 5299,
    offline: false,
    viaLauncher: false,
    captureCovers: null,
    strictLifecycle: false,
    json: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--id=')) {
      opts.ids.push(...arg.slice(5).split(',').map((s) => s.trim()).filter(Boolean));
    } else if (arg.startsWith('--url=')) {
      opts.url = arg.slice(6).trim();
    } else if (arg.startsWith('--collection=')) {
      opts.collection = arg.slice(13).trim();
    } else if (arg === '--all') {
      opts.all = true;
    } else if (arg.startsWith('--out=')) {
      opts.out = path.resolve(ROOT, arg.slice(6).trim());
    } else if (arg.startsWith('--viewports=')) {
      const val = arg.slice(12).trim();
      opts.viewports = val === 'all' ? Object.keys(VIEWPORTS) : val.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (arg.startsWith('--gpu=')) {
      opts.gpu = arg.slice(6).trim();
    } else if (arg.startsWith('--duration=')) {
      opts.duration = Math.max(400, Number(arg.slice(11)) || 2500);
    } else if (arg.startsWith('--port=')) {
      opts.port = Number(arg.slice(7)) || 5299;
    } else if (arg === '--offline') {
      opts.offline = true;
    } else if (arg === '--via-launcher') {
      opts.viaLauncher = true;
    } else if (arg === '--capture-covers') {
      opts.captureCovers = path.join(ROOT, 'Sistema', 'launcher', 'capas');
    } else if (arg.startsWith('--capture-covers=')) {
      opts.captureCovers = path.resolve(ROOT, arg.slice(17).trim());
    } else if (arg === '--strict-lifecycle') {
      opts.strictLifecycle = true;
    } else if (arg === '--json') {
      opts.json = true;
    }
  }

  if (!opts.viewports) {
    opts.viewports = opts.captureCovers ? [] : Object.keys(VIEWPORTS);
  }

  return opts;
}

function startLauncherServer(port) {
  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        server.kill();
        reject(new Error(`Timeout iniciando launcher/server.mjs na porta ${port}`));
      }
    }, 12000);

    server.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      const m = text.match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (m && !resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({ server, baseUrl: `http://127.0.0.1:${m[1]}` });
      }
    });

    server.stderr.on('data', (chunk) => {
      const text = chunk.toString().trim();
      if (text && !resolved) {
        // log stderr only if it causes startup failure
      }
    });

    server.on('exit', (code) => {
      if (!resolved) {
        clearTimeout(timer);
        reject(new Error(`launcher/server.mjs encerrou prematuramente (código ${code})`));
      }
    });
  });
}

function buildInitScript() {
  return () => {
    const qa = {
      drawCalls: 0,
      triangles: 0,
      frameDrawCalls: 0,
      frameTriangles: 0,
      rafTicks: 0,
      rafTicksAfterDispose: 0,
      measuringDispose: false,
      activeRafIds: new Set(),
      audioContexts: [],
      listenerCount: 0,
      listenerAdded: 0,
      listenerRemoved: 0,
      bridgeEvents: [],
    };
    window.__SANGI_QA_PROBE__ = qa;

    const origRaf = window.requestAnimationFrame.bind(window);
    const origCancelRaf = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = function (cb) {
      let id;
      id = origRaf((ts) => {
        qa.activeRafIds.delete(id);
        qa.rafTicks++;
        if (qa.measuringDispose) qa.rafTicksAfterDispose++;
        return cb(ts);
      });
      qa.activeRafIds.add(id);
      return id;
    };
    window.cancelAnimationFrame = function (id) {
      qa.activeRafIds.delete(id);
      return origCancelRaf(id);
    };

    const countTriangles = (mode, count) => {
      if (!count || count <= 0) return 0;
      if (mode === 4) return Math.floor(count / 3); // TRIANGLES
      if (mode === 5 || mode === 6) return Math.max(0, count - 2); // TRIANGLE_STRIP / TRIANGLE_FAN
      return 0;
    };

    const hookWebGL = (Proto) => {
      if (!Proto) return;
      for (const fnName of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements']) {
        const orig = Proto[fnName];
        if (typeof orig !== 'function') continue;
        Proto[fnName] = function (...args) {
          qa.drawCalls++;
          qa.frameDrawCalls++;
          const mode = args[0];
          let count = 0;
          let instances = 1;
          if (fnName === 'drawArrays') count = args[2];
          else if (fnName === 'drawElements') count = args[1];
          else if (fnName === 'drawArraysInstanced') { count = args[2]; instances = args[3] || 1; }
          else if (fnName === 'drawElementsInstanced') { count = args[1]; instances = args[4] || 1; }
          else if (fnName === 'drawRangeElements') count = args[3];
          qa.triangles += countTriangles(mode, count) * Math.max(1, instances);
          qa.frameTriangles += countTriangles(mode, count) * Math.max(1, instances);
          return orig.apply(this, args);
        };
      }
    };
    if (typeof WebGLRenderingContext !== 'undefined') hookWebGL(WebGLRenderingContext.prototype);
    if (typeof WebGL2RenderingContext !== 'undefined') hookWebGL(WebGL2RenderingContext.prototype);

    const wrapAudio = (name) => {
      const Orig = window[name];
      if (typeof Orig !== 'function') return;
      window[name] = function (...args) {
        const ctx = new Orig(...args);
        qa.audioContexts.push(ctx);
        return ctx;
      };
      window[name].prototype = Orig.prototype;
    };
    wrapAudio('AudioContext');
    wrapAudio('webkitAudioContext');

    const origAdd = EventTarget.prototype.addEventListener;
    const origRem = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (this === window || this === document || this?.tagName === 'CANVAS') {
        qa.listenerAdded++;
        qa.listenerCount++;
      }
      return origAdd.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      if (this === window || this === document || this?.tagName === 'CANVAS') {
        qa.listenerRemoved++;
        qa.listenerCount = Math.max(0, qa.listenerCount - 1);
      }
      return origRem.call(this, type, listener, options);
    };
  };
}

function getTargetFrame(page, appUrl, viaLauncher) {
  if (!viaLauncher) return page.mainFrame();
  const frames = page.frames();
  const cleanUrl = (appUrl || '').split('?')[0].split('#')[0];
  return frames.find((f) => f !== page.mainFrame() && f.url().includes(cleanUrl)) || frames[1] || page.mainFrame();
}

async function runInputCheck(page, targetFrame, vp) {
  const result = { ok: true, pointerTested: false, keyboardTested: false, details: [] };
  try {
    const box = await targetFrame.evaluate(() => {
      const c = document.querySelector('canvas');
      if (c) {
        const r = c.getBoundingClientRect();
        if (r.width > 10 && r.height > 10) return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
      }
      return { x: window.innerWidth / 2, y: window.innerHeight / 2, w: window.innerWidth, h: window.innerHeight };
    });

    const cx = Math.max(20, Math.min(vp.width - 20, box.x));
    const cy = Math.max(20, Math.min(vp.height - 20, box.y));

    if (vp.isMobile) {
      await page.touchscreen.tap(cx, cy);
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(Math.min(vp.width - 10, cx + 45), Math.min(vp.height - 10, cy + 20), { steps: 4 });
      await page.mouse.up();
      result.pointerTested = true;
      result.details.push('touch-tap+drag');
    } else {
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(Math.min(vp.width - 10, cx + 60), Math.min(vp.height - 10, cy + 30), { steps: 5 });
      await page.mouse.up();
      await page.mouse.click(cx, cy);
      result.pointerTested = true;
      result.details.push('mouse-drag+click');
    }

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    result.keyboardTested = true;
    result.details.push('keyboard-Tab/Space/ArrowRight');
  } catch (err) {
    result.ok = false;
    result.details.push(err.message);
  }
  return result;
}

async function runLifecycleCheck(targetFrame) {
  const before = await targetFrame.evaluate(() => {
    const qa = window.__SANGI_QA_PROBE__;
    return {
      listenersBefore: qa ? qa.listenerCount : 0,
      audioContextsCreated: qa ? qa.audioContexts.length : 0,
    };
  });

  const dispatchCmd = async (command, legacyType, extra = {}) => {
    await targetFrame.evaluate(({ cmd, legacy, ext }) => {
      window.postMessage({ type: 'SANGI_COMMAND', command: cmd, ...ext }, '*');
      if (legacy) window.postMessage({ type: legacy, ...ext }, '*');
    }, { cmd: command, legacy: legacyType, ext: extra });
  };

  await dispatchCmd('PAUSE', 'SANGI_APP_PAUSE');
  await delay(120);
  await dispatchCmd('RESUME', 'SANGI_APP_RESUME');
  await delay(120);
  await dispatchCmd('RESET', 'SANGI_APP_RESET');
  await delay(120);
  await dispatchCmd('DISPOSE', 'SANGI_APP_DISPOSE');
  await delay(180);

  await targetFrame.evaluate(() => {
    const qa = window.__SANGI_QA_PROBE__;
    if (qa) {
      qa.rafTicksAfterDispose = 0;
      qa.measuringDispose = true;
    }
  });
  await delay(250);

  const after = await targetFrame.evaluate(() => {
    const qa = window.__SANGI_QA_PROBE__;
    if (!qa) return null;
    const openAudio = qa.audioContexts.filter((c) => c && c.state !== 'closed').length;
    return {
      listenersAfter: qa.listenerCount,
      openAudioContextsAfterDispose: openAudio,
      rafTicksAfterDispose: qa.rafTicksAfterDispose,
      activeRafRemaining: qa.activeRafIds.size,
    };
  });

  return {
    ...before,
    ...(after || {}),
    listenerNetDelta: after ? after.listenersAfter - before.listenersBefore : 0,
  };
}

async function measureViewport(browser, baseUrl, app, vp, opts) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
  });
  const page = await context.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  const httpErrors = [];
  const requestFailed = [];
  let favicon404 = 0;

  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('requestfailed', (req) => {
    requestFailed.push(`${req.method()} ${req.url()} | ${req.failure()?.errorText || 'failed'}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      if (new URL(res.url()).pathname === '/favicon.ico') {
        favicon404++;
      } else {
        httpErrors.push(`HTTP ${res.status()} ${res.url()}`);
      }
    }
  });

  if (opts.offline) {
    await page.route('**/*', (route) => {
      const reqUrl = route.request().url();
      if (reqUrl.startsWith(baseUrl) || reqUrl.startsWith('data:') || reqUrl.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort();
    });
  }

  await page.addInitScript(buildInitScript());

  const targetUrl = opts.viaLauncher && app.id
    ? `${baseUrl}/#play=${encodeURIComponent(app.id)}`
    : `${baseUrl}${app.direct || app.url}`;

  let screenshotPath = null;
  let metrics = {};
  let canvasInfo = { count: 0, visible: false };
  let inputResult = null;
  let lifecycleResult = null;

  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(700);

    const targetFrame = getTargetFrame(page, app.direct || app.url, opts.viaLauncher);

    // Wait briefly for canvas or draws
    await targetFrame.waitForFunction(() => {
      const c = document.querySelector('canvas');
      const qa = window.__SANGI_QA_PROBE__;
      return Boolean(c) || (qa && qa.drawCalls > 0);
    }, null, { timeout: 10000 }).catch(() => {});

    // Measure FPS / frame times / draw calls over duration
    const beforeSnapshot = await targetFrame.evaluate(() => {
      const qa = window.__SANGI_QA_PROBE__;
      return { drawCalls: qa?.drawCalls || 0, triangles: qa?.triangles || 0 };
    });

    const frameStats = await targetFrame.evaluate((durationMs) => {
      return new Promise((resolve) => {
        const deltas = [];
        let last = performance.now();
        const start = last;
        function step(now) {
          deltas.push(now - last);
          last = now;
          if (now - start >= durationMs) {
            const sorted = [...deltas].sort((a, b) => a - b);
            const sum = deltas.reduce((a, b) => a + b, 0);
            const avg = deltas.length ? sum / deltas.length : 0;
            const p95 = sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : 0;
            const fps = avg > 0 ? 1000 / avg : 0;
            const mem = performance.memory
              ? {
                  heapUsedMB: Number((performance.memory.usedJSHeapSize / 1048576).toFixed(2)),
                  heapTotalMB: Number((performance.memory.totalJSHeapSize / 1048576).toFixed(2)),
                }
              : { heapUsedMB: null, heapTotalMB: null };
            resolve({
              frameCount: deltas.length,
              fps: Number(fps.toFixed(2)),
              avgFrameMs: Number(avg.toFixed(2)),
              p95FrameMs: Number(p95.toFixed(2)),
              sangiQa: window.__SANGI_QA__ || null,
              ...mem,
            });
            return;
          }
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, opts.duration);

    const afterSnapshot = await targetFrame.evaluate(() => {
      const qa = window.__SANGI_QA_PROBE__;
      return { drawCalls: qa?.drawCalls || 0, triangles: qa?.triangles || 0 };
    });

    const framesInWindow = Math.max(1, frameStats.frameCount);
    const windowDrawCalls = Math.max(0, afterSnapshot.drawCalls - beforeSnapshot.drawCalls);
    const windowTriangles = Math.max(0, afterSnapshot.triangles - beforeSnapshot.triangles);

    metrics = {
      ...frameStats,
      totalWindowDrawCalls: windowDrawCalls,
      drawCallsPerFrame: Number((windowDrawCalls / framesInWindow).toFixed(1)),
      trianglesPerFrame: Math.round(windowTriangles / framesInWindow),
    };

    canvasInfo = await targetFrame.evaluate(() => {
      const canvases = [...document.querySelectorAll('canvas')];
      const main = canvases[0];
      if (!main) return { count: 0, visible: false };
      const r = main.getBoundingClientRect();
      const style = getComputedStyle(main);
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      return {
        count: canvases.length,
        visible,
        width: main.width,
        height: main.height,
        clientWidth: main.clientWidth,
        clientHeight: main.clientHeight,
        boundingBox: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) },
      };
    });

    const outDir = path.join(opts.out, app.id || 'custom');
    await mkdir(outDir, { recursive: true });
    screenshotPath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });

    inputResult = await runInputCheck(page, targetFrame, vp);
    lifecycleResult = await runLifecycleCheck(targetFrame);
  } finally {
    await context.close();
  }

  const fatalConsoleErrors = consoleErrors.filter((t) =>
    /ReferenceError|TypeError|SyntaxError|THREE|WebGL|Shader Error|VALIDATE_STATUS|context could not be created/i.test(t)
  );
  const nonFaviconRequestFailed = requestFailed.filter((r) => !/\/favicon\.ico\b/i.test(r));

  const passed =
    pageErrors.length === 0 &&
    fatalConsoleErrors.length === 0 &&
    httpErrors.length === 0 &&
    nonFaviconRequestFailed.length === 0 &&
    (!opts.strictLifecycle ||
      ((lifecycleResult?.openAudioContextsAfterDispose || 0) === 0 &&
        (lifecycleResult?.rafTicksAfterDispose || 0) === 0));

  return {
    viewport: vp.name,
    width: vp.width,
    height: vp.height,
    passed,
    screenshotPath,
    metrics,
    canvas: canvasInfo,
    inputCheck: inputResult,
    lifecycleCheck: lifecycleResult,
    errors: {
      pageErrors,
      consoleErrors,
      fatalConsoleErrors,
      httpErrors,
      requestFailed: nonFaviconRequestFailed,
      favicon404,
    },
  };
}

async function captureCover(browser, baseUrl, app, coverDir, opts) {
  const context = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  if (opts.offline) {
    await page.route('**/*', (route) => {
      const reqUrl = route.request().url();
      return (reqUrl.startsWith(baseUrl) || reqUrl.startsWith('data:') || reqUrl.startsWith('blob:'))
        ? route.continue()
        : route.abort();
    });
  }
  await page.addInitScript(buildInitScript());

  try {
    const targetUrl = `${baseUrl}${app.direct || app.url}`;
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('canvas');
      const qa = window.__SANGI_QA_PROBE__;
      return Boolean(c) && qa && qa.drawCalls > 0;
    }, null, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await mkdir(coverDir, { recursive: true });
    const filePath = path.join(coverDir, `${app.id}.png`);
    await page.screenshot({ path: filePath });
    return { id: app.id, coverPath: filePath, pageErrors };
  } finally {
    await context.close();
  }
}

export async function runQa(rawOpts = {}) {
  const opts = {
    ids: [],
    url: null,
    collection: null,
    all: false,
    out: path.join(ROOT, '.tmp', 'v2-qa'),
    viewports: Object.keys(VIEWPORTS),
    gpu: 'auto',
    duration: 2500,
    port: 5299,
    offline: false,
    viaLauncher: false,
    captureCovers: null,
    strictLifecycle: false,
    json: false,
    ...rawOpts,
  };

  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'Sistema', 'api', 'apps.json'), 'utf8'));
  let targets = [];

  if (opts.url) {
    targets = [{ id: 'custom-url', name: opts.url, url: opts.url, direct: opts.url, status: 'ready' }];
  } else if (opts.ids.length) {
    targets = opts.ids.map((id) => {
      const match = catalog.find((a) => a.id === id);
      if (!match) throw new Error(`App id não encontrado no catálogo: ${id}`);
      return match;
    });
  } else if (opts.collection) {
    targets = catalog.filter((a) => a.status === 'ready' && a.collection.toLowerCase() === opts.collection.toLowerCase());
  } else if (opts.all) {
    targets = catalog.filter((a) => a.status === 'ready' && a.url);
  } else {
    throw new Error('Informe --id=..., --url=..., --collection=..., ou --all');
  }

  const { server, baseUrl } = await startLauncherServer(opts.port);
  const { browser, gpuMode, resolvedFrom } = await launchBrowser({ gpu: opts.gpu, headless: true });

  const results = [];
  const covers = [];
  try {
    for (const app of targets) {
      if (opts.captureCovers) {
        const cap = await captureCover(browser, baseUrl, app, opts.captureCovers, opts);
        covers.push(cap);
      }
      const vpResults = [];
      for (const vpName of opts.viewports) {
        const vp = VIEWPORTS[vpName];
        if (!vp) throw new Error(`Viewport desconhecido: ${vpName}`);
        vpResults.push(await measureViewport(browser, baseUrl, app, vp, opts));
      }
      results.push({
        id: app.id,
        name: app.name,
        collection: app.collection,
        url: app.direct || app.url,
        passed: vpResults.every((r) => r.passed),
        viewports: vpResults,
      });
    }
  } finally {
    await browser.close();
    server.kill();
  }

  const report = {
    timestamp: new Date().toISOString(),
    gpuRequested: opts.gpu,
    gpuMode,
    playwrightResolvedFrom: resolvedFrom,
    totalApps: results.length,
    passedApps: results.filter((r) => r.passed).length,
    covers,
    results,
  };

  await mkdir(opts.out, { recursive: true });
  await writeFile(path.join(opts.out, 'qa-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const opts = parseCliArgs(process.argv.slice(2));
  runQa(opts)
    .then((report) => {
      if (opts.json) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(`QA Runner (${report.gpuMode}, playwright=${report.playwrightResolvedFrom}): ${report.passedApps}/${report.totalApps} apps aprovados.`);
        for (const c of report.covers) {
          console.log(`📸 Capa capturada: ${path.relative(ROOT, c.coverPath)} (pageErrors=${c.pageErrors.length})`);
        }
        for (const app of report.results) {
          for (const vp of app.viewports) {
            const flag = vp.passed ? '✅' : '❌';
            console.log(
              `${flag} ${app.id} [${vp.viewport}] fps=${vp.metrics.fps} avg=${vp.metrics.avgFrameMs}ms p95=${vp.metrics.p95FrameMs}ms draws=${vp.metrics.drawCallsPerFrame} tris=${vp.metrics.trianglesPerFrame} canvas=${vp.canvas.visible} err=${vp.errors.pageErrors.length + vp.errors.fatalConsoleErrors.length + vp.errors.httpErrors.length}`
            );
          }
        }
      }
      const hasCoverErr = report.covers.some((c) => c.pageErrors.length > 0);
      const ok = report.passedApps === report.totalApps && !hasCoverErr;
      process.exit(ok ? 0 : 1);
    })
    .catch((err) => {
      console.error('❌ Erro em v2-qa-runner:', err.message || err);
      process.exit(1);
    });
}
