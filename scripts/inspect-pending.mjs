import fs from "fs";
import path from "path";

const kit17 = [
  "04-observatorio-da-luz",
  "05-oficina-do-tempo",
  "06-torre-do-impulso",
  "07-ilha-das-pausas",
  "09-estacao-das-trocas",
  "13-museu-dos-pontos-de-vista",
  "14-estudio-dos-limites",
  "16-teatro-das-historias-possiveis"
];

console.log("=== KIT 17 PENDING ===");
for (const dir of kit17) {
  const p = path.join("Kit_17_jogos_3D_mockups_e_prompts", dir);
  if (fs.existsSync(p)) {
    console.log(dir, "->", fs.readdirSync(p));
  } else {
    console.log(dir, "-> NOT FOUND");
  }
}

const marcas = [
  "04_maquina-de-escrever-das-intencoes",
  "05_clepsidra-do-foco",
  "07_copos-musicais",
  "08_toca-discos-de-vinil",
  "10_maquina-de-reacao-em-cadeia",
  "11_relogio-aberto",
  "14_bancada-da-manicure",
  "15_barista-de-bancada",
  "18_orgao-do-perfumista"
];

console.log("\n=== ADULTOS E MARCAS PENDING ===");
let baseMarcas = "ambientes-interativos-adultos-e-marcas";
if (fs.existsSync(path.join(baseMarcas, "ambientes-interativos-adultos-e-marcas"))) {
  baseMarcas = path.join(baseMarcas, "ambientes-interativos-adultos-e-marcas");
}
for (const dir of marcas) {
  const p = path.join(baseMarcas, dir);
  if (fs.existsSync(p)) {
    console.log(dir, "->", fs.readdirSync(p));
  } else {
    console.log(dir, "-> NOT FOUND");
  }
}
