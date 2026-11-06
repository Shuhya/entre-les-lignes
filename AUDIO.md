# AUDIO — voix des appels (ElevenLabs) — v2.238

## Pourquoi le compte gratuit bloque
- **Licence non commerciale** : le tier gratuit ElevenLabs interdit tout usage commercial (un jeu distribué, même gratuit avec pub/ventes, compte). → il faut au minimum le plan **Creator** (licence commerciale incluse).
- **Voice cloning (ICV) et Voice Design avancé** : réservés aux plans payants (Creator+ / Pro selon features).
- **Crédits** : ~10 000 crédits/mois gratuits ; 1 crédit ≈ 1 caractère. Les 4 appels du jeu ≈ 29 lignes ≈ ~2 500 caractères → OK même en gratuit pour TESTER, mais la licence reste le bloqueur pour publier.

## Quelle voix prendre / créer
Deux personnages à sonoriser (voir `assets/audio/CALLS.csv`) : **Cora** (« C. », appel chiffré) et **Riffaud** (appel entrant).
- **Recommandé : Voice Design (v3)** — créer 2 voix custom, 100 % reproductibles :
  - Cora : jeune femme, 25–35 ans, voix basse et rapide, tendue, pas méchante. Prompt : « young French woman, low-pitched fast voice, tense, whispery, urgent, not villainous » + 2–3 échantillons de référence (20–30 s de parole française expressive).
  - Riffaud : homme 45–60 ans, voix posée, méticuleuse, menaçante calme. Prompt : « middle-aged French man, calm deep voice, precise, quietly threatening ».
- Alternative moins chère : choisir 2 voix dans la **bibliothèque** ElevenLabs (filtrer French, « dramatic »), et les marquer en « professional »/ajouter à ta collection.
- Ne clone aucune voix de personne réelle sans consentement.

## Réglages de génération (par ligne)
- Modèle : **eleven_v3** (alpha) si dispo sur ton plan, sinon **eleven_multilingual_v2** (plus stable).
- Stability ~**0.35–0.5** (émotion), Similarity boost ~**0.8**, Style ~**0.4**, Speaker boost **ON**.
- Audio tags pour le jeu : `[whispers]`, `[sighs]`, `[hesitates]`, pauses `…` — teste sur téléphone (haut-parleur mono).
- **Quoi générer** : uniquement les lignes `replique` (type 1) du CSV — les `didascalie` (0) peuvent rester narrées texte seul, les `choix` (2) ne se disent jamais.
- Export API : `output_format=mp3_22050_32` (22 kHz / 32 kbps — parfait pour de la voix téléphonique, ~4× plus léger). Normalisation loudness auto (payant) ou -16 LUFS via ffmpeg : `ffmpeg -i in.mp3 -af loudnorm=I=-16 -ar 22050 -ac 1 out.mp3`.
- Nommage : `assets/audio/calls/<voix>-<node>-<idx>.mp3` (déjà dans le CSV).

## Intégration dans le jeu
1. Déposer les mp3 dans `assets/audio/calls/`.
2. `js/assets.js` : `VOICES={"C.":"assets/audio/calls/cora.mp3","Riffaud":"assets/audio/calls/riffaud.mp3"}` — déjà en place en squelette (chemin = extrait/sonnerie de la voix pendant l'appel ; si le fichier manque, le moteur retombe sur les bips).
3. Les assets non versionnés sont servis en stale-while-revalidate par `sw.js` → recharge auto. **Ne pas** les ajouter au `PRE` tant qu'ils n'existent pas (addAll est atomique : un 404 casserait tout le precache).
4. Prologue narré : poser un fichier et le référencer via `audio:` dans `STORIES` (ts/story.ts), joué par `proPlay`.
5. Test : `node scripts/validate.js` + playtest section 4 de `PLAYTEST.md`.

## Coût estimé
29 lignes ≈ 2,5–3 k crédits → gratuit pour tester ; pour publier : plan Creator (licence commerciale) à partir de ~5 $/mois.
