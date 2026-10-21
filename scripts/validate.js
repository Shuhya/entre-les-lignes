#!/usr/bin/env node
/* Validation projet : syntaxe + BFS complet (choix/x/h/j multi-états) + mojibake.
   Utilisé par la CI (.github/workflows/ci.yml) — exit 1 si erreur. */
const fs=require('fs'),vm=require('vm');
let fail=0;
const step=(ok,msg)=>{console.log((ok?'  ✓ ':'  ✗ ')+msg);if(!ok)fail=1};

/* 1. syntaxe */
console.log('— Syntaxe');
['js/assets.js','js/story.js','js/engine.js','sw.js'].filter(f=>fs.existsSync(f)).forEach(f=>{
  step((()=>{try{new Function(fs.readFileSync(f,'utf8'));return true}catch(e){console.log('    '+e.message);return false}})(),f);
});

/* 2. BFS */
console.log('— Histoire');
const ctx=vm.createContext({console});
const {S,STORIES}=vm.runInContext(fs.readFileSync('js/story.js','utf8')+';({S:S,STORIES:STORIES})',ctx);
step(Object.keys(S).length>0,Object.keys(S).length+' nœuds, '+STORIES.length+' histoire(s)');
const states=[{},{piege:1},{piege:1,avou:1},{piege:1,mentir:1},{piege:1,trst:1},{trst:2},{mentir:1},
  {piege:1,int:1,pov:2,prm:2},{avou:1,mentir:1,trst:1,int:3,pov:2,prm:2},{int:3,pov:2,prm:2,t:5},{int:1,pov:2,prm:2},{r:1},{r:2},{r:3},{f:1},{f:2},{f:3}];
let broken=[],seen=new Set(),q=[];
STORIES.forEach(s=>(s.ch||[]).forEach(c=>{if(c[1]!=='-'&&S[c[1]])q.push(c[1])}));
const push=(t,f)=>{if(t&&t!=='-'){if(!(t in S))broken.push(f+'→'+t);else q.push(t)}};
while(q.length){const id=q.pop();if(seen.has(id))continue;seen.add(id);const n=S[id];
  (n.c||[]).forEach(ch=>ch&&push(ch[1],id));push(n.x,id);push(n.h,id);if(n.dec)push(n.dec,id);
  if(n.j)states.forEach(st=>{let t;try{t=n.j(st)}catch(e){}push(t,id+' (j)')});}
const orph=Object.keys(S).filter(k=>!seen.has(k));
step(broken.length===0,broken.length?broken.join(', '):'0 lien cassé');
step(orph.length===0,orph.length?'orphelins : '+orph.join(', '):'0 orphelin');

/* 3. mojibake */
console.log('— Encodage');
let mo=0;
['js/story.js','js/engine.js'].filter(f=>fs.existsSync(f)).forEach(f=>{
  const t=fs.readFileSync(f,'utf8');
  const n=(t.match(/[\uFFFD\u0080-\u009F]/g)||[]).length; mo+=n; if(n)console.log('    '+f+' : '+n);});
step(mo===0,mo===0?'0 mojibake':mo+' mojibake');

/* 4. refs cache-busting cohérentes */
console.log('— Versions');
const ver=(fs.readFileSync('js/engine.js','utf8').match(/VER="(\d+\.\d+)"/)||[])[1];
let refsOK=true;
['jeu.html'].filter(f=>fs.existsSync(f)).forEach(f=>{
  const t=fs.readFileSync(f,'utf8');
  const bad=(t.match(/\?v=(\d+\.\d+)/g)||[]).filter(v=>v!=='?v='+ver);
  if(bad.length){refsOK=false;console.log('    '+f+' : refs périmées '+bad.join(','));}});
step(refsOK,'refs ?v= cohérentes avec VER='+ver);

process.exit(fail);
