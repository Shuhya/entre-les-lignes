/// <reference path="../types.ts" />
/* ts/engine/16-sauvegarde.ts — IIFE sauvegarde/reprise + service worker + fin du fichier (section 16/16 de js/engine.js — étape 2 migration TS)
   Découpage de lecture SANS refactor : le code est identique au js servi.
   scripts/build-engine-from-ts.js concatène les sections dans l'ordre et doit
   retrouver js/engine.js octet par octet (branché dans validate.js → CI).
   Le typage progressif de ces sections viendra avec l'étape 3 (tsc en CI). */
/* [engine-section] */
min":"moins d'une minute")}
/* ---- audio ---- */
try{const v=JSON.parse(localStorage.getItem("vol"));if(v){VA=v[0];VS=v[1];VV=v[2]}}catch(e){}
function setV(){if(ag){ag.gain.value=VA;sg.gain.value=VS}try{localStorage.setItem("vol",JSON.stringify([VA,VS,VV]))}catch(e){}const sbE=$("sb");if(sbE)sbE.textContent=VA+VS+VV>0?"🔊":"🔇";const si=$("sbi");if(si)si.textContent=VA>0?"🔊":"🔇"}
let VA0=null;const togSnd=()=>{if(VA>0){VA0=VA;VA=0}else{VA=VA0||.8;VA0=null}setV()};
function unlock(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.connect(ac.destination);ag=ac.createGain();sg=ac.createGain();ag.connect(mg);sg.connect(mg);nz=ac.createBuffer(1,ac.sampleRate*15,ac.sampleRate);const d=nz.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;setV()}catch(e){ac=0}}if(ac&&ac.resume)ac.resume()}
function beep(f,d,v=.07,ty="sine"){if(!ac)return;try{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(sg);o.start();o.stop(t+d)}catch(e){}}
const rx=()=>[1319,1568,1976].forEach((f,i)=>setTimeout(()=>beep(f,.24,.05),i*95)),tx=()=>{beep(620,.07,.04);setTimeout(()=>beep(930,.1,.035),55)};
const R=(a,b)=>a+Math.random()*(b-a),Pk=a=>a[Math.random()*a.length|0];
function hit(f,d,v,ty="bandpass",a=.01,q=1){const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain(),t=ac.currentTime;s.buffer=nz;fl.type=ty;fl.frequency.value=f;fl.Q.value=q;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(ag);s.start(t,Math.random()*(nz.duration-d-1),d+.1)}
function tn(f,f2,d,v,a=.01){const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ag);o.start(t);o.stop(t+d)}
const steps=n=>{for(let i=0;i<n;i++)setTimeout(()=>hit(R(150,260),.09,R(.03,.06),"lowpass"),i*R(380,520))};
const VER="2.189";
/* ---- v2.85 : vrai téléphone = pas de nav du bas, sbar allégée (l'heure fiction reste) ---- */
function updMob(){try{document.body.classList.toggle("mob",!PC&&(typeof matchMedia==="function")&&matchMedia("(pointer:coarse)").matches)}catch(e){}}
updMob();
let THM="dark";try{THM=localStorage.getItem("etl_theme")||"dark"}catch(e){}console.log("Entre les lignes · v"+VER);
function ambBg(){try{const h=new Date().getHours();let a="#141d33",b2="#0a0d16",cl="ambD";
 if(h>=5&&h<9){a="#3a2438";b2="#1a1f3f";cl="ambA"}else if(h>=17&&h<21){a="#33222b";b2="#1f1a26";cl="ambC"}
 else if(h>=21||h<5){a="#101828";b2="#070b14";cl="ambN"}
 document.documentElement.className=cl;
 document.documentElement.style.setProperty("--ambA",a);document.documentElement.style.setProperty("--ambB",b2)}catch(e){}}
ambBg();setInterval(ambBg,18e5);
const AM={
gare:{b:["lowpass",130,.04],e:[[26000,()=>Pk([[784,587],[659,523,659],[880,660,784]]).forEach((f,i)=>setTimeout(()=>tn(f,f,R(1.6,2.4),.03,.03),i*750))],[4500,()=>steps(Math.round(R(3,6)))]]},
mer:{b:["lowpass",170,.06],e:[[6000,()=>hit(R(200,320),R(4,7),R(.08,.16),"lowpass",R(1.5,2.5))],[12000,()=>tn(R(1700,2100),R(800,1100),R(.3,.6),.02,.05)]]},
nuit:{b:["lowpass",110,.03],e:[[14000,()=>hit(R(180,300),R(3,5),.04,"lowpass",1.5)],[70000,()=>tn(750,950,3,.008,1)]]}};
AM.foret={b:["lowpass",300,.05],e:[[5200,()=>{const f=R(1800,2700),n=2+(Math.random()*3|0);for(let i=0;i<n;i++)setTimeout(()=>tn(f*R(.96,1.06),f*R(1.18,1.4),R(.07,.15),.035,.012),i*R(110,230))}],[13000,()=>tn(R(2400,3200),R(1400,1800),R(.25,.5),.018,.02)]]};
AM.aube=AM.foret;AM.carnet=AM.gare;
AM.cafe={b:["bandpass",520,.05,.8],e:[[9000,()=>hit(R(1800,2600),.05,R(.05,.1),"bandpass",.01,2)],[17000,()=>{tn(R(2400,3200),R(1200,1600),.08,.02,.03);setTimeout(()=>hit(R(1400,1900),.04,.05,"highpass",.005,1.5),R(120,400))}],[28000,()=>{const f=R(300,420),p=Pk([[f,f*1.19],[f*1.33,f],[f,f*1.5]]);p.forEach((x,i)=>setTimeout(()=>tn(x[0],x[1],R(.3,.5),.012,.01),i*R(180,320)))}]]};
AM.sombre={b:["lowpass",150,.04],e:[[22000,()=>hit(R(160,260),R(3,5),.035,"lowpass",1.4)],[55000,()=>tn(R(600,800),R(400,500),2.5,.006,.8)]]};
AM.appart={b:["lowpass",240,.035],e:[[9000,()=>hit(R(120,180),.22,R(.04,.08),"lowpass",1.2)],[26000,()=>{tn(R(1500,2100),R(900,1300),R(.3,.6),.02,.04)}],[47000,()=>{const f=R(70,90);tn(f,f*1.4,R(.8,1.6),.02,.3)}]]};
AM.quai9={b:["bandpass",320,.045,.6],e:[[14000,()=>hit(R(1500,2600),.14,R(.05,.11),"bandpass",.01,4)],[29000,()=>hit(R(300,500),R(2,4),.06,"lowpass",1.6)],[61000,()=>tn(R(160,210),R(120,150),R(1.2,2.2),.03,.4)],[88000,()=>{tn(R(540,640),R(760,860),1.8,.014,.5);setTimeout(()=>tn(R(760,860),R(540,620),1.6,.012,.5),1900)}]]};
AM.ville={b:["lowpass",160,.04],e:[[18000,()=>hit(R(90,140),R(3,6),.05,"lowpass",1.2)],[37000,()=>{const f=R(600,720);tn(f,f*1.35,2.6,.012,.9);setTimeout(()=>tn(f*1.35,f,2.4,.01,.9),2800)}],[73000,()=>hit(R(2400,3400),.09,R(.02,.04),"highpass",.01,2)]]};
const AUTOAMB={cafe:"cafe",bureau:"sombre",archives:"sombre",grange:"nuit",ormes:"nuit",champ:"nuit",voiture:"nuit",train:"gare",vaubris:"ville",appart:"appart",quai9:"quai9"};
let RB=null,rb=null,rsrc=[],ambId=0;
// b64: audio pluie désormais chargé depuis assets/audio/pluie.mp3
const rainBuf=()=>RB||(RB=fetch("assets/audio/pluie.mp3").then(r=>r.arrayBuffer()).then(ab=>new Promise(res=>{try{ac.decodeAudioData(ab,res,()=>res(null))}catch(e){res(null)}})).catch(()=>{RB=null;return null}));
async function startRain(id,g){const buf=await rainBuf();if(!buf||id!=ambId)return;
 rb=ac.createGain();rb.gain.value=0;rb.connect(ag);rb.gain.setTargetAtTime(g||.55,ac.currentTime,1.2);
 [[1,0],[1.04,.43]].forEach(([r,o])=>{const s=ac.createBufferSource(),g=ac.createGain();s.buffer=buf;s.loop=true;s.playbackRate.value=r;g.gain.value=.7;s.connect(g);g.connect(rb);s.start(0,buf.duration*o);rsrc.push(s)})}
function stopRain(){if(rb){const s=rsrc;rb.gain.setTargetAtTime(0,ac.currentTime,.7);setTimeout(()=>{s.forEach(x=>{try{x.stop()}catch(e){}})},3500);rb=null;rsrc=[]}}
let ambCur=null;
function amb(k){if(!ac)return;if(k&&k===ambCur&&(bs||rb))return;ambCur=k;ambId++;tm.forEach(clearTimeout);tm=[];stopRain();if(bs){const c=bs;c.g.gain.setTargetAtTime(0,ac.currentTime,.6);setTimeout(()=>{try{c.s.stop()}catch(e){}},3000);bs=null}
if(k=="pluie"){startRain(ambId);return}
if(k=="aube"){startRain(ambId,.22);AM.foret.e.forEach(([ms,fn])=>{const go=()=>{fn();tm.push(setTimeout(go,ms*R(.4,1.6)))};tm.push(setTimeout(go,ms*R(.1,.8)))});return}
const a=AM[k];if(!a)return;const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),fr=a.b[1],bg=a.b[2];s.buffer=nz;s.loop=true;f.type=a.b[0];f.frequency.value=fr;f.Q.value=a.b[3]||1;g.gain.value=0;s.connect(f);f.connect(g);g.connect(ag);s.start(0,Math.random()*5);bs={s,g};
const dr=()=>{const t=ac.currentTime;g.gain.setTargetAtTime(bg*R(.7,1.25),t,2.5);f.frequency.setTargetAtTime(fr*R(.85,1.2),t,2.5);tm.push(setTimeout(dr,R(3000,8000)))};dr();
a.e.forEach(([ms,fn])=>{const go=()=>{fn();tm.push(setTimeout(go,ms*R(.4,1.6)))};tm.push(setTimeout(go,ms*R(.1,.8)))})}
/* Mode smileys, désactivable pour les récits sérieux */
let emojiMode=true;try{emojiMode=localStorage.getItem("etl_emoji")!=="off"}catch(e){}
let SPD=1;try{SPD=+localStorage.getItem("etl_spd")||1}catch(e){}
function emojiClean(x){return emojiMode?x:x.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,"")}
 /* ---- jeu ---- */
function add(c,x){const d=document.createElement("div");d.className="b "+c;d.textContent=x;$("chat").append(d);$("chat").scrollTop=1e9;return d}
function ty(on){let e=$("ty");if(on&&!e){e=add("h dots","");e.id="ty";e.innerHTML="<span></span><span></span><span></span>"}else if(!on&&e)e.remove();$("chat").scrollTop=1e9}
function lab(c,x){const d=document.createElement("div");d.className=c;d.textContent=x;$("chat").append(d);$("chat").scrollTop=1e9;return d}
function rm(){const e=$("rcp");if(e)e.remove()}
function rc(x){rm();lab("ts r",x).id="rcp"}
const nodeBackgrounds=(()=>{try{return JSON.parse(localStorage.getItem("etl_node_backgrounds")||"{}")}catch(e){return {}}})();
let rfC=null,rfR=null;
function fxRain(on){
 if(!on){if(rfC){try{cancelAnimationFrame(rfR)}catch(e){}try{rfC.remove()}catch(e){}rfC=null}return}
 const RM=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}})();
 if(RM||typeof requestAnimationFrame!=="function")return;
 if(rfC)return;
 const o=document.createElement("canvas");o.id="fxRain";try{$("app").append(o)}catch(e){rfC=null;return}rfC=o;
 const x=o.getContext?o.getContext("2d"):null;if(!x)return;
 const fit=()=>{try{o.width=o.offsetWidth||360;o.height=o.offsetHeight||600}catch(e){}};
 fit();
 const D=Array.from({length:70},()=>({x:Math.random(),y:Math.random(),l:R(.04,.12),v:R(.45,1.1)}));
 const dr=()=>{if(!rfC||rfC!==o)return;fit();const W=o.width,H=o.height;x.clearRect(0,0,W,H);x.strokeStyle="rgba(190,215,255,.28)";x.lineWidth=1;
  D.forEach(d=>{d.y+=d.v/H*1.6;if(d.y>1.05){d.y=-.05;d.x=Math.random()}x.beginPath();x.moveTo(d.x*W,d.y*H);x.lineTo((d.x-.004)*W,(d.y+d.l)*H);x.stroke()});
  rfR=requestAnimationFrame(dr)};
 dr()}
