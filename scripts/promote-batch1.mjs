import fs from 'fs';

const batch1Mapping = {
  'kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz': '/Kit_17_jogos_3D_mockups_e_prompts/04-observatorio-da-luz/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-05-oficina-do-tempo': '/Kit_17_jogos_3D_mockups_e_prompts/05-oficina-do-tempo/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-06-torre-do-impulso': '/Kit_17_jogos_3D_mockups_e_prompts/06-torre-do-impulso/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-07-ilha-das-pausas': '/Kit_17_jogos_3D_mockups_e_prompts/07-ilha-das-pausas/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-09-estacao-das-trocas': '/Kit_17_jogos_3D_mockups_e_prompts/09-estacao-das-trocas/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-13-museu-dos-pontos-de-vista': '/Kit_17_jogos_3D_mockups_e_prompts/13-museu-dos-pontos-de-vista/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-14-estudio-dos-limites': '/Kit_17_jogos_3D_mockups_e_prompts/14-estudio-dos-limites/index.html',
  'kit_17_jogos_3d_mockups_e_prompts-16-teatro-das-historias-possiveis': '/Kit_17_jogos_3D_mockups_e_prompts/16-teatro-das-historias-possiveis/index.html'
};

const paths = ['api/apps.json', 'launcher/api/apps.json'];

for (const p of paths) {
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  let promoted = 0;
  for (const app of data) {
    if (batch1Mapping[app.id]) {
      app.status = 'ready';
      app.url = batch1Mapping[app.id];
      promoted++;
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Promovidos ${promoted} apps em ${p}`);
}
