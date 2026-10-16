const DEF_AV={'':AVF1,m:AVF2,k:AVM1};
let st,ac,mg,ag,sg,nz,bs,tm=[],CAPP="SMS",APPS_ON=0,PC=0,vo=0,VA=1,VS=.8,VV=1,run=0,SK=0,SS=STORIES[0],SC=0,PG={c:1,s:[]},ADM=0,ADS="",kb="",tp=[],nodeNow=null,EDIT=0;
const $=i=>document.getElementById(i),sl=ms=>new Promise(r=>setTimeout(r,ms));
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
const VER="2.7";console.log("Entre les lignes · v"+VER);
const AM={
gare:{b:["lowpass",130,.04],e:[[26000,()=>Pk([[784,587],[659,523,659],[880,660,784]]).forEach((f,i)=>setTimeout(()=>tn(f,f,R(1.6,2.4),.03,.03),i*750))],[4500,()=>steps(Math.round(R(3,6)))]]},
mer:{b:["lowpass",170,.06],e:[[6000,()=>hit(R(200,320),R(4,7),R(.08,.16),"lowpass",R(1.5,2.5))],[12000,()=>tn(R(1700,2100),R(800,1100),R(.3,.6),.02,.05)]]},
nuit:{b:["lowpass",110,.03],e:[[14000,()=>hit(R(180,300),R(3,5),.04,"lowpass",1.5)],[70000,()=>tn(750,950,3,.008,1)]]}};
AM.foret={b:["lowpass",300,.05],e:[[5200,()=>{const f=R(1800,2700),n=2+(Math.random()*3|0);for(let i=0;i<n;i++)setTimeout(()=>tn(f*R(.96,1.06),f*R(1.18,1.4),R(.07,.15),.035,.012),i*R(110,230))}],[13000,()=>tn(R(2400,3200),R(1400,1800),R(.25,.5),.018,.02)]]};
AM.aube=AM.foret;AM.carnet=AM.gare;
AM.cafe={b:["bandpass",520,.05,.8],e:[[9000,()=>hit(R(1800,2600),.05,R(.05,.1),"bandpass",.01,2)],[17000,()=>{tn(R(2400,3200),R(1200,1600),.08,.02,.03);setTimeout(()=>hit(R(1400,1900),.04,.05,"highpass",.005,1.5),R(120,400))}],[28000,()=>{const f=R(300,420),p=Pk([[f,f*1.19],[f*1.33,f],[f,f*1.5]]);p.forEach((x,i)=>setTimeout(()=>tn(x[0],x[1],R(.3,.5),.012,.01),i*R(180,320)))}]]};
AM.sombre={b:["lowpass",150,.04],e:[[22000,()=>hit(R(160,260),R(3,5),.035,"lowpass",1.4)],[55000,()=>tn(R(600,800),R(400,500),2.5,.006,.8)]]};
const AUTOAMB={cafe:"cafe",bureau:"sombre",archives:"sombre",grange:"nuit",ormes:"nuit",champ:"nuit",voiture:"nuit",train:"gare"};
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
function scene(k,nodeId){const u=(nodeId&&nodeBackgrounds[nodeId])||IMG[k];$("chat").style.backgroundImage=u?"linear-gradient(#0003,#0006),url("+u+")":"";amb(k)}
async function play(id,r=run){
 const n=S[id];if(r!=run)return;
 const pi=$("pI");if(pi)pi.textContent=(SS&&SS.id==="o"&&PART[id])?PART[id]+" / VI":"";
 if(SS&&SS.id==="o"&&PART[id]){try{const pn={I:1,II:2,III:3,IV:4,V:5,VI:6}[PART[id]];const cu=+localStorage.getItem("etl_part_o")||0;if(pn&&pn>cu)localStorage.setItem("etl_part_o",pn)}catch(e){}}
 const abn=$("apps");if(abn)abn.style.display="none";
 if(ADM&&$("a6"))$("a6").textContent=id;
 if(n.j)return play(n.j(st),r);
 if(n.w){scene(n.w,id);try{const sm=JSON.parse(localStorage.getItem("etl_node_sounds")||"{}");if(sm[id])amb(sm[id]);else if(AUTOAMB[n.w])amb(AUTOAMB[n.w])}catch(e){}}
 if(n.pro)await proCards(n.pro);
 if(n.tel){const T=n.tel;await new Promise(q=>telOv(T,q))}
 if(n.app){const tA=n.app,tN=n.nm||"",oC=CAPP,oN=CNM,ck=oC+"|"+oN,nk=tA+"|"+tN;
  if(tA!==oC){APPH[ck]={c:$("chat").innerHTML,h:$("ch").innerHTML};await appSwitch(n)}
  else if(tN!==oN)APPH[ck]={c:$("chat").innerHTML,h:$("ch").innerHTML};
  applyApp(n);
  if(tA!==oC||tN!==oN){const th=APPH[nk];$("chat").innerHTML=(th&&th.c)||"";$("ch").innerHTML=(th&&th.h)||""}
  if(!THR[tA])THR[tA]=[];const lbl=tN||tA;if(!THR[tA].includes(lbl))THR[tA].push(lbl)}
 if(n.call&&!st["cal_"+id]){await new Promise(q=>callOv(n.call,q));st["cal_"+id]=1}
 if(n.k){st.e=n.k;try{const q=JSON.parse(localStorage.getItem("fe"+SS.id)||"[]");if(!q.includes(n.k)){q.push(n.k);localStorage.setItem("fe"+SS.id,JSON.stringify(q))}}catch(e){}}
 for(const[w,x]of n.m||[]){
  if(w=="h"){$("st").textContent="écrit…";ty(1);await sl(Math.min(4200,1050+x.length*44)/SPD);ty(0);if(r!=run)return;$("st").textContent=CAPP;rx();rm();add("h",emojiClean(x));if(SS&&SS.n==="Lou"&&/(je m'appelle lou|moi c'est lou|je suis lou)/i.test(x)){$("nm").textContent="Lou";localStorage.setItem("etl_name_m","Lou");setAv("L");st.named=true}if(SS&&SS.n==="Inès"&&/(je m'appelle in[eè]s|moi c'est in[eè]s|je suis in[eè]s)/i.test(x)){$("nm").textContent="Inès";localStorage.setItem("etl_name_","Inès");setAv("I");st.named=true}if(SS&&SS.n==="Eliott"&&/(je m'appelle eliott|moi c'est eliott|je suis eliott)/i.test(x)){$("nm").textContent="Eliott";localStorage.setItem("etl_name_k","Eliott");setAv("E");st.named=true}await sl(350)}
  else if(w=="s"){lab("sys",emojiClean("ℹ "+x));await sl(Math.min(4200,900+x.length*30)/SPD)}else if(w=="x"){$("nm").textContent=SS.n;setAv(SS.n[0]);st.named=true;try{localStorage.setItem("etl_name_"+SS.id,SS.n)}catch(e){}await sl(300)}else{const q=x.match(/(\d{1,2})h(\d{2})/);if(q){SK=1;const hm=q[1].padStart(2,"0")+":"+q[2];$("clk").textContent=hm;lab("ts","Aujourd'hui "+hm)}add("n",x);await sl(Math.min(7000,900+x.length*34)/SPD)}
  if(r!=run)return}
 if(n.e)return fin(n.e);
 if(n.x)return play(n.x,r);if(!(n.c&&n.c.length))return fin([n.k||"Fin",""]);
 const c=$("ch");c.innerHTML="";
 mkCh(id);
 $("fl").textContent=(n.c||[]).length?"Choisis une réponse ↑":"— fin de ce segment —";$("chat").scrollTop=1e9}
async function proCards(P){const pars=P.slice(1);if(!pars.length)return;
 const o=document.createElement("div");o.className="proOv";document.body.append(o);
 await new Promise(done=>{const show=i=>{const cd=document.createElement("div");cd.className="proCard";
  const k=document.createElement("div");k.className="proK";k.textContent="Prologue \u00B7 "+(i+1)+" / "+pars.length;cd.append(k);
  if(i===0){const h=document.createElement("h2");h.textContent=P[0];cd.append(h)}
  const t=document.createElement("p");t.textContent=pars[i];cd.append(t);
  const d=document.createElement("div");d.className="proDots";pars.forEach((_,j)=>{const e=document.createElement("i");if(j===i)e.className="on";d.append(e)});cd.append(d);
  const b=document.createElement("button");b.className="proBtn";b.textContent=i===pars.length-1?"Reprendre le t\u00E9l\u00E9phone":"Continuer";
  b.onclick=()=>{cd.remove();if(i+1<pars.length)show(i+1);else{o.remove();done()}};cd.append(b);o.replaceChildren(cd)};show(0)})}
function ov(t,x,b,f,b2,f2){$("ot").textContent=t;$("ox").textContent=x;$("ob").textContent=b;$("ob").onclick=()=>{$("ov").hidden=true;f()};$("ob2").hidden=!b2;if(b2){$("ob2").textContent=b2;$("ob2").onclick=()=>{$("ov").hidden=true;f2()}}$("ov").hidden=false}
function telOv(T,done){const o=document.createElement("div");o.id="telOv";const c=document.createElement("div");c.className="tel";
 c.innerHTML='<div class="telTop"><span>'+T[0]+'</span><span>'+T[1]+'</span></div><div class="telMsg"><b>'+T[2]+'</b><p>'+T[3]+'</p></div>';
 const b=document.createElement("button");b.textContent="Continuer";b.onclick=()=>{o.remove();done()};c.append(b);o.append(c);document.body.append(o)}
const TTSOK=typeof speechSynthesis!=="undefined";
let TTS_ON=true;try{TTS_ON=localStorage.getItem("etl_tts")!=="off"}catch(e){}
const CALL_VOICE={Jeanne:{pitch:1.18,rate:1.04},Camille:{pitch:.96,rate:.97},Malik:{pitch:.8,rate:.98},"\u00C9lodie":{pitch:1.05,rate:1}};
function pickFr(){const vs=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang));return vs.find(v=>/google/i.test(v.name))||vs.find(v=>/am\u00E9lie|audrey|marie|celine|julie|female|femme/i.test(v.name))||vs[0]||null}
function callSpeak(txt,nm){if(!TTSOK||!TTS_ON||!txt)return;
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);
 const cfg=CALL_VOICE[nm]||{pitch:1,rate:1};u.pitch=cfg.pitch;u.rate=cfg.rate;u.volume=Math.max(.2,Math.min(1,VS||1));
 const v=pickFr();if(v)u.voice=v;u.lang="fr-FR";speechSynthesis.speak(u)}catch(e){}}
function callSpeakStop(){if(TTSOK){try{speechSynthesis.cancel()}catch(e){}}}
function callOv(T,done){const nm=T[0]||"",sub=T[1]||"Appel en cours",lines=T[2]||[];let vo=null;if(typeof VOICES!=="undefined"&&VOICES[nm]){try{vo=new Audio(VOICES[nm]);vo.loop=true;vo.volume=.9;const p=vo.play();if(p&&p.catch)p.catch(()=>{})}catch(e){vo=null}}
 const o=document.createElement("div");o.id="calOv";
 const ring=document.createElement("div");ring.className="calRing";
 const av=document.createElement("div");av.className="calAv";
 const ph=AVGR[nm[0]];if(ph){av.style.backgroundImage='url('+ph+')'}else av.textContent="\u{1F464}";
 ring.append(av);o.append(ring);
 const ne=document.createElement("div");ne.className="calNm";ne.textContent=nm;o.append(ne);
 const se=document.createElement("div");se.className="calSub";se.textContent=sub;o.append(se);
 const te=document.createElement("div");te.className="calTm";te.textContent="0:00";o.append(te);
 const tr=document.createElement("div");tr.className="calTr";o.append(tr);
 const eb=document.createElement("button");eb.className="calEnd";eb.textContent="Raccrocher";eb.hidden=true;o.append(eb);
 const stopV=()=>{if(vo){try{vo.pause();vo.currentTime=0}catch(e){}vo=null}};
 document.body.append(o);
 beep(880,.09,.05);setTimeout(()=>beep(1175,.12,.045),110);
 let sec=0;const iv=setInterval(()=>{sec++;te.textContent=Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0")},1000);
 let i=0;
 const next=()=>{if(i>=lines.length){eb.hidden=false;return}
  const[sd,tx]=lines[i++];const d=document.createElement("div");
  d.className="calL "+(sd===1?"them":sd===2?"me":"info");d.textContent=tx;tr.append(d);tr.scrollTop=1e9;
  if(sd===1){rx();callSpeak(tx,nm)}
  setTimeout(next,Math.min(4200,1300+tx.length*38)/SPD)};
 setTimeout(next,1000/SPD);
 eb.onclick=()=>{clearInterval(iv);callSpeakStop();o.remove();stopV();done()}}
function endsList(s){const seen={},q=[],out=[];(s.ch||[]).forEach(h=>{if(h[1])q.push(h[1])});
 const FL=["jea","aveu","malik","bloq"];
 while(q.length){const id=q.shift();if(!S[id]||seen[id])continue;seen[id]=1;const n=S[id];
  const t=n.k||(n.e&&n.e[0]);if(t&&!out.includes(t))out.push(t);
  (n.c||[]).forEach(c2=>{if(c2[1])q.push(c2[1])});if(typeof n.x==="string")q.push(n.x);
  if(typeof n.j==="function"){
   for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c2=0;c2<2;c2++)for(let d=0;d<2;d++){
    const st={int:a*3,pov:b*2,prm:c2*2};if(d)FL.forEach(f=>st[f]=1);
    try{const t=n.j(st);if(t&&S[t]&&!seen[t])q.push(t)}catch(e){}}}}
 return out}
function endsTotal(s){return endsList(s).length}
function endScreen(t,x,seen){const tot=endsTotal(SS);
 const o=document.createElement("div");o.id="endOv";
 const c=document.createElement("div");c.className="card";
 const h=document.createElement("h2");h.textContent=t;c.append(h);
 const sub=document.createElement("div");sub.className="endSub";sub.textContent=SS.t;c.append(sub);
 const p=document.createElement("p");p.className="endTxt";p.textContent=x;c.append(p);
 const st2=document.createElement("div");st2.className="endStats";
 const bar=(v,l)=>{const b=document.createElement("div");b.className="ntB";b.innerHTML="<span>"+l+"</span><i style='width:"+Math.min(100,(v||0)*33)+"%'></i>";st2.append(b)};
 bar(st.int,"Intégrité");bar(st.pov,"Preuves du réseau");bar(st.prm,"Preuves du meurtre");c.append(st2);
 const fd=document.createElement("div");fd.className="endFins";const fl=document.createElement("b");fl.textContent="Fins découvertes — "+seen.length+" / "+tot;fd.append(fl);
 const list=document.createElement("div");list.className="endFinsList";
 endsList(SS).forEach(t=>{const r=document.createElement("div");r.className="endFinRow"+(seen.includes(t)?" on":"");
  r.innerHTML=seen.includes(t)?"<span>\u2713</span>"+t.replace(/</g,"&lt;"):"<span>\uD83D\uDD12</span>"+t.replace(/</g,"&lt;");
  list.append(r)});
 fd.append(list);c.append(fd);
 const b1=document.createElement("button");b1.id="ob";b1.textContent="↺ Revivre l'histoire";b1.onclick=()=>{o.remove();SC=0;start()};c.append(b1);
 const b2=document.createElement("button");b2.id="ob2";b2.textContent="Menu des histoires";b2.onclick=()=>{o.remove();menu()};c.append(b2);
 o.append(c);document.body.append(o);
 try{save()}catch(e){}}
function fin([t,x]){st.e=t;PG.s[SC+1]=JSON.parse(JSON.stringify(st));PG.c=Math.max(PG.c,SC+2);let k=[t];
 try{localStorage.setItem("pg"+SS.id,JSON.stringify(PG));k=JSON.parse(localStorage.getItem("fe"+SS.id)||"[]");if(!k.includes(t)){k.push(t);localStorage.setItem("fe"+SS.id,JSON.stringify(k))}}catch(e){}
 [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.6),i*160));
 const nx=(SS.ch[SC+1]||[])[1],ok=!!S[nx],r=run;
 setTimeout(()=>{if(r!=run)return;if(ok){ov(t,x+"\n\nFins vues : "+k.length+" / "+endsTotal(SS),"Chapitre suivant",()=>{SC++;start()},"Menu",menu)}else endScreen(t,x,k)},1800)}
function setAv(t){const a=$("av");if(!a)return;const unk=(!t||t==="\u{1F464}");const ph=unk?"":((SS&&SS.photo)||DEF_AV[SS?SS.id:'']);a.style.backgroundImage=ph?'linear-gradient(#0003,#0006),url("'+ph+'"'+')':'';a.textContent=ph?'':(t||"\u{1F464}")}
const AVGR={C:AVF1,J:AVF2,N:AVM1};let APPH={},PENDING=null,PAPP=null,CNM="",PNM="",THR={};
const PART={d1:"I",d1a:"I",d1b:"I",d1b2:"I",d1c:"I",d1c2:"I",d2:"II",d2c:"II",d2c2:"II",d2c3:"II",d2j:"II",d2j2:"II",d2j3:"II",d2s:"II",d3:"III",d3a:"III",d3b:"III",d3c:"III",d3d:"III",d4:"III",d4a:"III",d4b:"III",d4c:"III",d5:"IV",d5a:"IV",d5b:"IV",d5c:"IV",d5d:"IV",d5d2:"IV",d5d3:"IV",d6:"V",d6a:"V",d6a2:"V",d6a3:"V",d6b:"V",d7:"V",d7a:"V",d7b:"V",d7c:"V",d7c2:"V",d8:"VI",d8t:"VI",d8t2:"VI",d8r:"VI",d8f:"VI",d8k:"VI",d8p:"VI",d8s:"VI",d8z:"VI",d8za:"VI",d8zb:"VI",d8z2:"VI",d9:"VI",d9a:"VI",d9a1:"VI",d9j:"VI",d9a2:"VI",d9b:"VI",d9c:"VI",d10:"VI",d10z:"VI",d10b:"VI",d11a:"VI",d11b:"VI",d11bm:"VI",d11bs:"VI",d11bt:"VI",d11br:"VI",d11c:"VI",d11d:"VI",d11e:"VI",dA:"VI",dB:"VI",dC:"VI",dD:"VI",dE:"VI",dF:"VI",dG:"VI",dH:"VI"};
function applyApp(n){const wa=n.app==="WhatsApp";document.body.classList.toggle("wa",wa);CAPP=n.app;CNM=n.nm||"";
 const ab=$("apps");if(ab&&n.app&&n.app!=="SMS"){APPS_ON=1;ab.style.display="none"}
 $("nm").textContent=n.nm||(SC?SS.n:SS.num);$("st").textContent=n.stx||n.app;
 const av=$("av");if(!av)return;
 if(n.mem&&n.mem.length>1){av.className="av grp";av.style.backgroundImage="";av.textContent="";n.mem.forEach(m=>{const i=document.createElement("img");i.alt=m;i.src=AVGR[m[0]]||"";av.append(i)})}
 else if(n.mem){av.className="av";const ph=AVGR[n.mem[0][0]];av.style.backgroundImage=ph?"linear-gradient(#0003,#0006),url("+ph+")":"";av.textContent=ph?"":n.mem[0][0]}
 else{av.className="av";if(n.app==="Fichiers"){av.style.backgroundImage="";av.textContent="📁"}else setAv(SC?SS.n[0]:"\u{1F464}")}}