function scene(k,nodeId){const u=(nodeId&&nodeBackgrounds[nodeId])||IMG[k];$("app").style.backgroundImage=u?"linear-gradient(#0002,#0004),url("+u+")":"";try{fxRain(false)}catch(e){}amb(k)}
async function rdOk(){const b=document.createElement("button");b.className="rdOk";b.textContent="✓ J'ai tout lu";$("ch").append(b);await new Promise(r2=>{b.onclick=()=>{try{beep(660,.05,.06)}catch(e){}b.remove();r2()}})}
const noRubber=el=>{try{setTimeout(()=>{if(el&&el.scrollHeight<=el.clientHeight+8)el.style.overflowY="hidden"},0)}catch(e){}};
async function play(id,r=run){
 const n=S[id];if(r!=run)return;
 if(SS&&SS.id==="h"&&PART[id]){const pi={I:0,II:1,III:2,IV:3,V:4,VI:5}[PART[id]];if(pi!=null&&pi>SC){SC=pi;try{PG.c=Math.max(PG.c||0,pi+1)}catch(e){}}}
 CHP=(SS&&SS.id==="h"&&PART[id])?PART[id]:"";
 if(SS&&SS.id==="h"&&PART[id]){try{const pn={I:1,II:2,III:3,IV:4,V:5,VI:6}[PART[id]];const cu=+localStorage.getItem("etl_part_"+SS.id)||0;if(pn&&pn>cu)localStorage.setItem("etl_part_"+SS.id,pn)}catch(e){}}
 const abn=$("apps");if(abn)abn.style.display="none";
 if(n.j)return play(n.j(st),r);
 if(n.w){scene(n.w,id);try{const sm=JSON.parse(localStorage.getItem("etl_node_sounds")||"{}");if(sm[id])amb(sm[id]);else if(AUTOAMB[n.w])amb(AUTOAMB[n.w])}catch(e){}}
 if(n.pro&&!PROD)await proCards(n.pro);
 if(n.out)await awayOv(n.out.map(gf));
 if(n.tel){const T=n.tel;await new Promise(q=>telOv(T,q))}
 if(n.lk&&!st["lkw_"+id]){st["lkw_"+id]=1;try{if(n.lk.t){clkSet(n.lk.t);$("clk").textContent=n.lk.t}}catch(e){}await lockWake(n.lk);if(r!=run)return}
 if(n.app){const tA=n.app,tN=n.nm||"",oC=CAPP,oN=CNM,ck=oC+"|"+oN,nk=tA+"|"+tN;
  if(tA!==oC){APPH[ck]={c:$("chat").innerHTML,h:$("ch").innerHTML};if(n.noS){applyApp(n)}else await appSwitch(n)}
  else if(tN!==oN)APPH[ck]={c:$("chat").innerHTML,h:$("ch").innerHTML};
  applyApp(n);
  if(tA!==oC||tN!==oN){const th=APPH[nk];$("chat").innerHTML=(th&&th.c)||"";$("ch").innerHTML=(th&&th.h)||""}
  if(!THR[tA])THR[tA]=[];const lbl=tN||tA;if(!THR[tA].includes(lbl))THR[tA].push(lbl)}
 if(n.call&&!st["cal_"+id]){if(n.inc&&!st["inc_"+id]&&!st.recall){st["inc_"+id]=1;const ic=await new Promise(q=>incCallOv(n,q));if(ic==="decline"&&S[n.dec])return play(n.dec,r)}const hr=await new Promise(q=>callOv(n.call,q));st["cal_"+id]=1;if(hr==="hangup"&&S[n.h])return play(n.h,r)}
 if(n.card&&!st["card_"+id]){st["card_"+id]=1;const hh=String(n.card[1]||"").match(/^(\d{1,2})h(\d{2})/);if(hh){const hm=hh[1].padStart(2,"0")+":"+hh[2];try{clkSet(hm)}catch(e){}$("clk").textContent=hm}await proCards(n.card,{label:n.cardLab||"Prologue",lastBtn:"Continuer"});if(r!=run)return}
 if(n.k){st.e=n.k;try{const q=JSON.parse(localStorage.getItem("fe"+SS.id)||"[]");const fn0=n.f||n.k;if(!q.includes(fn0)){q.push(fn0);localStorage.setItem("fe"+SS.id,JSON.stringify(q))}}catch(e){}}
 let insta=(n.lk&&n.lk.txt&&!/Nouveau message/.test(n.lk.txt))?1:(window.__noan?1:0);try{window.__noan=0}catch(e){}
 const MG=[];{let ag=null;for(const it of(n.m||[])){STATS.msgs++;if(it&&it[0]==="a"){(ag=ag||[]).push(String(it[1]).replace(/%N%/g,(st&&st.pname)||"toi"))}else{if(ag){MG.push(["a",ag]);ag=null}MG.push(it)}}if(ag)MG.push(["a",ag])}
 for(let mi=0;mi<MG.length;mi++){const[w,x0]=MG[mi];const x=Array.isArray(x0)?x0:String(x0).replace(/%N%/g,(st&&st.pname)||"toi");if(w!=="a")veil(0);
  if(w=="h"){if(insta>0){insta--;$("st").textContent=CAPP;rx();rm();addH(emojiClean(/coéquipier|espionné/.test(x)?gf(x):x));await sl(400)}else{$("st").textContent="écrit…";ty(1);await sl(Math.min(4200,1050+x.length*44)/SPD);ty(0);if(r!=run)return;$("st").textContent=CAPP;rx();rm();addH(emojiClean(/coéquipier|espionné/.test(x)?gf(x):x));await sl(350)}}
  else if(w=="s"){lab("sys",emojiClean("ℹ "+x));await sl(Math.min(4200,900+x.length*30)/SPD)}else if(w=="m"){tx();add("m",emojiClean(x));await sl(Math.min(2600,650+x.length*24)/SPD)}else if(w=="pm"){tx();const d=document.createElement("div");d.className="b m pm";const im=document.createElement("img");const arr=Array.isArray(x);if(arr){im.src=(st&&st.pf)?x[1]:x[0];im.onerror=function(){im.onerror=null;im.src=x[0]}}else im.src=x;im.alt="Photo envoy\u00e9e";d.append(im);$("chat").append(d);$("chat").scrollTop=1e9;await sl(1100)}else if(w=="p"){try{beep(1568,.05,.04);setTimeout(()=>beep(2093,.08,.035),85)}catch(e){}const d=document.createElement("div");d.className="b h pm";const im=document.createElement("img");const arr=Array.isArray(x);if(arr){im.src=(st&&st.pf)?x[1]:x[0];im.onerror=function(){im.onerror=null;im.src=x[0]}}else im.src=x;im.alt="Photo reçue";d.append(im);$("chat").append(d);$("chat").scrollTop=1e9;await sl(1100)}else if(w=="x"){$("nm").textContent=SS.n;setAv(SS.n[0]);st.named=true;try{localStorage.setItem("etl_name_"+SS.id,SS.n)}catch(e){}await sl(300)}else if(w==="a"){if(mi>0){await rdOk();if(r!=run)return}await awayOv((Array.isArray(x)?x:[x]).map(gf),"Continuer");if(r!=run)return}else{const q=x.match(/^(\d{1,2})h(\d{2})/);if(q){SK=1;const hm=q[1].padStart(2,"0")+":"+q[2];clkSet(hm);$("clk").textContent=hm;lab("ts","Aujourd'hui "+hm)}add("n",gf(x));await sl(Math.min(7000,900+x.length*34)/SPD)}
  if(r!=run)return}
 if(n.endc){const ec=typeof n.endc==="function"?n.endc(st):n.endc;const pars=String(ec).split("\n").filter(Boolean).map(gf);await proCards(["Fin du chapitre"].concat(pars),{label:"Chapitre 1",lastBtn:"Terminer le chapitre"});if(r!=run)return;return fin([n.k||"Fin",pars.join("\n")||""],1)}
 if(n.scr){const sc=await scrOv(n);if(sc)return}
 clkPlan(n);
 if(n.e)return fin(n.e);
 if(n.x){const lm=(n.m||[]).slice(-1)[0];if(lm&&lm[0]!=="a")await rdOk();if(r!=run)return;return play(n.x,r)}if(!(n.c&&n.c.length))return fin([n.k||"Fin",""]);
 if(!n.vw&&!n.fx)veil(0);const c=$("ch");c.innerHTML="";
 if(n.c&&n.c.length)st["cpl_"+id]=1;
 noteTick();
 mkCh(id);
 if(n.fx)filesOv(n);else if(n.vw)vwOv(n);
 $("fl").textContent=(n.c||[]).length?"Choisis une réponse ↑":"Fin de ce segment.";$("chat").scrollTop=1e9}
/* ---- Apps natives : explorateur de fichiers & viewers plein ecran ---- */
function fxClear(){document.querySelectorAll(".fxOv").forEach(x=>x.remove())}
function fxShell(title,innerHTML){
 const o=document.createElement("div");o.className="fxOv";
 o.innerHTML='<div class="fxTop"><div class="fxT">'+title+'</div><button class="fxX" aria-label="Fermer">✕</button></div>'+innerHTML;
 o.querySelector(".fxX").onclick=()=>o.remove();
 $("app").append(o);return o}
function fxBack(o,label,fn){const b=document.createElement("button");b.className="fxFoot";b.innerHTML='‹ '+(label||"Retour");b.onclick=fn;o.append(b);return b}
function filesOv(n){
 fxClear();
 const o=fxShell('📁 '+(n.nm||"Fichiers"),'<div class="fxList"></div>');
 const L=o.querySelector(".fxList");
 (n.fx||[]).forEach(it=>{const ic=it[0],nm=it[1],meta=it[2],act=it[3];
  const r=document.createElement("button");r.className="fxRow";
  r.innerHTML='<span class="fxIc">'+ic+'</span><span class="fxNm"><b>'+nm+'</b><small>'+meta+'</small></span><span class="fxGo">›</span>';
  r.onclick=()=>{
   if(typeof act==="number"){fxClear();const b=$("ch").children[act];if(b)b.click();return}
   if(act==="png"){fxImg(nm);return}
   fxLock(nm)};
  L.append(r)});
 if(typeof n.fxF==="number"){fxBack(o,(n.c&&n.c[n.fxF]&&n.c[n.fxF][0])||"Ne rien ouvrir",()=>{fxClear();const b=$("ch").children[n.fxF];if(b)b.click()})}}
function fxLock(nm){
 fxClear();
 const o=fxShell('🔒 '+nm,'<div class="fxBody"><div class="fxLockIc">🔒</div><p class="fxBig">chimere_v3.gpg</p><p class="fxDim">Chiffré 4096 bits. Clé introuvable.</p><p class="fxDim">Le fichier reste muré. Il ne s\u2019ouvrira pas.</p></div>');
 fxBack(o,"Retour aux fichiers",()=>filesOv(S[nodeNow]||{nm:"Fichiers",fx:[]}));
 o.querySelector(".fxX").onclick=()=>filesOv(S[nodeNow]||{nm:"Fichiers",fx:[]})}
function fxImg(nm){
 fxClear();
 const o=fxShell('🗺 '+nm,'<div class="fxBody" style="padding:0"><div class="fxImg"></div></div>');
 const im=o.querySelector(".fxImg");
 im.style.backgroundImage=IMG.quai9?'url('+IMG.quai9+')':'';
 im.innerHTML='<span>Échelle ouest, quai 9. Le stylo rouge cerne une porte de service, flèche vers le hangar 44.</span>';
 fxBack(o,"Retour aux fichiers",()=>filesOv(S[nodeNow]||{nm:"Fichiers",fx:[]}));
 o.querySelector(".fxX").onclick=()=>filesOv(S[nodeNow]||{nm:"Fichiers",fx:[]})}
let hz=null;
function hissOn(){if(!ac)return;try{beep(260,.06,.05,"square");const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),t=ac.currentTime;s.buffer=nz;s.loop=true;f.type="bandpass";f.frequency.value=3200;f.Q.value=.6;g.gain.value=0;s.connect(f);f.connect(g);g.connect(ag);s.start(0,Math.random()*5);g.gain.setTargetAtTime(.05,t,.8);hz={s,g}}catch(e){}}
function hissOff(){if(hz&&ac){try{hz.g.gain.setTargetAtTime(0,ac.currentTime,.4);const h=hz;setTimeout(()=>{try{h.s.stop()}catch(e){}},1500)}catch(e){}}hz=null}
function vwOv(n){
 fxClear();
 const kind=n.vw[0],nm=n.vw[1],lines=n.vw[2];
 if(kind==="txt"){
  const o=fxShell('📄 '+nm,'<div class="fxPaper"></div>');
  const P=o.querySelector(".fxPaper");
  lines.forEach(function(ln){const p=document.createElement("p");p.className="vwL "+(ln[0]||"n");p.textContent=ln[1];P.append(p)});
  const nb=document.createElement("div");nb.className="vwBar";nb.textContent="Bas de page, encadré deux fois au stylo rouge";P.append(nb);
  fxBack(o,n.vwBack?"‹ Revenir à l'archive":"✕ Refermer",function(){if(n.vwBack){veil(1);o.remove();const i2=(n.c||[]).findIndex(cc=>cc&&cc[1]===n.vwBack);if(i2>=0){const bb=$("ch").children[i2];if(bb){bb.click();return}}}o.remove()});if(n.vwBack){const xx=o.querySelector(".fxX");if(xx)xx.onclick=()=>{const fb2=o.querySelector(".fxFoot");if(fb2)fb2.click()}}
 }else if(kind==="wav"){
  const o=fxShell('🎧 '+nm,'<div class="fxBody vwPlay"><div class="wavArt">🎧</div><p class="fxBig">'+nm+'</p><p class="fxDim">0:47 · jamais écouté</p><div class="wavBar"><i></i></div><button class="wavBtn">▶ Lecture</button><div class="wavTx"></div></div>');
  const bar=o.querySelector(".wavBar i"),tx=o.querySelector(".wavTx"),btn=o.querySelector(".wavBtn");
  let played=false;
  btn.onclick=async function(){if(played)return;played=true;try{hissOn()}catch(e2){}btn.textContent="▮▮ Lecture en cours";btn.disabled=true;
   const total=47,dur=13000,t0=Date.now();
   const tick=setInterval(function(){if(!o.isConnected){clearInterval(tick);try{hissOff()}catch(e3){}return}const p=Math.min(1,(Date.now()-t0)/dur);bar.style.width=(p*100)+"%";const d=o.querySelector(".fxDim");if(d)d.textContent="0:"+String(Math.floor(p*total)).padStart(2,"0")+" sur 0:47"},120);
   for(const ln of lines){const p=document.createElement("p");p.className="vwL "+(ln[0]||"q");p.textContent=ln[1];tx.append(p);try{if(ln[0]!=="i")callSpeak(ln[1],"Nils")}catch(e2){}await sl(dur/lines.length)}
   clearInterval(tick);bar.style.width="100%";const d=o.querySelector(".fxDim");if(d)d.textContent="0:47 · fin de l\u2019enregistrement";btn.textContent="▶ Écouté";try{hissOff()}catch(e2){}};
  fxBack(o,n.vwBack?"‹ Revenir à l'archive":"✕ Refermer",function(){if(n.vwBack){veil(1);o.remove();const i2=(n.c||[]).findIndex(cc=>cc&&cc[1]===n.vwBack);if(i2>=0){const bb=$("ch").children[i2];if(bb){bb.click();return}}}o.remove()});if(n.vwBack){const xx=o.querySelector(".fxX");if(xx)xx.onclick=()=>{const fb2=o.querySelector(".fxFoot");if(fb2)fb2.click()}}
 }}

async function proCards(P,opts){const pars=P.slice(1);if(!pars.length)return;const LAB=(opts&&opts.label)||"Prologue",LB=(opts&&opts.lastBtn)||"Reprendre le t\u00E9l\u00E9phone";
 const o=document.createElement("div");o.className="proOv";$("app").append(o);
 await new Promise(done=>{
  const end=()=>{veil(1);o.remove();done()};
  const skip=document.createElement("button");skip.className="proSkip";skip.textContent="Passer \u203a";skip.onclick=e=>{e.stopPropagation();end()};o.append(skip);
  const sb=document.createElement("div");sb.className="proSbar";try{const d=new Date();sb.innerHTML='<span>'+d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})+'</span><i>5G</i><i>78%</i>'}catch(e){}
  let timer=null,typing=false;
  const finish=el=>{clearTimeout(timer);timer=null;typing=false;if(el&&el.dataset.full!==undefined){el.textContent=el.dataset.full;el.classList.remove("tw")}};
  const type=(el,txt,fin)=>{typing=true;el.classList.add("tw");el.textContent="";let i2=0;el.dataset.full=txt;
   const step=()=>{if(!typing){el.textContent=el.dataset.full;el.classList.remove("tw");fin&&fin();return}
    el.textContent=txt.slice(0,++i2);if(i2%4===0)beep(R(1900,2400),.014,.016,"square");
    if(i2>=txt.length){typing=false;el.classList.remove("tw");fin&&fin();return}
    timer=setTimeout(step,Math.max(10,27/SPD))};
   step()};
  const show=i=>{const cd=document.createElement("div");cd.className="proCard";
   const k=document.createElement("div");k.className="proK";k.textContent=LAB+" \u00B7 "+(i+1)+" / "+pars.length;cd.append(k);
   let titleEl=null;if(i===0){titleEl=document.createElement("h2");cd.append(titleEl)}
   const t=document.createElement("p");cd.append(t);
   const d=document.createElement("div");d.className="proDots";if(pars.length>1){pars.forEach((_,j)=>{const e=document.createElement("i");if(j===i)e.className="on";d.append(e)});cd.append(d)}
   const b=document.createElement("button");b.className="proBtn";b.hidden=true;b.textContent=i===pars.length-1?LB:"Continuer";
   cd.append(b);
   cd.addEventListener("pointerdown",ev=>{if(ev.target&&ev.target.closest&&ev.target.closest("button"))return;
    if(typing){ev.preventDefault();finish(t);if(titleEl)finish(titleEl);b.hidden=false}});
   b.onclick=ev=>{ev.stopPropagation();cd.remove();if(i+1<pars.length)show(i+1);else end()};
   o.replaceChildren(skip,sb,cd);
   if(opts&&opts.instant){t.textContent=pars[i];if(titleEl)titleEl.textContent=P[0];b.hidden=false}else{const goPar=()=>type(t,pars[i],()=>{b.hidden=false});
   if(titleEl)type(titleEl,P[0],()=>goPar());else goPar()}};
  show(0)})}
