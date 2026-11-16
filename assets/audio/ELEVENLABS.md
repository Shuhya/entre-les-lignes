# ELEVENLABS — lignes à générer (voix des appels) — v2.244

Source : `assets/audio/CALLS.csv` (type `replique` uniquement — les didascalies restent en texte, les choix ne se disent jamais).

Acte 3 (q9…) = WhatsApp uniquement : aucune voix à enregistrer pour l'instant (le moteur retombe sur les bips TTS).

## 0. TEST d'abord (1 ligne)

Génère **uniquement** `cora-h8-1.mp3` avec les réglages ci-dessous, écoute sur le haut-parleur du téléphone, ajuste, puis batch le reste.

## 1. Voix (Voice Design v3, 100 % reproductible)

- **Cora** — prompt : « young French woman, 25–35, low-pitched fast voice, tense, whispery, urgent, not villainous » + 2–3 échantillons de référence (20–30 s de français expressif).
- **Riffaud** — prompt : « middle-aged French man, 45–60, calm deep voice, precise, quietly threatening » + échantillons.
(Alternative moins chère : 2 voix « dramatic » French de la bibliothèque, épinglées en professional.)

## 2. Réglages communs (toutes les lignes)

| Réglage | Valeur |
|---|---|
| Modèle | `eleven_v3` (alpha) si dispo, sinon `eleven_multilingual_v2` |
| Stability | 0.40 |
| Similarity boost | 0.80 |
| Style | 0.40 |
| Speaker boost | ON |
| Output | `mp3_22050_32` (22 kHz / 32 kbps) |
| Post-traitement | `ffmpeg -i in.mp3 -af loudnorm=I=-16 -ar 22050 -ac 1 out.mp3` |

Tags audio v3 à tester : `[whispers]`, `[sighs]`, `[hesitates]`, pauses `…`.

## 3. Les 12 lignes (copier-coller le texte + prompt)


### `cora-h8-1.mp3` — C. (nœud h8)

**Prompt (direction) :** urgent, tense, whispered, fast — she is warning him mid-call

**Texte à coller :**

> Le quai 9, c'est un test de Mandragore, le réseau derrière la Larme. Leur répondre, c'est exister pour eux.


### `cora-h8-3.mp3` — C. (nœud h8)

**Prompt (direction) :** tense, hushed revelation — leaning in, lower volume on CHIMÈRE

**Texte à coller :**

> Ce que Nils cachait s'appelle CHIMÈRE : deux ans d'enquête sur Mandragore, chiffrés, rattachés à ce numéro. La clé, c'est la ligne elle-même. Ton téléphone est la clé et le coffre. Voilà pourquoi ils te cherchent.


### `cora-h8-5.mp3` — C. (nœud h8)

**Prompt (direction) :** cold, precise, final — she is giving an order, then hangs up

**Texte à coller :**

> Demain, 12 h 15, square des Tanneurs. Le banc face au kiosque. Sois à l'heure.


### `cora-h8i-1.mp3` — C. (nœud h8i)

**Prompt (direction) :** angry, accusatory, fast — she caught him lying, barely controlled

**Texte à coller :**

> D’abord, une chose : ta réponse tout à l’heure, « personne », c’est faux, et tu le sais. Quelqu’un d’autre t’a écrit sur ce numéro, et je sais que tu as répondu. Ne me mens plus jamais. Et ce soir : garde ta porte verrouillée.


### `cora-h8i-2.mp3` — C. (nœud h8i)

**Prompt (direction) :** urgent, tense, whispered, fast

**Texte à coller :**

> Le quai 9, c'est un test de Mandragore, le réseau derrière la Larme. Leur répondre, c'est exister pour eux.


### `cora-h8i-4.mp3` — C. (nœud h8i)

**Prompt (direction) :** tense, hushed revelation — lower volume on CHIMÈRE

**Texte à coller :**

> Ce que Nils cachait s'appelle CHIMÈRE : deux ans d'enquête sur Mandragore, chiffrés, rattachés à ce numéro. La clé, c'est la ligne elle-même. Ton téléphone est la clé et le coffre. Voilà pourquoi ils te cherchent.


### `cora-h8i-6.mp3` — C. (nœud h8i)

**Prompt (direction) :** cold, precise, final — order, then hang up

**Texte à coller :**

> Demain, 12 h 15, square des Tanneurs. Le banc face au kiosque. Sois à l'heure.


### `cora-h8p-1.mp3` — C. (nœud h8p)

**Prompt (direction) :** urgent, tense, fast — she opens by confronting his confirmation

**Texte à coller :**

> Tu as répondu « prise confirmée ». Le quai 9, c'est un test de Mandragore : le réseau derrière la Larme, la drogue de synthèse qui noie la ville depuis l'été. Et à 23 h 40, quelqu'un y attendra un échantillon.


### `cora-h8p-4.mp3` — C. (nœud h8p)

**Prompt (direction) :** hushed, tense revelation — lower volume on CHIMÈRE

**Texte à coller :**

> Nils cachait CHIMÈRE : deux ans d'enquête, chiffrés, rattachés à ce numéro. La clé, c'est la ligne elle-même. Ton téléphone est la clé et le coffre. Voilà pourquoi ils te cherchent. Demain, 12 h 15, square des Tanneurs.


### `riffaud-q6c-1.mp3` — Riffaud (nœud q6c)

**Prompt (direction) :** calm, deep, precise — polite opening that already threatens

**Texte à coller :**

> Alors. Le quai 9, vous y avez un rendez-vous ?


### `riffaud-q6c-4.mp3` — Riffaud (nœud q6c)

**Prompt (direction) :** calm, measured, quietly threatening — listing the sealed cases

**Texte à coller :**

> Trois signalements sur la Larme ce mois-ci. Tous classés. Même magistrat, les trois fois. C’est propre, ce genre de coïncidence.


### `riffaud-q6c-5.mp3` — Riffaud (nœud q6c)

**Prompt (direction) :** slow, ominous warning — soft voice, hard ending

**Texte à coller :**

> Faites attention à qui vous faites confiance. Les gens bien informés finissent mal, à Vaubris.


## 4. Intégration

1. Déposer les mp3 dans `assets/audio/calls/` (noms déjà prévus dans le CSV).
2. `js/assets.js` : `VOICES` déjà en squelette (`cora.mp3` / `riffaud.mp3` = extrait de sonnerie) — si fichier absent, le moteur retombe sur les bips.
3. Ne PAS ajouter les mp3 au precache `PRE` de `sw.js` tant qu'ils n'existent pas (addAll atomique).
4. Test : `node scripts/validate.js` + playtest §4 de `PLAYTEST.md`.

## 5. Coût

12 lignes ≈ 1 718 caractères ≈ ~1,7 k crédits → OK en gratuit pour TESTER. Pour publier : plan Creator (licence commerciale) ~5 $/mois — voir `AUDIO.md`.
