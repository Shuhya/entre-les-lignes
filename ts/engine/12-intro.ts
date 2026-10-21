/// <reference path="../types.ts" />
/* ts/engine/12-intro.ts — intro chapitre (introH), veil, lockWake, awayOv (récits) (section 12/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
ON.parse(localStorage.getItem("etl_stats")||"{}"))}catch(e){}
let statsMark=Date.now();
fu