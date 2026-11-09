#!/usr/bin/env node
/* bump-version.js — incrémente la version du jeu en UNE commande, pour ne plus
   jamais oublier le cache-buster (bug F5 vs Ctrl+Shift+R) :
     node scripts/bump-version.js 2.244 "message du changelog"
   Fait :
   - VER="x.y" dans ts/engine/16-sauvegarde.ts (puis régénère js/engine.js si demandé)
   - ?v=x.y dans toutes les pages HTML
   - CACHE = "etl-vX.Y" dans sw.js (purge de l'ancien cache à l'activation)
   - entrée dans CHANGELOG.md
   Conseil : lancer AVANT chaque push de code, puis `node scripts/build-engine-from-ts.js --write`. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ver = process.argv[2] || '';
const msg = process.argv[3] || ('v' + ver);
if (!/^\d+\.\d+$/.test(ver)) { console.error('usage: node scripts/bump-version.js <x.y> [message]'); process.exit(1); }

let n = 0;
// VER dans la source TS
const pTs = path.join(ROOT, 'ts/engine/16-sauvegarde.ts');
let s = fs.readFileSync(pTs, 'utf8');
const m = s.match(/const VER="([\d.]+)";/);
if (!m) { console.error('VER introuvable'); process.exit(1); }
s = s.replace(/const VER="[\d.]+";/, 'const VER="' + ver + '";');
fs.writeFileSync(pTs, s); n++;
console.log('VER -> ' + ver + ' (ts/engine/16-sauvegarde.ts)');

// ?v= dans les HTML
for (const f of ['index.html', 'jeu.html', 'notice.html', 'previz.html']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  let h = fs.readFileSync(p, 'utf8');
  const c = (h.match(/\?v=[\d.]+/g) || []).length;
  h = h.replace(/\?v=[\d.]+/g, '?v=' + ver);
  if (c) { fs.writeFileSync(p, h); n += c; console.log(f + ': ' + c + ' ref(s) ?v= -> ' + ver); }
}

// cache SW lié à la version
const pSw = path.join(ROOT, 'sw.js');
s = fs.readFileSync(pSw, 'utf8');
s = s.replace(/const CACHE = "etl-v[^"]*";/, 'const CACHE = "etl-v' + ver + '";');
fs.writeFileSync(pSw, s); n++;
console.log('sw.js: CACHE -> etl-v' + ver);

// CHANGELOG
const pCl = path.join(ROOT, 'CHANGELOG.md');
let cl = fs.existsSync(pCl) ? fs.readFileSync(pCl, 'utf8') : '# CHANGELOG\n';
const entry = '\n## v' + ver + ' — ' + new Date().toISOString().slice(0, 10) + '\n- ' + msg.replace(/\n/g, '\n- ') + '\n';
if (!cl.includes('## v' + ver)) cl = cl.replace(/^# CHANGELOG\n/, '# CHANGELOG\n' + entry);
fs.writeFileSync(pCl, cl); n++;
console.log('CHANGELOG.md: entrée v' + ver);
console.log('OK — ' + n + ' fichier(s)/ref(s) mis à jour. Pense à: node scripts/build-engine-from-ts.js --write');
