#!/usr/bin/env node
/* typecheck-engine.js — étape 4 migration TS+Vite (pur Node, zéro dépendance directe).
   ts/engine/*.ts ne parsent pas individuellement (découpage de lecture au milieu
   d'expressions) : ce script concatène les 16 sections (exactement comme
   scripts/build-engine-from-ts.js), écrit le résultat dans un fichier temporaire et
   lance tsc dessus avec ts/engine-globals.d.ts (globals inter-fichiers).
   GATE PAR BASELINE : le typage du moteur est PROGRESSIF (889 erreurs en strict au
   départ). On exige que le nombre d'erreurs ne dépasse pas BASELINE ; chaque correctif
   le fait baisser — mettez alors BASELINE à jour (le script le rappelle).
   tsc : node_modules/typescript/lib/tsc.js en CI (après npm install --no-save
   typescript@5.6.3), ou TSC_BIN=<chemin>/tsc.js dans un env sans npm (sandbox).
   Branché dans .github/workflows/ci.yml (job typecheck). */
const fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
const DIR='ts/engine',MARK='/* [engine-section] */';
const BASELINE=104;
const files=fs.existsSync(DIR)?fs.readdirSync(DIR).filter(f=>f.endsWith('.ts')).sort():[];
if(files.length!==16){console.error('✗ attendu : 16 sections ts/engine, trouvé : '+files.length);process.exit(1)}
let out='';
for(const f of files){
  const t=fs.readFileSync(path.join(DIR,f),'utf8');
  const i=t.indexOf(MARK);
  if(i<0){console.error('✗ marqueur absent : '+f);process.exit(1)}
  out+=t.slice(i+MARK.length+1);
}
const tmp=path.join(os.tmpdir(),'etl-engine-concat-'+process.pid+'.ts');
fs.writeFileSync(tmp,out);
const tsc=process.env.TSC_BIN||path.join('node_modules','typescript','lib','tsc.js');
if(!fs.existsSync(tsc)){console.error('✗ tsc introuvable ('+tsc+') — npm install typescript ou TSC_BIN=...');process.exit(1)}
const r=cp.spawnSync(process.execPath,[tsc,'--noEmit','--target','ES2020','--module','none','--lib','ES2020,DOM','--skipLibCheck',tmp,path.join('ts','engine-globals.d.ts')],{encoding:'utf8'});
const n=((r.stdout||'')+(r.stderr||'')).split('error TS').length-1;
try{fs.unlinkSync(tmp)}catch(e){}
console.log('— Typecheck engine (concat 16 sections, non-strict)');
if(n>BASELINE){console.log('  ✗ '+n+' erreur(s) tsc > baseline '+BASELINE+' : RÉGRESSION de typage, corriger ou resserrer les annotations');process.exit(1)}
if(n===0){console.log('  ✓ 0 erreur — moteur entièrement typé 🎉');process.exit(0)}
if(n<BASELINE){console.log('  ✓ '+n+' erreur(s) ≤ baseline '+BASELINE+' (amélioration ! mettre BASELINE à '+n+' dans scripts/typecheck-engine.js)')}
else{console.log('  ✓ '+n+' erreur(s) = baseline (typage progressif, aucune régression)')}