function appSwitch(n){return new Promise(res=>{beep(880,.09,.05);setTimeout(()=>beep(1175,.12,.045),95);
 const wa=n.app==="WhatsApp",ic=n.app==="Fichiers"?"📁":(wa?"💬":"📱"),b=document.createElement("div");b.className="notif";
 const snd=n.nm||((n.prev||"").split(" : ")[0])||n.app;
 b.innerHTML='<div class="nIc" style="background:'+(wa?"#0b6b4f":(n.app==="Fichiers"?"#3a3f52":"#6b5bd6"))+'">'+ic+'</div><div><b>'+snd+'</b><small>'+(snd!==n.app?n.app+" · ":"")+(n.prev||"Nouveau message")+'</small></div>';
 $("app").append(b);let done=false;
 const open=()=>{if(done)return;done=true;b.remove();applyApp(n);setTimeout(res,400)};
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
const hdrOf=(app,lbl)=>({app,nm:lbl&&lbl!==app?lbl:null,stx:app==="Fichiers"?"Archive · lecture seule":(app==="WhatsApp"?(lbl==="Les Inoubliables"?"Camille · Jeanne":(lbl||"")):"SMS"),mem:app==="WhatsApp"&&lbl==="Les Inoubliables"?["Camille","Jeanne"]:null});
function goApp(app,lbl){const t=APPH[app+"|"+lbl]||{};applyApp(hdrOf(app,lbl));
 $("chat").innerHTML=t.c||"";$("ch").innerHTML=t.h||"";
 if(app===PAPP&&PENDING&&S[PENDING]&&(PNM||PAPP)===lbl)mkCh(PENDING);
 $("chat").scrollTop=1e9}
function thrOv(app){const o=document.createElement("div");o.id="thrOv";
 $("nm").textContent=app==="SMS"?"Messages":app;$("st").textContent="Conversations";const av=$("av");if(av){av.className="av";av.style.backgroundImage="";av.textContent=app==="SMS"?"📱":"💬"}
 let h='<h2>'+(app==="SMS"?"Messages":app)+'</h2>';
 (THR[app]||[]).forEach(lbl=>{h+='<button class="thrR" data-l="'+lbl+'"><span class="thrA">'+(app==="SMS"?"📱":"💬")+'</span><span class="thrT"><b>'+lbl+'</b></span></button>'});
 h+='<button class="ahBack" id="thrB">‹ Applications</button>';o.innerHTML=h;$("app").append(o);
 o.querySelector("#thrB").onclick=()=>{o.remove();appHome()};
 o.querySelectorAll(".thrR").forEach(b=>b.onclick=()=>{o.remove();goApp(app,b.dataset.l)})}
function notesOv(fromApp){const o=document.createElement("div");o.id="notesOv";o.dataset.from=fromApp?"app":"conv";
 $("nm").textContent="Notes";$("st").textContent="Notes de l'enquête";const av=$("av");if(av){av.className="av";av.style.backgroundImage="";av.textContent="📝"}
 let h='<h2>Notes de l\u2019enqu\u00EAte</h2>';
 if(!SC||SS.id!=="o")h+='<p class="ntR">Pas encore de notes pour cette histoire.</p>';
 else{const s=st||{};
  h+='<b>Qui est qui</b><div class="ntR">L\u00E9o Garnier \u2014 la victime. Analyste informatique, 32 ans.</div><div class="ntR">Camille \u2014 sa compagne.</div><div class="ntR">Jeanne \u2014 sa s\u0153ur. Leur p\u00E8re Michel est mort il y a dix ans.</div><div class="ntR">Malik \u2014 ton co\u00E9quipier.</div><div class="ntR">\u00C9lodie \u2014 ta chef.</div><div class="ntR">Marcel \u2014 le laboureur qui a trouv\u00E9 le corps.</div><div class="ntR">Adrien Valette \u2014 Vigilex S\u00E9curit\u00E9. Le suspect.</div><b>Ce que tu sais</b>';
  const R=(v,t)=>{if(v)h+='<div class="ntR">'+t+'</div>'};
  R(true,"Le corps a \u00E9t\u00E9 d\u00E9plac\u00E9 \u2014 il a pass\u00E9 la nuit sur du b\u00E9ton.");
  R(true,"Un dossier \u00AB ORPH\u00C9E \u00BB verrouill\u00E9 dans le t\u00E9l\u00E9phone de L\u00E9o.");
  R(s.cam||s.jea,"Adrien Valette, chez Vigilex. L\u00E9o le craignait.");
  R(s.prm,"Un utilitaire gris, feu arri\u00E8re gauche cass\u00E9, sorti du parc Vigilex le soir du meurtre.");
  R(s.pov,"Des journaux d\u2019acc\u00E8s hors proc\u00E9dure \u2014 identifiant AV-7734.");
  R(s.jea,"Le coffre de d\u00E9p\u00F4t de Michel Garnier. La r\u00E9f\u00E9rence est chez Jeanne.");
  R(s.cam>=2,"L\u00E9o cachait des copies chez son avocate, Ma\u00EEtre Lemaire.");
  R(s.aveu,"\u00C9lodie sait tout. Le dossier est pass\u00E9 en proc\u00E9dure.");
  R(s.accord,"Tu as accept\u00E9 le march\u00E9 de Valette.");
  R(s.bless,"Tu es bless\u00E9.");
  R(s.bloq,"Tu as bloqu\u00E9 le num\u00E9ro masqu\u00E9 \u2014 il est revenu par e-mail, puis par d\u2019autres canaux.");
  if((s.prm||0)<2)h+='<div class="ntR">\u26A0 Sans preuves mat\u00E9rielles \u2014 utilitaire, sc\u00E8ne \u2014 m\u00EAme la v\u00E9rit\u00E9 risque de ne pas tenir au proc\u00E8s.</div>';
  h+='<b>O\u00F9 tu en es</b>';
  const bar=(v,l)=>{h+='<div class="ntB"><span>'+l+'</span><i style="width:'+Math.min(100,v*33)+'%"></i></div>'};
  bar(s.int||0,"Int\u00E9grit\u00E9");bar(s.pov||0,"Preuves du r\u00E9seau");bar(s.prm||0,"Preuves du meurtre")}
 h+='<button class="ahBack" id="ntB2">'+(fromApp?"‹ Applications":"‹ Revenir à la conversation")+'</button>';o.innerHTML=h;$("app").append(o);
 o.querySelector("#ntB2").onclick=()=>{o.remove();if(fromApp)appHome();else applyApp(hdrOf(CAPP,CNM))}}
function mkCh(id){const n=S[id];if(!n)return;PENDING=id;PAPP=CAPP;PNM=n.nm||"";const c=$("ch");c.innerHTML="";
 (n.c||[]).forEach(([t,nx,ef,rm])=>{const b=document.createElement("button");b.textContent=t;b.onclick=async()=>{c.innerHTML="";$("fl").textContent="Envoyer un message";if(rm==="!"){add("n",emojiClean(t))}else{tx();add("m",emojiClean(rm||t))}for(const k in ef||{})st[k]=["t","care","agency","practical"].includes(k)?(st[k]||0)+ef[k]:ef[k];await sl(rm==="!"?400:500);play(nx,run)};c.append(b)});
 const abm=$("apps");if(abm)abm.style.display=APPS_ON?"":"none";
 $("fl").textContent=(n.c||[]).length?"Choisis une réponse ↑":"— fin de ce segment —";$("chat").scrollTop=1e9}
function start(){run++;SK=1;$("vol").hidden=true;{try{if(!localStorage.getItem("etl_hint")){localStorage.setItem("etl_hint","1");setTimeout(()=>{if(SK)add("sys","💬 Réponds aux messages pour avancer — chaque choix compte. Le menu ‹ en haut à gauche, les réglages ⚙️ à droite.")},1500)}}catch(e){}}$("nm").textContent=SC?SS.n:SS.num;setAv(SC?SS.n[0]:"\u{1F464}");$("clk").textContent="";const p0=$("pI");if(p0)p0.textContent="";
 st=JSON.parse(JSON.stringify(SC&&PG.s[SC]||{t:0,l:0,r:0,v:0,e:""}));
 if(ADM&&ADS){try{Object.assign(st,JSON.parse(ADS))}catch(e){}}
 $("chat").innerHTML="";$("ch").innerHTML="";$("ov").hidden=true;CAPP="SMS";document.body.classList.remove("wa");APPH={};PENDING=null;{const ab=$("apps");if(ab)ab.style.display="none"}$("st").textContent="SMS";unlock();
 document.body.classList.add("play");$("mn").classList.remove("on");play(SS.ch[SC][1])}
/* ---- menus ---- */
const ck=()=>{if(SK)return;$("clk").textContent=new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})};ck();setInterval(ck,30000);
function card(h){const c=document.createElement("div");c.className="card";const e=document.createElement("h2");e.textContent=h;c.append(e);return c}
function row(c,t,d,fn,off){const b=document.createElement("button");b.className="st";b.disabled=!!off;const a=document.createElement("b");a.textContent=t;b.append(a);if(d){const s=document.createElement("small");s.textContent=d;b.append(s)}b.onclick=fn;c.append(b);return b}
function show(c){const m=$("mn");m.replaceChildren(c);m.classList.add("on");addBack(c)}
/* Flèche « retour » en haut à gauche de chaque écran de base : reprend l'action de la ligne « ‹ Retour » de l'écran, sinon revient à l'accueil. */
let INTRO_HTML=(function(){const d=document.getElementById("in");return d?d.innerHTML:""})();
function addBack(c){
  let fn=null;c.querySelectorAll("button.st,button.bk").forEach(b=>{if(/^\u2039\s*Retour/.test(b.textContent.trim()))fn=b.onclick});
  const a=document.createElement("button");a.type="button";a.className="mnBack";a.setAttribute("aria-label","Retour");a.textContent="\u2190";
  a.onclick=fn||homeIntro;c.prepend(a)}
function startFromIntro(){unlock();menu();const d=$("in");if(d){d.classList.add("out");setTimeout(()=>{if(d.classList.contains("out"))d.remove()},1100)}}
function homeIntro(){
  $("vol").hidden=true;
  const old=$("in");if(old&&!old.classList.contains("out"))return;if(old)old.remove();
  const d=document.createElement("div");d.id="in";d.innerHTML=INTRO_HTML;document.body.append(d);
  const im=d.querySelector("#bgi");if(im)im.style.backgroundImage='url('+IMG.menu+')';
  d.querySelector("#go").onclick=startFromIntro;
  const sbi=d.querySelector("#sbi");if(sbi)sbi.onclick=togSnd;setV();
  const v=d.querySelector("#vw2");if(v){v.onclick=()=>setView(!PC);v.textContent=PC?"\uD83D\uDCF1 Mode t\u00E9l\u00E9phone":"\uD83D\uDDA5\uFE0F Mode PC"}
  $("mn").classList.remove("on");amb(null);
  requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add("on")))}
function menu(){run++;SK=0;ck();amb(null);$("ov").hidden=true;$("vol").hidden=true;document.body.classList.remove("wa");
 const c=card("Choisis une histoire");STORIES.forEach(s=>{const lk=s.id!=="o";const b=row(c,s.t,s.d,()=>chap(s),lk);if(lk)b.disabled=true});const vd=document.createElement("div");vd.className="verTag";vd.textContent="Entre les lignes · v"+VER;c.append(vd);
 row(c,"Smiley dans les messages : "+(emojiMode?"activés":"désactivés"),"Activer ou désactiver les emojis selon ton ton de lecture",()=>{emojiMode=!emojiMode;localStorage.setItem("etl_emoji",emojiMode?"on":"off");menu()});const vr=row(c,"Affichage : "+(PC?"PC":"Téléphone"),"Touche pour changer",()=>{setView(!PC);vr.children[0].textContent="Affichage : "+(PC?"PC":"Téléphone")});show(c);
 setTimeout(()=>{if($("mn").classList.contains("on")){document.body.classList.remove("play");$("chat").innerHTML="";$("ch").innerHTML="";$("chat").style.backgroundImage=""}},700)}
function chap(s){let P={c:0,s:[]};try{P=JSON.parse(localStorage.getItem("pg"+s.id))||P}catch(e){}PG=P;SS=s;
 const c=card(s.t);
 s.ch.forEach((h,i)=>{const w=!!S[h[1]],ok=w&&(ADM||i===0||i<P.c);row(c,(i+1)+". "+h[0]+(ok?"":w?" · verrouillé":" · bientôt"),"",()=>{SC=i;$("nm").textContent=s.n;$("av").textContent=s.n[0];start()},!ok)});
 row(c,"‹ Retour","",menu);show(c)}
/* ---- admin ---- */
function adm(on){
 ADM=on;let p=$("adm");if(p)p.remove();if(!on)return;
 p=document.createElement("div");p.id="adm";
 p.style.cssText="position:fixed;z-index:99999;inset:2vh 2vw;overflow:auto;background:#101722;color:#eef5ff;padding:16px;border:1px solid #57769a;border-radius:12px;box-shadow:0 10px 70px #000;font:14px system-ui";
 p.innerHTML=`<header style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><h2 style="margin:0;flex:1">Atelier narratif · ADMIN</h2><button id="a4">Fermer</button></header><p>Modifications locales. Export JSON conseillé avant toute grosse modification.</p><nav style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0"><button data-tab="edit">Dialogues</button><button data-tab="chap">Chapitres</button><button data-tab="ends">Toutes les fins</button><button data-tab="media">Images & sons</button><button data-tab="io">Import / export</button><button id="a3">Retour au jeu</button></nav>
 <section id="tab-edit"><div style="display:grid;grid-template-columns:minmax(180px,1fr) minmax(250px,2fr);gap:12px"><div><label>Rechercher un nœud</label><input id="aeSearch" placeholder="filtrer…" style="width:100%"><select id="aeNodes" size="16" style="width:100%"></select><button id="aeNew">Nouveau nœud</button></div><div><label>Identifiant</label><input id="aeId" style="width:100%"><label>Contenu du nœud (JSON)</label><textarea id="aeJson" style="width:100%;height:300px;background:#07111d;color:#fff"></textarea><button id="aeSave">Enregistrer le dialogue</button><button id="aePreview">Prévisualiser ce nœud</button><p id="aeMsg"></p></div></div></section>
 <section id="tab-chap" hidden><label>Histoire</label><select id="acStory"></select><div style="display:grid;grid-template-columns:1fr 2fr;gap:12px"><select id="acList" size="12"></select><div><label>Titre</label><input id="acTitle" style="width:100%"><label>Nœud de départ</label><input id="acStart" style="width:100%"><button id="acSave">Enregistrer chapitre</button><button id="acAdd">Ajouter chapitre</button><p>Le chapitre N est accessible uniquement après la fin du chapitre N−1 (sauf dans l'atelier admin).</p></div></div></section>
 <section id="tab-ends" hidden><h3>Fins détectées dans les histoires</h3><p>Chaque fin mène au nœud contenant <code>e:[titre, texte]</code> ou <code>k</code>. Clique sur une fin pour ouvrir son nœud dans l'éditeur.</p><div id="aeEnds"></div></section>
 <section id="tab-media" hidden><h3>Bibliothèque de scènes</h3><p>Une scène peut être associée à un nœud avec le champ <code>w</code>. Les champs <code>m</code> décrivent les messages ; <code>e</code> marque une fin.</p><label>Nœud</label><select id="amNode" style="width:100%"></select><label>Clé de scène / ambiance</label><input id="amScene" placeholder="pluie, gare, nuit…" style="width:100%"><label>URL image (facultatif)</label><input id="amImage" placeholder="data:image/... ou URL" style="width:100%"><button id="amSave">Associer au nœud</button><div id="amList"></div></section>
 <section id="tab-io" hidden><button id="aeExport">Exporter JSON complet</button><button id="aeImport">Importer JSON</button><textarea id="aeIO" style="width:100%;height:250px;background:#07111d;color:white"></textarea><p>Le JSON contient les nœuds, chapitres et images. Conserve une copie externe.</p></section>`;
 document.body.append(p);
 const $a=id=>p.querySelector("#"+id);
 p.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{p.querySelectorAll("section[id^=tab-]").forEach(x=>x.hidden=true);$a("tab-"+b.dataset.tab).hidden=false});
 $a("a4").onclick=()=>adm(false);$a("a3").onclick=()=>{adm(false);menu()};
 const nodes=$a("aeNodes"), amNode=$a("amNode");
 function fillNodes(filter=""){nodes.innerHTML="";amNode.innerHTML="";Object.keys(S).sort().filter(k=>k.toLowerCase().includes(filter.toLowerCase())).forEach(k=>{let o=new Option(k,k);nodes.add(o);amNode.add(new Option(k,k))})}
 function editNode(id){if(!S[id])return;$a("aeId").value=id;$a("aeJson").value=JSON.stringify(S[id],null,2);amNode.value=id;$a("aeMsg").textContent=""}
 fillNodes();nodes.onchange=()=>editNode(nodes.value);amNode.onchange=()=>editNode(amNode.value);if(nodeNow&&S[nodeNow])nodes.value=nodeNow;else nodes.selectedIndex=0;editNode(nodes.value);
 $a("aeSearch").oninput=()=>fillNodes($a("aeSearch").value);
 $a("aeSave").onclick=()=>{try{const id=$a("aeId").value.trim();if(!id)throw Error("Identifiant requis");const n=JSON.parse($a("aeJson").value);S[id]=n;try{window.persistNode&&window.persistNode(id)}catch(e){}fillNodes($a("aeSearch").value);nodes.value=id;editNode(id);$a("aeMsg").textContent="Dialogue enregistré en mémoire. Pense à exporter pour le conserver."}catch(e){$a("aeMsg").textContent="Erreur : "+e.message}};
 $a("aeNew").onclick=()=>{const id=prompt("Identifiant unique du nouveau nœud ?");if(!id||S[id])return;S[id]={m:[N("Nouvelle scène.")],c:[]};fillNodes();nodes.value=id;editNode(id)};
 $a("aePreview").onclick=()=>{const id=$a("aeId").value.trim();if(!S[id])return;$("chat").innerHTML="";$("ch").innerHTML="";document.body.classList.add("play");$("mn").classList.remove("on");run++;st=st||{t:0,l:0,r:0,v:0,e:""};adm(false);play(id)};
 STORIES.forEach((x,i)=>$a("acStory").add(new Option(x.n+" — "+x.t,String(i))));
 function chapters(){const stt=STORIES[+$a("acStory").value];$a("acList").innerHTML="";stt.ch.forEach((ch,i)=>$a("acList").add(new Option((i+1)+". "+ch[0]+" → "+ch[1],String(i))));if(stt.ch.length)$a("acList").selectedIndex=0;loadChap()}
 function loadChap(){const ch=STORIES[+$a("acStory").value].ch[+$a("acList").value]||[];$a("acTitle").value=ch[0]||"";$a("acStart").value=ch[1]||""}
 $a("acStory").onchange=chapters;$a("acList").onchange=loadChap;chapters();
 $a("acSave").onclick=()=>{const stt=STORIES[+$a("acStory").value],i=+$a("acList").value,id=$a("acStart").value.trim();if(!S[id])return alert("Le nœud de départ n'existe pas.");stt.ch[i]=[$a("acTitle").value,id];chapters();$a("acList").value=String(i);loadChap()};
 $a("acAdd").onclick=()=>{const title=prompt("Titre du chapitre ?");if(!title)return;const id=prompt("Identifiant du nœud de départ (crée-le dans Dialogues avant)");if(!S[id])return alert("Ce nœud n'existe pas.");STORIES[+$a("acStory").value].ch.push([title,id]);chapters()};
 function endings(){const box=$a("aeEnds");box.innerHTML="";let count=0;for(const id of Object.keys(S)){const n=S[id];if(n.e||n.k){count++;const title=Array.isArray(n.e)?n.e[0]:(n.k||"Fin sans titre");const b=document.createElement("button");b.style.cssText="display:block;width:100%;text-align:left;margin:5px 0;padding:10px";b.textContent=title+" · nœud "+id+" · "+(Array.isArray(n.e)?n.e[1]:"");b.onclick=()=>{$a("tab-ends").hidden=true;$a("tab-edit").hidden=false;nodes.value=id;editNode(id)};box.append(b)}}if(!count)box.textContent="Aucune fin explicite détectée."}
 endings();
 $a("amSave").onclick=()=>{const id=amNode.value,key=$a("amScene").value.trim();try{const n=JSON.parse($a("aeJson").value);if(key)n.w=key;S[id]=n;$a("aeJson").value=JSON.stringify(n,null,2);const url=$a("amImage").value.trim();if(url&&key)IMG[key]=url;$a("aeMsg").textContent="Scène associée. Exporte le projet pour conserver les changements."}catch(e){alert("JSON invalide dans l'éditeur")}};
 $a("amList").innerHTML="<p>Clés d'images : "+Object.keys(IMG).join(", ")+"</p>";
 $a("aeExport").onclick=()=>$a("aeIO").value=JSON.stringify({S,STORIES,IMG},null,2);
 $a("aeImport").onclick=()=>{try{const d=JSON.parse($a("aeIO").value);Object.assign(S,d.S||{});if(d.IMG)Object.assign(IMG,d.IMG);if(d.STORIES)STORIES.splice(0,STORIES.length,...d.STORIES);fillNodes();chapters();endings();alert("Import effectué.")}catch(e){alert("JSON invalide : "+e.message)}};
}
function gt(d){const i=SC+d,h=SS.ch[i];if(h&&S[h[1]]){SC=i;start()}}
addEventListener("keydown",e=>{if(!e.altKey)return;const c=(e.code||"").replace(/^(Digit|Numpad)/,"");if(/^\d$/.test(c)){kb=(kb+c).slice(-4);if(kb=="1510"){e.preventDefault();kb="";
  if(EDIT){adm(false)}
  else if(SS&&SK&&nodeNow&&S[nodeNow])adm(true);
  else toast("Ouvre une histoire puis retape Alt+1510 pour l\u2019\u00E9diter.")}}});
