/// <reference path="../types.ts" />
/* ts/engine/10-notes-choix.ts — Notes de l'enquête (NH, notesOv), lockFx, générateur de choix mkCh() (section 10/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
e dans play() */
let STATS={t:0,msgs:0