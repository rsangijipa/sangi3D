/**
 * Shared E2E test harness for Sangi3D Production v2 (opaque-box Playwright + node:test).
 * Must remain strictly read-only toward app code: never mocks or alters app behavior.
 */
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const REPO_ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));

let cachedMainRoot = null;

/**
 * Resolves the main repository root even when running inside a linked git worktree
 * (where gitignored directories like node_modules/ only exist in the main checkout).
 */
export function getMainRepoRoot(repoRoot = REPO_ROOT) {
  if (repoRoot === REPO_ROOT && cachedMainRoot) return cachedMainRoot;

  let resolved = repoRoot;
  try {
    const dotGit = join(repoRoot, '.git');
    if (existsSync(dotGit) && statSync(dotGit).isFile()) {
      const content = readFileSync(dotGit, 'utf8');
      const m = content.match(/^gitdir:\s*(.+)$/m);
      if (m) {
        const gitDir = resolve(repoRoot, m[1].trim());
        const commonDirFile = join(gitDir, 'commondir');
        if (existsSync(commonDirFile)) {
          const commonRel = readFileSync(commonDirFile, 'utf8').trim();
          resolved = dirname(resolve(gitDir, commonRel));
        } else if (/[\\/]worktrees[\\/]/.test(gitDir)) {
          resolved = dirname(resolve(gitDir, '..', '..'));
        }
      }
    }
  } catch {
    // Fallback to git CLI below
  }

  if (resolved === repoRoot) {
    try {
      const out = execFileSync('git', ['rev-parse', '--git-common-dir'], {
        cwd: repoRoot,
        encoding: 'utf8',
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (out) {
        resolved = dirname(resolve(repoRoot, out));
      }
    } catch {
      resolved = repoRoot;
    }
  }

  if (repoRoot === REPO_ROOT) cachedMainRoot = resolved;
  return resolved;
}

export const MAIN_ROOT = getMainRepoRoot(REPO_ROOT);

export const VIEWPORTS = Object.freeze({
  'mobile-360': Object.freeze({ width: 360, height: 640, deviceScaleFactor: 2, hasTouch: true, isMobile: true }),
  'mobile-390': Object.freeze({ width: 390, height: 844, deviceScaleFactor: 3, hasTouch: true, isMobile: true }),
  'tablet-768': Object.freeze({ width: 768, height: 1024, deviceScaleFactor: 2, hasTouch: true, isMobile: false }),
  'desktop-1366': Object.freeze({ width: 1366, height: 768, deviceScaleFactor: 1, hasTouch: false, isMobile: false }),
  'desktop-1920': Object.freeze({ width: 1920, height: 1080, deviceScaleFactor: 1, hasTouch: false, isMobile: false }),
});

export const COLLECTIONS = Object.freeze([
  'Jardins da TCC',
  'Jardins do Sentir',
  'Projetos 3D',
  'Kit 17 jogos 3D',
  'Adultos e marcas',
  'Expressão e desenvolvimento',
  'Ambientes avulsos',
  'Legado arquivado',
]);

export const REPRESENTATIVE_SAMPLES = Object.freeze({
  'Jardins da TCC': {
    primary: '01_jogos_html-escada-da-coragem-escada-da-coragem-html',
    fallback: '01_jogos_html-termometro-da-ansiedade-index-html',
  },
  'Jardins do Sentir': {
    primary: '01_jogos_html-casa-da-arvore-das-emocoes-index-html',
    fallback: '01_jogos_html-cidade-das-conexoes-cidade_das_conex_es_3d_jardins_do_sentir-html',
  },
  'Projetos 3D': {
    primary: '04-tear-dos-vinculos',
    fallback: '02_projetos-territorio-dos-vinculos-index-html',
  },
  'Kit 17 jogos 3D': {
    primary: 'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz',
    fallback: 'kit_17_jogos_3d_mockups_e_prompts-02-atlas-das-texturas',
  },
  'Adultos e marcas': {
    primary: 'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-05_clepsidra-do-foco',
    fallback: 'ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-12_pinball-de-madeira-pinball-de-madeira-html',
  },
  'Expressão e desenvolvimento': {
    primary: '03_colecoes-expressao_e_desenvolvimento-07-sala-das-cadeiras-possiveis',
    fallback: '03_colecoes-expressao_e_desenvolvimento-08-sopraria-das-transformacoes',
  },
  'Ambientes avulsos': {
    primary: '01_jogos_html-lago-3d-interativo-lago-3d-interativo-html',
    fallback: '01_jogos_html-oficina-de-bonsais-oficina-de-bonsais-html-3d-interativo-html',
  },
  'Legado arquivado': {
    primary: '01_jogos_html-legado_arquivado-ambientes-html-santuario-zen-3d-html',
    fallback: '01_jogos_html-legado_arquivado-ambientes-html-vila-dos-encontros-html',
  },
});

const PLAYWRIGHT_ANCHORS = [
  '03_Colecoes/Expressao_e_Desenvolvimento/07-sala-das-cadeiras-possiveis/package.json',
  'Kit_17_jogos_3D_mockups_e_prompts/08-meteorologia-das-emocoes/package.json',
];

/**
 * Resolves Playwright portably across root/worktree checkouts without requiring a root package.json.
 */
export async function resolvePlaywright() {
  const tried = [];
  const envVal = process.env.SANGI_PLAYWRIGHT?.trim();

  if (envVal) {
    tried.push(`env:SANGI_PLAYWRIGHT=${envVal}`);
    try {
      const candidate = resolve(REPO_ROOT, envVal);
      const mod = existsSync(candidate)
        ? await import(pathToFileURL(candidate).href)
        : await import(envVal);
      if (mod?.chromium) return { chromium: mod.chromium, source: `SANGI_PLAYWRIGHT:${envVal}` };
      if (mod?.default?.chromium) return { chromium: mod.default.chromium, source: `SANGI_PLAYWRIGHT:${envVal}` };
    } catch {
      try {
        const req = createRequire(import.meta.url);
        const mod = req(envVal);
        if (mod?.chromium) return { chromium: mod.chromium, source: `SANGI_PLAYWRIGHT(cjs):${envVal}` };
      } catch {
        // continue
      }
    }
  }

  const roots = MAIN_ROOT !== REPO_ROOT ? [REPO_ROOT, MAIN_ROOT] : [REPO_ROOT];
  for (const root of roots) {
    for (const relPkg of PLAYWRIGHT_ANCHORS) {
      const anchor = join(root, relPkg);
      tried.push(anchor);
      if (!existsSync(anchor)) continue;
      try {
        const req = createRequire(anchor);
        const mod = req('playwright');
        if (mod?.chromium) {
          return { chromium: mod.chromium, source: anchor };
        }
      } catch {
        // node_modules likely absent in worktree; fall through to MAIN_ROOT
      }
    }
  }

  tried.push('global:playwright');
  try {
    const mod = await import('playwright');
    const chromium = mod?.chromium ?? mod?.default?.chromium;
    if (chromium) return { chromium, source: 'global:playwright' };
  } catch {
    // fall through
  }

  throw new Error(`Playwright não encontrado. Tentativas: ${tried.join('; ')}. Defina SANGI_PLAYWRIGHT.`);
}

/**
 * Spawns launcher/server.mjs on an ephemeral port, waits for stdout URL + /api/apps 200,
 * and guarantees clean Windows process-tree & stdio stream teardown on stop().
 */
export async function startLauncherServer({
  port,
  prebuild = false,
  timeoutMs = 15000,
  cwd = process.env.SANGI_SERVER_CWD || REPO_ROOT,
} = {}) {
  const chosenPort = port ?? Number(process.env.SANGI_E2E_PORT || (5300 + (process.pid % 400)));
  const serverArgs = ['launcher/server.mjs', '--port', String(chosenPort), ...(prebuild ? [] : ['--no-prebuild'])];

  const child = spawn(process.execPath, serverArgs, {
    cwd,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const logs = [];
  const pushLog = (prefix, chunk) => {
    const text = String(chunk);
    for (const line of text.split(/\r?\n/)) {
      if (!line) continue;
      logs.push(`${prefix}${line}`);
      if (logs.length > 200) logs.shift();
    }
  };

  let stopPromise = null;
  const stop = async () => {
    if (stopPromise) return stopPromise;
    stopPromise = (async () => {
      try {
        if (child.exitCode === null && child.signalCode === null) {
          const exitWait = new Promise((resolveExit) => {
            child.once('exit', () => resolveExit(true));
          });
          try {
            child.kill('SIGTERM');
          } catch {
            // ignore
          }
          const exitedGracefully = await Promise.race([
            exitWait,
            delay(1500).then(() => false),
          ]);

          if (!exitedGracefully && child.exitCode === null && child.signalCode === null) {
            if (process.platform === 'win32' && child.pid) {
              await new Promise((resolveKill) => {
                const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
                  windowsHide: true,
                  stdio: 'ignore',
                });
                killer.once('exit', resolveKill);
                killer.once('error', resolveKill);
              });
            } else {
              try {
                child.kill('SIGKILL');
              } catch {
                // ignore
              }
            }
            await Promise.race([exitWait, delay(2000)]);
          }
        }
      } finally {
        try { child.stdout?.removeAllListeners(); child.stdout?.destroy(); } catch {}
        try { child.stderr?.removeAllListeners(); child.stderr?.destroy(); } catch {}
        try { child.unref?.(); } catch {}
      }
    })();
    return stopPromise;
  };

  let actualPort = null;
  let baseUrl = null;
  let stdoutAcc = '';

  try {
    await new Promise((resolveReady, rejectReady) => {
      const timer = setTimeout(() => {
        rejectReady(new Error(`Timeout (${timeoutMs}ms) iniciando launcher/server.mjs.\nLogs:\n${logs.join('\n')}`));
      }, timeoutMs);
      timer.unref?.();

      const onError = (err) => {
        clearTimeout(timer);
        rejectReady(new Error(`Erro ao iniciar launcher/server.mjs: ${err.message}\nLogs:\n${logs.join('\n')}`));
      };

      const onExit = (code, signal) => {
        clearTimeout(timer);
        rejectReady(new Error(`launcher/server.mjs encerrou prematuramente (code=${code}, signal=${signal}).\nLogs:\n${logs.join('\n')}`));
      };

      const onStdout = (chunk) => {
        pushLog('[out] ', chunk);
        stdoutAcc += String(chunk);
        const match = stdoutAcc.match(/Launcher dos Ambientes 3D rodando em (http:\/\/127\.0\.0\.1:(\d+)\/)/);
        if (match) {
          actualPort = Number(match[2]);
          baseUrl = `http://127.0.0.1:${actualPort}`;
          clearTimeout(timer);
          child.off('error', onError);
          child.off('exit', onExit);
          child.stdout?.off('data', onStdout);
          resolveReady();
        }
      };

      child.on('error', onError);
      child.on('exit', onExit);
      child.stdout?.on('data', onStdout);
      child.stderr?.on('data', (chunk) => pushLog('[err] ', chunk));
    });

    // Keep draining stdout/stderr so pipe buffers never stall
    child.stdout?.on('data', (chunk) => pushLog('[out] ', chunk));

    let apiOk = false;
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline && !apiOk) {
      try {
        const res = await fetch(`${baseUrl}/api/apps`);
        if (res.ok) apiOk = true;
      } catch {
        await delay(50);
      }
    }
    if (!apiOk) {
      throw new Error(`Servidor iniciou em ${baseUrl}, mas /api/apps não respondeu 200.`);
    }

    return {
      baseUrl,
      port: actualPort,
      process: child,
      getLogs: () => [...logs],
      stop,
    };
  } catch (err) {
    await stop();
    throw err;
  }
}

/**
 * Launches Chromium/Chrome/Edge in SwiftShader (CI functional) or Hardware D3D11 mode.
 */
export async function launchBrowser({
  gpu = process.env.SANGI_E2E_GPU || 'swiftshader',
  headless = true,
} = {}) {
  const { chromium, source } = await resolvePlaywright();

  const attempts = gpu === 'hardware'
    ? [
        { channel: 'chrome', headless, args: ['--ignore-gpu-blocklist'], mode: 'chrome-hardware' },
        { channel: 'msedge', headless, args: ['--ignore-gpu-blocklist'], mode: 'msedge-hardware' },
      ]
    : [
        { channel: 'chrome', headless, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], mode: 'chrome-swiftshader' },
        { channel: 'msedge', headless, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], mode: 'msedge-swiftshader' },
        { headless, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], mode: 'chromium-swiftshader' },
      ];

  const errors = [];
  for (const cfg of attempts) {
    const { mode, ...launchOpts } = cfg;
    try {
      const browser = await chromium.launch(launchOpts);
      return { browser, mode, gpu, playwrightSource: source };
    } catch (err) {
      errors.push(`${mode}: ${err.message}`);
    }
  }

  throw new Error(
    gpu === 'hardware'
      ? `Hardware GPU browser unavailable (Chrome/Edge failed without SwiftShader fallback): ${errors.join(' | ')}`
      : `Failed to launch browser in ${gpu} mode: ${errors.join(' | ')}`
  );
}

