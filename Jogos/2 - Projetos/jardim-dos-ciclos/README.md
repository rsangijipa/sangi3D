# Jardim dos Ciclos

Experiência web 3D contemplativa e interativa sobre cuidado, crescimento, transformação e passagem do tempo — ambientada em uma estufa-jardim artesanal iluminada por luz lateral de fim de tarde.

> *"Cada mudança tem seu tempo."*

## Tecnologias

- **React 19 + TypeScript + Vite**
- **Three.js + `@react-three/fiber` + `@react-three/drei`**
- **`@react-three/postprocessing`** (Bloom discreto, Vignette quase imperceptível e ACES Filmic ToneMapping)
- **Zustand** com persistência local em `localStorage`
- **Framer Motion** (respeitando `prefers-reduced-motion` e controle interno de movimento reduzido)
- **Web Audio API** (síntese procedural opcional de brisa, pássaros distantes, água, cerâmica, cobre e folhas — desligada por padrão, com legendas sonoras acessíveis)
- Suporte preparado para **glTF + DRACO** e **KTX2/Basis** (`src/utils/assetLoaders.ts`)

## Como executar

```bash
cd jardim-dos-ciclos
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Escolher sementes & Plantar**: 4 espécies botânicas (*Camomila Silvestre*, *Lavanda de Estufa*, *Sálvia Dourada*, *Samambaia de Orvalho*) com animação de semente sendo depositada e afundando suavemente na terra.
- **6 estágios botânicos contínuos**: Semente, Broto, Muda, Crescimento, Florescimento e Recolhimento.
- **Regar & Borrifar**: intensidade ajustável que aciona o regador de cobre envelhecido ou o borrifador delicado de vidro, com gotas instanciadas e escurecimento úmido realista da terra e terracota.
- **Luz & Passagem de tempo**: controle contínuo do ciclo solar (Amanhecer, Manhã, Fim de Tarde, Crepúsculo) com fototropismo suave da planta e velocidade de tempo configurável.
- **Estações**: Primavera, Verão, Outono e Inverno alterando temperatura de luz, embaçamento do vidro, atmosfera e folhas secas.
- **Organizar bancada**: reposicionamento suave dos elementos de cuidado (por clique direto na cena ou teclado).
- **Meu registro**: caderno pessoal observacional (sem diagnósticos ou interpretações psicológicas), salvo localmente.
- **Exportar imagem**: fotografia em PNG diretamente da cena 3D com legenda editorial discreta.
