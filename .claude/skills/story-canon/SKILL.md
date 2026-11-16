---
name: story-canon
description: Use when editing ANY narrative content in this repo (ts/story.ts, js/story.js, ETL_SUM, ETL_FINS, CALLS.csv). Keeps the canon single-sourced and consistent.
---

# Canon d'histoire — règles de ce repo

## Source unique et miroirs
- **`ts/story.ts` est la source unique du contenu narratif.** `js/story.js` doit rester son **miroir EXACT** (vérifié octet/octet par `scripts/check-ts-mirror.js` via `validate.js`) : éditer les DEUX fichiers à l'identique, sans annotations TS dans la partie miroir.
- **`ts/engine/` est la source unique du moteur** ; `js/engine.js` est généré : `node scripts/build-engine-from-ts.js --write` (ne JAMAIS éditer js/engine.js à la main).
- `ETL_SUM` (résumés de chapitres) et `ETL_FINS` (tag format + post partageable par fin) vivent dans `ts/story.ts`/`js/story.js` et doivent rester **synchronisés** — toute nouvelle fin/chapitre y est ajoutée.

## Structure d'un nœud
- id en `h…` (chapitre 1) ou `q…` (chapitre 2), pas de doublon (`validate.js` le vérifie : 0 lien cassé, 0 orphelin).
- `c:` = choix [label, next, effet, rmsg] ; `f:` = nom de fin ; `endc:` = texte de fin de chapitre ; `j:` = saut conditionnel sur flags.
- Flags d'état (`st.*` : trst, mig, pol, piege, avou, pov, prm, cal_h8, recall, int, sil, mentir…) : une fin doit pouvoir s'appuyer dessus (les fins se « souviennent » des choix).

## Audio
- `assets/audio/CALLS.csv` = lignes d'appels ; seules les `replique` sont voicées (voir `assets/audio/ELEVENLABS.md`) ; noms de fichiers prévus dans le CSV.

## Checklist avant push de contenu
1. `node scripts/validate.js` (miroir, liens, nœuds, ?v=).
2. `ROUTE=a|b node scripts/smoke.js` + `node scripts/smoke_ch2.js` (parcours jouables).
3. `node scripts/bump-version.js <x.y> "…"` puis build + push (voir `release-etl`).