/**
 * Creates an isolated BrowserContext + Page configured for a given viewport preset.
 */
export async function createIsolatedContext(
  browser,
  viewportKeyOrObj = 'desktop-1366',
  { reducedMotion = 'no-preference', baseUrl = null, blockExternal = false, timeoutMs = 15000 } = {},
) {
  const vp = typeof viewportKeyOrObj === 'string'
    ? VIEWPORTS[viewportKeyOrObj]
    : viewportKeyOrObj;
  if (!vp) {
    throw new Error(`Viewport desconhecido: ${String(viewportKeyOrObj)}`);
  }

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor ?? 1,
    hasTouch: Boolean(vp.hasTouch),
    isMobile: Boolean(vp.isMobile),
    reducedMotion,
  });
  context.setDefaultTimeout(timeoutMs);
  context.setDefaultNavigationTimeout(timeoutMs);

  const page = await context.newPage();
  if (blockExternal && baseUrl) {
    const allowedOrigin = new URL(baseUrl).origin;
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('about:')) {
        return route.continue();
      }
      try {
        if (new URL(url).origin === allowedOrigin) return route.continue();
      } catch {
        // fall through
      }
      return route.abort();
    });
  }

  return { context, page, viewport: vp };
}

const contextsWithInitScript = new WeakSet();

