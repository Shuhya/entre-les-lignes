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

const store={};
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
 +";globalThis.__T={start,play,S,STORIES,infoOv,notesOv,node:()=>nodeNow};";
vm.createContext(ctx);
try{vm.runInContext(src,ctx,{filename:"engine.js"})}catch(e){console.error("SMOKE FAIL (chargement):",e.message);process.exit(1)}
const T=ctx.__T;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const first=s=>qa(doc.body,s)[0]||null;

/* Choix par nœud — ROUTE=a piège/MMS/h8p/h11p ; ROUTE=b honnête/trst élevé/h8/h11w (+h9z bonne nuit) */
const CHO_A={h1:1,h2:0,h3a:0,h3l1:0,h3y:0,h4:2,h6:0,h7h:0,h9:0,h9a:0,h9b:0,h10:1,h9y:0};
const CHO_B={h1:1,h2:1,h3b:1,h3l2:0,h3y:0,h4:1,h6:0,h7h:0,h9:1,h9y:1,h9z:0,h10:1};
const CHO=ROUTE==="b"?CHO_B:CHO_A;
const EXPECT_END=ROUTE==="b"?"h11w":"h11p";
const seen={mms:false,nodes:new Set()};

async function drive(){
 const t0=Date.now();T.start();
 for(;;){
  if(Date.now()-t0>120000)throw new Error("timeout global du replay (boucle sans interaction)");
  const node=T.node();if(node)seen.nodes.add(node);
  if(node==="h5c"&&first('.pm img'))seen.mms=true;
  let el=first("#nameGate");if(el){const ni=first("input",el);if(ni)ni.value="Sam";const mb=qa(el,"#ngM")[0];if(mb)mb.click();const gb=qa(el,".ngGo")[0];if(gb)gb.click();await sleep(40);continue}
  el=first(".proSkip");if(el){el.click();await sleep(40);continue}
  el=first("#lockOv .lkGo");if(el&&!first(".lkNext")){el.click();await sleep(120);continue}
  el=first(".lkNext");if(el){el.click();await sleep(60);continue}
  el=first(".rxOv");if(el){el.click();await sleep(20);if(first(".rxOv"))el.click();await sleep(60);continue}
  el=first("#awayOv");if(el){(first(".awGo",el)||el).click();await sleep(40);continue}
  el=first("#lkWake");if(el){el.click();await sleep(80);continue}
  el=first(".notif");if(el){el.click();await sleep(60);continue}
  el=first("#incOv");if(el){const ab=first(".incAcc",el);if(ab)ab.click();await sleep(60);continue}
  el=first("#calOv");if(el){const chs=qa(el,".calCh button");if(chs.length){chs[0].click();await sleep(60);continue}
   const eb=first(".calEnd",el);if(eb&&!eb.hidden){eb.click();await sleep(60);continue}}
  const scr=first("#scrOv");
  if(scr){
   const rows=qa(scr,".scRow").filter(r=>/go/.test(r.className)&&!/✓ lu/.test(r.textContent));
   if(rows.length){rows[0].click();await sleep(80);continue}
   const scb=qa(scr,".scBtn");if(scb.length){const i2=node==="h1"?1:0;(scb[i2]||scb[0]).click();await sleep(80);continue}
  }
  const ch=byId.ch;const btns=ch?ch.children.filter(x=>x.tagName==="BUTTON"&&!/finB/.test(x.className||"")):[];
  if(btns.length){const idx=(node&&CHO[node]!==undefined)?CHO[node]:0;btns[idx].click();await sleep(80);continue}
  if(first("#endOv"))break;
  el=first(".finB");if(el){el.click();await sleep(100);continue}
  await sleep(70)}}

(async()=>{try{
 await drive();
 const endTxt=first("#endOv")?first("#endOv").textContent:"";
 if(!/Chapitre 1/i.test(endTxt))throw new Error("écran de fin absent : "+endTxt.slice(0,120));
 if(!seen.nodes.has(EXPECT_END))throw new Error("variante de fin attendue "+EXPECT_END+" non visitée ("+[...seen.nodes].join(" ")+")");
 if(ROUTE==="a"&&!seen.mms)throw new Error("MMS echantillon.jpg non affiché dans h5c");
 T.infoOv();
 const nb=qa(doc.body,".finStat").find(b=>b.textContent&&b.textContent.includes("Notes de l"));
 if(!nb)throw new Error("bouton Notes absent de infoOv");
 nb.click();await sleep(30);
 const no=first("#notesOv");if(!no||!/Qui est qui/.test(no.textContent))throw new Error("notesOv non affiché depuis infoOv");
 console.log("SMOKE "+ROUTE+" OK — "+seen.nodes.size+" nœuds, fin "+EXPECT_END+(ROUTE==="a"?", MMS OK":"")+", infoOv→Notes OK");
 process.exit(0)
}catch(e){console.error("SMOKE FAIL ("+ROUTE+"):",e.message);process.exit(1)}})();
