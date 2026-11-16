---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior in this repo, before proposing fixes. Adapté de obra/superpowers (4 phases).
---

# Systematic Debugging — adapté à « Entre les lignes »

**Loi d'airail : AUCUN fix sans enquête de cause racine.** Un fix de symptôme est un échec.

## Phase 1 — Cause racine
1. Lire le message d'erreur **en entier** (stack, ligne, fichier).
2. Reproduire à coup sûr. Pas reproductible → récolter des données, ne pas deviner.
3. `git log` / `git diff` récents : qu'est-ce qui a changé ?
4. Systèmes multi-couches (ici : SW cache → HTML → engine.js → story.js → localStorage) : instrumenter chaque frontière. **Exemple réel de ce repo** : « F5 montre l'ancienne UI, Ctrl+Shift+R la nouvelle » → cause racine = `?v=` non bumpé + cache SW cache-first → fix = `scripts/bump-version.js`, pas un hard-reload.
5. Tracer le flux de données à l'envers jusqu'à la source du bug.

## Phase 2 — Pattern
Comparer avec du code qui marche dans le même repo (ex: un autre menu, un autre écran). Lister **toutes** les différences, même petites.

## Phase 3 — Hypothèse
Une seule hypothèse écrite : « X est la cause parce que Y ». Test minimal, une variable à la fois. Ça ne marche pas → nouvelle hypothèse, pas un 2e fix par-dessus.

## Phase 4 — Implémentation
1. Test de régression qui échoue d'abord (voir `test-driven-development`).
2. Un seul fix, à la source.
3. Vérifier : test passe, suite complète verte (`verification-before-completion`).
4. **3+ fixes qui échouent → STOP**, remettre en question l'architecture et en parler à Dylan avant toute nouvelle tentative.

## Red flags — STOP
« quick fix », « essaie juste X », « probablement X », « j'ai pas tout compris mais ça devrait marcher », « encore une tentative » après 2 échecs… → retour Phase 1.
