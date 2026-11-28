# 80. Museu dos Objetos Desmontáveis

Use em conjunto com `00_PROMPT_BASE.md`. Aplique o briefing específico abaixo, preservado da Coleção 80.

**Categoria:** Imersao e simuladores | **Uso potencial:** museus; educação; engenharia.

Implemente uma aplicação independente chamada **Museu dos Objetos Desmontáveis**. A referência principal é o briefing abaixo. Caso eu anexe um mockup, preserve composição, materiais, escala e identidade visual, sem usar a imagem como cenário clicável. Caso não anexe, construa a cena integralmente com os assets procedurais descritos. A entrega é um HTML jogável, não um mockup ou proposta.

## Briefing individual
**Cena e enquadramento:** Galeria técnica com telefone retrô, câmera, ventilador e toca-discos fictícios em bancadas. Crie objetos principais em escala coerente, decoração contextual discreta, câmera geral e close-up da atividade. A composição precisa deixar visíveis os pontos de interação; use iluminação e materiais próprios desta cena, não a paleta de outro projeto.

**Loop principal:** selecionar objeto, explodir componentes, retirar peças na ordem, explorar função e remontar. Cada etapa é opcional no modo livre, mas o modo guiado apresenta a ordem de uso, exemplo visual e resultado. Permita repetir, comparar versões ou reiniciar sem perder trabalho inadvertidamente.

**Ferramentas e ações obrigatórias:**
1. Selecionar objeto. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.
2. Explodir componentes. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.
3. Retirar peças na ordem. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.
4. Explorar função e remontar. O estado deve refletir a ação; mostre feedback e permita sair da ferramenta.

**Implementação física individual:** hierarquia de peças, sockets, restrições de dependência e animação cinemática. Separe estado lógico e representação. Defina condições iniciais, limites estáveis, unidades, tolerâncias e critérios de término. Mapeie controles a parâmetros observáveis e use feedback coerente. Inclua pelo menos três variações de conteúdo usando os objetos desta cena (presets ou configurações realmente diferentes), um estado inicial de demonstração e opção de começar vazio quando aplicável.

**Modos e público:** Ofereça modo livre de experimentação, uma demonstração guiada, e desafios opcionais sem pressão quando fizer sentido. Uso potencial: museus; educação; engenharia. O conteúdo não deve impor finalidade clínica a quem só quer explorar.

**Critérios individuais de aprovação:**
- Peças mantêm identidade e posição, dependências impedem encaixe indevido, remontagem restaura objeto.
- Todos os passos do loop são executáveis por controles visíveis, com estado real, sem botões decorativos.
- Salvar/exportar e reabrir preservam configurações relevantes; caso exportação de mídia não seja viável, entregue JSON funcional e diga o que não foi implementado.

**Interface exclusiva:** nomes das ferramentas derivados das ações acima; dock enxuto com as principais e opções secundárias em painel recolhível. HUD indica ferramenta, estado e próximo passo, quando guiado. A cena mantém prioridade visual. Controle de câmera e qualidade comuns, identidade cromática própria.

## Referências visuais opcionais

Caixa de Música Perfurada — Loja Corda e Melodia: materiais de madeira/latão, mecanismo manipulável, papel texturizado, áudio sincronizado. Máquina de Garra de Brindes — Doce Mel Confeitaria: estados físicos, cápsulas, controles diretos, identidade comercial. Maquete que se Monta — Ateliê Traço Arquitetura: construção em etapas, câmera e acabamento configurável. Terrário de Vidro — Verde Miúdo Plantas: composição, superfícies granulares, vidro e vegetação. Use como inspiração de execução, não copie marca ou layout. Não dependa desses arquivos para iniciar.
