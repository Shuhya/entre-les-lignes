/// <reference path="../types.ts" />
/* ts/engine/07-apps-files.ts — apps natives : explorateur Fichiers, viewers plein écran (filesOv, vwOv) (section 7/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
TORIES[0],SC=0,PG={c:1,s:[]},nodeNow=null;
const $=i=>docu