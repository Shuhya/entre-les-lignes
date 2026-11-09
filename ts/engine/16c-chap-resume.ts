/* ts/engine/16c-chap-resume.ts — chap(), resume(), fin de l'IIFE (module chapitres/reprise) — module de js/engine.js (découpage v2.232). Source unique : ts/engine/, js généré. */
/* [engine-section] */
 function summaryPage(s){
  let P={c:0,s:[]};try{P=JSON.parse(localStorage.getItem('pg'+s.id))||P}catch(e){}
  const c=card('R\u00e9sum\u00e9 \u2014 '+s.t);
  const w=document.createElement('div');w.className='proTxt';
  const addP=function(t){const p=document.createElement('p');p.textContent=t;w.append(p)};
  addP('Tout ce que tu as fait dans \u00ab '+s.t+' \u00bb.');
  let any=false;
  s.ch.forEach(function(h,i){const done=i<(P.c||0)||!!(P.s&&P.s[i]);if(!done)return;any=true;
   addP('Chapitre '+(i+1)+' \u00b7 '+h[0]+' \u2014 '+(typeof ETL_SUM!=='undefined'&&ETL_SUM&&ETL_SUM[i]?ETL_SUM[i]:'(r\u00e9sum\u00e9 indisponible)'))});
  if(!any)addP('Aucune partie jou\u00e9e pour l\u2019instant.');
  try{const got=JSON.parse(localStorage.getItem('fe'+s.id)||'[]');if(got.length)addP('Fins vues ('+got.length+') : '+got.join(' \u00b7 '))}catch(e){}
  c.append(w);
  show(c,()=>chap(s))}
 chap=function(s){GHOST=false;try{relBan(false)}catch(e){}SS=s;
  let v=null;try{v=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  let pgc=0;try{pgc=(JSON.parse(localStorage.getItem("pg"+s.id)||"{}").c)||0}catch(e){}
  const resuming=!!(v&&v.story===s.id&&v.node&&S[v.node]&&pgc<=(v.chapter||0)+1);
  const goChaps=()=>{
   nodeNow=null;
   let P={c:0,s:[]};try{P=JSON.parse(localStorage.getItem('pg'+s.id))||P}catch(e){}
   PG=P;
   const c=card(s.t);
   const rel=document.createElement('label');rel.className='relChk';
   const cb=document.createElement('input');cb.type='checkbox';cb.id='relChk';
   const rt=document.createElement('span');rt.innerHTML='<b>Relecture</b><small>Voir le r\u00e9sum\u00e9 textuel de tout ce que tu as fait \u2014 n\u2019ouvre pas le jeu.</small>';
   rel.append(cb,rt);c.append(rel);
   const cl=document.createElement('p');cl.className='proTxt';cl.textContent='Quel chapitre veux-tu ouvrir ?';c.append(cl);
   const sel=document.createElement('select');sel.className='finSel';sel.id='chapSel';sel.setAttribute('aria-label','Choisir un chapitre');
   let firstOk=0;
   s.ch.forEach((h,i)=>{const ch2free=(s.id==='h'&&i===1&&h[1]==='q1'&&(P.c||0)<2);const w=!!S[h[1]],ok=w&&(i===0||i<P.c||ch2free);
    if(ok&&!firstOk)firstOk=i;
    const o=document.createElement('option');o.value=i;o.textContent='Chapitre '+(i+1)+' \u00B7 '+h[0]+(ok?'':' \u00B7 \uD83D\uDD12');o.disabled=!ok;sel.append(o)});
   sel.value=firstOk;c.append(sel);
   row(c,'\u25b6 Commencer','Ouvrir le chapitre choisi.',()=>{const i=+sel.value;const h=s.ch[i];if(!h)return;
    if(cb.checked){summaryPage(s);return}
    const ch2free=(s.id==='h'&&i===1&&h[1]==='q1'&&(P.c||0)<2);
    if(ch2free){ch2pick(s);return}
    actsMenu(s,i,h,sel,v)});
   {const tot=endsOf(s),got=feN(s);const fb=document.createElement('button');fb.className='finsTag';fb.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/></svg> '+Math.min(got,tot)+' / '+tot;fb.onclick=()=>endsCard(s);c.append(fb)}
   const rsb=document.createElement('button');rsb.className='st restartBtn';rsb.innerHTML='<b><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg> Recommencer l\u2019histoire</b><small>Efface la progression de cette histoire</small>';
   rsb.onclick=()=>{if(!rsb.dataset.armed){rsb.dataset.armed='1';rsb.querySelector('b').textContent='Confirmer l\u2019effacement\u00A0?';rsb.querySelector('small').textContent='Progression, sauvegarde et fins de cette histoire seront perdues — reclique pour confirmer';return}
    try{localStorage.removeItem(KEY);localStorage.removeItem('pg'+s.id);localStorage.removeItem('fe'+s.id);localStorage.removeItem('etl_name_'+s.id);localStorage.removeItem('etl_part_'+s.id)}catch(e){}
    GHOST=false;delete seenPro[s.id];chap(s)};
   c.append(rsb);
   show(c,homeIntro)};
  const goList=()=>{stopPro();
   if(!resuming)return goChaps();
   const o=document.createElement('div');o.className='rsOv';
   const c=card(s.t);
   const lk=(t,d,fn,cls)=>{const b=document.createElement('button');b.className='bk'+(cls?' '+cls:'');b.innerHTML='<h3>'+t+'</h3><p>'+d+'</p>';b.onclick=fn;c.append(b);return b};
   lk('Reprendre la conversation','Chapitre '+Math.min((v.chapter||0)+1,((s.ch&&s.ch.length)||1))+' / '+((s.ch&&s.ch.length)||1)+' · '+(()=>{try{const f=JSON.parse(localStorage.getItem('fe'+s.id)||'[]');return f.length+' fin'+(f.length>1?'s':'')+' vue'+(f.length>1?'s':'')}catch(e){return ''}})()+' · arrêt le '+new Date(v.at).toLocaleString('fr-FR'),()=>{o.remove();resume(v)},'open');
   const rb=lk('Recommencer cette histoire','Efface ta progression de cette histoire',()=>{
    if(!rb.dataset.armed){rb.dataset.armed='1';rb.querySelector('h3').textContent='Confirmer l\u2019effacement';rb.querySelector('p').textContent='Ton avancement sera perdu \u2014 reclique pour confirmer';return}
    o.remove();
    try{if(v.story===s.id)localStorage.removeItem(KEY);localStorage.removeItem('pg'+s.id);localStorage.removeItem('fe'+s.id);localStorage.removeItem('etl_name_'+s.id)}catch(e){}
    GHOST=false;delete seenPro[s.id];chap(s)});
   o.append(c);document.body.append(o);addBack(c,()=>o.remove());
   o.addEventListener('click',e=>{if(e.target===o)o.remove()})};
  const pro=proOf(s);
  if(resuming)goList();
  else if(pro&&!seenPro[s.id]){
   seenPro[s.id]=1;
   const c=card(s.t);
   const w=document.createElement('div');w.className='proTxt';
   String(pro).split('\n\n').forEach(pp=>{const pe=document.createElement('p');pe.textContent=pp;w.append(pe)});
   c.append(w);
   row(c,'\u25B6 '+(s.audio?'\u00C9couter la narration':'\u00C9couter (voix automatique)'),s.audio?'La narration enregistr\u00E9e de l\u2019histoire':'Aucun fichier joint : synth\u00E8se vocale du navigateur',()=>proPlay(s,pro));
   row(c,'\u25B6 '+(resuming?'Reprendre':'Commencer'),resuming?'Ta partie t\u2019attend juste apr\u00E8s.':'D\u00E9couvre l\u2019histoire',goList);
   show(c,menu)}
  else goList()};
 function resume(v){const story=STORIES.find(x=>x.id===v.story);if(!story)return;SS=story;SC=Math.min(v.chapter||0,story.ch.length-1);try{PG=JSON.parse(localStorage.getItem('pg'+SS.id))||{c:1,s:[]}}catch(e){PG={c:1,s:[]}}st=v.state||{t:0,l:0,r:0,v:0,e:''};run++;SK=1;document.body.classList.add('play');$('mn').classList.remove('on');const nmd=!!((v.state&&v.state.named)||SC>0||localStorage.getItem('etl_name_'+SS.id)===SS.n);$('nm').textContent=nmd?SS.n:SS.num;setAv(nmd?SS.n[0]:"\u{1F464}");$('chat').innerHTML=v.chat||'';$('ch').innerHTML='';$('ov').hidden=true;$('vol').hidden=true;unlock();nodeNow=v.node;path=v.path?v.path.slice():[v.node];APPH=v.apph||{};THR=v.thr||{};PAPP=v.papp||null;PNM=v.pnm||'';
  const n=S[v.node],cpl=(v.state&&v.state["cpl_"+v.node]);
  if(n&&n.c&&cpl)n.c.forEach(([label,next,effect,rmsg])=>{const b=document.createElement('button');b.textContent=unq(label);b.onclick=()=>{ $('ch').innerHTML='';$('fl').textContent='Envoyer un message';if(rmsg==='!')add('n',emojiClean(unq(label)));else{tx();add('m',emojiClean(rmsg?unq(rmsg):unq(label)))}for(const k in effect)st[k]=['t','care','agency','practical'].includes(k)?(st[k]||0)+effect[k]:effect[k];save();play(next)};$('ch').append(b)});
 else{if(path[path.length-1]===v.node)path.pop();if(!cpl&&v.pre)$('chat').innerHTML=v.pre;setTimeout(()=>play(v.node),120)}
 save()
 }
})();


/* Migration narrative : invalider les états de reprise créés par les versions incohérentes. */
try{
 const ver=localStorage.getItem('etl_story_schema');
 if(ver!=='2026-10-coherence-2'){
   localStorage.removeItem('etl_resume_v4');
   localStorage.setItem('etl_story_schema','2026-10-coherence-2');
 }
}catch(e){}







