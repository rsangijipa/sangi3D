#!/usr/bin/env node
/**
 * test/e2e-environments.test.mjs
 * 
 * Suíte de Testes E2E Automatizados para os 17 Ambientes do Projeto Sangi3D
 * Cobre Tiers 1 a 4 com validação de recursos, limites móveis, integridade de catálogo e rotas HTTP.
 * 
 * Pure Node.js (sem dependências npm externas pesadas).
 * 
 * Uso:
 *   node test/e2e-environments.test.mjs                     # Executa todos os tiers para os 17 ambientes
 *   node test/e2e-environments.test.mjs --tier=1            # Executa apenas Tier 1 (1, 2, 3, 4, ou all)
 *   node test/e2e-environments.test.mjs --batch=1           # Executa apenas Lote 1 (#20, #21, #22, #23, #25, #29, #30, #32)
 *   node test/e2e-environments.test.mjs --batch=2           # Executa apenas Lote 2 (#59 a #68)
 *   node test/e2e-environments.test.mjs --env=20            # Executa apenas um ambiente específico (por número ou id)
 *   node test/e2e-environments.test.mjs --port=5179         # Porta customizada para teste HTTP do servidor local
 *   node test/e2e-environments.test.mjs --strict            # Modo estrito: falha em ambientes conceituais ainda pendentes
 *   node test/e2e-environments.test.mjs --json              # Emite resumo dos testes em formato JSON
 *   node test/e2e-environments.test.mjs --help              # Exibe instruções de uso
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

// ============================================================================
// CORES E FORMATAÇÃO ANSI
// ============================================================================
const useColor = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);
const C = {
  reset: useColor ? '\x1b[0m' : '',
  bold: useColor ? '\x1b[1m' : '',
  dim: useColor ? '\x1b[2m' : '',
  red: useColor ? '\x1b[31m' : '',
  green: useColor ? '\x1b[32m' : '',
  yellow: useColor ? '\x1b[33m' : '',
  blue: useColor ? '\x1b[34m' : '',
  magenta: useColor ? '\x1b[35m' : '',
  cyan: useColor ? '\x1b[36m' : '',
  gray: useColor ? '\x1b[90m' : '',
  bgRed: useColor ? '\x1b[41m' : '',
  bgGreen: useColor ? '\x1b[42m' : ''
};

const SYMBOLS = {
  pass: `${C.green}✔ PASS${C.reset}`,
  fail: `${C.red}✖ FAIL${C.reset}`,
  pending: `${C.yellow}⏳ PEND${C.reset}`,
  skip: `${C.gray}ℹ SKIP${C.reset}`,
  bullet: `${C.cyan}▸${C.reset}`
};

// ============================================================================
// DEFINIÇÃO DOS 17 AMBIENTES ALVO
// ============================================================================
export const TARGET_ENVIRONMENTS = [
  // --- LOTE 1: Kit 17 Jogos 3D (8 Ambientes) ---
  {
    num: 20,
    batch: 1,
    id: '4-kit-17-jogos-04-observatorio-da-luz',
    name: 'Observatório da Luz',
    folder: 'Jogos/4 - Kit 17 Jogos/04-observatorio-da-luz',
    file: 'Jogos/4 - Kit 17 Jogos/04-observatorio-da-luz/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/04-observatorio-da-luz/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['refração de prismas', 'temperatura kelvin', 'persianas', 'comparativo A/B']
  },
  {
    num: 21,
    batch: 1,
    id: '4-kit-17-jogos-05-oficina-do-tempo',
    name: 'Oficina do Tempo',
    folder: 'Jogos/4 - Kit 17 Jogos/05-oficina-do-tempo',
    file: 'Jogos/4 - Kit 17 Jogos/05-oficina-do-tempo/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/05-oficina-do-tempo/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['ampulheta', 'mostrador duplo', 'snap de mochila', 'relógio monotônico']
  },
  {
    num: 22,
    batch: 1,
    id: '4-kit-17-jogos-06-torre-do-impulso',
    name: 'Torre do Impulso',
    folder: 'Jogos/4 - Kit 17 Jogos/06-torre-do-impulso',
    file: 'Jogos/4 - Kit 17 Jogos/06-torre-do-impulso/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/06-torre-do-impulso/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['rube goldberg', 'tubo helicoidal', 'esfera em spline', 'comporta de sinal']
  },
  {
    num: 23,
    batch: 1,
    id: '4-kit-17-jogos-07-ilha-das-pausas',
    name: 'Ilha das Pausas',
    folder: 'Jogos/4 - Kit 17 Jogos/07-ilha-das-pausas',
    file: 'Jogos/4 - Kit 17 Jogos/07-ilha-das-pausas/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/07-ilha-das-pausas/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['estações zen', 'farol respiratório', 'ondulação marinha', 'áudio ambiente']
  },
  {
    num: 25,
    batch: 1,
    id: '4-kit-17-jogos-09-estacao-das-trocas',
    name: 'Estação das Trocas',
    folder: 'Jogos/4 - Kit 17 Jogos/09-estacao-das-trocas',
    file: 'Jogos/4 - Kit 17 Jogos/09-estacao-das-trocas/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/09-estacao-das-trocas/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['estação ferroviária', '3 vagões', 'regras de embarque', 'passageiros']
  },
  {
    num: 29,
    batch: 1,
    id: '4-kit-17-jogos-13-museu-dos-pontos-de-vista',
    name: 'Museu dos Pontos de Vista',
    folder: 'Jogos/4 - Kit 17 Jogos/13-museu-dos-pontos-de-vista',
    file: 'Jogos/4 - Kit 17 Jogos/13-museu-dos-pontos-de-vista/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/13-museu-dos-pontos-de-vista/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['perspectiva forçada', 'cones de visão', 'iluminação de galeria', 'anamorfismo']
  },
  {
    num: 30,
    batch: 1,
    id: '4-kit-17-jogos-14-estudio-dos-limites',
    name: 'Estúdio dos Limites',
    folder: 'Jogos/4 - Kit 17 Jogos/14-estudio-dos-limites',
    file: 'Jogos/4 - Kit 17 Jogos/14-estudio-dos-limites/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/14-estudio-dos-limites/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['palco teatral', 'restrição física de distância', 'cortina cinemática', 'paisagem sonora']
  },
  {
    num: 32,
    batch: 1,
    id: '4-kit-17-jogos-16-teatro-das-historias-possiveis',
    name: 'Teatro das Histórias Possíveis',
    folder: 'Jogos/4 - Kit 17 Jogos/16-teatro-das-historias-possiveis',
    file: 'Jogos/4 - Kit 17 Jogos/16-teatro-das-historias-possiveis/index.html',
    url: '/Jogos/4 - Kit 17 Jogos/16-teatro-das-historias-possiveis/index.html',
    category: 'Kit 17 jogos 3D',
    features: ['sombras chinesas', 'marionetes articuladas', 'timeline keyframes', 'reprodução ramificada']
  },

  // --- LOTE 2: Adultos e Marcas (9 Ambientes) ---
  {
    num: 59,
    batch: 2,
    id: '6-adultos-e-marcas-04_maquina-de-escrever-das-intencoes',
    name: 'Máquina de Escrever das Intenções',
    folder: 'Jogos/6 - Adultos e Marcas/04_maquina-de-escrever-das-intencoes',
    file: 'Jogos/6 - Adultos e Marcas/04_maquina-de-escrever-das-intencoes/index.html',
    url: '/Jogos/6 - Adultos e Marcas/04_maquina-de-escrever-das-intencoes/index.html',
    category: 'Adultos e marcas',
    features: ['tipografia mecânica', 'teclas cromadas', 'carro móvel', 'carimbo e sino']
  },
  {
    num: 60,
    batch: 2,
    id: '6-adultos-e-marcas-05_clepsidra-do-foco',
    name: 'Clepsidra do Foco',
    folder: 'Jogos/6 - Adultos e Marcas/05_clepsidra-do-foco',
    file: 'Jogos/6 - Adultos e Marcas/05_clepsidra-do-foco/index.html',
    url: '/Jogos/6 - Adultos e Marcas/05_clepsidra-do-foco/index.html',
    category: 'Adultos e marcas',
    features: ['relógio dágua', '3 câmaras', 'vazão e boia', 'gotejamento acústico']
  },
  {
    num: 61,
    batch: 2,
    id: '6-adultos-e-marcas-07_copos-musicais',
    name: 'Copos Musicais',
    folder: 'Jogos/6 - Adultos e Marcas/07_copos-musicais',
    file: 'Jogos/6 - Adultos e Marcas/07_copos-musicais/index.html',
    url: '/Jogos/6 - Adultos e Marcas/07_copos-musicais/index.html',
    category: 'Adultos e marcas',
    features: ['taças de cristal', 'afinação por água', 'fricção de borda', 'síntese modal']
  },
  {
    num: 62,
    batch: 2,
    id: '6-adultos-e-marcas-08_toca-discos-de-vinil',
    name: 'Toca-Discos de Vinil',
    folder: 'Jogos/6 - Adultos e Marcas/08_toca-discos-de-vinil',
    file: 'Jogos/6 - Adultos e Marcas/08_toca-discos-de-vinil/index.html',
    url: '/Jogos/6 - Adultos e Marcas/08_toca-discos-de-vinil/index.html',
    category: 'Adultos e marcas',
    features: ['prato giratório 33/45 RPM', 'braço mecânico', 'scratch interativo', 'sulco de áudio lo-fi']
  },
  {
    num: 63,
    batch: 2,
    id: '6-adultos-e-marcas-10_maquina-de-reacao-em-cadeia',
    name: 'Máquina de Reação em Cadeia',
    folder: 'Jogos/6 - Adultos e Marcas/10_maquina-de-reacao-em-cadeia',
    file: 'Jogos/6 - Adultos e Marcas/10_maquina-de-reacao-em-cadeia/index.html',
    url: '/Jogos/6 - Adultos e Marcas/10_maquina-de-reacao-em-cadeia/index.html',
    category: 'Adultos e marcas',
    features: ['dominós', 'gangorras e polias', 'física de corpos rígidos', 'encaixe magnético']
  },
  {
    num: 64,
    batch: 2,
    id: '6-adultos-e-marcas-11_relogio-aberto',
    name: 'Relógio Aberto',
    folder: 'Jogos/6 - Adultos e Marcas/11_relogio-aberto',
    file: 'Jogos/6 - Adultos e Marcas/11_relogio-aberto/index.html',
    url: '/Jogos/6 - Adultos e Marcas/11_relogio-aberto/index.html',
    category: 'Adultos e marcas',
    features: ['escapamento suíço 3Hz', 'roda de balanço', 'trem de engrenagens', 'vista explodida Z']
  },
  {
    num: 66,
    batch: 2,
    id: '6-adultos-e-marcas-14_bancada-da-manicure',
    name: 'Bancada da Manicure',
    folder: 'Jogos/6 - Adultos e Marcas/14_bancada-da-manicure',
    file: 'Jogos/6 - Adultos e Marcas/14_bancada-da-manicure/index.html',
    url: '/Jogos/6 - Adultos e Marcas/14_bancada-da-manicure/index.html',
    category: 'Adultos e marcas',
    features: ['esmaltação em CanvasTexture', 'camada de brilho PBR', 'cura UV', 'ferramentas de mesa']
  },
  {
    num: 67,
    batch: 2,
    id: '6-adultos-e-marcas-15_barista-de-bancada',
    name: 'Barista de Bancada',
    folder: 'Jogos/6 - Adultos e Marcas/15_barista-de-bancada',
    file: 'Jogos/6 - Adultos e Marcas/15_barista-de-bancada/index.html',
    url: '/Jogos/6 - Adultos e Marcas/15_barista-de-bancada/index.html',
    category: 'Adultos e marcas',
    features: ['espresso manual 9 bar', 'extração Lei de Darcy', 'vaporização de leite', 'latte art']
  },
  {
    num: 68,
    batch: 2,
    id: '6-adultos-e-marcas-18_orgao-do-perfumista',
    name: 'Órgão do Perfumista',
    folder: 'Jogos/6 - Adultos e Marcas/18_orgao-do-perfumista',
    file: 'Jogos/6 - Adultos e Marcas/18_orgao-do-perfumista/index.html',
    url: '/Jogos/6 - Adultos e Marcas/18_orgao-do-perfumista/index.html',
    category: 'Adultos e marcas',
    features: ['pirâmide olfativa 3D', 'pipetas de vidro óptico', 'mistura cromática', 'acorde aromático procedural']
  }
];

// ============================================================================
// PARSER DE ARGUMENTOS CLI
// ============================================================================
function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: 'all',          // '1', '2', '3', '4', 'all'
    batch: 'all',         // '1', '2', 'all'
    env: null,            // number or string filter
    port: 5179,           // server port for Tier 4
    strict: false,        // fail on uncreated files instead of pending
    json: false,          // output json
    help: false
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--json') options.json = true;
    else if (arg.startsWith('--tier=')) options.tier = arg.split('=')[1].toLowerCase();
    else if (arg.startsWith('--batch=')) options.batch = arg.split('=')[1].toLowerCase();
    else if (arg.startsWith('--env=')) options.env = arg.split('=')[1];
    else if (arg.startsWith('--port=')) options.port = parseInt(arg.split('=')[1], 10);
  }

  return options;
}

function showHelp() {
  console.log(`
${C.bold}Sangi3D — E2E Environments Test Runner${C.reset}
Validador de conformidade técnica e operacional para os 17 ambientes conceituais.

${C.bold}USO:${C.reset}
  node test/e2e-environments.test.mjs [opções]

${C.bold}OPÇÕES:${C.reset}
  --tier=<1|2|3|4|all>   Seleciona o tier de teste a executar (padrão: all)
                         1: Feature Coverage (Three.js, WebGL, PBR, Web Audio, Touch)
                         2: Boundary & Corner (Mobile viewport, touch CSS, safe-area, Sangi-Bridge)
                         3: Catalog & Manifest (api/apps.json, IDs únicos, verify-catalog.mjs)
                         4: Local Server & HTTP Smoke (server.mjs, rotas HTTP 200)
  --batch=<1|2|all>      Filtra por lote de implementação (1: Kit 17 Jogos, 2: Adultos e Marcas)
  --env=<id|num>         Filtra um único ambiente (ex: --env=20, --env=observatorio)
  --port=<número>        Porta para servidor HTTP do Tier 4 (padrão: 5179)
  --strict               Falha testes se algum ambiente do lote não existir fisicamente
  --json                 Imprime o relatório final em formato JSON
  --help, -h             Mostra este painel de ajuda
`);
}

// ============================================================================
// COLETORES DE RESULTADOS
// ============================================================================
class TestSuiteReporter {
  constructor(options) {
    this.options = options;
    this.startTime = Date.now();
    this.results = [];
    this.summary = {
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      skipped: 0
    };
  }

  record(tier, targetName, checkName, status, details = null) {
    this.summary.total++;
    if (status === 'PASS') this.summary.passed++;
    else if (status === 'FAIL') this.summary.failed++;
    else if (status === 'PENDING') this.summary.pending++;
    else if (status === 'SKIP') this.summary.skipped++;

    this.results.push({
      tier,
      targetName,
      checkName,
      status,
      details,
      timestamp: new Date().toISOString()
    });

    if (!this.options.json) {
      const sym = status === 'PASS' ? SYMBOLS.pass :
                  status === 'FAIL' ? SYMBOLS.fail :
                  status === 'PENDING' ? SYMBOLS.pending : SYMBOLS.skip;
      const targetStr = targetName ? `[${C.cyan}${targetName}${C.reset}] ` : '';
      const detStr = details ? ` ${C.gray}(${details})${C.reset}` : '';
      console.log(`  ${sym} ${targetStr}${checkName}${detStr}`);
    }
  }

  header(title) {
    if (!this.options.json) {
      console.log(`\n${C.bold}=== ${title} ===${C.reset}`);
    }
  }

  printSummary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    if (this.options.json) {
      console.log(JSON.stringify({
        summary: this.summary,
        elapsedSeconds: Number(elapsed),
        results: this.results
      }, null, 2));
      return;
    }

    console.log(`\n${C.bold}================================================================${C.reset}`);
    console.log(`${C.bold}RESUMO FINAL DOS TESTES E2E${C.reset}`);
    console.log(`Tempo total decorrido: ${elapsed}s`);
    console.log(`Total de verificações: ${this.summary.total}`);
    console.log(`  ${C.green}Passaram (PASS):  ${this.summary.passed}${C.reset}`);
    console.log(`  ${C.red}Falharam (FAIL):  ${this.summary.failed}${C.reset}`);
    console.log(`  ${C.yellow}Pendentes (PEND): ${this.summary.pending}${C.reset}`);
    console.log(`  ${C.gray}Ignorados (SKIP): ${this.summary.skipped}${C.reset}`);
    console.log(`${C.bold}================================================================${C.reset}`);

    if (this.summary.failed > 0) {
      console.log(`${C.bgRed}${C.bold} RESULTADO: FALHA (${this.summary.failed} falha(s) detectada(s)) ${C.reset}\n`);
    } else if (this.summary.pending > 0 && this.options.strict) {
      console.log(`${C.bgRed}${C.bold} RESULTADO: FALHA (Modo strict ativo com pendências) ${C.reset}\n`);
    } else if (this.summary.pending > 0) {
      console.log(`${C.bgGreen}${C.bold} RESULTADO: SUCESSO PARCIAL ${C.reset} ${C.yellow}(${this.summary.pending} itens pendentes de implementação futura)${C.reset}\n`);
    } else {
      console.log(`${C.bgGreen}${C.bold} RESULTADO: 100% SUCESSO (Todos os testes passaram) ${C.reset}\n`);
    }
  }

  get hasFailures() {
    if (this.options.strict) {
      return this.summary.failed > 0 || this.summary.pending > 0;
    }
    return this.summary.failed > 0;
  }
}

// ============================================================================
// AUXILIARES DE ANÁLISE ESTÁTICA DE CÓDIGO HTML/JS
// ============================================================================
function inspectHtmlContent(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, content: '' };
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return { exists: true, content };
}

// ============================================================================
// TIER 1: FEATURE COVERAGE
// ============================================================================
function runTier1(targets, reporter, options) {
  reporter.header('TIER 1: Feature Coverage (HTML, Three.js, Canvas, PBR, Web Audio, Touch)');

  for (const target of targets) {
    const fullPath = path.join(ROOT, target.file);
    const { exists, content } = inspectHtmlContent(fullPath);

    if (!exists) {
      if (options.strict) {
        reporter.record(1, target.name, 'Existência física do arquivo HTML', 'FAIL', `Arquivo ausente: ${target.file}`);
      } else {
        reporter.record(1, target.name, 'Existência física do arquivo HTML', 'PENDING', `Aguardando implementação em lote futuro (${target.file})`);
      }
      continue;
    }

    // 1. Three.js Import
    const hasThree = /three(?:\.min|\.core|\.module)?\.js/i.test(content) ||
                     /import\s+.*(?:THREE|from\s+['"][^'"]*three)/i.test(content) ||
                     /"three":\s*["']/i.test(content) ||
                     /window\.THREE/i.test(content);
    reporter.record(1, target.name, 'Importação Three.js (r160 / modular / bundle)', hasThree ? 'PASS' : 'FAIL', hasThree ? 'Módulo/Script detectado' : 'Nenhuma referência a Three.js');

    // 2. WebGL Canvas / Container
    const hasCanvas = /<canvas/i.test(content) ||
                      /id=["']canvas-container["']/i.test(content) ||
                      /class=["'][^"']*canvas-container[^"']*["']/i.test(content) ||
                      /EngineRenderer/i.test(content) ||
                      /WebGLRenderer/i.test(content) ||
                      /renderer\.domElement/i.test(content);
    reporter.record(1, target.name, 'Elemento Canvas WebGL / Container', hasCanvas ? 'PASS' : 'FAIL', hasCanvas ? 'Canvas ou container presente' : 'Nenhum canvas ou montador WebGL');

    // 3. PBR Materials (MeshStandardMaterial, MeshPhysicalMaterial ou MaterialFactory)
    const sceneSources = [content];
    for (const [, specifier] of content.matchAll(/\bfrom\s+['"](\.\.?\/[^'"]+\.js)['"]/g)) {
      const imported = path.resolve(path.dirname(fullPath), specifier);
      if (fs.existsSync(imported)) sceneSources.push(fs.readFileSync(imported, 'utf8'));
    }
    const hasPbr = sceneSources.some(source => /MeshStandardMaterial|MeshPhysicalMaterial|MaterialFactory/i.test(source));
    reporter.record(1, target.name, 'Materiais PBR (Standard/Physical/MaterialFactory)', hasPbr ? 'PASS' : 'FAIL', hasPbr ? 'PBR shaders configurados' : 'Ausência de materiais PBR');

    // 4. Web Audio API / Responsivo
    const hasAudio = /AudioContext|webkitAudioContext/i.test(content) ||
                     /ResponsiveAudio/i.test(content) ||
                     /ZenAudioEngine/i.test(content) ||
                     /createOscillator|createGain/i.test(content) ||
                     /audio\.(?:play|setMuted|dispose)/i.test(content);
    reporter.record(1, target.name, 'Web Audio API / Síntese sonora responsiva', hasAudio ? 'PASS' : 'FAIL', hasAudio ? 'Engine ou nós de áudio encontrados' : 'Sem áudio interativo');

    // 5. Touch / Pointer Event Handlers
    const hasTouchPointer = /pointer(?:down|up|move|cancel|leave|capture)/i.test(content) ||
                            /touch(?:start|move|end)/i.test(content) ||
                            /InputController/i.test(content) ||
                            /OrbitControls/i.test(content) ||
                            /addEventListener\s*\(\s*['"](?:pointer|touch|click|mouse)/i.test(content) ||
                            /on(?:click|input|pointerdown|touchstart)=/i.test(content);
    reporter.record(1, target.name, 'Manipuladores de Eventos Touch / Pointer / Mouse', hasTouchPointer ? 'PASS' : 'FAIL', hasTouchPointer ? 'Interação tátil configurada' : 'Nenhum handler tátil/ponteiro');
  }
}

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES
// ============================================================================
function runTier2(targets, reporter, options) {
  reporter.header('TIER 2: Boundary & Corner Cases (Mobile Viewport, Safe-Area, Sangi-Bridge, Clean Release)');

  for (const target of targets) {
    const fullPath = path.join(ROOT, target.file);
    const { exists, content } = inspectHtmlContent(fullPath);

    if (!exists) {
      if (options.strict) {
        reporter.record(2, target.name, 'Inspeção de Contratos e Limites', 'FAIL', `Arquivo ausente: ${target.file}`);
      } else {
        reporter.record(2, target.name, 'Inspeção de Contratos e Limites', 'PENDING', `Ambiente pendente de criação (${target.file})`);
      }
      continue;
    }

    // 1. Viewport Meta Tag para dispositivos móveis
    const hasViewport = /<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*["']/i.test(content);
    reporter.record(2, target.name, 'Meta Tag Viewport Mobile (width=device-width)', hasViewport ? 'PASS' : 'FAIL', hasViewport ? 'Viewport configurado' : 'Falta meta viewport responsivo');

    // 2. Touch-action & CSS Resilience (prevenção de zoom acidental ou arraste nativo)
    const hasTouchCss = /touch-action:\s*(?:none|manipulation|pan-x|pan-y)/i.test(content) ||
                        /-webkit-tap-highlight-color:\s*transparent/i.test(content) ||
                        /overflow:\s*hidden/i.test(content) ||
                        /user-select:\s*none/i.test(content);
    reporter.record(2, target.name, 'Resiliência CSS Mobile (touch-action / tap-highlight / overflow)', hasTouchCss ? 'PASS' : 'FAIL', hasTouchCss ? 'Regras de toque móvel ativas' : 'Sem proteção contra gestos nativos indesejados');

    // 3. Safe-Area / Dynamic Viewport (100dvh, viewport-fit=cover, safe-area-inset)
    const hasSafeArea = /viewport-fit=cover/i.test(content) ||
                        /100dvh/i.test(content) ||
                        /safe-area-inset/i.test(content);
    reporter.record(2, target.name, 'Safe-Area & Viewport Dinâmico (100dvh / viewport-fit=cover)', hasSafeArea ? 'PASS' : 'FAIL', hasSafeArea ? 'Adaptação a entalhes e barras móveis' : 'Falta tratamento de 100dvh ou safe-area');

    // 4. Sangi-Bridge & Ciclo de Vida postMessage (READY, PAUSE, RESUME, MUTE, DISPOSE)
    const hasSangiBridgeScript = /shared\/sangi-bridge\.js/i.test(content);
    const hasLifecycleManager = /LifecycleManager/i.test(content);
    const hasCustomListeners = /sangi:(?:pause|resume|mute|dispose)/i.test(content);
    const hasPostMessage = /postMessage\s*\(\s*\{[^}]*type:\s*['"]SANGI_APP_/i.test(content);

    const hasLifecycle = hasSangiBridgeScript || hasLifecycleManager || hasCustomListeners || hasPostMessage;
    reporter.record(2, target.name, 'Ponte Universal Sangi3D & Eventos de Ciclo de Vida', hasLifecycle ? 'PASS' : 'FAIL', hasLifecycle ? 'sangi-bridge / LifecycleManager integrado' : 'Sem conformidade com ciclo de vida Sangi3D');

    // 5. Clean Resource Release (descarte limpo de geometrias, materiais, áudio, WebGL)
    const hasDispose = /dispose\s*\(/i.test(content) ||
                       /loseContext\s*\(/i.test(content) ||
                       (hasLifecycleManager && /dispose:/i.test(content));
    reporter.record(2, target.name, 'Descarte Limpo de Recursos (dispose / loseContext / WebGL cleanup)', hasDispose ? 'PASS' : 'FAIL', hasDispose ? 'Rotinas de descarte de memória presentes' : 'Possível vazamento de memória sem dispose()');
  }
}

// ============================================================================
// TIER 3: CATALOG & MANIFEST INTEGRATION
// ============================================================================
async function runTier3(targets, reporter, options) {
  reporter.header('TIER 3: Catalog & Manifest Integration (api/apps.json, verify-catalog.mjs)');

  const catalogFile = path.join(ROOT, 'Sistema', 'api', 'apps.json');

  // 1. Integridade do catálogo
  let apps = null;
  try {
    apps = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
    reporter.record(3, null, 'Leitura e parsing de Sistema/api/apps.json', 'PASS', `Total de entradas: ${apps.length}`);
  } catch (err) {
    reporter.record(3, null, 'Leitura e parsing de Sistema/api/apps.json', 'FAIL', err.message);
    return;
  }

  // 2. Unicidade de IDs e ausência de autorreferência
  const idMap = new Map();
  let duplicateCount = 0;
  let selfRefCount = 0;

  for (const app of apps) {
    if (idMap.has(app.id)) duplicateCount++;
    else idMap.set(app.id, app);

    if (app.name === 'Ambientes' || app.url === '/index.html' || app.url === 'index.html') {
      selfRefCount++;
    }
  }

  reporter.record(3, null, 'Unicidade estrita de identificadores (IDs únicos)', duplicateCount === 0 ? 'PASS' : 'FAIL', duplicateCount === 0 ? 'Zero IDs duplicados' : `${duplicateCount} duplicidade(s)`);
  reporter.record(3, null, 'Ausência de autorreferência ao index do Launcher', selfRefCount === 0 ? 'PASS' : 'FAIL', selfRefCount === 0 ? 'Zero autorreferências' : `${selfRefCount} autorreferência(s)`);

  // 3. Verificação individual dos 17 ambientes alvo no manifesto
  for (const target of targets) {
    const entry = apps.find(a => a.id === target.id);
    if (!entry) {
      reporter.record(3, target.name, 'Presença registrada no catálogo api/apps.json', 'FAIL', `ID não encontrado: ${target.id}`);
      continue;
    }

    reporter.record(3, target.name, 'Presença registrada no catálogo api/apps.json', 'PASS', `ID verificado (${entry.collection || entry.category || 'catálogo'})`);

    // 4. Verificação de transição de status vs existência física
    const fullPath = path.join(ROOT, target.file);
    const fileExists = fs.existsSync(fullPath);

    if (fileExists) {
      if (entry.status === 'ready') {
        const urlMatches = entry.url && entry.url.includes(path.basename(target.file));
        reporter.record(3, target.name, 'Status de catálogo "ready" com URL válida', urlMatches ? 'PASS' : 'FAIL', entry.url);
      } else {
        reporter.record(3, target.name, 'Status de catálogo "ready"', 'PENDING', `Arquivo existe mas catálogo lista como "${entry.status}"`);
      }
    } else {
      if (entry.status === 'concept') {
        reporter.record(3, target.name, 'Status de catálogo em "concept" (pendente)', options.strict ? 'FAIL' : 'PENDING', 'Conceito não implementado ainda');
      } else {
        reporter.record(3, target.name, 'Coerência de status (ready sem arquivo)', 'FAIL', `Entrada marcada como "ready" mas arquivo não existe no disco`);
      }
    }
  }

  // 5. Execução do validador oficial do projeto Sistema/scripts/verify-catalog.mjs
  await new Promise((resolve) => {
    const proc = spawn('node', ['Sistema/scripts/verify-catalog.mjs'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => stdout += d.toString());
    proc.stderr.on('data', d => stderr += d.toString());

    proc.on('close', (code) => {
      const ok = code === 0 && !stdout.includes('❌ [ERRO]');
      reporter.record(3, null, 'Execução de Sistema/scripts/verify-catalog.mjs (Zero Erros)', ok ? 'PASS' : 'FAIL', ok ? 'Catálogo validado com 0 erros' : `Código de saída: ${code}`);
      resolve();
    });
  });
}

// ============================================================================
// TIER 4: LOCAL SERVER & HTTP SMOKE TESTING
// ============================================================================
async function runTier4(targets, reporter, options) {
  reporter.header(`TIER 4: Local Server & HTTP Smoke Testing (launcher/server.mjs --port ${options.port})`);

  let serverProcess = null;
  const port = options.port;

  // 1. Spawna launcher/server.mjs
  const serverStarted = await new Promise((resolve) => {
    let resolved = false;
    serverProcess = spawn('node', ['Sistema/launcher/server.mjs', '--port', String(port)], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reporter.record(4, null, 'Inicialização do Servidor Local', 'FAIL', `Timeout aguardando inicialização na porta ${port}`);
        resolve(false);
      }
    }, 10000);

    serverProcess.stdout.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('http://') && !resolved) {
        resolved = true;
        clearTimeout(timer);
        reporter.record(4, null, 'Inicialização do Servidor Local', 'PASS', `Ativo em http://127.0.0.1:${port}/`);
        resolve(true);
      }
    });

    serverProcess.stderr.on('data', (d) => {
      // erros de inicialização se houver
    });

    serverProcess.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        reporter.record(4, null, 'Inicialização do Servidor Local', 'FAIL', err.message);
        resolve(false);
      }
    });
  });

  if (!serverStarted) {
    if (serverProcess) serverProcess.kill();
    return;
  }

  // Função auxiliar de requisição HTTP
  function httpGet(urlPath) {
    return new Promise((resolve) => {
      const reqUrl = `http://127.0.0.1:${port}${urlPath}`;
      http.get(reqUrl, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            contentType: res.headers['content-type'] || '',
            contentLength: body.length,
            body
          });
        });
      }).on('error', (err) => {
        resolve({ statusCode: 500, error: err.message, body: '', contentLength: 0 });
      });
    });
  }

  try {
    // 2. Rota de API /api/apps
    const apiRes = await httpGet('/api/apps');
    const apiOk = apiRes.statusCode === 200 && apiRes.contentLength > 1000;
    reporter.record(4, null, 'Rota da API /api/apps (HTTP 200 JSON)', apiOk ? 'PASS' : 'FAIL', `Status: ${apiRes.statusCode}, Tamanho: ${apiRes.contentLength} bytes`);

    // 3. Teste das rotas dos 17 ambientes alvo
    for (const target of targets) {
      const fullPath = path.join(ROOT, target.file);
      const fileExists = fs.existsSync(fullPath);

      if (!fileExists) {
        if (options.strict) {
          reporter.record(4, target.name, 'Disponibilidade HTTP da Rota', 'FAIL', `Arquivo ainda não criado: ${target.url}`);
        } else {
          reporter.record(4, target.name, 'Disponibilidade HTTP da Rota', 'PENDING', `Aguardando implementação do ambiente: ${target.url}`);
        }
        continue;
      }

      // Se o arquivo existe no disco, testa a rota HTTP servida pelo launcher
      const res = await httpGet(target.url);
      const is200 = res.statusCode === 200;
      const isHtml = res.contentType.includes('text/html');
      const hasLength = res.contentLength > 200;
      const valid = is200 && isHtml && hasLength;

      reporter.record(4, target.name, `Requisição HTTP GET ${target.url}`, valid ? 'PASS' : 'FAIL',
        valid ? `200 OK (${res.contentLength} bytes)` : `Status: ${res.statusCode}, Tipo: ${res.contentType}`);
    }
  } finally {
    // Encerramento seguro do processo do servidor
    if (serverProcess) {
      try {
        serverProcess.kill('SIGTERM');
      } catch (e) {}
    }
  }
}

// ============================================================================
// FLUXO PRINCIPAL DE EXECUÇÃO
// ============================================================================
async function main() {
  const options = parseCliArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Filtragem dos alvos
  let targets = [...TARGET_ENVIRONMENTS];

  if (options.batch === '1') {
    targets = targets.filter(t => t.batch === 1);
  } else if (options.batch === '2') {
    targets = targets.filter(t => t.batch === 2);
  }

  if (options.env) {
    const q = options.env.toLowerCase();
    targets = targets.filter(t => 
      String(t.num) === q || 
      t.id.toLowerCase().includes(q) || 
      t.folder.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    );
    if (targets.length === 0) {
      console.error(`${C.red}Nenhum ambiente encontrado correspondente ao filtro: ${options.env}${C.reset}`);
      process.exit(1);
    }
  }

  if (!options.json) {
    console.log(`\n${C.bold}================================================================${C.reset}`);
    console.log(`${C.bold}Sangi3D — Execução da Suíte de Testes E2E (Tiers 1-4)${C.reset}`);
    console.log(`Ambientes selecionados: ${targets.length} de ${TARGET_ENVIRONMENTS.length}`);
    console.log(`Configuração: Tier=${options.tier.toUpperCase()}, Batch=${options.batch.toUpperCase()}, Strict=${options.strict}`);
    console.log(`${C.bold}================================================================${C.reset}`);
  }

  const reporter = new TestSuiteReporter(options);

  try {
    // Execução seletiva de Tiers
    if (options.tier === 'all' || options.tier === '1') {
      runTier1(targets, reporter, options);
    }
    if (options.tier === 'all' || options.tier === '2') {
      runTier2(targets, reporter, options);
    }
    if (options.tier === 'all' || options.tier === '3') {
      await runTier3(targets, reporter, options);
    }
    if (options.tier === 'all' || options.tier === '4') {
      await runTier4(targets, reporter, options);
    }
  } catch (err) {
    console.error(`\n${C.red}Erro inesperado durante a execução dos testes: ${err.message}${C.reset}`);
    console.error(err.stack);
    process.exit(1);
  }

  reporter.printSummary();

  if (reporter.hasFailures) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