function transferOv(){
 const KEYS=k=>k==="etl_resume_v4"||/^pg/.test(k)||/^fe/.test(k)||/^etl_name_/.test(k)||/^etl_part_/.test(k)||k==="etl_hint"||k==="etl_emoji"||k==="etl_tts";
 let data={};try{Object.keys(localStorage).filter(KEYS).forEach(k=>data[k]=localStorage.getItem(k))}catch(e){}
 const code=btoa(unescape(encodeURIComponent(JSON.stringify(data))));
 const o=document.createElement("div");o.className="rsOv";
 const c=document.createElement("div");c.className="card";
 const h=document.createElement("h2");h.textContent="Transf\u00E9rer ma partie";c.append(h);
 const p1=document.createElement("p");p1.className="trP";p1.textContent="Copie ce code, puis colle-le sur ton autre appareil (R\u00E9glages \u2192 Transf\u00E9rer).";c.append(p1);
 const ta=document.createElement("textarea");ta.className="trTa";ta.readOnly=true;ta.value=code;ta.onclick=()=>{ta.select()};c.append(ta);
 const cp=document.createElement("button");cp.className="trBtn";cp.textContent="\u29B9 Copier le code";
 cp.onclick=()=>{try{navigator.clipboard.writeText(code);cp.textContent="\u2713 Copi\u00E9"}catch(e){ta.select();cp.textContent="S\u00E9lectionne et copie manuellement"}};
 c.append(cp);
 const sep=document.createElement("div");sep.className="trSep";sep.textContent="ou, sur cet appareil :";c.append(sep);
 const ta2=document.createElement("textarea");ta2.className="trTa";ta2.placeholder="Colle un code de partie ici";c.append(ta2);
 const ld=document.createElement("button");ld.className="trBtn ld";ld.textContent="\u21BB Charger ce code";
 ld.onclick=()=>loadCode(ta2.value.trim());
 c.append(ld);
 const fs2=document.createElement("button");fs2.className="trBtn";fs2.textContent="\uD83D\uDCBE Exporter un fichier de sauvegarde";
 fs2.onclick=()=>{const blob=new Blob([code],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="entre-les-lignes-partie.txt";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
 c.append(fs2);
 const fi=document.createElement("input");fi.type="file";fi.accept=".txt,.json";fi.style.display="none";
 fi.onchange=()=>{const f=fi.files&&fi.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>loadCode(String(rd.result));rd.readAsText(f)};
 const fd=document.createElement("button");fd.className="trBtn ld";fd.textContent="\uD83D\uDCC2 Charger un fichier de sauvegarde";
 fd.onclick=()=>fi.click();
 c.append(fd);c.append(fi);
 function loadCode(txt){try{const d=JSON.parse(decodeURIComponent(escape(atob(txt.trim()))));
   Object.keys(d).forEach(k=>{try{localStorage.setItem(k,d[k])}catch(e){}});
   o.remove();toast("Partie charg\u00E9e \u2014 rechargement\u2026");setTimeout(()=>location.reload(),900)}
  catch(e){toast("Code invalide \u2014 v\u00E9rifie le collage.")}}
 const b=document.createElement("button");b.className="bk";b.innerHTML="<h3>\u2039 Retour</h3><p>Annuler</p>";b.onclick=()=>o.remove();c.append(b);
 o.append(c);document.body.append(o);addBack(c);
 o.addEventListener("click",e=>{if(e.target===o)o.remove()});
}
function ov(t,x,b,f,b2,f2){$("ot").textContent=t;$("ox").textContent=x;$("ob").textContent=b;$("ob").onclick=()=>{$("ov").hidden=true;f()};$("ob2").hidden=!b2;if(b2){$("ob2").textContent=b2;$("ob2").onclick=()=>{$("ov").hidden=true;f2()}}$("ov").hidden=false;try{veil(0)}catch(e2){}}
function telOv(T,done){const o=document.createElement("div");o.id="telOv";
 const ph=document.createElement("div");ph.className="lsp";
 ph.innerHTML='<div class="lspTop"></div><div class="lspClock">'+T[0]+'</div><div class="lspSub">'+T[1]+'</div>'
 +'<div class="lspNotif"><i>💬</i><div><div class="lspNh"><b>'+T[2]+'</b><small>'+T[0]+'</small></div><p>'+T[3]+'</p></div></div>'
 +'<div class="lspBar"></div>';
 const cap=document.createElement("p");cap.className="lspCap";cap.textContent="Ton téléphone à toi. Pas celui de Léo. Il vient de vibrer dans ta poche.";
 const b=document.createElement("button");b.textContent="Déverrouiller";b.onclick=()=>{o.remove();done()};
 o.append(ph,cap,b);document.body.append(o);
 beep(1319,.09,.05);setTimeout(()=>beep(1760,.11,.05),150);setTimeout(()=>beep(1760,.11,.04),900)}
const TTSOK=typeof speechSynthesis!=="undefined";
let TTS_ON=true;try{TTS_ON=localStorage.getItem("etl_tts")!=="off"}catch(e){}
const CALL_VOICE={Cora:{pitch:1.1,rate:1},Yasmine:{pitch:1.22,rate:1.03},Nils:{pitch:.82,rate:.9}};
function pickFr(){const vs=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang));return vs.find(v=>/google/i.test(v.name))||vs.find(v=>/am\u00E9lie|audrey|marie|celine|julie|female|femme/i.test(v.name))||vs[0]||null}
function callSpeak(txt,nm){if(!TTSOK||!TTS_ON||!txt)return;
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);
 const cfg=CALL_VOICE[nm]||{pitch:1,rate:1};u.pitch=cfg.pitch;u.rate=cfg.rate;u.volume=Math.max(.2,Math.min(1,VS||1));
 const v=pickFr();if(v)u.voice=v;u.lang="fr-FR";speechSynthesis.speak(u)}catch(e){}}
function callSpeakStop(){if(TTSOK){try{speechSynthesis.cancel()}catch(e){}}}
function incCallOv(n,done){const nm=(n.call&&n.call[0])||"",sub=(n.call&&n.call[1])||"Appel";
 const o=document.createElement("div");o.id="incOv";
 const av=document.createElement("div");av.className="calAv incAv";
 const ph=avOf(nm);if(ph){av.style.backgroundImage='url('+ph+')'}else av.textContent="\u{1F464}";
 const tb=document.createElement("div");tb.className="incTb";const ne=document.createElement("b");ne.textContent=nm;const se=document.createElement("small");se.textContent=sub+" · appel entrant…";tb.append(ne,se);
 const bt=document.createElement("div");bt.className="incBtns";
 const dec=document.createElement("button");dec.className="incDec";dec.innerHTML='<i>\u{1F4F5}</i>';
 const acc=document.createElement("button");acc.className="incAcc";acc.innerHTML='<i>\u{1F4DE}</i>';
 bt.append(dec,acc);o.append(av,tb,bt);
 $("app").append(o);
 let rg=null;try{rg=setInterval(()=>{beep(880,.09,.05);setTimeout(()=>beep(1175,.12,.045),140)},1500);beep(880,.09,.05);setTimeout(()=>beep(1175,.12,.045),140)}catch(e){}
 const end=v=>{if(rg)clearInterval(rg);o.remove();done(v)};
 dec.onclick=()=>end("decline");acc.onclick=()=>end("accept")}
function callOv(T,done){const nm=T[0]||"",sub=T[1]||"Appel",lines=T[2]||[];let vo=null;if(typeof VOICES!=="undefined"&&VOICES[nm]){try{vo=new Audio(VOICES[nm]);vo.loop=true;vo.volume=.9;const p=vo.play();if(p&&p.catch)p.catch(()=>{})}catch(e){vo=null}}
 const o=document.createElement("div");o.id="calOv";
 const hd=document.createElement("div");hd.className="calHd";
 const av=document.createElement("div");av.className="calAv";
 const ph=avOf(nm);if(ph){av.style.backgroundImage='url('+ph+')'}else av.textContent="\u{1F464}";
 const tb=document.createElement("div");const ne=document.createElement("b");ne.textContent=nm;const se=document.createElement("small");se.textContent=sub;tb.append(ne,se);
 hd.append(av,tb);o.append(hd);
 const tr=document.createElement("div");tr.className="calTr";o.append(tr);
 const hint=document.createElement("div");hint.className="calHint";hint.textContent="\u26A0 Raccrocher est possible \u2014 mais ce ne sera pas sans cons\u00E9quences.";hint.hidden=true;o.append(hint);
 const eb=document.createElement("button");eb.className="calEnd";eb.innerHTML='<i>\u{1F4DE}</i><small>Raccrocher</small>';eb.hidden=true;o.append(eb);
 let inChoice=false;
 const stopV=()=>{if(vo){try{vo.pause();vo.currentTime=0}catch(e){}vo=null}};
 $("app").append(o);
 beep(880,.09,.05);setTimeout(()=>beep(1175,.12,.045),110);
 let q=lines.slice(),muted=false;
 const mb=document.createElement("button");mb.className="calMute";mb.textContent="🔊";mb.onclick=()=>{muted=!muted;mb.textContent=muted?"🔇":"🔊";if(muted){try{callSpeakStop()}catch(e){}}};o.append(mb);
 const put=(L,raw)=>{const d=document.createElement("div");d.className="calL "+(L[0]===1?"them":L[0]===2?"me":"info");if(raw)d.textContent=L[1];tr.append(d);tr.scrollTop=1e9;return d};
 const typeIn=(d,txt,cb)=>{let i2=0;try{const iv=setInterval(()=>{i2+=2;d.textContent=txt.slice(0,i2);tr.scrollTop=1e9;if(i2>=txt.length){clearInterval(iv);cb()}},Math.max(8,12/SPD))}catch(e){d.textContent=txt;cb()}};
 const next=()=>{if(!q.length){inChoice=false;hint.hidden=true;eb.hidden=false;return}
  const L=q.shift();
  if(L[0]===2&&Array.isArray(L[1])){
   const bx=document.createElement("div");bx.className="calCh";
   inChoice=true;eb.hidden=false;hint.hidden=false;
   L[1].forEach(opt=>{const lab=Array.isArray(opt)?opt[0]:opt;const ex=Array.isArray(opt)?opt[1]:null;const lab2=gf(lab);
    const b=document.createElement("button");b.textContent=lab2;
    b.onclick=()=>{bx.remove();inChoice=false;eb.hidden=true;hint.hidden=true;put([2,lab2],1);tx();if(ex&&ex.length)q.unshift(...ex);setTimeout(next,900/SPD)};bx.append(b)});
   tr.append(bx);tr.scrollTop=1e9;return}
  const est=Math.max(700,(String(L[1]).split(/\s+/).length*310)+450)/SPD;
  const d=put(L,0);
  const LT=gf(L[1]);
  if(L[0]===1){rx();if(!muted)callSpeak(LT,nm)}
  typeIn(d,LT,()=>setTimeout(next,Math.max(300,est-1200)/SPD))};
 setTimeout(next,700/SPD);
 eb.onclick=()=>{callSpeakStop();veil(1);o.remove();stopV();done(inChoice?"hangup":undefined)}}
function endsList(s){const seen={},q=[],out=[];(s.ch||[]).forEach(h=>{if(h[1])q.push(h[1])});
 const FL=["jea","aveu","malik","bloq"];
 while(q.length){const id=q.shift();if(!S[id]||seen[id])continue;seen[id]=1;const n=S[id];
  const t=n.f||(n.e&&n.e[0])||n.k;if(t&&!out.includes(t))out.push(t);
  (n.c||[]).forEach(c2=>{if(c2[1])q.push(c2[1])});if(typeof n.x==="string")q.push(n.x);
  if(typeof n.j==="function"){
   for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c2=0;c2<2;c2++)for(let d=0;d<2;d++)for(let p2=0;p2<2;p2++)for(let tr2=0;tr2<4;tr2++)for(let me2=0;me2<2;me2++){
    const st={int:a*3,pov:b*2,prm:c2*2};if(d)FL.forEach(f=>st[f]=1);if(p2)st.piege=1;if(me2)st.mentir=1;if(tr2)st.trst=tr2;
    try{const t=n.j(st);if(t&&S[t]&&!seen[t])q.push(t)}catch(e){}}}}
 return out}
function endsTotal(s){return endsList(s).length}
function lockBgOn(){try{const app=$("app");const o=document.createElement("div");o.id="lkBg";
 o.innerHTML='<div class="lkWp"></div><div class="lkClock">'+(($("clk")&&$("clk").textContent)||"23:07")+'</div><div class="lkDate">Samedi 18 octobre</div><div class="lkTools"><i>🔦</i><i>📷</i></div>';
 const wp=o.querySelector(".lkWp");const ph=(typeof IMG!=="undefined"&&((st&&st.pf)?(IMG.fondecF||IMG.fondec):IMG.fondec))||avOf("Yasmine");if(wp&&ph)wp.style.backgroundImage="url("+ph+")";
 app.append(o)}catch(e){}}
function lockBgOff(){try{const e=document.getElementById("lkBg");if(e)e.remove()}catch(e){}}
function endScreen(t,x,seen){const tot=endsTotal(SS);seen=(seen||[]).filter(t2=>endsList(SS).includes(t2));
 const o=document.createElement("div");o.id="endOv";
 const c=document.createElement("div");c.className="card";
 const h=document.createElement("h2");h.className="endH";h.textContent=t;c.append(h);
 const sub=document.createElement("div");sub.className="endSub";sub.textContent=SS.t+" \u00B7 fin de chapitre";c.append(sub);
 const p=document.createElement("p");p.className="endTxt";p.textContent=x;c.append(p);
 const fd=document.createElement("div");fd.className="endFins";
if(tot>1){const fl=document.createElement("b");fl.textContent="Fins d\u00E9couvertes · "+seen.length+" / "+tot;fd.append(fl);
 const list=document.createElement("div");list.className="endFinsList";
 endsList(SS).forEach(t=>{const r=document.createElement("div");r.className="endFinRow"+(seen.includes(t)?" on":"");
  r.innerHTML=seen.includes(t)?"<span>\u2713</span>"+t.replace(/</g,"&lt;"):"<span>\uD83D\uDD12</span>"+t.replace(/</g,"&lt;");
  list.append(r)});
 fd.append(list)}
else{const vh=document.createElement("p");vh.className="endVar";vh.textContent="La fin de ce chapitre change selon tes choix : prudence, preuves, confiance. Rejoue-le pour d\u00E9couvrir les autres.";fd.append(vh)}
c.append(fd);
 const b1=document.createElement("button");b1.id="ob";b1.textContent=(SC===0?"↺ Revivre le chapitre 1":"↺ Revivre l’histoire");b1.onclick=()=>{lockBgOff();o.remove();SC=0;start()};c.append(b1);
 const b2=document.createElement("button");b2.id="ob2";b2.textContent="Menu des histoires";b2.onclick=()=>{menu();setTimeout(lockBgOff,650);o.remove()};c.append(b2);
 try{document.querySelectorAll(".proOv").forEach(function(x){x.remove()})}catch(e3){}o.append(c);document.body.append(o);try{veil(0)}catch(e2){}
 }
