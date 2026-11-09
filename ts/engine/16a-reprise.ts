/* ts/engine/16a-reprise.ts — IIFE sauvegarde/reprise + wrappers (module reprise) — module de js/engine.js (découpage v2.232). Source unique : ts/engine/, js généré. */
/* [engine-section] */
(function(){
 const KEY='etl_resume_v4';let restoring=false,GHOST=false,path=[],seenPro={};nodeNow=null;try{window.__ghost=()=>GHOST}catch(e){}

 function save(){statsTick();try{if(GHOST||!SS||!st||!SK)return;localStorage.setItem(KEY,JSON.stringify({story:SS.id,chapter:SC,node:nodeNow,state:st,chat:$('chat').innerHTML,at:Date.now(),path:path.slice(),apph:APPH,thr:THR,papp:PAPP,pnm:PNM,pre:preChat||undefined}))}catch(e){}}
 const oldPlay=play;
 let preChat=null;
 play=async function(id,r=run){nodeNow=id;if(!GHOST&&SK)path.push(id);preChat=$('chat').innerHTML;save();const v=await oldPlay(id,r);if(r!=run)return v;preChat=null;save();return v};
 function relBan(on){/* mode relecture supprimé dans cette version — aucun bandeau */}
 const oldFin=fin;fin=function(v,sk){oldFin(v,sk);save()};
 addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
 menu=function(){GHOST=false;try{relBan(false)}catch(e){}save();stopPro();run++;SK=0;nodeNow=null;try{veil(0)}catch(e){};ck();amb(null);$('ov').hidden=true;
  chap(STORIES.find(s=>s.id==='h')||STORIES[0]);
  setTimeout(()=>{if($('mn').classList.contains('on')){document.body.classList.remove('play');$('chat').innerHTML='';$('ch').innerHTML='';$('chat').style.backgroundImage=''}},700)};
 function optCard(){
  const c=card('Options d\u2019affichage');
  const em=document.createElement('button');em.className='st';
  em.innerHTML=emojiMode?'<b>Smileys : jeune & spontan\u00E9 \uD83D\uDE0A</b><small>Les conversations gardent leurs \u00E9motic\u00F4nes \u2014 plus vivantes, plus r\u00E9elles.</small>'
   :'<b>Mode sobre : sans smileys \uD83D\uDCAC</b><small>Lecture plus dramatique \u2014 les \u00E9motic\u00F4nes sont retir\u00E9es des messages.</small>';
  em.onclick=()=>{emojiMode=!emojiMode;try{localStorage.setItem('etl_emoji',emojiMode?'on':'off')}catch(e){};optCard()};
  c.append(em);
  show(c,menu)}
 let proEl=null;
 const stopPro=()=>{if(proEl){try{proEl.pause&&proEl.pause()}catch(e){}proEl=null}try{speechSynthesis.cancel()}catch(e){}};
 const proPlay=(s,txt)=>{if(proEl){stopPro();return}
  if(s.audio){try{proEl=new Audio(s.audio);proEl.onended=()=>{proEl=null};proEl.play().catch(()=>{proEl=null});return}catch(e){}}
  try{const u=new SpeechSynthesisUtterance(String(txt).replace(/\n+/g,'. '));u.lang='fr-FR';u.rate=.95;u.onend=()=>{proEl=null};
   speechSynthesis.cancel();speechSynthesis.speak(u);proEl='synth'}catch(e){}};
 const proOf=s=>s.prologue||null; const endsAll=s=>endsList(s);
 const endsOf=s=>endsAll(s).length;
 function endsCard(s){const all=endsAll(s);let got=[];try{got=JSON.parse(localStorage.getItem('fe'+s.id)||'[]').filter(t=>all.includes(t))}catch(e){}
  const c=card('Fins \u2014 '+s.t);
  const list=document.createElement('div');list.className='bkWrap';c.append(list);
  all.forEach(t=>{const ok=got.includes(t);const r=document.createElement('button');r.className='bk'+(ok?' open':' lock');r.disabled=!ok;
   r.innerHTML='<h3>'+(ok?'\u2713 '+t:'\uD83D\uDD12 fin non d\u00E9couverte')+'</h3>';list.append(r)});
  show(c,()=>chap(s))}
 const feN=s=>{try{return(JSON.parse(localStorage.getItem('fe'+s.id)||'[]').filter(t=>endsAll(s).includes(t))).length}catch(e){return 0}};
 try{window.etlMisc={stopPro:stopPro,endsOf:endsOf,feN:feN,endsCard:endsCard,resume:resume,ch2go:ch2go,pg:()=>PG}}catch(e){}
 const oldStart=start;start=function(){bootIn(function(){try{phoneIn()}catch(e){}});path=[];if(!SC){try{localStorage.removeItem('etl_name_'+SS.id)}catch(e){}}oldStart()};
