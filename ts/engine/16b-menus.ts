/* ts/engine/16b-menus.ts — ch2pick, actes, ch2go (module menus ch2) — module de js/engine.js (découpage v2.232). Source unique : ts/engine/, js généré. */
/* [engine-section] */
function ch2pick(s){const done=((PG.c||0)>=2);
 const prev=(PG.s&&PG.s[1])||{};
 const base=Object.assign({t:0,l:0,r:0,v:0,e:""},(prev.pf!==undefined?{pf:prev.pf}:{}),(prev.pname!==undefined?{pname:prev.pname}:{}),(prev.t?{t:prev.t}:{}));
 const c=card(done?"Chapitre 2 · Quai 9 — avec quelle fin du chapitre 1\u00A0?":"Chapitre 2 · Quai 9 — sans jouer le chapitre 1");
 const hd=document.createElement("p");hd.className="proTxt";hd.textContent=done?"Avec quelle fin du chapitre 1 veux-tu commencer\u00a0?":"Tu n\u2019as pas jou\u00e9 le chapitre 1\u00a0: choisis une fin pour commencer.";c.append(hd);
 if(!done){let gpf=0;try{gpf=(localStorage.getItem("etl_pgen")==="f")?1:0}catch(e){}base.pf=gpf;
  const nb=document.createElement("p");nb.className="proTxt";nb.textContent="Ton prénom ? L’histoire s’adressera à toi par ce nom (laisse vide pour rester anonyme).";c.append(nb);
  const ni=/** @type {HTMLInputElement} */(document.createElement("input"));ni.id="ch2name";ni.type="text";ni.maxLength=14;ni.placeholder="Ton prénom";ni.autocomplete="off";try{ni["value"]=localStorage.getItem("etl_pname")||""}catch(e){}c.append(ni);
  const gb=document.createElement("p");gb.className="proTxt";gb.textContent="Et ton genre ? L’histoire s’accorde au masculin ou au féminin.";c.append(gb);
  const bf=row(c,"","L’histoire s’accorde au féminin.",()=>{}),bm=row(c,"","L’histoire s’accorde au masculin.",()=>{});
  const rf=()=>{base.pf=gpf?1:0;bf.children[0].textContent=(gpf?"✓ ":"")+"♀ Une femme";bm.children[0].textContent=(!gpf?"✓ ":"")+"♂ Un homme"};
  bf.onclick=()=>{gpf=1;rf()};bm.onclick=()=>{gpf=0;rf()};rf()}
 let actK=0;
 {const acts=(s.ch[1][2]&&s.ch[1][2].length)?s.ch[1][2]:[[s.ch[1][0],s.ch[1][1]]];
  const lab=document.createElement("p");lab.className="proTxt";lab.textContent="Par quel acte veux-tu commencer ?";c.append(lab);
  const aw=document.createElement("div");aw.className="actPick";
  acts.forEach((a,k)=>{const b=document.createElement("button");b.type="button";b.textContent="Acte "+(k+1)+" · "+a[0];
   b.onclick=()=>{actK=k;Array.prototype.forEach.call(aw.children,function(x){x.classList.remove("on")});b.classList.add("on")};
   if(k===actK)b.classList.add("on");aw.append(b)});
  c.append(aw)}
  row(c,"« Le rendez-vous manqué »","Tu as confirmé la prise du quai 9. Quelqu’un a attendu Nils.",()=>ch2go(s,base,{piege:1,mig:1},actK));
 row(c,"« La bonne nuit »","Cora veille sur toi : confiance totale.",()=>ch2go(s,base,{avou:1,trst:2,mig:1},actK));
 row(c,"« Le mensonge »","Elle t’a repéré en quatre minutes.",()=>ch2go(s,base,{mentir:1,mig:1},actK));
 row(c,"« La nuit sans sommeil »","La route standard : personne n’a écrit cette nuit.",()=>ch2go(s,base,{mig:1},actK));
 row(c,"« La nuit sans sommeil » + police","Tu as annoncé à Cora que tu irais voir le commandant Riffaud.",()=>ch2go(s,base,{mig:1,pol:1},actK));
 row(c,"« Le rendez-vous manqué » + police","Piège du quai 9, et l’annonce d’un passage à la police.",()=>ch2go(s,base,{mig:1,piege:1,pol:1},actK));
 row(c,"« La nuit sans sommeil » + silence","Tu n’as rien répondu à l’inconnu.",()=>ch2go(s,base,{mig:1,int:3,sil:1},actK));
 row(c,"« Vous vous trompez de numéro »","Tu as répondu à l’inconnu : erreur de numéro, rien de plus.",()=>ch2go(s,base,{mig:1,int:2},actK));
 show(c,()=>chap(s))}