function fin([t,x],skip){const fn=(S[nodeNow]&&S[nodeNow].f)||t;st.e=t;PG.s[SC+1]=JSON.parse(JSON.stringify(st));PG.c=Math.max(PG.c,SC+2);let k=[fn];
 try{localStorage.setItem("pg"+SS.id,JSON.stringify(PG));k=JSON.parse(localStorage.getItem("fe"+SS.id)||"[]");if(!k.includes(fn)){k.push(fn);localStorage.setItem("fe"+SS.id,JSON.stringify(k))}}catch(e){}
 k=k.filter(t2=>endsList(SS).includes(t2));
 [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.6),i*160));
 const nx=(SS.ch[SC+1]||[])[1],ok=!!S[nx],r=run;
 setTimeout(()=>{if(r!=run)return;
  if(skip){lockBgOn();endScreen(t,x,k);return}
 const cb=$("ch");cb.innerHTML="";
 const bb=document.createElement("button");bb.className="finB";
 bb.textContent=ok?"\u25B8 J'ai tout lu \u2014 chapitre suivant":"\u25B8 J'ai tout lu \u2014 bilan de l'histoire";
 bb.onclick=()=>{if(ok){ov(t,x+"\n\nFins vues : "+k.length+" / "+endsTotal(SS),"Chapitre suivant",()=>{SC++;start()},"Menu",menu)}else endScreen(t,x,k)};
 cb.append(bb);$("fl").textContent="Fin de ce segment.";$("chat").scrollTop=1e9},900)}
function addH(x){const d=add("h",x);
 if(CGP&&CGP.length>1){const i=x.indexOf(" : ");if(i>1&&i<22&&CGP.indexOf(x.slice(0,i))>=0){
  const nm=x.slice(0,i),ph=avOf(nm),av=document.createElement("span");
  av.className="gav";av.title=nm;if(ph)av.style.backgroundImage='url('+ph+')';else av.textContent=nm[0];
  const row=document.createElement("div");row.className="hrow";d.replaceWith(row);row.append(av,d);d.textContent=x.slice(i+3)}else{const ph2=AVN[CNM];if(ph2){const av=document.createElement("span");av.className="gav";av.title=CNM;av.style.backgroundImage="url("+ph2+")";const row=document.createElement("div");row.className="hrow";d.replaceWith(row);row.append(av,d)}}}
 return d}
function setAv(t){const a=$("av");if(!a)return;const unk=(!t||t==="\u{1F464}");const ph=unk?"":((SS&&SS.photo)||DEF_AV[SS?SS.id:'']);a.style.backgroundImage=ph?'linear-gradient(#0003,#0006),url("'+ph+'"'+')':'';a.textContent=ph?'':(t||"\u{1F464}")}
const AVGR={C:AVF1,J:AVF2,N:AVM1,Y:AVF2,B:AVM1,V:AVM1};const AVN={"Cora":AVF3,"Yasmine":AVF4};const avOf=nm=>AVN[nm]||AVGR[(nm||"")[0]];let APPH={},PENDING=null,PAPP=null,CNM="",PNM="",THR={};
const PART={h1:"I",h2:"I",h3:"I",h4:"I",h5a:"I",h5b:"I",h5c:"I",h6:"I",h7q:"I",h7m:"I",h7m2:"I",h7h:"I",h8b:"I",h8a:"I",h8:"I",h8p:"I",h8h:"I",h8ph:"I",h8d:"I",h8d2:"I",h8pd:"I",h8pd2:"I",h9:"I",h9a:"I",h9a2:"I",h9b:"I",h9c:"I",h9e:"I",h10:"I",h9y:"I",h11b:"I",h11c:"I",h11r:"I",h11p:"I",h11w:"I",h11f:"I",h11:"I",h3a:"I",h3b:"I",h3c:"I",h3l:"I",h3l1:"I",h3l2:"I",h3l3:"I",h9f2:"I",h9z:"I",h9w:"I"};
let CHP="";
let CGP=null;
function applyApp(n){const wa=n.app==="WhatsApp";document.body.classList.toggle("wa",wa);CAPP=n.app;CNM=n.nm||"";CGP=(n.mem&&n.mem.length>1)?n.mem:null;
 const ab=$("apps");if(ab&&n.app&&n.app!=="SMS"){APPS_ON=SS.id==="h"?0:1;ab.style.display="none"}
 $("nm").textContent=n.nm||(SC?SS.n:SS.num);$("st").textContent=n.stx||n.app;
 const av=$("av");if(!av)return;
 if(n.mem&&n.mem.length>1){av.className="av grp";av.style.backgroundImage="";av.textContent="";n.mem.forEach(m=>{const i=document.createElement("img");i.alt=m;i.src=AVGR[m[0]]||"";av.append(i)})}
 else if(n.mem){av.className="av";const ph=avOf(n.mem[0]);av.style.backgroundImage=ph?"linear-gradient(#0003,#0006),url("+ph+")":"";av.textContent=ph?"":n.mem[0][0]}
 else{const pn=AVN[n.nm];if(pn){av.className="av";av.style.backgroundImage="linear-gradient(#0003,#0006),url("+pn+")";av.textContent=""}else{av.className="av";if(n.app==="Fichiers"){av.style.backgroundImage="";av.textContent="📁"}else setAv(SC?SS.n[0]:"\u{1F464}")}}}
function appSwitch(n){return new Promise(res=>{beep(880,.09,.05);setTimeout(()=>beep(1175,.12,.045),95);
 const wa=n.app==="WhatsApp",ic=n.app==="Fichiers"?"📁":(wa?"💬":"📱"),b=document.createElement("div");b.className="notif";
 const snd=n.nm||((n.prev||"").split(" : ")[0])||n.app;
 const avp=(typeof AVN!=="undefined"&&AVN[snd])||null;
 b.innerHTML='<div class="nIc'+(avp?' nAv':'')+'" style="'+(avp?'background-image:url('+avp+')':'background:'+(wa?"#0b6b4f":(n.app==="Fichiers"?"#3a3f52":"#6b5bd6")))+'">'+(avp?'':ic)+'</div><i class="nAp" style="background:'+(wa?"#0b6b4f":(n.app==="Fichiers"?"#3a3f52":"#6b5bd6"))+'">'+ic+'</i><div><b>'+snd+'</b><small>'+(snd!==n.app?n.app+" · maintenant":"maintenant")+'</small></div>';
 $("app").append(b);let done=false;
 const open=()=>{if(done)return;done=true;if(n.prev)try{window.__noan=1}catch(e2){};b.remove();applyApp(n);setTimeout(res,400)};
 b.onclick=open})}
function appHome(){APPH[CAPP+"|"+CNM]={c:$("chat").innerHTML,h:$("ch").innerHTML};
 const o=document.createElement("div");o.id="appHome";
 const ic=(a,c,t)=>'<div class="ah-app'+(a?"":" off")+'" data-app="'+(a||"")+'"><div class="ah-ic" style="background:'+c+'">'+t+'</div><span>'+(a?({SMS:"Messages",WhatsApp:"WhatsApp",Fichiers:"Fichiers",Notes:"Notes"}[a]):t)+'</span></div>';
 const t=($("clk").textContent||"9:41").trim();
 o.innerHTML='<div class="ah-clock"><b>'+t+'</b><span>5G<i class="ah-bat"></i></span></div>'
 +'<h2>Applications</h2>'
 +'<div class="ah-search"><span>🔍</span><input id="ahQ" placeholder="Rechercher" autocomplete="off"></div>'
 +'<div class="ah-grid">'
 +ic("SMS","#6b5bd6","📱","Messages")+ic("WhatsApp","#0b6b4f","💬")+ic("Notes","#53455e","📝")+ic("Fichiers","#3a3f52","📁")
 +ic("","#2b6ea3","📞")+ic("","#42506e","🖼️")+ic("","#1f5f5b","🎧")+ic("","#5a4a2f","⏰")+ic("","#31435e","🌤️")
 +'</div><div class="ah-dots"><i class="on"></i><i></i></div><button class="ahBack">‹ Revenir à la conversation</button>';
 $("app").append(o);
 const q=o.querySelector("#ahQ");if(q)q.oninput=()=>{const v=q.value.trim().toLowerCase();o.querySelectorAll(".ah-app").forEach(a=>{a.style.display=(!v||a.textContent.toLowerCase().includes(v))?"":"none"})};
 o.querySelector(".ahBack").onclick=()=>{o.remove();applyApp(hdrOf(CAPP,CNM))};
 o.querySelectorAll(".ah-app:not(.off)").forEach(a=>a.onclick=()=>{const app=a.dataset.app;o.remove();
  if(app==="Notes")return notesOv(true);
  if((app==="WhatsApp"||app==="SMS")&&(THR[app]||[]).length>1)return thrOv(app);
  if(app===CAPP)return;
  goApp(app,(THR[app]||[])[0]||app)})}
const hdrOf=(app,lbl)=>({app,nm:lbl&&lbl!==app?lbl:null,stx:app==="Fichiers"?"Archive · lecture seule":(app==="WhatsApp"?(lbl||""):"SMS"),mem:null});
function goApp(app,lbl){APPH[CAPP+"|"+CNM]={c:$("chat").innerHTML,h:$("ch").innerHTML};const t=APPH[app+"|"+lbl]||{};applyApp(hdrOf(app,lbl));
 $("chat").innerHTML=t.c||"";$("ch").innerHTML=t.h||"";
 if(app===PAPP&&PENDING&&S[PENDING]&&(PNM||PAPP)===lbl)mkCh(PENDING);
 $("chat").scrollTop=1e9}
function thrOv(app){const o=document.createElement("div");o.id="thrOv";
 $("nm").textContent=app==="SMS"?"Messages":app;$("st").textContent="Conversations";const av=$("av");if(av){av.className="av";av.style.backgroundImage="";av.textContent=app==="SMS"?"\u{1F4F1}":"\u{1F4AC}"}
 const title=app==="SMS"?"Messages":app;
 const MEM={};
 const PH={"C.":"C","Cora":"C","Yasmine":"Y"};
 const mkAv=lbl=>{
  if(app==="Fichiers")return '<span class="thrA file">\u{1F4C4}</span>';
  if(AVN[lbl])return '<span class="thrA ph" style="background-image:url('+AVN[lbl]+')"></span>';
  const mem=MEM[lbl];
  if(mem){return '<span class="thrA grp">'+mem.map(m=>PH[m]&&AVGR[PH[m]]?'<img alt="'+m+'" src="'+AVGR[PH[m]]+'">':'<i>'+m[0]+'</i>').join("")+'</span>'}
  const k=PH[lbl];
  if(k&&AVGR[k])return '<span class="thrA ph" style="background-image:url('+AVGR[k]+')"></span>';
  if(/^(Num\u00E9ro|\+33)/.test(lbl))return '<span class="thrA unk">\u{1F464}</span>';
  return '<span class="thrA">'+lbl[0]+'</span>'};
 const prev=lbl=>{const t=APPH[app+"|"+lbl]||{};const d=document.createElement("div");d.innerHTML=t.c||"";
  const bs=d.querySelectorAll(".b");let tx=bs.length?bs[bs.length-1].textContent.trim().replace(/\s+/g," "):"";
  if(tx.length>52)tx=tx.slice(0,51)+"\u2026";
  const tss=d.querySelectorAll(".ts");let tm=tss.length?tss[tss.length-1].textContent.split(" ").pop():"";
  const unread=(t.h||"").includes("<button")?1:0;
  return{tx,tm,unread}};
 let h='<div class="thrHead"><h2>'+title+'</h2><span class="thrSub">'+((THR[app]||[]).length)+' conversation'+(((THR[app]||[]).length>1)?'s':'')+'</span></div>';
 (THR[app]||[]).forEach(lbl=>{const p=prev(lbl);
  h+='<button class="thrR" data-l="'+lbl+'">'+mkAv(lbl)+'<span class="thrT"><b>'+lbl+'</b><small>'+(p.tx?p.tx:"")+'</small></span><span class="thrM"><i>'+(p.tm||"")+'</i>'+(p.unread?'<em>'+p.unread+'</em>':'')+'</span></button>'});
 h+='<button class="ahBack" id="thrB">\u2039 Applications</button>';o.innerHTML=h;$("app").append(o);
 o.querySelector("#thrB").onclick=()=>{o.remove();appHome()};
 o.querySelectorAll(".thrR").forEach(b=>b.onclick=()=>{o.remove();goApp(app,b.dataset.l)})}
function NH(s){return[
 {id:"num",t:(s.piege||s.avou||s.mentir),tex:"Ton numéro était celui de Nils. Quelqu’un l’a volontairement remis dans le pool de recyclage."},
 {id:"piege",t:s.piege,tex:"Tu as confirmé la « prise » du quai 9. Pour Mandragore, tu es Nils. Un échantillon t’attend à 23h40."},
 {id:"avou",t:s.avou,tex:"Cora sait que tu n’es pas Nils. Elle t’a appelé pour t’expliquer les règles."},
 {id:"pov",t:s.pov,tex:"Notes de Nils : container 44-B, quai 9, 250 kg de précurseur. « La Larme noyée dans le sucre brut. »"},
 {id:"prm",t:s.prm,tex:"Dernier message de Nils : « Ne fais pas confiance à la police municipale. Ne fais confiance qu’à C. »"},
 {id:"chim",t:(s.cal_h8||s.cal_h8p),tex:"CHIMÈRE v3, le dossier complet de Mandragore, chiffré 4096 bits. Ne s'ouvre que depuis la ligne d'origine : la clé, c'est la ligne elle-même."},
 {id:"mig",t:s.mig,tex:"Tu as suivi la migration : les 4,2 Go rapatriés sont maintenant dans ton téléphone."},
 {id:"trst",t:(s.trst||0)>=2,tex:"Cora te fait confiance... pour l’instant."},
 {id:"mentir",t:s.mentir,tex:"Tu as menti à Cora en improvisant. Elle t’a repéré en quatre minutes."},
 {id:"pol",t:s.pol,tex:"Tu as annoncé à Cora que tu irais à la police municipale. Elle t’a aiguillé vers le commandant Riffaud, en te demandant de ne jamais citer son nom."}
].filter(x=>x.t)}
function noteTick(){try{const cur=NH(st||{}).map(x=>x.id);const seen=(st&&st._nts)||[];const nw=cur.filter(i=>!seen.includes(i));if(nw.length){st._nts=(st._nts||[]).concat(nw);toast("Écrit dans tes notes : "+(nw.length>1?nw.length+" nouvelles notes":"1 nouvelle note"))}}catch(e){}}
function notesOv(fromApp){const o=document.createElement("div");o.id="notesOv";o.dataset.from=fromApp?"app":"conv";
 $("nm").textContent="Notes";$("st").textContent="Notes de l'enquête";const av=$("av");if(av){av.className="av";av.style.backgroundImage="";av.textContent="📝"}
 let h='<h2>Notes de l\u2019enqu\u00EAte</h2>';
 if(SS.id!=="h"||!SK)h+='<p class="ntR">Pas encore de notes pour cette histoire.</p>';
 else{const s=st||{};
 if(SS.id==="h"){
  h+='<b>Qui est qui</b>';
  const WH=[["Toi · Vaubris, 2057. Ton ancien numéro a été piraté et vendu sur des forums. Le nouveau a appartenu à un mort.",1],
  ["Nils Aveline · l'ancien propriétaire du numéro. Agent d'une unité qui ne figure sur aucun organigramme. Mort il y a trois semaines.",s.piege||s.avou||s.mentir],
  ["Cora (« C. ») · coéquipière de Nils. Appelle sur ligne chiffrée, écrit court et sec, ne croit pas au hasard.",(s.trst||0)>0||s.avou||s.mentir],
  ["Yasmine · ta meilleure amie depuis l'enfance. Elle a pleuré dans le tram en lisant les commentaires sous ton ancien numéro. Tu lui as promis de l'appeler au premier détail bizarre.",1],
  ["Mandragore · le réseau qui noie la Larme dans le sucre brut. Quai 9, containers, faux ordres sur les numéros suspects.",s.cal_h8||s.cal_h8p],
  ["Commandant Riffaud · police municipale de Vaubris. Dernier message de Nils : ne pas lui faire confiance.",s.pol]];
  WH.forEach(x=>{if(x[1])h+='<div class="ntR">'+x[0]+'</div>'});
  h+='<b>Ce que tu sais</b>';
  NH(s).forEach(x=>{h+='<div class="ntR">'+x.tex+'</div>'});
 }}
 h+='<button class="ahBack" id="ntB2">'+(fromApp?"‹ Applications":"‹ Revenir à la conversation")+'</button>';o.innerHTML='<div class="ntCard">'+gf(h)+'</div>';$("app").append(o);try{noRubber(o)}catch(e){}
 o.querySelector("#ntB2").onclick=()=>{o.remove();if(fromApp)appHome();else applyApp(hdrOf(CAPP,CNM))}}
