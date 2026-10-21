#!/usr/bin/env node
/* check-ts-mirror.js — Étape 1 migration TS+Vite (pur Node, zéro dépendance).
   Vérifie que ts/story.ts est le miroir EXACT de js/story.js :
   en retirant les annotations TS, le fichier doit redevenir js/story.js octet par octet.
   Lancé par scripts/validate.js (donc par la CI à chaque push).
   Règle : les DEUX fichiers doivent toujours rester en cohérence. */
const fs=require('fs');
let fail=0;
const step=(ok,msg)=>{console.log((ok?'  ✓ ':'  ✗ ')+msg);if(!ok)fail=1};
const ts=fs.readFileSync('ts/story.ts','utf8');
const js=fs.readFileSync('js/story.js','utf8');
const anchor='/* Données narratives';
const cut=ts.indexOf(anchor);
step(cut>0,'en-tête TS présent');
const REVERT=[
  ['const ETL_INV=(st:St):string=>','const ETL_INV=st=>'],
  ['const H=(x:string):Msg=>["h",x],N=(x:string):Msg=>["n",x],Sy=(x:string):Msg=>["s",x],P=(x:Src):Msg=>["p",x],PM=(x:Src):Msg=>["pm",x],A=(x:string|Src):Msg=>["a",x],K=():Msg=>["x",""];',
   'const H=x=>["h",x],N=x=>["n",x],Sy=x=>["s",x],P=x=>["p",x],PM=x=>["pm",x],A=x=>["a",x],K=()=>["x",""];'],
  ['} satisfies Story;\nconst C=(a:Array<[string,string]>)=>','};\nconst C=a=>'],
  ['const STORIES:StoryMeta[]=[','const STORIES=['],
  ['j:(st:St)=>','j:st=>'],
  ['endc:(st:St)=>','endc:st=>'],
  ['(_,i):[string,string]=>','(_,i)=>'],
];
let back=ts.slice(cut), pairsOK=true;
for(const [tsFrag,jsFrag] of REVERT){
  const n=back.split(tsFrag).length-1;
  if(jsFrag==='j:st=>'||jsFrag==='endc:st=>'){ if(n<1){pairsOK=false;console.log('    paire absente : '+tsFrag);} }
  else if(n!==1){pairsOK=false;console.log('    paire inattendue ('+n+'x) : '+tsFrag.slice(0,40));}
  back=back.split(tsFrag).join(jsFrag);
}
step(pairsOK,'annotations TS attendues toutes présentes');
step(back===js, back===js?'ts/story.ts ≡ js/story.js (miroir exact)'
  :'miroir désynchronisé ! ('+back.length+' vs '+js.length+' octets)');
process.exit(fail);
