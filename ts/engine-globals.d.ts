/* ts/engine-globals.d.ts — étape 4 migration TS+Vite.
   Le moteur est typechecké CONCATÉNÉ (scripts/typecheck-engine.js) car les 16 sections
   ts/engine/ ne parsent pas individuellement (découpage au milieu d'expressions).
   Ce fichier déclare les symboles inter-fichiers : ceux définis dans js/assets.js
   (IMG, AVF1-4, AVM1, VOICES) et js/story.js (S, STORIES), + propriétés non standard
   de window/document utilisées par le moteur (webkit*, __ghost, etlMisc, __noan).
   La même liste est déclarée dans .eslintrc.json (globals js/engine.js) — garder en sync.
   Typage progressif : ces `any` seront resserrés au fil du typage des sections. */

/* eslint-disable no-var */
declare const S: any;
declare const STORIES: any;
declare const ETL_SUM: any;
declare const IMG: any;
declare const VOICES: any;
declare const AVF1: any;
declare const AVF2: any;
declare const AVF3: any;
declare const AVF4: any;
declare const AVM1: any;
declare const AVM2: any;

interface Window {
  __ghost?: () => boolean;
  etlMisc?: { stopPro?: () => void; endsOf?: (s: any) => number; feN?: (s: any) => number };
  __noan?: number;
  webkitAudioContext?: typeof AudioContext;
}
interface Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
}
interface HTMLElement {
  webkitRequestFullscreen?: () => any;
}
