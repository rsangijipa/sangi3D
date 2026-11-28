# 66. Estúdio de Figuras Articuladas

Use em conjunto com `00_PROMPT_BASE.md`. Aplique o briefing específico abaixo, preservado da Coleção 80.

**Categoria:** Psicologia e ABA | **Uso potencial:** imitação; percepção corporal; ABA sem exigir câmera.

Implemente uma aplicação independente chamada **Estúdio de Figuras Articuladas**. A referência principal é o briefing abaixo. Caso eu anexe um mockup, preserve composição, materiais, escala e identidade visual, sem usar a imagem como cenário clicável. Caso não anexe, construa a cena integralmente com os assets procedurais descritos. A entrega é um HTML jogável, não um mockup ou proposta.

## Briefing individual
**Cena e enquadramento:** Estúdio de desenho com manequins de madeira, espelho, pedestal e cartões de poses. Crie objetos principais em escala coerente, decoração contextual discreta, câmera geral e close-up da atividade. A composição precisa deixar visíveis os pontos de interação; use iluminação e materiais próprios desta cena, não a paleta de outro projeto.

**Loop principal:** ajustar articulações, reproduzir poses, comparar lados, criar sequência e demonstrar. Cada etapa é opcional no modo livre, mas o modo guiado apresenta a ordem de uso, exemplo visual e resultado. Permita repetir, comparar versões ou reiniciar sem perder trabalho inadvertidamente.

**Ferramentas e ações obrigatórias:**
1. Ajustar articulações. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.
2. Reproduzir poses. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.
3. Comparar lados. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.
4. Criar sequência e demonstrar. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.

**Implementação física individual:** hierarquia esquelética, limites articulares, IK simples opcional e interpolação de poses. Separe estado lógico e representação. Defina condições iniciais, limites estáveis, unidades, tolerâncias e critérios de término. Mapeie controles a parâmetros observáveis e use feedback coerente. Inclua pelo menos três variações de conteúdo usando os objetos desta cena (presets ou configurações realmente diferentes), um estado inicial de demonstração e opção de começar vazio quando aplicável.

**Modos e público:** Ofereça modo acompanhado com seleção de estímulos, ajuda graduada, resposta independente/com ajuda/recusa, registros voluntários e encerramento sem punição. Uso potencial: imitação; percepção corporal; ABA sem exigir câmera. O conteúdo não deve impor finalidade clínica a quem só quer explorar.

**Critérios individuais de aprovação:**
- Cotovelos/joelhos respeitam limites, pose espelhada correta, sequência salva reproduz.
- Todos os passos do loop são executáveis por controles visíveis, com estado real, sem botões decorativos.
- Salvar/exportar e reabrir preservam configurações relevantes; caso exportação de mídia não seja viável, entregue JSON funcional e diga o que não foi implementado.

**Interface exclusiva:** nomes das ferramentas derivados das ações acima; dock enxuto com as principais e opções secundárias em painel recolhível. HUD indica ferramenta, estado e próximo passo, quando guiado. A cena mantém prioridade visual. Controle de câmera e qualidade comuns, identidade cromática própria.

## Referências visuais opcionais

Caixa de Música Perfurada — Loja Corda e Melodia: materiais de madeira/latão, mecanismo manipulável, papel texturizado, áudio sincronizado. Máquina de Garra de Brindes — Doce Mel Confeitaria: estados físicos, cápsulas, controles diretos, identidade comercial. Maquete que se Monta — Ateliê Traço Arquitetura: construção em etapas, câmera e acabamento configurável. Terrário de Vidro — Verde Miúdo Plantas: composição, superfícies granulares, vidro e vegetação. Use como inspiração de execução, não copie marca ou layout. Não dependa desses arquivos para iniciar.
