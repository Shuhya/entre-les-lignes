#!/usr/bin/env node
/* Smoke test : mock DOM + VM, rejoue le chapitre 1 complet sans exception.
   Utilisé par la CI (ci.yml). ROUTE=a (piège : h5c/MMS → appel h8p → h11p)
   ou ROUTE=b (honnête : h5b → aveu → trst élevé → variante chaude h11w). */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ROUTE = (process.env.ROUTE || 'a');
const DIV = 8; // accélère setTimeout/setInterval

function mkClass(el){return{add:(...c)=>c.forEach(x=>{if(!el.className.split(/\s+/).includes(x))el.className=(el.className?el.className+" ":"")+x}),
 remove:(...c)=>c.forEach(x=>{el.className=el.className.split(/\s+/).filter(y=>y!==x).join(" ")}),
 toggle:(x,f)=>{const h=el.className.split(/\s+/).includes(x);const on=f===undefined?!h:!!f;if(on&&!h)el.className=(el.className?el.className+" ":"")+x;else if(!on&&h)el.className=el.className.split(/\s+/).filter(y=>y!==x).join(" ")},
 contains:x=>el.className.split(/\s+/).includes(x)}}
function unesc(s){return s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g," ").replace(/&amp;/g,"&")}
function ser(el){let out="";for(const c of el.children){if(c._text!==undefined){out+=c._text;continue}
 let a="";if(c.id)a+=' id="'+c.id+'"';const cls=c.getAttribute("class")||"";if(cls)a+=' class="'+cls+'"';
 out+="<"+c.tagName.toLowerCase()+a+">"+(c._raw||ser(c))+"</"+c.tagName.toLowerCase()+">"}return out}
function parseHTML(el,html){el.children=[];const stack=[el];const re=/<\/?([a-zA-Z][\w-]*)((?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s">]+))?)*)\s*(\/?)>|([^<]+)/g;let m;
 while((m=re.exec(html))){if(m[4]!==undefined&&m[4]!==""){stack[0].children.push({_text:unesc(m[4]),children:[],parentNode:stack[0]});continue}
  const tag=m[1].toLowerCase(),self=m[3]==="/";
  if(m[0][1]==="/"){if(stack.length>1)stack.pop();continue}
  const ch=mkEl(tag);const rest=m[2]||"";
  const are=/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s">]+)))?/g;let am;
  while((am=are.exec(rest))){const k=am[1],v=am[2]!==undefined?am[2]:(am[3]!==undefined?am[3]:am[4]);
   if(k==="class")ch.className=unesc(v||"");else if(k==="id")ch.id=v;else ch.setAttribute(k,unesc(v===undefined?"":v))}
  ch.parentNode=stack[0];stack[0].children.push(ch);if(!self)stack.push(ch)}}
const byId={};const doc={body:null};
function mkEl(tag){const el={tagName:(tag||"div").toUpperCase(),_id:null,className:"",children:[],parentNode:null,style:{},dataset:{},_attrs:{},_listeners:{},hidden:false,disabled:false,value:"",scrollTop:0,
 get id(){return this._id},set id(v){if(byId[this._id]===this)delete byId[this._id];this._id=v;if(v!=null)byId[v]=this},
 get classList(){return mkClass(this)},
 get isConnected(){let p=this.parentNode;while(p){if(p===doc.body)return true;p=p.parentNode}return false},
 get parentElement(){return this.parentNode},
 get textContent(){return this.children.map(c=>c._text!==undefined?c._text:c.textContent).join("")},
 set textContent(v){this.children=[{_text:String(v),children:[],parentNode:this}]},
 get innerHTML(){return this._raw!==undefined?this._raw:ser(this)},
 set innerHTML(v){this._raw=undefined;parseHTML(this,String(v))},
 setAttribute(k,v){this._attrs[k]=String(v);if(k==="class")this.className=String(v);if(k==="id")this.id=v},
 getAttribute(k){if(k==="class")return this.className||"";return this._attrs[k]===undefined?null:this._attrs[k]},
 append(...ns){for(const n of ns){if(n&&n.parentNode&&n.parentNode.children)n.parentNode.children=n.parentNode.children.filter(x=>x!==n);n.parentNode=this;this.children.push(n)}},
 appendChild(n){this.append(n);return n},
 prepend(...ns){for(let i=ns.length-1;i>=0;i--){const n=ns[i];if(n.parentNode&&n.parentNode.children)n.parentNode.children=n.parentNode.children.filter(x=>x!==n);n.parentNode=this;this.children.unshift(n)}},
 replaceChildren(...ns){this.children=[];this.append(...ns)},
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null}},
 contains(x){let p=x;while(p){if(p===this)return true;p=p.parentNode}return false},
 querySelector(s){return qa(this,s)[0]||null},
 querySelectorAll(s){return qa(this,s)},
 addEventListener(t,f){(this._listeners[t]=this._listeners[t]||[]).push(f)},
 click(){const ev={target:this,stopPropagation(){},preventDefault(){},contains:o=>this.contains(o)};this._listeners.click&&this._listeners.click.forEach(f=>f(ev));if(this.onclick)this.onclick(ev)},
 getContext(){const g={addColorStop(){}};return{fillStyle:"",strokeStyle:"",font:"",textAlign:"",globalAlpha:1,fillRect(){},clearRect(){},fillText(){},drawImage(){},createLinearGradient:()=>g,beginPath(){},moveTo(){},lineTo(){},fill(){},stroke(){},save(){},restore(){},clip(){}}}};return el}
