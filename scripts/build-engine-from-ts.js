#!/usr/bin/env node
/* build-engine-from-ts.js — Étape 2 migration TS+Vite (pur Node, zéro dépendance).
   ts/engine/01-*.ts … 16-*.ts sont les sections de js/engine.js (découpage de lecture,
   code identique). Ce script concatène les sections dans l'ordre alphabétique et
   vérifie que le résultat est js/engine.js OCTET PAR OCTET.
   Lancé par scripts/validate.js (donc CI à chaque push).
   Usage : node scripts/build-engine-from-ts.js [--write]  (--write régénère js/engine.js) */
const fs=require('fs'),path=require('path');
const DIR='ts/engine', MARK='/* [engine-section] */';
let fail=0;
const step=(ok,msg)=>{console.log((ok?'  ✓ ':'  ✗ ')+msg);if(!ok)fail=1};
const files=fs.existsSync(DIR)?fs.readdirSync(DIR).filter(f=>f.endsWith('.ts')).sort():[];
step(files.length===16, files.length+' section(s) ts/engine (attendu : 16)');
let out='';
for(const f of files){
  const t=fs.readFileSync(path.join(DIR,f),'utf8');
  const i=t.indexOf(MARK);
  if(i<0){step(false,'marqueur absent : '+f);process.exit(1)}
  out+=t.slice(i+MARK.length+1);
}
const js=fs.readFileSync('js/engine.js','utf8');
if(process.argv.includes('--write')){
  fs.writeFileSync('js/engine.js',out);
  console.log('js/engine.js régénéré depuis ts/engine/ ('+out.length+' octets)');
  process.exit(0);
}
step(out===js, out===js?'ts/engine/ (16 sections) ≡ js/engine.js (miroir exact)'
  :'miroir désynchronisé ! ('+out.length+' vs '+js.length+' octets)');
process.exit(fail);
