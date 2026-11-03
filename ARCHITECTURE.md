# Architecture — « Entre les lignes » (v2.232)

## Moteur
- Source unique : `ts/` (TypeScript). `js/engine.js` est **généré** par `scripts/build-engine-from-ts.js --write` (concaténation des sections `ts/engine/*.ts` dans l'ordre alphabétique, après le marqueur `/* [engine-section] */`), vérifié octet par octet en CI par `scripts/validate.js`.
- `ts/engine/` = 19 sections : `01…15` + découpage v2.232 de l'ancienne section 16 en modules :
  - `16-sauvegarde.ts` — en-tête, audio (unlock/beep/hit), horloge (BFS), toast
  - `16a-reprise.ts` — IIFE sauvegarde/reprise + wrappers `play`/`fin`/`menu`/`start`
  - `16b-menus.ts` — `ch2pick`, actes (`actsMenu`/`startAct`/`act3pick`/`act3go`), `ch2go`
  - `16c-chap-resume.ts` — `chap()` (carte des chapitres), `resume()`, fin de l'IIFE
- `ts/story.ts` ≡ `js/story.js` (miroir contrôlé par `scripts/check-ts-mirror.js`).
- Pages servies en statique (GitHub Pages) : pas de bundler, d'où la concaténation.

## Décision typage (03/11/2026, v2.232)
**TS conservé, baseline gelée comme gate CI** (`scripts/typecheck-engine.js`, `BASELINE=98`, mesuré localement avec tsc 5.6.3 ; la purge v2.225 avait déjà fait passer 104 → 98). Rationnel : abandonner TS contredirait v2.226 (source unique) ; 0 erreur n'est pas atteignable sans réécriture du moteur non typé. Toute régression au-dessus de 98 bloque la CI.

## Tests
`validate.js` (structure + miroirs + refs ?v=), `test-menu.js`, `smoke.js` ROUTE=a/b (mock DOM), `typecheck-engine.js`, e2e Playwright (`e2e.js`, `e2e-chaos.js`) en CI, captures via branche `demo-shots` (workflow Shots).

## DA
Voir `DA.md` (DA de base : verre transparent + doré, jamais de carte opaque).