function matches(el,s){s=s.trim();let not=null;const nm=s.match(/:not\(([^)]+)\)/);if(nm){not=nm[1].replace(/^\./,"");s=s.replace(/:not\([^)]+\)/,"")}
 const parts=[];const re=/([a-zA-Z][\w-]*|#[\w-]+|\.[\w-]+)/g;let m;while((m=re.exec(s)))parts.push(m[1]);
 let tag=null,ids=null,cls=[];
 for(const p of parts){if(p[0]==="#")ids=p.slice(1);else if(p[0]===".")cls.push(p.slice(1));else tag=p.toUpperCase()}
 if(el._text!==undefined)return false;
 if(tag&&el.tagName!==tag)return false;
 if(ids&&el.id!==ids)return false;
 const ec=el.className.split(/\s+/);for(const c of cls)if(!ec.includes(c))return false;
 if(not&&ec.includes(not))return false;
 return true}
function qa(root,s){const out=[];const walk=(el,chain)=>{for(const c of el.children){if(c._text!==undefined)continue;
 const parts=chain.split(/\s+/).filter(Boolean);if(matches(c,parts[parts.length-1])){
  if(parts.length===1)out.push(c);
  else{let anc=c.parentNode,ok=true;for(let i=parts.length-2;i>=0&&anc;i--){if(matches(anc,parts[i]))anc=anc.parentNode;else{ok=false;break}}if(ok)out.push(c)}}
 walk(c,chain)}};walk(root,s.trim());return out.filter((x,i,a)=>a.indexOf(x)===i)}

doc.body=mkEl("body");doc.documentElement=mkEl("html");doc.body.parentNode=doc.documentElement;
doc.createElement=t=>mkEl(t);doc.getElementById=i=>byId[i]||null;doc.querySelectorAll=s=>qa(doc.body,s);
doc.addEventListener=()=>{};doc.removeEventListener=()=>{};
["app","apps","av","bk","ch","chat","clk","fl","go","in","infoB","mn","nb","nm","ntB","ob","ob2","ot","ov","ox","rcp","sb","sbi","set","st","trB","ttsB","ty","v1","v2","v3","vol","vw","vw2","a6","adm","bgi","edToast"].forEach(i=>{const e=mkEl("div");e.id=i;doc.body.append(e)});

const store={};store["etl_spd"]="8";
const ctx={console,setTimeout:(f,ms)=>setTimeout(f,Math.max(1,(ms||0)/DIV)),setInterval:(f,ms)=>setInterval(f,Math.max(1,(ms||0)/DIV)),clearTimeout,clearInterval,
 requestAnimationFrame:f=>setTimeout(f,2),performance:{now:()=>Date.now()},
 localStorage:{getItem:k=>store[k]===undefined?null:store[k],setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>Object.keys(store)[i]||null,get length(){return Object.keys(store).length}},
 matchMedia:()=>({matches:false,addEventListener(){},addListener(){}}),
 Image:function(){this.src="";this.decode=()=>Promise.resolve()},
 Audio:function(){this.play=()=>({catch:()=>{}});this.pause=()=>{};this.currentTime=0},
 fetch:()=>Promise.reject(new Error("no net")),navigator:{},location:{},
 addEventListener:()=>{},removeEventListener:()=>{},
 document:doc,innerWidth:390,innerHeight:800,
 Math,Date,JSON,Promise,Set,Map,Array,Object,String,Number,RegExp,Boolean,Function,Symbol,Error,TypeError,parseInt,parseFloat,isFinite,isNaN,encodeURIComponent,decodeURIComponent,structuredClone:x=>JSON.parse(JSON.stringify(x))};
ctx.window=ctx;ctx.globalThis=ctx;ctx.self=ctx;

