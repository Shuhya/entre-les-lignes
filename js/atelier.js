/* ============================================================
   ATELIER — studio d'édition narratif (page atelier.html UNIQUEMENT)
   Panneau admin complet : édition nœuds/histoires/médias + validation
   + publication directe sur GitHub (js/story.js, version bump).
   ============================================================ */
(function(){
"use strict";
if(typeof ETL_ATELIER==="undefined")return; /* sécurité : jamais sur le site public */

/* ---------- utilitaires ---------- */
const $id=i=>document.getElementById(i);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const b64u=s=>{const u=new TextEncoder().encode(s);let r="";for(let i=0;i<u.length;i+=0x8000)r+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(r)};
const ub64=b=>{const bin=atob(b.replace(/\n/g,"")),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new TextDecoder().decode(u)};
const clone=o=>JSON.parse(JSON.stringify(o));

/* ---------- base64 ASCII (contenus github renvoyés en base64) ---------- */

/* ---------- état ---------- */
let W=null;            /* élément racine du studio */
let TAB="dash";
let CUR=null;          /* nœud en cours d'édition */
let snapS=null,snapT=null,snapI=null;   /* état d'origine (propre) */
let lastCheck=null;    /* dernier rapport de validation */
const REPO="Shuhya/entre-les-lignes";

function snapshot(){try{return JSON.stringify({S:S,STORIES:STORIES,IMG:IMG})}catch(e){return ""}}
function countStory(st){try{const seen=new Set(),q=[];(st.ch||[]).forEach(c=>{if(c[1] in S)q.push(c[1])});
 while(q.length){const id=q.pop();if(seen.has(id))continue;seen.add(id);const n=S[id]||{};
  (n.c||[]).forEach(ch=>{if(ch&&ch[1] in S)q.push(ch[1])});if(n.x&&n.x in S)q.push(n.x);if(n.h&&n.h in S)q.push(n.h)}
 return seen.size}catch(e){return 0}}
function dirtyKeys(){
  const d=[];const oS=JSON.parse(snapS).S,nS=S;
  const all=new Set([...Object.keys(oS),...Object.keys(nS)]);
  all.forEach(k=>{if(JSON.stringify(oS[k])!==JSON.stringify(nS[k]))d.push(k)});
  return d;
}
function isDirty(){return snapS!==null&&snapshot()!==snapS}

/* ---------- brouillon local (protection anti-rechargement) ---------- */
const DRAFT="etl_draft_v1";
let draftTimer=null;
function draftSave(){clearTimeout(draftTimer);draftTimer=setTimeout(()=>{try{localStorage.setItem(DRAFT,snapshot())}catch(e){}},900)}
function draftLoad(){try{return localStorage.getItem(DRAFT)}catch(e){return null}}
function draftClear(){try{localStorage.removeItem(DRAFT)}catch(e){}}

/* ---------- génération des fichiers publishables ---------- */
function ser(v,ind){
  if(v===null)return "null";
  const t=typeof v;
  if(t==="string")return JSON.stringify(v);
  if(t==="number"||t==="boolean")return String(v);
  if(t==="function")return v.toString();           /* préserve j:st=>... */
  if(Array.isArray(v))return "["+v.map(x=>ser(x)).join(",")+"]";
  if(t==="object")return "{"+Object.entries(v).map(([k,x])=>{
    const kk=/^[A-Za-z_$][\w$]*$/.test(k)?k:JSON.stringify(k);
    return kk+":"+ser(x)}).join(",")+"}";
  throw Error("type non sérialisable : "+t);
}
function genStory(){
  return '/* Données narratives : helpers + nœuds (S) + sommaire (STORIES) */\n'
  +'const H=x=>["h",x],N=x=>["n",x],Sy=x=>["s",x],M=x=>["m",x],K=()=>["x",""];\n'
  +'const S='+ser(S)+';\n'
  +'const C=a=>a.concat(Array.from({length:10-a.length},(_,i)=>["Chapitre "+(a.length+i+1),"-"]));\n'
  +'const STORIES='+ser(STORIES)+';';
}
function genAssets(){
  return '/* Décors et avatars — l\'histoire référence ces clés (w:"..." / n.w) */\n'
  +'const IMG='+JSON.stringify(IMG)+';\n'
  +'const AVF1="assets/img/av-c.jpg",AVF2="assets/img/av-j.jpg",AVM1="assets/img/av-n.jpg",AVF3="assets/img/av-cora.jpg",AVF4="assets/img/av-yasmine.jpg";\n\n'
  +'/* Voix des appels — ajouter les fichiers dans assets/audio/ et référencer ici */\n'
  +'const VOICES='+JSON.stringify(typeof VOICES!=="undefined"?VOICES:{})+';';
}

/* ---------- validation ---------- */
function walkStrings(n,fn){if(typeof n==="string")fn(n);else if(Array.isArray(n))n.forEach(x=>walkStrings(x,fn));else if(n&&typeof n==="object")Object.values(n).forEach(x=>walkStrings(x,fn))}
function validate(){
  const errs=[],warns=[];
  const ids=Object.keys(S);
  /* cibles de choix / x / h */
  ids.forEach(id=>{const n=S[id]||{};
    (n.c||[]).forEach((ch,i)=>{const t=ch&&ch[1];if(t!=="-"&&!(t in S))errs.push(id+" : choix "+(i+1)+" → nœud introuvable « "+t+" »")});
    if(n.x&&!(n.x in S))errs.push(id+" : suite x → nœud introuvable « "+n.x+" »");
    if(n.h&&!(n.h in S))errs.push(id+" : raccroché h → nœud introuvable « "+n.h+" »");
  });
  /* chapitres */
  STORIES.forEach(st=>{(st.ch||[]).forEach((c,i)=>{if(c[1]!=="-"&&!(c[1] in S))errs.push("Histoire « "+st.t+" » chapitre "+(i+1)+" → nœud introuvable « "+c[1]+" »")});
    if(!st.t)warns.push("Histoire « "+(st.n||st.id)+" » sans titre");});
  /* mojibake */
  walkStrings({S,STORIES},s=>{for(const c of s){const p=c.codePointAt(0);if(p===0xFFFD||(p>=0x80&&p<=0x9F)){errs.push("Mojibake détecté dans : "+s.slice(0,60)+"…");return}}});
  /* compilation des fichiers générés */
  try{new Function(genStory())}catch(e){errs.push("story.js généré ne compile pas : "+e.message)}
  try{new Function(genAssets())}catch(e){errs.push("assets.js généré ne compile pas : "+e.message)}
  /* orphelins : non atteignables depuis les chapitres */
  try{
    const seen=new Set();const q=[];
    STORIES.forEach(st=>(st.ch||[]).forEach(c=>{if(c[1] in S)q.push(c[1])}));
    while(q.length){const id=q.pop();if(seen.has(id))continue;seen.add(id);const n=S[id]||{};
      (n.c||[]).forEach(ch=>{if(ch&&ch[1] in S)q.push(ch[1])});
      if(n.x&&n.x in S)q.push(n.x);if(n.h&&n.h in S)q.push(n.h);}
    ids.filter(k=>!seen.has(k)).forEach(k=>warns.push("Nœud orphelin (non atteignable) : "+k));
  }catch(e){}
  return {errs,warns,ok:errs.length===0};
}

/* ---------- ouverture / fermeture ---------- */
function exitPrev(){["etlPrevOff","etlPrevRst"].forEach(i=>{const b=document.getElementById(i);if(b)b.remove()});document.body.classList.remove("etlPrev");document.body.classList.remove("play");try{const c=document.getElementById("chat");if(c)c.innerHTML="";const h=document.getElementById("ch");if(h)h.innerHTML=""}catch(e){}}
function close(){if(W){W.remove();W=null}exitPrev()}
function open(){
  if(W){W.remove()}
  W=document.createElement("div");W.id="etlStudio";
  W.innerHTML=style()+shell();
  document.body.append(W);
  bind();
  render();
}
function toggle(){W?close():open()}

/* remplace l'ancien mini-panneau adm() : 7 taps sur l'horloge ouvrent le studio */
try{adm=on=>{if(on===false)close();else toggle()}}catch(e){}

/* bouton flottant permanent (sous le voile 403, z<9999) — styles injectés dès le chargement pour qu'il soit visible AVANT la première ouverture du studio */
const FABCSS=document.createElement("style");
FABCSS.textContent='#etlFab{position:fixed;right:14px;bottom:14px;z-index:9998;width:46px;height:46px;border-radius:50%;border:1px solid #ffd16659;background:#0a1424ee;color:#ffd166d9;font-size:19px;cursor:pointer;box-shadow:0 6px 24px #000a}#etlFab.dirty span{position:absolute;top:3px;right:3px;width:10px;height:10px;border-radius:50%;background:#ff5470;box-shadow:0 0 8px #ff5470}';
document.head.append(FABCSS);
const FAB=document.createElement("button");
FAB.id="etlFab";FAB.title="Ouvrir l'atelier";FAB.innerHTML="🛠<span></span>";
FAB.onclick=()=>open();
document.body.append(FAB);
setInterval(()=>{FAB.classList.toggle("dirty",isDirty())},1500);

/* ---------- UI : style ---------- */
function style(){return `<style>
#etlFab{position:fixed;right:14px;bottom:14px;z-index:9998;width:46px;height:46px;border-radius:50%;border:1px solid #ffd16659;background:#0a1424ee;color:#ffd166d9;font-size:19px;cursor:pointer;box-shadow:0 6px 24px #000a}
#etlFab.dirty span{position:absolute;top:3px;right:3px;width:10px;height:10px;border-radius:50%;background:#ff5470;box-shadow:0 0 8px #ff5470}
#etlStudio{position:fixed;inset:0;z-index:99990;background:#0b0e15;display:flex;color:#e8eefb;font:14px/1.5 system-ui,-apple-system,sans-serif;animation:etlIn .25s}
@keyframes etlIn{from{opacity:0}to{opacity:1}}
#etlStudio *{box-sizing:border-box}
.etlSide{width:218px;flex:none;background:#0d1119;border-right:1px solid #1d2434;display:flex;flex-direction:column;padding:14px 10px}
.etlLogo{display:flex;align-items:center;gap:8px;padding:4px 8px 14px;font:600 15px Georgia,serif;color:#fdfbf4}
.etlLogo b{color:#ffd166}
.etlNav{display:flex;flex-direction:column;gap:2px}
.etlNav button{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;border:0;border-radius:8px;background:none;color:#aab7d0;font:500 13.5px system-ui;cursor:pointer;text-align:left}
.etlNav button:hover{background:#141a28;color:#e8eefb}
.etlNav button.on{background:#182236;color:#ffd166;font-weight:600}
.etlNav .badge{margin-left:auto;background:#ff5470;color:#fff;border-radius:9px;font-size:10.5px;padding:1px 7px;font-weight:700}
.etlSide .foot{margin-top:auto;padding:10px 8px;font-size:11px;color:#55607a}
.etlMain{flex:1;display:flex;flex-direction:column;min-width:0}
.etlTop{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid #1d2434;background:#0d1119}
.etlTop h1{margin:0;font:600 16px system-ui;flex:1;color:#e8eefb}
.etlTop .st{font-size:11.5px;color:#7d8aa5}
.etlBody{flex:1;overflow-y:auto;padding:20px 24px;scrollbar-width:thin}
.etlBtn{padding:8px 14px;border-radius:8px;border:1px solid #2c4a73;background:#0a1424;color:#dbe7f8;font:inherit;font-size:13px;cursor:pointer;transition:.15s}
.etlBtn:hover{border-color:#3d6ca3}
.etlBtn.pri{background:#ffd166;border-color:#ffd166;color:#14141a;font-weight:600}
.etlBtn.pri:hover{background:#ffdd85}
.etlBtn.dgr{border-color:#7a2c3a;color:#ff9aa9}.etlBtn.dgr:hover{border-color:#c25064}
.etlBtn.sm{padding:4px 9px;font-size:12px}
.etlCard{background:#101524;border:1px solid #1d2434;border-radius:12px;padding:16px 18px;margin-bottom:16px}
.etlCard h3{margin:0 0 4px;font:600 14px system-ui;color:#e8eefb}
.etlCard .hint{font-size:12px;color:#7d8aa5;margin:0 0 10px}
.etlGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}
.etlKpi{background:#101524;border:1px solid #1d2434;border-radius:12px;padding:14px 16px}
.etlKpi b{display:block;font-size:24px;color:#ffd166;font-weight:600}
.etlKpi span{font-size:11.5px;color:#7d8aa5;text-transform:uppercase;letter-spacing:.8px}
.etlRow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0}
.etlIn,textarea.etlTa{background:#0a0f1a;border:1px solid #253048;border-radius:8px;color:#e8eefb;font:inherit;font-size:13px;padding:8px 10px;outline:none}
.etlIn:focus,textarea.etlTa:focus{border-color:#3d6ca3}
textarea.etlTa{width:100%;min-height:120px;resize:vertical;font:12.5px/1.55 ui-monospace,Consolas,monospace}
label.etlL{display:block;font-size:11.5px;color:#7d8aa5;text-transform:uppercase;letter-spacing:.8px;margin:10px 0 4px;font-weight:600}
.etlList{display:flex;flex-direction:column;gap:4px;max-height:330px;overflow-y:auto;scrollbar-width:thin}
.etlList button{display:flex;gap:10px;align-items:center;width:100%;padding:8px 10px;border:0;border-radius:8px;background:none;color:#c3cfe6;font:inherit;font-size:13px;cursor:pointer;text-align:left}
.etlList button:hover{background:#141a28}
.etlList button.on{background:#182236;color:#ffd166}
.etlList .k{font:12px/1 ui-monospace,monospace;background:#0a0f1a;border:1px solid #253048;border-radius:6px;padding:3px 7px;min-width:52px;text-align:center}
.etlCols{display:grid;grid-template-columns:minmax(220px,1fr) minmax(320px,2.2fr);gap:16px}
.etlMsg{font-size:12.5px;color:#8fae79;margin-top:8px;min-height:18px}
.etlMsg.err{color:#ff8d9d}
.etlItem{display:grid;gap:6px;border:1px solid #1d2434;border-radius:10px;padding:10px;margin:8px 0;background:#0d1220}
.etlItem .top{display:flex;gap:8px;align-items:center}
.etlTag{font-size:10px;text-transform:uppercase;letter-spacing:1px;padding:2px 8px;border-radius:6px;background:#182236;color:#7d8aa5;font-weight:700}
.etlTag.err{background:#3a1420;color:#ff8d9d}.etlTag.warn{background:#332710;color:#ffd166}.etlTag.ok{background:#12301d;color:#7fe0a2}
.etlLog{background:#070b12;border:1px solid #1d2434;border-radius:10px;padding:12px;font:12px/1.7 ui-monospace,Consolas,monospace;color:#9fb4d8;max-height:260px;overflow-y:auto;white-space:pre-wrap}
.etlSplit{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:860px){.etlSide{width:60px;padding:10px 6px}.etlLogo{font-size:0;padding:4px 0 10px}.etlNav button span.lbl,.etlSide .foot{display:none}.etlCols,.etlSplit{grid-template-columns:1fr}}
.etlGal{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.gItem{background:#0d1220;border:1px solid #1d2434;border-radius:12px;overflow:hidden}
.gItem .gImg{width:100%;height:132px;object-fit:cover;display:block;background:#0a0f1a;cursor:zoom-in}
.gItem .gImg.ko{opacity:.18}
.gItem .gTop{display:flex;align-items:center;padding:8px 10px 0}
.gItem .gUrl{width:calc(100% - 20px);margin:8px 10px 10px;font-size:11.5px;padding:5px 8px}
.gItem.gAdd{display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center;color:#7d8aa5;font-size:12.5px;cursor:pointer;border-style:dashed;min-height:200px}
.gItem.gAdd:hover{color:#ffd166;border-color:#ffd16659}
#etlBig{position:fixed;inset:0;z-index:99999;background:#000000e0;display:none;align-items:center;justify-content:center;cursor:zoom-out;padding:24px}
#etlBig.on{display:flex}
#etlBig img{max-width:94vw;max-height:92vh;border-radius:10px;box-shadow:0 20px 80px #000}
body.etlPrev{display:block}
body.etlPrev #app{position:fixed;top:50%;right:24px;transform:translateY(-50%);height:min(800px,92vh);width:min(382px,42vw);z-index:99980}
body.etlPrev #etlStudio{right:calc(min(382px,42vw) + 52px)}
body.etlPrev .etlCols,body.etlPrev .etlSplit{grid-template-columns:1fr}
#etlPrevOff,#etlPrevRst{position:fixed;top:16px;z-index:99985;padding:9px 14px;border-radius:12px;border:1px solid #ffd16659;background:#0a1424ee;color:#ffd166d9;font:13px system-ui;cursor:pointer;box-shadow:0 6px 24px #000a}
#etlPrevOff{right:24px}
#etlPrevRst{right:178px;border-color:#3d6ca3;color:#dbe7f8}
@media (max-width:900px){body.etlPrev #etlStudio{display:none}body.etlPrev #app{width:min(400px,94vw);right:50%;transform:translate(50%,-50%)}}
</style>`}

/* ---------- UI : coquille ---------- */
const NAV=[["dash","▦","Tableau de bord"],["nodes","💬","Dialogues"],["stories","📖","Histoires & chapitres"],["ends","🏁","Fins"],["media","🖼","Médias"],["check","✓","Validation"],["cloud","☁","Sauvegarde cloud"],["push","▲","Publication"]];
function shell(){return `
<aside class="etlSide">
 <div class="etlLogo">🖋 <span>Atel<b>ier</b></span></div>
 <nav class="etlNav">${NAV.map(([id,ic,lbl])=>`<button data-tab="${id}">${ic}<span class="lbl">${lbl}</span></button>`).join("")}</nav>
 <div class="foot" style="color:#55607a">v${typeof VER!=="undefined"?VER:"?"} · repo ${REPO.split("/")[1]}</div>
</aside>
<div class="etlMain">
 <div class="etlTop">
  <h1 id="etlTitle">Tableau de bord</h1>
  <span class="st" id="etlSt"></span>
  <button class="etlBtn sm" id="etlBackup">⤓ Sauvegarde JSON</button>
  <button class="etlBtn sm dgr" id="etlClose">Fermer ✕</button>
 </div>
 <div class="etlBody" id="etlBody"></div>
</div>`}

/* ---------- rendu par onglet ---------- */
function render(){
  W.querySelectorAll(".etlNav button").forEach(b=>b.classList.toggle("on",b.dataset.tab===TAB));
  $id("etlTitle").textContent=(NAV.find(n=>n[0]===TAB)||["","",""])[2];
  $id("etlSt").innerHTML=isDirty()?`<b style="color:#ff9aa9">${dirtyKeys().length} modifs non publiées</b>`:`<span style="color:#7fe0a2">à jour</span>`;
  const B=$id("etlBody");
  if(TAB==="dash")B.innerHTML=rDash();
  if(TAB==="nodes")B.innerHTML=rNodes();
  if(TAB==="stories")B.innerHTML=rStories();
  if(TAB==="ends")B.innerHTML=rEnds();
  if(TAB==="media")B.innerHTML=rMedia();
  if(TAB==="check")B.innerHTML=rCheck();
  if(TAB==="cloud")B.innerHTML=rCloud();
  if(TAB==="push")B.innerHTML=rPush();
  bindTab();
}

/* ---------- tableau de bord ---------- */
function rDash(){
  const ends=Object.keys(S).filter(k=>S[k].e||S[k].k).length;
  const d=dirtyKeys();
  const draft=draftLoad();
  return `<div class="etlGrid" style="margin-bottom:16px">
   <div class="etlKpi"><b>${Object.keys(S).length}</b><span>nœuds</span></div>
   <div class="etlKpi"><b>${STORIES.length}</b><span>histoires</span></div>
   <div class="etlKpi"><b>${STORIES.reduce((a,s)=>a+(s.ch||[]).length,0)}</b><span>chapitres</span></div>
   <div class="etlKpi"><b>${ends}</b><span>fins</span></div>
   <div class="etlKpi"><b>${Object.keys(IMG).length}</b><span>décors</span></div>
  </div>
  ${draft&&draft!==snapshot()&&draft!==snapS?`<div class="etlCard" style="border-color:#8a6a1f"><h3>📼 Brouillon local trouvé</h3><p class="hint">Une sauvegarde de travail différente existe sur cet appareil.</p><div class="etlRow"><button class="etlBtn pri" id="etlRestore">Restaurer le brouillon</button><button class="etlBtn dgr" id="etlDropDraft">L'ignorer</button></div></div>`:""}
  <div class="etlCard"><h3>Actions</h3><p class="hint">Tout se passe dans ce navigateur jusqu'à la publication.</p>
   <div class="etlRow"><button class="etlBtn pri" id="etlGoNodes">✎ Éditer les dialogues</button><button class="etlBtn" id="etlGoCheck">✓ Valider le projet</button><button class="etlBtn" id="etlGoPush">▲ Publier sur GitHub</button></div></div>
  <div class="etlCard"><h3>Histoires</h3><div class="etlList">${STORIES.map((s,i)=>`<button data-go="stories"><span class="k">H${i+1}</span> <b>${esc(s.t)}</b> — ${esc(s.n)} · ${Object.keys(S).length?countStory(s):0} nœuds vus</button>`).join("")}</div></div>`}

/* ---------- dialogues (nœuds) ---------- */
let NODE_FILTER="";
const natCmp=(x,y)=>x.localeCompare(y,undefined,{numeric:true,sensitivity:"base"});
function nodeIds(){return Object.keys(S).sort(natCmp)}
function rNodes(){
  const ids=nodeIds().filter(k=>k.toLowerCase().includes(NODE_FILTER.toLowerCase()));
  return `<div class="etlCols">
   <div class="etlCard"><h3>Nœuds</h3><p class="hint">${nodeIds().length} nœuds · dans l'ordre du récit</p>
    <input class="etlIn" id="etlNF" placeholder="filtrer…" value="${esc(NODE_FILTER)}" style="width:100%">
    <div class="etlList" id="etlNL">${ids.map(k=>`<button data-node="${k}" class="${CUR===k?"on":""}"><span class="k">${k}</span>${S[k].e||S[k].k?"🏁 ":""}${esc(firstText(S[k]).slice(0,42))}</button>`).join("")}</div>
    <div class="etlRow"><button class="etlBtn sm" id="etlNew">＋ Nouveau</button><button class="etlBtn sm dgr" id="etlDelNode">Supprimer</button></div></div>
   <div id="etlEd">${rEditor()}</div></div>`}
function firstText(n){const m=(n.m||[]).find(x=>Array.isArray(x)&&x[1]);return m?m[1]:(n.e?"Fin":JSON.stringify(n).slice(0,40))}
const mtypes=n=>{const snd=(n&&n.nm)||(STORIES[0]&&STORIES[0].n)||"inconnu";
 return [["h","h · "+snd+" écrit"],["n","n · narration"],["s","s · aparté/toi"],["m","m · pièce jointe"],["x","x · séparateur"]]};
const MTYPES=mtypes(null);
function rEditor(){
  const n=S[CUR];if(!n)return `<div class="etlCard"><h3>Aucun nœud</h3><p class="hint">Sélectionne un nœud à gauche ou crées-en un.</p></div>`;
  const msgs=(n.m||[]).map((x,i)=>`<div class="etlItem"><div class="top"><select class="etlIn mt" style="flex:1" data-i="${i}">${mtypes(n).map(([v,l])=>`<option value="${v}" ${x[0]===v?"selected":""}>${l}</option>`).join("")}</select><button class="etlBtn sm" data-mv="${i}">↑</button><button class="etlBtn sm" data-mv="${i}">↓</button><button class="etlBtn sm dgr" data-mdel="${i}">✕</button></div><textarea class="etlTa" data-mtext="${i}">${esc(x[1]||"")}</textarea></div>`).join("");
  const chs=(n.c||[]).map((c,i)=>`<div class="etlItem"><div class="top"><input class="etlIn" data-ctext="${i}" value="${esc(c[0]||"")}" placeholder="Texte du choix" style="flex:1"><input class="etlIn" data-ctgt="${i}" value="${esc(c[1]||"")}" list="etlIds" placeholder="nœud cible" style="width:110px"><input class="etlIn" data-ceff="${i}" value="${esc(JSON.stringify(c[2]||{}))}" placeholder='{"t":1}' style="width:110px;font-family:ui-monospace"><button class="etlBtn sm dgr" data-cdel="${i}">✕</button></div></div>`).join("");
  return `<div class="etlCard"><h3 style="display:flex;gap:8px;align-items:center">Nœud <span class="k" style="font:13px ui-monospace;background:#0a0f1a;border:1px solid #253048;border-radius:6px;padding:2px 8px">${CUR}</span><span class="etlTag ${n.e||n.k?"warn":""}">${n.e||n.k?"fin":""}</span></h3>
   <datalist id="etlIds">${nodeIds().map(k=>`<option value="${k}">`).join("")}</datalist>
   <label class="etlL">Décor (w)</label><input class="etlIn" id="etlW" value="${esc(n.w||"")}" list="etlKeys" style="width:220px"><datalist id="etlKeys">${Object.keys(IMG).map(k=>`<option value="${k}">`).join("")}</datalist>
   <div class="etlSplit"><div><label class="etlL">App — SMS, WhatsApp, Fichiers…</label><input class="etlIn" id="etlApp" value="${esc(n.app||"")}" placeholder="(aucune)" style="width:100%"></div>
   <div><label class="etlL">Expéditeur (nm) — qui écrit les h</label><input class="etlIn" id="etlNm" value="${esc(n.nm||"")}" placeholder="(contact de l'histoire)" style="width:100%"></div></div>
   <label class="etlL">Messages</label>${msgs}<div class="etlRow"><button class="etlBtn sm" id="etlAddM">＋ Message</button></div>
   <label class="etlL">Choix</label>${chs||`<p class="hint" style="margin:4px 0">Aucun choix (fin de nœud ou suite automatique).</p>`}<div class="etlRow"><button class="etlBtn sm" id="etlAddC">＋ Choix</button></div>
   <div class="etlSplit"><div><label class="etlL">Suite auto (x)</label><input class="etlIn" id="etlX" value="${esc(n.x||"")}" list="etlIds" style="width:100%"></div>
   <div><label class="etlL">Raccroché (h)</label><input class="etlIn" id="etlH" value="${esc(n.h||"")}" list="etlIds" style="width:100%"></div></div>
   <label class="etlL"><input type="checkbox" id="etlIsEnd" ${n.e||n.k?"checked":""}> Ce nœud est une fin</label>
   <div id="etlEndBox" style="${n.e||n.k?"":"display:none"}"><label class="etlL">Titre de la fin</label><input class="etlIn" id="etlETitle" value="${esc(Array.isArray(n.e)?n.e[0]:(n.k||""))}" style="width:100%"><label class="etlL">Texte de la fin</label><textarea class="etlTa" id="etlEText" style="min-height:70px">${esc(Array.isArray(n.e)?n.e[1]:"")}</textarea></div>
   <label class="etlL">JSON expert — tout le nœud (call, fx, vw, j…)</label>
   <textarea class="etlTa" id="etlJson" style="min-height:150px">${esc(JSON.stringify(n,null,2))}</textarea>
   <div class="etlRow" style="margin-top:12px"><button class="etlBtn pri" id="etlSaveForm">✓ Enregistrer le formulaire</button><button class="etlBtn" id="etlSaveJson">Enregistrer le JSON expert</button><button class="etlBtn" id="etlPrev">▶ Tester dans le téléphone</button></div>
   <div class="etlMsg" id="etlEMsg"></div></div>`}

/* ---------- histoires & chapitres ---------- */
let ST_I=0,CH_I=0;
function rStories(){
  const st=STORIES[ST_I]||STORIES[0];
  return `<div class="etlCols"><div class="etlCard"><h3>Histoires</h3><p class="hint">H1 = histoire 1 · ses nœuds portent son préfixe (h1, h2…).</p><div class="etlList">${STORIES.map((s,i)=>`<button data-story="${i}" class="${i===ST_I?"on":""}"><span class="k">H${i+1}</span><b>${esc(s.t)}</b> — ${esc(s.n)}</button>`).join("")}</div>
   <div class="etlRow" style="margin-top:10px"><button class="etlBtn sm" id="etlNewStory">＋ Nouvelle histoire</button></div></div>
  <div class="etlCard"><h3>« ${esc(st.t)} »</h3><p class="hint">Histoire ${ST_I+1} · préfixe des nœuds : « ${st.id} » · ${esc(st.num)}</p>
   <label class="etlL">Titre</label><input class="etlIn" id="etlSTitle" value="${esc(st.t)}" style="width:100%">
   <label class="etlL">Contact (nom affiché)</label><input class="etlIn" id="etlSName" value="${esc(st.n)}" style="width:100%">
   <label class="etlL">Numéro</label><input class="etlIn" id="etlSNum" value="${esc(st.num||"")}" style="width:100%">
   <label class="etlL">Description</label><textarea class="etlTa" id="etlSDesc" style="min-height:64px">${esc(st.d||"")}</textarea>
   <div class="etlRow" style="margin-top:10px"><button class="etlBtn pri" id="etlSaveStory">✓ Enregistrer l'histoire</button></div>
   <label class="etlL">Chapitres (${(st.ch||[]).length})</label>
   ${(st.ch||[]).map((c,i)=>`<div class="etlItem"><div class="top"><b style="min-width:22px;color:#7d8aa5">${i+1}</b><input class="etlIn" data-cht="${i}" value="${esc(c[0])}" placeholder="Titre" style="flex:1"><input class="etlIn" data-chn="${i}" value="${esc(c[1])}" list="etlIds" placeholder="nœud" style="width:100px"><button class="etlBtn sm" data-chu="${i}">↑</button><button class="etlBtn sm dgr" data-chdel="${i}">✕</button></div></div>`).join("")}
   <div class="etlRow"><button class="etlBtn sm" id="etlAddCh">＋ Chapitre</button><button class="etlBtn sm pri" id="etlSaveChaps">✓ Enregistrer les chapitres</button></div>
   <div class="etlMsg" id="etlSMsg"></div></div></div>`}

/* ---------- fins ---------- */
function rEnds(){
  const ends=Object.keys(S).filter(k=>S[k].e||S[k].k).sort(natCmp);
  return `<div class="etlCard"><h3>Fins détectées (${ends.length})</h3><p class="hint">Un nœud avec e:[titre, texte] ou k. Clique pour l'éditer.</p>
  <div class="etlList">${ends.map(k=>`<button data-end="${k}"><span class="k">${k}</span><b>${esc(Array.isArray(S[k].e)?S[k].e[0]:(S[k].k||"Fin"))}</b><span style="color:#7d8aa5">${esc((Array.isArray(S[k].e)?S[k].e[1]:"").slice(0,60))}</span></button>`).join("")||"Aucune fin explicite."}</div></div>`}

/* ---------- médias ---------- */
function rMedia(){
  const ks=Object.keys(IMG).sort(natCmp);
  return `<div class="etlCard"><h3>Galerie des décors (${ks.length})</h3><p class="hint">Toute la galerie du projet. Clique une vignette pour l'agrandir ; l'URL se modifie sous chaque image. Clé utilisable dans le champ w d'un nœud.</p>
  <div class="etlGal">${ks.map(k=>`<div class="gItem"><img class="gImg" src="${esc(IMG[k])}" loading="lazy" onerror="this.classList.add('ko')"><div class="gTop"><span class="k">${k}</span></div><input class="etlIn gUrl" data-img="${k}" value="${esc(IMG[k])}" placeholder="assets/img/….jpg"></div>`).join("")}
  <div class="gItem gAdd" id="etlGalAdd"><div style="font-size:24px">＋</div>Nouveau décor</div></div>
  <div class="etlRow" style="margin-top:14px"><input class="etlIn" id="etlImgK" placeholder="nouvelle clé" style="width:140px"><input class="etlIn" id="etlImgV" placeholder="assets/img/….jpg ou data:image/…" style="flex:1;min-width:220px"><button class="etlBtn sm" id="etlImgAdd">＋ Ajouter</button></div>
  <div class="etlRow" style="margin-top:12px"><button class="etlBtn pri" id="etlImgSave">✓ Enregistrer les décors</button><span class="hint" style="margin:0">⚠ publishées dans js/assets.js</span></div><div class="etlMsg" id="etlIMsg"></div></div>
  <div id="etlBig"><img alt=""></div>`}

/* ---------- validation ---------- */
function rCheck(){
  if(!lastCheck)lastCheck=validate();
  const r=lastCheck;
  return `<div class="etlCard"><h3>Rapport de validation</h3>
   <p class="etlRow" style="margin:0 0 10px"><span class="etlTag ${r.ok?"ok":"err"}">${r.ok?"PROJET VALIDE":"ERREURS"}</span><span class="etlTag warn">${r.warns.length} avertissements</span><button class="etlBtn sm" id="etlRecheck">↻ Relancer</button></p>
   ${r.errs.map(e=>`<div class="etlItem" style="border-color:#3a1420"><span class="etlTag err">erreur</span> ${esc(e)}</div>`).join("")}
   ${r.warns.map(e=>`<div class="etlItem" style="border-color:#332710"><span class="etlTag warn">alerte</span> ${esc(e)}</div>`).join("")}
   ${!r.errs.length&&!r.warns.length?'<div class="etlItem" style="border-color:#12301d"><span class="etlTag ok">ok</span> Rien à signaler.</div>':""}</div>`}

/* ---------- sauvegarde cloud (admin) ---------- */
function gistKeys(k){return k==="etl_resume_v4"||/^pg/.test(k)||/^fe/.test(k)||/^etl_name_/.test(k)||/^etl_part_/.test(k)||k==="etl_hint"||k==="etl_emoji"||k==="etl_tts"}
function gistCode(){let d={};try{Object.keys(localStorage).filter(gistKeys).forEach(k=>d[k]=localStorage.getItem(k))}catch(e){}
 return btoa(unescape(encodeURIComponent(JSON.stringify(d))))}
function rCloud(){
 const gid=(()=>{try{return localStorage.getItem("etl_gist")||""}catch(e){return ""}})();
 return `<div class="etlCard"><h3>Sauvegarde cloud (GitHub Gist privé)</h3>
  <p class="hint">Réservé à l'administration : envoie la sauvegarde de partie (localStorage) dans un Gist privé pour la récupérer sur un autre appareil. Le joueur, lui, dispose du code copier/coller et du fichier de sauvegarde dans le jeu.</p>
  <label class="etlL">Jeton GitHub (PAT — permission « Gists »)</label>
  <div class="etlRow"><input class="etlIn" type="password" id="gcPat" placeholder="github_pat_… ou ghp_…" value="${esc((()=>{try{return localStorage.getItem("etl_gist_pat")||""}catch(e){return ""}})())}" style="flex:1;min-width:260px"><label style="font-size:12px;color:#7d8aa5;display:flex;gap:6px;align-items:center"><input type="checkbox" id="gcSave" checked> retenir</label></div>
  <label class="etlL">Gist utilisé</label>
  <p class="etlRow" style="margin:2px 0 12px"><span class="k" style="font:12px ui-monospace;background:#0a0f1a;border:1px solid #253048;border-radius:6px;padding:3px 8px">${gid||"aucun — créé au premier envoi"}</span></p>
  <div class="etlRow"><button class="etlBtn pri" id="gcUp">☁️ Envoyer la sauvegarde de partie</button><button class="etlBtn" id="gcDn">⤓ Récupérer depuis le cloud</button></div>
  <div class="etlLog" id="gcLog" style="margin-top:12px">Prêt.</div></div>`}

/* ---------- publication ---------- */
function rPush(){
  const d=dirtyKeys();
  return `<div class="etlCard"><h3>Publier sur GitHub</h3><p class="hint">Commit direct sur main (Shuhya/entre-les-lignes) : js/story.js régénéré depuis l'éditeur, version incrémentée + cache-busting sur toutes les pages. GitHub Pages met ~1 min à propager.</p>
   <label class="etlL">Jeton d'accès GitHub (PAT, permission « Contents : Read and write »)</label>
   <div class="etlRow"><input class="etlIn" type="password" id="etlPat" placeholder="github_pat_… ou ghp_…" value="${esc(localStorage.getItem("etl_pat")||"")}" style="flex:1;min-width:260px"><label style="font-size:12px;color:#7d8aa5;display:flex;gap:6px;align-items:center"><input type="checkbox" id="etlPatSave" checked> retenir sur cet appareil</label></div>
   <p class="hint" style="margin:2px 0 8px">Le jeton reste dans ce navigateur (localStorage) et n'est jamais écrit dans le dépôt. Saisis-le à chaque fois si tu préfères.</p>
   <label class="etlL">Message du commit</label>
   <input class="etlIn" id="etlMsg" value="${esc("Édition atelier : "+d.length+" nœud(s) modifié(s)")}" style="width:100%">
   <p class="etlRow" style="margin:10px 0">${d.length?`<span class="etlTag warn">${d.length} modifs locales</span> ${d.slice(0,8).map(esc).join(", ")}${d.length>8?"…":""}`:`<span class="etlTag ok">aucune modification locale</span>`}</p>
   <div class="etlRow"><button class="etlBtn pri" id="etlDo">▲ Vérifier & publier</button><button class="etlBtn" id="etlGoCheck2">✓ Valider avant</button></div>
   <div class="etlLog" id="etlLog" style="margin-top:12px">Prêt. La publication : 1) valide le projet, 2) régénère story.js, 3) récupère engine/jeu/atelier du dépôt, 4) incrémente la version (cache-busting), 5) commit sur main.</div></div>`}

/* ---------- log publication ---------- */
function plog(t,cls){const L=$id("etlLog");if(!L)return;L.textContent+="\n"+t;L.scrollTop=L.scrollHeight;if(cls==="err")L.style.color="#ff8d9d";if(cls==="ok")L.style.color="#7fe0a2"}

/* ---------- API GitHub (browser, CORS ok) ---------- */
async function gh(pat,path,data,method){
  const r=await fetch("https://api.github.com/repos/"+REPO+path,{method:method||(data?"POST":"GET"),
   headers:{Authorization:"Bearer "+pat,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},
   body:data?JSON.stringify(data):undefined});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw Error("GitHub "+r.status+" : "+(j.message||"erreur"));
  return j}

async function publish(){
  const pat=$id("etlPat").value.trim();if(!pat){plog("✋ Jeton GitHub manquant.","err");return}
  if($id("etlPatSave").checked)try{localStorage.setItem("etl_pat",pat)}catch(e){}
  const msg=$id("etlMsg").value.trim()||"Édition atelier";
  const log=t=>plog(t);
  try{
    /* 1. validation */
    log("→ Validation du projet…");
    const r=validate();lastCheck=r;
    if(r.errs.length){log("✋ "+r.errs.length+" erreur(s) : publication annulée.\n  - "+r.errs.slice(0,5).join("\n  - "),"err");TAB="check";render();return}
    log("  ok ("+r.warns.length+" alerte(s) non bloquante(s))");
    /* 2. génération */
    log("→ Génération de js/story.js…");
    const story=genStory(),assets=genAssets();
    /* 3. état du dépôt */
    log("→ Lecture du dépôt (branche main)…");
    const ref=await gh(pat,"/git/ref/heads/main");
    const base=await gh(pat,"/git/commits/"+ref.object.sha);
    const getFile=async p=>{const c=await gh(pat,"/contents/"+p+"?ref=main");return ub64(c.content)};
    let eng=await getFile("js/engine.js"),jeu=await getFile("jeu.html"),atl=await getFile("atelier.html");
    /* 4. version */
    const m=eng.match(/VER="(\d+)\.(\d+)"/);if(!m)throw Error("VER introuvable dans engine.js");
    const V=m[1]+"."+(+m[2]+1);
    log("  version "+m[1]+"."+m[2]+" → "+V);
    eng=eng.replace(/VER="\d+\.\d+"/,'VER="'+V+'"');
    jeu=jeu.replace(/\?v=\d+\.\d+/g,"?v="+V);atl=atl.replace(/\?v=\d+\.\d+/g,"?v="+V);
    /* 5. blobs */
    log("→ Envoi des fichiers…");
    const FILES=[["js/story.js",story],["js/assets.js",assets],["js/engine.js",eng],["jeu.html",jeu],["atelier.html",atl]];
    const tree=[];
    for(const[p,c]of FILES){const b=await gh(pat,"/git/blobs",{content:b64u(c),encoding:"base64"});log("  ✓ "+p+" ("+Math.round(c.length/1024)+" Ko)");tree.push({path:p,mode:"100644",type:"blob",sha:b.sha})}
    /* 6. commit */
    log("→ Commit « "+msg+" »…");
    const tr=await gh(pat,"/git/trees",{tree,base_tree:base.tree.sha});
    const cm=await gh(pat,"/git/commits",{message:"v"+V+" — "+msg,tree:tr.sha,parents:[ref.object.sha]});
    await gh(pat,"/git/refs/heads/main",{sha:cm.sha},"PATCH");
    log("✓ Publié : v"+V+" · commit "+cm.sha.slice(0,7),"ok");
    log("  https://github.com/"+REPO+"/commit/"+cm.sha);
    log("  https://shuhya.github.io/entre-les-lignes/jeu.html  (~1 min de propagation)");
    snapS=snapshot();draftClear();
    $id("etlSt").innerHTML='<span style="color:#7fe0a2">à jour</span>';
  }catch(e){log("✋ "+e.message,"err")}
}

/* ---------- interactions ---------- */
function bind(){
  ["keydown","keyup"].forEach(ev=>W.addEventListener(ev,e=>e.stopPropagation()));
  W.querySelectorAll(".etlNav button").forEach(b=>b.onclick=()=>{TAB=b.dataset.tab;render()});
  $id("etlClose").onclick=close;
  $id("etlBackup").onclick=()=>{const blob=new Blob([JSON.stringify({S,STORIES,IMG},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="entre-les-lignes-contenus.json";a.click()};
}
function touch(){draftSave();$id("etlSt").innerHTML=`<b style="color:#ff9aa9">${dirtyKeys().length} modifs non publiées</b>`;FAB.classList.add("dirty")}

function bindTab(){
  const B=$id("etlBody");
  const q=s=>B.querySelector(s),qa=s=>B.querySelectorAll(s);
  /* dashboard */
  const go=id=>q("#"+id)&&(q("#"+id).onclick=()=>{TAB=id==="etlGoPush"?"push":id==="etlGoNodes"?"nodes":"check";render()});
  ["etlGoNodes","etlGoCheck","etlGoPush"].forEach(go);
  const all=q("#etlNL");
  qa("[data-go]").forEach(b=>b.onclick=()=>{TAB="stories";render()});
  if(q("#etlRestore"))q("#etlRestore").onclick=()=>{try{const d=JSON.parse(draftLoad());Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,d.S);Object.keys(IMG).forEach(k=>delete IMG[k]);Object.assign(IMG,d.IMG);STORIES.splice(0,STORIES.length,...d.STORIES);snapS=snapshot();render();toastAt("Brouillon restauré.")}catch(e){toastAt("Brouillon illisible.")}};
  if(q("#etlDropDraft"))q("#etlDropDraft").onclick=()=>{draftClear();render()};
  /* dialogues */
  const nf=q("#etlNF");if(nf){nf.oninput=()=>{NODE_FILTER=nf.value;const nl=q("#etlNL"),ids=nodeIds().filter(k=>k.toLowerCase().includes(NODE_FILTER.toLowerCase()));nl.innerHTML=ids.map(k=>`<button data-node="${k}" class="${CUR===k?"on":""}"><span class="k">${k}</span>${S[k].e||S[k].k?"🏁 ":""}${esc(firstText(S[k]).slice(0,42))}</button>`).join("");bindTab()};nf.onkeydown=e=>e.stopPropagation()}
  qa("[data-node]").forEach(b=>b.onclick=()=>{CUR=b.dataset.node;TAB="nodes";render()});
  if(q("#etlNew"))q("#etlNew").onclick=()=>{const id=prompt("Identifiant unique du nouveau nœud ? (ex. z12a)");if(!id)return;if(S[id]){alert("Ce nœud existe déjà.");return}S[id]={m:[["n","Nouvelle scène."]],c:[]};CUR=id;touch();lastCheck=null;render()};
  if(q("#etlDelNode"))q("#etlDelNode").onclick=()=>{if(!CUR)return;if(!confirm("Supprimer le nœud "+CUR+" ?"))return;delete S[CUR];CUR=null;touch();lastCheck=null;render()};
  if(q("#etlAddM"))q("#etlAddM").onclick=()=>{S[CUR].m=(S[CUR].m||[]).concat([["n",""]]);touch();lastCheck=null;render()};
  qa("[data-mdel]").forEach(b=>b.onclick=()=>{S[CUR].m.splice(+b.dataset.mdel,1);touch();lastCheck=null;render()});
  qa("[data-mv]").forEach(b=>b.onclick=()=>{const i=+b.dataset.mv,dir=b.textContent.trim()==="↑"?-1:1,j=i+dir;if(j<0||j>=S[CUR].m.length)return;const a=S[CUR].m;[a[i],a[j]]=[a[j],a[i]];touch();lastCheck=null;render()});
  qa("[data-mtext]").forEach(t=>t.oninput=()=>{S[CUR].m[+t.dataset.mtext][1]=t.value;touch()});
  qa("select.mt").forEach(s=>s.onchange=()=>{S[CUR].m[+s.dataset.i][0]=s.value;touch()});
  if(q("#etlAddC"))q("#etlAddC").onclick=()=>{S[CUR].c=(S[CUR].c||[]).concat([["","",{}]]);touch();lastCheck=null;render()};
  qa("[data-cdel]").forEach(b=>b.onclick=()=>{S[CUR].c.splice(+b.dataset.cdel,1);touch();lastCheck=null;render()});
  qa("[data-ctext]").forEach(t=>t.oninput=()=>{S[CUR].c[+t.dataset.ctext][0]=t.value;touch()});
  qa("[data-ctgt]").forEach(t=>t.oninput=()=>{S[CUR].c[+t.dataset.ctgt][1]=t.value.trim();touch()});
  qa("[data-ceff]").forEach(t=>t.oninput=()=>{try{const v=t.value.trim();S[CUR].c[+t.dataset.ceff][2]=v?JSON.parse(v):{};t.style.borderColor=""}catch(e){t.style.borderColor="#c25064"}});
  if(q("#etlW"))q("#etlW").oninput=e=>{e.target.value.trim()?S[CUR].w=e.target.value.trim():delete S[CUR].w;touch()};
  if(q("#etlX"))q("#etlX").oninput=e=>{e.target.value.trim()?S[CUR].x=e.target.value.trim():delete S[CUR].x;touch()};
  if(q("#etlH"))q("#etlH").oninput=e=>{e.target.value.trim()?S[CUR].h=e.target.value.trim():delete S[CUR].h;touch()};
  if(q("#etlApp"))q("#etlApp").oninput=e=>{e.target.value.trim()?S[CUR].app=e.target.value.trim():delete S[CUR].app;touch();lastCheck=null};
  if(q("#etlNm"))q("#etlNm").oninput=e=>{e.target.value.trim()?S[CUR].nm=e.target.value.trim():delete S[CUR].nm;touch();lastCheck=null};
  if(q("#etlIsEnd"))q("#etlIsEnd").onchange=e=>{const n=S[CUR];if(e.target.checked){if(!n.e&&!n.k)n.k="Fin sans titre"}else{delete n.e;delete n.k}touch();lastCheck=null;render()};
  if(q("#etlETitle"))q("#etlETitle").oninput=e=>{const n=S[CUR];if(Array.isArray(n.e)){n.e[0]=e.target.value}else{n.e=[e.target.value,q("#etlEText").value];delete n.k}touch()};
  if(q("#etlEText"))q("#etlEText").oninput=e=>{const n=S[CUR];if(Array.isArray(n.e))n.e[1]=e.target.value;else{n.e=[q("#etlETitle").value,e.target.value];delete n.k}touch()};
  if(q("#etlSaveJson"))q("#etlSaveJson").onclick=()=>{try{const n=JSON.parse(q("#etlJson").value);S[CUR]=n;touch();lastCheck=null;render();toastAt("Nœud "+CUR+" remplacé (JSON expert) — formulaire actualisé.")}catch(e){msg("JSON invalide : "+e.message,true)}};
  if(q("#etlSaveForm"))q("#etlSaveForm").onclick=()=>{touch();lastCheck=null;msg("Formulaire enregistré en mémoire.")};
  if(q("#etlPrev"))q("#etlPrev").onclick=()=>{if(!CUR||!S[CUR])return;
   if(!document.body.classList.contains("etlPrev")){
     document.body.classList.add("etlPrev");
     const bp=document.createElement("button");bp.id="etlPrevOff";bp.textContent="✕ Quitter l'aperçu";
     bp.onclick=()=>exitPrev();document.body.append(bp);
     const rb=document.createElement("button");rb.id="etlPrevRst";rb.textContent="⟲ Flags vierges";
     rb.onclick=()=>{st={t:0,l:0,r:0,v:0,e:""};$("chat").innerHTML="";$("ch").innerHTML="";play(CUR)};document.body.append(rb);
     run++;st=st||{t:0,l:0,r:0,v:0,e:""};
   }
   document.body.classList.add("play");$("mn").classList.remove("on");
   $("chat").innerHTML="";$("ch").innerHTML="";play(CUR)};
  /* histoires */
  qa("[data-story]").forEach(b=>b.onclick=()=>{ST_I=+b.dataset.story;CH_I=0;render()});
  if(q("#etlNewStory"))q("#etlNewStory").onclick=()=>{const id=prompt("Identifiant de l'histoire ? (ex. w)");if(!id)return;STORIES.push({id,n:"Contact",num:"06 00 00 00 00",t:"Nouvelle histoire",d:"",ch:[["Chapitre 1",Object.keys(S)[0]||"-"]]});ST_I=STORIES.length-1;touch();render()};
  if(q("#etlSaveStory"))q("#etlSaveStory").onclick=()=>{const st2=STORIES[ST_I];st2.t=q("#etlSTitle").value;st2.n=q("#etlSName").value;st2.num=q("#etlSNum").value;st2.d=q("#etlSDesc").value;touch();sMsg("Histoire enregistrée.")};
  qa("[data-cht]").forEach(t=>t.oninput=()=>{STORIES[ST_I].ch[+t.dataset.cht][0]=t.value;touch()});
  qa("[data-chn]").forEach(t=>t.oninput=()=>{STORIES[ST_I].ch[+t.dataset.chn][1]=t.value.trim();touch()});
  qa("[data-chu]").forEach(b=>b.onclick=()=>{const i=+b.dataset.chu,a=STORIES[ST_I].ch;if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];CH_I=i-1;touch();render()}});
  qa("[data-chdel]").forEach(b=>b.onclick=()=>{STORIES[ST_I].ch.splice(+b.dataset.chdel,1);touch();render()});
  if(q("#etlAddCh"))q("#etlAddCh").onclick=()=>{STORIES[ST_I].ch.push(["Nouveau chapitre","-"]);touch();render()};
  if(q("#etlSaveChaps"))q("#etlSaveChaps").onclick=()=>{touch();sMsg("Chapitres enregistrés.")};
  /* fins */
  qa("[data-end]").forEach(b=>b.onclick=()=>{CUR=b.dataset.end;TAB="nodes";render()});
  /* médias */
  qa("[data-img]").forEach(t=>t.oninput=()=>{IMG[t.dataset.img]=t.value;touch()});
  qa(".gImg").forEach(im=>im.onclick=()=>{const b=$id("etlBig");if(!b)return;b.querySelector("img").src=im.src;b.classList.add("on")});
  if(q("#etlBig"))q("#etlBig").onclick=()=>{q("#etlBig").classList.remove("on")};
  if(q("#etlGalAdd"))q("#etlGalAdd").onclick=()=>{const k=q("#etlImgK");if(k){k.scrollIntoView({block:"center"});k.focus()}};
  if(q("#etlImgAdd"))q("#etlImgAdd").onclick=()=>{const k=q("#etlImgK").value.trim(),v=q("#etlImgV").value.trim();if(!k||!v)return;IMG[k]=v;touch();render()};
  if(q("#etlImgSave"))q("#etlImgSave").onclick=()=>{touch();q("#etlIMsg").textContent="Décors enregistrés en mémoire — publiés dans js/assets.js."};
  /* validation */
  if(q("#etlRecheck"))q("#etlRecheck").onclick=()=>{lastCheck=validate();render()};
  /* cloud */
  if(q("#gcUp")){
    const log=t=>{const L=q("#gcLog");if(L){L.textContent+="\n"+t;L.scrollTop=L.scrollHeight}};
    const gh=async(method,body,gid)=>{const tok=q("#gcPat").value.trim();if(!tok)throw Error("Jeton manquant.");
      const r=await fetch("https://api.github.com/gists"+(gid?"/"+gid:""),{method,headers:{Authorization:"Bearer "+tok,Accept:"application/vnd.github+json"},body:body?JSON.stringify(body):undefined});
      const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.message||("HTTP "+r.status));return j};
    q("#gcUp").onclick=async()=>{
      const btn=q("#gcUp");btn.disabled=true;btn.textContent="⏳ Envoi…";q("#gcLog").textContent="";
      try{
        if(q("#gcSave").checked)try{localStorage.setItem("etl_gist_pat",q("#gcPat").value.trim())}catch(e){}
        const code=gistCode();let gid="";try{gid=localStorage.getItem("etl_gist")||""}catch(e){}
        if(gid){await gh("PATCH",{files:{"entre-les-lignes.txt":{content:code}}},gid);log("✓ Gist mis à jour ("+gid+")")}
        else{const g=await gh("POST",{description:"Entre les lignes — sauvegarde",public:false,files:{"entre-les-lignes.txt":{content:code}}});try{localStorage.setItem("etl_gist",g.id)}catch(e){}log("✓ Gist créé : "+g.id)}
        log("Sauvegarde envoyée ("+Math.round(code.length/1024*10)/10+" Ko).");}
      catch(e){log("✋ "+e.message)}
      btn.disabled=false;btn.textContent="☁️ Envoyer la sauvegarde de partie"};
    q("#gcDn").onclick=async()=>{
      const btn=q("#gcDn");btn.disabled=true;btn.textContent="⏳ Récupération…";q("#gcLog").textContent="";
      try{
        let gid="";try{gid=localStorage.getItem("etl_gist")||""}catch(e){}
        if(!gid)throw Error("Aucun Gist connu sur cet appareil.");
        const g=await gh("GET",null,gid);const f=g.files&&g.files["entre-les-lignes.txt"];if(!f)throw Error("Gist vide.");
        const d=JSON.parse(decodeURIComponent(escape(atob(f.content.trim()))));
        Object.keys(d).forEach(k=>{try{localStorage.setItem(k,d[k])}catch(e){}});
        log("✓ Sauvegarde récupérée ("+Object.keys(d).length+" clés) — rechargement…");
        setTimeout(()=>location.reload(),900);}
      catch(e){log("✋ "+e.message);btn.disabled=false;btn.textContent="⤓ Récupérer depuis le cloud"}};
  }
  /* publication */
  if(q("#etlGoCheck2"))q("#etlGoCheck2").onclick=()=>{lastCheck=validate();TAB="check";render()};
  if(q("#etlDo"))q("#etlDo").onclick=publish;
  function msg(t,err){const m=q("#etlEMsg");if(m){m.textContent=t;m.classList.toggle("err",!!err)}}
  function sMsg(t){const m=q("#etlSMsg");if(m)m.textContent=t}
}

/* petit toast atelier */
function toastAt(t){const d=document.createElement("div");d.textContent=t;d.style.cssText="position:fixed;bottom:70px;right:14px;z-index:99999;background:#182236;color:#e8eefb;border:1px solid #2c4a73;border-radius:10px;padding:10px 16px;font:13px system-ui;box-shadow:0 8px 30px #000a";document.body.append(d);setTimeout(()=>d.remove(),3200)}

/* ---------- init ---------- */
snapS=snapshot();
const dr=draftLoad();
if(dr&&dr!==snapS)setTimeout(()=>toastAt("Brouillon local détecté — restaure-le depuis le tableau de bord."),1500);
})();
