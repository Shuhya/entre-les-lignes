#!/usr/bin/env node
/* E2E-CHAOS Playwright (CI, job e2e-chaos) — vrai navigateur Chromium headless.
   Companion réel du fuzzer mock (scripts/test_fuzz.js côté Node) : joue le
   chapitre 1 ENTIER dans un vrai Chrome, en injectant régulièrement des clics
   de « joueur chaotique » (‹ bibliothèque, ⚙, 📖 notes, 📑 transfert, thème,
   voix, mnBack, fonds d'overlays…) PUIS en vérifiant que la partie repart
   toujours (reprise menu / accueil / overlays) jusqu'à l'écran de fin.
   Attrape ce que le mock DOM ne peut pas simuler : pointer-events, z-index,
   animations CSS, timings réels, téléchargements.
   Env : SEED (PRNG, défaut 7), SPDV (vitesse lecture localStorage, défaut 3).
   Échec si : erreur page, soft-lock (aucun progrès >150 s), budget 10 min
   dépassé sans écran de fin. */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

const SEED = +(process.env.SEED || 7);
const SPDV = +(process.env.SPDV || 3);
const BUDGET_MS = 10 * 60 * 1000; /* 10 min max */
const STUCK_MS = 150 * 1000;      /* aucun progrès pendant 150 s => soft-lock */

/* PRNG seedé (mulberry32) : run reproductible pour un même SEED */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rng = mulberry32(SEED);

