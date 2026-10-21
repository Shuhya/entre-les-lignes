#!/usr/bin/env node
/* verify-dist-vite.js — étape 4 migration TS+Vite (pur Node). Vérifie la sortie du
   build Vite (npx vite build → dist-vite/) APRÈS build :
   - dist-vite/index.html et dist-vite/jeu.html présents ;
   - pour CHAQUE script classique de jeu.html (src="...js") : le fichier doit exister
     dans dist-vite/ et être OCTET PAR OCTET identique à la source (Vite ne doit pas
     transformer les scripts non-module). Si le chemin a été rebasé (assets/), on le
     détecte par nom de base.
   - hard gate : les deux html présents + les scripts retrouvés ne diffèrent jamais ;
   - warning seul : un script introuvable (Vite ne copie pas) — à couvrir avant l'étape 5.
   Branché dans .github/workflows/ci.yml (job build-vite). */
const fs=require('fs'),path=require('path');
const D='dist-vite';
let fail=0,warn=0;
const step=(ok,msg,w)=>{console.log((ok?'  ✓ ':'  ✗ ')+msg);if(!ok){w?warn++:fail++}};
if(!fs.existsSync(D)){console.error('✗ dist-vite/ absent — le build a-t-il tourné ?');process.exit(1)}
step(fs.existsSync(path.join(D,'index.html')),'dist-vite/index.html présent');
step(fs.existsSync(path.join(D,'jeu.html')),'dist-vite/jeu.html présent');
// collecte récursive de tous les fichiers de dist-vite
const all=[];
(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p):all.push(p)}})(D);
// scripts classiques de jeu.html source
const jeuSrc=fs.readFileSync('jeu.html','utf8');
const srcs=[...jeuSrc.matchAll(/<script src="([^"]+\.js[^"]*)"/g)].map(m=>m[1]);
for(const s of srcs){
  const base=path.basename(s.split('?')[0]);
  const srcP=path.join('js',base);
  const cand=all.filter(p=>path.basename(p)===base);
  if(!cand.length){step(false,'script non copié par Vite dans dist-vite/ : '+s+' (warning — à couvrir avant étape 5)',true);continue}
  let ok=false,n=0;
  for(const c of cand){n++;if(fs.readFileSync(c,'utf8')===fs.readFileSync(srcP,'utf8'))ok=true}
  step(ok,base+' présent dans dist-vite/ ('+n+' copie(s))'+(ok?'':' MAIS octets ≠ source — Vite a transformé un script classique !'));
}
console.log(warn?'⚠ '+warn+' warning(s)':'✓ dist-vite vérifié');
process.exit(fail?1:0);