function actOfNode(i,node){if(i!==1)return 0;const m=String(node).match(/^q(\d+)/);if(m){const n=+m[1];if(n<=3)return 0;if(n<=8)return 1;return 2}return 1}
function actsMenu(s,i,h,b,v){
 const old=document.querySelectorAll('.actsWrap')[0]||null;
 if(old){const same=(old.getAttribute('data-k')===s.id+i);old.remove();if(same)return}
 const acts=(h[2]&&h[2].length)?h[2]:[[h[0],h[1]]];
 const w=document.createElement('div');w.className='actsWrap';w.setAttribute('data-k',s.id+i);
 acts.forEach((a,k)=>{
  const live=!!(v&&v.story===s.id&&v.node&&S[v.node]&&(v.chapter||0)===i&&actOfNode(i,v.node)===k);
  const r=document.createElement('button');r.className='st actBtn';
  r.innerHTML='<b>'+(live?'\u25B6 Reprendre\u00A0: ':'\u25B6 ')+'Acte '+(k+1)+' \u00B7 '+a[0]+'</b>';
  r.onclick=()=>{w.remove();
   if(s.id==='h'&&i===1&&k===2&&a[1]==='q9')return act3pick(s,i,k);
   if(live)return resume(v);
   startAct(s,i,k)};
  w.append(r)});
 if(typeof ETL_SUM!=='undefined'&&ETL_SUM&&ETL_SUM[i]){const rb=document.createElement('button');rb.className='st actBtn';
  rb.innerHTML='<b>\u270E R\u00E9sum\u00E9 du chapitre '+(i+1)+'</b>';
  rb.onclick=()=>{ov(s.t,ETL_SUM[i],'\u2039 Retour',()=>{},null,null)};w.append(rb)}
 if(typeof b.after==="function")b.after(w);else{const pn=b.parentNode;if(pn)pn.append(w)}}
function startAct(s,i,k){const acts=(s.ch[i][2]&&s.ch[i][2].length)?s.ch[i][2]:[[s.ch[i][0],s.ch[i][1]]];GHOST=true;SC=i;$('nm').textContent=s.n;setAv(s.n[0]);ETL_ACT=acts[k][1];start()}
function act3pick(s,i,k){
 const c=card('Quai 9 \u00B7 Acte III \u2014 par quel chemin\u00A0?');
 const hd=document.createElement('p');hd.className='proTxt';hd.textContent='Par quel \u00E9tat veux-tu arriver au square des Tanneurs\u00a0?';c.append(hd);
 row(c,'\u25B6 \u00AB Confiance totale \u00BB','Cora t\u2019a appel\u00E9. Carnet lu, dernier message \u00E9cout\u00E9, mot \u00AB sucrier \u00BB donn\u00E9 au t\u00E9l\u00E9phone.',()=>act3go(s,i,k,{avou:1,trst:2,pov:1,prm:1,cal_h8:1,recall:1,mig:1}));
 row(c,'\u25B6 \u00AB Le froid \u00BB','Pas d\u2019appel. Tu as r\u00E9pondu \u00AB erreur de num\u00E9ro \u00BB \u00E0 l\u2019inconnu.',()=>act3go(s,i,k,{mig:1,int:2}));
 row(c,'\u25B6 \u00AB Le menteur \u00BB','La nuit du mensonge\u00A0: rep\u00E9r\u00E9 en quatre minutes.',()=>act3go(s,i,k,{mentir:1,mig:1,int:2}));
 row(c,'\u25B6 \u00AB Le pi\u00E8ge + la police \u00BB','La prise du quai 9 confirm\u00E9e, et Riffaud pr\u00E9venu.',()=>act3go(s,i,k,{piege:1,pol:1,mig:1}));
 row(c,'\u25B6 \u00AB La nuit standard \u00BB','La route droite\u00A0: personne n\u2019a \u00E9crit cette nuit.',()=>act3go(s,i,k,{mig:1}));
 show(c,()=>chap(s))}
function act3go(s,i,k,fl){GHOST=true;SC=i;ETL_ST=fl;ETL_ACT=(s.ch[i][2]&&s.ch[i][2][k])?s.ch[i][2][k][1]:s.ch[i][1];$('nm').textContent=s.n;setAv(s.n[0]);start()}
function ch2go(s,base,fl,k){GHOST=true;SC=1;if(k!=null){const acts=(s.ch[1][2]&&s.ch[1][2].length)?s.ch[1][2]:[[s.ch[1][0],s.ch[1][1]]];if(acts[k])ETL_ACT=acts[k][1]}try{const ni=/** @type {HTMLInputElement} */($("ch2name"));if(ni&&typeof ni["value"]==="string"){const v=(ni["value"]||"").trim().slice(0,14);if(v)base.pname=v}}catch(e){}PG.s[1]=Object.assign({},base,fl);$("nm").textContent=s.n;setAv(s.n[0]);start()}