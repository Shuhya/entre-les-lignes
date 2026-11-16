---
name: test-driven-development
description: Use when implementing any feature or bugfix in this repo, before writing implementation code. Adapté à Entre les lignes (tests Node sans framework + Playwright).
---

# TDD — adapté à « Entre les lignes »

**Loi d'airain : aucun code de prod sans un test qui échoue d'abord.**
Si tu n'as pas vu le test échouer, tu ne sais pas s'il teste la bonne chose.

## Cycle RED → GREEN → REFACTOR

1. **RED** : écrire UN test minimal dans `scripts/` (ex: `test-menu.js`, `smoke_ch2.js`) qui exprime le comportement voulu. Le lancer, constater l'échec attendu.
2. **GREEN** : écrire le code minimal dans `ts/engine/*.ts` (source unique) pour passer le test. Un seul changement à la fois.
3. **REFACTOR** : nettoyer en gardant les tests verts.

## Commandes concrètes de ce repo

```bash
node scripts/test-menu.js        # UI menu (mock DOM)
node scripts/test-save.js        # sauvegarde/reprise
node scripts/smoke_ch2.js        # parcours chapitre 2
ROUTE=a node scripts/smoke.js    # parcours chapitre 1 (routes a/b)
node scripts/validate.js         # structure + miroirs + ?v= + génération TS→js
node scripts/typecheck-engine.js # gate baseline (ne pas dépasser BASELINE)
node scripts/e2e.js              # vrai navigateur (CI ; chromium requis)
```

Règle : après chaque GREEN, lancer **toute** la suite locale (validate + test-menu + test-save + smoke_ch2 + smoke a/b), pas seulement le test écrits.

## Bon vs mauvais test

- ✅ Un comportement, un nom clair, du vrai code (le mock DOM du repo est OK — c'est notre harness).
- ❌ Nom vague (« test1 »), test du mock au lieu du code, test qui passe tout de suite (il teste du comportement existant).

## Pièges classiques

- « J'ajoute le test après » → non. Le test après passe immédiatement = il ne prouve rien.
- « C'est juste du CSS » → non plus : `validate.js` + captures (scripts/shots.js) couvrent la DA.
- Refactor sans test d'abord → non.
