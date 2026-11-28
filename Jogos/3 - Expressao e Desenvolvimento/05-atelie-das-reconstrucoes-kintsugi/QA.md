# Verificação do Ateliê das Reconstruções

Execução em 24 de novembro de 2026, no Windows, com Chrome 157, WebGL2 por SwiftShader e Node.js 26. As dimensões de celular são emuladas. As capturas em `capturas/` são da aplicação executada.

| Cenário | Resultado | Evidência |
| --- | --- | --- |
| Regras de criação e tolerâncias | PASS | Cinco testes unitários. Valida ângulo, distância, ocupação, compatibilidade, pausa, juntas, reset, modos e observação. |
| Seleção e encaixe na cena | PASS | Arraste do linho até a posição compatível no canvas. Rejeição por ângulo e confirmação do encaixe. |
| Laca e pigmento | PASS | Pincelada direta no canvas, cobertura por trecho e integral. Costura dourada registrada na captura de acabamento. |
| Órbita, vistas e recuperação da criação | PASS | Órbita após encaixe, vistas de bancada, de cima e de detalhe. Desfazer e refazer pelo teclado. Reinício confirmado. |
| Revisão de peça incompleta | PASS | Encerramento com 3 de 5 fragmentos e comparação com a peça inicial. Exportações PNG e JSON carregadas pelo navegador. |
| Demonstração e composição alternativa | PASS | Navegação e saída da demonstração com criação preservada. Vaso em composição alternativa e prato no modo guiado. |
| Interface responsiva | PASS | 1920×1080, 1280×720, 390×844, 360×640 e 844×390. Toque nos controles nas larguras menores. |
| Pausa, som e persistência | PASS | Pausa e retomada, áudio ativado e silenciado, reabertura após recarregar e exclusão da cópia local. |
| Build e cache offline | PASS | TypeScript estrito, build de produção e recarregamento com a rede desligada após instalação do service worker. |
| Renderização e degradação | PASS | Pipeline Cinema, modo Leve, perda e recuperação de contexto e fluxo por controles DOM sem WebGL2. |
| Launcher e eventos | PASS | Catálogo com miniatura, rota da aplicação retornando HTTP 200 e eventos versionados observados no iframe de mesma origem. |
| Fidelidade a mockup aprovado | NÃO TESTADO | A pasta fornecida tem direção visual escrita. |
| FPS sustentado, p50/p95, memória e Intel UHD em dispositivo físico | NÃO TESTADO | A execução automatizada usa renderização por software. |
| Auditoria completa com axe e leitor de tela | NÃO TESTADO | Navegação por teclado e controles HTML foram exercitados no Chrome. |

## Amostras da renderização direta

Os valores abaixo vêm do último frame observado em cada cenário. O tempo de CPU mede a submissão de renderização ao navegador. Os dados incluem as chamadas registradas pelo renderer no frame e variam com o estado da cena. A versão Cinema tem passes adicionais.

| Janela | Chamadas de desenho | Triângulos | CPU |
| --- | ---: | ---: | ---: |
| 1280×720 | 36 | 70.112 | 1,40 ms |
| 1920×1080 | 55 | 103.780 | 0,90 ms |
| 390×844 | 52 | 100.500 | 1,40 ms |
| 360×640 | 47 | 98.200 | 0,80 ms |
| 844×390 | 55 | 103.780 | 1,10 ms |

O conteúdo inicial do build soma aproximadamente 633 kB antes da compressão e cerca de 169 kB com gzip, considerando HTML, CSS, entrada e cena. O Vite sinaliza que o módulo minificado de Three.js e da cena excede 500 kB antes da compressão. O pós-processamento Cinema é carregado sob demanda. A auditoria do npm na instalação do lockfile apontou zero vulnerabilidades.