/**
 * Attaches non-invasive read-only browser diagnostics (errors, HTTP errors, WebGL draws/contexts,
 * AudioContext lifecycle, rAF loop state, listener balance, and postMessage capture).
 */
export async function attachDiagnostics(page, { baseUrl = null, allowFavicon404 = true } = {}) {
  const pageErrors = [];
  const consoleErrors = [];
  const nanOrShaderWarnings = [];
  const httpErrors = [];
  const favicon404s = [];
  const requestFailures = [];

  const isLocal = (url) => {
    if (!baseUrl) return true;
    try {
      return new URL(url).origin === new URL(baseUrl).origin;
    } catch {
      return false;
    }
  };

  page.on('pageerror', (err) => {
    pageErrors.push({ message: err.message, stack: err.stack || '' });
  });

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (/computeBoundingSphere.*NaN|NaN.*BufferGeometry|Shader Error|VALIDATE_STATUS|THREE\.WebGLProgram/i.test(text)) {
      nanOrShaderWarnings.push({ type, text });
    }
    if (type === 'error') {
      if (allowFavicon404 && /404 \(Not Found\)|Failed to load resource.*404/i.test(text) && String(msg.location()?.url || '').endsWith('/favicon.ico')) {
        return;
      }
      consoleErrors.push({ text, location: msg.location() });
    }
  });

  page.on('requestfailed', (req) => {
    requestFailures.push({
      url: req.url(),
      method: req.method(),
      errorText: req.failure()?.errorText || 'failed',
      isSameOrigin: isLocal(req.url()),
    });
  });

  page.on('response', (res) => {
    const status = res.status();
    if (status >= 400) {
      const url = res.url();
      let pathname = '';
      try { pathname = new URL(url).pathname; } catch {}
      if (allowFavicon404 && status === 404 && pathname === '/favicon.ico') {
        favicon404s.push({ url, status });
        return;
      }
      httpErrors.push({
        url,
        status,
        resourceType: res.request().resourceType(),
        isSameOrigin: isLocal(url),
      });
    }
  });

  const ctx = page.context();
  if (!contextsWithInitScript.has(ctx)) {
    contextsWithInitScript.add(ctx);
    await ctx.addInitScript(() => {
    if (window.__SANGI_E2E_DIAG__) return;

    const diag = {
      webglCreated: 0,
      webglLost: 0,
      draws: 0,
      lastDrawAt: 0,
      contexts: [],
      audioCreated: 0,
      audioClosed: 0,
      audioContexts: [],
      rafScheduled: 0,
      rafCanceled: 0,
      rafActiveIds: new Set(),
      windowListenersActive: 0,
      documentListenersActive: 0,
      messages: [],
    };

    const lostContexts = new WeakSet();
    const markLost = (gl) => {
      if (!gl || lostContexts.has(gl)) return;
      lostContexts.add(gl);
      diag.webglLost++;
    };

    const wrapDraw = (proto) => {
      if (!proto || proto.__sangiDrawWrapped) return;
      proto.__sangiDrawWrapped = true;
      for (const fn of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
        const orig = proto[fn];
        if (typeof orig !== 'function') continue;
        proto[fn] = function (...args) {
          diag.draws++;
          diag.lastDrawAt = performance.now();
          return orig.apply(this, args);
        };
      }
      const origGetExt = proto.getExtension;
      if (typeof origGetExt === 'function') {
        proto.getExtension = function (name, ...rest) {
          const ext = origGetExt.call(this, name, ...rest);
          if (name === 'WEBGL_lose_context' && ext && !ext.__sangiWrapped) {
            ext.__sangiWrapped = true;
            const origLose = ext.loseContext?.bind(ext);
            if (origLose) {
              ext.loseContext = () => {
                markLost(this);
                return origLose();
              };
            }
            const origRestore = ext.restoreContext?.bind(ext);
            if (origRestore) {
              ext.restoreContext = () => {
                lostContexts.delete(this);
                return origRestore();
              };
            }
          }
          return ext;
        };
      }
    };

    wrapDraw(window.WebGLRenderingContext?.prototype);
    wrapDraw(window.WebGL2RenderingContext?.prototype);

    const trackedCanvases = new WeakSet();
    const trackedContexts = new WeakSet();
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const ctx = origGetContext.call(this, type, ...args);
      if (ctx && (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl')) {
        if (!trackedContexts.has(ctx)) {
          trackedContexts.add(ctx);
          diag.webglCreated++;
          diag.contexts.push({ gl: ctx, canvas: this, type });
        }
        if (!trackedCanvases.has(this)) {
          trackedCanvases.add(this);
          this.addEventListener('webglcontextlost', () => markLost(ctx));
          this.addEventListener('webglcontextrestored', () => lostContexts.delete(ctx));
        }
      }
      return ctx;
    };

    const wrapAudioCtor = (name) => {
      const OrigAudio = window[name];
      if (!OrigAudio || OrigAudio.__sangiWrapped) return;
      const closedSet = new WeakSet();
      const origClose = OrigAudio.prototype.close;
      if (typeof origClose === 'function' && !origClose.__sangiWrapped) {
        OrigAudio.prototype.close = function (...args) {
          if (!closedSet.has(this)) {
            closedSet.add(this);
            diag.audioClosed++;
          }
          return origClose.apply(this, args);
        };
        OrigAudio.prototype.close.__sangiWrapped = true;
      }
      const WrappedAudio = function (...args) {
        const inst = new OrigAudio(...args);
        diag.audioCreated++;
        diag.audioContexts.push(inst);
        return inst;
      };
      WrappedAudio.prototype = OrigAudio.prototype;
      Object.setPrototypeOf(WrappedAudio, OrigAudio);
      WrappedAudio.__sangiWrapped = true;
      window[name] = WrappedAudio;
    };
    wrapAudioCtor('AudioContext');
    wrapAudioCtor('webkitAudioContext');

    const origWinAdd = window.addEventListener.bind(window);
    const origWinRemove = window.removeEventListener.bind(window);
    const origDocAdd = document.addEventListener.bind(document);
    const origDocRemove = document.removeEventListener.bind(document);

    // Register bridge spy via original listener so it does not affect listener balance
    origWinAdd('message', (e) => {
      try {
        diag.messages.push({
          type: e.data?.type ?? null,
          data: e.data && typeof e.data === 'object' ? JSON.parse(JSON.stringify(e.data)) : e.data,
          origin: e.origin,
          timeStamp: e.timeStamp,
        });
        if (diag.messages.length > 200) diag.messages.shift();
      } catch {
        diag.messages.push({ type: e.data?.type ?? null, data: null, origin: e.origin, timeStamp: e.timeStamp });
      }
    });

    const wrapTargetListeners = (target, origAdd, origRemove, counterKey) => {
      const reg = new Map();
      const normCapture = (opts) => (typeof opts === 'boolean' ? opts : Boolean(opts?.capture));
      target.addEventListener = function (type, listener, options) {
        if (listener) {
          const cap = normCapture(options);
          let byType = reg.get(type);
          if (!byType) { byType = new Map(); reg.set(type, byType); }
          let caps = byType.get(listener);
          if (!caps) { caps = new Set(); byType.set(listener, caps); }
          if (!caps.has(cap)) {
            caps.add(cap);
            diag[counterKey]++;
          }
        }
        return origAdd(type, listener, options);
      };
      target.removeEventListener = function (type, listener, options) {
        if (listener) {
          const cap = normCapture(options);
          const caps = reg.get(type)?.get(listener);
          if (caps && caps.has(cap)) {
            caps.delete(cap);
            diag[counterKey] = Math.max(0, diag[counterKey] - 1);
          }
        }
        return origRemove(type, listener, options);
      };
    };

    wrapTargetListeners(window, origWinAdd, origWinRemove, 'windowListenersActive');
    wrapTargetListeners(document, origDocAdd, origDocRemove, 'documentListenersActive');

    const origRaf = window.requestAnimationFrame.bind(window);
    const origCancelRaf = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = function (cb) {
      diag.rafScheduled++;
      let id = 0;
      id = origRaf((ts) => {
        diag.rafActiveIds.delete(id);
        return cb(ts);
      });
      diag.rafActiveIds.add(id);
      return id;
    };
    window.cancelAnimationFrame = function (id) {
      if (diag.rafActiveIds.delete(id)) {
        diag.rafCanceled++;
      }
      return origCancelRaf(id);
    };

    window.__SANGI_E2E_DIAG__ = diag;
    });
  }

  const getErrors = ({ includeExternal = false, includeFavicon404 = false } = {}) => {
    const filteredHttp = includeExternal ? [...httpErrors] : httpErrors.filter((e) => e.isSameOrigin);
    const filteredReqFail = includeExternal ? [...requestFailures] : requestFailures.filter((e) => e.isSameOrigin);
    const filteredConsole = includeExternal
      ? [...consoleErrors]
      : consoleErrors.filter((c) => !/ERR_NAME_NOT_RESOLVED|fonts\.googleapis|fonts\.gstatic|cdn\.tailwindcss/i.test(c.text));
    const favs = includeFavicon404 ? [...favicon404s] : [];
    const total = pageErrors.length + filteredConsole.length + filteredHttp.length + filteredReqFail.length + favs.length;
    return {
      pageErrors: [...pageErrors],
      consoleErrors: filteredConsole,
      httpErrors: filteredHttp,
      requestFailures: filteredReqFail,
      favicon404s: [...favicon404s],
      nanOrShaderWarnings: [...nanOrShaderWarnings],
      total,
    };
  };

  const clearErrors = () => {
    pageErrors.length = 0;
    consoleErrors.length = 0;
    nanOrShaderWarnings.length = 0;
    httpErrors.length = 0;
    favicon404s.length = 0;
    requestFailures.length = 0;
  };

  const assertClean = (opts = {}) => {
    const errs = getErrors(opts);
    assert.equal(
      errs.total,
      0,
      `Erros inesperados no navegador: ${JSON.stringify(errs)}`,
    );
  };

  const getMessages = async (target = page) => {
    return target.evaluate(() => window.__SANGI_E2E_DIAG__?.messages ?? []);
  };

  const getResourceStats = async (target = page) => {
    return target.evaluate(() => {
      const d = window.__SANGI_E2E_DIAG__;
      if (!d) return null;
      const audioRunning = d.audioContexts.filter((ctx) => ctx.state === 'running').length;
      const audioNotClosed = d.audioContexts.filter((ctx) => ctx.state !== 'closed').length;
      return {
        webglCreated: d.webglCreated,
        webglLost: d.webglLost,
        webglActive: Math.max(0, d.webglCreated - d.webglLost),
        draws: d.draws,
        lastDrawAt: d.lastDrawAt,
        audioCreated: d.audioCreated,
        audioClosed: d.audioClosed,
        audioActive: Math.max(0, d.audioCreated - d.audioClosed),
        audioRunning,
        audioNotClosed,
        rafScheduled: d.rafScheduled,
        rafCanceled: d.rafCanceled,
        rafPending: d.rafActiveIds.size,
        windowListenersActive: d.windowListenersActive,
        documentListenersActive: d.documentListenersActive,
        qaTelemetry: window.__SANGI_QA__ ?? null,
      };
    });
  };

  const collectFpsSample = async (target = page, durationMs = 2000) => {
    const result = await target.evaluate(async (ms) => {
      const d = window.__SANGI_E2E_DIAG__;
      const startDraws = d ? d.draws : 0;
      const timestamps = [];
      const start = performance.now();

      await new Promise((resolveDone) => {
        const step = (now) => {
          timestamps.push(now);
          if (now - start >= ms) {
            resolveDone();
            return;
          }
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      const end = performance.now();
      const endDraws = d ? d.draws : 0;
      const deltas = [];
      for (let i = 1; i < timestamps.length; i++) {
        deltas.push(timestamps[i] - timestamps[i - 1]);
      }
      deltas.sort((a, b) => a - b);
      const elapsed = Math.max(1, end - (timestamps[0] ?? start));
      const frames = Math.max(0, timestamps.length - 1);
      const fps = frames > 0 ? (frames * 1000) / elapsed : 0;
      const avgFrameMs = deltas.length ? deltas.reduce((s, v) => s + v, 0) / deltas.length : 0;
      const p95Idx = deltas.length ? Math.min(deltas.length - 1, Math.floor(deltas.length * 0.95)) : 0;
      const p95FrameMs = deltas.length ? deltas[p95Idx] : 0;
      const maxFrameMs = deltas.length ? deltas[deltas.length - 1] : 0;
      const heapUsedMB = performance.memory ? Number((performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)) : null;

      return {
        frames,
        durationMs: Number(elapsed.toFixed(1)),
        fps: Number(fps.toFixed(2)),
        avgFrameMs: Number(avgFrameMs.toFixed(2)),
        p95FrameMs: Number(p95FrameMs.toFixed(2)),
        maxFrameMs: Number(maxFrameMs.toFixed(2)),
        drawsDelta: endDraws - startDraws,
        heapUsedMB,
        qaTelemetry: window.__SANGI_QA__ ?? null,
      };
    }, durationMs);

    return {
      ...result,
      nanDetected: nanOrShaderWarnings.some((w) => /NaN/i.test(w.text)),
    };
  };

  const triggerWebGLContextLoss = async (target = page, { restoreAfterMs = 250 } = {}) => {
    const info = await target.evaluate(() => {
      const d = window.__SANGI_E2E_DIAG__;
      const ctxEntry = d?.contexts?.find((c) => c.gl && !c.gl.isContextLost?.());
      const gl = ctxEntry?.gl || (() => {
        const c = document.querySelector('canvas');
        return c ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
      })();
      if (!gl) return { ok: false, reason: 'no-webgl-context' };
      const ext = gl.getExtension('WEBGL_lose_context');
      if (!ext) return { ok: false, reason: 'no-lose-context-ext' };
      window.__SANGI_LOST_EXT__ = ext;
      ext.loseContext();
      return { ok: true, lost: gl.isContextLost() };
    });

    if (!info.ok) return info;

    if (restoreAfterMs !== null && restoreAfterMs >= 0) {
      await delay(restoreAfterMs);
      const restored = await target.evaluate(() => {
        const ext = window.__SANGI_LOST_EXT__;
        if (!ext) return false;
        ext.restoreContext();
        return true;
      });
      return { ...info, restored };
    }
    return info;
  };

  const getWebGLRendererInfo = async (target = page) => {
    return target.evaluate(() => {
      const d = window.__SANGI_E2E_DIAG__;
      const gl = d?.contexts?.[0]?.gl || (() => {
        const c = document.createElement('canvas');
        return c.getContext('webgl2') || c.getContext('webgl');
      })();
      if (!gl) return { renderer: null, vendor: null };
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (!dbg) {
        return {
          renderer: gl.getParameter(gl.RENDERER),
          vendor: gl.getParameter(gl.VENDOR),
          unmasked: false,
        };
      }
      return {
        renderer: gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL),
        vendor: gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL),
        unmasked: true,
      };
    });
  };

  return {
    getErrors,
    clearErrors,
    assertClean,
    getMessages,
    getResourceStats,
    collectFpsSample,
    triggerWebGLContextLoss,
    getWebGLRendererInfo,
  };
}

