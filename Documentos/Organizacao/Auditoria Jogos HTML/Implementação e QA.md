# Jogos HTML — Implementação e QA

## Entregas

| Frente | Resultado |
| --- | --- |
| Oficina de Mosaicos | Guia opcional para assentar, girar, rejuntar e revisar em órbita. A célula fica destacada na bancada. O percurso usa as ferramentas, o histórico e o salvamento existentes e pode ser fechado mantendo a obra. |
| Universo de uma Gota | Percurso opcional da seleção da amostra virtual à bancada, ao foco no microscópio e ao registro persistente no diário. A fotografia em PNG continua como ação separada. |
| Moinho Hidráulico | Three.js e controles locais na revisão r187. O guia acompanha vazão e rotação da simulação, e o controle de vazão mantém o foco ao usar as setas. O jogador pode reiniciar ou trocar para Livre e Desafios. |
| Geometria das Conchas | A interface voltou a inicializar com o controlador anatômico atual. A restauração cobre texturas, corte, mudança de enquadramento e captura macro. |
| Catálogo | A Agência Postal mantém sua URL e seu ID e aparece como variante identificada do Correio das Palavras Não Ditas. O catálogo gerado em diretório temporário passou na verificação. |
| Recursos locais | 29 entradas passaram a usar cópias locais das revisões de Three.js que já referenciavam. O carregamento foi validado via launcher HTTP. |

As entradas legadas usam as distribuições MIT já presentes em instalações locais do workspace. A revisão 0.128.0 aproveita o núcleo local e o OrbitControls da mesma versão. As revisões 0.160.0 e 0.160.1 têm subpastas e licenças próprias. O pós-processamento da r187 complementa a distribuição existente. O arquivo `Sistema/shared/vendor/sangi-html-three-sha256.json` registra 31 arquivos verificados.

## Verificação

- A suíte de catálogo passou em quatro testes, incluindo o caso em que datas diferentes dos arquivos podiam alternar qual versão do Correio ganhava o cartão.
- Os testes de guia de Mosaicos passaram em desktop, retrato e paisagem emulados. O teste do Moinho passou com rede externa bloqueada, incluindo abertura da comporta, aceleração, parada, foco do slider, Desfazer e recuperação quando o módulo local é bloqueado.
- O teste funcional de Gota validou o percurso desktop, identificação, objetiva, PNG, registro e persistência do diário, além de fluxos de saída em viewport móvel emulado. O teste compartilhado também passou em três formatos e na volta pelo launcher.
- Rode `node Sistema/scripts/check-all-games.mjs 1-jogos-html --offline --workers 2 --wait 15000` para repetir a triagem de carregamento com acesso exclusivamente local. O relatório registra falhas de recursos separadamente da verificação de canvas ou da interação escolhida para a entrada.

No ensaio final, as 51 rotas verificadas cumpriram o critério de abertura do script. Das 51, 33 passaram sem ocorrências e 18 registraram somente requisições bloqueadas de fontes ou do Tailwind CDN. O critério de abertura é um canvas visível na maioria das rotas. Em Geometria das Conchas, a checagem também seleciona o enquadramento macro e lê a assinatura do PNG. Em Restauro de Azulejos, abre a referência do quebra-cabeça. Consulte [o resultado por rota](Smoke%20da%20implementação%20offline.json).

O desenvolvimento de fases específicas dos demais jogos, a revisão visual em dispositivos físicos e a medição de desempenho em hardware-alvo seguem no roadmap da coleção. O catálogo publicado continua subordinado ao fluxo normal de publicação do projeto.
