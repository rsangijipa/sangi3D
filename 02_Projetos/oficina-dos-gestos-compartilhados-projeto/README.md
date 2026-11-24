# Oficina dos Gestos Compartilhados

Ateliê artístico 3D interativo construído com **Three.js** e **TypeScript**, projetado para experimentação tátil-visual, imitação motora, alternância de turnos e criação colaborativa.

> **Aviso de uso profissional**: Este recurso é complementar à prática profissional e educacional e **não constitui instrumento de avaliação psicológica validado**. As criações artísticas nunca são classificadas como certas ou erradas.

## Estações Interativas

1. **Estação A — Pintura gestual**: Cavalete inclinado com tela de algodão, pincéis de diferentes cerdas, espátulas e 6 tigelas de pigmentos (mistura de cores, pressão simulada, espessura de tinta e marcas de cerdas).
2. **Estação B — Escultura colaborativa**: Bancada de madeira com torno de oleiro e argila deformável por heightmap volumétrico (pressionar, puxar, achatar, alisar, acrescentar e remover, preservando contribuições por participante).
3. **Estação C — Desenho na areia**: Bandeja de areia fina com rastelos (estreito e largo), pedras de rio, pincel e nivelador (sulcos, deslocamento lateral de grãos, marcas de pressão e alisamento).
4. **Estação D — Gestos no ar**: Instalação suspensa com 5 fitas de seda simuladas por restrições de distância (Verlet), elasticidade, amortecimento, gravidade e trajetórias 3D luminosas.
5. **Estação E — Ritmo compartilhado**: Xilofone de madeira, sinos tubulares suspensos, tambor de pele e djembê com animações físicas de impacto sincronizadas à síntese Web Audio API.

## Modos de Experiência

- **Exploração livre**: todos os materiais disponíveis, sem objetivos obrigatórios.
- **Imitação**: demonstração de gesto com guia visual opcional para reprodução.
- **Criação compartilhada**: alternância de turnos entre Participante A e Participante B na mesma composição.
- **Complete meu gesto**: um participante inicia o traço/forma/sequência e o outro continua.
- **Espelhamento**: gestos reproduzidos simetricamente na superfície ou entre estações.
- **Experimentação terapêutica**: perguntas abertas sobre o processo criativo, sem interpretação automática.

## Recursos de Acompanhamento (ABA / Mediação)

Painel configurável com: número de etapas, complexidade dos gestos, pistas/demonstrações visuais, tempo de resposta sem pressão, alternância entre participantes, quantidade de materiais disponíveis e registro local opcional de ações observáveis (independentes, com ajuda e pausas), exportável em JSON ou imagem PNG.

## Integração ao Catálogo

Compatível com `window.Imersivo` (botão **Catálogo** na barra superior e eventos `imersivo:return-catalog`).

## Execução e Build

```bash
npm install
npm run dev      # servidor local de desenvolvimento
npm run build    # verificação TypeScript + build estático em dist/
npm test         # suíte de testes unitários
```

O arquivo `dist/index.html` (e `oficina-dos-gestos-compartilhados.html`) é autocontido e pode ser aberto diretamente em qualquer navegador moderno com suporte a WebGL.
