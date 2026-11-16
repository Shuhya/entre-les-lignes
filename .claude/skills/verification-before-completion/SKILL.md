---
name: verification-before-completion
description: Use before claiming any work is done, before any commit or push to main. Preuve fraîche exigée, jamais "ça devrait passer".
---

# Verification Before Completion — adapté à « Entre les lignes »

**Loi d'airain : aucune claim de succès sans preuve fraîche.** « Devrait passer » = mensonge.

## La fonction porte (avant TOUTE claim / commit / push)

1. **IDENTIFIER** la commande qui prouve la claim.
2. **LANCER** la commande complète, fraîche.
3. **LIRE** toute la sortie + code de sortie.
4. **VÉRIFIER** que la sortie confirme la claim.
5. Seulement ensuite : faire la claim, avec la preuve citée.

## Commandes de preuve de ce repo

```bash
node scripts/validate.js          # doit afficher 0 erreur (16 checks ✓)
node scripts/typecheck-engine.js  # ≤ BASELINE (95), 0 régression
node scripts/test-menu.js         # MENU OK
node scripts/test-save.js         # SAVE OK
node scripts/smoke_ch2.js         # SMOKE CH2 OK
ROUTE=a node scripts/smoke.js && ROUTE=b node scripts/smoke.js
node scripts/build-engine-from-ts.js --write   # si ts/engine modifié
```

CI (GitHub Actions) : vérifier `gh run list` après push — tous les jobs doivent être `success`.

## Claims et preuves requises

| Claim | Preuve requise |
|---|---|
| « les tests passent » | sortie des commandes ci-dessus, 0 échec |
| « le bug est fixed » | le test/symptôme d'origine passe maintenant |
| « le build est OK » | `validate.js` + build TS à jour (octets identiques) |
| « c'est pushé et en ligne » | `git push` OK + Pages deploy success + run CI green |
| « l'UI est bonne » | capture (scripts/shots.js) ou e2e, pas « ça a l'air bien » |

## Red flags — STOP
« should », « probably », « semble bon », satisfaction avant vérification, push sans avoir lancé les commandes, faire confiance à un rapport d'agent sans diff VCS.
