# Atlas das Texturas

Jogo web 3D de observação de superfícies, em português brasileiro. A bancada oferece oito amostras, iluminação ajustável, lupa e um atlas de descritores e preferências.

## Executar

Abra um terminal nesta pasta e use Node.js 24 ou posterior.

```powershell
npm run dev
```

Abra http://127.0.0.1:4173. O servidor escuta apenas no endereço local. Também é possível hospedar a pasta `dist/` em um servidor HTTP estático, inclusive sob um subdiretório. O jogo não usa CDN, login ou API. 

```powershell
npm test
npm run build
npm run preview
```

O runtime usa TypeScript, Three.js r187 e um script de build com a remoção de tipos do Node. A cópia local do Three.js inclui a licença MIT. Consulte `assets/manifest.json` e `assets/credits.md`.

## Jogar

Escolha o modo Livre, Guiado ou Acompanhado. No Acompanhado, selecione de duas a quatro amostras. Use os botões de rotação, luz e lupa. Arrastar a bancada gira a amostra, ajusta a luz na terceira etapa ou desloca a área ampliada enquanto a lupa está aberta. Pressione Esc para pausar. Os controles permanecem disponíveis em modo descritivo se o WebGL falhar.

Compare duas amostras sob condições equivalentes e guarde observações opcionais. O atlas mantém uma entrada por amostra e permite retirá-la. O botão Exportar JSON salva um resumo por ação explícita. Som e movimento reduzido são preferências locais. A coleção fica em memória até recarregar, sair do jogo ou recomeçar a sessão.

## Estrutura

- `game/` — conteúdo, regras e estado serializável.
- `scene/` — bancada, materiais, modelo das amostras e câmeras.
- `input/`, `ui/`, `audio/` — controles, interface e sons.
- `tests/` — testes de regras.
- `capturas/` — imagens do Chrome em desktop e celular emulado.
- `VERIFICACAO.md` — verificações executadas e itens pendentes.

Para repetir a verificação de navegador em Windows com Chrome instalado, execute `npm run test:browser`. Use a variável `ATLAS_CHROME` para indicar outro caminho do executável.
