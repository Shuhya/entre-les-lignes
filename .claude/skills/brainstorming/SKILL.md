---
name: brainstorming
description: Use before designing any new story content (acte, nœud, fin, mécanique de jeu) in Entre les lignes. Spec d'abord, code ensuite.
---

# Brainstorming — nouvelles features histoire / mécaniques

Avant d'écrire UNE ligne de code ou de contenu, passer par cette phase avec Dylan.

## Déroulé
1. **Le pitch** : « Je veux ajouter X parce que Y » — prémisse en une phrase.
2. **Playback** : reformuler à Dylan et attendre sa correction. « Si je comprends bien… »
3. **Carte des choix** : quels nœuds/flags (`st.*`) sont touchés ? Quelles fins changent ? Dessiner la mini-arborescence (route commune + branchements + reconvergence — jamais de branche infinie).
4. **Ce qui rend la fin « gagnée »** : la fin doit se souvenir des choix (règle du repo : les fins lisent les flags).
5. **Plan écrit** : fichiers touchés (`ts/story.ts`, `ETL_SUM`, `ETL_FINS`, tests), ordre des étapes, critère de done.
6. **Validation Dylan** → seulement ensuite : TDD (voir `test-driven-development`).

## Règles du canon (voir aussi `story-canon`)
- Thème central du jeu : un numéro de téléphone comme clé/clé ET coffre — chaque ajout doit servir ça.
- Ton : messages WhatsApp, urgence, pluie sur Vaubris, la Larme/Mandragore/CHIMÈRE.
- Jamais de branche qui diverge sans reconvergence prévue (scope control).

## Anti-patterns
- Commencer à coder « pour voir » → non, spec d'abord.
- Ajouter une fin sans tag ETL_FINS + post → non (synchroniser `story-canon`).
- Oublier de mettre à jour `scripts/smoke_ch2.js` quand le chapitre 2 change → non.
