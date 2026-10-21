/// <reference path="../types.ts" />
/* ts/engine/09-fins.ts — fins d'histoire (endsList, endScreen, fin), avatars, PART, applyApp, fils (thrOv) (section 9/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
 utilisées par start() et play() ---- */
let PROD=0; /* prologue déjà affiché par introH (v2.51) — évite le double affichag