/**
 * Sends SangiBridge commands supporting v2 `{ type: 'SANGI_COMMAND', command, payload }`
 * and/or legacy `SANGI_APP_*` messages into an app Frame or Page (including modal iframe).
 */
export async function sendBridgeCommand(frameOrPage, command, payload = {}, { protocol = 'v2' } = {}) {
  const upper = String(command).toUpperCase();
  const messages = [];

  if (protocol === 'v2' || protocol === 'both') {
    messages.push({ type: 'SANGI_COMMAND', command: upper, payload: payload ?? {} });
  }
  if (protocol === 'legacy' || protocol === 'both') {
    switch (upper) {
      case 'PAUSE':
        messages.push({ type: 'SANGI_APP_PAUSE' });
        break;
      case 'RESUME':
        messages.push({ type: 'SANGI_APP_RESUME' });
        break;
      case 'MUTE':
        messages.push({ type: 'SANGI_APP_MUTE', muted: payload?.muted ?? true });
        break;
      case 'UNMUTE':
        messages.push({ type: 'SANGI_APP_MUTE', muted: false });
        break;
      case 'DISPOSE':
        messages.push({ type: 'SANGI_APP_DISPOSE' });
        break;
      default:
        break;
    }
  }

  for (const msg of messages) {
    await frameOrPage.evaluate((m) => {
      const iframe = document.querySelector('#playerFrameContainer iframe.player-frame');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(m, '*');
      } else {
        window.postMessage(m, '*');
      }
    }, msg);
  }
  return messages;
}

