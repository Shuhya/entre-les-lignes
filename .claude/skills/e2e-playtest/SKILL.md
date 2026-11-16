---
name: e2e-playtest
description: Use to run the automated e2e/smoke suite or a manual playtest of Entre les lignes before any release.
---

# E2E & Playtest — Entre les lignes

## Tests automatisés locaux (Node, sans navigateur)

```bash
node scripts/validate.js          # structure, miroirs, versions
node scripts/test-menu.js         # menu chapitres (déroulant #chapSel, actes)
node scripts/test-save.js         # sauvegarde, reprise, export/import
node scripts/smoke_ch2.js         # chapitre 2 : actes I/II/III, 3 scénarios
ROUTE=a node scripts/smoke.js     # chapitre 1, fin h11p
ROUTE=b node scripts/smoke.js     # chapitre 1, fin h11w
```

## Vrai navigateur (CI uniquement ici — chromium non installable dans le bac à sable)

```bash
node scripts/e2e.js               # parcours complet : menu → chapitre → acte → nameGate → choix → bulle
node scripts/e2e-chaos.js         # clics aléatoires : aucun blocage, aucune erreur page
node scripts/shots.js             # captures demo-shots/
```

En CI ces jobs tournent à chaque push (`.github/workflows/ci.yml`).

## Playtest manuel (checklist, voir PLAYTEST.md)
1. Accueil → choix histoire → boot matrix → téléphone qui se construit → menu.
2. Menu chapitres : coche **Relecture** → page résumé ; décochée → déroulant chapitre → Commencer.
3. Chapitre 1 → actes → appels Cora (bips si mp3 absents) → fin avec tag format + post partageable.
4. Chapitre 2 sans ch1 → ch2pick : prénom, genre (déroulant), acte (déroulant), fin (déroulant) → Commencer.
5. Acte 3 (quai 9) : tester les 5 chemins du déroulant (Confiance totale / Froid / Menteur / Piège+police / Nuit standard).
6. F5 après déploiement : même UI que Ctrl+Shift+R (cache SW OK grâce au bump de version).
7. Offline : recharger sans réseau → le jeu démarre (SW).
