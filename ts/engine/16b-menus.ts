/* ts/engine/16b-menus.ts — ch2pick, actes, ch2go (module menus ch2) — module de js/engine.js (découpage v2.232). Source unique : ts/engine/, js généré. */
/* [engine-section] */
function ch2pick(s){const done=((PG.c||0)>=2);
 const prev=(PG.s&&PG.s[1])||{};
 const base=Object.assign({t:0,l:0,r:0,v:0,e:""},(prev.pf!==undefined?{pf:prev.pf}:{}),(prev.pname!==undefined?{pname:prev.pname}:{}),(prev.t?{t:prev.t}:{}));
 const c=card(done?"Chapitre 2 \u00b7 Quai 9 \u2014 avec quelle fin du chapitre 1\u00a0?":"Chapitre 2 \u00b7 Quai 9 \u2014 sans jouer le chapitre 1");
 const hd=document.createElement("p");hd.className="proTxt";hd.textContent=done?"Avec quelle fin du chapitre 1 veux-tu commencer\u00a0?":"Tu n\u2019as pas jou\u00e9 le chapitre 1\u00a0: choisis une fin pour commencer.";c.append(hd);
 if(!done){let gpf=0;try{gpf=(localStorage.getItem("etl_pgen")==="f")?1:0}catch(e){}base.pf=gpf;
  const nb=document.createElement("p");nb.className="proTxt";nb.textContent="Ton pr\u00e9nom\u00a0? L\u2019histoire s\u2019adressera \u00e0 toi par ce nom (laisse vide pour rester anonyme).";c.append(nb);
  const ni=/** @type {HTMLInputElement} */(document.createElement("input"));ni.id="ch2name";ni.type="text";ni.maxLength=14;ni.placeholder="Ton pr\u00e9nom";ni.autocomplete="off";try{ni["value"]=localStorage.getItem("etl_pname")||""}catch(e){}c.append(ni);
  const gb=document.createElement("p");gb.className="proTxt";gb.textContent="Et ton genre\u00a0? L\u2019histoire s\u2019accorde au masculin ou au f\u00e9minin.";c.append(gb);
  const gs=document.createElement("select");gs.className="finSel";gs.setAttribute("aria-label","Choisir le genre");
  [["\u2640 Une femme","L\u2019histoire s\u2019accorde au f\u00e9minin.","1"],["\u2642 Un homme","L\u2019histoire s\u2019accorde au masculin.","0"]].forEach(function(o){const op=document.createElement("option");op.value=o[2];op.textContent=o[0]+" \u2014 "+o[1];gs.append(op)});
  gs.value=gpf?"1":"0";gs.onchange=function(){gpf=+gs.value;base.pf=gpf};c.append(gs)}
 let actK=0;
 {const acts=(s.ch[1][2]&&s.ch[1][2].length)?s.ch[1][2]:[[s.ch[1][0],s.ch[1][1]]];
  const lab=document.createElement("p");lab.className="proTxt";lab.textContent="Par quel acte veux-tu commencer\u00a0?";c.append(lab);
  const as=document.createElement("select");as.className="finSel";as.setAttribute("aria-label","Choisir un acte");
  acts.forEach(function(a,k){const op=document.createElement("option");op.value=k;op.textContent="Acte "+(k+1)+" \u00b7 "+a[0];as.append(op)});
  as.value=String(actK);as.onchange=function(){actK=+as.value};c.append(as)}
 const FINS=[
  ["\u00ab Le rendez-vous manqu\u00e9 \u00bb","Tu as confirm\u00e9 la prise du quai 9. Quelqu\u2019un a attendu Nils.",{piege:1,mig:1}],
  ["\u00ab La bonne nuit \u00bb","Cora veille sur toi : confiance totale.",{avou:1,trst:2,mig:1}],
  ["\u00ab Le mensonge \u00bb","Elle t\u2019a rep\u00e9r\u00e9 en quatre minutes.",{mentir:1,mig:1}],
  ["\u00ab La nuit sans sommeil \u00bb","La route standard : personne n\u2019a \u00e9crit cette nuit.",{mig:1}],
  ["\u00ab La nuit sans sommeil \u00bb + police","Tu as annonc\u00e9 \u00e0 Cora que tu irais voir le commandant Riffaud.",{mig:1,pol:1}],
  ["\u00ab Le rendez-vous manqu\u00e9 \u00bb + police","Pi\u00e8ge du quai 9, et l\u2019annonce d\u2019un passage \u00e0 la police.",{mig:1,piege:1,pol:1}],
  ["\u00ab La nuit sans sommeil \u00bb + silence","Tu n\u2019as rien r\u00e9pondu \u00e0 l\u2019inconnu.",{mig:1,int:3,sil:1}],
  ["\u00ab Vous vous trompez de num\u00e9ro \u00bb","Tu as r\u00e9pondu \u00e0 l\u2019inconnu : erreur de num\u00e9ro, rien de plus.",{mig:1,int:2}]
 ];
 const fl=document.createElement("p");fl.className="proTxt";fl.textContent=done?"Choisis la fin du chapitre 1 avec laquelle lancer le chapitre 2 :":"Choisis une fin pour commencer :";c.append(fl);
 const sel=document.createElement("select");sel.className="finSel";sel.setAttribute("aria-label","Choisir une fin du chapitre 1");
 FINS.forEach(function(f,k){const o=document.createElement("option");o.value=String(k);o.textContent=f[0]+" \u2014 "+f[1];sel.append(o)});
 c.append(sel);
 row(c,"\u25b6 Commencer le chapitre 2","Lancer avec la fin choisie dans le menu d\u00e9roulant.",function(){const f=FINS[+sel.value||0];ch2go(s,base,f[2],actK)});
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
  rb.innerHTML='<b><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg> R\u00E9sum\u00E9 du chapitre '+(i+1)+'</b>';
  rb.onclick=()=>{ov(s.t,ETL_SUM[i],'\u2039 Retour',()=>{},null,null)};w.append(rb)}
 if(typeof b.after==="function")b.after(w);else{const pn=b.parentNode;if(pn)pn.append(w)}}
