# Ateliê das Reconstruções · Kintsugi

Bancada 3D em Three.js/WebGL2 com três cerâmicas procedurais e atividades em português. Escolha entre tigela, prato e vaso, com três a sete fragmentos. As atividades incluem exploração livre, demonstração guiada, composição alternativa e acompanhamento presencial com registro de ações observáveis.

## Abrir

No Launcher dos Ambientes 3D, procure por **Ateliê das Reconstruções**. Também é possível servir a pasta `dist/` pelo HTTP local. Para trabalhar no projeto a partir desta pasta, rode:

```powershell
npm ci
npm run dev
```

Para gerar e abrir o build estático, rode:

```powershell
npm run build
npm run preview
```

O cache offline é instalado pelo build de produção em localhost ou HTTPS. No primeiro acesso, espere a abertura da cena antes de desconectar.

## Controles

- Em **Encaixar fragmentos**, selecione uma peça no linho ou na lista. Ajuste o ângulo nos botões e arraste até a posição iluminada ou use **Encaixar**.
- Em **Aplicar laca** e **Acabamento**, passe o ponteiro ao longo da junta. Os botões de trecho e de cobertura integral são equivalentes. A laca cobre a junta antes do pigmento.
- Em **Girar**, arraste para orbitar. Use a roda ou a pinça para aproximar. O painel oferece vistas de bancada, de cima e de detalhe.
- Use **Desfazer**, **Refazer**, Ctrl+Z ou Ctrl+Shift+Z para recuperar o estado de criação. H recolhe os controles e Esc fecha o painel.
- Em **Revisar**, compare o resultado com o início, baixe a imagem ou o resumo e encerre no estágio escolhido.

## Dados e integração

O áudio começa silenciado. A cópia da peça é criada no IndexedDB somente quando a pessoa confirma **Guardar neste dispositivo**. As observações ficam na sessão e entram no arquivo de resumo apenas mediante seleção. O mesmo menu de configurações permite reabrir ou excluir a cópia.

O modo `?embed=1` publica os eventos `ready`, `pause`, `resume`, `complete`, `exit` e `summary` para um iframe pai de mesma origem com referenciador verificável. A aplicação também emite `kintsugi:session` no DOM. A mensagem carrega `source: "atelie-kintsugi"`, `version: 1`, `type` e, quando aplicável, contagens. O Launcher detecta o projeto e o build pela estrutura existente.

## Verificação

```powershell
npm test
npm run build
npm run test:browser
```

O teste de navegador abre um servidor local de preview. No Windows ele usa o Chrome do sistema por padrão. Defina `KINTSUGI_CHANNEL=msedge` no ambiente para usar o Edge. Os resultados visuais ficam em `capturas/`. O manifesto, as coordenadas e os créditos ficam em `assets/`.
