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

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  const errs = [];
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

  const pro = await page.$('.proSkip');
  if (pro) { await pro.click(); console.log('e2e: prologue passé'); }

  const gate = await page.$('#nameGate');
  if (gate) {
    await page.fill('#ngName', 'Sam');
    const m = await page.$('#ngM');
    if (m) await m.click();
    await page.click('.ngGo');
    await page.waitForSelector('#nameGate', { state: 'detached', timeout: 8000 });
    console.log('e2e: prénom saisi (Sam)');
  }

  await page.waitForFunction(() => {
    const c = document.getElementById('chat');
    return c && c.children.length >= 2;
  }, undefined, { timeout: 60000 });
  console.log('e2e 5/6: messages affichés dans le chat');

  await page.waitForSelector('#ch button:not(.finB)', { timeout: 45000 });
  const nBefore = await page.evaluate(() => document.getElementById('chat').children.length);
  await page.locator('#ch button:not(.finB)').first().click();
  await page.waitForFunction(n => document.getElementById('chat').children.length > n, nBefore, { timeout: 45000 });
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
})().catch(e => { console.error('E2E FAIL:', e.message); if (errs.length) console.error('ERREURS PAGE:\n' + errs.join('\n')); process.exit(1); });
