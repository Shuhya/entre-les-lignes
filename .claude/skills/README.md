# Skills du projet « Entre les lignes »

Skills pour agents de code (format SKILL.md, lisibles par Claude Code, Cursor, Codex…).
Ils encodent **notre** workflow réel — ne pas les remplacer par des copies auto-générées.

| Skill | Quand l'utiliser |
|---|---|
| `test-driven-development` | Toute feature/bugfix : écrire le test d'abord (RED), voir échouer, GREEN minimal |
| `systematic-debugging` | Tout bug / test en échec : 4 phases, cause racine avant tout fix |
| `verification-before-completion` | Avant toute claim de succès, commit ou push : preuve fraîche exigée |
| `brainstorming` | Nouvelle feature histoire (acte, fin, mécanique) : spec avant code |
| `release-etl` | Release/push : bump version → build → validate → tests → push main |
| `story-canon` | Toute édition de contenu narratif (ts/story.ts, ETL_SUM, ETL_FINS) |
| `e2e-playtest` | Lancer les tests e2e/smoke et le playtest manuel |

Installation agent : copier le dossier du skill dans `.claude/skills/` du projet (déjà fait ici)
ou `~/.claude/skills/` pour un usage perso. Source amont : obra/superpowers (MIT), adapté au repo.