$("clk").parentNode.addEventListener("click",()=>{const n=Date.now();tp=tp.filter(t=>n-t<3000);tp.push(n);if(tp.length>=7){tp=[];
  if(EDIT)adm(false);
  else if(SS&&SK&&nodeNow&&S[nodeNow])adm(true);
  else toast("Ouvre une histoire puis 7 taps sur l\u2019horloge pour l\u2019\u00E9diter.")}});
/* ---- boutons et démarrage ---- */
$("set").onclick=()=>{$("vol").hidden=!$("vol").hidden};
{const tb=$("ttsB");if(tb){const up=()=>{tb.textContent=(TTS_ON?"🎙️":"🔇")+" Voix des appels : "+(TTS_OK()? (TTS_ON?"activées":"désactivées"):"non disponibles sur cet appareil");tb.style.opacity=TTS_OK()?1:.55;tb.disabled=!TTS_OK()};
 const TTS_OK=()=>typeof speechSynthesis!=="undefined";
 up();tb.onclick=()=>{TTS_ON=!TTS_ON;try{localStorage.setItem("etl_tts",TTS_ON?"on":"off")}catch(e){}up()}}}$("ntB").onclick=()=>{$("vol").hidden=true;if(typeof notesOv==="function")notesOv(false)};$("apps").onclick=()=>appHome();
$("vw2").onclick=()=>setView(!PC);
[["v1",x=>VA=x/100],["v2",x=>VS=x/100]].forEach(([i,f])=>{$(i).value=[VA,VS,VV][+i[1]-1]*100;$(i).oninput=e=>{f(+e.target.value);setV()}});$("v3").value=SPD*100;$("v3").oninput=e=>{SPD=+e.target.value/100;try{localStorage.setItem("etl_spd",SPD)}catch(e){}};setV();
$("bk").onclick=()=>{const no=document.getElementById("notesOv");
 if(no){no.remove();if(no.dataset.from==="app")appHome();else applyApp(hdrOf(CAPP,CNM));return}
 const ov=document.getElementById("thrOv");
 if(ov){ov.remove();appHome();return}
 const ho=document.getElementById("appHome");if(ho){ho.remove();applyApp(hdrOf(CAPP,CNM));return}
 menu()};$("nb").onclick=()=>menu();$("fl").textContent="Envoyer un message";
function setView(p){PC=p?1:0;document.body.classList.toggle("pc",!!PC);const vwE=$("vw");if(vwE)vwE.textContent=PC?"📱":"🖥️";{const v2=$("vw2");if(v2)v2.textContent=PC?"📱 Mode téléphone":"🖥️ Mode PC"}try{localStorage.setItem("view",PC)}catch(e){}}
$("vw2").onclick=()=>setView(!PC);try{const v=localStorage.getItem("view");setView(v===null?(matchMedia("(min-width:900px) and (hover:hover)").matches?1:0):+v)}catch(e){setView(0)}
$("mn").style.backgroundImage="linear-gradient(#000b,#000f),url("+IMG.menu+")";
$("go").onclick=startFromIntro;
$("sbi").onclick=togSnd;
addEventListener("pointerdown",()=>{if(!ac){unlock();if(!SK&&!ADM)amb(null)}},{once:true});
(async()=>{const im=$("bgi");const ld=new Promise(res=>{const t=new Image();t.onload=t.onerror=res;t.src=IMG.menu});im.style.backgroundImage='url('+IMG.menu+')';try{await Promise.race([ld,sl(2500)])}catch(e){}
 requestAnimationFrame(()=>$("in").classList.add("on"));
 setTimeout(()=>Object.values(IMG).forEach(u=>{const i=new Image();i.src=u;if(i.decode)i.decode().catch(()=>0)}),800)})();

/* ---- Améliorations narratives : événements sonores et vraies pièces jointes visuelles ---- */
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
 // Pas sur sol dur : impacts doux et irréguliers, spatialisés par le filtre déjà utilisé.
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


