#!/usr/bin/env node
/* Captures d'écran de démonstration (aucun spoil : uniquement des écrans d'interface).
   Usage CI : node scripts/shots.js  → shots/*.png (artifact "screenshots"). */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  fs.mkdirSync(path.join(__dirname, '..', 'shots'), { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERROR: ' + e.message));
  page.setDefaultTimeout(15000);
  const root = 'file://' + path.resolve(__dirname, '..');
  const shot = async (name) => {
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'shots/' + name + '.png' });
    const t = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
    console.log('SHOT ' + name + ' :: ' + t.slice(0, 160));
  };

  /* 1 — accueil : bibliothèque */
  await page.goto(root + '/jeu.html');
  await page.waitForSelector('.bkWrap .bk');
  await page.waitForTimeout(900);
  await shot('01-accueil');

  /* 2 — carte des chapitres */
  await page.locator('.bkWrap .bk.open').first().click();
  await page.locator('button', { hasText: /Chapitre 1/ }).first().waitFor({ state: 'visible' });
  await shot('02-chapitres');

  /* 3 — menu des actes (déroulé sous le chapitre) */
  await page.locator('button', { hasText: /Chapitre 1/ }).first().click();
  await page.waitForSelector('.actsWrap .actBtn');
  await shot('03-actes');

  /* 4 — réglages */
  await page.reload();
  await page.waitForSelector('.bkWrap .bk');
  await page.locator('.bkWrap .bk', { hasText: 'Param' }).first().click();
  await page.waitForSelector('#vol', { state: 'visible' });
  await shot('04-reglages');

  /* 5 — écran prénom (début de partie, aucune ligne d'histoire) — tolérant, non bloquant */
  await page.evaluate(() => { const v = document.getElementById('vol'); if (v) v.hidden = true; });
  await page.locator('.bkWrap .bk.open').first().click();
  await page.locator('button', { hasText: /Chapitre 1/ }).first().waitFor({ state: 'visible' });
  await page.locator('button', { hasText: /Chapitre 1/ }).first().click();
  await page.waitForSelector('.actsWrap .actBtn', { state: 'visible' });
  let got5 = false;
  for (let t = 0; t < 30 && !got5; t++) {
    await page.locator('.actsWrap .actBtn').first().click({ timeout: 3000 }).catch(() => {});
    for (let k = 0; k < 10; k++) {
      const ps = await page.$('.proSkip');
      if (ps && await ps.isVisible()) { await ps.click().catch(() => {}); }
      const gate = await page.$('#nameGate');
      if (gate && await gate.isVisible()) { got5 = true; break; }
      await page.waitForTimeout(800);
    }
  }
  if (got5) { await shot('05-prenom'); } else { console.log('SKIP 05-prenom (non obtenu)'); }

  await b.close();
  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