const src=['js/assets.js','js/story.js','js/engine.js'].map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join("\n")
 +";globalThis.__T={start,play,S,STORIES,infoOv,notesOv,node:()=>nodeNow,menu};";
vm.createContext(ctx);
try{vm.runInContext(src,ctx,{filename:"engine.js"})}catch(e){console.error("SMOKE FAIL (chargement):",e.message);process.exit(1)}
const T=ctx.__T;
if(process.env.DBG){const _p=ctx.play;ctx.play=async(id,r)=>{console.log("PLAY>",id);try{return await _p(id,r)}catch(e){console.log("PLAY!ERR",id,e.message);throw e}finally{console.log("PLAY<",id)}};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const first=s=>qa(doc.body,s)[0]||null;

/* ---- smoke_ch2.js : couvre les 3 actes du chapitre 2 (q1/q4/q9 -> fin GHOST) ---- */
const S0=T.STORIES[0];
const SCEN=[
 {name:'Acte I (q1) standard', fn:()=>ctx.etlMisc.ch2go(S0,{t:0,l:0,r:0,v:0,e:""},{mig:1}), q:'q1'},
 {name:'Acte II (q4) bonne nuit', fn:()=>ctx.etlMisc.ch2go(S0,{t:0,l:0,r:0,v:0,e:""},{avou:1,trst:2,mig:1}), q:'q4'},
 {name:'Acte III (q9) confiance totale', fn:()=>{const h=S0.ch[1];ctx.etlMisc.ch2go(S0,{t:0,l:0,r:0,v:0,e:""},{avou:1,trst:2,pov:1,prm:1,cal_h8:1,recall:1,mig:1})}, q:'q9'},
];
async function drive(maxMs){
 const t0=Date.now();const seen=new Set();let trk=false;
 const BLOCKERS=['.instGo','.trkBack','.proSkip','.bioGo','.lkNext','.awGo','#lockOv .lkGo','#lkWake .lkGo','#lkWake','.notif','.rdOk',
  '#scrOv .scRow.go:not(.read)','#scrOv .scBtn','#incOv .incAcc','#lkCall .incAcc','#lkCall .incDec','#calOv .calCh button','#calOv .calEnd:not([hidden])'];
 for(;;){
  if(Date.now()-t0>maxMs)throw new Error("timeout replay ch2");
  const node=T.node();if(node)seen.add(node);
  let hit=null;
  for(const sel of BLOCKERS){
   const el=first(sel);
   if(el){hit=el;if(sel==='.trkBack')trk=true;el.click();await sleep(50);break}
  }
  if(hit)continue;
  const ch=byId.ch;const btns=ch?ch.children.filter(x=>x.tagName==="BUTTON"&&!/finB|rdOk/.test(x.className||"")):[];
  if(btns.length){btns[0].click();await sleep(60);continue}
  if(first("#endOv"))break;
  const ov=byId.ov;if(ov&&!ov.hidden&&first("#ob"))break; /* fin GHOST via ov() */
  await sleep(40)}
 return {seen,trk}}
(async()=>{try{
 let allQ=new Set();
 for(const sc of SCEN){
  const before=store["etl_resume_v4"];
  sc.fn();await sleep(150);
  const r=await drive(200000);
  for(const n of r.seen)allQ.add(n);
  const qs=[...r.seen].filter(n=>/^q\d/.test(n));
  if(qs.length<3)throw new Error(sc.name+": trop peu de nœuds q atteints ("+qs.join(",")+")");
  const ov=byId.ov;const endOv=first("#endOv");
  if(!endOv&&!(ov&&!ov.hidden))throw new Error(sc.name+": aucun écran de fin atteint");
  if(!store["etl_resume_v4"])throw new Error(sc.name+": aucune sauvegarde écrite après lancement ch2 (mode relecture supprimé, la sauvegarde est normale)");
  console.log("CH2 OK — "+sc.name+" : "+qs.length+" nœuds q, fin atteinte"+(r.trk?", Track App vu":""));
  /* retour au menu pour le scénario suivant */
  try{const eo=first("#endOv");if(eo)eo.remove()}catch(e){}
  try{T.menu()}catch(e){}
  await sleep(120);
  if(!first(".bkWrap .bk")){T.menu();await sleep(150)}
 }
 if(![...allQ].some(n=>/^q1/.test(n))||![...allQ].some(n=>/^q9/.test(n)))throw new Error("q1* ou q9* non atteints: "+[...allQ].join(","));
 console.log("SMOKE CH2 OK — Actes I/II/III du chapitre 2 couverts, fins GHOST atteintes, sauvegarde intacte");
 process.exit(0)
}catch(e){console.error("SMOKE CH2 FAIL:",e&&(e.stack||e.message));process.exit(1)}})();