async function lockFx(){const o=document.createElement("div");o.id="lockFx";$("app").append(o);try{hit(440,.5,.05,"lowpass",.02,.6)}catch(e){}await sl(520)}
const unq=x=>{const m=String(x).match(/^\s*«([\s\S]*)»\s*$/);return m?m[1].trim():x};
function mkCh(id){const n=S[id];if(!n)return;PENDING=id;PAPP=CAPP;PNM=n.nm||"";const c=$("ch");c.innerHTML="";
 (n.c||[]).forEach(([t,nx,ef,rm])=>{const tG=unq(gf(t));const b=document.createElement("button");if(rm==="!"||rm==="-")b.classList.add("act");const sg=String(tG).split("*");if(sg.length>1){sg.forEach((sx,ix)=>{if(ix%2){const em=document.createElement("i");em.textContent=sx;b.append(em)}else if(sx){const sp=document.createElement("span");sp.textContent=sx;b.append(sp)}})}else b.textContent=tG;b.onclick=async()=>{try{beep(480,.05,.035)}catch(e){}c.innerHTML="";$("fl").textContent="Envoyer un message";const cl=x=>String(x).replace(/\*[^*]*\*/g,"").trim();const nf=x=>String(x).replace(/\*/g,"");if(rm==="!"){add("n",gf(emojiClean(nf(t))))}else if(rm!=="-"){const mt=rm?unq(gf(rm)):cl(tG);if(mt){tx();add("m",emojiClean(mt))}}for(const k in ef||{})st[k]=["t","care","agency","practical"].includes(k)?(st[k]||0)+ef[k]:ef[k];await sl(rm==="!"?400:500);if(ef&&ef.lock){delete st.lock;await lockFx()}play(nx,run)};c.append(b)});
 const abm=$("apps");if(abm)abm.style.display=APPS_ON?"":"none";
 $("fl").textContent=(n.c||[]).length?"Choisis une réponse ↑":"Fin de ce segment.";$("chat").scrollTop=1e9}
function start(){veil(0);run++;PROD=0;SK=1;STATS.runs++;statsTick();$("vol").hidden=true;{try{if(!localStorage.getItem("etl_hint")){localStorage.setItem("etl_hint","1");setTimeout(()=>{if(SK)add("sys","💬 Réponds aux messages pour avancer. Chaque choix compte. Le menu ‹ en haut à gauche, les réglages ⚙️ à droite.")},1500)}}catch(e){}}$("nm").textContent=SC?SS.n:SS.num;setAv(SC?SS.n[0]:"\u{1F464}");$("clk").textContent="";CHP="";
 st=JSON.parse(JSON.stringify(SC&&PG.s[SC]||{t:0,l:0,r:0,v:0,e:""}));
 $("chat").innerHTML="";$("ch").innerHTML="";$("ov").hidden=true;CAPP="SMS";document.body.classList.remove("wa");APPH={};PENDING=null;{const ab=$("apps");if(ab)ab.style.display="none"}$("st").textContent="SMS";unlock();
 document.body.classList.add("play");$("mn").classList.remove("on");
 const begin=()=>{if(SS.id==="h"&&!SC&&!(window.__ghost&&window.__ghost())&&typeof introH==="function")introH(()=>play(SS.ch[SC][1]));else play(SS.ch[SC][1])};
 if(SS.id==="h"&&!SC&&!st.pname&&!(window.__ghost&&window.__ghost()))nameGate(()=>bioOv(begin));else begin()}
function bioOv(cb){const nm=(st&&st.pname)||"";const insp=(st&&st.pf)?"ancienne inspectrice":"ancien inspecteur";
 const o=document.createElement("div");o.id="bioOv";o.className="proOv";
 o.innerHTML='<div class="proCard"><div class="proK">Toi</div><h2>Qui es-tu ?</h2><p class="ngP"></p><p class="ngP"></p><button class="proBtn bioGo">Suivant</button></div>';
 $("app").append(o);
 const P=o.querySelectorAll(".ngP");
 P[0].textContent=gf(nm+", "+insp+" à la brigade urbaine de Vaubris. Six ans de service et une enquête sur la Larme, la drogue de Vaubris.");
 P[1].textContent=gf("Tu as été trop curieux pour les dealers. Ton chef t'a ordonné d'arrêter. Tu as rendu ton badge plutôt que te taire. Depuis : réparateur indépendant. Eux n'ont rien oublié... le hack de ces six derniers jours a commencé là.");
 o.querySelector(".bioGo").onclick=()=>{try{hit(660,.05,.08)}catch(x){}cb&&cb();o.remove()}}
/* ---- v2.75 : genre du joueur + prénom ---- */
function gf(t){if(!st||!st.pf)return String(t);return String(t)
 .replace(/(?<![\p{L}])(Désolé|désolé|éveillé|certain|seul|content|rentré|fatigué|prêt|vivant|sûr|repéré|appelé|aiguillé)(?![\p{L}])/gu,"$1e")
 .replace(/(?<![\p{L}])curieux(?![\p{L}])/gu,"curieuse")
 .replace(/(?<![\p{L}])le flic(?![\p{L}])/gu,"la flic")
 .replace(/(?<![\p{L}])ancien inspecteur(?![\p{L}])/gu,"ancienne inspectrice")
 .replace(/(?<![\p{L}])réparateur indépendant(?![\p{L}])/gu,"réparatrice indépendante")
 .replace(/(?<![\p{L}])un ancien inspecteur(?![\p{L}])/gu,"une ancienne inspectrice")
 .replace(/(?<![\p{L}])d’un coéquipier(?![\p{L}])/gu,"d’une coéquipière").replace(/(?<![\p{L}])coéquipier(?![\p{L}])/gu,"coéquipière").replace(/(?<![\p{L}])d’un ancien flic(?![\p{L}])/gu,"d’une ancienne flic").replace(/(?<![\p{L}])espionné(?![\p{L}])/gu,"espionnée").replace(/n'es pas lui/g,"n'es pas elle")}
function nameGate(cb){const o=document.createElement("div");o.id="nameGate";o.className="ngOv";
 o.innerHTML='<div class="ngList"><h2>Avant de commencer</h2><p class="ngP">L’histoire va te parler, et elle aura besoin d’un nom.</p><input id="ngName" maxlength="14" placeholder="Ton prénom" autocomplete="off"><button class="bk ngBk" id="ngF"><h3>♀ Une femme</h3><p>L’histoire s’accorde au féminin.</p></button><button class="bk ngBk" id="ngM"><h3>♂ Un homme</h3><p>L’histoire s’accorde au masculin.</p></button><button class="ngGo">Continuer</button></div>';
 $("app").append(o);
 const inp=o.querySelector("#ngName"),go=o.querySelector(".ngGo"),bf=o.querySelector("#ngF"),bm=o.querySelector("#ngM");let gen=null;
 bf.onclick=()=>{gen="f";bf.classList.add("open");bm.classList.remove("open")};
 bm.onclick=()=>{gen="m";bm.classList.add("open");bf.classList.remove("open")};
 go.onclick=()=>{const v=(inp.value||"").trim().slice(0,14);if(!v||!gen)return;try{st.pname=v;st.pf=gen==="f"?1:0;localStorage.setItem("etl_pname",v);localStorage.setItem("etl_pgen",gen)}catch(e){}try{hit(660,.05,.08)}catch(e){}cb();o.remove()}}
/* ---- réaction du personnage (v2.55) : carte in-téléphone après le hack ---- */
function reactOv(txt,btnLabel,done){
 const o=document.createElement("div");o.className="proOv rxOv";
 o.innerHTML='<div class="proCard"><div class="proK">Toi</div><p class="rxP"></p><div class="proDots"><i class="on"></i></div><button class="proBtn" hidden>'+btnLabel+'</button></div>';
 $("app").append(o);
 const p=o.querySelector(".rxP"),b=o.querySelector(".proBtn");
 p.textContent=txt;b.hidden=false;
 const go=()=>{try{hit(660,.05,.08)}catch(x){}veil(1);o.remove();done&&done()};
 b.onclick=go;
}
/* ---- intro chapitre 1 : écran noir -> déverrouillage -> freeze hack (canvas 2D) ---- */
async function introH(cb){
  if(S.h1&&S.h1.pro){await proCards(S.h1.pro,{instant:1,lastBtn:"Prendre le téléphone"});PROD=1}
  const RM=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(x){return false}})();
  const app=$("app");
  const o=document.createElement("div");o.id="lockOv";
  o.innerHTML='<canvas class="lkFx"></canvas>'
   +'<div class="lkMid"><div class="lkClock">--:--</div><div class="lkDate"></div></div>'
   +'<button class="lkGo">Déverrouiller</button>'
   +'<div class="lkHint">Le téléphone que tu viens de récupérer.</div>';
  app.append(o);
  const q=s=>o.querySelector(s),cv=q(".lkFx"),ctx=cv.getContext("2d");
  let W,H;const fit=()=>{W=cv.width=app.clientWidth||innerWidth;H=cv.height=app.clientHeight||innerHeight};fit();
  let done=false;
  const finish=()=>{if(done)return;done=true;o.classList.add("off");setTimeout(()=>{o.remove()},720);try{cb&&cb()}catch(x){}};
  let nextB=null;
  const reactThen=()=>{if(done)return;finish()};/* reactOv("C'est quoi ce bordel…? Le téléphone est maudit, ou quoi ?","Reprendre le téléphone",finish)};*/
  const showNext=()=>{if(done||nextB)return;nextB=document.createElement("button");nextB.className="lkNext";nextB.textContent="Suivant \u203a";nextB.onclick=e=>{e.stopPropagation();reactThen()};o.append(nextB)};
  const T0=new Date(2057,9,18,21,52,0);const clk=()=>{try{T0.setSeconds(T0.getSeconds()+3);q(".lkClock").textContent=T0.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});q(".lkDate").textContent=T0.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}catch(x){}};
  clk();const tick=setInterval(()=>{done?clearInterval(tick):clk()},1000);
  const glitch=()=>{
    o.classList.add("unlocked");
    try{unlock();hit(90,2.6,.22,"lowpass",.02,.6);hit(2400,.05,.05,"highpass",.01,2)}catch(x){}
    setTimeout(()=>{try{hit(120,1.5,.2,"lowpass")}catch(x){}},900);
    setTimeout(()=>{try{hit(880,.06,.12);hit(1319,.08,.12)}catch(x){}},1650);
    const oc=document.createElement("canvas");oc.width=W;oc.height=H;const c=oc.getContext("2d");
    c.fillStyle="#0b1220";c.fillRect(0,0,W,H);
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#122036");g.addColorStop(1,"#070d18");c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle="#9fb4d8";c.font="600 11px system-ui";c.textAlign="right";c.fillText(q(".lkClock").textContent,W-10,22);
    c.textAlign="left";c.fillText("5G",10,22);
    c.fillStyle="#e8eefb";c.font="300 46px system-ui";c.fillText(q(".lkClock").textContent,18,H*.15);
    c.font="12px system-ui";c.fillStyle="#9fb4d8aa";c.fillText(q(".lkDate").textContent,20,H*.15+24);
    c.globalAlpha=.15;
    for(let r=0;r<4;r++)for(let col=0;col<4;col++){c.fillStyle="#dbe7f8";c.fillRect(24+col*70,H*.42+r*62,44,44)}
    c.globalAlpha=1;
    const lines=["SIM RECYCLÉE : 06 51 09 43 87","ANCIEN TITULAIRE : [DONNÉES EFFACÉES]","MIGRATION DES DONNÉES…","TERMINAL RÉATTRIBUÉ"];
    const t0=performance.now();
    const step=()=>{
      if(done)return;
      const t=performance.now()-t0,p=Math.min(1,t/2100);
      ctx.clearRect(0,0,W,H);ctx.drawImage(oc,0,0);
      const n=2+Math.floor(p*10);
      for(let i=0;i<n;i++){const y=Math.random()*H,h=6+Math.random()*40,dx=(Math.random()-.5)*p*90;ctx.drawImage(oc,0,y,W,h,dx,y,W,h)}
      if(Math.random()<.4){ctx.globalAlpha=.25;ctx.drawImage(oc,-3,0);ctx.drawImage(oc,3,0);ctx.globalAlpha=1}
      ctx.fillStyle="rgba(0,0,0,.16)";for(let y=0;y<H;y+=3)ctx.fillRect(0,y,W,1);
      if(Math.random()<.5){ctx.fillStyle=["#0f8","#f43","#08f"][Math.floor(Math.random()*3)];ctx.globalAlpha=.1+Math.random()*.18;ctx.fillRect(Math.random()*W,Math.random()*H,30+Math.random()*120,6+Math.random()*26);ctx.globalAlpha=1}
      const show=Math.min(lines.length-1,Math.floor(t/430));
      ctx.font="12px ui-monospace,Consolas,monospace";ctx.textAlign="left";
      for(let k=0;k<=show;k++){ctx.fillStyle=k===show?"#ffd166":"#7fe0a2";ctx.fillText("> "+lines[k],14,H-64-(show-k)*18)}
      if(p>=0.55)showNext();
      requestAnimationFrame(step)};
    requestAnimationFrame(step)};
  q(".lkGo").onclick=x=>{x.stopPropagation();if(done||o.classList.contains("unlocked"))return;
    try{unlock();hit(660,.07,.14);setTimeout(()=>hit(990,.09,.14),70)}catch(e){}
    if(RM)setTimeout(reactThen,250);else glitch()};
}

