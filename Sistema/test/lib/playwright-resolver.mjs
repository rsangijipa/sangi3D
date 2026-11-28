// test/lib/playwright-resolver.mjs
// Resolve Playwright portably from workspace node_modules or SANGI_PLAYWRIGHT, and launch Chromium with GPU/SwiftShader modes.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

const CANDIDATE_PATHS = [
  path.join(ROOT, 'node_modules', 'playwright'),
  path.join(ROOT, 'Jogos', '3 - Expressao e Desenvolvimento', 'node_modules', 'playwright'),
  path.join(ROOT, 'Jogos', '4 - Kit 17 Jogos', '12-cidade-das-conversas', 'node_modules', 'playwright'),
  path.join(ROOT, 'Jogos', '4 - Kit 17 Jogos', '17-ensaio-do-cotidiano', 'node_modules', 'playwright'),
  path.join(ROOT, 'Jogos', '6 - Adultos e Marcas', '03_rochas-em-equilibrio', 'node_modules', 'playwright'),
  path.join(ROOT, 'Jogos', '2 - Projetos', '01-oficina-do-vitralista', 'node_modules', 'playwright'),
  path.join(ROOT, 'Jogos', '4 - Kit 17 Jogos', '08-meteorologia-das-emocoes', 'node_modules', 'playwright'),
];

export async function resolvePlaywright() {
  if (process.env.SANGI_PLAYWRIGHT) {
    const customPath = path.resolve(process.env.SANGI_PLAYWRIGHT);
    const mod = await import(pathToFileURL(customPath).href);
    return { ...(mod.default ?? mod), resolvedFrom: customPath };
  }

  for (const candidate of CANDIDATE_PATHS) {
    const pkgJson = path.join(candidate, 'package.json');
    if (!fs.existsSync(pkgJson)) continue;
    try {
      const req = createRequire(pkgJson);
      const pw = req(candidate);
      if (pw?.chromium) {
        return { ...pw, resolvedFrom: candidate };
      }
    } catch {
      // try next candidate
    }
  }

  try {
    const req = createRequire(import.meta.url);
    const pw = req('playwright');
    if (pw?.chromium) {
      return { ...pw, resolvedFrom: 'node_modules:playwright' };
    }
  } catch {
    // fall through
  }

  throw new Error(
    'Playwright não encontrado no workspace. Defina SANGI_PLAYWRIGHT ou instale playwright em um dos diretórios do projeto.'
  );
}

export async function launchBrowser({ gpu = 'auto', headless = true } = {}) {
  const { chromium, resolvedFrom } = await resolvePlaywright();

  const strategies = [];
  if (gpu === 'chrome') {
    strategies.push({ mode: 'chrome', options: { headless, channel: 'chrome', args: ['--ignore-gpu-blocklist'] } });
  } else if (gpu === 'msedge') {
    strategies.push({ mode: 'msedge', options: { headless, channel: 'msedge', args: ['--ignore-gpu-blocklist'] } });
  } else if (gpu === 'swiftshader') {
    strategies.push(
      { mode: 'swiftshader', options: { headless, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } },
      { mode: 'chrome-swiftshader', options: { headless, channel: 'chrome', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } }
    );
  } else {
    // auto: Chrome hardware GPU -> Edge hardware GPU -> SwiftShader fallback
    strategies.push(
      { mode: 'chrome', options: { headless, channel: 'chrome', args: ['--ignore-gpu-blocklist'] } },
      { mode: 'msedge', options: { headless, channel: 'msedge', args: ['--ignore-gpu-blocklist'] } },
      { mode: 'swiftshader', options: { headless, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } },
      { mode: 'chrome-swiftshader', options: { headless, channel: 'chrome', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } }
    );
  }

  const errors = [];
  for (const strat of strategies) {
    try {
      const browser = await chromium.launch(strat.options);
      return { browser, gpuMode: strat.mode, resolvedFrom };
    } catch (err) {
      errors.push(`${strat.mode}: ${err.message}`);
    }
  }
  throw new Error(`Falha ao iniciar navegador Playwright (gpu=${gpu}): ${errors.join(' | ')}`);
}
