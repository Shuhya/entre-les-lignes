---
name: release-etl
description: Use before ANY push of code/assets to main in this repo. The exact release workflow: bump version, rebuild, validate, test, push, verify CI.
---

# Release « Entre les lignes » — workflow exact

Dylan pousse directement sur `main` à chaque demande. **Ordre obligatoire :**

```bash
# 1. Bump de version (JAMAIS oublier — sinon F5 périmé à cause du cache SW)
node scripts/bump-version.js <x.y> "message du changelog"
#    → met à jour VER (ts/engine/16-sauvegarde.ts), tous les ?v= (HTML),
#      le CACHE du service worker (sw.js), et CHANGELOG.md

# 2. Régénérer le moteur si ts/ a changé
node scripts/build-engine-from-ts.js --write

# 3. Preuves (voir verification-before-completion)
node scripts/validate.js
node scripts/typecheck-engine.js
node scripts/test-menu.js && node scripts/test-save.js && node scripts/smoke_ch2.js
ROUTE=a node scripts/smoke.js && ROUTE=b node scripts/smoke.js

# 4. Commit + push main
git add -A && git commit -m "v<x.y> — <résumé>" && git push origin main

# 5. Vérifier la CI et le déploiement
sleep 60 && gh run list --repo Shuhya/entre-les-lignes --limit 1
gh api repos/Shuhya/entre-les-lignes/commits/HEAD/check-runs --jq '.check_runs[] | "\(.name): \(.conclusion)"'
```

## Règles
- Changement **docs/skills uniquement** (`.claude/`, `*.md` hors runtime) → pas de bump de version nécessaire.
- Changement **code/assets servis** (js/css/html/images) → bump **obligatoire** (sinon le SW sert l'ancien cache en F5).
- Ne jamais force-push main. Ne jamais merger de PR (le bac à sable bloque les fusions) : push direct.
- Toujours vérifier que la CI est verte après le push ; si un job est rouge, corriger avant toute autre tâche.
