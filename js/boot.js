/* boot autonome — exécuté dès le parse du body */
window.__bootRan=1;
(function(){var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function done(){window.__bootDone=1;var b=document.getElementById('boot');if(b){b.classList.add('off');setTimeout(function(){b.remove()},650)}}
(function(){var b=document.getElementById('boot');if(!b)return;
 window.__bootSched=1;setTimeout(function(){window.__bootT=1;done()},rm?60:2750); /* la disparition du boot est INCONDITIONNELLE */
 if(rm)return;
 try{var cv=b.querySelector('.bootRain');if(cv){var cx=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
  var gl='アイウエオ01<>/\|#@%&'.split('');var cols=Math.ceil(cv.width/18);var y=[];for(var i=0;i<cols;i++)y.push(Math.floor(Math.random()*20));
  var iv=setInterval(function(){cx.fillStyle='rgba(4,6,10,.16)';cx.fillRect(0,0,cv.width,cv.height);cx.font='14px monospace';
   for(var i=0;i<cols;i++){var ch=gl[Math.floor(Math.random()*gl.length)];cx.globalAlpha=.55;cx.fillStyle=Math.random()<.05?'#ffd166':'#3e91ff';cx.fillText(ch,i*18,y[i]*18);if(y[i]*18>cv.height&&Math.random()>.975)y[i]=0;y[i]++}},50);
  setTimeout(function(){clearInterval(iv)},2100)}}
 catch(e){}})})();