export async function getCatalog(baseUrl) {
  const res = await fetch(`${baseUrl}/api/apps`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha em GET /api/apps: HTTP ${res.status}`);
  return res.json();
}

export function pickRepresentativeApp(catalog, collection, predicate = null) {
  const candidates = catalog.filter((a) => a.collection === collection);
  if (predicate) {
    const match = candidates.find(predicate);
    if (match) return match;
  }
  const sample = REPRESENTATIVE_SAMPLES[collection];
  if (sample) {
    const primary = candidates.find((a) => a.id === sample.primary);
    if (primary) return primary;
    const fallback = candidates.find((a) => a.id === sample.fallback);
    if (fallback) return fallback;
  }
  return candidates.find((a) => a.status === 'ready') ?? candidates[0] ?? null;
}

/**
 * Opens an app through the launcher UI (clicking [data-play="<id>"]) and returns
 * the Playwright Frame once loaded. Switches view to Legado arquivado if needed.
 */
export async function openAppInModal(page, appId, { timeoutMs = 15000 } = {}) {
  let playBtn = page.locator(`#list [data-play="${appId}"]:not(.cover)`).first();
  if ((await playBtn.count()) === 0) {
    const archiveBtn = page.locator('[data-view="col:Legado arquivado"]');
    if ((await archiveBtn.count()) > 0) {
      await archiveBtn.click();
      await page.waitForTimeout(100);
    }
    playBtn = page.locator(`#list [data-play="${appId}"]:not(.cover)`).first();
  }
  if ((await playBtn.count()) === 0) {
    const allBtn = page.locator('[data-view="all"]');
    if ((await allBtn.count()) > 0) await allBtn.click();
    playBtn = page.locator(`#list [data-play="${appId}"]:not(.cover)`).first();
  }
  assert.ok((await playBtn.count()) > 0, `Botão [data-play="${appId}"] não encontrado no DOM do launcher`);

  await playBtn.scrollIntoViewIfNeeded();
  await playBtn.click();

  const modal = page.locator('#playerModal');
  await modal.waitFor({ state: 'visible', timeout: timeoutMs });

  const iframeLocator = page.locator('#playerFrameContainer iframe.player-frame');
  await iframeLocator.waitFor({ state: 'attached', timeout: timeoutMs });

  const handle = await iframeLocator.elementHandle();
  const frame = await handle.contentFrame();
  assert.ok(frame, `contentFrame indisponível para app ${appId}`);

  await frame.waitForLoadState('domcontentloaded', { timeout: timeoutMs });
  return { iframeLocator, frame, playBtn };
}

export async function closeAppModal(page, { timeoutMs = 5000 } = {}) {
  const modal = page.locator('#playerModal');
  if (await modal.isVisible()) {
    await page.locator('#closePlayerBtn').click();
  }
  await page.locator('#playerFrameContainer iframe.player-frame').waitFor({ state: 'detached', timeout: timeoutMs });
  await modal.waitFor({ state: 'hidden', timeout: timeoutMs });
}

export function createE2EHarness({ gpu = 'swiftshader', prebuild = false, port } = {}) {
  let server = null;
  let browserInfo = null;

  return {
    async start() {
      server = await startLauncherServer({ port, prebuild });
      browserInfo = await launchBrowser({ gpu });
      return { baseUrl: server.baseUrl, browser: browserInfo.browser, mode: browserInfo.mode };
    },
    async stop() {
      await browserInfo?.browser?.close().catch(() => {});
      await server?.stop().catch(() => {});
      browserInfo = null;
      server = null;
    },
    get baseUrl() { return server?.baseUrl ?? null; },
    get browser() { return browserInfo?.browser ?? null; },
  };
}
