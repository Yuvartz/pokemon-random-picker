/**
 * One-time generator script.
 *
 * Fetches base data (name, types, primary ability, height, weight, stats)
 * for the original 151 Pokémon from PokéAPI and writes it to
 * src/data/generated/pokemonBase.json.
 *
 * The generated file is committed to the repo so the app never depends on
 * live PokéAPI requests for text data. Re-run with:
 *
 *   node scripts/fetch-pokemon-data.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_FILE = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "generated",
  "pokemonBase.json"
);

const API = "https://pokeapi.co/api/v2/pokemon";
const FIRST_ID = 1;
const LAST_ID = 151;

async function fetchJson(url, attempt = 1) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } catch (err) {
    if (attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    return fetchJson(url, attempt + 1);
  }
}

function statValue(stats, name) {
  const entry = stats.find((s) => s.stat.name === name);
  if (!entry) throw new Error(`Missing stat ${name}`);
  return entry.base_stat;
}

async function main() {
  const results = [];
  for (let id = FIRST_ID; id <= LAST_ID; id++) {
    const p = await fetchJson(`${API}/${id}`);
    const primaryAbility = p.abilities
      .filter((a) => !a.is_hidden)
      .sort((a, b) => a.slot - b.slot)[0];
    results.push({
      id,
      name: p.name,
      types: p.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
      ability: primaryAbility.ability.name,
      // PokéAPI units: height in decimetres, weight in hectograms.
      heightM: p.height / 10,
      weightKg: p.weight / 10,
      stats: {
        hp: statValue(p.stats, "hp"),
        attack: statValue(p.stats, "attack"),
        defense: statValue(p.stats, "defense"),
        specialAttack: statValue(p.stats, "special-attack"),
        specialDefense: statValue(p.stats, "special-defense"),
        speed: statValue(p.stats, "speed"),
      },
    });
    process.stdout.write(`\rFetched ${id}/${LAST_ID}`);
  }
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${results.length} entries to ${OUT_FILE}`);

  const abilities = [...new Set(results.map((r) => r.ability))].sort();
  console.log(`Unique primary abilities (${abilities.length}):`);
  console.log(abilities.join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
