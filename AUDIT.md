# AUDIT — « Entre les lignes » (v2.233, 03/11/2026)

Audit de validateur de déploiement, à partir du code réel (main @ v2.233), de la CI et des captures, croisé avec les bonnes pratiques VN/UX 2026 (pacing lisible, transitions douces,Lisibilité, reduced-motion).

## Verdict global
**GO avec réserves** pour une sortie « chapitres 1–3 + actes I–III du chapitre 2 ». **NO-GO** pour un lancement « jeu complet » tant que les Actes IV (q15→q19) et V (q20→q23 + 4 fins) ne sont pas écrits (contenu manquant, pas un bug).

## Points forts (validés)
- Architecture propre post-refactor : source TS unique, `js/engine.js` généré et vérifié octet/octet en CI ; découpage en 19 modules (v2.232) ; tokens CSS (v2.233, diff 0 pixel vérifié par captures).
- CI solide : valider, lint, typecheck (gate baseline 98), e2e + e2e-chaos Playwright, build-vite, deploy — 6/6 verts.
- DA verre transparent + doré cohérente (DA.md), menus allégés (v2.229), notice à jour avec vraies captures.
- Sauvegarde auto (localStorage `etl_resume_v4`) + reprise + export/import de partie ; service worker offline (network-first HTML, cache-first ?v=) ; meta/OG/Twitter/PWA/manifest/theme-color complets ; safe-area iOS ; viewport-fit.
- Accessibilité partielle : `prefers-reduced-motion` géré sur le landing et quelques overlays.

## Findings (par sévérité)

### 🔴 Bloquant (contenu)
1. **Actes IV et V absents** — le chapitre 2 s'arrête à l'Acte III. Un joueur termine ch2 sans les 3 actes restants ni les 4 fins canoniques. À écrire depuis `protos/canon-ch2-complet.md`.

### 🟠 À corriger avant sortie (UX/animation — la demande remontée)
2. **Bulles de messages trop abruptes** : `.b{animation:in .22s ease}` — fondu de 0,22 s + translateY(6px), rendu « coupé ». Proposition : `@keyframes bIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}` en `.38s cubic-bezier(.2,.8,.2,1)`, + léger stagger entre bulles d'un même nœud.
3. **Typewriter par à-coups** : `typeIn` écrit 2 caractères toutes les 12 ms. Proposition : 1 caractère / 8 ms (plus fluide, même durée totale).
4. **Transitions d'écran en fondu sec** : overlays `#ov/#vol/.rsOv/#appHome` = `animation:fo` (opacity seule, 0,25–0,6 s) ; carte menu = `fo .5s` sans mouvement. Proposition : fondu croisé via `veil()` + `translateY(8px)` sur la carte entrante ; garder `#mn` en `transition:opacity .6s` (déjà bien).
5. **Délai fixe après un choix** : `setTimeout(next,900/SPD)` — remplacer par un fondu de sortie des boutons de choix (opacity/translate 250 ms) puis next.
6. **prefers-reduced-motion incomplet** : seules `#in` et quelques overlays sont couverts. Proposition : un bloc global `@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}` (le jeu reste jouable, juste sans animation).

### 🟡 Améliorations (perf/poids)
7. **backdrop-filter blur(18px)** sur plusieurs overlays simultanés → jank possible sur mobile d'entrée de gamme. Proposition : blur 12px sur `.rsOv`, `will-change` ciblé.
8. **Poids images** : `assets/img/notice/` ≈ 1,1 Mo (4 PNG 390×780). Proposition : WebP + `loading="lazy"` sous la pliure de notice.html. `menu.jpg` 128 Ko OK (precache SW).
9. **Moteur 119 Ko en un seul fichier** servi en statique : acceptable sur Pages (gzip), mais le parse bloque le thread au chargement — OK pour l'instant, à surveiller si le moteur grossit (Actes IV/V).

### 🟢 OK / à noter
10. Sauvegarde locale uniquement (pas de compte) : documenté dans la notice + export manuel — acceptable, mais Safari privé = perte de partie ; la notice le dit.
11. Contrastes texte/fond conformes (blanc sur verre sombre), cibles tactiles ≥ 42 px, chevron retour en SVG centré.
12. `validate.js` couvre structure + miroirs + refs `?v=` ; e2e couvre parcours réel (menu → chapitre → acte → nameGate → bulles → choix).

## Propositions UI prioritaires (prêtes à appliquer)
1. Fondu+slide des bulles (`.b`) — 3 lignes de CSS.
2. Typewriter 1 car/8 ms — 1 ligne dans `typeIn`.
3. Transition carte menu avec translateY — 1 keyframe.
4. Fondu des boutons de choix avant `next()` — ~5 lignes dans le handler `b.onclick`.
5. Bloc `prefers-reduced-motion` global — 1 règle CSS.
6. WebP + lazy pour les images de la notice.

## Méthode
Code audité : `ts/engine/*` (19 sections), `css/style.css` (tokens v2.233), `jeu.html`/`index.html`/`notice.html`, `sw.js`, `scripts/*`, CI GitHub Actions (runs récents 6/6 success), captures `demo-shots`. Références externes : guides UX visual novel 2026 (pacing lisible, transitions douces, Lisibilité mobile, reduced-motion).
