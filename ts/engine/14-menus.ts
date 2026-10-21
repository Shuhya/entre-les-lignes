/// <reference path="../types.ts" />
/* ts/engine/14-menus.ts — menus, bibliothèque, Guide, fiche progression, boutons, démarrage (section 14/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
localStorage.setItem("etl_stats",JSON.stringify(STATS))}catch(e){}}
function fmtT(sec){const h=Math.floor(sec/3600),m=Ma