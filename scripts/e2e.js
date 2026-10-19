#!/usr/bin/env node
/* E2E Playwright (CI, job e2e) — vrai navigateur Chromium headless.
   1) jeu.html : overlays du menu (Guide/Paramètres) — régression v2.95
   2) jeu.html : DÉBUT DE PARTIE COMPLET — carte d'histoire → chapitre → prologue
      (Passer) → nameGate (prénom) → premier choix cliqué → bulle affichée.
      Attrape les bugs invisibles au mock DOM : z-index, visibility, erreurs runtime.
   3) index.html : boutons landing + démo téléphone qui tourne. */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

const errs = [];
let page = null;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  page = await ctx.newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.setDefaultTimeout(15000);
  const root = 'file://' + path.resolve(__dirname, '..');

  /* ---------- 1) jeu.html : overlays du menu ---------- */
  await page.goto(root + '/jeu.html');
  await page.waitForSelector('.bkWrap .bk');
  await page.locator('.bkWrap .bk', { hasText: 'Guide' }).first().click();
  await page.waitForSelector('#infoOv', { state: 'visible', timeout: 8000 });
  if (!(await page.evaluate(() => getComputedStyle(document.getElementById('infoOv')).visibility !== 'hidden')))
    throw new Error('infoOv invisible');
  console.log('e2e 1/6 menu: Guide visible OK');
  await page.evaluate(() => document.getElementById('infoOv').remove());
  await page.locator('.bkWrap .bk', { hasText: 'Param' }).first().click();
  await page.waitForSelector('#vol:not([hidden])', { state: 'visible', timeout: 8000 });
  console.log('e2e 2/6 menu: Paramètres visible OK');
  await page.evaluate(() => { const v = document.getElementById('vol'); if (v) v.hidden = true; });

  /* ---------- 2) début de partie complet ---------- */
  await page.reload();
  await page.waitForSelector('.bkWrap .bk.open');
  await page.locator('.bkWrap .bk.open').first().click();
  console.log('e2e 3/6: carte histoire cliquée');

  /* chap(s) affiche une carte de chapitres (rows '1. …'), PAS l'overlay #calOv (appel) */
  const ch1 = page.locator('button', { hasText: /^1\. / }).first();
  await ch1.waitFor({ state: 'visible', timeout: 12000 });
  await ch1.click();
  console.log('e2e 4/6: chapitre 1 choisi');

  /* start() : nameGate D'ABORD, puis introH (prologue en cartes + lock screen) */
  const gate = await page.$('#nameGate');
  if (gate) {
    await page.fill('#ngName', 'Sam');
    const m = await page.$('#ngM');
    if (m) await m.click();
    await page.click('.ngGo');
    await page.waitForSelector('#nameGate', { state: 'detached', timeout: 8000 });
    console.log('e2e: prénom saisi (Sam)');
  }

  /* prologue en cartes (S.h1.pro) : .proSkip visible dès la 1re carte */
  try {
    await page.waitForSelector('.proSkip', { state: 'visible', timeout: 8000 });
    await page.click('.proSkip');
    console.log('e2e: prologue passé');
  } catch (e) { /* pas de prologue en cartes */ }

  /* lock screen intro ch.1 : .lkGo apparaît après l'animation d'horloge */
  try {
    await page.waitForSelector('.lkGo', { state: 'visible', timeout: 15000 });
    await page.click('.lkGo');
    console.log('e2e: téléphone déverrouillé');
  } catch (e) { /* pas de lock screen */ }

  /* le récit s'auto-anime mais des overlays bloquants peuvent surgir à tout moment */
  const BLOCKERS = ['.lkNext', '.awGo', '#lkWake button', '.notif'];
  const settleOnce = async () => {
    for (const sel of BLOCKERS) {
      const el = await page.$(sel);
      if (!el) continue;
      try {
        if (await el.isVisible()) { await el.click(); await page.waitForTimeout(700); return true; }
      } catch (e) { /* élément détaché (animation) : réessayé au tour suivant */ }
    }
    return false;
  };
  const chatLen = () => page.evaluate(() => { const c = document.getElementById('chat'); return c ? c.children.length : 0; });

  /* glitch puis 'Suivant ›' : .lkNext apparaît ~1.2s après Déverrouiller */
  try {
    await page.waitForSelector('.lkNext', { state: 'visible', timeout: 12000 });
    await page.click('.lkNext');
    console.log('e2e: hack passé (Suivant)');
  } catch (e) { /* pas de glitch */ }

  let ok = false;
  for (let i = 0; i < 40; i++) {
    await settleOnce();
    if (await chatLen() >= 2) { ok = true; break; }
    await page.waitForTimeout(1500);
  }
  if (!ok) throw new Error('chat vide après 60s (len=' + await chatLen() + ')');
  console.log('e2e 5/6: messages affichés dans le chat');

  ok = false;
  for (let i = 0; i < 40; i++) {
    await settleOnce();
    const chBtn = await page.$('#ch button:not(.finB)');
    if (chBtn && await chBtn.isVisible()) {
      const nBefore = await chatLen();
      await chBtn.click();
      for (let j = 0; j < 30; j++) {
        await settleOnce();
        if (await chatLen() > nBefore) { ok = true; break; }
        await page.waitForTimeout(1500);
      }
      break;
    }
    await page.waitForTimeout(1500);
  }
  if (!ok) throw new Error('premier choix sans effet (len=' + await chatLen() + ')');
  console.log('e2e 6/6: premier choix cliqué → bulle envoyée');
  const bubbles = await page.evaluate(() => document.getElementById('chat').children.length);
  if (bubbles < 3) throw new Error('trop peu de bulles après le choix : ' + bubbles);

  /* ---------- 3) landing ---------- */
  await page.goto(root + '/index.html');
  await page.waitForSelector('#lSet');
  await page.click('#lSet');
  await page.waitForSelector('.lOv', { state: 'visible', timeout: 8000 });
  await page.click('.lClose');
  await page.click('#lGuide');
  await page.waitForSelector('.lOv', { state: 'visible', timeout: 8000 });
  console.log('e2e landing: Paramètres + Guide OK');
  await page.waitForFunction(() => document.getElementById('dpCt') && document.getElementById('dpCt').children.length >= 2, undefined, { timeout: 20000 });
  console.log('e2e landing: démo téléphone anime OK');

  if (errs.length) { console.error('ERREURS PAGE:\n' + errs.join('\n')); process.exit(1); }
  await b.close();
  console.log('E2E OK (menu + partie + landing)');
  process.exit(0);
})().catch(e => {
  console.error('E2E FAIL:', e.message);
  if (errs.length) console.error('ERREURS PAGE:\n' + errs.join('\n'));
  if (page) page.evaluate(() => JSON.stringify({
    chat: document.getElementById('chat') ? document.getElementById('chat').children.length : -1,
    body: document.body.className,
    ovs: Array.from(document.querySelectorAll('div[id]')).map(d => d.id + (d.hidden ? ':h' : '')).join(',')
  })).then(d => console.error('DIAG ' + d)).catch(() => {});
  setTimeout(() => process.exit(1), 500);
});
