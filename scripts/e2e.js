#!/usr/bin/env node
/* E2E Playwright : vrai navigateur, clique les boutons critiques (menu + landing).
   Lancé par la CI (job e2e). Attrape les bugs invisibles au mock DOM : z-index,
   visibility, stacking contexts, erreurs d'exécution réelles. */
'use strict';
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const page = await (await b.newContext()).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  const root = 'file://' + path.resolve(__dirname, '..');
  // --- jeu.html : cartes du menu ---
  await page.goto(root + '/jeu.html');
  await page.waitForSelector('.bkWrap .bk', { timeout: 20000 });
  await page.locator('.bkWrap .bk', { hasText: 'Guide' }).first().click();
  await page.waitForSelector('#infoOv', { state: 'visible', timeout: 8000 });
  if (!(await page.evaluate(() => getComputedStyle(document.getElementById('infoOv')).visibility !== 'hidden'))) throw new Error('infoOv invisible');
  console.log('e2e jeu: Guide visible OK');
  await page.reload();
  await page.waitForSelector('.bkWrap .bk', { timeout: 20000 });
  await page.locator('.bkWrap .bk', { hasText: 'Param' }).first().click();
  await page.waitForSelector('#vol:not([hidden])', { state: 'visible', timeout: 8000 });
  console.log('e2e jeu: Paramètres visible OK');
  // --- index.html : boutons landing ---
  await page.goto(root + '/index.html');
  await page.waitForSelector('#lSet', { timeout: 20000 });
  await page.click('#lSet');
  await page.waitForSelector('.lOv', { state: 'visible', timeout: 8000 });
  console.log('e2e landing: Paramètres OK');
  await page.click('.lClose');
  await page.click('#lGuide');
  await page.waitForSelector('.lOv', { state: 'visible', timeout: 8000 });
  console.log('e2e landing: Guide OK');
  if (errs.length) { console.error('ERREURS PAGE:\n' + errs.join('\n')); process.exit(1); }
  await b.close();
  console.log('E2E OK');
  process.exit(0);
})().catch(e => { console.error('E2E FAIL:', e.message); process.exit(1); });
