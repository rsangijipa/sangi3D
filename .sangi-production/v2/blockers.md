# Active Blockers & Mitigations — Sangi3D 2.0

| ID | Category | Severity | Description | Status | Mitigation / Owner |
|---|---|---|---|---|---|
| B001 | Environment | Low | Physical mobile devices absent in local headless runner | Mitigated | Gate G16 marked as `DEVICE_VALIDATION_PENDING` while automated mobile emulation (360x640, 390x844) runs under Puppeteer/Playwright |
| B002 | Governance | High | `T11-jardim-dos-pensamentos.md` marked `BLOQUEADO: não iniciar implementação` (identity gate vs Tribunal / Pensar, Sentir e Agir / Rádio) | Blocked | Excluded from implementation queue until identity gate is resolved (`04_Pendencias/T11-jardim-dos-pensamentos.md`) |
| B003 | Governance | Medium | `T19-oficina-do-ritmo-compartilhado.md` marked `BLOQUEADO: não iniciar implementação` until source HTML verified + child/adult turn alternation & mute gate cleared | Blocked (M8) | Entry `#48` (`01_jogos_html-oficina-do-ritmo-oficina-do-ritmo-html`) tagged `gateBlocker: "T19"` in catalog; baseline permitted in M1, rewrite blocked in M8 until gate clears |
| B004 | Filesystem | Medium | `03_Colecoes/Expressao_e_Desenvolvimento/02-trilha-do-mestre-mandou/node_modules` is a broken NTFS junction to pre-reorganization path | Resolved (M0) | Removed broken junction reparse point via `cmd /c rmdir`; falls back to shared `03_Colecoes/Expressao_e_Desenvolvimento/node_modules` |
| B005 | Build Deps | Medium | `02_Projetos/oficina-dos-gestos-compartilhados-projeto` has `dist/` and `package.json` but `hasInstalledDependencies === false` (no `node_modules`) | Open | Existing `dist/` works for serving/baseline; M4 upgrade must install or link dependencies before running `vite build` |