const errs = [];
let page = null;
const log = m => console.log('e2e-chaos: ' + m);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ acceptDownloads: true });
  page = await ctx.newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message + '\n    stack: ' + String(e.stack || '').split('\n').slice(0, 4).join(' | ')));
  page.setDefaultTimeout(15000);
  const root = 'file://' + path.resolve(__dirname, '..');

  /* accélération de lecture (sl()/SPD) pour tenir dans le budget CI */
  await page.addInitScript(v => { try { localStorage.setItem('etl_spd', String(v)); } catch (e) {} }, SPDV);
  await page.goto(root + '/jeu.html');
  await page.waitForSelector('.bkWrap .bk.open');
  await page.locator('.bkWrap .bk.open').first().click();
  log('histoire lancée');

  const ch1 = page.locator('button', { hasText: /^1\. / }).first();
  await ch1.waitFor({ state: 'visible', timeout: 12000 });
  await ch1.click();
  log('chapitre 1 choisi');

  const gate = await page.$('#nameGate');
  if (gate) {
    await page.fill('#ngName', 'Sam');
    const m = await page.$('#ngM');
    if (m) await m.click();
    await page.click('.ngGo');
    await page.waitForSelector('#nameGate', { state: 'detached', timeout: 8000 });
    log('prénom saisi (Sam)');
    try { await page.waitForSelector('#bioOv', { timeout: 6000 }); await page.click('.bioGo'); log('fiche perso validée'); } catch (e2) {}
  }
  try { await page.waitForSelector('.proSkip', { state: 'visible', timeout: 8000 }); await page.click('.proSkip'); log('prologue passé'); } catch (e) {}
  try { await page.waitForSelector('.lkGo', { state: 'visible', timeout: 15000 }); await page.click('.lkGo'); log('téléphone déverrouillé'); } catch (e) {}
  try { await page.waitForSelector('.lkNext', { state: 'visible', timeout: 12000 }); await page.click('.lkNext'); log('hack passé (Suivant)'); } catch (e) {}

  /* ---- état ---- */
  const chatLen = () => page.evaluate(() => { const c = document.getElementById('chat'); return c ? c.children.length : 0; });
  const vis = async sel => { const el = await page.$(sel); return !!(el && await el.isVisible()); };
  const clickIf = async sel => { if (await vis(sel)) { try { await page.click(sel, { timeout: 3000 }); return true; } catch (e) { /* anim/détaché : retry au tour suivant */ } } return false; };

  /* ---- chaos : clics « joueur imprévisible » pendant la partie ---- */
  const CHAOS = ['#bk', '#set', '#infoB', '#ntB', '#trB', '#ttsB', '#thB', '.mnBack', '.trBtn'];
  let chaosClicks = 0;
  const chaosTick = async () => {
    const k = 1 + Math.floor(rng() * 3);
    for (let j = 0; j < k; j++) {
      const sel = CHAOS[Math.floor(rng() * CHAOS.length)];
      if (await clickIf(sel)) chaosClicks++;
      /* clic « ailleurs » : fond du téléphone / body */
      if (rng() < 0.5) { try { await page.mouse.click(30, 500); chaosClicks++; } catch (e) {} }
      await page.waitForTimeout(200 + rng() * 400);
    }
  };

  /* ---- settle : fermer ce que le chaos a ouvert, puis jouer ---- */
  const menuOn = () => page.evaluate(() => { const m = document.getElementById('mn'); return !!(m && m.classList.contains('on')); }).catch(() => false);
  const settle = async () => {
    if (await clickIf('#notesOv #ntB2') || await clickIf('#notesOv .ahBack')) { await page.waitForTimeout(300); return true; }
    /* écran-app annexe (threads / accueil apps) : ‹ bibliothèque revient à la conversation */
    if (await vis('#appHome') || await vis('#thrOv')) { await clickIf('#bk'); await page.waitForTimeout(300); return true; }
    /* rsOv AVANT le menu : « Reprendre la conversation » (transfert/reprise) */
    if (await vis('.rsOv')) {
      const rp = page.locator('.rsOv button', { hasText: /Reprendre/ }).first();
      if (await rp.count()) { try { await rp.click({ timeout: 3000 }); } catch (e) { const rb = page.locator('.rsOv button', { hasText: /Retour/ }).first(); if (await rb.count()) await rb.click({ timeout: 3000 }).catch(() => {}); } }
      await page.waitForTimeout(400); return true;
    }
    if (await clickIf('#infoOv .ifBack')) { await page.waitForTimeout(300); return true; }
    { const v = await page.$('#vol'); if (v && !(await v.isHidden())) { await clickIf('#set'); await page.waitForTimeout(200); return true; } }
    /* écrans plein écran Fichiers / archive / viewers (.fxOv) :
       tantôt ouvrir un fichier, tantôt écouter le wav, tantôt refermer (‹ bas de l'écran) */
    if (await vis('.fxOv')) {
      const wav = page.locator('.fxOv .wavBtn').first();
      if (await wav.count() && await wav.isVisible() && !(await wav.isDisabled())) {
        try { await wav.click({ timeout: 3000 }); await page.waitForTimeout(500); return true; } catch (e) {}
      }
      if (rng() < 0.5 && (await clickIf('.fxOv .fxRow'))) { await page.waitForTimeout(500); return true; }
      if (await clickIf('.fxOv .fxFoot')) { await page.waitForTimeout(500); return true; }
      if (await clickIf('.fxOv .fxX')) { await page.waitForTimeout(400); return true; }
    }
    /* accueil (mnBack) : relancer puis reprendre */
    if (await vis('#in') && !(await page.evaluate(() => document.body.classList.contains('play')))) {
      await clickIf('#in #go') || await clickIf('#in button');
      await page.waitForTimeout(400);
    }
    /* menu bibliothèque ouvert : carte histoire (reprise via chap → rsOv),
       sinon carte chapitres (row « 1. ») — sinon on resterait bloqué dessus */
    if (await menuOn()) {
      if (await clickIf('#mn .bk.open')) { await page.waitForTimeout(400); return true; }
      const r1 = page.locator('#mn button', { hasText: /^1\. / }).first();
      if (await r1.count()) { try { await r1.click({ timeout: 3000 }); await page.waitForTimeout(400); return true; } catch (e) {} }
    }
    /* overlays bloquants du récit (proSkip = cartes de fin de chapitre) */
    const BLOCKERS = ['.proSkip', '.lkNext', '.awGo', '#lkWake', '.notif', '.rdOk',
      '#scrOv .scRow.go:not(.read)', '#scrOv .scBtn', '#incOv .incAcc',
      '#calOv .calCh button', '#calOv .calEnd:not([hidden])'];
    for (const sel of BLOCKERS) {
      if (rng() < 0.34 && sel === '.notif') continue; /* parfois laisser sonner un peu */
      if (await clickIf(sel)) { await page.waitForTimeout(500); return true; }
    }
    /* choix de réponse */
    const btn = await page.$('#ch button:not(.finB):not(.rdOk)');
    if (btn && await btn.isVisible()) { try { await btn.click({ timeout: 3000 }); log('choix cliqué'); return true; } catch (e) {} }
    return false;
  };

  /* ---- boucle principale ---- */
  const t0 = Date.now();
  let lastProgress = Date.now();
  let lastChat = await chatLen();
  let it = 0, ended = false, navRecoveries = 0;
  while (Date.now() - t0 < BUDGET_MS) {
    it++;
    /* sentinelle navigation : un export blob / import de sauvegarde peut faire
       quitter jeu.html — le « joueur » rouvre le jeu puis Reprend sa partie */
    if (!/jeu\.html/.test(page.url())) {
      log('navigation inattendue vers ' + page.url() + ' — retour au jeu');
      navRecoveries++;
      await page.goto(root + '/jeu.html');
      await page.waitForTimeout(800);
      lastProgress = Date.now();
    }
    if (it % 6 === 3) await chaosTick();
    await settle();
    if (await vis('.finB') || await vis('#endOv')) { ended = true; break; } /* écran de fin atteint */
    const n = await chatLen();
    if (n > lastChat) { lastChat = n; lastProgress = Date.now(); }
    if (Date.now() - lastProgress > STUCK_MS) {
      throw new Error('SOFT-LOCK : aucun progrès depuis ' + Math.round((Date.now() - lastProgress) / 1000) + 's (chat=' + n + ', it=' + it + ')');
    }
    await page.waitForTimeout(900);
  }
  if (!ended) throw new Error('BUDGET dépassé sans écran de fin (chat=' + (await chatLen()) + ', it=' + it + ')');
  log('ÉCRAN DE FIN ATTEINT — chapitre 1 terminé malgré le chaos');
  /* si on s'est arrêté sur .finB (pas encore #endOv), le cliquer pour atteindre l'écran de fin */
  if (!(await vis('#endOv'))) { await clickIf('.finB'); try { await page.waitForSelector('#endOv', { timeout: 8000 }); } catch (e) {} }
  const finTxt = await page.evaluate(() => { const o = document.getElementById('endOv'); return o ? o.textContent : ''; });
  if (!finTxt) errs.push('écran de fin absent (ni #endOv ni .finB cliquable)');
  else if (!/fin de chapitre|Chapitre 1/i.test(finTxt)) errs.push('écran de fin anormal : ' + finTxt.slice(0, 120));
  /* traque des erreurs page : où vit le symbole fautif ? */
  if (errs.some(x => x.startsWith('pageerror'))) {
    const hunt = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('script').forEach((s, i) => { if ((s.textContent || '').includes('addRow')) out.push('script#' + i + (s.src ? '@' + s.src : ' inline')); });
      document.querySelectorAll('*').forEach(el => { for (const a of el.attributes || []) if (String(a.value).includes('addRow')) out.push('attr ' + el.tagName + ' ' + a.name); });
      return out.join(' ; ') || 'addRow introuvable (ni scripts ni attributs)';
    }).catch(() => 'hunt KO');
    errs.push('CHASSE addRow: ' + hunt);
  }

  /* reprise post-fin : le menu doit rester utilisable (pas d'overlay orphelin) */
  await page.evaluate(() => { const o = document.getElementById('endOv'); if (o) o.remove(); });
  if (await clickIf('#ob2')) { await page.waitForSelector('#mn.on', { timeout: 8000 }); log('menu des histoires atteignable après la fin'); }

  if (errs.length) { console.error('ERREURS PAGE:\n' + errs.join('\n')); process.exit(1); }
  await b.close();
  console.log('E2E-CHAOS OK (SEED=' + SEED + ') — ' + it + ' itérations, ' + chaosClicks + ' clics de chaos, fin du chapitre 1 atteinte, ' + navRecoveries + ' navigations récupérées, 0 erreur page');
  process.exit(0);
})().catch(e => {
  console.error('E2E-CHAOS FAIL (SEED=' + SEED + '):', e.message);
  if (errs.length) console.error('ERREURS PAGE:\n' + errs.join('\n'));
  if (page) page.evaluate(() => JSON.stringify({
    chat: document.getElementById('chat') ? document.getElementById('chat').children.length : -1,
    body: document.body.className,
    /* eslint-disable-next-line no-undef */
    node: typeof nodeNow !== 'undefined' ? nodeNow : '?',
    ovs: Array.from(document.querySelectorAll('div[id]')).map(d => d.id + (d.hidden ? ':h' : '')).join(',')
  })).then(d => console.error('DIAG ' + d + ' url=' + page.url())).catch(() => {});
  setTimeout(() => process.exit(1), 500);
});
