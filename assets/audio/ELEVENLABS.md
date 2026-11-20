# ELEVENLABS — lignes à générer (voix des appels) — v2.246

Objectif : une voix qui **sonne téléphone et humaine** — pas une IA parfaite.
On veut entendre des « euh… », des « bon », des hésitations, des respirations.

Source : `assets/audio/CALLS.csv` (type `replique` uniquement — didascalies en texte, choix jamais dits).
Acte 3 (q9…) = WhatsApp : aucune voix pour l'instant (repli = bips TTS).

## 0. TEST d'abord (1 ligne)
Génère **uniquement** `cora-h8-1.mp3` avec la version parlée ci-dessous + réglages, écoute sur le **haut-parleur du téléphone** (pas les écouteurs), ajuste, puis batch le reste.

## 1. Voix (Voice Design v3 — reproductible)
- **Cora** — prompt : « young French woman, 25–35, low-pitched fast voice, tense, whispery, urgent, natural speech with fillers (euh, bon), hesitations and breaths, NOT a clean synthetic voice, not villainous ».
- **Riffaud** — prompt : « middle-aged French man, 45–60, calm deep voice, precise but natural, slight hesitations, quietly threatening ».
- **IMPORTANT pour le réalisme** : fournis 2–3 **vrais échantillons** (20–30 s) enregistrés sur ton téléphone avec tes propres tics de langage — la voix clonera les hésitations naturelles. Ne prends pas une voix « studio propre » de la bibliothèque.
(Alternative : voix « conversational/dramatic » French de la bibliothèque.)

## 2. Réglages communs
| Réglage | Valeur |
|---|---|
| Modèle | `eleven_v3` (alpha) sinon `eleven_multilingual_v2` |
| Stability | **0.35–0.45** (plus bas = plus d'émotion/variation humaine) |
| Similarity boost | 0.80 |
| Style | **0.30** (moins = moins « joué ») |
| Speaker boost | ON |
| Output | `mp3_22050_32` |

## 3. Post-traitement « téléphone » (obligatoire)
Simule le haut-parleur mono d'un mobile (bande 300–3400 Hz) + loudness :
```bash
ffmpeg -i in.mp3 -af "highpass=f=300,lowpass=f=3400,loudnorm=I=-16,acompressor=threshold=-20dB:ratio=3" -ar 22050 -ac 1 out.mp3
```
Tags audio v3 dans le texte : `[hesitates]`, `[sighs]`, `[breathes]`, pauses `…`.

## 4. Les 12 lignes — TEXTE PARLÉ (avec tics) à coller + prompt
> Le texte à l'écran dans le jeu reste propre (CALLS.csv) : seuls les tics sont ajoutés à la version parlée.

### `cora-h8-1.mp3` — C. (h8) — prompt: urgent, tense, whispered, with fillers and hesitations
> Euh… le quai 9, c'est un test de Mandragore, hein… le réseau derrière la Larme. Bon. Leur répondre… ça veut dire exister pour eux.

### `cora-h8-3.mp3` — C. (h8) — prompt: hushed revelation, lower on CHIMÈRE, breath before
> [breathes] Ce que Nils cachait… ça s'appelle CHIMÈRE. Deux ans d'enquête sur Mandragore… chiffrés, rattachés à ce numéro. La clé, c'est la ligne elle-même. Euh… ton téléphone, c'est la clé ET le coffre. Voilà pourquoi ils te cherchent.

### `cora-h8-5.mp3` — C. (h8) — prompt: cold, precise, final — short, no filler
> Demain, 12 h 15, square des Tanneurs. Le banc face au kiosque. Sois à l'heure.

### `cora-h8i-1.mp3` — C. (h8i) — prompt: angry, accusatory, fast, barely controlled
> D'abord… une chose. Ta réponse tout à l'heure, « personne »… c'est faux, hein, et tu le sais. Quelqu'un d'autre t'a écrit sur ce numéro… et je sais que t'as répondu. Bon. Ne me mens plus jamais. Et ce soir : garde ta porte verrouillée.

### `cora-h8i-2.mp3` — C. (h8i) — prompt: urgent, tense, whispered
> Euh… le quai 9, c'est un test de Mandragore… le réseau derrière la Larme. Leur répondre, c'est exister pour eux.

### `cora-h8i-4.mp3` — C. (h8i) — prompt: hushed revelation, lower on CHIMÈRE
> [breathes] Ce que Nils cachait… CHIMÈRE. Deux ans d'enquête… chiffrés, rattachés à ce numéro. La ligne elle-même, c'est la clé. Ton téléphone… c'est la clé et le coffre. Voilà pourquoi ils te cherchent.

### `cora-h8i-6.mp3` — C. (h8i) — prompt: cold, precise, final
> Demain, 12 h 15, square des Tanneurs. Le banc face au kiosque. Sois à l'heure.

### `cora-h8p-1.mp3` — C. (h8p) — prompt: urgent, confrontational, fast
> Bon. Tu as répondu « prise confirmée ». Écoute… le quai 9, c'est un test de Mandragore : le réseau derrière la Larme, la drogue de synthèse qui noie la ville depuis l'été. Et à 23 h 40… quelqu'un y attendra un échantillon.

### `cora-h8p-4.mp3` — C. (h8p) — prompt: hushed revelation, lower on CHIMÈRE
> [sighs] Nils cachait CHIMÈRE… deux ans d'enquête, chiffrés, sur ce numéro. La ligne, c'est la clé. Ton téléphone… c'est la clé et le coffre. Demain, 12 h 15, square des Tanneurs.

### `riffaud-q6c-1.mp3` — Riffaud (q6c) — prompt: calm, deep, polite opening that already threatens, slight pause
> Alors… [hesitates] Le quai 9, vous y avez un rendez-vous ?

### `riffaud-q6c-4.mp3` — Riffaud (q6c) — prompt: calm, measured, quietly threatening
> Trois signalements sur la Larme ce mois-ci. Trois. Tous classés. Même magistrat, les trois fois. Euh… c'est propre, ce genre de coïncidence.

### `riffaud-q6c-5.mp3` — Riffaud (q6c) — prompt: slow, ominous warning, soft voice, hard ending
> [breathes] Faites attention à qui vous faites confiance. Les gens bien informés… finissent mal, à Vaubris.

## 5. Intégration
1. mp3 dans `assets/audio/calls/` (noms du CSV).
2. `VOICES` déjà en squelette dans `js/assets.js` ; sinon repli bips.
3. Ne PAS ajouter les mp3 au precache `PRE` de `sw.js` tant qu'ils n'existent pas.
4. Test : `node scripts/validate.js` + playtest §4 de `PLAYTEST.md`.

## 6. Coût
12 lignes ≈ ~1,9 k caractères ≈ ~2 k crédits → OK en gratuit pour TESTER. Publier : plan Creator (licence commerciale) ~5 $/mois — voir `AUDIO.md`.