/* ---- événement hors téléphone (v2.51) : écran noir + flou + narration ---- */
/* ---- v2.73 : voile anti-flash entre overlays (transitions propres) ---- */
function veil(on){let v=document.getElementById("etlVeil");if(on){if(!v){v=document.createElement("div");v.id="etlVeil";$("app").append(v)}v.classList.remove("off")}else if(v){v.classList.add("off");setTimeout(()=>{const x=document.getElementById("etlVeil");if(x&&x.classList.contains("off"))x.remove()},400)}}
/* ---- v2.65 : réveil sur écran de verrouillage avec notification ---- */
async function lockWake(s){const app=$("app");const o=document.createElement("div");o.id="lkWake";
 o.innerHTML='<div class="lkWp"></div><div class="lkSbar"><i>5G</i><i>▮ 78 %</i></div><div class="lkClock">'+(s&&s.t||"")+'</div><div class="lkDate">Samedi 18 octobre</div><div class="lkNotif"><span class="lkIc"></span><div class="lkNc"><p class="lkTop"><b></b><small></small></p><span class="lkTx"></span></div></div><div class="lkTools"><i>🔦</i><i>📷</i></div><div class="lkHint">Appuie pour déverrouiller</div>';
 try{const wp=o.querySelector(".lkWp");const ph=(typeof IMG!=="undefined"&&((st&&st.pf)?(IMG.fondecF||IMG.fondec):IMG.fondec))||avOf("Yasmine");if(wp&&ph)wp.style.backgroundImage="url("+ph+")"}catch(e){}
 try{const ic=o.querySelector(".lkIc"),tb=o.querySelector(".lkTop b"),tm=o.querySelector(".lkTop small"),tx=o.querySelector(".lkTx");const pn=(st&&st.pname)||"toi";const nm=s&&s.nm||"";tb.textContent=nm.replace(/%N%/g,pn);tm.textContent=(s&&s.t)||"";tx.textContent=String(s&&s.txt||"").replace(/%N%/g,pn);
 if(nm&&typeof AVN!=="undefined"&&AVN[nm]){ic.className="lkIc av";ic.style.backgroundImage="url("+AVN[nm]+")"}else ic.textContent=(s&&s.ic)||"💬"}catch(e){}
 const dm=document.createElement("div");dm.id="lkDim";app.append(dm);app.append(o);
 try{hit(150,1.2,.12,"lowpass",.015,.5)}catch(e){}
 await new Promise(res=>{o.onclick=()=>{veil(1);try{hit(880,.05,.06)}catch(e){}o.classList.add("on");setTimeout(()=>{o.remove();try{var d=document.getElementById("lkDim");if(d)d.remove()}catch(e){}res()},420)}})}
async function awayOv(lines,LB){
 const app=$("app");
 const o=document.createElement("div");o.id="awayOv";
 o.innerHTML='<div class="awIn"></div><button class="awGo"></button>';
 app.append(o);
 try{hit(150,1.4,.14,"lowpass",.015,.5)}catch(e){}
 const inn=o.querySelector(".awIn"),btn=o.querySelector(".awGo");
 await sl(520);
 let done=false;
 await new Promise(res=>{
  const close=()=>{if(done)return;done=true;veil(1);o.classList.add("off");setTimeout(()=>{o.remove();res()},620)};
  lines.forEach((L,i2)=>{const p=document.createElement("p");p.textContent=L;
   try{const q=String(L).match(/^(\d{1,2})h(\d{2})/);if(q){SK=1;const hm=q[1].padStart(2,"0")+":"+q[2];clkSet(hm);$("clk").textContent=hm}}catch(e){}
   setTimeout(()=>{inn.append(p);requestAnimationFrame(()=>requestAnimationFrame(()=>p.classList.add("on")))},i2*650)});
  btn.textContent=LB||"Reprendre le t\u00E9l\u00E9phone";
  /* v2.132 : bouton actif seulement apres apparition du texte — anti "pas le temps de lire" + anti double-tap qui saute la carte suivante */
  const awChars=lines.join("").length;
  const awWait=Math.max(500,Math.max((lines.length-1)*450+900,Math.min(6500,900+awChars*22))-2000);
  btn.style.visibility="hidden";btn.disabled=true;
  const awT=setTimeout(()=>{if(done)return;btn.style.visibility="visible";btn.disabled=false;try{beep(880,.04,.03)}catch(e){}},awWait);
  btn.onclick=e=>{e.stopPropagation();if(btn.disabled)return;try{hit(660,.05,.08)}catch(e2){}clearTimeout(awT);close()};
})}
/* ---- animation de transfert HÉLIOS (v2.59) : item par item, barre de progression ---- */
async function heliosTransfer(o){
 const btns=o.querySelector(".scBtns");btns.innerHTML="";
 const items=[["Photos & vidéos","2,1 Go"],["Sauvegardes de messages","1,4 Go"],["Documents","0,7 Go"]];
 const box=document.createElement("div");box.className="scProg";
 box.innerHTML='<p class="scStat">Transfert des données…</p><div class="scTrack"><i></i></div><div class="scList"></div>';
 btns.append(box);
 const bar=box.querySelector(".scTrack i"),list=box.querySelector(".scList");
 const per=1400;
 for(let k=0;k<items.length;k++){
  const li=document.createElement("div");li.className="scLi";
  li.innerHTML='<span>'+items[k][0]+'</span><small>0 %</small>';list.append(li);
  const sm=li.querySelector("small");
  await new Promise(res=>{const t0=performance.now();const tick=()=>{const pr=Math.min(1,(performance.now()-t0)/per);sm.textContent=Math.round(pr*100)+" %";if(pr>=1){res();return}requestAnimationFrame(tick)};tick()});
  sm.textContent="✓ "+items[k][1];
  bar.style.width=Math.round((k+1)/items.length*100)+"%";
  try{beep(880,.04,.05)}catch(e){}
 }
 const li=document.createElement("div");li.className="scLi dim";
 li.innerHTML='<span>Espace chiffré</span><small>en attente</small>';list.append(li);
 box.querySelector(".scStat").textContent="Transfert terminé : 4,2 Go récupérés";
 try{hit(660,.06,.08);setTimeout(()=>hit(990,.08,.1),90)}catch(e){}
 await sl(900)}
/* ---- écran contextuel IN-TÉLÉPHONE (v2.53) : interface dédiée au contexte (ex. HÉLIOS), à la façon du lock screen ---- */
async function scrOv(n){
 try{if(st["scr_"+(nodeNow||"")]&&!n.scrf)return false}catch(e){}
 const spec=n.scr||{};
 const app=$("app");const o=document.createElement("div");o.id="scrOv";
 let map=null,resFn=null;
 const applyEf=ef=>{for(const k in ef||{})st[k]=["t","care","agency","practical"].includes(k)?(st[k]||0)+ef[k]:ef[k]};
 if(spec.k==="helios"){
  const dn=spec.st==="done";
  const hm9=spec.ts?String(spec.ts).replace("h",":"):"";
  o.innerHTML='<div class="scSbar"><span>'+hm9+'</span><i>5G</i><i>78%</i></div><div class="scHead hs"><span class="scIc"><svg viewBox="0 0 24 24" fill="none" stroke="#9fb4d8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H6a4.5 4.5 0 0 1-.9-8.9 7 7 0 0 1 13.3-1.4A4.6 4.6 0 0 1 17.5 19z"/></svg></span><b>HÉLIOS Cloud</b></div><div class="scBody">'
  +(dn?'<p class="scSub">Migration terminée · 4 fichiers rapatriés<br>06 51 09 43 87 · Archive « N. A. » synchronisée</p>'
      :'<p class="scSub">Données en attente de transfert<br>06 51 09 43 87 · 4,2 Go</p>')
  +'<div class="scRow"><i>🖼️</i><span>Photos &amp; vidéos</span><small>'+(dn?'✓ 2,1 Go':'2,1 Go')+'</small></div>'
  +'<div class="scRow"><i>💬</i><span>Sauvegardes de messages</span><small>'+(dn?'✓ 1,4 Go':'1,4 Go')+'</small></div>'
  +'<div class="scRow"><i>📄</i><span>Documents</span><small>'+(dn?'✓ 0,7 Go':'0,7 Go')+'</small></div>'
  +'<div class="scRow"><i>🔐</i><span>Espace chiffré</span><small>'+(dn?'4 fichiers · verrouillés':'taille inconnue')+'</small></div>'
  +(dn?'<p class="scNote">Les données de N. A. sont dans ton téléphone. Elles attendent.</p>':'')
  +'</div>'}
 else if(spec.k==="files"){
  map=spec.map||{};
  const head=document.createElement("div");head.className="scHead";
  head.innerHTML='<span class="scIc">📂</span><b>Archive « N. A. »</b>';
  const body=document.createElement("div");body.className="scBody";
  const sub=document.createElement("p");sub.className="scSub";
  sub.innerHTML="4 éléments rapatriés du cloud de N. A.<br>La migration s'est terminée "+((st.cal_h8||st.cal_h8p||st.recall)?"pendant l'appel.":"cette nuit.");
  body.append(sub);
  (n.fx||[]).forEach(r=>{
   const ic=r[0],nm=r[1],ds=r[2],tgt=map[nm];
   const opd=st["op_"+nm];
   const rw=document.createElement("div");rw.className="scRow "+(tgt?"go":"dim")+(opd?" read":"");
   rw.innerHTML='<i>'+ic+'</i><span>'+nm+'</span><small>'+(opd?"✓ lu · ":"")+ds+'</small>';
   if(tgt)rw.onclick=async ev=>{ev.stopPropagation();if(o.dataset.done)return;o.dataset.done=1;
    const ch=(n.c||[]).find(cc=>cc&&cc[1]===tgt);
    if(ch)applyEf(ch[2]);
    try{st["op_"+r[1]]=1}catch(x2){}
    try{st["scr_"+(nodeNow||"")]=1}catch(x){}
    try{hit(660,.05,.08);setTimeout(()=>hit(990,.07,.1),70)}catch(x){}
    try{resFn&&resFn()}catch(x){}
    veil(1);
    o.classList.add("off");setTimeout(()=>o.remove(),520);
    await sl(300);play(tgt,run)};
   body.append(rw)});
  const note=document.createElement("p");note.className="scNote";
  note.textContent="Quatre fichiers qui ne sont pas à toi, maintenant dans ton téléphone.";
  body.append(note);
  o.append(head);o.append(body)}
 const btns=document.createElement("div");btns.className="scBtns";if(spec.k==="helios"){const q2=document.createElement("p");q2.className="scQ";q2.textContent=spec.st==="done"?"L'archive est synchronisée. Qu'en fais-tu ?":"Rapatrier tes données dans ton téléphone neuf ?";btns.append(q2)}o.append(btns);
 app.append(o);
 if(spec.ts){const q=String(spec.ts).match(/^(\d{1,2})h(\d{2})$/);if(q){SK=1;const hm=q[1].padStart(2,"0")+":"+q[2];try{clkSet(hm)}catch(e){}$("clk").textContent=hm}}
 try{beep(520,.06,.05)}catch(e){}
 await new Promise(res=>{resFn=res;
  const mapped=map?Object.values(map):[];
  const visible=(n.c||[]).filter(c=>!mapped.includes(c[1]));
  visible.forEach(([t,nx,ef])=>{
   const b=document.createElement("button");b.className="scBtn";b.textContent=unq(t);
   b.onclick=async ev=>{ev.stopPropagation();if(o.dataset.done)return;o.dataset.done=1;
    applyEf(ef);
    try{st["scr_"+(nodeNow||"")]=1}catch(x){}
    try{hit(660,.05,.08);setTimeout(()=>hit(990,.07,.1),70)}catch(x){}
    if(spec.k==="helios"&&ef&&ef.mig===1)await heliosTransfer(o);
    resFn();
    veil(1);
    o.classList.add("off");setTimeout(()=>o.remove(),520);
    await sl(300);play(nx,run)};
   btns.append(b)});
  if(!visible.length){const b=document.createElement("button");b.className="scBtn";b.textContent="Continuer";
   b.onclick=ev=>{ev.stopPropagation();if(o.dataset.done)return;o.dataset.done=1;try{st["scr_"+(nodeNow||"")]=1}catch(x){}res();veil(1);o.classList.add("off");setTimeout(()=>o.remove(),520)};btns.append(b)}
 });
 return true}
/* ---- menus ---- */
const ck=()=>{if(SK)return;$("clk").textContent=new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})};ck();setInterval(ck,30000);
function card(h){const c=document.createElement("div");c.className="card";const e=document.createElement("h2");e.textContent=h;c.append(e);return c}
function row(c,t,d,fn,off){const b=document.createElement("button");b.className="st";b.disabled=!!off;const a=document.createElement("b");a.textContent=t;b.append(a);if(d){const s=document.createElement("small");s.textContent=d;b.append(s)}b.onclick=fn;c.append(b);return b}
function show(c){const m=$("mn");m.replaceChildren(c);m.classList.add("on");addBack(c)}
/* Flèche « retour » en haut à gauche de chaque écran de base : reprend l'action de la ligne « ‹ Retour » de l'écran, sinon revient à l'accueil. */
let INTRO_HTML=(function(){const d=document.getElementById("in");return d?d.innerHTML:""})();
function addBack(c){
  let fn=null;c.querySelectorAll("button.st,button.bk").forEach(b=>{if(/^\u2039\s*Retour/.test(b.textContent.trim()))fn=b.onclick});
  const a=document.createElement("button");a.type="button";a.className="mnBack";a.setAttribute("aria-label","Retour");a.textContent="\u2190";
  a.onclick=fn||homeIntro;
  if(c.parentElement&&c.parentElement.classList&&c.parentElement.classList.contains("rsOv")){c.style.position="relative";a.style.position="absolute";a.style.top="-56px";a.style.left="0";a.style.right="auto"}
  c.prepend(a)}