function startAct(s,i,k){const acts=(s.ch[i][2]&&s.ch[i][2].length)?s.ch[i][2]:[[s.ch[i][0],s.ch[i][1]]];SC=i;$('nm').textContent=s.n;setAv(s.n[0]);ETL_ACT=acts[k][1];start()}
function act3pick(s,i,k){
 const c=card('Quai 9 \u00b7 Acte III \u2014 par quel chemin\u00a0?');
 const hd=document.createElement('p');hd.className='proTxt';hd.textContent='Par quel \u00e9tat veux-tu arriver au square des Tanneurs\u00a0? Choisis dans le menu d\u00e9roulant :';c.append(hd);
 const FINS=[
  ["\u00ab Confiance totale \u00bb","Cora t\u2019a appel\u00e9. Carnet lu, dernier message \u00e9cout\u00e9, mot \u00ab sucrier \u00bb donn\u00e9 au t\u00e9l\u00e9phone.",{avou:1,trst:2,pov:1,prm:1,cal_h8:1,recall:1,mig:1}],
  ["\u00ab Le froid \u00bb","Pas d\u2019appel. Tu as r\u00e9pondu \u00ab erreur de num\u00e9ro \u00bb \u00e0 l\u2019inconnu.",{mig:1,int:2}],
  ["\u00ab Le menteur \u00bb","La nuit du mensonge : rep\u00e9r\u00e9 en quatre minutes.",{mentir:1,mig:1,int:2}],
  ["\u00ab Le pi\u00e8ge + la police \u00bb","La prise du quai 9 confirm\u00e9e, et Riffaud pr\u00e9venu.",{piege:1,pol:1,mig:1}],
  ["\u00ab La nuit standard \u00bb","La route droite : personne n\u2019a \u00e9crit cette nuit.",{mig:1}]
 ];
 const sel=document.createElement("select");sel.className="finSel";sel.setAttribute("aria-label","Choisir un chemin pour l\u2019Acte III");
 FINS.forEach(function(f,k2){const o=document.createElement("option");o.value=String(k2);o.textContent=f[0]+" \u2014 "+f[1];sel.append(o)});
 c.append(sel);
 row(c,"\u25b6 Commencer l\u2019Acte III","Lancer avec le chemin choisi dans le menu d\u00e9roulant.",function(){const f=FINS[+sel.value||0];act3go(s,i,k,f[2])});
 show(c,()=>chap(s))}
function act3go(s,i,k,fl){SC=i;ETL_ST=fl;ETL_ACT=(s.ch[i][2]&&s.ch[i][2][k])?s.ch[i][2][k][1]:s.ch[i][1];$('nm').textContent=s.n;setAv(s.n[0]);start()}
function ch2go(s,base,fl,k){SC=1;if(k!=null){const acts=(s.ch[1][2]&&s.ch[1][2].length)?s.ch[1][2]:[[s.ch[1][0],s.ch[1][1]]];if(acts[k])ETL_ACT=acts[k][1]}try{const ni=/** @type {HTMLInputElement} */($("ch2name"));if(ni&&typeof ni["value"]==="string"){const v=(ni["value"]||"").trim().slice(0,14);if(v)base.pname=v}}catch(e){}PG.s[1]=Object.assign({},base,fl);$("nm").textContent=s.n;setAv(s.n[0]);start()}