/* boot « le site se construit » — exécuté dès le début du <body> (v2.240) */
window.__bootRan = 1;
(function () {
  var b = document.getElementById('boot');
  if (!b) return;
  var rm = false;
  try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
  function done() {
    var x = document.getElementById('boot');
    if (x) { x.classList.add('off'); setTimeout(function () { try { x.remove() } catch (e) {} }, 650) }
  }
  /* disparition INCONDITIONNELLE, quoi qu'il arrive */
  window.__bootSched = 1;
  setTimeout(function () { window.__bootT = 1; done() }, rm ? 60 : 2750);
  if (rm) return;
  try {
    var cv = b.querySelector('.bootRain');
    if (!cv) return;
    var cx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    var gl = 'アイウエオカキクケコサシスセソ01<>/\\|#@%&'.split('');
    var cols = Math.ceil(cv.width / 18);
    var y = []; for (var i = 0; i < cols; i++) y.push(Math.floor(Math.random() * 20));
    var iv = setInterval(function () {
      cx.fillStyle = 'rgba(4,6,10,.16)'; cx.fillRect(0, 0, cv.width, cv.height);
      cx.font = '14px monospace';
      for (var i = 0; i < cols; i++) {
        var ch = gl[Math.floor(Math.random() * gl.length)];
        cx.globalAlpha = .55;
        cx.fillStyle = Math.random() < .05 ? '#ffd166' : '#3e91ff';
        cx.fillText(ch, i * 18, y[i] * 18);
        if (y[i] * 18 > cv.height && Math.random() > .975) y[i] = 0;
        y[i]++;
      }
    }, 50);
    setTimeout(function () { clearInterval(iv) }, 2100);
  } catch (e) {}
})();