/* ---- Guide (bouton dans la bibliotheque) ---- */
function guideOv(){
 const o=document.createElement("div");o.id="infoOv";
 const b=document.createElement("div");b.className="ifCard";
 const k=document.createElement("div");k.className="ifK";k.textContent="Guide";b.append(k);
 const h2=document.createElement("h2");h2.textContent="Comment jouer";b.append(h2);
 const g=document.createElement("div");g.className="ifGuide";
 g.innerHTML="<p><b>Lire.</b> Chaque histoire se déroule sur un téléphone : des messages arrivent, s’enchaînent, se contredisent. Photos, appels, fichiers, tout se lit comme une vraie messagerie.</p>"
 +"<p><b>Répondre.</b> Aux moments clés, des choix apparaissent. Il n’y a pas de bonne réponse : chaque mot que tu tapes rapproche de la vérité… ou la fait taire pour toujours. Certains choix se rejouent, d’autres non.</p>"
 +"<p><b>Les boutons, une fois dans le jeu :</b></p>"
 +"<p><b>‹</b> en haut à gauche : la bibliothèque · histoires, reprise de partie, réglages.<br>"
 +"<b>⚙</b> : paramètres de la partie · thème nuit / jour / auto, volume, vitesse de lecture, voix des appels, plein écran, transfert de sauvegarde.<br>"
 +"<b>📖</b> à côté de l’heure : ta progression, tes fins, tes notes.</p>"
 +"<p><b>Ta progression est sauvegardée</b> automatiquement sur ton appareil. Pas de compte, pas de serveur. Tu peux l’exporter (code ou fichier) depuis les réglages pour la poursuivre ailleurs.</p>"
 +"<p><b>Le téléphone de démo</b> de la page d’accueil joue des extraits imaginaires, inventés pour donner le ton du jeu : rien de ce qui y apparaît ne fait partie des vraies histoires.</p>";
 b.append(g);
 const cb=document.createElement("button");cb.className="ifBack";cb.textContent="‹ Fermer";cb.onclick=()=>{o.remove()};b.append(cb);
 o.append(b);document.body.append(o);try{noRubber(o)}catch(e){}
 o.addEventListener("click",e2=>{if(e2.target===o)o.remove()});
}
function volToggle(){const vv=$("vol");if(vv&&vv.parentElement!==document.body)document.body.append(vv);vv.hidden=!vv.hidden}
/* ---- Fiche progression (bouton i a cote de l'heure) ---- */
function infoOv(){
 try{const M=window.etlMisc;if(M&&M.stopPro)M.stopPro()}catch(e){}
 const o=document.createElement("div");o.id="infoOv";
 const b=document.createElement("div");b.className="ifCard";
 const k=document.createElement("div");k.className="ifK";k.textContent="Progression";b.append(k);
 const h2=document.createElement("h2");h2.textContent=SS?SS.t:"Entre les lignes";b.append(h2);
 if(SS&&SS.id==="h"){
  const cur=(SS.ch&&SS.ch[Math.min(SC,(SS.ch.length-1))])||[];
  const done=!!(st&&st.e);
  let Pc={c:0,s:[]};try{Pc=JSON.parse(localStorage.getItem("pg"+SS.id))||Pc}catch(e){}
  const ch=document.createElement("div");ch.className="ifRow big";
  ch.innerHTML="<span>"+(SC+1)+". "+(cur[0]||"Num\u00E9ro attribu\u00E9")+"</span><small>"+(done?"chapitre termin\u00E9":"en cours")+"</small>";
  b.append(ch);
  SS.ch.forEach((hh,i2)=>{const w=!!S[hh[1]],ok=w&&(i2===0||i2<Pc.c);
   const r=document.createElement("div");r.className="ifRow"+(ok?" on":" dim");
   r.innerHTML="<span>"+(i2+1)+". "+hh[0]+"</span><small>"+(ok?"\u2713":"\uD83D\uDD12")+"</small>";
   b.append(r)});
  const meta=document.createElement("div");meta.className="ifMeta";
  meta.innerHTML="\u23F1 "+fmtT(STATS.t)+" de lecture \u00B7 \uD83D\uDCAC "+STATS.msgs+" messages<small>toutes tes parties, sur cet appareil</small>";
  b.append(meta);
  const M=window.etlMisc||{};let tot=0,g0=0;try{if(M.endsOf)tot=M.endsOf(SS);if(M.feN)g0=M.feN(SS)}catch(e){}
  if(tot>1){const fl=document.createElement("button");fl.className="ifBtn";
   fl.innerHTML="\uD83C\uDFC1 Fins : "+Math.min(g0,tot)+" / "+tot+" · touche pour les voir";
   fl.onclick=()=>{o.remove();if(M.endsCard)M.endsCard(SS)};b.append(fl)}
  else{const vh=document.createElement("div");vh.className="ifVar";
   vh.textContent="La fin de ce chapitre change selon tes choix : prudence, preuves, confiance. Rejoue-le pour d\u00E9couvrir les autres.";
   b.append(vh)}
 }
 const nb2=document.createElement("button");nb2.className="finStat ifNotes";
 nb2.innerHTML="\uD83D\uDCDD Notes de l'enqu\u00EAte · qui est qui, ce que tu sais";
 nb2.onclick=()=>{o.remove();if(typeof notesOv==="function")notesOv(false)};b.append(nb2);
 const g=document.createElement("div");g.className="ifGuide";
 g.innerHTML="<b>Les boutons</b><p><b>\u2039</b> en haut \u00E0 gauche : la biblioth\u00E8que · histoires, reprise de partie, r\u00E9glages.</p><p><b>\u2699</b> : r\u00E9glages · th\u00E8me nuit / jour / auto, volume, vitesse de lecture, voix des appels, plein \u00E9cran, transfert de sauvegarde.</p><p><b>\uD83D\uDCD5</b> \u00E0 c\u00F4t\u00E9 de l'heure : cette fiche · o\u00F9 tu en es, tes fins, tes notes.</p><p><b>\uD83D\uDCDD</b> : les notes de l'enqu\u00EAte · qui est qui, ce que tu sais, tes preuves.</p>";
 b.append(g);
 const cb=document.createElement("button");cb.className="ifBack";cb.textContent="\u2039 Reprendre la conversation";
 cb.onclick=()=>{o.remove()};b.append(cb);
 o.append(b);$("app").append(o);try{noRubber(o)}catch(e){}
 o.addEventListener("click",e=>{if(e.target===o)o.remove()});
}
function startFromIntro(){unlock();menu();const d=$("in");if(d){d.classList.add("out");setTimeout(()=>{if(d.classList.contains("out"))d.remove()},1100)}}
function homeIntro(){
  if(!INTRO_HTML){try{location.href="./"}catch(x){menu()}return}
  $("vol").hidden=true;
  const old=$("in");if(old&&!old.classList.contains("out"))return;if(old)old.remove();
  const d=document.createElement("div");d.id="in";d.innerHTML=INTRO_HTML;document.body.append(d);
  const im=d.querySelector("#bgi");if(im)im.style.backgroundImage='url('+IMG.menu+')';
  d.querySelector("#go").onclick=startFromIntro;
  const sbi=d.querySelector("#sbi");if(sbi)sbi.onclick=togSnd;setV();
  $("mn").classList.remove("on");amb(null);
  requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add("on")))}
function menu(){veil(0);run++;SK=0;ck();amb(null);$("ov").hidden=true;$("vol").hidden=true;document.body.classList.remove("wa");
 const c=card("Choisis une histoire");STORIES.forEach(s=>{const lk=s.id!=="h";const b=row(c,s.t,s.d,()=>chap(s),lk);if(lk)b.disabled=true});const vd=document.createElement("div");vd.className="verTag";vd.textContent="Entre les lignes · v"+VER;c.append(vd);
 row(c,"⚙ Paramètres de la partie","Thème, son, vitesse de lecture, plein écran, transfert",()=>{volToggle()});show(c);
 setTimeout(()=>{if($("mn").classList.contains("on")){document.body.classList.remove("play");$("chat").innerHTML="";$("ch").innerHTML="";$("chat").style.backgroundImage=""}},700)}
function chap(s){let P={c:0,s:[]};try{P=JSON.parse(localStorage.getItem("pg"+s.id))||P}catch(e){}PG=P;SS=s;
 const c=card(s.t);
 s.ch.forEach((h,i)=>{const w=!!S[h[1]],ok=w&&(i===0||i<P.c);row(c,(i+1)+". "+h[0]+(ok?"":w?" · verrouillé":" · bientôt"),"",()=>{SC=i;$("nm").textContent=s.n;$("av").textContent=s.n[0];start()},!ok)});
 row(c,"‹ Retour","",menu);show(c)}
function gt(d){const i=SC+d,h=SS.ch[i];if(h&&S[h[1]]){SC=i;start()}}
const ib=$("infoB");if(ib)ib.addEventListener("click",e=>{e.stopPropagation();if(typeof notesOv==="function")notesOv(false)});
/* ---- boutons et démarrage ---- */
$("set").onclick=e=>{e.stopPropagation();$("vol").hidden=!$("vol").hidden};
document.addEventListener("pointerdown",e=>{const vv=$("vol");if(vv&&!vv.hidden&&(e.target===vv||(!vv.contains(e.target)&&!$("set").contains(e.target))))vv.hidden=true});
{const tb=$("ttsB");if(tb){const up=()=>{tb.textContent=(TTS_ON?"🎙️":"🔇")+" Voix des appels : "+(TTS_OK()? (TTS_ON?"activées":"désactivées"):"non disponibles sur cet appareil");tb.style.opacity=TTS_OK()?1:.55;tb.disabled=!TTS_OK()};
 const TTS_OK=()=>typeof speechSynthesis!=="undefined";
 up();tb.onclick=()=>{TTS_ON=!TTS_ON;try{localStorage.setItem("etl_tts",TTS_ON?"on":"off")}catch(e){}up()}}}{const tb2=$("thB");if(tb2){const THL={dark:"🌑 Nuit",auto:"🌓 Suit l’histoire",light:"🌤 Jour"};const upT=()=>{tb2.textContent="🌊 Thème : "+THL[THM]};tb2.onclick=()=>{THM=THM==="dark"?"auto":(THM==="auto"?"light":"dark");try{localStorage.setItem("etl_theme",THM)}catch(e){}thApply();upT()};upT()}}
{const fb=$("fsB");if(fb){const FS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);const canFs=document.documentElement&&(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);fb.style.display=canFs?"":"none";const upFs=()=>{fb.textContent=FS()?"⛶ Quitter le plein écran":"⛶ Plein écran"};fb.onclick=()=>{const d=document.documentElement;if(FS()){const ex=document.exitFullscreen||document.webkitExitFullscreen;if(ex)ex.call(document)}else{const rq=d.requestFullscreen||d.webkitRequestFullscreen;if(rq){const p=rq.call(d);if(p&&p.catch)p.catch(()=>{})}}};["fullscreenchange","webkitfullscreenchange"].forEach(ev=>{try{document.addEventListener(ev,upFs)}catch(e){}});upFs()}}
$("ntB").onclick=()=>{$("vol").hidden=true;if(typeof notesOv==="function")notesOv(false)};
{const tr=$("trB");if(tr)tr.onclick=()=>{$("vol").hidden=true;transferOv()};}$("apps").onclick=()=>appHome();
[["v1",x=>VA=x/100],["v2",x=>VS=x/100]].forEach(([i,f])=>{$(i).value=[VA,VS,VV][+i[1]-1]*100;$(i).oninput=e=>{f(+e.target.value);setV()}});$("v3").value=SPD*100;$("v3").oninput=e=>{SPD=+e.target.value/100;try{localStorage.setItem("etl_spd",SPD)}catch(e){}};setV();
$("bk").onclick=()=>{const no=document.getElementById("notesOv");
 if(no){no.remove();if(no.dataset.from==="app")appHome();else applyApp(hdrOf(CAPP,CNM));return}
 const ov=document.getElementById("thrOv");
 if(ov){ov.remove();appHome();return}
 const ho=document.getElementById("appHome");if(ho){ho.remove();applyApp(hdrOf(CAPP,CNM));return}
 menu()};$("nb").onclick=()=>menu();$("fl").textContent="Envoyer un message";
function setView(p){updMob();PC=0;document.body.classList.remove("pc");try{localStorage.setItem("view",0)}catch(e){}}
setView(0)
$("mn").style.backgroundImage="linear-gradient(#000b,#000f),url("+IMG.menu+")";
if($("go")){$("go").onclick=()=>{try{if(matchMedia("(pointer:coarse)").matches&&!document.fullscreenElement){const d=document.documentElement;const rq=(d.requestFullscreen||d.webkitRequestFullscreen);if(rq){const p=rq.call(d);if(p&&p.catch)p.catch(()=>{})}}}catch(e){}startFromIntro()};$("sbi").onclick=togSnd}else{setTimeout(startFromIntro,0)}
addEventListener("pointerdown",()=>{if(!ac){unlock();if(!SK)amb(null)}},{once:true});
(async()=>{const im=$("bgi");if(!im)return;const ld=new Promise(res=>{const t=new Image();t.onload=t.onerror=res;t.src=IMG.menu});im.style.backgroundImage='url('+IMG.menu+')';try{await Promise.race([ld,sl(2500)])}catch(e){}
 requestAnimationFrame(()=>$("in").classList.add("on"));
 setTimeout(()=>Object.values(IMG).forEach(u=>{const i=new Image();i.src=u;if(i.decode)i.decode().catch(()=>0)}),800)})();

/* ---- Améliorations narratives : événements sonores et vraies pièces jointes visuelles ---- */
const addBase = add;
function photoSvg(kind){
 const common='<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#aebbc3"/><stop offset="1" stop-color="#e9d9c8"/></linearGradient><linearGradient id="dark" x2="0" y2="1"><stop stop-color="#443d3c"/><stop offset="1" stop-color="#171b20"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values=".2 0 0 0 .4 .2 0 0 0 .4 .2 0 0 0 .4 0 0 0 .12 0"/></filter></defs>';
 let art='';
 if(kind==='dress') art='<rect width="480" height="360" fill="#d9d5d1"/><rect x="30" y="24" width="420" height="312" rx="8" fill="#eee9df"/><path d="M185 70L215 95H265L295 70L335 110L300 145L285 125V290H195V125L180 145L145 110Z" fill="#182238" stroke="#a5a0a0" stroke-width="4"/><path d="M215 95Q240 120 265 95" fill="none" stroke="#d4c9c3" stroke-width="5"/><path d="M195 290H285L310 318H170Z" fill="#101827"/><path d="M230 45Q240 30 250 45L255 65H225Z" fill="#7d6e61"/><rect x="208" y="210" width="64" height="35" rx="4" fill="#eee4c6"/><text x="240" y="232" font-size="12" text-anchor="middle" fill="#38332d">Lou</text>';
 else if(kind==='church') art='<rect width="480" height="360" fill="url(#sky)"/><path d="M0 255 L480 225 V360 H0Z" fill="#555b60"/><path d="M120 360V84L240 28 360 84V360Z" fill="#614a3c"/><path d="M151 360V110L240 68 329 110V360Z" fill="#322b29"/><path d="M185 360V178Q240 115 295 178V360Z" fill="#171b20"/><path d="M45 0L130 0 90 360 0 360Z" fill="#e6e0d5" opacity=".35"/><path d="M270 360Q260 255 335 225Q385 210 390 280L410 360Z" fill="#9b1f2b"/><path d="M328 233Q367 213 397 250L420 279 304 278Z" fill="#c92c3c"/><path d="M363 266L374 360" stroke="#23252a" stroke-width="8"/><path d="M0 320L480 292" stroke="#d7d2c8" stroke-width="2" opacity=".4"/>';
 else if(kind==='plane') art='<rect width="480" height="360" fill="#b6c6ce"/><rect x="0" y="0" width="480" height="210" fill="#dce3e4"/><path d="M300 -20Q420 0 445 110Q463 194 391 215Q324 226 302 155Q280 87 300 -20Z" fill="#5c7887" stroke="#f4f1e8" stroke-width="20"/><path d="M324 15Q407 36 418 109Q426 161 385 178Q350 187 335 135Q317 84 324 15Z" fill="#8faeba"/><path d="M0 240L480 205V360H0Z" fill="#5d6267"/><path d="M0 250L480 220" stroke="#ddd7ca" stroke-width="4"/><path d="M90 360L160 260 232 360Z" fill="#22262b"/><path d="M230 360L275 280 335 360Z" fill="#393b40"/><path d="M110 360L145 305 178 360Z" fill="#f2f0e9"/><path d="M265 360L288 319 312 360Z" fill="#c3c2bd"/>';
 else if(kind==='beach') art='<rect width="480" height="360" fill="#f0d8b8"/><rect y="0" width="480" height="125" fill="#c4d6db"/><path d="M0 130Q120 105 230 135T480 125V255H0Z" fill="#4f9ba8"/><path d="M0 180Q130 155 250 190T480 175" fill="none" stroke="#d7e8df" stroke-width="8" opacity=".8"/><path d="M0 248Q180 220 480 245V360H0Z" fill="#d5b88f"/><rect x="74" y="36" width="332" height="288" rx="5" fill="#f7f0df" stroke="#9a8c78" stroke-width="5"/><path d="M90 50H390V250H90Z" fill="#75a8b2"/><path d="M90 175Q180 145 250 178T390 165V250H90Z" fill="#337b8a"/><circle cx="205" cy="130" r="25" fill="#e5b38c"/><path d="M178 125Q178 92 209 94Q237 98 231 130L219 114 192 113Z" fill="#4b3830"/><path d="M174 222Q166 164 205 160Q247 164 244 222Z" fill="#e5a05f"/><circle cx="292" cy="137" r="23" fill="#d9a57e"/><path d="M268 131Q266 99 295 102Q323 104 316 139L304 119 280 119Z" fill="#3b3029"/><path d="M260 226Q256 171 293 168Q333 170 330 226Z" fill="#e9e4d5"/><path d="M190 144L204 149M284 148L296 153" stroke="#453a34" stroke-width="4" stroke-linecap="round"/><path d="M90 250H390V304H90Z" fill="#f8f2e5" opacity=".75"/>';
 else art='<rect width="480" height="360" fill="#c4c9c9"/><rect x="40" y="30" width="400" height="300" rx="8" fill="#f2eee5"/><rect x="55" y="45" width="370" height="270" fill="#8298a1"/><path d="M55 240L180 130 255 210 320 150 425 235V315H55Z" fill="#394d58"/><circle cx="340" cy="105" r="30" fill="#d8d1bf"/><path d="M0 320L480 290" stroke="#eee" stroke-width="4" opacity=".6"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">'+common+art+'<rect width="480" height="360" filter="url(#grain)" opacity=".17"/><rect x="8" y="8" width="464" height="344" rx="5" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/></svg>';
}
function addPhoto(kind,caption){
 const card=document.createElement('div');card.className='photo-attachment';
 const img=document.createElement('img');img.className='photo-art';img.alt=caption;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(photoSvg(kind));
 const meta=document.createElement('div');meta.className='photo-meta';meta.innerHTML='<span class="camera">▧</span><span>Pièce jointe · photo</span><span style="margin-left:auto">Maintenant</span>';
 const cap=document.createElement('div');cap.className='photo-caption';cap.textContent=caption;
 card.append(img,meta,cap);$('chat').append(card);$('chat').scrollTop=1e9;
 if(ac){tn(1450,900,.07,.025,.005);setTimeout(()=>tn(900,1250,.045,.018,.005),65)}
}
function arrivalCue(){
 if(!ac||!nz)return;
 // Pas sur sol dur : impacts doux et irréguliers, spatialisés par le filtre déjà utilisé.
 [0,390,820,1190,1580].forEach((delay,i)=>setTimeout(()=>{if(ac&&nz){hit(180+i*9,.11,.055,'lowpass',.008,1.4);tn(95,72,.075,.018,.01)}},delay));
}
add=function(c,x){
 const d=addBase(c,x);
 if(c==='n' && typeof x==='string'){
  if(/(?:descend la passerelle|arrive devant toi|s'approche de toi|s'approche du quai|marche vers toi|vient vers toi|ses pas résonnent|bruits? de pas|arrive en marchant|marche à côté de moi|court avec un parapluie|des pas résonnent)/i.test(x))arrivalCue();
  if(/photo floue arrive|une photo\s*:|une photo arrive|photo :|photo de Camille et Léo|photo avec Camille/i.test(x)){ 
   const kind=/robe bleu nuit|étiquette écrite à la main/i.test(x)?'dress':/parapluie rouge|grande porte de bois|grande porte de l’église/i.test(x)?'church':/escalier roulant|hublot|chaussures/i.test(x)?'plane':/plage|été|rit aux éclats|Camille et Léo/i.test(x)?'beach':'generic';
   const caption=kind==='dress'?'Une robe bleu nuit préparée pour la cérémonie, avec une étiquette manuscrite.':kind==='church'?'Un parapluie rouge devant la porte de l’église, flou sous la pluie.':kind==='plane'?'Ses chaussures dans l’avion, un morceau de hublot et le ciel pâle.':kind==='beach'?'Une photo d’été au bord de l’eau, Camille sourit à côté de Léo.':'Photo reçue';
   addPhoto(kind,caption);
  }
 }
 return d;
};


