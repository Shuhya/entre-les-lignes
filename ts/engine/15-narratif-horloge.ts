/// <reference path="../types.ts" />
/* ts/engine/15-narratif-horloge.ts — photoSvg, addPhoto, arrivalCue, horloge glissante (CLK), thème, toast (section 15/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
th.floor(sec%3600/60);return h?h+" h "+String(m).padStart(2,"0"):(m?m+" 