/* Sauvegarde de reprise + atelier d'administration */
(function(){
 const KEY='etl_resume_v4';let restoring=false,GHOST=false,path=[],seenPro={};nodeNow=null;
 function save(){try{if(GHOST||!SS||!st||!SK)return;localStorage.setItem(KEY,JSON.stringify({story:SS.id,chapter:SC,node:nodeNow,state:st,chat:$('chat').innerHTML,at:Date.now(),path:path.slice(),apph:APPH,thr:THR,papp:PAPP,pnm:PNM}))}catch(e){}}
 const oldPlay=play;
 play=async function(id,r=run){nodeNow=id;if(!GHOST&&SK)path.push(id);const v=await oldPlay(id,r);save();return v};
 const oldFin=fin;fin=function(v){if(GHOST){[523,659,784,1047].forEach((fq,i)=>setTimeout(()=>beep(fq,.6),i*160));ov(v[0],v[1]+'\n\n(Relecture : ta progression et tes fins d\u00E9couvertes restent inchang\u00E9es.)','Revenir aux chapitres',()=>{GHOST=false;chap(SS)},'Menu',()=>{GHOST=false;menu()});return}oldFin(v);save()};
 addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
 const oldMenu=menu;
 menu=function(){GHOST=false;save();stopPro();if(EDIT)adm(false);run++;SK=0;nodeNow=null;updateRail&&EDIT&&updateRail();ck();amb(null);$('ov').hidden=true;
  const c=card('Choisis une histoire');
  const list=document.createElement('div');list.className='bkWrap';c.append(list);
  STORIES.forEach((s,i)=>{
   const locked=s.id!=='o';
   const b=document.createElement('button');b.className='bk'+(locked?' lock':' open');if(locked)b.disabled=true;
   let foot=locked?'En pause \u2014 bient\u00F4t':'Ouvrir le livre \u203a';
   if(!locked){let P=null;try{P=JSON.parse(localStorage.getItem('pg'+s.id))}catch(e){}
    const tot=endsOf(s),got=feN(s);const g=Math.min(got,tot);const fs=g+' fin'+(g>1?'s':'')+' trouv\u00E9e'+(g>1?'s':'');
    if(s.id==='o'){const RN=['','I','II','III','IV','V','VI'];let pp=1;try{pp=Math.min(6,+localStorage.getItem('etl_part_o')||1)}catch(e){};
     foot='Partie '+RN[pp]+' / VI \u00B7 '+fs}
    else if(P)foot=Math.min(P.c,s.ch.length)+' chapitre \u00B7 '+fs}
   b.innerHTML='<h3>'+s.t+'</h3><p>'+s.d+'</p><div class="bkF">'+foot+'</div>'+(locked?'<span class="bkLock">\uD83D\uDD12 En pause</span>':'');
   if(!locked)b.onclick=()=>chap(s);list.append(b)});
  {const ob=document.createElement('button');ob.className='bk';ob.innerHTML='<h3>⚙ Options d\u2019affichage</h3><p>Smileys, affichage t\u00E9l\u00E9phone ou PC</p>';ob.onclick=optCard;list.append(ob)}
  show(c);
  setTimeout(()=>{if($('mn').classList.contains('on')){document.body.classList.remove('play');$('chat').innerHTML='';$('ch').innerHTML='';$('chat').style.backgroundImage=''}},700)};
 function optCard(){
  const c=card('Options d\u2019affichage');
  const em=document.createElement('button');em.className='st';
  em.innerHTML=emojiMode?'<b>Smileys : jeune & spontan\u00E9 \uD83D\uDE0A</b><small>Les conversations gardent leurs \u00E9motic\u00F4nes \u2014 plus vivantes, plus r\u00E9elles.</small>'
   :'<b>Mode sobre : sans smileys \uD83D\uDCAC</b><small>Lecture plus dramatique \u2014 les \u00E9motic\u00F4nes sont retir\u00E9es des messages.</small>';
  em.onclick=()=>{emojiMode=!emojiMode;try{localStorage.setItem('etl_emoji',emojiMode?'on':'off')}catch(e){};optCard()};
  c.append(em);
  row(c,'Affichage : '+(PC?'PC':'T\u00E9l\u00E9phone'),'Adapte la mise en page \u00E0 ton \u00E9cran',()=>{setView(!PC);optCard()});
  row(c,'\u2039 Retour','',menu);show(c)}
 let proEl=null;
 const stopPro=()=>{if(proEl){try{proEl.pause&&proEl.pause()}catch(e){}proEl=null}try{speechSynthesis.cancel()}catch(e){}};
 const proPlay=(s,txt)=>{if(proEl){stopPro();return}
  if(s.audio){try{proEl=new Audio(s.audio);proEl.onended=()=>{proEl=null};proEl.play().catch(()=>{proEl=null});return}catch(e){}}
  try{const u=new SpeechSynthesisUtterance(String(txt).replace(/\n+/g,'. '));u.lang='fr-FR';u.rate=.95;u.onend=()=>{proEl=null};
   speechSynthesis.cancel();speechSynthesis.speak(u);proEl='synth'}catch(e){}};
 const oldChap=chap;
 const PRO_INES='Paris, un jeudi de novembre, 22 h 47.\n\nTu t\u2019appelles Sam. Tu viens de t\u2019enfuir d\u2019un d\u00EEner de coll\u00E8gues avant le dessert \u2014 comme toujours. Les grandes conversations, c\u2019est pour les autres.\n\nDans le hall 1 de la gare de Lyon, un carnet de cuir noir, oubli\u00E9 sur un banc. Pas de nom. Juste, \u00E0 la derni\u00E8re page, un num\u00E9ro de t\u00E9l\u00E9phone et une consigne : \u00AB \u00C9cris-moi quand m\u00EAme. \u00BB\n\nLe num\u00E9ro est muet depuis quatorze mois. Tu es curieux \u2014 trop, parfois. Ce soir, tu vas envoyer le premier message.';
 const PRO_LOU='Un samedi de pluie, 14 h 12.\n\nTu t\u2019appelles Sam. Tu ranges des cartons, la fen\u00EAtre ouverte sur un ciel gris. Un SMS tombe, d\u2019un num\u00E9ro inconnu : \u00AB Dis-moi juste si je dois entrer. Je suis devant l\u2019\u00E9glise et je n\u2019arrive plus \u00E0 ouvrir la porti\u00E8re. \u00BB\n\nCe message ne t\u2019est pas destin\u00E9. Une inconnue s\u2019appr\u00EAte \u00E0 entrer dans une \u00E9glise pour une c\u00E9r\u00E9monie dont tu ne sais rien \u2014 un deuil, un amour, une histoire qui ne te regardait pas.\n\nTu es le genre de personne qui r\u00E9pond. M\u00EAme quand \u00E7a ne te regarde pas.';
 const PRO_KERLO='\u00CEle de Kerlo, 6 h 40. Le ferry s\u2019\u00E9loigne dans la brume \u2014 il ne reviendra que mardi.\n\nTu t\u2019appelles Sam. Tu as accept\u00E9 un remplacement d\u2019un mois dans une station m\u00E9t\u00E9o au bout du monde : du vent, une radio qui gr\u00E9sille, un phare, et personne d\u2019autre.\n\nSur la table de la cuisine, un mot \u00E0 l\u2019encre bleue : \u00AB Si \u00E7a coince, \u00E9cris-moi. E. \u00BB Eliott, le m\u00E9t\u00E9orologue que tu remplaces, est reparti sans dire pourquoi.\n\nIl ne te reste qu\u2019une chose \u00E0 faire : \u00E9crire \u2014 ou te d\u00E9brouiller seul.';
 const DEF_PRO={'':PRO_INES,m:PRO_LOU,k:PRO_KERLO};
 const proOf=s=>s.prologue||DEF_PRO[s.id]||null;
 const endsAll=s=>{const seen={},q=[],out=[];s.ch.forEach(h=>{if(h[1])q.push(h[1])});
  while(q.length){const id=q.shift();if(!S[id]||seen[id])continue;seen[id]=1;const n=S[id];
   if(n.e||n.k){const t=(n.e&&n.e[0])||'Fin sans titre';if(!out.includes(t))out.push(t)}
   (n.c||[]).forEach(c=>{if(c[1])q.push(c[1])});if(typeof n.x==='string')q.push(n.x);
   if(typeof n.j==='function'){try{const t=n.j({});if(t)q.push(t)}catch(e){}}}
  return out};
 const endsOf=s=>endsAll(s).length;
 function endsCard(s){const all=endsAll(s);let got=[];try{got=JSON.parse(localStorage.getItem('fe'+s.id)||'[]')}catch(e){}
  const c=card('Fins \u2014 '+s.t);
  all.forEach(t=>{const ok=got.includes(t);const r=document.createElement('button');r.className='st endRow'+(ok?'':' lock');
   r.innerHTML='<b>'+(ok?t:'\uD83D\uDD12 fin non d\u00E9couverte')+'</b>';c.append(r)});
  row(c,'\u2039 Retour','',()=>chap(s));show(c)}
 const feN=s=>{try{return(JSON.parse(localStorage.getItem('fe'+s.id)||'[]')).length}catch(e){return 0}};
 const oldStart=start;start=function(){if(!GHOST){path=[];if(!SC){try{localStorage.removeItem('etl_name_'+SS.id)}catch(e){}}}oldStart()};
 chap=function(s){if(EDIT)adm(false);GHOST=false;SS=s;
  let v=null;try{v=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  const resuming=!!(v&&v.story===s.id&&v.node&&S[v.node]);
  const goChaps=()=>{
   nodeNow=null;if(EDIT)updateRail();
   let P={c:0,s:[]};try{P=JSON.parse(localStorage.getItem('pg'+s.id))||P}catch(e){}
   PG=P;
   const c=card(s.t);
   const tot=endsOf(s),got=feN(s);
   s.ch.forEach((h,i)=>{const w=!!S[h[1]],ok=w&&(ADM||i===0||i<P.c);
    const b=row(c,(i+1)+'. '+h[0]+(ok?'':w?' \u00B7 verrouill\u00E9':' \u00B7 bient\u00F4t'),'',()=>{SC=i;$('nm').textContent=s.n;setAv(s.n[0]);start()},!ok);
    if(ok&&i<Math.max(0,P.c-1)){const rb=document.createElement('button');rb.className='st rp';rb.innerHTML='<b>\u21BA Rejouer en relecture</b><small>Sans toucher \u00E0 ta progression ni \u00E0 tes fins</small>';rb.onclick=()=>{GHOST=true;SC=i;$('nm').textContent=s.n;setAv(s.n[0]);start()};b.after(rb)}});
   if(s.id==='o'){const tot=endsOf(s),g0=feN(s);row(c,'\uD83C\uDFC1 Fins : '+Math.min(g0,tot)+' / '+tot,'Celles que tu as trouv\u00E9es \u2014 et celles qui t\u2019attendent encore',()=>endsCard(s))}
   row(c,'\u2039 Retour','',menu);show(c)};
  const goList=()=>{stopPro();
   if(!resuming)return goChaps();
   const o=document.createElement('div');o.className='rsOv';
   const c=card(s.t);
   const lk=(t,d,fn,cls)=>{const b=document.createElement('button');b.className='bk'+(cls?' '+cls:'');b.innerHTML='<h3>'+t+'</h3><p>'+d+'</p>';b.onclick=fn;c.append(b);return b};
   lk('Reprendre la conversation','Chapitre '+Math.min((v.chapter||0)+1,((s.ch&&s.ch.length)||1))+' / '+((s.ch&&s.ch.length)||1)+' · '+(()=>{try{const f=JSON.parse(localStorage.getItem('fe'+s.id)||'[]');return f.length+' fin'+(f.length>1?'s':'')+' vue'+(f.length>1?'s':'')}catch(e){return ''}})()+' — arrêt le '+new Date(v.at).toLocaleString('fr-FR'),()=>{o.remove();resume(v)},'open');
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
   row(c,'\u25B6 '+(s.audio?'\u00C9couter la narration':'\u00C9couter (voix automatique)'),s.audio?'La narration enregistr\u00E9e de l\u2019histoire':'Aucun fichier joint : synth\u00E8se vocale du navigateur',()=>proPlay(s,pro));
   row(c,'\u25B6 '+(resuming?'Reprendre':'Commencer'),resuming?'Ta partie t\u2019attend juste apr\u00E8s.':'D\u00E9couvre l\u2019histoire',goList);
   row(c,'\u2039 Retour','',menu);show(c)}
  else goList()};
 function resume(v){const story=STORIES.find(x=>x.id===v.story);if(!story)return;SS=story;SC=Math.min(v.chapter||0,story.ch.length-1);try{PG=JSON.parse(localStorage.getItem('pg'+SS.id))||{c:1,s:[]}}catch(e){PG={c:1,s:[]}}st=v.state||{t:0,l:0,r:0,v:0,e:''};run++;SK=1;document.body.classList.add('play');$('mn').classList.remove('on');const nmd=!!((v.state&&v.state.named)||SC>0||localStorage.getItem('etl_name_'+SS.id)===SS.n);$('nm').textContent=nmd?SS.n:SS.num;setAv(nmd?SS.n[0]:"\u{1F464}");$('chat').innerHTML=v.chat||'';$('ch').innerHTML='';$('ov').hidden=true;$('vol').hidden=true;unlock();nodeNow=v.node;path=v.path?v.path.slice():[v.node];APPH=v.apph||{};THR=v.thr||{};PAPP=v.papp||null;PNM=v.pnm||'';
  const n=S[v.node];if(n&&n.c)n.c.forEach(([label,next,effect,rmsg])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{ $('ch').innerHTML='';if(rmsg==='!')add('n',label);else add('m',rmsg||label);for(const k in effect)st[k]=['t','care','agency','practical'].includes(k)?(st[k]||0)+effect[k]:effect[k];save();play(next)};$('ch').append(b)});save()
 }
 const oldAdm=adm;
 /* ================= MODE ADMIN v4 : simulateur éditable en place ================= */
 const LSN='etl_nodes_v2',LSI='etl_img_v2',LSS='etl_stories_v2';
 const jg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v||d}catch(e){return d}};
 const fnRev=o=>{if(o&&typeof o==='object')for(const k in o){if(k==='j'&&typeof o.j==='string')o.j=new Function('return ('+o.j+')')();else fnRev(o[k])}return o};
 const NP=fnRev(jg(LSN,{})),IP=jg(LSI,{}),SP=jg(LSS,{});
 for(const k in NP){if(NP[k]===null)delete S[k];else if(NP[k])S[k]=NP[k]}
 for(const k in IP){if(IP[k]===null)delete IMG[k];else if(IP[k])IMG[k]=IP[k]}
 STORIES.forEach(x=>{if(SP[x.id])Object.assign(x,SP[x.id])});
 const pu=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
 const fnSer=(k,v)=>typeof v==='function'?v.toString():v;
 const persistNode=id=>{NP[id]=JSON.parse(JSON.stringify(S[id],fnSer));pu(LSN,NP)};
 const saveImgs=()=>pu(LSI,IP),saveStories=()=>pu(LSS,SP);
 const bgMap=(typeof nodeBackgrounds==='object'&&nodeBackgrounds)?nodeBackgrounds:jg('etl_node_backgrounds',{});
 const sndMap=jg('etl_node_sounds',{});
 const saveBg=()=>{try{localStorage.setItem('etl_node_backgrounds',JSON.stringify(bgMap))}catch(e){}};
 const saveSnd=()=>{try{localStorage.setItem('etl_node_sounds',JSON.stringify(sndMap))}catch(e){}};
 const allIds=()=>Object.keys(S).sort();
 const FXK=['t','care','agency','practical'];
 let pop=null,edQ=[],edAuto=false,edTimer=null;
 /* --- annulation (undo) --- */
 let undoStack=[],lastSnap='';
 function pushSnap(){try{const s=JSON.stringify({S:S,stories:STORIES,bg:bgMap,snd:sndMap},fnSer);
   if(s===lastSnap)return;lastSnap=s;
   undoStack.push({t:'full',d:s});if(undoStack.length>30)undoStack.shift()}catch(e){}}
 function pushSnapImg(k){undoStack.push({t:'img',k:k,old:IMG[k],oldP:IP[k]})}
 function undo(){const s=undoStack.pop();if(!s){lastSnap='';return toast('Rien \u00E0 annuler.')}
  try{
   if(s.t==='img'){if(s.old===undefined){delete IMG[s.k];if(s.oldP===undefined)delete IP[s.k]}else{IMG[s.k]=s.old;if(s.oldP!==undefined)IP[s.k]=s.oldP}saveImgs()}
   else{const d=fnRev(JSON.parse(s.d));
    for(const k in S)delete S[k];for(const k in d.S)S[k]=d.S[k];pu(LSN,d.S?JSON.parse(JSON.stringify(d.S,fnSer)):NP);
    if(d.stories){STORIES.splice(0,STORIES.length,...d.stories);saveStories()}
    for(const k in bgMap)delete bgMap[k];if(d.bg)Object.assign(bgMap,d.bg);saveBg();
    for(const k in sndMap)delete sndMap[k];if(d.snd)Object.assign(sndMap,d.snd);saveSnd();
    lastSnap=s.d}
   closePop();edRefresh();updateRail();toast('Annul\u00E9 \u21A9')}catch(e){}}
 /* --- utilitaires UI --- */
 window.toast=toast;window.persistNode=persistNode;function toast(t){let d=$('edToast');if(!d){d=document.createElement('div');d.id='edToast';document.body.append(d)}d.textContent=t;d.classList.remove('go');void d.offsetWidth;d.classList.add('go');setTimeout(()=>{if(d&&d.parentNode)d.remove()},3600)}
 function closePop(){if(pop){pop.remove();pop=null}}
 function openPop(html){closePop();pop=document.createElement('div');pop.id='edPop';pop.innerHTML=html;document.body.append(pop);pop.addEventListener('click',e=>{if(e.target===pop)closePop()});return pop}
 function needNode(){if(nodeNow&&S[nodeNow])return nodeNow;toast('Ouvre une histoire et rends-toi sur un point du r\u00E9cit.');return null}
 /* ================= lecteur pas-à-pas ================= */
 function edScene(id){const n=S[id]||{};scene(n.w||null,id);
  if(sndMap[id]==='__off')amb(null);else if(sndMap[id])amb(sndMap[id])}
 function bubble(t,x,ni){const d=document.createElement('div');
  d.className=t==='h'?'b h':t==='m'?'b m':t==='s'?'sys':'b n';d.textContent=x;
  if(ni!=null){d.classList.add('ed');d.title='Cliquer pour modifier';d.onclick=()=>{if(EDIT)msgEditor(nodeNow,ni,d)}}
  $('chat').append(d);$('chat').scrollTop=1e9;return d}
 function edRender(id){if(!id||!S[id])return;nodeNow=id;
  clearTimeout(edTimer);edAuto=false;edQ=[];closePop();
  const n=S[id];
  $('chat').innerHTML='';$('ch').innerHTML='';
  edScene(id);
  (n.m||[]).forEach((mm,si)=>edQ.push({t:mm[0],x:mm[1],si:si}));
  st=st||{t:0,l:0,r:0,v:0,e:''};
  updateRail();
  if(!edQ.length)edFinish(id)}
 function edStep(){if(!EDIT||!nodeNow)return;const id=nodeNow;
  if(!edQ.length){edFinish(id);return}
  const it=edQ.shift();
  if(it.t==='x'){$('nm').textContent=SS.n;setAv(SS.n[0])}
  else bubble(it.t,it.x,it.si);
  if(!edQ.length&&!edAuto)edFinish(id);
  updateRail()}
 function edRunAuto(){if(!edQ.length){edAuto=false;edFinish(nodeNow);updateRail();return}
  edStep();
  if(edQ.length)edTimer=setTimeout(edRunAuto,650);else{edAuto=false;edFinish(nodeNow)}
  updateRail()}
 function edFinish(id){const n=S[id];if(!n)return;const c=$('ch');c.innerHTML='';
  if(n.e||n.k){const d=document.createElement('div');d.className='b n';d.textContent='\uD83C\uDFC1 '+(n.e?n.e[0]:n.k);$('chat').append(d);
   const b=document.createElement('button');b.textContent='Modifier cette fin';b.onclick=()=>finEditor(id);c.append(b)}
  else if(typeof n.j==='function'){let tgt=null;try{tgt=n.j(st)}catch(e){}
   const d=document.createElement('div');d.className='b n';d.textContent='\uD83D\uDCAC Selon tes choix pr\u00E9c\u00E9dents\u2026';$('chat').append(d);
   if(tgt&&S[tgt]){const b=document.createElement('button');b.title=tgt;b.textContent='Voir la suite de cette sc\u00E8ne';b.onclick=()=>edRender(tgt);c.append(b)}}
  else if(n.x){const b=document.createElement('button');b.title=n.x;b.textContent='Continuer';b.onclick=()=>edRender(n.x);c.append(b)}
  (n.c||[]).forEach((ch,i)=>{const b=document.createElement('button');b.textContent=ch[0];
   b.onclick=()=>{c.innerHTML='';bubble(ch[3]==='!'?'n':'m',ch[3]==='!'?ch[0]:(ch[3]||ch[0]));const ef=ch[2]||{};for(const k in ef)st[k]=FXK.includes(k)?(st[k]||0)+ef[k]:ef[k];setTimeout(()=>edRender(ch[1]),350)};
   const p=document.createElement('span');p.className='edp';p.textContent='\u270E';p.title='Modifier ce choix';
   p.onclick=e=>{e.stopPropagation();e.preventDefault();choiceEditor(id,i)};b.append(p);c.append(b)});
  if(!(n.e||n.k)&&!(typeof n.j==='function')&&!n.x){const a=document.createElement('button');a.className='edAdd';a.textContent='\uFF0B Ajouter un choix';a.onclick=()=>choiceEditor(id,-1);c.append(a)}
  $('chat').scrollTop=1e9}
 function edRefresh(){if(nodeNow&&S[nodeNow])edRender(nodeNow);else updateRail()}
 /* ================= éditeurs ================= */
 const MT=[['h','Message re\u00E7u'],['m','Message envoy\u00E9'],['n','Narration'],['s','Info syst\u00E8me'],['x','R\u00E9v\u00E9ler le pr\u00E9nom']];
 function msgEditor(id,idx,el){const n=S[id];if(!n||!n.m||!n.m[idx])return;const cur=n.m[idx];
  const p=openPop('<b>Message '+(idx+1)+' / '+n.m.length+' \u2014 sc\u00E8ne <span class="mono">'+id+'</span></b>'
   +'<label>Type</label><select id="pmT">'+MT.map(m=>'<option value="'+m[0]+'"'+(m[0]===cur[0]?' selected':'')+'>'+m[1]+'</option>').join('')+'</select>'
   +'<label>Texte</label><textarea id="pmX"></textarea>'
   +'<div class="pb"><button id="pmSave" class="pa">Enregistrer</button><button id="pmIns">Ins\u00E9rer un message apr\u00E8s</button><button id="pmDel" class="pw">Supprimer</button><button id="pmCl">Annuler</button></div>');
  p.querySelector('#pmX').value=cur[1]||'';
  p.querySelector('#pmSave').onclick=()=>{const t=p.querySelector('#pmT').value,x=p.querySelector('#pmX').value;if(!x.trim())return toast('Le message est vide.');
   pushSnap();n.m[idx]=[t,x];persistNode(id);closePop();
   if(el&&t==='x'){el.remove()}
   else if(el){el.textContent=x;el.className=(t==='h'?'b h':t==='m'?'b m':t==='s'?'sys':'b n')+' ed'}
   toast('Message enregistr\u00E9 \u2713')};
  p.querySelector('#pmIns').onclick=()=>{pushSnap();n.m.splice(idx+1,0,['n','(nouveau message)']);persistNode(id);closePop();edRefresh()};
  p.querySelector('#pmDel').onclick=()=>{if(!confirm('Supprimer ce message ?'))return;pushSnap();n.m.splice(idx,1);persistNode(id);closePop();edRefresh()};
  p.querySelector('#pmCl').onclick=closePop}
 function choiceEditor(id,i){const n=S[id];if(!n)return;n.c=n.c||[];const cur=i>=0?(n.c[i]||['','','']):['','',''];const ef=cur[2]||{};
  const p=openPop('<b>'+(i>=0?'Choix '+(i+1):'Nouveau choix')+' \u2014 sc\u00E8ne <span class="mono">'+id+'</span></b>'
   +'<label>Texte du choix</label><textarea id="pcL" style="min-height:44px"></textarea>'
    +'<label>Quand le joueur choisit cette r\u00E9ponse</label><select id="pcM"><option value="send">Sam envoie le texte du choix en SMS</option><option value="custom">Sam envoie une autre phrase</option><option value="act">Action : le texte s\u2019affiche en narration, pas de SMS</option></select>'
    +'<textarea id="pcR" placeholder="La phrase que Sam envoie r\u00E9ellement\u2026 (pour \u00AB autre phrase \u00BB)" style="min-height:44px"></textarea>'
   +'<label>Effets (facultatifs)</label><div class="pfx">'+FXK.map(k=>'<span>'+k+'<input type="number" id="pcF_'+k+'" value="'+(ef[k]||0)+'">').join('')+'</span></div>'
   +'<input id="pcX" placeholder="autres effets : bound=1, leave=1\u2026">'
   +'<label>M\u00E8ne vers</label><select id="pcT"><option value="">\u2014 choisir une sc\u00E8ne \u2014</option>'+storySceneIds().map(k=>'<option value="'+k+'"'+(k===cur[1]?' selected':'')+'>'+k+' \u2014 '+sceneHint(k,42)+'</option>').join('')+'<option value="__new">\uFF0B cr\u00E9er une nouvelle sc\u00E8ne\u2026</option></select>'
   +'<div class="pb"><button id="pcSave" class="pa">Enregistrer</button>'+(i>=0?'<button id="pcDel" class="pw">Supprimer ce choix</button>':'')+'<button id="pcCl">Annuler</button></div>');
  p.querySelector('#pcL').value=cur[0]||'';
   const cv=cur[3];p.querySelector('#pcM').value=cv==='!'?'act':(typeof cv==='string'?'custom':'send');p.querySelector('#pcR').value=(typeof cv==='string'&&cv!=='!')?cv:'';
  p.querySelector('#pcSave').onclick=()=>{const lb=p.querySelector('#pcL').value.trim();let tgt=p.querySelector('#pcT').value;
   if(!lb)return toast('Donne un texte au choix.');
   if(tgt==='__new'){const nid=prompt('Identifiant de la nouvelle sc\u00E8ne :','scene'+(allIds().length+1));if(!nid||S[nid])return toast('Identifiant invalide ou d\u00E9j\u00E0 pris.');pushSnap();S[nid]={m:[['n','\u00C9cris ici ce qui se passe.']],c:[]};persistNode(nid);tgt=nid}
   if(!tgt||!S[tgt])return toast('Choisis la sc\u00E8ne cible.');
   const e2={};FXK.forEach(k=>{const v=+p.querySelector('#pcF_'+k).value||0;if(v)e2[k]=v});
   p.querySelector('#pcX').value.split(',').forEach(pp=>{const[a,b]=pp.split('=').map(s=>(s||'').trim());if(a&&b!==''){e2[a]=isNaN(+b)?b:+b}});
   pushSnap();const mv=p.querySelector('#pcM').value;const rm=mv==='act'?'!':(mv==='custom'?p.querySelector('#pcR').value.trim():'');const chE=[lb,tgt,e2];if(mv==='act'||(mv==='custom'&&rm))chE.push(rm||'!');n.c[i>=0?i:n.c.length]=chE;persistNode(id);closePop();edFinish(id);toast('Choix enregistr\u00E9 \u2713')};
  const del=p.querySelector('#pcDel');if(del)del.onclick=()=>{if(!confirm('Supprimer ce choix ?'))return;pushSnap();n.c.splice(i,1);persistNode(id);closePop();edFinish(id)};
  p.querySelector('#pcCl').onclick=closePop}
 function sceneHint(id,max){const n=S[id];if(!n)return '';let t='';for(const w of(n.m||[])){if(w[0]==='h'||w[0]==='n'){t=w[1];break}}t=String(t||'').replace(/\s+/g,' ').trim();max=max||110;return t.length>max?t.slice(0,max)+'\u2026':t}
 function storySceneIds(){const out=[],seen={},q=[];(SS&&SS.ch||[]).forEach(c=>{if(c[1]&&S[c[1]]&&!seen[c[1]]){seen[c[1]]=1;q.push(c[1])}});
  while(q.length){const id=q.shift();out.push(id);const n=S[id];const tg=[];(n.c||[]).forEach(c=>{if(c[1])tg.push(c[1])});if(typeof n.x==='string')tg.push(n.x);
   if(typeof n.j==='function'){try{const t=n.j(st||{});if(t)tg.push(t)}catch(e){}}
   tg.forEach(t=>{if(S[t]&&!seen[t]){seen[t]=1;q.push(t)}})}
  return out}
 function decorEditor(id){const n=S[id];if(!n)return;
  const ids=storySceneIds();
  const p=openPop('<b>D\u00E9cor de la sc\u00E8ne</b>'
   +'<label>Sc\u00E8ne \u00E0 modifier</label><select id="pdN">'+ids.map(k=>'<option value="'+k+'"'+(k===id?' selected':'')+'>'+k+' \u2014 '+sceneHint(k,60)+'</option>').join('')+'</select>'
   +'<div class="seHelp" style="font-style:italic">\u00AB\u00A0'+sceneHint(id)+'\u00A0\u00BB</div>'
   +'<label>Fond de la biblioth\u00E8que</label><img id="pdP" alt="" style="width:100%;max-height:170px;object-fit:cover;border-radius:10px;border:1px solid #ffffff33;background:#0006;display:none">'
   +'<input type="hidden" id="pdK"><div class="pdThumbs" id="pdThumbs"></div>'
   +'<label>Ou image personnalis\u00E9e (URL ou fichier)</label><input id="pdU" placeholder="https://\u2026"><input type="file" id="pdF" accept="image/*">'
   +'<div class="pb"><button id="pdS" class="pa">Appliquer</button><button id="pdCl">Annuler</button></div>');
  const pv=p.querySelector('#pdP'),hv=p.querySelector('#pdK'),ur=p.querySelector('#pdU'),grid=p.querySelector('#pdThumbs');
  const updPrev=()=>{const k=hv.value,u=ur.value.trim();const src=u?u:(k&&IMG[k]?IMG[k]:'');if(src){pv.src=src;pv.style.display='block'}else{pv.removeAttribute('src');pv.style.display='none'}};
  hv.value=n.w||'';
  const pick=(k,b)=>{hv.value=k;grid.querySelectorAll('button').forEach(x=>x.classList.remove('selK'));if(b)b.classList.add('selK');updPrev()};
  const mkTh=(k)=>{const b=document.createElement('button');b.type='button';b.title=k?k:'aucune image de biblioth\u00E8que';
   if(k){b.style.backgroundImage='url('+IMG[k]+')';const sp=document.createElement('span');sp.textContent=k;b.append(sp)}else b.textContent='\u2014';
   b.onclick=()=>pick(k,b);if(hv.value===(k||''))b.classList.add('selK');grid.append(b)};
  mkTh('');Object.keys(IMG).forEach(k=>mkTh(k));
  ur.value=bgMap[id]||'';
  ur.oninput=()=>{grid.querySelectorAll('button').forEach(x=>x.classList.remove('selK'));updPrev()};updPrev();
  p.querySelector('#pdN').onchange=e=>{closePop();decorEditor(e.target.value)};
  p.querySelector('#pdF').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{ur.value=r.result;updPrev()};r.readAsDataURL(f)};
  p.querySelector('#pdS').onclick=()=>{pushSnap();const k=p.querySelector('#pdK').value,u=p.querySelector('#pdU').value.trim();
   if(u){bgMap[id]=u;saveBg()}else{delete bgMap[id];saveBg()}
   if(k){n.w=k;persistNode(id)}else if(!u&&n.w){pushSnap();delete n.w;persistNode(id)}
   closePop();edScene(id);toast('D\u00E9cor appliqu\u00E9 \u2713')};
  p.querySelector('#pdCl').onclick=closePop}
 function checkLinks(){
  const dynRef=id=>{const n=S[id];const tg=[];if(typeof n.j==='function'){try{const t=n.j(st||{});if(t)tg.push(t)}catch(e){}}return tg};
  const startIds=new Set();STORIES.forEach(s=>(s.ch||[]).forEach(c=>{if(c[1])startIds.add(c[1])}));
  const issues=[];
  Object.keys(S).forEach(id=>{const n=S[id];if(!n)return;
   (n.c||[]).forEach(c=>{const t=c[1];if(t&&!S[t])issues.push({id,sev:'lien cass\u00E9',msg:'le choix \u00AB '+c[0]+' \u00BB m\u00E8ne \u00E0 une sc\u00E8ne inconnue ('+t+')'})});
   if(typeof n.x==='string'&&!S[n.x])issues.push({id,sev:'lien cass\u00E9',msg:'la suite ('+n.x+') n\u2019existe pas'});
   if(!(n.e||n.k)&&!(n.c||[]).length&&typeof n.x!=='string'&&typeof n.j!=='function')issues.push({id,sev:'cul-de-sac',msg:'aucune sortie : ni choix, ni suite, ni fin'});
   if(!(n.m||[]).length)issues.push({id,sev:'vide',msg:'aucun message dans cette sc\u00E8ne'})});
  const refd=new Set(startIds);
  Object.keys(S).forEach(id=>{const n=S[id];(n.c||[]).forEach(c=>{if(c[1])refd.add(c[1])});if(typeof n.x==='string')refd.add(n.x);dynRef(id).forEach(t=>refd.add(t))});
  Object.keys(S).forEach(id=>{if(!refd.has(id))issues.push({id,sev:'orpheline',msg:'aucun chapitre ni choix ne m\u00E8ne \u00E0 cette sc\u00E8ne'})});
  const sevOrder=['lien cass\u00E9','cul-de-sac','orpheline','vide'];
  const counts=sevOrder.map(s=>({s,n:issues.filter(i=>i.sev===s).length})).filter(x=>x.n);
  const p=openPop('<b>V\u00E9rification des liens</b>'
   +(issues.length?'<div class="seHelp">'+counts.map(c=>c.n+' '+c.s).join(' \u00B7 ')+' \u2014 clique une ligne pour ouvrir la sc\u00E8ne.</div>':'<div class="seHelp">Aucun probl\u00E8me d\u00E9tect\u00E9 \u2713</div>')
   +'<div id="chkL"></div><div class="pb"><button id="chkCl" class="pa">Fermer</button></div>');
  const L=p.querySelector('#chkL');
  sevOrder.forEach(sev=>{const grp=issues.filter(i=>i.sev===sev);if(!grp.length)return;
   const h=document.createElement('div');h.className='seHelp';h.style.cssText='margin-top:10px;text-transform:uppercase;letter-spacing:.6px';h.textContent=sev+'s ('+grp.length+')';L.append(h);
   grp.forEach(it=>{const b=document.createElement('button');b.style.cssText='display:block;width:100%;text-align:left;margin:6px 0;font-weight:400';
    const t=document.createElement('b');t.className='mono';t.textContent=it.id+' ';b.append(t);
    b.append(it.msg);b.onclick=()=>{closePop();edRender(it.id)};L.append(b)})});
  p.querySelector('#chkCl').onclick=closePop}
 function soundEditor(id){const n=S[id];if(!n)return;const cur=sndMap[id]||'';
  const p=openPop('<b>Ambiance sonore de la sc\u00E8ne</b><div class="seHelp" style="font-style:italic">\u00AB\u00A0'+sceneHint(id)+'\u00A0\u00BB</div>'
   +'<label>Ambiance</label><select id="psA"><option value="">D\u00E9faut du d\u00E9cor ('+(n.w||'aucun')+')</option>'+['pluie','gare','mer','nuit','foret'].map(a=>'<option value="'+a+'"'+(cur===a?' selected':'')+'>'+a+'</option>').join('')+'<option value="__off"'+(cur==='__off'?' selected':'')+'>silence</option></select>'
   +'<div class="pb"><button id="psS" class="pa">\u00C9couter / appliquer</button><button id="psCl">Annuler</button></div>');
  p.querySelector('#psS').onclick=()=>{pushSnap();const v=p.querySelector('#psA').value;
   if(v)sndMap[id]=v;else delete sndMap[id];saveSnd();
   unlock();if(v==='__off')amb(null);else amb(v||n.w||null);
   closePop();toast('Ambiance appliqu\u00E9e \u2713')};
  p.querySelector('#psCl').onclick=closePop}
 function finEditor(id){const n=S[id];if(!n)return;const cur=n.e||[n.k||'',''];
  const p=openPop('<b>Marquer ce point comme une fin</b>'
   +'<label>Titre de la fin</label><input id="pfT">'
   +'<label>Texte de fin (facultatif)</label><textarea id="pfX"></textarea>'
   +'<div class="pb"><button id="pfS" class="pa">Enregistrer la fin</button><button id="pfCl">Annuler</button></div>');
  p.querySelector('#pfT').value=cur[0]||'';p.querySelector('#pfX').value=cur[1]||'';
  p.querySelector('#pfS').onclick=()=>{const t=p.querySelector('#pfT').value.trim();if(!t)return toast('Donne un titre \u00E0 la fin.');
   pushSnap();const x=p.querySelector('#pfX').value.trim();
   delete n.c;delete n.x;delete n.j;
   if(x)n.e=[t,x];else n.k=t;
   persistNode(id);closePop();edRefresh();toast('Fin enregistr\u00E9e \u2713')};
  p.querySelector('#pfCl').onclick=closePop}
 function delNode(id){if(!id||!S[id])return;
  const refs=[];for(const k in S){const n=S[k];(n.c||[]).forEach(c=>{if(c[1]===id)refs.push(k)});if(n.x===id)refs.push(k)}
  STORIES.forEach(s=>s.ch.forEach(c=>{if(c[1]===id)refs.push('chapitre')}));
  if(!confirm('Supprimer la sc\u00E8ne \u00AB '+id+' \u00BB ?'+(refs.length?'\nR\u00E9f\u00E9renc\u00E9e par : '+[...new Set(refs)].slice(0,10).join(', ')+'. Pense \u00E0 rec\u00E2bler ces liens.':'')))return;
  pushSnap();delete S[id];NP[id]=null;pu(LSN,NP);delete bgMap[id];saveBg();delete sndMap[id];saveSnd();
  nodeNow=null;edRefresh();toast('N\u0153ud supprim\u00E9 \u2713')}
 /* ================= histoires & chapitres ================= */
 function storyEditor(){pushSnap();
  const p=openPop('<b>Histoires & chapitres</b><p class="seHelp">Ici tu r\u00E8gles ce que voit le joueur : le nom du contact dans le t\u00E9l\u00E9phone, le num\u00E9ro affich\u00E9 en haut de l\u2019\u00E9cran, le titre et le r\u00E9sum\u00E9 du menu. Chaque chapitre s\u2019ouvre sur une sc\u00E8ne pr\u00E9cise \u2014 choisis-la dans la liste sous son titre.</p>'
   +'<label>Histoire</label><select id="seSel">'+STORIES.map((s,i)=>'<option value="'+i+'"'+(STORIES[i]===SS?' selected':'')+'>'+s.n+' \u2014 '+s.t+'</option>').join('')+'</select>'
   +'<div id="seForm"></div>'
   +'<div class="pb"><button id="seSv" class="pa">Enregistrer l\u2019histoire</button><button id="seCl">Fermer</button></div>');
  const form=p.querySelector('#seForm');
  function fill(){const s=STORIES[+p.querySelector('#seSel').value];
   form.innerHTML='<label>Pr\u00E9nom du contact</label><input id="seN" value="'+s.n.replace(/"/g,'&quot;')+'">'
   +'<label>Num\u00E9ro affich\u00E9</label><input id="seNum" value="'+s.num.replace(/"/g,'&quot;')+'">'
   +'<label>Titre de l\u2019histoire</label><input id="seT" value="'+s.t.replace(/"/g,'&quot;')+'">'
   +'<label>Description (menu)</label><input id="seD" value="'+s.d.replace(/"/g,'&quot;')+'">'
   +'<label>Prologue \u2014 page d\u2019introduction avant le jeu</label><textarea id="seP" placeholder="Le texte que lira le joueur avant de commencer (laisse vide pour le prologue par d\u00E9faut)\u2026"></textarea>'
   +'<label>Photo de profil du contact (facultatif \u2014 sinon portrait par d\u00E9faut)</label>'
   +'<div class="pb"><button id="sePhF">Joindre une photo</button><button id="sePhR" class="pw">Retirer</button></div>'
   +'<label>Narration audio du prologue (facultatif \u2014 fichier court conseill\u00E9)</label>'
   +'<div class="pb"><span id="seAuSt" class="mono"></span><button id="seAuF">Joindre un fichier audio</button><button id="seAuR" class="pw">Retirer</button></div>'
   +'<label>Chapitres</label><div id="seChaps"></div>'
   +'<div class="pb"><button id="seAddCh">\uFF0B Nouveau chapitre</button></div>';
   form.querySelector('#seP').value=s.prologue||'';
   let audNew=null,phNew=null;
   const st1=form.querySelector('#seAuSt');
   const upd=()=>{st1.textContent=audNew===null?(s.audio?'\u2713 audio jointe \u2014 lue sur la page du prologue':'aucun audio : le bouton d\u2019\u00E9coute utilisera la synth\u00E8se vocale'):(audNew?'\u2713 nouveau fichier pr\u00EAt \u00E0 enregistrer':'audio retir\u00E9e \u2014 sera sauvegard\u00E9 ainsi');st1.dataset.v=audNew===null?(s.audio||''):audNew};
   upd();
   form.querySelector('#seAuF').onclick=()=>{const f=document.createElement('input');f.type='file';f.accept='audio/*';
    f.onchange=()=>{if(!f.files[0])return;const r=new FileReader();r.onload=()=>{audNew=r.result;upd()};r.readAsDataURL(f.files[0])};f.click()};
   form.querySelector('#seAuR').onclick=()=>{audNew='';upd()};
   form.querySelector('#sePhF').onclick=()=>{const f=document.createElement('input');f.type='file';f.accept='image/*';
    f.onchange=()=>{if(!f.files[0])return;const r=new FileReader();r.onload=()=>{phNew=r.result};r.readAsDataURL(f.files[0])};f.click()};
   form.querySelector('#sePhR').onclick=()=>{phNew=''};
   const cb=form.querySelector('#seChaps');
   function chRow(ch,i){const r=document.createElement('div');r.className='chRow';
    const nl=k=>k+' \u2014 \u00AB'+String((S[k]&&S[k].m||[]).map(m=>m[1]||'').join(' ').slice(0,42)||'sc\u00E8ne vide').replace(/"/g,'&quot;')+'\u00BB';
    r.innerHTML='<input class="seChT" placeholder="Titre du chapitre (affich\u00E9 au joueur)" value="'+String(ch[0]||'').replace(/"/g,'&quot;')+'">'
     +'<select class="seChS" title="Sc\u00E8ne sur laquelle s\u2019ouvre ce chapitre"><option value="">\u2014 sc\u00E8ne de d\u00E9part \u2014</option>'+allIds().map(k=>'<option value="'+k+'"'+(k===ch[1]?' selected':'')+'>'+nl(k)+'</option>').join('')+'</select>'
     +'<span class="pb"><button class="mini seUp" title="Monter ce chapitre">\u2191</button><button class="mini seDn" title="Descendre ce chapitre">\u2193</button><button class="mini pw seDel" title="Retirer ce chapitre">\u2715</button></span>';
    r.querySelector('.seUp').onclick=()=>{if(i>0){const a=s.ch;[a[i-1],a[i]]=[a[i],a[i-1]];fill()}};
    r.querySelector('.seDn').onclick=()=>{if(i<s.ch.length-1){const a=s.ch;[a[i+1],a[i]]=[a[i],a[i+1]];fill()}};
    r.querySelector('.seDel').onclick=()=>{if(s.ch.length<=1)return toast('Une histoire garde au moins un chapitre.');if(confirm('Retirer ce chapitre ?')){s.ch.splice(i,1);fill()}};
    cb.append(r)}
   s.ch.forEach((ch,i)=>chRow(ch,i));
   form.querySelector('#seAddCh').onclick=()=>{s.ch.push(['Nouveau chapitre','']);fill()}}
  p.querySelector('#seSel').onchange=fill;fill();
  p.querySelector('#seSv').onclick=()=>{const s=STORIES[+p.querySelector('#seSel').value];
   const f=p.querySelector('#seForm');
   s.n=f.querySelector('#seN').value.trim()||s.n;s.num=f.querySelector('#seNum').value.trim()||s.num;
   s.t=f.querySelector('#seT').value.trim()||s.t;s.d=f.querySelector('#seD').value.trim()||s.d;
   s.prologue=f.querySelector('#seP').value;
   const auSt=f.querySelector('#seAuSt');if(auSt&&auSt.dataset.v!==undefined)s.audio=auSt.dataset.v;
   if(phNew!==null)s.photo=phNew||null;
   const rows=[...f.querySelectorAll('.chRow')];
   s.ch.length=0;rows.forEach(r=>{const t=r.querySelector('.seChT').value.trim(),nd=r.querySelector('.seChS').value;if(t||nd)s.ch.push([t||'Chapitre',nd])});
   if(!s.ch.length)s.ch.push(['Chapitre 1','']);
   SP[s.id]=s;saveStories();closePop();updateRail();toast('Histoire enregistr\u00E9e \u2713 (le menu joueur l\u2019affichera \u00E0 sa prochaine ouverture)')};
  p.querySelector('#seCl').onclick=closePop}
 /* ================= carte du chapitre ================= */
 function closeMap(){const m=$('edMap');if(m)m.remove()}
 function mapPop(){
  const s=SS;const start=(s.ch[SC]||[])[1];
  if(!start||!S[start]){toast('Choisis d\u2019abord un chapitre valide.');return}
  const esc=t=>String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const depth={},cols={};const q=[[start,0]];const nodes=[];
  while(q.length){const[id,d]=q.shift();if(!S[id]||depth[id]!==undefined)continue;depth[id]=d;nodes.push(id);
   const n=S[id];const tg=[];(n.c||[]).forEach(c=>{if(c[1])tg.push(c[1])});if(typeof n.x==='string')tg.push(n.x);
   if(typeof n.j==='function'){try{const t=n.j(st||{});if(t)tg.push(t)}catch(e){}}
   tg.forEach(t=>{if(depth[t]===undefined)q.push([t,d+1])})}
  const byD={};nodes.forEach(id=>{(byD[depth[id]]=byD[depth[id]]||[]).push(id)});
  const CW=252,GPX=30,GPY=70,MG=28;
  const tgOf=id=>{const n=S[id];const tg=[];(n.c||[]).forEach(c=>{if(c[1])tg.push(c[1])});if(typeof n.x==='string')tg.push(n.x);
   if(typeof n.j==='function'){try{const t=n.j(st||{});if(t)tg.push(t)}catch(e){}}return tg};
  const hOf=id=>{const n=S[id];const txt=(n.m||[]).map(m=>m[1]||'').join('\n');let ls=0;
   txt.split('\n').forEach(l=>{ls+=Math.max(1,Math.ceil((l.length||1)/32))});
   return 20+ls*18+((n.c||[]).length?((n.c||[]).length*27+6):0)+((n.e||n.k)?22:0)};
  let maxW=0;for(const d in byD){byD[d].forEach((id,i)=>{cols[id]=i});maxW=Math.max(maxW,byD[d].length)}
  const ds=Object.keys(byD).map(Number).sort((a,b)=>a-b);const rowY={};let acc=MG;
  ds.forEach(d=>{let h=0;byD[d].forEach(id=>{h=Math.max(h,hOf(id))});rowY[d]=acc;acc+=h+GPY});
  const X=id=>MG+(cols[id]||0)*(CW+GPX),Y=id=>rowY[depth[id]]||MG;
  const W=Math.max(680,MG+maxW*(CW+GPX)),H=acc+MG;
  let svg='';
  nodes.forEach(id=>{const h=hOf(id);const x1=X(id)+CW/2,y1=Y(id)+h;
   tgOf(id).forEach(t=>{if(depth[t]===undefined)return;const x2=X(t)+CW/2,y2=Y(t);
    svg+='<path class="mpEdge" data-f="'+id+'" data-t="'+t+'" d="M '+x1+' '+y1+' C '+x1+' '+(y1+28)+', '+x2+' '+(y2-28)+', '+x2+' '+y2+'" fill="none" stroke="#3e91ff77" stroke-width="1.6"/>'})});
  let cards='';
  nodes.forEach(id=>{const n=S[id];const txt=(n.m||[]).map(m=>m[1]||'').join('\n');
   const cls='mpCard'+(id===nodeNow?' mpCur':'')+((n.e||n.k)?' mpEnd':'');
   cards+='<div class="'+cls+'" data-id="'+id+'" style="left:'+X(id)+'px;top:'+Y(id)+'px;width:'+CW+'px">'
    +'<div class="mpTxt">'+esc(txt)+'</div>'
    +(n.c||[]).map(c=>'<div class="mpCh" data-t="'+(c[1]||'')+'">\u21AA '+esc(c[0])+'</div>').join('')
    +((n.e||n.k)?'<div class="mpEnd">\uD83C\uDFC1 Fin</div>':'')+'</div>'});
  closeMap();
  const ov=document.createElement('div');ov.id='edMap';
  ov.innerHTML='<div class="mpTop"><b>Carte du chapitre \u2014 '+esc(s.t)+' \u00B7 '+esc((s.ch[SC]||[])[0])+'</b>'
   +'<span class="mpHint">'+nodes.length+' cartes \u00B7 clique une r\u00E9ponse pour voir o\u00F9 elle m\u00E8ne, reclique pour y aller \u00B7 molette : zoom \u00B7 glisser : d\u00E9placer</span>'
   +'<input id="mpQ" type="search" placeholder="\uD83D\uDD0D Rechercher\u2026">'
   +'<span class="mpZ"><button data-z="in">Zoom +</button><button data-z="out">Zoom \u2212</button><button data-z="fit">Recentrer</button><button data-z="path">Mon parcours</button><button data-z="x" class="pa">Fermer</button></span></div>'
   +'<div class="mpWrap"><div class="mpInner" style="width:'+W+'px;height:'+H+'px">'
   +'<svg width="'+W+'" height="'+H+'" style="position:absolute;left:0;top:0">'+svg+'</svg>'+cards+'</div></div>';
  document.body.append(ov);
  const wrap=ov.querySelector('.mpWrap'),inner=ov.querySelector('.mpInner');let zk=1,pOn=false,traced=null;
  const mq=ov.querySelector('#mpQ');
  if(mq)mq.oninput=()=>{const v=mq.value.trim().toLowerCase();
   ov.querySelectorAll('.mpCard').forEach(cd=>{const hit=!v||cd.textContent.toLowerCase().includes(v)||((cd.dataset.id||'').toLowerCase().includes(v));cd.classList.toggle('mpDim',!hit)});
   ov.querySelectorAll('.mpEdge').forEach(e=>{const f=(e.dataset.f||'')+' '+(e.dataset.t||'');e.classList.toggle('mpDim',!!v&&!f.toLowerCase().includes(v))})};
  const setZ=k=>{zk=Math.min(2.2,Math.max(.25,k));inner.style.transformOrigin='top left';inner.style.transform='scale('+zk+')'};
  wrap.addEventListener('wheel',e=>{e.preventDefault();setZ(zk*(e.deltaY<0?1.12:0.89))},{passive:false});
  ov.querySelectorAll('.mpZ button').forEach(b=>{b.onclick=()=>{const z=b.dataset.z;
   if(z==='in')setZ(zk*1.25);else if(z==='out')setZ(zk/1.25);
   else if(z==='fit'){setZ(1);wrap.scrollLeft=0;wrap.scrollTop=0}
   else if(z==='path'){pOn=!pOn;
    ov.querySelectorAll('.mpEdge').forEach(x=>x.classList.remove('hl'));ov.querySelectorAll('.mpCard').forEach(x=>x.classList.remove('mpDim','hlT'));
    if(pOn){const ps=new Set(path.filter(p2=>depth[p2]!==undefined));
     ov.querySelectorAll('.mpCard').forEach(x=>{if(ps.has(x.dataset.id))x.classList.add('hlT');else x.classList.add('mpDim')});
     for(let pi=0;pi<path.length-1;pi++){const pa=path[pi],pb=path[pi+1];
      if(depth[pa]!==undefined&&depth[pb]!==undefined)ov.querySelectorAll('.mpEdge[data-f="'+pa+'"][data-t="'+pb+'"]').forEach(x=>x.classList.add('hl'))}}}
   else closeMap()}});
  let pan=null;
  wrap.addEventListener('pointerdown',e=>{if(e.target.closest('.mpCard'))return;
   pan={x:e.clientX,y:e.clientY,l:wrap.scrollLeft,t:wrap.scrollTop}});
  wrap.addEventListener('pointermove',e=>{if(!pan)return;
   wrap.scrollLeft=pan.l-(e.clientX-pan.x);wrap.scrollTop=pan.t-(e.clientY-pan.y)});
  wrap.addEventListener('pointerup',()=>{pan=null});
  wrap.addEventListener('pointerleave',()=>{pan=null});
  ov.querySelectorAll('.mpCard').forEach(c=>{c.addEventListener('click',()=>{
   const id=c.dataset.id;const n=S[id]||{};const isEnd=!!(n.e||n.k);
   if(isEnd&&traced!==id){traced=id;
    const anc={};anc[id]=1;let ch2=true;
    while(ch2){ch2=false;nodes.forEach(nid=>{if(anc[nid])return;const tgs=tgOf(nid);
     if(tgs.some(t2=>anc[t2])){anc[nid]=1;ch2=true}})}
    ov.querySelectorAll('.mpCh').forEach(x=>x.classList.remove('hlCh'));
    ov.querySelectorAll('.mpCard').forEach(x=>{const xi=x.dataset.id;
     x.classList.remove('mpDim','hlT');if(anc[xi])x.classList.add('hlT');else x.classList.add('mpDim');
     if(anc[xi])x.querySelectorAll('.mpCh').forEach(ch3=>{if(anc[ch3.dataset.t])ch3.classList.add('hlCh')})});
    ov.querySelectorAll('.mpEdge').forEach(x=>{x.classList.remove('hl');if(anc[x.dataset.f]&&anc[x.dataset.t])x.classList.add('hl')});
    toast('Chemins vers cette fin \u2014 reclique pour y aller.');
    return}
   traced=null;closeMap();edRender(id)})});
  ov.querySelectorAll('.mpCh').forEach(ch=>{ch.addEventListener('click',e=>{e.stopPropagation();
   const f=ch.closest('.mpCard').dataset.id;const t=ch.dataset.t;
   if(!t||!depth[t]){toast('Cette r\u00E9ponse ne m\u00E8ne nulle part pour l\u2019instant.');return}
   if(ch.dataset.arm==='1'){closeMap();edRender(t);return}
   ov.querySelectorAll('.mpCh').forEach(x=>x.removeAttribute('data-arm'));
   ch.setAttribute('data-arm','1');
   ov.querySelectorAll('.mpEdge').forEach(x=>x.classList.remove('hl','mpDim'));
   ov.querySelectorAll('.mpCard').forEach(x=>{x.classList.remove('hlT','mpDim');if(x.dataset.id!==f&&x.dataset.id!==t)x.classList.add('mpDim')});
   ov.querySelectorAll('.mpEdge[data-f="'+f+'"][data-t="'+t+'"]').forEach(x=>x.classList.add('hl'));
   const tc=ov.querySelector('.mpCard[data-id="'+t+'"]');tc.classList.remove('mpDim');tc.classList.add('hlT');
   tc.scrollIntoView({behavior:'smooth',block:'center',inline:'center'})})});
 }
 /* ================= bibliothèque d'images ================= */
 function imgLib(){const p=openPop('<b>Biblioth\u00E8que d\u2019images</b>'
   +'<div id="ilList"></div>'
   +'<label>Ajouter une image</label><input id="ilK" placeholder="nom (ex : gare2)"><input id="ilU" placeholder="URL de l\u2019image"><input type="file" id="ilF" accept="image/*">'
   +'<div class="pb"><button id="ilAdd" class="pa">Ajouter</button><button id="ilCl">Fermer</button></div>');
  const list=p.querySelector('#ilList');
  Object.keys(IMG).forEach(k=>{const d=document.createElement('div');d.className='ilRow';
   d.innerHTML='<img src="'+IMG[k]+'" alt=""><span class="mono">'+k+'</span>'
    +'<button class="pw ilDel"'+(IP[k]===undefined?' disabled style="opacity:.35" title="image d\u2019origine, non supprimable"':'')+'>supprimer</button>';
   const del=d.querySelector('.ilDel');if(del&&!del.disabled)del.onclick=()=>{if(!confirm('Supprimer \u00AB '+k+' \u00BB ?'))return;pushSnapImg(k);delete IMG[k];IP[k]=null;saveImgs();d.remove()};
   list.append(d)});
  p.querySelector('#ilF').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{p.querySelector('#ilU').value=r.result};r.readAsDataURL(f)};
  p.querySelector('#ilAdd').onclick=()=>{const k=p.querySelector('#ilK').value.trim(),u=p.querySelector('#ilU').value.trim();
   if(!k||!u)return toast('Donne un nom et une image.');
   pushSnapImg(k);IMG[k]=u;IP[k]=u;saveImgs();closePop();imgLib()};
  p.querySelector('#ilCl').onclick=closePop}
 /* ================= export HTML autonome ================= */
 function exportHTML(){
  const data={nodes:JSON.parse(JSON.stringify(S,fnSer)),imgs:JSON.parse(JSON.stringify(IMG)),stories:JSON.parse(JSON.stringify(STORIES)),bg:bgMap,snd:sndMap};
  const clone=document.documentElement.cloneNode(true);
  clone.querySelectorAll('#adm,#edRail,#edPop,#edMap,#edToast,#edGear,#edCSS,#etlBaked').forEach(e=>e.remove());
  const body=clone.querySelector('body');body.removeAttribute('class');
  ['chat','ch'].forEach(id=>{const e=clone.querySelector('#'+id);if(e){e.innerHTML='';e.style.backgroundImage=''}});
  const ov=clone.querySelector('#ov');if(ov)ov.setAttribute('hidden','');
  const mn=clone.querySelector('#mn');if(mn)mn.classList.remove('on');
  if(clone.querySelector('#in'))clone.querySelector('#in').classList.remove('out');
  else{const d=document.createElement('div');d.id='in';d.innerHTML='<button class="vwb" id="sbi">=</button><button class="vwb" id="vw2"></button><div id="bgi"></div><div class="tx"><h1>Entre les lignes</h1><p class="lead">Des histoires qui se lisent en messages \u2014 et dont tu \u00E9cris la suite.</p><p>L\u00E9o a disparu. Il ne reste que son dernier message, un groupe WhatsApp qui s\u2019agite, des notes d\u2019enqu\u00EAte \u00E0 recouper. \u00C0 toi de lire ce qui se cache entre les lignes : douter, questionner, prot\u00E9ger \u2014 ou taire.</p><p class="metaL">Enqu\u00EAte en 6 chapitres \u00B7 8 fins possibles \u00B7 chaque r\u00E9ponse compte</p><button id="go">Commencer \u203A</button></div>';body.append(d);const sb2=d.querySelector('#sbi');if(sb2)sb2.onclick=togSnd;setV()}
  const js='(function(){try{var D='+JSON.stringify(data).replace(/</g,'\\u003c')+';var rv=function(o){if(o&&typeof o==="object"){for(var k in o){if(k==="j"&&typeof o[k]==="string"){try{o[k]=new Function("return ("+o[k]+")")()}catch(e){}}else{rv(o[k])}}}return o};D=rv(D);for(var k in D.nodes)S[k]=D.nodes[k];for(var k in D.imgs)IMG[k]=D.imgs[k];for(var i=0;i<D.stories.length;i++)STORIES[i]=D.stories[i];STORIES.length=D.stories.length;if(D.bg&&typeof nodeBackgrounds==="object"){for(var k in D.bg)nodeBackgrounds[k]=D.bg[k]}if(D.snd){try{localStorage.setItem("etl_node_sounds",JSON.stringify(D.snd))}catch(e){}}}catch(e){}})();';
  const sc=document.createElement('script');sc.id='etlBaked';sc.textContent=js;body.append(sc);
  const html='<!DOCTYPE html>\n'+clone.outerHTML;
  const bl=new Blob([html],{type:'text/html'});const a=document.createElement('a');
  a.href=URL.createObjectURL(bl);a.download='Entre_les_lignes_Studio.html';a.click();
  setTimeout(()=>{try{URL.revokeObjectURL(a.href)}catch(e){}},600000);
  toast('HTML t\u00E9l\u00E9charg\u00E9 \u2014 remplace ton ancien fichier par celui-ci.')}
 /* ================= rail admin ================= */
 function ensureCSS(){if($('edCSS'))return;const s=document.createElement('style');s.id='edCSS';
  s.textContent='#edRail{position:fixed;left:10px;top:50%;transform:translateY(-50%);z-index:80;width:210px;background:#0e1626f2;border:1px solid #2c4a73;border-radius:14px;padding:10px;box-shadow:0 18px 60px #000c;backdrop-filter:blur(6px);font:12.5px system-ui,sans-serif;color:#dbe7f8;max-height:88vh;overflow:auto}#edRail .rg{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#7fa7d9;margin:10px 2px 4px}#edRail .rg:first-child{margin-top:0}#edRail .rGrp .rHead{font-weight:700;color:#a9c4ea;background:#0c1930}#edRail .rGrp.cl .rBody{display:none}#edRail.peek{opacity:0;pointer-events:none;transform:translateY(-50%) translateX(-240px)}#edRail{transition:.35s}#edRail button{display:block;width:100%;text-align:left;background:#16243c;color:#dbe7f8;border:1px solid #27405f;border-radius:8px;padding:7px 10px;margin:3px 0;font:inherit;cursor:pointer;transition:.12s}#edRail button:hover{background:#1d3151;border-color:#3e91ff}#edRail button:disabled{opacity:.45;cursor:default}#edRail select{width:100%;box-sizing:border-box;background:#16243c;color:#dbe7f8;border:1px solid #27405f;border-radius:8px;padding:6px 8px;margin:3px 0;font:inherit}#edRail .rstat{font-size:10.5px;color:#8fb0e0;margin:6px 2px;line-height:1.5;border-top:1px solid #223754;padding-top:6px;word-break:break-word}.ed{cursor:pointer}.ed:hover{outline:1.5px dashed #0a84ff;outline-offset:2px}#edPop{position:fixed;z-index:90;right:12px;top:12px;bottom:12px;width:min(420px,44vw);overflow:auto;background:#0e1626f5;color:#e8eefb;border:1px solid #3e91ff88;border-radius:14px;padding:14px;font:14px system-ui,sans-serif;box-shadow:-8px 0 40px #000a;backdrop-filter:blur(6px)}#edPop b{font-size:15px}#edPop .mono{color:#6db2ff;font-family:ui-monospace,monospace}#edPop label{display:block;font-size:11px;color:#9fb4d4;margin:10px 0 3px;text-transform:uppercase;letter-spacing:.4px}#edPop textarea,#edPop input,#edPop select{width:100%;box-sizing:border-box;background:#0a1424;color:#e8eefb;border:1px solid #2b405f;border-radius:8px;padding:7px;font:inherit;margin-top:2px}#edPop textarea{min-height:70px;resize:vertical}#edPop .pb{display:flex;gap:6px;margin-top:12px;flex-wrap:wrap}#edPop button{font:inherit;border:0;border-radius:8px;background:#1b2a41;color:#fff;padding:8px 12px;cursor:pointer}#edPop button.pa{background:#0a84ff}#edPop button.pw{background:#7a2030}#edPop button:disabled{opacity:.4;cursor:default}#edPop .pfx{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}#edPop .pfx span{font-size:10px;color:#9fb4d4;text-align:center}#edPop .pfx input{text-align:center;padding:4px}#edPop .chRow{border:1px solid #223754;border-radius:10px;padding:8px;margin:6px 0;background:#0a1424}#edPop .chRow input,#edPop .chRow select{margin:4px 0 0}#edPop .ilRow{display:flex;align-items:center;gap:10px;border:1px solid #223754;border-radius:10px;padding:6px;margin:6px 0;background:#0a1424}#edPop .ilRow img{width:64px;height:40px;object-fit:cover;border-radius:6px}#edPop .ilRow .mono{flex:1;font-size:12px}#edMap{position:fixed;inset:0;z-index:92;background:#060c17f2;display:flex;flex-direction:column;font:13px system-ui,sans-serif}#edMap .mpTop{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#0e1626;border-bottom:1px solid #2c4a73;flex-wrap:wrap}#edMap .mpTop b{color:#e8eefb;font-size:15px}#edMap .mpHint{font-size:11px;color:#8fa5c5;flex:1;min-width:180px}#edMap .mpZ{display:flex;gap:6px}#edMap .mpZ button{font:inherit;border:0;border-radius:8px;background:#1b2a41;color:#fff;padding:7px 12px;cursor:pointer}#edMap .mpZ button.pa{background:#0a84ff}#edMap .mpWrap{flex:1;overflow:auto;cursor:grab}#edMap .mpWrap:active{cursor:grabbing}#edMap .mpInner{position:relative}#edMap .mpSvg{position:absolute;left:0;top:0}.mpCard{position:absolute;background:#14233c;border:1px solid #2c4a73;border-radius:12px;padding:10px 12px;box-shadow:0 8px 26px #0008;cursor:pointer;transition:border-color .12s;box-sizing:border-box}.mpCard:hover{border-color:#3e91ff}.mpCard.mpCur{border-color:#7cc0ff;box-shadow:0 0 0 2.5px #0a84ff77,0 8px 26px #0008}.mpCard.mpEnd{background:#29230f;border-color:#d4a01766}.mpCard .mpTxt{color:#dbe7f8;font-size:12.5px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.mpCard .mpCh{margin-top:6px;font-size:11px;color:#6db2ff;background:#0a1424;border-radius:6px;padding:3px 7px}.mpCard .mpEnd{margin-top:6px;font-size:11px;color:#ffd166;font-weight:700}.mpEdge.hl{stroke:#ffd166;stroke-width:3px;filter:drop-shadow(0 0 4px #ffd16688)}.mpEdge.mpDim,.mpCard.mpDim{opacity:.28;transition:opacity .15s}.mpCard.hlT{border-color:#ffd166;box-shadow:0 0 0 2px #ffd16655,0 8px 26px #0008}.mpCh{cursor:pointer}.mpCh:hover{background:#122a4d}.mpCh.hlCh{background:#2a2410;color:#ffd166;border:1px solid #d4a01766}#edPop .seHelp{font-size:11.5px;color:#8fa5c5;margin:6px 0 2px;line-height:1.5}#edToast{position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#0a84ffef;color:#fff;padding:10px 18px;border-radius:12px;z-index:95;font:13px system-ui;box-shadow:0 8px 30px #0009;max-width:88vw;text-align:center;opacity:0;pointer-events:none}#edToast.go{animation:edt 3.6s ease both}@keyframes edt{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}10%{opacity:1;transform:translateX(-50%)}85%{opacity:1}100%{opacity:0}}.edp{position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:13px;opacity:.5;padding:2px 5px}.edp:hover{opacity:1}.edAdd{border-style:dashed !important;opacity:.85 !important;font-style:italic}#edGear{color:#0a84ff}';
  document.head.append(s)}
 function buildRail(){let r=$('edRail');if(r)return r;r=document.createElement('div');r.id='edRail';
  const ctx=document.createElement('div');ctx.id='edCtx';ctx.className='rstat';r.append(ctx);
  const pview=document.createElement('button');pview.textContent='\u25C0 Aper\u00E7u joueur';pview.title='Cache le rail 5 secondes pour voir le rendu';
  pview.onclick=()=>{r.classList.add('peek');setTimeout(()=>r.classList.remove('peek'),5000)};r.append(pview);
  let body=null;
  const g=(t,open)=>{const d=document.createElement('div');d.className='rGrp'+(open?'':' cl');
   const h=document.createElement('button');h.className='rHead';h.textContent=t;
   h.onclick=()=>d.classList.toggle('cl');d.append(h);
   body=document.createElement('div');body.className='rBody';d.append(body);r.append(d)};
  const bt=(label,fn,id)=>{const b=document.createElement('button');b.textContent=label;if(id)b.id=id;b.onclick=fn;body.append(b);return b};
  g('Lecture',true);
  bt('Message suivant \u2192',()=>edStep(),'edNext');
  bt('Lecture auto \u25B6',()=>{if(edAuto){clearTimeout(edTimer);edAuto=false}else{edAuto=true;edRunAuto()}updateRail()},'edAuto');
  g('\u00C9dition de la sc\u00E8ne');
  bt('\uFF0B Ajouter un message',()=>{const id=needNode();if(!id)return;pushSnap();S[id].m.push(['n','(nouveau message)']);persistNode(id);edRefresh()},'edAddM');
  bt('\uFF0B Ajouter un choix',()=>{const id=needNode();if(!id)return;choiceEditor(id,-1)},'edAddC');
  bt('\uD83C\uDFC1 Marquer comme fin',()=>{const id=needNode();if(!id)return;finEditor(id)},'edFin');
  bt('\uD83D\uDDBC D\u00E9cor d\u2019une sc\u00E8ne',()=>{const ids=storySceneIds();if(!ids.length)return toast('Aucune sc\u00E8ne dans cette histoire.');decorEditor(nodeNow&&S[nodeNow]?nodeNow:ids[0])},'edDeco');
  bt('\uD83D\uDD0A Ambiance sonore',()=>{const id=needNode();if(!id)return;soundEditor(id)},'edSnd');
  bt('\uD83D\uDDD1 Supprimer cette sc\u00E8ne',()=>{const id=needNode();if(!id)return;delNode(id)},'edDel');
  g('Histoire',true);
  bt('\u270E Histoires & chapitres',storyEditor);
  bt('\uD83D\uDDFA Carte du chapitre',mapPop,'edMapBtn');
  g('Projet');
  const sel=document.createElement('select');sel.id='edJump';body.append(sel);
  sel.onchange=()=>{if(sel.value&&S[sel.value])edRender(sel.value)};
  bt('\u21BA Rejouer la sc\u00E8ne',()=>{const id=needNode();if(!id)return;edRender(id)},'edRejouer');
  bt('\u23ED Sc\u00E8ne suivante',()=>{const ids=storySceneIds();if(!ids.length)return toast('Aucune sc\u00E8ne dans cette histoire.');const i=nodeNow&&ids.indexOf(nodeNow)>-1?ids.indexOf(nodeNow):-1;edRender(ids[(i+1)%ids.length])},'edSkip');
  bt('\u21A9 Annuler (Ctrl+Z)',undo);
  bt('\uD83D\uDDBC Biblioth\u00E8que d\u2019images',imgLib);
  bt('\u2714 V\u00E9rifier les liens',checkLinks);
  bt('\u2B07 Exporter le HTML modifi\u00E9',exportHTML);
  const stt=document.createElement('div');stt.id='edStat';stt.className='rstat';r.append(stt);
  bt('\u2716 Quitter le mode \u00E9dition',()=>adm(false));
  document.body.append(r);
  return r}
 function updateRail(){const r=$('edRail');if(!r)return;
  const cx=$('edCtx');if(cx){const inStory=!!(SS&&SK&&nodeNow);
   cx.innerHTML=inStory?'\u{1F4D8} <b>'+SS.t+'</b><br>chapitre '+(SC+1)+' : '+((SS.ch[SC]||[])[0]||''):'aucune histoire ouverte'};
  const sel=$('edJump');if(sel){const v=nodeNow;sel.innerHTML='';
   const ids=storySceneIds();ids.forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k+(S[k].e||S[k].k?' \u00B7 fin':'')+(sceneHint(k,38)?' \u2014 '+sceneHint(k,38):'');sel.append(o)});if(v&&ids.includes(v))sel.value=v}
  const nx=$('edNext');if(nx){nx.disabled=!edQ.length}
 const on=!!(nodeNow&&S[nodeNow]);
 ['edAddM','edAddC','edFin','edSnd','edDel','edMapBtn','edRejouer'].forEach(i=>{const e=$(i);if(e){e.disabled=!on;e.style.opacity=on?'':'.4'}});
 if(!on)sel.disabled=true;else sel.disabled=false;
  const au=$('edAuto');if(au)au.textContent=edAuto?'\u23F8 Pause lecture auto':'Lecture auto \u25B6';
  const stt=$('edStat');if(stt){const ends=Object.values(S).filter(n=>n&&(n.e||n.k)).length;
   stt.innerHTML=(nodeNow?'sc\u00E8ne : <b>'+nodeNow+'</b>':'aucune sc\u00E8ne ouverte')+'<br>'+(edQ.length?edQ.length+' message(s) en attente':'sc\u00E8ne compl\u00E8te')+'<br>'+Object.keys(S).length+' sc\u00E8nes \u00B7 '+ends+' fins \u00B7 '+Object.keys(IMG).length+' images'}}
 function gearBtn(){}
 /* ================= activation ================= */
 adm=function(on){
  oldAdm(false);
  if(on&&!(SS&&SK&&nodeNow&&S[nodeNow]))on=0;
  EDIT=on?1:0;ADM=EDIT;
  try{localStorage.setItem('etl_admin',EDIT?'1':'0')}catch(e){}
  clearTimeout(edTimer);edAuto=false;
  if(!EDIT){closePop();const r=$('edRail');if(r)r.remove();if(!SS||!SK){updateRail();toast('\u00C9dition quitt\u00E9e \u2014 reviens au menu et lance l\u2019histoire pour relire.')}else{edRender(nodeNow);toast('\u00C9dition quitt\u00E9e.')}
   return}
  ensureCSS();buildRail();
  if(nodeNow&&S[nodeNow])edRender(nodeNow);else updateRail();
  toast('\u00C9dition de cette histoire \u2014 Espace ou \u2192 : message suivant \u00B7 Ctrl+Z : annuler \u00B7 Alt+1510 ou le bouton du rail pour quitter')}
 /* en mode \u00E9dition, le r\u00E9cit attend le pas-à-pas */
 const playPrev=play;
 play=async function(id,r=run){if(EDIT&&S[id]){edRender(id);return}const v=await playPrev(id,r);return v};
 addEventListener('keydown',e=>{if(!EDIT||pop)return;
  const tag=(e.target&&e.target.tagName)||'';
  if(e.code==='Space'&&tag!=='INPUT'&&tag!=='TEXTAREA'&&tag!=='SELECT'){e.preventDefault();edStep()}
  if(e.code==='ArrowRight'&&tag!=='INPUT'&&tag!=='TEXTAREA')edStep();
  if(e.code==='Escape'){closePop();closeMap()}
  if((e.ctrlKey||e.metaKey)&&e.code==='KeyZ'){e.preventDefault();undo()}});
 try{if(localStorage.getItem('etl_admin')==='1'&&SS&&SK&&nodeNow&&S[nodeNow])adm(true);else{try{localStorage.setItem('etl_admin','0')}catch(e){}}}catch(e){}
 /* Les personnalisations importées sont explicites : une ancienne sauvegarde ne doit pas écraser les dialogues corrigés. */
})();


/* Migration narrative : invalider les états de reprise créés par les versions incohérentes. */
try{
 const ver=localStorage.getItem('etl_story_schema');
 if(ver!=='2026-10-coherence-2'){
   localStorage.removeItem('etl_resume_v4');
   localStorage.setItem('etl_story_schema','2026-10-coherence-2');
 }
}catch(e){}


/* Réécriture narrative intégrale de Lou — dialogues et branches cohérents */
Object.assign(S,{
q0:{w:"pluie",m:[N("Samedi, 14 h 12. Tu es chez toi, en train de ranger des cartons. La pluie frappe les vitres."),N("Un numéro inconnu t'envoie un SMS."),H("Marion, je suis devant l'église. Je n'arrive pas à sortir de la voiture. Dis-moi que tu es déjà là, s'il te plaît.")],c:[["Tu t'es trompée de numéro. Tu es en sécurité ?","q1a",{care:1}], ["Mauvais numéro. Si tu es en danger, appelle les secours ou quelqu'un sur place.","q1b",{bound:1,practical:1}], ["Je ne suis pas Marion, mais je peux te laisser le temps de contacter quelqu'un.","q1c",{care:1,bound:1}]]},
q1a:{m:[H("Oh non. Pardon. Oui, je me suis trompée de numéro. Je voulais écrire à Marion, ma meilleure amie."),H("Je ne suis pas en danger. Je suis juste dans ma voiture, devant l'église, et je panique. Tu n'as pas à t'occuper de ça, désolée.")],c:[["D'accord. Tu veux que je te laisse tranquille ou tu as besoin de deux minutes pour joindre quelqu'un ?","q2a",{agency:1,care:1}], ["Appelle Marion ou ta cousine. Elles te connaissent, moi pas.","q2b",{practical:1,bound:1}], ["Pourquoi tu n'arrives pas à sortir de la voiture ?","q2c",{ask:1}]]},
q1b:{m:[H("Tu as raison, je vais appeler ma cousine. Et pardon, je viens de réaliser que ce n'est pas le bon numéro."),H("Je voulais écrire à Marion. Je vais arrêter de t'embêter.")],c:[["Tu ne m'embêtes pas, mais oui, appelle quelqu'un sur place. Bon courage.","q2b",{bound:1,practical:1}], ["Avant que tu partes : tu m'as écrit que tu n'arrivais pas à sortir. Tu es bloquée ou c'est la panique ?","q2c",{ask:1,care:1}]]},
q1c:{m:[H("Merci de ne pas avoir répondu juste 'mauvais numéro'. Je m'appelle Lou. Je sais, c'est bizarre de donner mon prénom à un inconnu."),H("Je vais appeler ma cousine. Je voulais juste que Marion me réponde, mais je viens d'envoyer ça à la mauvaise personne. Désolée.")],c:[["Lou, appelle ta cousine. Tu n'as pas besoin de tout m'expliquer.","q2b",{bound:1,care:1}], ["Je peux rester deux minutes pendant que tu reprends ton souffle, si tu le veux. Après, il faudra appeler quelqu'un qui te connaît.","q2a",{care:1,agency:1}]]},
q2a:{m:[H("Deux minutes, alors. Et je te dirai quand j'aurai appelé ma cousine."),H("Je dois être à l'intérieur dans vingt minutes. C'est le mariage de Marion. Je suis sa demoiselle d'honneur."),H("Le marié est Adrien. Mon ex. Je sais que ça fait cliché, mais je ne pensais pas que ça me ferait cet effet.")],c:[["Tu peux m'expliquer ce qui te fait le plus peur, sans tout raconter si tu n'en as pas envie.","q3a",{care:1,ask:1}], ["Tu n'as pas à rester à un mariage si tu ne le peux pas. Mais préviens Marion plutôt que de disparaître.","q3b",{agency:1,practical:1}], ["Je ne suis pas sûr d'être la bonne personne pour parler de ça. Ta cousine peut venir te rejoindre ?","q3c",{bound:1,practical:1}]]},
q2b:{m:[H("J'ai appelé ma cousine. Elle m'a dit qu'elle sortait me chercher."),H("Je devrais m'arrêter là. Je ne sais même pas qui tu es et je suis en train de t'envoyer des messages beaucoup trop personnels."),N("Un silence de deux minutes. Puis un nouveau SMS."),H("Elle n'est pas encore là. Je crois que j'ai surtout honte. Marion m'a demandé hier si je serais là pour elle. J'ai dit oui sans hésiter.")],c:[["Tu peux lui dire que tu as besoin de cinq minutes. Ce n'est pas la même chose que l'abandonner.","q3b",{practical:1,care:1}], ["Tu as le droit de t'arrêter là. Je ne vais pas te demander de continuer à me parler.","q3c",{bound:1}], ["Pourquoi as-tu dit oui si tu savais qu'Adrien serait là ?","q3a",{ask:1}]]},
q2c:{m:[H("Je peux sortir. Je n'ai pas perdu l'usage de mes jambes, promis."),H("C'est juste que si j'ouvre la portière, je vais devoir entrer, sourire, arranger la traîne de Marion et voir Adrien au premier rang. Et je ne sais pas si je peux faire tout ça sans craquer."),H("Pardon. C'était une réponse un peu sèche. Tu as posé une question normale, je suis à cran.")],c:[["Tu n'as pas à t'excuser. Qu'est-ce qui serait le plus difficile : voir Adrien, ou faire semblant devant Marion ?","q3a",{ask:1,care:1}], ["Tu peux sortir de la voiture sans décider tout de suite d'entrer.","q3b",{agency:1,practical:1}], ["Je vais te laisser appeler ta cousine. Je ne veux pas prendre la place de quelqu'un qui peut être là pour toi.","q3c",{bound:1}]]},
q3a:{m:[H("Le pire, c'est que je ne sais même pas si j'ai encore des sentiments pour Adrien."),H("On s'est séparés il y a presque deux ans. J'avais accepté un poste à Nantes. Il m'a dit qu'il ne voulait pas d'une relation à distance. J'ai refusé le poste pour lui, puis je lui en ai voulu de m'avoir laissée faire."),H("Six mois plus tard, il est parti quand même. Et Marion m'a ramassée à la petite cuillère. Aujourd'hui, je dois être heureuse pour elle, et je le suis. Mais je suis aussi jalouse de la facilité avec laquelle tout le monde semble avancer."),H("Voilà. C'est la première fois que je le dis comme ça. Je ne te demande pas de me donner raison.")],c:[["Tu peux être heureuse pour elle et avoir mal en même temps. Les deux peuvent être vrais.","q4a",{care:1,honest:1}], ["Tu regrettes surtout Adrien, ou la vie que tu avais imaginée à Nantes ?","q4b",{ask:1}], ["Je ne peux pas savoir ce que tu devrais faire. Qu'est-ce que tu veux que Marion comprenne aujourd'hui ?","q4c",{agency:1,ask:1}]]},
q3b:{m:[H("Ma cousine est là. Elle vient de taper à la vitre et elle a l'air inquiète."),N("Lou ne répond pas pendant un moment. Tu vois l'indication 'écrit…', puis elle disparaît."),H("Je lui ai dit que j'avais besoin de cinq minutes. Elle s'est assise à côté de moi sans essayer de me convaincre. Je crois que j'avais besoin de ça."),H("Elle me demande si je veux entrer ou si je veux qu'elle prévienne Marion. Je dois choisir maintenant.")],c:[["Demande-lui de prévenir Marion et de lui dire que tu veux lui parler avant la cérémonie.","q4c",{honest:1,agency:1}], ["Entre avec ta cousine, mais promets-toi de ne pas jouer la comédie toute la journée.","q4a",{practical:1,care:1}], ["Dis à ta cousine que tu ne peux pas entrer aujourd'hui. Fais prévenir Marion toi-même.","q4d",{agency:1,bound:1}]]},
q3c:{m:[H("Ma cousine vient d'arriver. Je vais raccrocher— enfin, arrêter d'écrire. Désolée, mauvais numéro et mauvais moment."),N("Tu penses que la conversation est terminée. Quelques minutes plus tard, un dernier message arrive."),H("Je lui ai dit que je n'allais pas bien. Elle n'a pas demandé pourquoi tout de suite. Elle m'a juste demandé ce dont j'avais besoin. Je ne savais pas quoi répondre." )],c:[["Tu peux commencer par lui demander de rester avec toi cinq minutes.","q4a",{care:1,practical:1}], ["Tu n'as pas besoin d'avoir une explication parfaite pour dire que ça ne va pas.","q4c",{honest:1}], ["Je te souhaite bon courage, Lou. Je vais te laisser avec elle.","q4d",{bound:1}]]},
q4a:{m:[H("J'ai ouvert la portière. Je suis dehors. C'est idiot, mais j'ai l'impression d'avoir déjà fait la moitié du chemin."),N("La pluie tambourine sur le parapluie de sa cousine. Des pas pressés résonnent sur les dalles devant l'église."),H("La robe est dans sa housse, sur la banquette arrière. Marion a choisi la même couleur pour nous deux. Hier, j'étais contente. Aujourd'hui, je n'arrive plus à la regarder sans penser à tout ce que je n'ai pas dit."),H("Ma cousine me demande si elle doit aller chercher Marion. Je ne veux pas la faire attendre, mais je ne veux pas non plus lui voler sa journée.")],c:[["Demande à Marion de sortir deux minutes. Elle mérite la vérité avant que tu entres.","q5a",{truth:1,agency:1}], ["Entre et parle-lui après la cérémonie, quand vous aurez un moment à vous.","q5b",{practical:1}], ["Si tu sais que tu vas faire semblant tout du long, dis-lui maintenant que tu ne peux pas être demoiselle d'honneur aujourd'hui.","q5c",{bound:1,agency:1}]]},
q4b:{m:[H("Je crois que c'est la vie que j'avais imaginée. Nantes, le travail, un appartement à deux. Adrien est devenu le visage de ce projet, alors je confonds les deux."),H("Ça ne rend pas les choses moins douloureuses, mais c'est différent. Je n'ai pas besoin de le récupérer pour regretter ce que j'ai abandonné."),H("Je vais écrire à Marion. Pas un grand discours. Juste lui demander cinq minutes avant la cérémonie.")],c:[["Écris-lui avec tes mots. Ne t'excuse pas d'avoir des sentiments ; excuse-toi seulement si tu lui as caché quelque chose qui la concerne.","q5a",{honest:1}], ["Tu peux aussi attendre après la cérémonie, si tu as besoin de reprendre ton souffle.","q5b",{practical:1}], ["Tu peux lui dire que tu ne seras pas capable d'assurer ton rôle aujourd'hui.","q5c",{agency:1}]]},
q4c:{m:[H("Je lui ai écrit : 'Je suis devant l'église. Je suis heureuse pour toi, mais je ne vais pas bien et j'ai besoin de te parler avant d'entrer. Je ne te demande pas de changer quoi que ce soit.'"),N("Le message est marqué comme lu. Pas de réponse pendant quarante secondes."),H("Elle répond : 'J'arrive. Merci de me l'avoir dit. J'aurais préféré le savoir hier, mais j'arrive.'"),H("Je sais qu'elle est blessée. Je ne vais pas lui demander de me rassurer là-dessus.")],c:[["C'est une réponse honnête. Laisse-la venir et écoute aussi ce qu'elle a à te dire.","q5a",{honest:1,care:1}], ["Si tu ne te sens pas capable d'entrer après cette conversation, tu as encore le droit de partir.","q5c",{agency:1}]]},
q4d:{m:[H("J'ai dit à ma cousine que je ne pouvais pas entrer comme si tout allait bien. Elle ne m'a pas traitée d'égoïste."),H("J'ai envoyé à Marion : 'Je suis désolée de te dire ça maintenant. Je t'aime, mais je ne suis pas capable d'être à tes côtés aujourd'hui. Je t'expliquerai quand tu le voudras.'"),H("Je sais que ça va lui faire mal. Je ne peux pas choisir à sa place comment elle le prendra.")],c:[["Tu as le droit de partir, mais reste disponible pour assumer cette conversation plus tard.","q5c",{agency:1,honest:1}], ["Demande à ta cousine de rester avec toi pendant que tu attends sa réponse.","q5d",{care:1,practical:1}]]},
q5a:{m:[N("La porte de l'église s'ouvre. Marion apparaît, déjà coiffée, les yeux inquiets."),H("Elle ne m'a pas demandé de sourire. Elle m'a demandé : 'Pourquoi tu ne m'as rien dit ?'"),H("Je lui ai parlé de Nantes, d'Adrien, de la honte de ne pas être aussi heureuse que je pensais devoir l'être. Je n'ai pas dit qu'elle avait tort de se marier. Je lui ai dit que j'avais peur de perdre ma place dans sa vie."),H("Elle a pleuré, mais elle m'a aussi dit qu'elle était blessée. Elle aurait voulu pouvoir être mon amie avant d'être la mariée."),H("Je ne peux pas effacer ça. Je peux seulement lui répondre honnêtement maintenant.")],c:[["Dis-lui que tu es désolée de lui avoir caché ça et demande-lui ce dont elle a besoin pour la suite.","q6a",{honest:1,care:1}], ["Dis-lui que tu vas entrer, mais que tu ne promets pas de pouvoir jouer la demoiselle d'honneur parfaite.","q6b",{agency:1}], ["Laisse-lui le choix de continuer la cérémonie sans toi si elle en a besoin.","q6c",{bound:1,honest:1}]]},
q5b:{m:[N("Tu entres dans l'église avec ta cousine. La cérémonie commence. Lou ne t'écrit pas pendant près d'une heure."),N("À 15 h 38, ton téléphone vibre."),H("Je suis restée jusqu'aux vœux. J'ai pleuré un peu, mais je n'ai pas fait semblant d'être ravie chaque seconde. Après les photos, j'ai demandé à Marion si on pouvait parler seules."),H("Elle a dit oui. Je crois que j'ai compris que repousser une conversation ne la rend pas forcément plus facile, mais parfois ça nous donne assez de calme pour la tenir.")],c:[["Laisse-la te dire ce qu'elle a ressenti, même si c'est difficile à entendre.","q6a",{care:1,honest:1}], ["Tu peux lui expliquer que tu voulais respecter sa journée, sans prétendre que c'était la seule raison de ton silence.","q6b",{honest:1}]]},
q5c:{m:[H("Je ne suis pas entrée. J'ai attendu que Marion lise mon message, puis j'ai appelé ma cousine pour lui dire que je rentrais."),H("Marion m'a répondu : 'Je suis blessée. Je ne vais pas faire semblant que ça ne me touche pas. Mais je préfère que tu me le dises plutôt que de te voir souffrir en silence.'"),H("Je suis partie. Je n'ai pas demandé qu'elle me pardonne tout de suite. Je ne sais pas si j'ai pris la meilleure décision, mais au moins, c'est moi qui l'ai prise.")],c:[["Tu pourras reprendre cette conversation quand elle sera prête. Ne disparais pas par honte.","q6c",{honest:1,agency:1}], ["Tu as aussi le droit de prendre du recul aujourd'hui. Appelle ta cousine une fois rentrée.","q6d",{care:1,bound:1}]]},
q5d:{m:[H("Ma cousine est restée avec moi. Elle n'a pas essayé de m'expliquer ce que je devais ressentir. Elle m'a demandé si je voulais rentrer, marcher un peu ou attendre la réponse de Marion."),H("J'ai choisi de marcher jusqu'au café au coin de la rue. Pour la première fois depuis ce matin, je n'ai pas eu à jouer un rôle pendant dix minutes.")],c:[["C'est un début. Demain, tu pourras réfléchir à ce que tu veux réparer et à ce que tu dois accepter.","q6d",{care:1,agency:1}], ["Écris à Marion que tu es prête à parler quand elle le sera, sans exiger une réponse ce soir.","q6c",{honest:1}]]},
q6a:{m:[H("Je lui ai dit que j'étais désolée de lui avoir caché mes doutes. Elle m'a dit qu'elle m'aimait, mais qu'elle ne pouvait pas être la seule à faire attention à ce que je ressens si je ne lui dis jamais rien."),H("On n'a pas tout réglé sur le trottoir. On a décidé de se revoir la semaine prochaine, sans mariage autour de nous."),H("Je vais entrer pour la fin de la cérémonie. Pas parce que je lui dois une performance. Parce que je veux être présente, à ma façon.")],k:"Fin · Dire la vérité sans exiger d'être pardonnée",x:"v0"},
q6b:{m:[H("Je lui ai dit que je voulais rester, mais pas prétendre que rien ne se passait. Marion a essuyé ses joues et m'a répondu : 'Alors reste comme tu es. Je préfère ça.'"),H("Je vais remettre ma robe. Je ne suis pas guérie, je ne suis pas devenue soudainement généreuse. Je vais juste essayer d'être là pour elle sans m'abandonner moi-même."),N("Tu ne reçois pas de message pendant la cérémonie. Plus tard, Lou t'envoie simplement : 'Merci d'avoir répondu à une inconnue. Tu n'as pas vécu ça à ma place, et c'est mieux comme ça.'")],k:"Fin · Être là sans faire semblant",x:"v0"},
q6c:{m:[H("Marion a choisi de continuer sans moi à ses côtés. Ça m'a fait mal, et je comprends pourquoi elle l'a fait."),H("Je suis rentrée avec ma cousine. J'ai envoyé un message pour lui dire que je l'aime et que je serai prête à parler quand elle le sera. Je ne vais pas lui demander de me rassurer parce que je me sens coupable."),N("Ce n'est pas une réconciliation. C'est une porte qui reste ouverte, si on décide toutes les deux de la pousser.")],k:"Fin · Respecter sa décision",x:"v0"},
q6d:{m:[H("Je suis rentrée. Je n'ai pas réglé toute ma vie aujourd'hui. J'ai juste arrêté de prétendre que j'allais bien."),H("Je vais appeler Marion dans quelques jours. Pas pour exiger qu'elle comprenne, mais pour lui expliquer ce que j'aurais dû lui dire avant."),H("Et le poste à Nantes ? Je vais regarder ce qui existe encore. Je ne sais pas où ça me mènera, mais cette décision-là m'appartient.")],k:"Fin · Recommencer par soi-même",x:"v0"},
/* Les chapitres suivants prolongent les conséquences au lieu de rejouer la scène du mariage. */
l2_0:{w:"nuit",m:[N("Le lendemain, 11 h 06. Tu reçois un message de Lou. Tu ne lui as pas écrit depuis hier."),H("Salut. Je voulais te dire que j'ai dormi trois heures et que j'ai encore mal au ventre en pensant à Marion. Je ne sais pas si tu as envie d'avoir des nouvelles après tout ça, donc tu peux ne pas répondre." )],c:[["Merci de me donner des nouvelles. Comment ça s'est passé avec Marion, après la cérémonie ?","l2a",{ask:1,care:1}], ["Je suis content que tu aies écrit, mais je préfère ne pas devenir ton soutien principal.","l2b",{bound:1,honest:1}], ["Tu n'as pas besoin de tout résoudre aujourd'hui. Tu as pu manger ou dormir un peu ?","l2c",{practical:1,care:1}]]},
l2a:{m:[H("On s'est parlé sur le trottoir. Elle m'a dit qu'elle était blessée que je lui aie caché mes doutes jusqu'au jour même. Elle avait raison sur ça."),H("Mais elle m'a aussi dit qu'elle ne voulait pas que je reste dans sa vie uniquement quand je vais bien. On a convenu de prendre un café la semaine prochaine.")],c:[["C'est un vrai début. Il faudra encore vous écouter toutes les deux.","l3_0",{care:1}], ["Tu peux reconnaître ta part sans te rendre responsable de tout ce qu'elle ressent.","l3_0",{agency:1,honest:1}]]},
l2b:{m:[H("Je comprends. Et c'est sain que tu le dises. Je ne veux pas te transformer en personne à qui j'écris dès que je panique."),H("Je vais parler à ma cousine et chercher quelqu'un avec qui démêler tout ça dans ma vraie vie. Merci d'avoir été clair sans être cruel.")],c:[["Je te souhaite vraiment de trouver du soutien autour de toi.","l3_0",{bound:1,care:1}], ["On peut échanger de temps en temps, tant qu'on garde ça honnête et sans obligation.","l3_0",{care:1}]]},
l2c:{m:[H("J'ai mangé un toast. C'est pas glorieux, mais c'est déjà ça."),H("J'ai aussi envoyé un mail à l'ancien contact du poste de Nantes pour demander s'il existe encore des opportunités. Je ne vais pas décider de déménager sur un coup de tête. Je veux juste savoir ce qui est possible.")],c:[["C'est concret. Une question à la fois, une décision à la fois.","l3_0",{practical:1}], ["Tu le fais parce que tu en as envie, ou pour prouver que tu n'as pas raté ta chance ?","l3b",{ask:1}]]},
l3_0:{w:"nuit",m:[N("Quatre jours plus tard, 19 h 42."),H("J'ai vu Marion. On a parlé deux heures. Elle m'a dit des choses qui m'ont fait mal, et j'ai réussi à ne pas transformer ça en preuve qu'elle ne m'aime plus."),H("Elle m'a demandé ce que je voulais, moi, en dehors de cette histoire avec Adrien. Je n'ai pas su répondre tout de suite." )],c:[["Tu peux prendre le temps de le découvrir. Tu n'as pas besoin d'une réponse spectaculaire.","l3a",{care:1}], ["Qu'est-ce que tu as envie d'essayer, même si tu n'es pas sûre d'y arriver ?","l3b",{ask:1,agency:1}], ["Tu peux commencer par le poste à Nantes, sans décider tout le reste maintenant.","l3c",{practical:1}]]},
l3a:{m:[H("Je lui ai dit que je ne savais pas. Avant, j'aurais inventé une réponse pour ne pas paraître perdue. Elle a attendu que je trouve mes mots. C'était étrange, mais bien.")],x:"l4_0"},
l3b:{m:[H("Je veux recommencer à dessiner. J'ai arrêté quand j'ai refusé le poste, parce que j'avais l'impression que tout ce que je voulais devait passer après le couple. Je ne veux pas refaire la même erreur." )],x:"l4_0"},
l3c:{m:[H("J'ai envoyé mon CV. Pas pour fuir la ville ni pour récupérer une ancienne version de moi. Juste pour voir si cette porte existe encore. Si elle est fermée, j'en chercherai une autre.")],x:"l4_0"},
l4_0:{m:[N("Deux semaines passent. Tu n'as pas de nouvelles de Lou jusqu'à un mardi soir."),H("J'ai eu un entretien téléphonique pour un poste. Ce n'est pas à Nantes finalement, c'est hybride et dans une autre ville. Je n'ai pas encore décidé si je le veux."),H("La chose la plus bizarre, c'est que je peux maintenant en parler à Marion sans avoir peur qu'elle pense que je l'abandonne." )],c:[["Compare ce que le poste t'apporterait avec ce qu'il te coûterait, puis décide pour toi.","l4a",{practical:1,agency:1}], ["Qu'est-ce qui te donne envie de dire oui, et qu'est-ce qui te fait peur ?","l4b",{ask:1}], ["Tu n'as pas besoin de choisir cette semaine juste pour prouver que tu avances.","l4c",{care:1}]]},
l4a:{m:[H("J'ai fait une liste. Pour une fois, j'ai écrit ce que moi je voulais avant de penser à ce que les autres trouveraient raisonnable.")],x:"l5_0"},
l4b:{m:[H("J'ai envie du travail. J'ai peur de recommencer à organiser ma vie autour de quelqu'un et de m'en vouloir après. Je sais au moins que ce sont deux questions différentes.")],x:"l5_0"},
l4c:{m:[H("J'ai demandé quelques jours pour réfléchir. L'ancien moi aurait accepté ou refusé dans la panique, juste pour que l'incertitude s'arrête. Je peux attendre une réponse sans me précipiter.")],x:"l5_0"},
l5_0:{w:"nuit",m:[N("Un mois après le mauvais numéro."),H("J'ai accepté le poste. Pas parce que Nantes est magique ou parce que je dois réparer le passé. Les conditions me conviennent et j'ai envie d'essayer."),H("Marion m'a aidée à choisir une tenue pour l'entretien. On n'est pas revenues exactement à ce qu'on était avant, et je crois que c'est mieux de ne pas faire semblant."),H("Je vais supprimer notre conversation bientôt. Pas parce que je regrette de t'avoir écrit. Parce que je ne veux pas confondre le fait qu'un inconnu m'ait répondu un jour avec une dette ou une promesse."),H("Tu m'as répondu alors que tu n'avais aucune raison de le faire. Tu as aussi eu le droit de poser des limites. Je crois que c'est ça que je retiens."),N("Le numéro inconnu ne t'écrira plus. Lou retourne à sa vie, et toi à la tienne. Ce n'est pas une histoire où tu l'as sauvée : c'est une histoire où un échange imprévu lui a permis de faire un premier pas, et où tes choix ont changé la façon dont elle l'a fait.")],k:"Fin · Une rencontre, pas une dette"}
});


/* Rythme narratif : révélations progressives, prénoms présentés tôt, réponses qui suivent les choix. */
Object.assign(S,{
q0:{w:"pluie",m:[N("Samedi, 14 h 12. Tu ranges ton appartement quand un numéro inconnu t'écrit."),H("Marion, t'es où ? Je suis devant l'église. J'arrive pas à sortir de la voiture.")],c:[["Tu t'es trompée de numéro. Tu es en sécurité ?","intro_care",{care:1}],["Mauvais numéro. Si tu es en danger, appelle quelqu'un sur place.","intro_practical",{bound:1,practical:1}],["Je ne suis pas Marion, mais je peux te répondre deux minutes.","intro_open",{care:1}]]},
intro_care:{m:[H("Oh mince. Pardon, oui, mauvais numéro. Je ne suis pas en danger, juste... paniquée. Désolée de t'avoir dérangé."),H("Je m'appelle Lou. Je cherchais Marion, ma meilleure amie.")],c:[["Moi c'est Sam. Tu veux que je te laisse tranquille ?","intro_boundary",{bound:1}],["Sam. Tu veux que je reste deux minutes pendant que tu appelles quelqu'un ?","intro_stay",{care:1}]]},
intro_practical:{m:[H("Tu as raison. Je vais appeler ma cousine. Et pardon : je viens de voir que je me suis trompée de numéro."),H("Je m'appelle Lou. Je voulais joindre Marion, pas un inconnu. Désolée.")],c:[["Sam. J'espère que ta cousine pourra t'aider. Bon courage.","intro_end",{bound:1}],["Sam. Avant que tu partes, tu es bloquée ou tu as juste besoin de reprendre ton souffle ?","intro_question",{ask:1,care:1}]]},
intro_open:{m:[H("Merci. Je viens de comprendre que ce n'est pas Marion. Je m'appelle Lou, et je suis vraiment désolée."),H("Je ne devrais pas te demander de m'aider. Je vais appeler ma cousine.")],c:[["Moi c'est Sam. Bonne idée, appelle quelqu'un qui te connaît.","intro_end",{practical:1,bound:1}],["Sam. Je peux rester un instant, mais tu ne me dois aucune explication.","intro_stay",{care:1}]]},
intro_boundary:{m:[H("Oui, bien sûr. Pardon encore, Sam. Je vais appeler ma cousine. Bonne journée.")],c:[["Bon courage, Lou.","qend",{bound:1}],["Attends, juste une chose : tu dis que tu n'arrives pas à sortir. Tu es en sécurité ?","intro_question",{care:1}]]},
intro_end:{m:[H("Merci, Sam. Ma cousine répond. Je vais l'appeler. Désolée pour l'intrusion.")],k:"Fin · Un message, puis chacun reprend sa journée"},
intro_question:{m:[H("Oui, je suis en sécurité. Je suis assise dans ma voiture devant une église. C'est juste que je n'arrive pas à ouvrir la portière."),H("Je ne vais pas te raconter ma vie, promis. Je vais appeler ma cousine. Merci d'avoir demandé, Sam.")],c:[["D'accord. Fais ça d'abord. Tu n'as pas à gérer ça seule.","q2b",{care:1,practical:1}],["Je comprends. Je te laisse appeler. Bon courage, Lou.","qend",{bound:1}]]},
intro_stay:{m:[H("Merci, Sam. Deux minutes, pas plus. Je vais appeler ma cousine après."),H("Je suis devant l'église pour le mariage de Marion. Je suis censée être sa demoiselle d'honneur."),N("Lou écrit, s'arrête, puis reprend."),H("Le marié s'appelle Adrien. C'est mon ex. Je sais, ça complique un peu les choses.")],c:[["Vous vous êtes séparés récemment ?","q2c",{ask:1}],["Tu n'es pas obligée d'entrer. Appelle ta cousine et vois avec elle.","q2b",{practical:1,care:1}],["Je ne sais pas quoi te dire, mais je peux écouter un peu.","q2a",{honest:1,care:1}]]},
q1a:{m:[H("Oh mince, pardon. Oui, je me suis trompée de numéro. Je voulais écrire à Marion, ma meilleure amie."),H("Je suis en sécurité. Juste assise dans ma voiture, devant l'église. Je vais appeler ma cousine, désolée.")],c:[["Moi c'est Sam. Tu veux que je te laisse tranquille ou que je reste deux minutes ?","intro_stay",{care:1,agency:1}],["Appelle ta cousine. Elle pourra t'aider mieux que moi.","q2b",{practical:1,bound:1}]]},
q1b:{m:[H("Tu as raison. Je vais appeler ma cousine. Et pardon, je viens de réaliser que ce n'est pas le bon numéro."),H("Je cherchais Marion. Je m'appelle Lou. Je vais arrêter de t'embêter.")],c:[["Sam. Tu ne m'embêtes pas, mais appelle quelqu'un sur place.","intro_question",{care:1,practical:1}],["Bon courage, Lou.","qend",{bound:1}]]},
q1c:{m:[H("Merci. Je m'appelle Lou. Et je viens de comprendre que je t'ai écrit par erreur. Désolée."),H("Je vais appeler ma cousine. Je voulais juste que Marion me réponde.")],c:[["Moi c'est Sam. Appelle ta cousine, tu n'as pas à tout m'expliquer.","q2b",{bound:1,care:1}],["Sam. Je peux rester deux minutes si tu veux, sans te pousser à raconter.","intro_stay",{care:1,honest:1}]]},
q2a:{m:[H("Merci. Je suis demoiselle d'honneur. Je dois entrer dans vingt minutes."),H("Et le marié, Adrien, c'est mon ex. On s'est séparés il y a deux ans. Je n'avais pas prévu de le revoir aujourd'hui."),N("Lou efface quelque chose, puis envoie un autre message."),H("C'est tout ce que j'arrive à dire pour l'instant.")],c:[["Qu'est-ce qui te fait le plus peur : le revoir, ou devoir faire semblant devant Marion ?","q3a",{ask:1,care:1}],["Tu peux demander à ta cousine de venir te chercher avant de décider.","q3b",{practical:1}],["Merci de me l'avoir dit. Tu n'as pas besoin d'en dire plus.","q2b",{bound:1,care:1}]]},
q2b:{m:[H("J'ai appelé ma cousine. Elle arrive."),N("Deux minutes passent."),H("Je ne sais pas pourquoi je te réécris. Je crois que j'avais juste besoin de dire à quelqu'un que j'ai peur."),H("Marion m'a demandé hier si je serais là pour elle. J'ai dit oui. Je ne veux pas lui gâcher sa journée.")],c:[["Être honnête avec elle, ce n'est pas forcément gâcher sa journée.","q3a",{honest:1}],["Attends ta cousine. Tu n'as pas à décider seule dans la panique.","q3b",{care:1,practical:1}],["Je préfère ne pas m'en mêler davantage, Lou. Mais j'espère que ça ira.","qend",{bound:1}]]},
q2c:{m:[H("On s'est séparés il y a deux ans. Je ne pensais plus que ça me ferait quelque chose."),H("Je ne sais même pas si c'est Adrien qui me fait peur, ou le fait de revoir la vie que j'avais imaginée."),N("Elle attend une réponse. Pour la première fois, elle ne rajoute rien.")],c:[["Tu peux me raconter ce que tu veux dire par 'la vie imaginée'.","q3a",{ask:1}],["Tu n'as pas besoin de résoudre ça maintenant. Appelle ta cousine.","q3b",{care:1,practical:1}]]},
q3a:{m:[H("J'avais accepté un poste à Nantes. Adrien ne voulait pas de relation à distance, alors j'ai refusé le poste."),N("Quelques secondes passent."),H("On s'est séparés six mois plus tard. Je ne lui en veux pas de tout, mais je m'en veux d'avoir choisi à sa place."),H("Marion m'a aidée après la rupture. Aujourd'hui, je veux être là pour elle. Je ne sais juste pas comment entrer dans cette église sans craquer.")],c:[["Tu peux lui dire que tu es heureuse pour elle et que tu as quand même du mal.","q4c",{honest:1,care:1}],["Tu peux entrer sans prétendre aller parfaitement bien.","q4a",{agency:1}],["Demande à ta cousine de prévenir Marion et prends cinq minutes avant de décider.","q3b",{practical:1,care:1}]]},
qend:{m:[N("Le numéro reste silencieux. Tu retournes à tes cartons. Tu ne sauras pas comment Lou a vécu cette journée.")],k:"Fin · Une rencontre qui s'arrête là"}
});