/* ---- horloge glissante (v2.51) : hissée au top-level — play() top-level utilise clkSet/clkPlan, elles NE DOIVENT PAS rester dans l'IIFE sauvegarde (cf bug STATS v2.50) ---- */
/* ---- horloge glissante : le temps du récit avance entre les messages ---- */
const CLK={h:null,m:0},CLKBASE={h:null,m:0};let CLKMAX=null;
/* ---- v2.82 : thème nuit/jour/auto (auto = suit l'horloge fiction) ---- */

function thEff(){if(THM!=="auto")return THM;let h=null;try{h=CLK.h}catch(e){}return(h!=null&&h>=8&&h<19)?"light":"dark"}
function thApply(){try{document.documentElement.dataset.theme=thEff()}catch(e){}}
thApply();
function clkSet(hm){const q=String(hm).replace("h",":").split(":");CLK.h=+q[0];CLK.m=+q[1];CLKBASE.h=CLK.h;CLKBASE.m=CLK.m;CLKMAX=null;thApply()}
function clkNow(){return CLK.h==null?null:String(CLK.h).padStart(2,"0")+":"+String(CLK.m).padStart(2,"0")}
/* borne : l'horloge ne dérive JAMAIS au-delà du prochain horodatage scénarisé (ni +30 min sans repère) */
function clkScan(id,cand){const n2=S[id];if(!n2)return;for(const[w,x]of n2.m||[]){const q=String(w==="n"?x:"").match(/(\d{1,2})h(\d{2})/);if(q){cand.push({h:+q[1],m:+q[2]});return}}}
function clkPlan(n){CLKMAX=null;if(CLK.h==null||!n)return;
 const cur=CLK.h*60+CLK.m,seen=new Set(),q=[];
 /* BFS borné : le PREMIER horodatage le long de chaque chemin est le seul contraignant */
 const push=(id,dp)=>{if(id&&S[id]&&!seen.has(id)&&dp<=6){seen.add(id);q.push({id,dp})}};
 (n.c||[]).forEach(ch=>ch&&push(ch[1],1));if(n.x)push(n.x,1);if(n.h)push(n.h,1);
 if(n.j){try{push(n.j(st),1)}catch(e){}try{const s2=JSON.parse(JSON.stringify(st));s2.piege=s2.piege?0:1;push(n.j(s2),1)}catch(e){}}
 while(q.length){
  const it=q.shift(),n2=S[it.id];let hasT=null;
  for(const[w,x]of n2.m||[]){const q2=String(w==="n"?x:"").match(/^(\d{1,2})h(\d{2})/);if(q2){hasT={h:+q2[1],m:+q2[2]};break}}
  if(hasT){const v=hasT.h*60+hasT.m;if(v>cur&&(!CLKMAX||v<CLKMAX.h*60+CLKMAX.m))CLKMAX=hasT;continue} /* temps trouvé : chemin stoppé là */
  (n2.c||[]).forEach(ch=>ch&&push(ch[1],it.dp+1));if(n2.x)push(n2.x,it.dp+1);if(n2.h)push(n2.h,it.dp+1);
  if(n2.j){try{push(n2.j(st),it.dp+1)}catch(e){}}
 }}
setInterval(()=>{if(!SK||CLK.h==null)return;
 const cur=CLK.h*60+CLK.m,base=CLKBASE.h*60+CLKBASE.m;
 if(CLKMAX){if(cur>=CLKMAX.h*60+CLKMAX.m-1)return}          /* stoppe juste avant le prochain horodatage */
 else if(cur-base>=30)return;                                  /* dérive max 30 min sans repère */
 CLK.m++;if(CLK.m>59){CLK.m=0;CLK.h=(CLK.h+1)%24}const el=$("clk");if(el)el.textContent=clkNow()},12000);

/* Sauvegarde de reprise */
function toast(t){let d=document.getElementById("edToast");if(!d){d=document.createElement("div");d.id="edToast";document.body.append(d)}d.textContent=t;d.classList.remove("go");void d.offsetWidth;d.classList.add("go");setTimeout(()=>{if(d&&d.parentNode)d.remove()},3600)}
(function(){
 const KEY='etl_resume_v4';let restoring=false,GHOST=false,path=[],seenPro={};nodeNow=null;try{window.__ghost=()=>GHOST}catch(e){}

 function save(){statsTick();try{if(GHOST||!SS||!st||!SK)return;localStorage.setItem(KEY,JSON.stringify({story:SS.id,chapter:SC,node:nodeNow,state:st,chat:$('chat').innerHTML,at:Date.now(),path:path.slice(),apph:APPH,thr:THR,papp:PAPP,pnm:PNM,pre:preChat||undefined}))}catch(e){}}
 const oldPlay=play;
 let preChat=null;
 play=async function(id,r=run){nodeNow=id;if(!GHOST&&SK)path.push(id);preChat=$('chat').innerHTML;save();const v=await oldPlay(id,r);if(r!=run)return v;preChat=null;save();return v};
 const oldFin=fin;fin=function(v,sk){if(GHOST){[523,659,784,1047].forEach((fq,i)=>setTimeout(()=>beep(fq,.6),i*160));ov(v[0],v[1]+'\n\n(Relecture : ta progression et tes fins d\u00E9couvertes restent inchang\u00E9es.)','Revenir aux chapitres',()=>{GHOST=false;chap(SS)},'Menu',()=>{GHOST=false;menu()});return}oldFin(v,sk);save()};
 addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
 const oldMenu=menu;
 menu=function(){GHOST=false;save();stopPro();run++;SK=0;nodeNow=null;try{veil(0)}catch(e){};ck();amb(null);$('ov').hidden=true;
  const c=card('Choisis une histoire');
  const list=document.createElement('div');list.className='bkWrap';c.append(list);
  STORIES.forEach((s,i)=>{
   const locked=s.id!=='h';
   const b=document.createElement('button');b.className='bk'+(locked?' lock':' open');if(locked)b.disabled=true;
   let foot=locked?'En pause \u2014 bient\u00F4t':'Ouvrir le livre \u203a';
   if(!locked){let P=null;try{P=JSON.parse(localStorage.getItem('pg'+s.id))}catch(e){}
    const tot=endsOf(s),got=feN(s);const g=Math.min(got,tot);const fs=g+' fin'+(g>1?'s':'')+' trouv\u00E9e'+(g>1?'s':'');
    if(s.id==='h'){const RN=['','I','II','III','IV','V','VI'];let pp=1;try{pp=Math.min(6,+localStorage.getItem('etl_part_'+s.id)||1)}catch(e){};
     foot='Partie '+RN[pp]+' / VI \u00B7 '+fs}
    else if(P)foot=Math.min(P.c,s.ch.length)+' chapitre \u00B7 '+fs}
   b.innerHTML='<h3>'+s.t+'</h3><p>'+s.d+'</p><div class="bkF">'+foot+'</div>'+(locked?'<span class="bkLock">\uD83D\uDD12 En pause</span>':'');
   if(!locked)b.onclick=()=>chap(s);list.append(b)});
  {const ob=document.createElement('button');ob.className='bk';ob.innerHTML='<h3>⚙ Paramètres de la partie</h3><p>Thème, son, vitesse de lecture, plein écran, transfert</p>';ob.onclick=volToggle;list.append(ob)};
  show(c);
  setTimeout(()=>{if($('mn').classList.contains('on')){document.body.classList.remove('play');$('chat').innerHTML='';$('ch').innerHTML='';$('chat').style.backgroundImage=''}},700)};
 function optCard(){
  const c=card('Options d\u2019affichage');
  const em=document.createElement('button');em.className='st';
  em.innerHTML=emojiMode?'<b>Smileys : jeune & spontan\u00E9 \uD83D\uDE0A</b><small>Les conversations gardent leurs \u00E9motic\u00F4nes \u2014 plus vivantes, plus r\u00E9elles.</small>'
   :'<b>Mode sobre : sans smileys \uD83D\uDCAC</b><small>Lecture plus dramatique \u2014 les \u00E9motic\u00F4nes sont retir\u00E9es des messages.</small>';
  em.onclick=()=>{emojiMode=!emojiMode;try{localStorage.setItem('etl_emoji',emojiMode?'on':'off')}catch(e){};optCard()};
  c.append(em);
  row(c,'\u2039 Retour','',menu);show(c)}
 let proEl=null;
 const stopPro=()=>{if(proEl){try{proEl.pause&&proEl.pause()}catch(e){}proEl=null}try{speechSynthesis.cancel()}catch(e){}};
 const proPlay=(s,txt)=>{if(proEl){stopPro();return}
  if(s.audio){try{proEl=new Audio(s.audio);proEl.onended=()=>{proEl=null};proEl.play().catch(()=>{proEl=null});return}catch(e){}}
  try{const u=new SpeechSynthesisUtterance(String(txt).replace(/\n+/g,'. '));u.lang='fr-FR';u.rate=.95;u.onend=()=>{proEl=null};
   speechSynthesis.cancel();speechSynthesis.speak(u);proEl='synth'}catch(e){}};
 const oldChap=chap;
 const proOf=s=>s.prologue||null; const endsAll=s=>endsList(s);
 const endsOf=s=>endsAll(s).length;
 function endsCard(s){const all=endsAll(s);let got=[];try{got=JSON.parse(localStorage.getItem('fe'+s.id)||'[]').filter(t=>all.includes(t))}catch(e){}
  const c=card('Fins \u2014 '+s.t);
  const list=document.createElement('div');list.className='bkWrap';c.append(list);
  all.forEach(t=>{const ok=got.includes(t);const r=document.createElement('button');r.className='bk'+(ok?' open':' lock');r.disabled=!ok;
   r.innerHTML='<h3>'+(ok?'\u2713 '+t:'\uD83D\uDD12 fin non d\u00E9couverte')+'</h3>';list.append(r)});
  const bk3=document.createElement('button');bk3.className='st back';bk3.innerHTML='<b>‹ Retour</b>';bk3.onclick=()=>chap(s);c.append(bk3);
  show(c)}
 const feN=s=>{try{return(JSON.parse(localStorage.getItem('fe'+s.id)||'[]').filter(t=>endsAll(s).includes(t))).length}catch(e){return 0}};
 try{window.etlMisc={stopPro:stopPro,endsOf:endsOf,feN:feN,endsCard:endsCard}}catch(e){}
 const oldStart=start;start=function(){if(!GHOST){path=[];if(!SC){try{localStorage.removeItem('etl_name_'+SS.id)}catch(e){}}}oldStart()};
 chap=function(s){GHOST=false;SS=s;
  let v=null;try{v=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  const resuming=!!(v&&v.story===s.id&&v.node&&S[v.node]);
  const goChaps=()=>{
   nodeNow=null;
   let P={c:0,s:[]};try{P=JSON.parse(localStorage.getItem('pg'+s.id))||P}catch(e){}
   PG=P;
   const c=card(s.t);
   const list=document.createElement('div');list.className='bkWrap';c.append(list);
   s.ch.forEach((h,i)=>{const w=!!S[h[1]],ok=w&&(i===0||i<P.c);
    const b=document.createElement('button');b.className='bk'+(ok?' open':' lock');if(!ok)b.disabled=true;
    b.innerHTML='<h3>'+(i+1)+'. '+h[0]+'</h3><div class="bkF">'+(ok?(i===SC?'en cours':'\u2713 termin\u00E9'):(w?'\uD83D\uDD12 verrouill\u00E9':'bient\u00F4t'))+'</div>';
    if(ok)b.onclick=()=>{SC=i;$('nm').textContent=s.n;setAv(s.n[0]);start()};
    list.append(b);
    if(ok&&i<Math.max(0,P.c-1)){const rb=document.createElement('button');rb.className='st rp';rb.innerHTML='<b>\u21BA Rejouer en relecture</b><small>Sans toucher \u00E0 ta progression ni \u00E0 tes fins</small>';rb.onclick=()=>{GHOST=true;SC=i;$('nm').textContent=s.n;setAv(s.n[0]);start()};list.append(rb)}});
   {const tot=endsOf(s),got=feN(s);const fb=document.createElement('button');fb.className='bk';
    fb.innerHTML='<h3>\uD83C\uDFC1 Fins : '+Math.min(got,tot)+' / '+tot+'</h3><p>Celles que tu as trouv\u00E9es \u2014 et celles qui t\u2019attendent encore</p>';
    fb.onclick=()=>endsCard(s);list.append(fb)}
   const bk3=document.createElement('button');bk3.className='st back';bk3.innerHTML='<b>‹ Retour</b>';bk3.onclick=()=>menu();c.append(bk3);
   show(c)};
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
   lk('\u2039 Retour','Revenir en arri\u00E8re',()=>{o.remove()});
   o.append(c);document.body.append(o);addBack(c);
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
   row(c,'\u2039 Retour','',menu);show(c)}
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







